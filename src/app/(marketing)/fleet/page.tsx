import type { Metadata } from "next";
import { Building2, CalendarClock, ShieldCheck } from "lucide-react";

import { FleetForm } from "@/components/fleet/fleet-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Commercial & Fleet Detailing | Orange County | A Detail",
  description:
    "A Detail provides recurring mobile detailing contracts for fleets, RVs, and businesses throughout Orange County and Costa Mesa. Contact us for a custom plan.",
  openGraph: {
    title: "Commercial & Fleet Detailing | Orange County | A Detail",
    description:
      "A Detail provides recurring mobile detailing contracts for fleets, RVs, and businesses throughout Orange County and Costa Mesa. Contact us for a custom plan.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

const highlights = [
  {
    icon: CalendarClock,
    title: "Recurring service plans",
    description: "Scheduled details on a cadence that fits your operation — weekly, monthly, or custom.",
  },
  {
    icon: Building2,
    title: "Fleets & RVs, any size",
    description: "From a handful of company vehicles to full RV fleets, quoted for your specific needs.",
  },
  {
    icon: ShieldCheck,
    title: "Fully insured & background-checked",
    description: "The same professional-grade standards our residential clients rely on, at scale.",
  },
];

export default function FleetPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <span className="text-sm font-semibold tracking-wide text-brand uppercase">
          Commercial & Fleet
        </span>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Detailing for your fleet, on your schedule
        </h1>
        <p className="mt-4 text-base text-ink/60">
          We work with businesses and RV owners to build ongoing detailing contracts
          tailored to your fleet — no drop-off, no disruption to your operation. Tell us
          about your fleet and we&apos;ll follow up with a proposal.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
          <div key={title} className="text-center sm:text-left">
            <Icon className="mx-auto size-6 text-brand sm:mx-0" aria-hidden />
            <h2 className="mt-3 text-sm font-bold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-ink/60">{description}</p>
          </div>
        ))}
      </div>

      <Card className="mt-12 border-ink/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-ink">
            Contact us about your fleet or business
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FleetForm />
        </CardContent>
      </Card>
    </div>
  );
}
