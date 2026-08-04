"use server";

import { redirect } from "next/navigation";

import { sendConsultationNotification } from "@/lib/email/resend";
import { createClient } from "@/lib/supabase/server";

export type ConsultationFormValues = {
  fullName: string;
  email: string;
  phone: string;
  vehicle: string;
  interestedIn: string;
  notes: string;
  agreedToTerms: boolean;
};

export type ConsultationActionState =
  | { error: string; values: ConsultationFormValues }
  | undefined;

export async function createConsultationRequest(
  _prevState: ConsultationActionState,
  formData: FormData
): Promise<ConsultationActionState> {
  const values: ConsultationFormValues = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    vehicle: String(formData.get("vehicle") ?? "").trim(),
    interestedIn: String(formData.get("interestedIn") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
    agreedToTerms: formData.get("agreedToTerms") === "true",
  };

  if (
    !values.fullName ||
    !values.email ||
    !values.phone ||
    !values.vehicle ||
    !values.interestedIn ||
    !values.agreedToTerms
  ) {
    return { error: "Please fill in all required fields.", values };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("consultation_requests").insert({
    user_id: user?.id ?? null,
    full_name: values.fullName,
    email: values.email,
    phone: values.phone,
    vehicle: values.vehicle,
    interested_in: values.interestedIn,
    notes: values.notes || null,
    agreed_to_terms: values.agreedToTerms,
    agreed_to_terms_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to insert consultation request", error);
    return {
      error: "Something went wrong submitting your request. Please try again.",
      values,
    };
  }

  try {
    await sendConsultationNotification(values);
  } catch (emailError) {
    console.error("Failed to send consultation notification email", emailError);
  }

  redirect("/consultation/confirmed");
}
