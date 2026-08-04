import type { Metadata } from "next";

import { ConsultationForm } from "@/components/consultation/consultation-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Paint Correction & Ceramic Coating Quote | Costa Mesa, CA | A Detail",
  description:
    "Request a free paint correction and ceramic coating quote from A Detail, serving Costa Mesa and Orange County. Tell us about your vehicle and we'll follow up with pricing.",
  openGraph: {
    title: "Paint Correction & Ceramic Coating Quote | Costa Mesa, CA | A Detail",
    description:
      "Request a free paint correction and ceramic coating quote from A Detail, serving Costa Mesa and Orange County. Tell us about your vehicle and we'll follow up with pricing.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function ConsultationPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Get a Paint Correction &amp; Ceramic Coating Quote
        </h1>
        <p className="mt-3 text-base text-ink/60">
          Pricing for both services depends on your vehicle&apos;s size and condition.
          Tell us a bit about your car and what you&apos;re interested in, and
          we&apos;ll follow up with a personalized quote — no payment or commitment
          required.
        </p>
      </div>

      <Card className="mt-10 border-ink/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-ink">Your details</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultationForm />
        </CardContent>
      </Card>
    </div>
  );
}
