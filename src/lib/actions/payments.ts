"use server";

import { paintCorrectionDepositCents } from "@/lib/site-config";
import { getStripeClient } from "@/lib/stripe/server";

export async function createDepositPaymentIntent(): Promise<{
  clientSecret: string;
}> {
  const stripe = getStripeClient();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: paintCorrectionDepositCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: {
      purpose: "paint_correction_deposit",
    },
  });

  if (!paymentIntent.client_secret) {
    throw new Error("Stripe did not return a client secret for the deposit payment.");
  }

  return { clientSecret: paymentIntent.client_secret };
}
