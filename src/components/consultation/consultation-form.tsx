"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createConsultationRequest } from "@/lib/actions/consultations";

const interestOptions = [
  "Paint Correction",
  "Ceramic Coating",
  "Not sure — help me decide",
] as const;

export function ConsultationForm() {
  const [state, action, pending] = useActionState(createConsultationRequest, undefined);
  const values = state?.values;

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Name</Label>
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            defaultValue={values?.fullName}
            required
          />
        </div>
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

      <div className="space-y-1.5">
        <Label htmlFor="vehicle">Vehicle</Label>
        <Input
          id="vehicle"
          name="vehicle"
          placeholder="e.g. 2021 Toyota Camry"
          defaultValue={values?.vehicle}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="interestedIn">What are you interested in?</Label>
        <Select name="interestedIn" defaultValue={values?.interestedIn} required>
          <SelectTrigger id="interestedIn" className="w-full">
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
          <SelectContent>
            {interestOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Tell us about your vehicle's condition, any existing coating, or anything else we should know"
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
        {pending ? "Submitting…" : "Request a Consultation"}
      </Button>

      <p className="text-center text-sm text-ink/60">
        No payment or commitment — we&apos;ll follow up with a personalized quote.
      </p>
    </form>
  );
}
