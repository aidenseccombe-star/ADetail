import type { Metadata } from "next";

import { ConsultationForm } from "@/components/consultation/consultation-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Ceramic Coating Consultation | Costa Mesa, CA | A Detail",
  description:
    "Request a free ceramic coating consultation from A Detail, serving Costa Mesa and Orange County. Get a personalized quote for long-term paint protection.",
  openGraph: {
    title: "Ceramic Coating Consultation | Costa Mesa, CA | A Detail",
    description:
      "Request a free ceramic coating consultation from A Detail, serving Costa Mesa and Orange County. Get a personalized quote for long-term paint protection.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function ConsultationPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Request a Ceramic Coating Consultation
        </h1>
        <p className="mt-3 text-base text-ink/60">
          Ceramic coating pricing depends on your vehicle&apos;s size and condition. Tell
          us a bit about your car and we&apos;ll follow up with a personalized quote —
          no payment or commitment required.
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
