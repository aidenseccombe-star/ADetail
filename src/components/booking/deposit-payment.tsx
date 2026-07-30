"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { createDepositPaymentIntent } from "@/lib/actions/payments";
import { paintCorrectionDepositCents } from "@/lib/site-config";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

const depositDollars = (paintCorrectionDepositCents / 100).toFixed(2);

export type DepositPaymentHandle = {
  confirm: () => Promise<{ paymentIntentId?: string; error?: string }>;
};

export const DepositPayment = forwardRef<DepositPaymentHandle>(function DepositPayment(
  _props,
  ref
) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    createDepositPaymentIntent()
      .then((result) => {
        if (!cancelled) setClientSecret(result.clientSecret);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("Couldn't set up the payment form. Please refresh and try again.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-3 rounded-lg border border-brand/30 p-4">
      <div>
        <p className="text-sm font-medium text-ink">Paint Correction deposit</p>
        <p className="mt-1 text-sm text-ink/60">
          ${depositDollars} due now to secure your booking —{" "}
          <span className="font-medium text-ink">non-refundable</span>. The remaining
          balance is due after service.
        </p>
      </div>

      {loadError && <p className="text-sm text-destructive">{loadError}</p>}

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <DepositForm ref={ref} />
        </Elements>
      )}

      {!clientSecret && !loadError && (
        <p className="text-sm text-ink/60">Loading payment form…</p>
      )}
    </div>
  );
});

const DepositForm = forwardRef<DepositPaymentHandle>(function DepositForm(_props, ref) {
  const stripe = useStripe();
  const elements = useElements();

  useImperativeHandle(ref, () => ({
    async confirm() {
      if (!stripe || !elements) {
        return {
          error: "Payment form isn't ready yet. Please wait a moment and try again.",
        };
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        return { error: error.message ?? "Payment failed. Please try again." };
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        return { error: "Payment did not complete. Please try again." };
      }

      return { paymentIntentId: paymentIntent.id };
    },
  }));

  return <PaymentElement />;
});
