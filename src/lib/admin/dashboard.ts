// Pure categorization logic for the /admin dashboard — no I/O. Takes the raw
// rows already fetched from Supabase (including archived ones) and buckets
// them into the sections the page renders. Kept separate from page.tsx so
// the sorting/filtering rules are easy to read and change in one place.

export function getTodayInTimeZone(timeZone: string): string {
  // en-CA formats as YYYY-MM-DD, which matches the `date` columns
  // (preferred_date) returned by Supabase exactly — safe to compare as
  // strings without parsing either side into a Date.
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}

type Archivable = { archived_at: string | null };
type Timestamped = { created_at: string };

type BookingLike = Archivable &
  Timestamped & {
    status: string;
    preferred_date: string;
    preferred_time: string;
  };

type StatusLike = Archivable & Timestamped & { status: string };

function byCreatedAtDesc<T extends Timestamped>(a: T, b: T) {
  return b.created_at.localeCompare(a.created_at);
}

export function categorizeBookings<T extends BookingLike>(
  bookings: T[],
  todayStr: string
) {
  const active = bookings.filter((b) => !b.archived_at);

  const upcoming = active
    .filter((b) => (b.status === "confirmed" || b.status === "completed") && b.preferred_date >= todayStr)
    .sort(
      (a, b) =>
        a.preferred_date.localeCompare(b.preferred_date) ||
        a.preferred_time.localeCompare(b.preferred_time)
    );

  const past = active
    .filter((b) => (b.status === "confirmed" || b.status === "completed") && b.preferred_date < todayStr)
    .sort(
      (a, b) =>
        b.preferred_date.localeCompare(a.preferred_date) ||
        b.preferred_time.localeCompare(a.preferred_time)
    );

  return {
    pending: active.filter((b) => b.status === "pending"),
    upcoming,
    past,
    declined: active.filter((b) => b.status === "declined").sort(byCreatedAtDesc),
    archived: bookings
      .filter((b) => b.archived_at)
      .sort((a, b) => (b.archived_at as string).localeCompare(a.archived_at as string)),
  };
}

export function categorizeLeads<T extends StatusLike>(rows: T[]) {
  const active = rows.filter((r) => !r.archived_at);

  return {
    pending: active.filter((r) => r.status === "pending"),
    inProgress: active.filter((r) => r.status === "contacted").sort(byCreatedAtDesc),
    closed: active.filter((r) => r.status === "closed").sort(byCreatedAtDesc),
    archived: rows
      .filter((r) => r.archived_at)
      .sort((a, b) => (b.archived_at as string).localeCompare(a.archived_at as string)),
  };
}

// Needs Attention mixes bookings (which have a real requested service date)
// with consultations/fleet inquiries (which don't). Falling back to
// created_at for the latter keeps them sorted sensibly without a date field
// that doesn't exist — YYYY-MM-DD and a full ISO timestamp compare correctly
// against each other as plain strings since both start with the same
// year-month-day ordering.
export function needsAttentionSortKey(booking: { preferred_date: string } | null, createdAt: string) {
  return booking?.preferred_date ?? createdAt;
}
