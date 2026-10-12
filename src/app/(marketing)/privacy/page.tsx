import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy | A Detail",
  description:
    "How A Detail collects, uses, and protects your information when you book mobile detailing services in Costa Mesa and Orange County, CA.",
  robots: { index: false, follow: true },
};

const LAST_UPDATED = "August 4, 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-ink/50">Last updated: {LAST_UPDATED}</p>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-ink">1. What We Collect</h2>
          <p className="mt-3 text-base text-ink/70">
            Booking and consultation requests: name, email, phone, service
            address, vehicle type and details, preferred date and time, service
            selected, and any notes provided.
          </p>
          <p className="mt-3 text-base text-ink/70">
            Account holders: email address and authentication data through
            Supabase.
          </p>
          <p className="mt-3 text-base text-ink/70">
            Payments: processed by Stripe. We never see or store full card
            numbers.
          </p>
          <p className="mt-3 text-base text-ink/70">
            Standard technical data: IP address, browser type, pages visited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">2. How We Use It</h2>
          <p className="mt-3 text-base text-ink/70">
            To schedule and perform services, contact clients about appointments,
            send confirmations and reminders, process payments, respond to
            inquiries, and maintain service records.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">3. Text Messages</h2>
          <p className="mt-3 text-base text-ink/70">
            If a phone number is provided, we may send service-related texts
            about appointment confirmations, arrival times, and scheduling
            changes. Message and data rates may apply. Reply STOP to opt out.
            Opting out of texts does not affect service — we will contact you by
            email instead.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">4. Who We Share With</h2>
          <p className="mt-3 text-base text-ink/70">
            We do not sell personal information. We share only with service
            providers necessary to operate: Supabase (data storage), Stripe
            (payments), Resend (email), Twilio (text messages), and Vercel
            (hosting). Each processes data only to provide their service. We may
            disclose information if required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">5. Data Retention</h2>
          <p className="mt-3 text-base text-ink/70">
            Booking and service records are kept as long as necessary for
            business and tax purposes. Clients may request deletion of their
            information by emailing us, subject to legal retention requirements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">6. Your Rights</h2>
          <p className="mt-3 text-base text-ink/70">
            California residents may request access to, correction of, or
            deletion of their personal information, and may opt out of any sale
            of personal information — though we do not sell personal
            information. Requests go to{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand hover:underline">
              {siteConfig.contactEmail}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">7. Security</h2>
          <p className="mt-3 text-base text-ink/70">
            We use industry-standard measures to protect information, including
            encrypted connections and access-controlled storage. No method of
            transmission over the internet is completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">8. Children</h2>
          <p className="mt-3 text-base text-ink/70">
            Our services are not directed at children under 13 and we do not
            knowingly collect their information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">9. Changes</h2>
          <p className="mt-3 text-base text-ink/70">
            We may update this policy. The current version is always posted on
            this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">10. Contact</h2>
          <p className="mt-3 text-base text-ink/70">
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand hover:underline">
              {siteConfig.contactEmail}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
