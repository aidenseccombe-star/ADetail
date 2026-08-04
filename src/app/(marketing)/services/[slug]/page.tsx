import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { servicesCatalog } from "@/lib/site-config";

export function generateStaticParams() {
  return servicesCatalog.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesCatalog.find((s) => s.slug === slug);
  if (!service) return {};

  const title = `${service.name} in Costa Mesa & Orange County | A Detail`;
  const description = service.shortDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = servicesCatalog.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const isMultiTier = service.pricing.length > 1;
  const primaryHref =
    service.cta === "consultation"
      ? "/consultation"
      : isMultiTier
        ? "/book"
        : service.pricing[0].href;
  const primaryLabel =
    service.cta === "consultation" ? "Request a Consultation" : "Book This Service";

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <Link
        href="/#services"
        className="text-sm font-medium text-ink/50 transition-colors hover:text-ink"
      >
        &larr; All services
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:col-span-5">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <h1 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
            {service.name}
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/60">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-brand" aria-hidden />
              {service.duration}
            </span>
          </div>

          <p className="mt-6 text-base text-ink/70">{service.description}</p>

          <div className="mt-10">
            <h2 className="text-sm font-semibold tracking-wide text-brand uppercase">
              What&apos;s included
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink/70">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {service.cta === "consultation" ? (
            service.priceNote && (
              <p className="mt-10 text-sm text-ink/60">{service.priceNote}</p>
            )
          ) : (
            <div className="mt-10 space-y-3">
              {service.pricing.map((tier) => (
                <div
                  key={tier.label}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ink/10 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{tier.label}</p>
                    <p className="text-2xl font-black text-ink">{tier.price}</p>
                  </div>
                  {isMultiTier && (
                    <Button variant="brand" size="lg" render={<Link href={tier.href} />}>
                      Book This Package
                    </Button>
                  )}
                </div>
              ))}
              {service.priceNote && (
                <p className="text-xs text-ink/50">{service.priceNote}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 rounded-2xl bg-ink px-8 py-12 text-center sm:py-16">
        <p className="text-2xl font-black text-white sm:text-3xl">
          Ready for {service.name.toLowerCase()}?
        </p>
        <p className="mt-2 text-sm text-white/60">
          Pick a time that works for you — we&apos;ll come to your home or office.
        </p>
        <Button
          variant="brand"
          size="lg"
          className="mt-6 h-12 px-8 text-base"
          render={<Link href={primaryHref} />}
        >
          {primaryLabel}
        </Button>
      </div>
    </div>
  );
}
