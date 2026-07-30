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
    `Add-ons: ${booking.addOns.length > 0 ? booking.addOns.join(", ") : "None"}`,
    `Preferred date: ${booking.preferredDate}`,
    `Preferred time: ${booking.preferredTime}`,
    `Notes: ${booking.notes || "—"}`,
  ];

  await client.emails.send({
    from,
    to: siteConfig.email,
    replyTo: booking.email,
    subject: `New booking request — ${booking.fullName}`,
    text: lines.join("\n"),
  });
}

export type ConsultationNotificationInput = {
  fullName: string;
  email: string;
  phone: string;
  vehicle: string;
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
    `Notes: ${consultation.notes || "—"}`,
  ];

  await client.emails.send({
    from,
    to: siteConfig.email,
    replyTo: consultation.email,
    subject: `New ceramic coating consultation — ${consultation.fullName}`,
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
    to: siteConfig.email,
    replyTo: inquiry.email,
    subject: `New fleet/commercial inquiry — ${inquiry.companyName}`,
    text: lines.join("\n"),
  });
}
