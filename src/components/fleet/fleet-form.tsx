"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createFleetInquiry } from "@/lib/actions/fleet";

export function FleetForm() {
  const [state, action, pending] = useActionState(createFleetInquiry, undefined);
  const values = state?.values;

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company name</Label>
          <Input
            id="companyName"
            name="companyName"
            autoComplete="organization"
            defaultValue={values?.companyName}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contactName">Contact name</Label>
          <Input
            id="contactName"
            name="contactName"
            autoComplete="name"
            defaultValue={values?.contactName}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={values?.phone}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values?.email}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fleetInfo">Fleet size / vehicle types</Label>
        <Input
          id="fleetInfo"
          name="fleetInfo"
          placeholder="e.g. 12 sedans, or 3 RVs"
          defaultValue={values?.fleetInfo}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Tell us about your service frequency, locations, or anything else we should know"
          defaultValue={values?.notes}
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="w-full"
        disabled={pending}
      >
        {pending ? "Submitting…" : "Contact Us About Your Fleet"}
      </Button>

      <p className="text-center text-sm text-ink/60">
        We&apos;ll follow up to discuss a recurring service plan tailored to your fleet.
      </p>
    </form>
  );
}
