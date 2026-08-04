import Link from "next/link";
import { Droplet, Lightbulb, Magnet, PawPrint, Wind, Wrench, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addOns } from "@/lib/site-config";

const ICONS: Record<string, LucideIcon> = {
  "headlight-restoration": Lightbulb,
  "engine-bay-detail": Wrench,
  "pet-hair-removal": PawPrint,
  "odor-elimination": Wind,
  "clay-bar-iron-decon": Magnet,
  "exterior-plastic-restoration": Droplet,
};

export function AddOns() {
  const items = addOns.filter((addOn) => addOn.id !== "paint-correction");

  return (
    <section id="add-ons" className="scroll-mt-18 bg-secondary/50 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold tracking-wide text-brand uppercase">
            Add-Ons
          </h2>
          <p className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Enhance Any Package
          </p>
          <p className="mt-4 text-base text-ink/60">
            Layer on any add-on to tackle a specific trouble spot — pricing shown is a
            starting point, confirmed for your vehicle before you pay.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((addOn) => {
            const Icon = ICONS[addOn.id];
            return (
              <Card key={addOn.id} className="border-ink/10 shadow-none">
                <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
                  <Icon className="size-6 text-brand" aria-hidden />
                  <p className="text-sm font-semibold text-ink">{addOn.name}</p>
                  <p className="text-sm text-ink/60">{addOn.price}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button
            variant="brand"
            size="lg"
            className="h-12 px-8 text-base"
            render={<Link href="/book" />}
          >
            Book Add-On
          </Button>
        </div>
      </div>
    </section>
  );
}
