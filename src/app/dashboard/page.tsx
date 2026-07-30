import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/site/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | A Detail",
  robots: { index: false, follow: false },
};

type BookingRequest = {
  id: string;
  status: "pending" | "confirmed" | "declined" | "completed";
  vehicle: string;
  service_tier: string | null;
  add_ons: string[];
  preferred_date: string;
  preferred_time: string;
  deposit_amount_cents: number | null;
};

const statusVariant = {
  pending: "secondary",
  confirmed: "default",
  declined: "destructive",
  completed: "outline",
} as const;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/dashboard");
  }

  const { data: bookings } = await supabase
    .from("booking_requests")
    .select(
      "id, status, vehicle, service_tier, add_ons, preferred_date, preferred_time, deposit_amount_cents"
    )
    .eq("user_id", user.id)
    .order("preferred_date", { ascending: true })
    .returns<BookingRequest[]>();

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
        <h1 className="text-2xl font-black text-ink">Welcome, {user.email}</h1>
        <p className="mt-2 text-ink/60">Your booking requests</p>

        {!bookings || bookings.length === 0 ? (
          <p className="mt-6 text-sm text-ink/60">
            You haven&apos;t requested a booking yet.{" "}
            <Link href="/book" className="font-medium text-ink underline">
              Request one
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="flex items-center justify-between rounded-lg border border-ink/10 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {booking.vehicle}
                    {booking.service_tier && (
                      <span className="text-ink/60"> — {booking.service_tier}</span>
                    )}
                  </p>
                  <p className="text-sm text-ink/60">
                    {booking.preferred_date} · {booking.preferred_time}
                    {booking.add_ons.length > 0 && ` · ${booking.add_ons.join(", ")}`}
                  </p>
                  {booking.deposit_amount_cents !== null && (
                    <p className="mt-1 text-sm text-brand">
                      Deposit paid: ${(booking.deposit_amount_cents / 100).toFixed(2)}
                    </p>
                  )}
                </div>
                <Badge variant={statusVariant[booking.status]} className="capitalize">
                  {booking.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
