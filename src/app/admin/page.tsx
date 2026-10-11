import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminBookingRow, type AdminBooking } from "@/components/admin/admin-booking-row";
import {
  AdminConsultationRow,
  type AdminConsultation,
} from "@/components/admin/admin-consultation-row";
import { AdminFleetRow, type AdminFleetInquiry } from "@/components/admin/admin-fleet-row";
import { AdminSection } from "@/components/admin/admin-section";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import {
  byStalestFirst,
  categorizeBookings,
  categorizeLeads,
  formatRelativeTime,
  getTodayInTimeZone,
} from "@/lib/admin/dashboard";
import { isAdmin } from "@/lib/admin";
import { isCalendarConnected } from "@/lib/google/calendar";
import { businessTimeZone } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin | A Detail",
  robots: { index: false, follow: false },
};

type NeedsAttentionItem =
  | { kind: "booking"; data: AdminBooking; sortKey: string }
  | { kind: "consultation"; data: AdminConsultation; sortKey: string }
  | { kind: "fleet"; data: AdminFleetInquiry; sortKey: string };

type LeadItem =
  | { kind: "booking"; data: AdminBooking }
  | { kind: "consultation"; data: AdminConsultation }
  | { kind: "fleet"; data: AdminFleetInquiry };

function renderLeadRow(
  item: LeadItem,
  todayStr: string,
  trashed: boolean,
  showLastUpdated: boolean = false
) {
  if (item.kind === "booking") {
    const stale = !trashed && item.data.status === "pending" && item.data.preferred_date < todayStr;
    return (
      <AdminBookingRow
        key={item.data.id}
        booking={item.data}
        typeLabel="Booking"
        stale={stale}
        trashed={trashed}
      />
    );
  }
  if (item.kind === "consultation") {
    return (
      <AdminConsultationRow
        key={item.data.id}
        consultation={item.data}
        typeLabel="Consultation"
        lastUpdated={showLastUpdated ? formatRelativeTime(item.data.updated_at) : undefined}
        trashed={trashed}
      />
    );
  }
  return (
    <AdminFleetRow
      key={item.data.id}
      inquiry={item.data}
      typeLabel="Fleet"
      lastUpdated={showLastUpdated ? formatRelativeTime(item.data.updated_at) : undefined}
      trashed={trashed}
    />
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ calendar?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/admin");
  }

  if (!isAdmin(user.email)) {
    redirect("/");
  }

  const { calendar: calendarStatus } = await searchParams;
  const calendarConnected = await isCalendarConnected();

  const [{ data: bookings }, { data: consultations }, { data: fleetInquiries }] =
    await Promise.all([
      supabase
        .from("booking_requests")
        .select(
          "id, created_at, status, full_name, email, phone, address, vehicle, service_tier, vehicle_type, last_detailed_note, add_ons, preferred_date, preferred_time, notes, deposit_amount_cents, agreed_to_terms, agreed_to_terms_at, archived_at"
        )
        .order("created_at", { ascending: false })
        .returns<AdminBooking[]>(),
      supabase
        .from("consultation_requests")
        .select(
          "id, created_at, status, full_name, email, phone, vehicle, interested_in, notes, agreed_to_terms, agreed_to_terms_at, archived_at, updated_at"
        )
        .order("created_at", { ascending: false })
        .returns<AdminConsultation[]>(),
      supabase
        .from("fleet_inquiries")
        .select(
          "id, created_at, status, company_name, contact_name, email, phone, fleet_info, notes, archived_at, updated_at"
        )
        .order("created_at", { ascending: false })
        .returns<AdminFleetInquiry[]>(),
    ]);

  const todayStr = getTodayInTimeZone(businessTimeZone);
  const bookingBuckets = categorizeBookings(bookings ?? [], todayStr);
  const consultationBuckets = categorizeLeads(consultations ?? []);
  const fleetBuckets = categorizeLeads(fleetInquiries ?? []);

  const needsAttention: NeedsAttentionItem[] = [
    ...bookingBuckets.pending.map((data) => ({
      kind: "booking" as const,
      data,
      sortKey: data.preferred_date,
    })),
    ...consultationBuckets.pending.map((data) => ({
      kind: "consultation" as const,
      data,
      sortKey: data.created_at,
    })),
    ...fleetBuckets.pending.map((data) => ({
      kind: "fleet" as const,
      data,
      sortKey: data.created_at,
    })),
  ].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const inProgress: LeadItem[] = [
    ...consultationBuckets.inProgress.map((data) => ({ kind: "consultation" as const, data })),
    ...fleetBuckets.inProgress.map((data) => ({ kind: "fleet" as const, data })),
  ].sort((a, b) => byStalestFirst(a.data, b.data));

  const declined: LeadItem[] = [
    ...bookingBuckets.declined.map((data) => ({ kind: "booking" as const, data })),
    ...consultationBuckets.closed.map((data) => ({ kind: "consultation" as const, data })),
    ...fleetBuckets.closed.map((data) => ({ kind: "fleet" as const, data })),
  ].sort((a, b) => b.data.created_at.localeCompare(a.data.created_at));

  const trash: LeadItem[] = [
    ...bookingBuckets.archived.map((data) => ({ kind: "booking" as const, data })),
    ...consultationBuckets.archived.map((data) => ({ kind: "consultation" as const, data })),
    ...fleetBuckets.archived.map((data) => ({ kind: "fleet" as const, data })),
  ].sort((a, b) => (b.data.archived_at ?? "").localeCompare(a.data.archived_at ?? ""));

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10">
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="A Detail home">
          <Logo />
        </Link>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="lg">
            Sign out
          </Button>
        </form>
      </div>

      <div className="mt-16">
        <h1 className="text-2xl font-black text-ink">Admin</h1>

        <section className="mt-6 rounded-lg border border-ink/10 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">Google Calendar</p>
              <p className="mt-1 text-sm text-ink/60">
                {calendarConnected
                  ? "Connected — new bookings create events automatically."
                  : "Not connected — bookings aren't syncing to your calendar yet."}
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              render={<a href="/api/admin/google-calendar/connect" />}
            >
              {calendarConnected ? "Reconnect" : "Connect"}
            </Button>
          </div>
          {calendarStatus === "connected" && (
            <p className="mt-2 text-sm text-brand">Connected successfully.</p>
          )}
          {calendarStatus === "error" && (
            <p className="mt-2 text-sm text-destructive">
              Couldn&apos;t connect — please try again.
            </p>
          )}
        </section>

        <AdminSection title="Needs attention" count={needsAttention.length} alwaysOpen>
          {needsAttention.length === 0 ? (
            <p className="text-sm text-ink/60">All caught up — nothing needs attention.</p>
          ) : (
            <ul className="space-y-3">
              {needsAttention.map((item) => renderLeadRow(item, todayStr, false))}
            </ul>
          )}
        </AdminSection>

        <AdminSection title="Upcoming jobs" count={bookingBuckets.upcoming.length} defaultOpen>
          {bookingBuckets.upcoming.length === 0 ? (
            <p className="text-sm text-ink/60">No upcoming jobs.</p>
          ) : (
            <ul className="space-y-3">
              {bookingBuckets.upcoming.map((booking) => (
                <AdminBookingRow key={booking.id} booking={booking} />
              ))}
            </ul>
          )}
        </AdminSection>

        <AdminSection title="Past jobs" count={bookingBuckets.past.length}>
          {bookingBuckets.past.length === 0 ? (
            <p className="text-sm text-ink/60">No past jobs yet.</p>
          ) : (
            <ul className="space-y-3">
              {bookingBuckets.past.map((booking) => (
                <AdminBookingRow key={booking.id} booking={booking} />
              ))}
            </ul>
          )}
        </AdminSection>

        <AdminSection title="In progress" count={inProgress.length} defaultOpen>
          {inProgress.length === 0 ? (
            <p className="text-sm text-ink/60">Nothing in progress.</p>
          ) : (
            <ul className="space-y-3">
              {inProgress.map((item) => renderLeadRow(item, todayStr, false, true))}
            </ul>
          )}
        </AdminSection>

        <AdminSection title="Declined" count={declined.length}>
          {declined.length === 0 ? (
            <p className="text-sm text-ink/60">Nothing declined or closed.</p>
          ) : (
            <ul className="space-y-3">{declined.map((item) => renderLeadRow(item, todayStr, false))}</ul>
          )}
        </AdminSection>

        <AdminSection title="Trash" count={trash.length}>
          {trash.length === 0 ? (
            <p className="text-sm text-ink/60">Trash is empty.</p>
          ) : (
            <ul className="space-y-3">{trash.map((item) => renderLeadRow(item, todayStr, true))}</ul>
          )}
        </AdminSection>
      </div>
    </div>
  );
}
