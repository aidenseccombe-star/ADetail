import { Resend } from "resend";

import { siteConfig } from "@/lib/site-config";

function getResendClient(context: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      `Skipping ${context} email — RESEND_API_KEY or RESEND_FROM_EMAIL is not set.`
    );
    return null;
  }

  return { client: new Resend(apiKey), from };
}

export type BookingNotificationInput = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  vehicle: string;
  serviceTier: string;
  vehicleType: string;
  lastDetailedNote?: string;
  addOns: string[];
  preferredDate: string;
  preferredTime: string;
  notes?: string;
};

export async function sendBookingNotification(booking: BookingNotificationInput) {
  const resend = getResendClient("booking notification");
  if (!resend) return;
  const { client, from } = resend;

  const lines = [
    `Name: ${booking.fullName}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone}`,
    `Address: ${booking.address}`,
    `Vehicle: ${booking.vehicle}`,
    `Service: ${booking.serviceTier}`,
    `Vehicle type: ${booking.vehicleType}`,
    ...(booking.lastDetailedNote
      ? [`Last detailed: ${booking.lastDetailedNote}`]
      : []),
    `Add-ons: ${booking.addOns.length > 0 ? booking.addOns.join(", ") : "None"}`,
    `Preferred date: ${booking.preferredDate}`,
    `Preferred time: ${booking.preferredTime}`,
    `Notes: ${booking.notes || "—"}`,
  ];

  await client.emails.send({
    from,
    to: siteConfig.notificationsEmail,
    replyTo: [booking.email, siteConfig.contactEmail],
    subject: `New booking request — ${booking.fullName}`,
    text: lines.join("\n"),
  });
}

export type ConsultationNotificationInput = {
  fullName: string;
  email: string;
  phone: string;
  vehicle: string;
  interestedIn: string;
  notes?: string;
};

export async function sendConsultationNotification(
  consultation: ConsultationNotificationInput
) {
  const resend = getResendClient("consultation notification");
  if (!resend) return;
  const { client, from } = resend;

  const lines = [
    `Name: ${consultation.fullName}`,
    `Email: ${consultation.email}`,
    `Phone: ${consultation.phone}`,
    `Vehicle: ${consultation.vehicle}`,
    `Interested in: ${consultation.interestedIn}`,
    `Notes: ${consultation.notes || "—"}`,
  ];

  await client.emails.send({
    from,
    to: siteConfig.notificationsEmail,
    replyTo: [consultation.email, siteConfig.contactEmail],
    subject: `New paint correction / ceramic coating inquiry — ${consultation.fullName}`,
    text: lines.join("\n"),
  });
}

export type FleetInquiryNotificationInput = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  fleetInfo: string;
  notes?: string;
};

export async function sendFleetInquiryNotification(inquiry: FleetInquiryNotificationInput) {
  const resend = getResendClient("fleet inquiry notification");
  if (!resend) return;
  const { client, from } = resend;

  const lines = [
    `Company: ${inquiry.companyName}`,
    `Contact: ${inquiry.contactName}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    `Fleet size / vehicle types: ${inquiry.fleetInfo}`,
    `Notes: ${inquiry.notes || "—"}`,
  ];

  await client.emails.send({
    from,
    to: siteConfig.notificationsEmail,
    replyTo: [inquiry.email, siteConfig.contactEmail],
    subject: `New fleet/commercial inquiry — ${inquiry.companyName}`,
    text: lines.join("\n"),
  });
}
