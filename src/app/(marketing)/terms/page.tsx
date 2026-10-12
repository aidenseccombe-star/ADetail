import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions | A Detail",
  description:
    "Terms and conditions for booking mobile detailing services with A Detail in Costa Mesa and Orange County, CA.",
  robots: { index: false, follow: true },
};

const LAST_UPDATED = "August 4, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
        Terms &amp; Conditions
      </h1>
      <p className="mt-3 text-sm text-ink/50">Last updated: {LAST_UPDATED}</p>
      <p className="mt-6 text-base text-ink/70">
        These terms apply to all services booked with A Detail. Booking a service
        means you agree to them.
      </p>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-ink">1. Services</h2>
          <p className="mt-3 text-base text-ink/70">
            A Detail is a sole proprietorship operated by Aiden Seccombe, providing
            mobile detailing performed at the client&apos;s location. Packages: Basic
            Detail, Full Detail, Signature Detail, Maintenance Wash, plus add-ons,
            Paint Correction, and Ceramic Coating. Prices shown are starting prices —
            final price depends on vehicle size and condition. Heavily soiled
            vehicles, excessive pet hair, mold, biological contaminants, or smoke
            damage may require additional charges, quoted before work begins. We
            reserve the right to decline service on vehicles in unsafe or unsanitary
            condition.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">2. Booking and Confirmation</h2>
          <p className="mt-3 text-base text-ink/70">
            Bookings are requests until confirmed by us. We confirm by email or
            text. Arrival times are estimates within a window, not exact
            appointments — traffic and prior jobs can shift timing, and we notify
            the client of significant delays.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">3. Deposits</h2>
          <p className="mt-3 text-base text-ink/70">
            Basic, Full, Signature, and Maintenance Wash require no deposit.
          </p>
          <p className="mt-3 text-base text-ink/70">
            Paint Correction and Ceramic Coating are consultation-based. No payment
            is required to request a consultation or receive a quote. Once a client
            has spoken with us and agreed to a scope and price, a 50% non-refundable
            deposit is required to hold the appointment. The deposit is applied to
            the final balance.
          </p>
          <p className="mt-3 text-base text-ink/70">
            The deposit is non-refundable if the client cancels within 24 hours of
            the appointment or does not show. If the client cancels with more than
            24 hours notice, the deposit may be transferred once to a rescheduled
            date within 60 days. If A Detail cancels for any reason, including
            weather, the deposit is fully refunded or transferred at the
            client&apos;s choice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">
            4. Cancellations, Rescheduling, and No-Shows
          </h2>
          <p className="mt-3 text-base text-ink/70">
            Free cancellation or rescheduling with 24 hours notice. Less than 24
            hours notice incurs a $65 cancellation fee.
          </p>
          <p className="mt-3 text-base text-ink/70">
            No-show: if we arrive and cannot access the vehicle, or nobody is
            available and we cannot reach the client within 15 minutes, it is
            treated as a same-day cancellation and the fee applies.
          </p>
          <p className="mt-3 text-base text-ink/70">
            Weather: A Detail may reschedule at no charge due to rain, high winds,
            extreme heat, or other unsafe conditions. That determination is made
            solely by A Detail. Weather reschedules never incur a fee and never
            forfeit a deposit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">
            5. Client Responsibilities — What We Need On Site
          </h2>
          <p className="mt-3 text-base text-ink/70">
            We bring our own water, power, and equipment. The client is responsible
            for providing:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-ink/70">
            <li>
              A legal, safe parking space for the vehicle and our work vehicle,
              large enough to open all doors and walk around the vehicle
            </li>
            <li>
              Shade or covered space where possible — direct sun in high heat can
              affect results and may require rescheduling
            </li>
            <li>Access to the vehicle, including keys if the interior is being serviced</li>
            <li>
              HOA, apartment complex, or workplace permission where required. The
              client is responsible for parking tickets, towing, or fines resulting
              from where they direct us to work
            </li>
            <li>A reachable phone number for the day of service</li>
          </ul>
          <p className="mt-3 text-base text-ink/70">
            If the location is unworkable on arrival — no legal parking, blocked
            access, unsafe conditions — and no alternative is available, it is
            treated as a same-day cancellation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">6. Personal Items</h2>
          <p className="mt-3 text-base text-ink/70">
            Please remove personal belongings before your appointment. We are not
            responsible for loss of or damage to items left in the vehicle,
            including cash, electronics, sunglasses, documents, and jewelry.
          </p>
          <p className="mt-3 text-base text-ink/70">
            Items found during service are placed in a bag and left in the
            vehicle. We do not discard personal property. Obvious trash — food
            wrappers, empty containers, receipts — is disposed of as part of
            normal service.
          </p>
          <p className="mt-3 text-base text-ink/70">
            Vehicles with excessive clutter requiring significant time to clear
            before detailing may incur an additional charge, quoted before work
            begins.
          </p>
          <p className="mt-3 text-base text-ink/70">
            Please remove child seats before your appointment. We do not remove or
            reinstall them for safety and liability reasons.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">
            7. Vehicle Condition and Pre-Existing Damage
          </h2>
          <p className="mt-3 text-base text-ink/70">
            Before beginning, we inspect the vehicle and flag any pre-existing
            conditions we notice. Clients are encouraged to point out concerns
            before we start.
          </p>
          <p className="mt-3 text-base text-ink/70">
            A Detail is not responsible for pre-existing damage or for damage
            arising from pre-existing conditions, including but not limited to:
            failing or oxidized clear coat, existing paint chips, scratches, or
            rust; loose, cracked, or previously damaged trim, emblems, or
            moldings; aftermarket parts, wraps, or paint protection film not
            professionally installed; worn, torn, cracked, or previously stained
            upholstery, leather, or carpet; non-functioning windows, locks, or
            electronics; leaks or water intrusion from failed seals; and prior
            repairs or aftermarket paint work.
          </p>
          <p className="mt-3 text-base text-ink/70">
            Normal detailing can reveal or worsen existing defects. Pressure
            washing may lift already-failing clear coat or paint. Interior
            cleaning may reveal existing stains or damage under debris. Clay bar
            and machine polishing may expose defects hidden by wax or filler
            products.
          </p>
          <p className="mt-3 text-base text-ink/70">
            Clients must inspect the vehicle and report any concerns before we
            leave the site. Claims for damage reported after we leave cannot be
            verified and will not be accepted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">8. Our Guarantee</h2>
          <p className="mt-3 text-base text-ink/70">
            If you are not satisfied with the work, contact us within 24 hours of
            service and we will return and correct it at no charge.
          </p>
          <p className="mt-3 text-base text-ink/70">
            If measurable rain falls within 48 hours of an exterior service, we
            will provide one free touch-up wash. Claims must be made within 7 days
            of the original service. Limited to one touch-up per service.
          </p>
          <p className="mt-3 text-base text-ink/70">
            The guarantee covers correcting our work. It does not cover
            pre-existing conditions, new damage or soiling occurring after
            service, or results limited by the vehicle&apos;s existing condition
            as disclosed before service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">9. Payment</h2>
          <p className="mt-3 text-base text-ink/70">
            Payment is due upon completion unless otherwise arranged. Deposits are
            collected through Stripe. We do not store card information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">10. Limitation of Liability</h2>
          <p className="mt-3 text-base text-ink/70">
            Our total liability for any claim is limited to the amount paid for
            the service in question. We are not liable for indirect, incidental,
            or consequential damages, including loss of use of the vehicle.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">11. Results</h2>
          <p className="mt-3 text-base text-ink/70">
            Detailing improves a vehicle&apos;s appearance but cannot guarantee
            removal of every defect. Deep scratches, etching, permanent stains,
            odors bonded to interior surfaces, and damage requiring paint or body
            work may not be fully correctable. Expected results are discussed
            before service where relevant.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">12. Changes to These Terms</h2>
          <p className="mt-3 text-base text-ink/70">
            We may update these terms. The version in effect at the time of your
            booking applies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink">13. Contact</h2>
          <p className="mt-3 text-base text-ink/70">
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-brand hover:underline">
              {siteConfig.contactEmail}
            </a>
          </p>
          <p className="mt-1 text-base text-ink/70">
            <a href={siteConfig.phoneHref} className="text-brand hover:underline">
              {siteConfig.phone}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
