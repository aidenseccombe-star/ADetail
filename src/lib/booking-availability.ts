// Pure scheduling logic for the booking calendar — no I/O, safe to import
// from both client components and server actions. Business hours: Mon–Sat
// 7:00 AM–5:00 PM, closed Sunday. Every booking (existing or candidate) is
// treated as occupying [start, start + duration + buffer), so two
// appointments conflict iff those ranges overlap — this keeps a 30-minute
// gap between any two consecutive jobs regardless of booking order.
//
// Date/time handling is deliberately never routed through `new Date(string)`
// (which parses as UTC and can render as the wrong local calendar day
// depending on the browser/server timezone offset) — dates are parsed and
// formatted via the local-component constructor, and comparisons are done
// on plain integers (minutes since midnight), never on Date instants.

import { addOns, legacyTierDurations, packages, vehicleTypes } from "@/lib/site-config";

export const BUSINESS_OPEN_MINUTES = 7 * 60;
export const BUSINESS_CLOSE_MINUTES = 17 * 60;
export const SLOT_INTERVAL_MINUTES = 30;
export const BUFFER_MINUTES = 30;

export type BusyBooking = {
  preferred_date: string;
  preferred_time: string;
  service_tier: string | null;
  add_ons: string[] | null;
  vehicle_type: string | null;
};

// Safest possible fallback when a service_tier can't be matched to any known
// package at all (unexpected/corrupt data) — over-block rather than risk a
// double-booking. Computed from the data itself so it can't drift out of
// sync if durations change.
const GLOBAL_MAX_DURATION_MINUTES = Math.max(
  ...packages.flatMap((pkg) => Object.values(pkg.durationMinutes))
);

export type OccupiedRange = { start: number; end: number };

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isClosedDay(date: Date): boolean {
  return date.getDay() === 0;
}

export function isPastDay(date: Date, today: Date): boolean {
  const a = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const b = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return a.getTime() < b.getTime();
}

// Returns null (rather than throwing) for anything that isn't a clean
// 24-hour "HH:MM" string — used to defensively skip legacy free-text
// preferred_time values ("Morning (7am – 10am)") written before this
// feature existed, instead of crashing on them.
export function parseTimeToMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatMinutesToDisplay(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

// Package duration now depends on BOTH the service tier and the vehicle
// type (chosen separately in the booking form), with fallbacks for every
// way that data can be incomplete or stale:
//   1. Legacy compound tier names from before vehicle type was a separate
//      field ("Full Detail — Sedan/Coupe" etc.) — resolved directly.
//   2. A known package with a known vehicle type — exact match.
//   3. A known package with a missing/unrecognized vehicle type — falls
//      back to that package's SUV/Truck duration (the longer of the two for
//      every package), so we over-block rather than double-book.
//   4. A service_tier that doesn't match anything at all — falls back to
//      the longest duration across every package, for the same reason.
function getBaseDurationMinutes(
  serviceTierName: string | null | undefined,
  vehicleTypeLabel: string | null | undefined
): number {
  if (serviceTierName && serviceTierName in legacyTierDurations) {
    return legacyTierDurations[serviceTierName as keyof typeof legacyTierDurations];
  }

  const pkg = packages.find((p) => p.name === serviceTierName);
  if (!pkg) {
    return GLOBAL_MAX_DURATION_MINUTES;
  }

  const vehicleType = vehicleTypes.find((v) => v.label === vehicleTypeLabel);
  const durations: Record<string, number> = pkg.durationMinutes;
  return (vehicleType && durations[vehicleType.id]) ?? durations["suv-truck"];
}

function getAddOnDurationMinutes(addOnNames: string[] | null | undefined): number {
  if (!addOnNames) return 0;
  return addOnNames.reduce((total, name) => {
    const addOn = addOns.find((a) => a.name === name);
    return total + (addOn?.durationMinutes ?? 0);
  }, 0);
}

// Total scheduled duration in minutes. Add-ons with no durationMinutes
// (currently only Paint Correction — see site-config.ts) contribute zero on
// purpose.
export function getTotalDurationMinutes(
  serviceTierName: string | null | undefined,
  vehicleTypeLabel: string | null | undefined,
  addOnNames: string[] | null | undefined
): number {
  return (
    getBaseDurationMinutes(serviceTierName, vehicleTypeLabel) +
    getAddOnDurationMinutes(addOnNames)
  );
}

export function isWithinBusinessHours(date: Date, timeMinutes: number, durationMinutes: number) {
  return (
    !isClosedDay(date) &&
    timeMinutes >= BUSINESS_OPEN_MINUTES &&
    timeMinutes + durationMinutes <= BUSINESS_CLOSE_MINUTES
  );
}

export function getOccupiedRanges(bookings: BusyBooking[]): OccupiedRange[] {
  return bookings
    .map((booking) => {
      const startMinutes = parseTimeToMinutes(booking.preferred_time);
      if (startMinutes === null) return null;
      const duration = getTotalDurationMinutes(
        booking.service_tier,
        booking.vehicle_type,
        booking.add_ons
      );
      if (duration <= 0) return null;
      return { start: startMinutes, end: startMinutes + duration + BUFFER_MINUTES };
    })
    .filter((range): range is OccupiedRange => range !== null);
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function rangeConflicts(
  candidateStart: number,
  candidateDurationMinutes: number,
  occupiedRanges: OccupiedRange[]
): boolean {
  const candidateEnd = candidateStart + candidateDurationMinutes + BUFFER_MINUTES;
  return occupiedRanges.some((range) => overlaps(candidateStart, candidateEnd, range.start, range.end));
}

// Available slot start times ("HH:MM", 24h) for one day, given that day's
// occupied ranges and the candidate's total duration. Durations aren't all
// 30-minute multiples (e.g. a +45min add-on), so busy-range boundaries won't
// always land on the slot grid — this does real interval-overlap math
// against each grid start rather than assuming otherwise.
export function getAvailableSlots(
  occupiedRanges: OccupiedRange[],
  durationMinutes: number,
  options: { minStartMinutes?: number } = {}
): string[] {
  if (durationMinutes <= 0) return [];

  const slots: string[] = [];

  for (
    let slotStart = BUSINESS_OPEN_MINUTES;
    slotStart + durationMinutes <= BUSINESS_CLOSE_MINUTES;
    slotStart += SLOT_INTERVAL_MINUTES
  ) {
    if (options.minStartMinutes !== undefined && slotStart <= options.minStartMinutes) {
      continue;
    }

    if (!rangeConflicts(slotStart, durationMinutes, occupiedRanges)) {
      slots.push(formatMinutesToTime(slotStart));
    }
  }

  return slots;
}
