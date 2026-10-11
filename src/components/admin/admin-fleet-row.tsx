"use client";

import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  archiveFleetInquiry,
  deleteFleetInquiryPermanently,
  restoreFleetInquiry,
  updateFleetInquiryStatus,
  type FleetInquiryStatus,
} from "@/lib/actions/admin";

export type AdminFleetInquiry = {
  id: string;
  created_at: string;
  status: FleetInquiryStatus;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  fleet_info: string;
  notes: string | null;
  archived_at: string | null;
  updated_at: string;
};

const statusVariant = {
  pending: "secondary",
  contacted: "default",
  closed: "outline",
} as const;

export function AdminFleetRow({
  inquiry,
  typeLabel,
  lastUpdated,
  trashed = false,
}: {
  inquiry: AdminFleetInquiry;
  typeLabel?: string;
  lastUpdated?: string;
  trashed?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function setStatus(status: FleetInquiryStatus) {
    setError(null);
    startTransition(async () => {
      try {
        await updateFleetInquiryStatus(inquiry.id, status);
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
    if (!window.confirm("Permanently delete this fleet inquiry? This can't be undone.")) return;
    runAction(
      () => deleteFleetInquiryPermanently(inquiry.id),
      "Couldn't delete fleet inquiry. Please try again."
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
            {inquiry.company_name} — {inquiry.contact_name}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {inquiry.email} · {inquiry.phone}
          </p>
          <p className="mt-1 text-sm text-ink/60">{inquiry.fleet_info}</p>
          {inquiry.notes && <p className="mt-1 text-sm text-ink/60">Notes: {inquiry.notes}</p>}
          {lastUpdated && <p className="mt-1 text-sm text-ink/60">Last updated: {lastUpdated}</p>}
        </div>
        <Badge variant={statusVariant[inquiry.status]} className="shrink-0 capitalize">
          {inquiry.status}
        </Badge>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {inquiry.status === "pending" && (
          <Button
            size="lg"
            variant="brand"
            disabled={isPending}
            onClick={() => setStatus("contacted")}
          >
            Mark Contacted
          </Button>
        )}
        {inquiry.status === "contacted" && (
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
                  () => restoreFleetInquiry(inquiry.id),
                  "Couldn't restore fleet inquiry. Please try again."
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
                () => archiveFleetInquiry(inquiry.id),
                "Couldn't archive fleet inquiry. Please try again."
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
