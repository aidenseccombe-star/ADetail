import type { Metadata } from "next";

import { Hero } from "@/components/site/hero";
import { Services } from "@/components/site/services";
import { Gallery } from "@/components/site/gallery";
import { Testimonials } from "@/components/site/testimonials";
import { CtaBanner } from "@/components/site/cta-banner";

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
      <Hero />
      <Services />
      <Gallery />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
