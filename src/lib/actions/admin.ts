"use server";

import { revalidatePath } from "next/cache";

import { isAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export type BookingStatus = "pending" | "confirmed" | "declined" | "completed";
export type ConsultationStatus = "pending" | "contacted" | "closed";
export type FleetInquiryStatus = "pending" | "contacted" | "closed";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdmin(user?.email)) {
    throw new Error("Not authorized.");
  }

  return supabase;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from("booking_requests")
    .update({ status })
    .eq("id", id)
    .select("id");

  if (error) {
    throw new Error("Failed to update booking status.");
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Booking wasn't updated — this usually means the admin UPDATE policy is missing in Supabase."
    );
  }

  revalidatePath("/admin");
}

export async function updateConsultationStatus(id: string, status: ConsultationStatus) {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from("consultation_requests")
    .update({ status })
    .eq("id", id)
    .select("id");

  if (error) {
    throw new Error("Failed to update consultation status.");
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Consultation wasn't updated — this usually means the admin UPDATE policy is missing in Supabase."
    );
  }

  revalidatePath("/admin");
}

export async function updateFleetInquiryStatus(id: string, status: FleetInquiryStatus) {
  const supabase = await requireAdmin();

  const { data, error } = await supabase
    .from("fleet_inquiries")
    .update({ status })
    .eq("id", id)
    .select("id");

  if (error) {
    throw new Error("Failed to update fleet inquiry status.");
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Fleet inquiry wasn't updated — this usually means the admin UPDATE policy is missing in Supabase."
    );
  }

  revalidatePath("/admin");
}
