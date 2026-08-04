import type { Metadata } from "next";

import { BookingForm } from "@/components/booking/booking-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addOns, frequencyOptions, packages } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Book Mobile Car Detailing in Costa Mesa & Orange County | A Detail",
  description:
    "Schedule mobile car detailing in Costa Mesa or anywhere in Orange County. Pick your service and preferred time — A Detail comes to you.",
  openGraph: {
    title: "Book Mobile Car Detailing in Costa Mesa & Orange County | A Detail",
    description:
      "Schedule mobile car detailing in Costa Mesa or anywhere in Orange County. Pick your service and preferred time — A Detail comes to you.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; addon?: string; frequency?: string }>;
}) {
  const { tier, addon, frequency } = await searchParams;
  const initialTier = packages.find((pkg) => pkg.id === tier)?.name;
  const initialAddOn = addOns.find((item) => item.id === addon)?.name;
  const frequencyLabel = frequencyOptions.find((option) => option.id === frequency)?.label;
  const initialNotes =
    frequencyLabel && frequencyLabel !== "One Time"
      ? `Preferred frequency: ${frequencyLabel}`
      : undefined;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Request Your Detail
        </h1>
        <p className="mt-3 text-base text-ink/60">
          Tell us about your vehicle and when you&apos;d like us to come by. We&apos;ll
          reach out to confirm the details.
        </p>
      </div>

      <Card className="mt-10 border-ink/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-ink">Booking details</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingForm
            initialTier={initialTier}
            initialAddOn={initialAddOn}
            initialNotes={initialNotes}
          />
        </CardContent>
      </Card>
    </div>
  );
}
