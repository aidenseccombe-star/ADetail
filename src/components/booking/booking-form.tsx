"use client";

import { startTransition, useActionState, useRef, useState } from "react";

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
import { addOns, baseServices, timeWindows } from "@/lib/site-config";

const PAINT_CORRECTION = "Paint Correction";

export function BookingForm({ initialTier }: { initialTier?: string }) {
  const [state, action, pending] = useActionState(createBookingRequest, undefined);
  const values = state?.values;

  const [depositRequired, setDepositRequired] = useState(
    () => values?.addOns.includes(PAINT_CORRECTION) ?? false
  );
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const depositRef = useRef<DepositPaymentHandle>(null);

  // If a previous submit attempt already confirmed the deposit with Stripe
  // but a later step (the booking insert) failed, reuse that same
  // payment intent on retry instead of charging the card again.
  const alreadyPaidIntentId = values?.paymentIntentId;

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

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="space-y-1.5">
        <Label htmlFor="serviceTier">Service</Label>
        <Select
          name="serviceTier"
          defaultValue={values?.serviceTier ?? initialTier}
          required
        >
          <SelectTrigger id="serviceTier" className="w-full">
            <SelectValue placeholder="Choose your vehicle size" />
          </SelectTrigger>
          <SelectContent>
            {baseServices.map((service) => (
              <SelectItem key={service.id} value={service.name}>
                {service.name} — {service.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-ink">Add-ons (optional)</span>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {addOns.map((addOn) => (
            <div key={addOn.name} className="flex items-center gap-2">
              <Checkbox
                id={`addon-${addOn.name}`}
                name="addOns"
                value={addOn.name}
                defaultChecked={values?.addOns.includes(addOn.name)}
                onCheckedChange={
                  addOn.name === PAINT_CORRECTION ? setDepositRequired : undefined
                }
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="preferredDate">Preferred date</Label>
          <Input
            id="preferredDate"
            name="preferredDate"
            type="date"
            defaultValue={values?.preferredDate}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preferredTime">Preferred time</Label>
          <Select name="preferredTime" defaultValue={values?.preferredTime} required>
            <SelectTrigger id="preferredTime" className="w-full">
              <SelectValue placeholder="Choose a time window" />
            </SelectTrigger>
            <SelectContent>
              {timeWindows.map((window) => (
                <SelectItem key={window} value={window}>
                  {window}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Gate codes, parking instructions, areas of concern…"
          defaultValue={values?.notes}
        />
      </div>

      {paymentError && <p className="text-sm text-destructive">{paymentError}</p>}
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
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
