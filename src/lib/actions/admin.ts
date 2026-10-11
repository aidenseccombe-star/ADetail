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

async function updateArchivedAt(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  table: "booking_requests" | "consultation_requests" | "fleet_inquiries",
  id: string,
  archivedAt: string | null,
  noun: string
) {
  const { data, error } = await supabase
    .from(table)
    .update({ archived_at: archivedAt })
    .eq("id", id)
    .select("id");

  if (error) {
    throw new Error(`Failed to ${archivedAt ? "archive" : "restore"} ${noun}.`);
  }

  if (!data || data.length === 0) {
    throw new Error(
      `${noun} wasn't updated — this usually means the admin UPDATE policy is missing in Supabase.`
    );
  }

  revalidatePath("/admin");
}

async function deletePermanently(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  table: "booking_requests" | "consultation_requests" | "fleet_inquiries",
  id: string,
  noun: string
) {
  const { data, error } = await supabase.from(table).delete().eq("id", id).select("id");

  if (error) {
    throw new Error(`Failed to delete ${noun}.`);
  }

  if (!data || data.length === 0) {
    throw new Error(
      `${noun} wasn't deleted — this usually means the admin DELETE policy is missing in Supabase.`
    );
  }

  revalidatePath("/admin");
}

export async function archiveBooking(id: string) {
  const supabase = await requireAdmin();
  await updateArchivedAt(supabase, "booking_requests", id, new Date().toISOString(), "Booking");
}

export async function restoreBooking(id: string) {
  const supabase = await requireAdmin();
  await updateArchivedAt(supabase, "booking_requests", id, null, "Booking");
}

export async function deleteBookingPermanently(id: string) {
  const supabase = await requireAdmin();
  await deletePermanently(supabase, "booking_requests", id, "Booking");
}

export async function archiveConsultation(id: string) {
  const supabase = await requireAdmin();
  await updateArchivedAt(
    supabase,
    "consultation_requests",
    id,
    new Date().toISOString(),
    "Consultation"
  );
}

export async function restoreConsultation(id: string) {
  const supabase = await requireAdmin();
  await updateArchivedAt(supabase, "consultation_requests", id, null, "Consultation");
}

export async function deleteConsultationPermanently(id: string) {
  const supabase = await requireAdmin();
  await deletePermanently(supabase, "consultation_requests", id, "Consultation");
}

export async function archiveFleetInquiry(id: string) {
  const supabase = await requireAdmin();
  await updateArchivedAt(supabase, "fleet_inquiries", id, new Date().toISOString(), "Fleet inquiry");
}

export async function restoreFleetInquiry(id: string) {
  const supabase = await requireAdmin();
  await updateArchivedAt(supabase, "fleet_inquiries", id, null, "Fleet inquiry");
}

export async function deleteFleetInquiryPermanently(id: string) {
  const supabase = await requireAdmin();
  await deletePermanently(supabase, "fleet_inquiries", id, "Fleet inquiry");
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
