import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, ShieldCheck, Star, ThumbsUp, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

const trustPoints = [
  { icon: Star, label: "5-Star Reviews" },
  { icon: ShieldCheck, label: "Fully Insured" },
  { icon: CalendarCheck, label: "Easy Online Booking" },
  { icon: ThumbsUp, label: "Satisfaction Guaranteed" },
  { icon: Users, label: "Trained Professionals" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <Image
        src="/gallery/gallery-01-bmw-x5m-exterior.jpg"
        alt="Freshly detailed BMW X5 M, exterior finished to a showroom shine"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_58%]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-28 text-center sm:py-32 lg:px-8 lg:py-40">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 backdrop-blur-sm">
          <span className="flex items-center gap-0.5 text-brand">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3 fill-current" aria-hidden />
            ))}
          </span>
          <span className="font-semibold text-white">{siteConfig.rating}</span>
          <span className="text-white/40" aria-hidden>
            &bull;
          </span>
          <span className="uppercase">
            {siteConfig.city}, California
          </span>
        </span>
        <h1 className="text-4xl leading-tight font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
          Showroom shine.
          <br />
          <span className="text-brand">Zero drop-off.</span>
        </h1>
        <p className="max-w-md text-lg text-white/90">{siteConfig.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="brand"
            size="lg"
            className="h-12 px-8 text-base"
            render={<Link href="/book" />}
          >
            Book Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 border-white/30 bg-white/10 px-8 text-base text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            render={<a href="#services" />}
          >
            View Services
          </Button>
        </div>

        <dl className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {trustPoints.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-2.5">
              <Icon className="size-5 shrink-0 text-brand" aria-hidden />
              <dt className="sr-only">Trust point</dt>
              <dd className="text-sm text-white/90">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
