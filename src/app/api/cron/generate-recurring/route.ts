import { NextRequest, NextResponse } from "next/server";

import { createCalendarEvent } from "@/lib/google/calendar";
import { businessTimeZone } from "@/lib/site-config";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

// Always runs at request time — reads the current date/time, hits Supabase,
// and its output must never be cached.
export const dynamic = "force-dynamic";

const TIME_ZONE = businessTimeZone;
const WINDOW_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

type RecurringSchedule = {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  address: string;
  vehicle: string;
  service_type: string;
  vehicle_type: string | null;
  interval_weeks: number;
  day_of_week: number;
  start_time: string;
  duration_minutes: number;
  price_cents: number;
  start_date: string;
  end_date: string | null;
  status: string;
  notes: string | null;
};

type Blackout = {
  start_at: string;
  end_at: string;
};

type InsertedBookingRow = {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  service_tier: string;
  vehicle_type: string | null;
  preferred_date: string;
  preferred_time: string;
  duration_minutes: number;
};

type GeneratedRow = {
  recurrence_id: string;
  recurrence_date: string;
  source: "recurring";
  status: "confirmed";
  full_name: string;
  email: string;
  phone: string;
  address: string;
  vehicle: string;
  service_tier: string;
  vehicle_type: string | null;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  duration_minutes: number;
  price_cents: number;
};

// All date/time helpers below do their math on UTC-noon anchors
// (Date.UTC(y, m, d, 12)) rather than local `new Date()` arithmetic, per the
// invariant this route depends on: local arithmetic shifts across a DST
// transition and can silently move a job by a day. Noon UTC is never close
// enough to midnight in any real-world offset to cross into an adjacent
// calendar date.

function formatInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const lookup: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") lookup[part.type] = part.value;
  }

  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour),
    minute: Number(lookup.minute),
    second: Number(lookup.second),
  };
}

// Minutes to add to an instant's own UTC clock reading to get its wall-clock
// reading in `timeZone` (e.g. -420 during PDT, -480 during PST) — recomputed
// from the actual instant every time, never hardcoded, so it's correct on
// both sides of a DST transition.
function getOffsetMinutes(instant: Date, timeZone: string): number {
  const p = formatInTimeZone(instant, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return (asUtc - instant.getTime()) / 60000;
}

// Converts a wall-clock date + time as observed in `timeZone` into the
// correct UTC instant. Two passes: the first pass's offset can be wrong if
// the naive guess lands on the other side of a DST transition from the real
// answer, so the second pass re-derives the offset from the corrected guess.
function zonedWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset1 = getOffsetMinutes(new Date(naiveUtc), timeZone);
  const guess = naiveUtc - offset1 * 60000;
  const offset2 = getOffsetMinutes(new Date(guess), timeZone);
  return new Date(naiveUtc - offset2 * 60000);
}

function todayAnchorInTimeZone(timeZone: string): number {
  const p = formatInTimeZone(new Date(), timeZone);
  return Date.UTC(p.year, p.month - 1, p.day, 12);
}

function anchorFromDateString(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Date.UTC(y, m - 1, d, 12);
}

function dateStringFromAnchor(anchor: number): string {
  return new Date(anchor).toISOString().slice(0, 10);
}

// Normalizes whatever Postgres hands back for a `time` column (seconds,
// sometimes fractional seconds) into zero-padded "HH:MM" — the exact format
// booking_requests.preferred_time is stored in and string-compared against
// elsewhere (parseTimeToMinutes in src/lib/booking-availability.ts, which
// only matches a strict two-digit "HH:MM" and silently no-ops otherwise).
function formatTimeHHMM(time: string): string {
  const [hh, mm] = time.split(":");
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
}

function generateOccurrenceAnchors(
  schedule: RecurringSchedule,
  windowStartAnchor: number,
  windowEndAnchor: number
): number[] {
  const startAnchor = anchorFromDateString(schedule.start_date);
  const endAnchor = schedule.end_date ? anchorFromDateString(schedule.end_date) : null;
  const stepMs = schedule.interval_weeks * 7 * DAY_MS;

  const startDow = new Date(startAnchor).getUTCDay();
  const daysToFirstMatch = (schedule.day_of_week - startDow + 7) % 7;
  let occurrenceAnchor = startAnchor + daysToFirstMatch * DAY_MS;

  // Jump forward in whole intervals instead of looping day-by-day — a
  // schedule with a start_date years in the past must not walk every
  // interval between then and now.
  if (occurrenceAnchor < windowStartAnchor) {
    const stepsNeeded = Math.ceil((windowStartAnchor - occurrenceAnchor) / stepMs);
    occurrenceAnchor += stepsNeeded * stepMs;
  }

  const anchors: number[] = [];
  while (occurrenceAnchor <= windowEndAnchor) {
    if (endAnchor !== null && occurrenceAnchor > endAnchor) break;
    anchors.push(occurrenceAnchor);
    occurrenceAnchor += stepMs;
  }
  return anchors;
}

function overlapsAnyBlackout(jobStart: Date, jobEnd: Date, blackouts: Blackout[]): boolean {
  return blackouts.some((blackout) => {
    const blackoutStart = new Date(blackout.start_at);
    const blackoutEnd = new Date(blackout.end_at);
    return jobStart < blackoutEnd && blackoutStart < jobEnd;
  });
}

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return request.headers.get("authorization") === `Bearer ${expected}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get("dryRun") === "true";
  const supabase = createServiceRoleClient();

  const windowStartAnchor = todayAnchorInTimeZone(TIME_ZONE);
  const windowEndAnchor = windowStartAnchor + WINDOW_DAYS * DAY_MS;

  const { data: schedules, error: schedulesError } = await supabase
    .from("recurring_schedules")
    .select("*")
    .eq("status", "active");

  if (schedulesError) {
    console.error("generate-recurring: failed to load recurring_schedules", schedulesError);
    return NextResponse.json({ error: "Failed to load recurring schedules" }, { status: 500 });
  }

  const { data: blackouts, error: blackoutsError } = await supabase
    .from("blackouts")
    .select("start_at, end_at");

  if (blackoutsError) {
    console.error("generate-recurring: failed to load blackouts", blackoutsError);
    return NextResponse.json({ error: "Failed to load blackouts" }, { status: 500 });
  }

  let occurrencesConsidered = 0;
  let skippedBlackout = 0;
  const candidateRows: GeneratedRow[] = [];
  // Debug detail only ever populated/returned when dryRun is true — the real
  // cron response stays exactly { schedulesProcessed, occurrencesConsidered,
  // created, skippedBlackout, skippedExisting } with no per-row payload.
  const occurrenceDetails: {
    key: string;
    clientName: string;
    date: string;
    dayOfWeek: string;
    status: "created" | "skippedBlackout" | "skippedExisting";
  }[] = [];
  const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (const schedule of (schedules ?? []) as RecurringSchedule[]) {
    const anchors = generateOccurrenceAnchors(schedule, windowStartAnchor, windowEndAnchor);
    occurrencesConsidered += anchors.length;

    const [startHour, startMinute] = schedule.start_time.split(":").map(Number);

    for (const anchor of anchors) {
      const anchorDate = new Date(anchor);
      const dateStr = dateStringFromAnchor(anchor);
      const dayOfWeek = WEEKDAY_NAMES[anchorDate.getUTCDay()];

      const jobStart = zonedWallTimeToUtc(
        anchorDate.getUTCFullYear(),
        anchorDate.getUTCMonth() + 1,
        anchorDate.getUTCDate(),
        startHour,
        startMinute,
        TIME_ZONE
      );
      const jobEnd = new Date(jobStart.getTime() + schedule.duration_minutes * 60000);

      const key = `${schedule.id}|${dateStr}`;

      if (overlapsAnyBlackout(jobStart, jobEnd, (blackouts ?? []) as Blackout[])) {
        skippedBlackout += 1;
        if (dryRun) {
          occurrenceDetails.push({
            key,
            clientName: schedule.client_name,
            date: dateStr,
            dayOfWeek,
            status: "skippedBlackout",
          });
        }
        continue;
      }

      if (dryRun) {
        occurrenceDetails.push({
          key,
          clientName: schedule.client_name,
          date: dateStr,
          dayOfWeek,
          status: "created",
        });
      }

      candidateRows.push({
        recurrence_id: schedule.id,
        recurrence_date: dateStr,
        source: "recurring",
        status: "confirmed",
        full_name: schedule.client_name,
        email: schedule.client_email,
        phone: schedule.client_phone,
        address: schedule.address,
        vehicle: schedule.vehicle,
        service_tier: schedule.service_type,
        vehicle_type: schedule.vehicle_type,
        preferred_date: dateStr,
        preferred_time: formatTimeHHMM(schedule.start_time),
        notes: schedule.notes,
        duration_minutes: schedule.duration_minutes,
        price_cents: schedule.price_cents,
      });
    }
  }

  let created = 0;
  let skippedExisting = 0;

  if (candidateRows.length > 0) {
    if (dryRun) {
      // Never write in dry-run mode — instead, read back which candidates
      // already exist so the reported counts still reflect reality.
      const scheduleIds = [...new Set(candidateRows.map((row) => row.recurrence_id))];
      const { data: existing, error: existingError } = await supabase
        .from("booking_requests")
        .select("recurrence_id, recurrence_date")
        .in("recurrence_id", scheduleIds);

      if (existingError) {
        console.error("generate-recurring: failed to check existing bookings", existingError);
        return NextResponse.json(
          { error: "Failed to check existing bookings" },
          { status: 500 }
        );
      }

      const existingKeys = new Set(
        (existing ?? []).map((row) => `${row.recurrence_id}|${row.recurrence_date}`)
      );

      for (const row of candidateRows) {
        const key = `${row.recurrence_id}|${row.recurrence_date}`;
        if (existingKeys.has(key)) {
          skippedExisting += 1;
          const detail = occurrenceDetails.find((d) => d.key === key);
          if (detail) detail.status = "skippedExisting";
        } else {
          created += 1;
        }
      }
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("booking_requests")
        .upsert(candidateRows, {
          onConflict: "recurrence_id,recurrence_date",
          ignoreDuplicates: true,
        })
        .select(
          "id, full_name, phone, address, service_tier, vehicle_type, preferred_date, preferred_time, duration_minutes"
        )
        .returns<InsertedBookingRow[]>();

      if (insertError) {
        console.error("generate-recurring: failed to insert bookings", insertError);
        return NextResponse.json({ error: "Failed to insert bookings" }, { status: 500 });
      }

      created = inserted?.length ?? 0;
      skippedExisting = candidateRows.length - created;

      // One Calendar failure must never stop the rest of this run or fail
      // the cron — the booking rows are already safely saved either way.
      for (const row of inserted ?? []) {
        try {
          const eventId = await createCalendarEvent({
            serviceTier: row.service_tier,
            vehicleType: row.vehicle_type,
            customerName: row.full_name,
            phone: row.phone,
            address: row.address,
            date: row.preferred_date,
            time: row.preferred_time,
            durationMinutes: row.duration_minutes,
          });

          const { error: eventIdError } = await supabase
            .from("booking_requests")
            .update({ google_event_id: eventId })
            .eq("id", row.id);

          if (eventIdError) {
            console.error(
              "generate-recurring: failed to store Google Calendar event id",
              eventIdError
            );
          }
        } catch (calendarError) {
          console.error("generate-recurring: failed to create Google Calendar event", calendarError);
        }
      }
    }
  }

  const summary = {
    schedulesProcessed: schedules?.length ?? 0,
    occurrencesConsidered,
    created,
    skippedBlackout,
    skippedExisting,
  };

  console.log("generate-recurring", dryRun ? "(dry run)" : "(applied)", summary);

  if (dryRun) {
    const occurrences = occurrenceDetails
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(({ clientName, date, dayOfWeek, status }) => ({ clientName, date, dayOfWeek, status }));
    return NextResponse.json({ dryRun: true, ...summary, occurrences });
  }

  return NextResponse.json(summary);
}
