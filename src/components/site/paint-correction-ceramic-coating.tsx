import Link from "next/link";
import { Eraser, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  { icon: Eraser, label: "Removes Swirls & Scratches" },
  { icon: ShieldCheck, label: "Long-Lasting Protection" },
  { icon: Sparkles, label: "Showroom Gloss" },
];

export function PaintCorrectionCeramicCoating() {
  return (
    <section id="protection" className="mx-auto max-w-6xl scroll-mt-18 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-sm font-semibold tracking-wide text-brand uppercase">
          Paint Correction &amp; Ceramic Coating
        </h2>
        <p className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Protection that goes deeper than a wash
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {benefits.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-brand/15">
              <Icon className="size-6 text-brand" aria-hidden />
            </span>
            <p className="text-sm font-semibold text-ink">{label}</p>
          </div>
        ))}
      </div>

      <Card className="mx-auto mt-16 max-w-2xl border-ink/10 shadow-none">
        <CardContent className="space-y-4 py-8 text-center">
          <p className="text-base text-ink/70">
            Paint correction removes the swirls, scratches, and oxidation that dull your
            finish. Ceramic coating then seals that corrected paint under a durable,
            hydrophobic layer measured in years, not weeks.
          </p>
          <p className="text-base text-ink/70">
            Together they take a car past clean — the paint comes back better than new,
            and stays that way.
          </p>
          <p className="text-base text-ink/70">
            Every vehicle is different. Send us a few details and we&apos;ll follow up
            with a quote.
          </p>

          <Button
            variant="brand"
            size="lg"
            className="mt-4 h-12 w-full text-base"
            render={<Link href="/consultation" />}
          >
            Get a Quote Today
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
