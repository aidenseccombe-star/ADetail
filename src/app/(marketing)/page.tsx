import type { Metadata } from "next";

import { Hero } from "@/components/site/hero";
import { Packages } from "@/components/site/packages";
import { AddOns } from "@/components/site/add-ons";
import { PaintCorrectionCeramicCoating } from "@/components/site/paint-correction-ceramic-coating";
import { Gallery } from "@/components/site/gallery";
import { Testimonials } from "@/components/site/testimonials";
import { About } from "@/components/site/about";
import { CtaBanner } from "@/components/site/cta-banner";
import { servicesCatalog, siteConfig } from "@/lib/site-config";

// LocalBusiness structured data for the homepage. A Detail has no physical
// storefront — it's a service-area business — so `address` is deliberately
// omitted rather than populated with a fake or home street address, per
// Google's guidance for service-area businesses.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDetailing",
  name: siteConfig.name,
  url: "https://amobiledetail.com",
  telephone: "+19496273704",
  priceRange: "$105-$379",
  founder: {
    "@type": "Person",
    name: siteConfig.ownerName,
  },
  areaServed: [
    { "@type": "City", name: "Costa Mesa" },
    { "@type": "City", name: "Newport Beach" },
    { "@type": "City", name: "Irvine" },
    { "@type": "City", name: "Huntington Beach" },
    { "@type": "City", name: "Fountain Valley" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Mobile Detailing Services",
    itemListElement: servicesCatalog.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.name },
    })),
  },
};

export const metadata: Metadata = {
  title: "A Detail | Mobile Car Detailing in Costa Mesa & Orange County",
  description:
    "A Detail brings premium mobile car detailing to Costa Mesa and all of Orange County. Searching for mobile auto detailing near me? We come to your home or office — no drop-off required. Book online today.",
  openGraph: {
    title: "A Detail | Mobile Car Detailing in Costa Mesa & Orange County",
    description:
      "A Detail brings premium mobile car detailing to Costa Mesa and all of Orange County. We come to your home or office — no drop-off required.",
    // Page-level `openGraph` replaces (not merges with) the root layout's,
    // so the auto-detected opengraph-image.tsx has to be re-declared here too.
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Hero />
      <Packages />
      <AddOns />
      <PaintCorrectionCeramicCoating />
      <Gallery />
      <Testimonials />
      <About />
      <CtaBanner />
    </>
  );
}
