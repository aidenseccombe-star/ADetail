"use client";

import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateFleetInquiryStatus, type FleetInquiryStatus } from "@/lib/actions/admin";

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
};

const statusVariant = {
  pending: "secondary",
  contacted: "default",
  closed: "outline",
} as const;

export function AdminFleetRow({ inquiry }: { inquiry: AdminFleetInquiry }) {
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

  return (
    <li className="rounded-lg border border-ink/10 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink">
            {inquiry.company_name} — {inquiry.contact_name}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {inquiry.email} · {inquiry.phone}
          </p>
          <p className="mt-1 text-sm text-ink/60">{inquiry.fleet_info}</p>
          {inquiry.notes && <p className="mt-1 text-sm text-ink/60">Notes: {inquiry.notes}</p>}
        </div>
        <Badge variant={statusVariant[inquiry.status]} className="shrink-0 capitalize">
          {inquiry.status}
        </Badge>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <div className="mt-3 flex gap-2">
        {inquiry.status === "pending" && (
          <Button
            size="sm"
            variant="brand"
            disabled={isPending}
            onClick={() => setStatus("contacted")}
          >
            Mark Contacted
          </Button>
        )}
        {inquiry.status === "contacted" && (
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
