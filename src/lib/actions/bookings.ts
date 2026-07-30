"use server";

import { redirect } from "next/navigation";

import { sendBookingNotification } from "@/lib/email/resend";
import { paintCorrectionDepositCents } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe/server";

export type BookingFormValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  vehicle: string;
  serviceTier: string;
  addOns: string[];
  preferredDate: string;
  preferredTime: string;
  notes: string;
  paymentIntentId?: string;
};

export type BookingActionState =
  | { error: string; values: BookingFormValues }
  | undefined;

export async function createBookingRequest(
  _prevState: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  const submittedPaymentIntentId = String(formData.get("paymentIntentId") ?? "").trim();

  const values: BookingFormValues = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    vehicle: String(formData.get("vehicle") ?? "").trim(),
    serviceTier: String(formData.get("serviceTier") ?? "").trim(),
    preferredDate: String(formData.get("preferredDate") ?? "").trim(),
    preferredTime: String(formData.get("preferredTime") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
    addOns: formData.getAll("addOns").map(String),
  };

  if (
    !values.fullName ||
    !values.email ||
    !values.phone ||
    !values.address ||
    !values.vehicle ||
    !values.serviceTier ||
    !values.preferredDate ||
    !values.preferredTime
  ) {
    return { error: "Please fill in all required fields.", values };
  }

  let depositAmountCents: number | null = null;

  if (submittedPaymentIntentId) {
    const stripe = getStripeClient();
    const paymentIntent = await stripe.paymentIntents.retrieve(submittedPaymentIntentId);

    if (
      paymentIntent.status !== "succeeded" ||
      paymentIntent.amount !== paintCorrectionDepositCents
    ) {
      // Don't carry the payment intent forward — it wasn't verified, so a
      // retry should attempt a fresh payment rather than reuse this one.
      return {
        error: "We couldn't verify your deposit payment. Please try again.",
        values,
      };
    }

    // Verified — keep it on `values` so that if a *later* step (the insert
    // below) fails, a retry reuses this already-paid intent instead of
    // charging the card a second time.
    values.paymentIntentId = submittedPaymentIntentId;
    depositAmountCents = paymentIntent.amount;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("booking_requests").insert({
    user_id: user?.id ?? null,
    full_name: values.fullName,
    email: values.email,
    phone: values.phone,
    address: values.address,
    vehicle: values.vehicle,
    service_tier: values.serviceTier,
    add_ons: values.addOns,
    preferred_date: values.preferredDate,
    preferred_time: values.preferredTime,
    notes: values.notes || null,
    stripe_payment_intent_id: values.paymentIntentId ?? null,
    deposit_amount_cents: depositAmountCents,
  });

  if (error) {
    console.error("Failed to insert booking request", error);
    return {
      error: "Something went wrong submitting your request. Please try again.",
      values,
    };
  }

  try {
    await sendBookingNotification(values);
  } catch (emailError) {
    console.error("Failed to send booking notification email", emailError);
  }

  redirect("/book/confirmed");
}
