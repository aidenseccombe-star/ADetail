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
import { packages } from "@/lib/site-config";

type TierPackage = Extract<
  (typeof packages)[number],
  { id: "basic-detail" | "full-detail" | "signature-detail" }
>;

export function PackageCard({ pkg }: { pkg: TierPackage }) {
  const isFeatured = "badge" in pkg;

  return (
    <Card
      className={cn(
        "relative flex flex-col shadow-none",
        isFeatured ? "border-brand shadow-lg shadow-brand/10 lg:scale-105" : "border-ink/10"
      )}
    >
      {isFeatured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-bold tracking-wide text-brand-foreground uppercase">
          {pkg.badge}
        </span>
      )}
      <CardHeader>
        <CardTitle className="text-2xl font-black text-ink">{pkg.name}</CardTitle>
        <CardDescription className="text-base">{pkg.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-4xl font-black text-ink">{pkg.price}</p>

        <div className="mt-6">
          {pkg.checklist.type === "split" ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-xs font-semibold tracking-wide text-brand uppercase">
                  Exterior
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {pkg.checklist.exterior.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ink/70">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold tracking-wide text-brand uppercase">
                  Interior
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {pkg.checklist.interior.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ink/70">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-xs font-semibold tracking-wide text-brand uppercase">
                Everything in {pkg.checklist.plusFrom}, plus:
              </h4>
              <ul className="mt-3 space-y-2.5">
                {pkg.checklist.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink/70">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="brand"
          size="lg"
          className="w-full"
          render={<Link href={`/book?tier=${pkg.id}`} />}
        >
          Book {pkg.name}
        </Button>
      </CardFooter>
    </Card>
  );
}
