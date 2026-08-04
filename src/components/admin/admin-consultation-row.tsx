"use client";

import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateConsultationStatus, type ConsultationStatus } from "@/lib/actions/admin";

export type AdminConsultation = {
  id: string;
  created_at: string;
  status: ConsultationStatus;
  full_name: string;
  email: string;
  phone: string;
  vehicle: string;
  interested_in: string | null;
  notes: string | null;
};

const statusVariant = {
  pending: "secondary",
  contacted: "default",
  closed: "outline",
} as const;

export function AdminConsultationRow({ consultation }: { consultation: AdminConsultation }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function setStatus(status: ConsultationStatus) {
    setError(null);
    startTransition(async () => {
      try {
        await updateConsultationStatus(consultation.id, status);
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
            {consultation.full_name} — {consultation.vehicle}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {consultation.email} · {consultation.phone}
          </p>
          {consultation.interested_in && (
            <p className="mt-1 text-sm text-ink/60">
              Interested in: {consultation.interested_in}
            </p>
          )}
          {consultation.notes && (
            <p className="mt-1 text-sm text-ink/60">Notes: {consultation.notes}</p>
          )}
        </div>
        <Badge variant={statusVariant[consultation.status]} className="shrink-0 capitalize">
          {consultation.status}
        </Badge>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <div className="mt-3 flex gap-2">
        {consultation.status === "pending" && (
          <Button
            size="sm"
            variant="brand"
            disabled={isPending}
            onClick={() => setStatus("contacted")}
          >
            Mark Contacted
          </Button>
        )}
        {consultation.status === "contacted" && (
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => setStatus("closed")}
          >
            Close
          </Button>
        )}
      </div>
    </li>
  );
}
