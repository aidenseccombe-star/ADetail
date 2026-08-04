"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { frequencyOptions, packages } from "@/lib/site-config";

type MaintenanceWashPackage = Extract<(typeof packages)[number], { id: "maintenance-wash" }>;
type FrequencyId = (typeof frequencyOptions)[number]["id"];

export function MaintenanceWashCard({ pkg }: { pkg: MaintenanceWashPackage }) {
  const [frequencyId, setFrequencyId] = useState<FrequencyId>("one-time");
  const frequency = frequencyOptions.find((option) => option.id === frequencyId)!;
  const discountedDollars = Math.round(
    (pkg.priceCents * (1 - frequency.discountPercent / 100)) / 100
  );

  return (
    <Card className="border-ink/10 bg-secondary/40 shadow-none sm:flex-row sm:items-stretch">
      <CardHeader className="sm:w-2/5 sm:border-r sm:border-ink/10">
        <p className="text-xs font-semibold tracking-wide text-brand uppercase">
          {pkg.eyebrow}
        </p>
        <CardTitle className="mt-2 text-2xl font-black text-ink">{pkg.name}</CardTitle>
        <CardDescription className="text-base">{pkg.description}</CardDescription>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {frequencyOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFrequencyId(option.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                option.id === frequencyId
                  ? "bg-brand text-brand-foreground"
                  : "bg-white text-ink/60 hover:text-ink"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-4xl font-black text-ink">Starting at ${discountedDollars}</p>
        {frequencyId !== "one-time" && (
          <p className="mt-1 text-sm text-ink/50">
            per visit, billed {frequency.label.toLowerCase()}
          </p>
        )}
      </CardHeader>

      <div className="flex flex-1 flex-col justify-between p-6">
        <CardContent className="p-0">
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {pkg.checklist.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink/70">
                <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="mt-6 flex-col items-stretch gap-3 p-0">
          <p className="text-xs text-ink/50">{pkg.gateNote}</p>
          <Button
            variant="brand"
            size="lg"
            className="w-full"
            render={<Link href={`/book?tier=${pkg.id}&frequency=${frequencyId}`} />}
          >
            Book {pkg.name}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
