import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminBookingRow, type AdminBooking } from "@/components/admin/admin-booking-row";
import {
  AdminConsultationRow,
  type AdminConsultation,
} from "@/components/admin/admin-consultation-row";
import { AdminFleetRow, type AdminFleetInquiry } from "@/components/admin/admin-fleet-row";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { isAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin | A Detail",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
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

  const [{ data: bookings }, { data: consultations }, { data: fleetInquiries }] =
    await Promise.all([
      supabase
        .from("booking_requests")
        .select(
          "id, created_at, status, full_name, email, phone, address, vehicle, service_tier, vehicle_type, last_detailed_note, add_ons, preferred_date, preferred_time, notes, deposit_amount_cents, agreed_to_terms, agreed_to_terms_at"
        )
        .order("created_at", { ascending: false })
        .returns<AdminBooking[]>(),
      supabase
        .from("consultation_requests")
        .select(
          "id, created_at, status, full_name, email, phone, vehicle, interested_in, notes, agreed_to_terms, agreed_to_terms_at"
        )
        .order("created_at", { ascending: false })
        .returns<AdminConsultation[]>(),
      supabase
        .from("fleet_inquiries")
        .select(
          "id, created_at, status, company_name, contact_name, email, phone, fleet_info, notes"
        )
        .order("created_at", { ascending: false })
        .returns<AdminFleetInquiry[]>(),
    ]);

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

        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink">
            Booking requests
            <span className="ml-2 text-sm font-normal text-ink/50">
              ({bookings?.length ?? 0})
            </span>
          </h2>
          {!bookings || bookings.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">No booking requests yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {bookings.map((booking) => (
                <AdminBookingRow key={booking.id} booking={booking} />
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-bold text-ink">
            Consultation requests
            <span className="ml-2 text-sm font-normal text-ink/50">
              ({consultations?.length ?? 0})
            </span>
          </h2>
          {!consultations || consultations.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">No consultation requests yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {consultations.map((consultation) => (
                <AdminConsultationRow key={consultation.id} consultation={consultation} />
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-bold text-ink">
            Fleet inquiries
            <span className="ml-2 text-sm font-normal text-ink/50">
              ({fleetInquiries?.length ?? 0})
            </span>
          </h2>
          {!fleetInquiries || fleetInquiries.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">No fleet inquiries yet.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {fleetInquiries.map((inquiry) => (
                <AdminFleetRow key={inquiry.id} inquiry={inquiry} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
