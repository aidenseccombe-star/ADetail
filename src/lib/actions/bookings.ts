"use server";

import { redirect } from "next/navigation";

import {
  type BusyBooking,
  getOccupiedRanges,
  getTotalDurationMinutes,
  isWithinBusinessHours,
  parseLocalDate,
  parseTimeToMinutes,
  rangeConflicts,
} from "@/lib/booking-availability";
import { sendBookingNotification } from "@/lib/email/resend";
import { createCalendarEvent } from "@/lib/google/calendar";
import { packages, paintCorrectionDepositCents } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getStripeClient } from "@/lib/stripe/server";

export type BookingFormValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  vehicle: string;
  serviceTier: string;
  vehicleType: string;
  lastDetailedNote: string;
  addOns: string[];
  preferredDate: string;
  preferredTime: string;
  notes: string;
  agreedToTerms: boolean;
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
    vehicleType: String(formData.get("vehicleType") ?? "").trim(),
    lastDetailedNote: String(formData.get("lastDetailedNote") ?? "").trim(),
    preferredDate: String(formData.get("preferredDate") ?? "").trim(),
    preferredTime: String(formData.get("preferredTime") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
    addOns: formData.getAll("addOns").map(String),
    agreedToTerms: formData.get("agreedToTerms") === "true",
  };

  const isMaintenanceWash =
    packages.find((pkg) => pkg.name === values.serviceTier)?.id === "maintenance-wash";

  if (
    !values.fullName ||
    !values.email ||
    !values.phone ||
    !values.address ||
    !values.vehicle ||
    !values.serviceTier ||
    !values.vehicleType ||
    !values.preferredDate ||
    !values.preferredTime ||
    !values.agreedToTerms ||
    (isMaintenanceWash && !values.lastDetailedNote)
  ) {
    return { error: "Please fill in all required fields.", values };
  }

  // Re-validate the calendar invariant server-side — the calendar UI only
  // ever offers valid slots, but nothing stops a request from bypassing it,
  // so this can't be a client-only guarantee.
  const timeMinutes = parseTimeToMinutes(values.preferredTime);
  const appointmentDate = /^\d{4}-\d{2}-\d{2}$/.test(values.preferredDate)
    ? parseLocalDate(values.preferredDate)
    : null;
  const durationMinutes = getTotalDurationMinutes(
    values.serviceTier,
    values.vehicleType,
    values.addOns
  );

  if (
    timeMinutes === null ||
    !appointmentDate ||
    Number.isNaN(appointmentDate.getTime()) ||
    durationMinutes <= 0 ||
    !isWithinBusinessHours(appointmentDate, timeMinutes, durationMinutes)
  ) {
    return {
      error: "That date or time isn't available. Please pick another slot.",
      values,
    };
  }

  const availabilityClient = await createClient();
  const { data: busyRows, error: availabilityError } = await availabilityClient.rpc(
    "get_busy_slots",
    { p_start_date: values.preferredDate, p_end_date: values.preferredDate }
  );

  if (availabilityError) {
    console.error("Failed to check availability", availabilityError);
    return {
      error: "Something went wrong checking availability. Please try again.",
      values,
    };
  }

  const occupiedRanges = getOccupiedRanges((busyRows ?? []) as BusyBooking[]);
  if (rangeConflicts(timeMinutes, durationMinutes, occupiedRanges)) {
    return {
      error: "That time was just booked by someone else. Please pick another slot.",
      values,
    };
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

  const { data: insertedBooking, error } = await supabase
    .from("booking_requests")
    .insert({
      user_id: user?.id ?? null,
      full_name: values.fullName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      vehicle: values.vehicle,
      service_tier: values.serviceTier,
      vehicle_type: values.vehicleType,
      last_detailed_note: values.lastDetailedNote || null,
      add_ons: values.addOns,
      preferred_date: values.preferredDate,
      preferred_time: values.preferredTime,
      notes: values.notes || null,
      stripe_payment_intent_id: values.paymentIntentId ?? null,
      deposit_amount_cents: depositAmountCents,
      agreed_to_terms: values.agreedToTerms,
      agreed_to_terms_at: new Date().toISOString(),
    })
    .select("id")
    .single();

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

  // Never let Google being unreachable (or not yet connected) block a
  // booking that's already saved — log and move on.
  try {
    const eventId = await createCalendarEvent({
      serviceTier: values.serviceTier,
      vehicleType: values.vehicleType,
      customerName: values.fullName,
      phone: values.phone,
      address: values.address,
      date: values.preferredDate,
      time: values.preferredTime,
      durationMinutes,
    });

    const serviceRoleClient = createServiceRoleClient();
    const { error: eventIdError } = await serviceRoleClient
      .from("booking_requests")
      .update({ google_event_id: eventId })
      .eq("id", insertedBooking.id);

    if (eventIdError) {
      console.error("Failed to store Google Calendar event id", eventIdError);
    }
  } catch (calendarError) {
    console.error("Failed to create Google Calendar event", calendarError);
  }

  redirect("/book/confirmed");
}
