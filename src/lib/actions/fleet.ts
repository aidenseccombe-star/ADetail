"use server";

import { redirect } from "next/navigation";

import { sendFleetInquiryNotification } from "@/lib/email/resend";
import { createClient } from "@/lib/supabase/server";

export type FleetFormValues = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  fleetInfo: string;
  notes: string;
};

export type FleetActionState = { error: string; values: FleetFormValues } | undefined;

export async function createFleetInquiry(
  _prevState: FleetActionState,
  formData: FormData
): Promise<FleetActionState> {
  const values: FleetFormValues = {
    companyName: String(formData.get("companyName") ?? "").trim(),
    contactName: String(formData.get("contactName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    fleetInfo: String(formData.get("fleetInfo") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };

  if (
    !values.companyName ||
    !values.contactName ||
    !values.email ||
    !values.phone ||
    !values.fleetInfo
  ) {
    return { error: "Please fill in all required fields.", values };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("fleet_inquiries").insert({
    user_id: user?.id ?? null,
    company_name: values.companyName,
    contact_name: values.contactName,
    email: values.email,
    phone: values.phone,
    fleet_info: values.fleetInfo,
    notes: values.notes || null,
  });

  if (error) {
    console.error("Failed to insert fleet inquiry", error);
    return {
      error: "Something went wrong submitting your request. Please try again.",
      values,
    };
  }

  try {
    await sendFleetInquiryNotification(values);
  } catch (emailError) {
    console.error("Failed to send fleet inquiry notification email", emailError);
  }

  redirect("/fleet/confirmed");
}
