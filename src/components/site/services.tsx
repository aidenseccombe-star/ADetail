import Image from "next/image";
import Link from "next/link";

import { servicesCatalog } from "@/lib/site-config";

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-18 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-sm font-semibold tracking-wide text-brand uppercase">
          Services & Pricing
        </h2>
        <p className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Explore our services
        </p>
        <p className="mt-4 text-base text-ink/60">
          From a full showroom detail to targeted add-ons, every service is performed at
          your home or office. Tap a card to see what&apos;s included and get pricing.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {servicesCatalog.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group relative flex aspect-4/5 flex-col justify-end overflow-hidden rounded-2xl"
          >
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
              aria-hidden
            />
            <div className="relative flex flex-col gap-3 p-6">
              <h3 className="text-xl font-black text-white">{service.name}</h3>
              <p className="text-sm text-white/80">{service.shortDescription}</p>
              <span className="inline-flex w-fit items-center rounded-full bg-brand px-4 py-2 text-xs font-bold tracking-wide text-brand-foreground uppercase transition-colors group-hover:bg-white">
                Book {service.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
