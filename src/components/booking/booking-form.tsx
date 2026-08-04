"use client";

import { startTransition, useActionState, useMemo, useRef, useState } from "react";

import { AppointmentCalendar } from "@/components/booking/appointment-calendar";
import { DepositPayment, type DepositPaymentHandle } from "@/components/booking/deposit-payment";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { createBookingRequest } from "@/lib/actions/bookings";
import { getTotalDurationMinutes } from "@/lib/booking-availability";
import { addOns, packages, vehicleTypes } from "@/lib/site-config";

const PAINT_CORRECTION = "Paint Correction";

export function BookingForm({
  initialTier,
  initialAddOn,
  initialNotes,
}: {
  initialTier?: string;
  initialAddOn?: string;
  initialNotes?: string;
}) {
  const [state, action, pending] = useActionState(createBookingRequest, undefined);
  const values = state?.values;

  const [selectedTierName, setSelectedTierName] = useState<string | undefined>(
    values?.serviceTier ?? initialTier
  );
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | undefined>(
    values?.vehicleType
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(
    () => values?.addOns ?? (initialAddOn ? [initialAddOn] : [])
  );
  const [preferredDate, setPreferredDate] = useState<string | null>(
    values?.preferredDate ?? null
  );
  const [preferredTime, setPreferredTime] = useState<string | null>(
    values?.preferredTime ?? null
  );

  const depositRequired = selectedAddOns.includes(PAINT_CORRECTION);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const depositRef = useRef<DepositPaymentHandle>(null);

  // If a previous submit attempt already confirmed the deposit with Stripe
  // but a later step (the booking insert) failed, reuse that same
  // payment intent on retry instead of charging the card again.
  const alreadyPaidIntentId = values?.paymentIntentId;

  const selectedPackage = packages.find((pkg) => pkg.name === selectedTierName);
  const isMaintenanceWash = selectedPackage?.id === "maintenance-wash";

  const durationMinutes = useMemo(
    () => getTotalDurationMinutes(selectedTierName, selectedVehicleType, selectedAddOns),
    [selectedTierName, selectedVehicleType, selectedAddOns]
  );

  function toggleAddOn(name: string, checked: boolean) {
    setSelectedAddOns((prev) => (checked ? [...prev, name] : prev.filter((n) => n !== name)));
  }

  async function handleSubmit(formData: FormData) {
    setPaymentError(null);

    if (depositRequired) {
      if (alreadyPaidIntentId) {
        formData.set("paymentIntentId", alreadyPaidIntentId);
      } else {
        setConfirmingPayment(true);
        const result = await depositRef.current?.confirm();
        setConfirmingPayment(false);

        if (!result || result.error) {
          setPaymentError(
            result?.error ?? "Payment form isn't ready yet. Please try again."
          );
          return;
        }

        formData.set("paymentIntentId", result.paymentIntentId ?? "");
      }
    }

    startTransition(() => {
      action(formData);
    });
  }

  const isSubmitting = pending || confirmingPayment;
  const canSubmit = Boolean(
    selectedTierName && selectedVehicleType && preferredDate && preferredTime
  );

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="space-y-1.5">
        <Label htmlFor="serviceTier">Service</Label>
        <Select
          name="serviceTier"
          value={selectedTierName ?? ""}
          onValueChange={(value) => setSelectedTierName(value as string)}
          required
        >
          <SelectTrigger id="serviceTier" className="w-full">
            <SelectValue placeholder="Choose a package" />
          </SelectTrigger>
          <SelectContent>
            {packages.map((pkg) => (
              <SelectItem key={pkg.id} value={pkg.name}>
                {pkg.name} — {pkg.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="vehicleType">Vehicle type</Label>
        <Select
          name="vehicleType"
          value={selectedVehicleType ?? ""}
          onValueChange={(value) => setSelectedVehicleType(value as string)}
          required
        >
          <SelectTrigger id="vehicleType" className="w-full">
            <SelectValue placeholder="Choose your vehicle type" />
          </SelectTrigger>
          <SelectContent>
            {vehicleTypes.map((type) => (
              <SelectItem key={type.id} value={type.label}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isMaintenanceWash && (
        <div className="space-y-1.5">
          <Label htmlFor="lastDetailedNote">When did we last detail this vehicle?</Label>
          <Input
            id="lastDetailedNote"
            name="lastDetailedNote"
            placeholder="e.g. Full Detail on July 12th"
            defaultValue={values?.lastDetailedNote}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <span className="text-sm font-medium text-ink">Add-ons (optional)</span>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {addOns.map((addOn) => (
            <div key={addOn.name} className="flex items-center gap-2">
              <Checkbox
                id={`addon-${addOn.name}`}
                name="addOns"
                value={addOn.name}
                checked={selectedAddOns.includes(addOn.name)}
                onCheckedChange={(checked) => toggleAddOn(addOn.name, checked === true)}
              />
              <Label htmlFor={`addon-${addOn.name}`} className="font-normal text-ink/80">
                {addOn.name}
                {"requiresDeposit" in addOn && addOn.requiresDeposit && (
                  <span className="ml-1.5 text-xs text-ink/40">(50% deposit)</span>
                )}
              </Label>
            </div>
          ))}
        </div>

        {depositRequired && !alreadyPaidIntentId && <DepositPayment ref={depositRef} />}
        {depositRequired && alreadyPaidIntentId && (
          <p className="rounded-lg border border-brand/30 p-4 text-sm text-ink/60">
            Your Paint Correction deposit has already been paid — just resubmit to finish
            your request.
          </p>
        )}
      </div>

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
        <Label htmlFor="address">Service address</Label>
        <Input
          id="address"
          name="address"
          autoComplete="street-address"
          placeholder="Where should we come detail your car?"
          defaultValue={values?.address}
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
        <Label>Preferred date &amp; time</Label>
        {selectedTierName && selectedVehicleType ? (
          <div className="rounded-lg border border-ink/10 p-4">
            <AppointmentCalendar
              durationMinutes={durationMinutes}
              initialDate={preferredDate ?? undefined}
              initialTime={preferredTime ?? undefined}
              onChange={(date, time) => {
                setPreferredDate(date);
                setPreferredTime(time);
              }}
            />
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-ink/15 p-4 text-sm text-ink/50">
            Choose a service and vehicle type above to see available times.
          </p>
        )}
        <input type="hidden" name="preferredDate" value={preferredDate ?? ""} />
        <input type="hidden" name="preferredTime" value={preferredTime ?? ""} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Gate codes, parking instructions, areas of concern…"
          defaultValue={values?.notes ?? initialNotes}
        />
      </div>

      {paymentError && <p className="text-sm text-destructive">{paymentError}</p>}
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="w-full"
        disabled={isSubmitting || !canSubmit}
      >
        {confirmingPayment
          ? "Processing payment…"
          : pending
            ? "Submitting…"
            : "Request Booking"}
      </Button>

      <p className="text-center text-sm text-ink/60">
        This is a request, not a confirmed appointment — we&apos;ll call or text to
        confirm your time.
      </p>
    </form>
  );
}
