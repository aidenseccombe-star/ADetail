"use client";

import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  archiveConsultation,
  deleteConsultationPermanently,
  restoreConsultation,
  updateConsultationStatus,
  type ConsultationStatus,
} from "@/lib/actions/admin";

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
  agreed_to_terms: boolean | null;
  agreed_to_terms_at: string | null;
  archived_at: string | null;
  updated_at: string;
};

const statusVariant = {
  pending: "secondary",
  contacted: "default",
  closed: "outline",
} as const;

export function AdminConsultationRow({
  consultation,
  typeLabel,
  lastUpdated,
  trashed = false,
}: {
  consultation: AdminConsultation;
  typeLabel?: string;
  lastUpdated?: string;
  trashed?: boolean;
}) {
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

  function runAction(action: () => Promise<void>, failureMessage: string) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
      } catch (err) {
        setError(err instanceof Error ? err.message : failureMessage);
      }
    });
  }

  function handleDeletePermanently() {
    if (!window.confirm("Permanently delete this consultation request? This can't be undone.")) return;
    runAction(
      () => deleteConsultationPermanently(consultation.id),
      "Couldn't delete consultation. Please try again."
    );
  }

  return (
    <li className="rounded-lg border border-ink/10 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          {typeLabel && (
            <Badge variant="outline" className="mb-1 shrink-0">
              {typeLabel}
            </Badge>
          )}
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
          <p className="mt-1 text-sm text-ink/60">
            Agreed to terms: {consultation.agreed_to_terms ? "Yes" : "No"}
            {consultation.agreed_to_terms_at &&
              ` (${new Date(consultation.agreed_to_terms_at).toLocaleString()})`}
          </p>
          {lastUpdated && (
            <p className="mt-1 text-sm text-ink/60">Last updated: {lastUpdated}</p>
          )}
        </div>
        <Badge variant={statusVariant[consultation.status]} className="shrink-0 capitalize">
          {consultation.status}
        </Badge>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {consultation.status === "pending" && (
          <Button
            size="lg"
            variant="brand"
            disabled={isPending}
            onClick={() => setStatus("contacted")}
          >
            Mark Contacted
          </Button>
        )}
        {consultation.status === "contacted" && (
          <Button
            size="lg"
            variant="outline"
            disabled={isPending}
            onClick={() => setStatus("closed")}
          >
            Close
          </Button>
        )}
        {trashed ? (
          <>
            <Button
              size="lg"
              variant="outline"
              disabled={isPending}
              onClick={() =>
                runAction(
                  () => restoreConsultation(consultation.id),
                  "Couldn't restore consultation. Please try again."
                )
              }
            >
              Restore
            </Button>
            <Button
              size="lg"
              variant="destructive"
              disabled={isPending}
              onClick={handleDeletePermanently}
            >
              Delete Permanently
            </Button>
          </>
        ) : (
          <Button
            size="lg"
            variant="ghost"
            disabled={isPending}
            onClick={() =>
              runAction(
                () => archiveConsultation(consultation.id),
                "Couldn't archive consultation. Please try again."
              )
            }
          >
            Archive
          </Button>
        )}
      </div>
    </li>
  );
}
