import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addOns, baseServices, ceramicCoating } from "@/lib/site-config";

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-18 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-sm font-semibold tracking-wide text-brand uppercase">
          Services & Pricing
        </h2>
        <p className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
          One core detail, built to your car
        </p>
        <p className="mt-4 text-base text-ink/60">
          Every booking starts with our full mobile detail, priced to your vehicle. Layer
          on any add-on below — pricing shown is a starting point and confirmed for your
          vehicle before you pay.
        </p>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-5 lg:items-start">
        <div className="space-y-6 lg:col-span-2">
          {baseServices.map((service) => (
            <Card key={service.id} className="border-ink/10 shadow-none">
              <CardHeader>
                <span className="w-fit rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-ink">
                  Base Package
                </span>
                <CardTitle className="mt-3 text-2xl font-black text-ink">
                  {service.name}
                </CardTitle>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-black text-ink">{service.price}</p>
                <ul className="mt-6 space-y-3">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ink/70">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="brand"
                  size="lg"
                  className="w-full"
                  render={<Link href={`/book?tier=${service.id}`} />}
                >
                  Book This Package
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          {addOns.map((addOn) => (
            <Card
              key={addOn.name}
              id={addOn.id}
              className="scroll-mt-18 border-ink/10 shadow-none"
            >
              <CardHeader>
                <CardTitle className="text-base font-bold text-ink">
                  {addOn.name}
                </CardTitle>
                <CardDescription>{addOn.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-ink">{addOn.price}</p>
                {"requiresDeposit" in addOn && addOn.requiresDeposit && (
                  <p className="mt-1 text-xs text-ink/50">
                    50% non-refundable deposit due at booking
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          <Card
            id={ceramicCoating.id}
            className="scroll-mt-18 border-brand/30 shadow-none sm:col-span-2"
          >
            <CardHeader>
              <Badge variant="outline" className="w-fit border-brand/40 text-ink">
                By consultation
              </Badge>
              <CardTitle className="mt-1 text-base font-bold text-ink">
                {ceramicCoating.name}
              </CardTitle>
              <CardDescription>{ceramicCoating.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-ink">{ceramicCoating.startingPrice}</p>
              <p className="mt-2 text-sm text-ink/60">{ceramicCoating.note}</p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                render={<Link href="/consultation" />}
              >
                Request a Consultation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
