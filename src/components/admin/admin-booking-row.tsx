"use client";

import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateBookingStatus, type BookingStatus } from "@/lib/actions/admin";

export type AdminBooking = {
  id: string;
  created_at: string;
  status: BookingStatus;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  vehicle: string;
  service_tier: string | null;
  vehicle_type: string | null;
  last_detailed_note: string | null;
  add_ons: string[];
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  deposit_amount_cents: number | null;
  agreed_to_terms: boolean | null;
  agreed_to_terms_at: string | null;
};

const statusVariant = {
  pending: "secondary",
  confirmed: "default",
  declined: "destructive",
  completed: "outline",
} as const;

export function AdminBookingRow({ booking }: { booking: AdminBooking }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function setStatus(status: BookingStatus) {
    setError(null);
    startTransition(async () => {
      try {
        await updateBookingStatus(booking.id, status);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't update status. Please try again.");
      }
    });
  }

  return (
    <li className="rounded-lg border border-ink/10 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink">
            {booking.full_name} — {booking.vehicle}
          </p>
          {booking.service_tier && (
            <p className="mt-1 text-sm text-ink/60">
              {booking.service_tier}
              {booking.vehicle_type && ` · ${booking.vehicle_type}`}
            </p>
          )}
          <p className="mt-1 text-sm text-ink/60">
            {booking.preferred_date} · {booking.preferred_time}
            {booking.add_ons.length > 0 && ` · ${booking.add_ons.join(", ")}`}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {booking.email} · {booking.phone}
          </p>
          <p className="mt-1 text-sm text-ink/60">{booking.address}</p>
          {booking.last_detailed_note && (
            <p className="mt-1 text-sm text-ink/60">
              Last detailed: {booking.last_detailed_note}
            </p>
          )}
          {booking.notes && <p className="mt-1 text-sm text-ink/60">Notes: {booking.notes}</p>}
          {booking.deposit_amount_cents !== null && (
            <p className="mt-1 text-sm text-brand">
              Deposit paid: ${(booking.deposit_amount_cents / 100).toFixed(2)}
            </p>
          )}
          <p className="mt-1 text-sm text-ink/60">
            Agreed to terms: {booking.agreed_to_terms ? "Yes" : "No"}
            {booking.agreed_to_terms_at &&
              ` (${new Date(booking.agreed_to_terms_at).toLocaleString()})`}
          </p>
        </div>
        <Badge variant={statusVariant[booking.status]} className="shrink-0 capitalize">
          {booking.status}
        </Badge>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <div className="mt-3 flex gap-2">
        {booking.status === "pending" && (
          <>
            <Button
              size="sm"
              variant="brand"
              disabled={isPending}
              onClick={() => setStatus("confirmed")}
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => setStatus("declined")}
            >
              Decline
            </Button>
          </>
        )}
        {booking.status === "confirmed" && (
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => setStatus("completed")}
          >
            Mark Complete
          </Button>
        )}
      </div>
    </li>
  );
}
