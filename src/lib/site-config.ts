// Central place to edit business info, pricing, and copy shown across the site.

export const siteConfig = {
  name: "A Detail",
  tagline: "Premium mobile detailing, brought to your driveway.",
  description:
    "A Detail is a boutique mobile car detailing service. We come to you with professional-grade equipment for a showroom finish — no drop-off required.",
  phone: "(555) 123-4567",
  email: "aidenseccombe@amobiledetail.com",
  city: "Costa Mesa",
  state: "CA",
  serviceArea: "Orange County",
  rating: "5.0",
  hours: [
    { days: "Monday – Saturday", time: "7:00 AM – 5:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
} as const;

const fullDetailIncludes = [
  "Hand wash & foam pre-soak",
  "Wheel & tire cleaning + dressing",
  "Interior vacuum, wipe-down & dashboard conditioning",
  "Window cleaning, in and out",
  "Hand-applied wax for a deep shine",
] as const;

export const baseServices = [
  {
    id: "sedan-coupe",
    name: "Full Detail — Sedan/Coupe",
    price: "From $279",
    description:
      "A complete interior and exterior detail for sedans and coupes, performed at your home or office. Final price depends on vehicle condition.",
    includes: fullDetailIncludes,
  },
  {
    id: "suv-truck",
    name: "Full Detail — SUV/Truck",
    price: "From $329",
    description:
      "A complete interior and exterior detail for SUVs and trucks, performed at your home or office. Final price depends on vehicle condition.",
    includes: fullDetailIncludes,
  },
] as const;

export const ceramicCoating = {
  id: "ceramic-coating",
  name: "Ceramic Coating",
  startingPrice: "From $599",
  description: "Long-term paint protection with a high-gloss, hydrophobic finish.",
  note: "Final pricing depends on vehicle size and condition — request a consultation and we'll follow up with a quote.",
} as const;

export const addOns = [
  {
    id: "paint-correction",
    name: "Paint Correction",
    price: "From $349",
    description: "Machine polishing to remove swirl marks, light scratches, and oxidation.",
    priceCents: 34900,
    requiresDeposit: true,
  },
  {
    id: "engine-bay-detail",
    name: "Engine Bay Detail",
    price: "From $49",
    description: "Safe degreasing and detailing of the engine compartment.",
  },
  {
    id: "headlight-restoration",
    name: "Headlight Restoration",
    price: "From $95",
    description: "Removes fog and yellowing for clearer, brighter headlights.",
  },
  {
    id: "pet-hair-removal",
    name: "Pet Hair Removal",
    price: "From $39",
    description: "Deep extraction of embedded pet hair from carpet and upholstery.",
  },
  {
    id: "odor-elimination",
    name: "Odor Elimination",
    price: "From $59",
    description: "Ozone treatment to neutralize smoke, pet, and mildew odors.",
  },
] as const;

function getAddOn(id: (typeof addOns)[number]["id"]) {
  const found = addOns.find((addOn) => addOn.id === id);
  if (!found) {
    throw new Error(`Add-on with id "${id}" is missing from site-config.`);
  }
  return found;
}

// Full content for the homepage service cards and each /services/[slug] detail page.
export const servicesCatalog = [
  {
    slug: "full-detail",
    name: "Full Detail",
    shortDescription:
      "A complete interior and exterior detail, from hand wash to hand-applied wax.",
    description:
      "Every full detail starts with a hand wash and foam pre-soak, then moves through wheel and tire care, a deep interior clean, and a hand-applied wax for a lasting shine. Performed at your home or office — final pricing depends on vehicle size and condition.",
    image: "/gallery/gallery-03-bmw-x3-exterior.jpg",
    imageAlt: "Freshly detailed BMW X3 exterior, showroom shine",
    frequency: "Every 4–6 weeks",
    duration: "90–120 minutes",
    includes: fullDetailIncludes,
    pricing: baseServices.map((service) => ({
      label: service.name,
      price: service.price,
      href: `/book?tier=${service.id}`,
    })),
    priceNote: undefined as string | undefined,
    cta: "book" as const,
  },
  {
    slug: getAddOn("paint-correction").id,
    name: "Paint Correction",
    shortDescription: getAddOn("paint-correction").description,
    description:
      "Machine polishing lifts swirl marks, light scratches, and oxidation out of your clear coat, restoring depth and clarity before your paint is sealed or coated.",
    image: "/gallery/gallery-05-porsche-taycan-exterior.jpg",
    imageAlt: "Porsche Taycan exterior with corrected, glossy paint",
    frequency: "As needed, or before a ceramic coating",
    duration: "2–4 hours",
    includes: [
      "Multi-stage machine polish",
      "Swirl mark & light scratch removal",
      "Paint inspection under LED lighting",
      "Finishing polish for maximum gloss",
    ],
    pricing: [
      {
        label: "Paint Correction",
        price: getAddOn("paint-correction").price,
        href: "/book?addon=paint-correction",
      },
    ],
    priceNote: "50% non-refundable deposit due at booking." as string | undefined,
    cta: "book" as const,
  },
  {
    slug: ceramicCoating.id,
    name: "Ceramic Coating",
    shortDescription: ceramicCoating.description,
    description: `${ceramicCoating.description} ${ceramicCoating.note}`,
    image: "/gallery/gallery-07-corvette-front.jpg",
    imageAlt: "Corvette front end with a high-gloss, ceramic-coated finish",
    frequency: "Lasts 2–5 years depending on the product",
    duration: "By consultation",
    includes: [
      "Paint decontamination & prep",
      "Machine paint correction, as needed",
      "Professional-grade ceramic coating application",
      "Hydrophobic, high-gloss finish",
    ],
    pricing: [
      {
        label: "Ceramic Coating",
        price: ceramicCoating.startingPrice,
        href: "/consultation",
      },
    ],
    priceNote: ceramicCoating.note as string | undefined,
    cta: "consultation" as const,
  },
  {
    slug: getAddOn("headlight-restoration").id,
    name: "Headlight Restoration",
    shortDescription: getAddOn("headlight-restoration").description,
    description:
      "Foggy, yellowed headlights don't just look dated — they cut down how far your headlights actually throw light at night. We wet-sand away the oxidation and seal the lens for lasting clarity.",
    image: "/gallery/gallery-01-bmw-x5m-exterior.jpg",
    imageAlt: "BMW X5 M front fascia with clear, restored headlights",
    frequency: "Every 1–2 years",
    duration: "30–45 minutes",
    includes: [
      "Wet-sand oxidation removal",
      "Multi-stage polishing",
      "UV-protective sealant application",
      "Restored clarity & brightness",
    ],
    pricing: [
      {
        label: "Headlight Restoration",
        price: getAddOn("headlight-restoration").price,
        href: "/book?addon=headlight-restoration",
      },
    ],
    priceNote: undefined as string | undefined,
    cta: "book" as const,
  },
  {
    slug: getAddOn("engine-bay-detail").id,
    name: "Engine Bay Detail",
    shortDescription: getAddOn("engine-bay-detail").description,
    description:
      "A clean engine bay makes it easier to spot leaks and wear early, and it's simply satisfying to pop the hood on a car that's cared for from top to bottom. We degrease and dress every surface by hand.",
    image: "/gallery/gallery-04-mercedes-amg-wheel.jpg",
    imageAlt: "Close-up detail work on a Mercedes-AMG",
    frequency: "Every 3–6 months",
    duration: "20–30 minutes",
    includes: [
      "Safe degreasing of engine components",
      "Plastic & rubber conditioning",
      "Careful hand detailing around electronics",
      "Engine bay dressed for a clean finish",
    ],
    pricing: [
      {
        label: "Engine Bay Detail",
        price: getAddOn("engine-bay-detail").price,
        href: "/book?addon=engine-bay-detail",
      },
    ],
    priceNote: undefined as string | undefined,
    cta: "book" as const,
  },
  {
    slug: getAddOn("pet-hair-removal").id,
    name: "Pet Hair Removal",
    shortDescription: getAddOn("pet-hair-removal").description,
    description:
      "Embedded pet hair doesn't come out with a standard vacuum. We use rubber-tipped tools and a deep extraction process to lift hair out of carpet and upholstery fibers.",
    image: "/gallery/gallery-06-rangerover-interior.jpg",
    imageAlt: "Range Rover interior with clean carpet and upholstery",
    frequency: "As needed",
    duration: "30–45 minutes",
    includes: [
      "Deep extraction from carpet & upholstery",
      "Rubber-tipped tools to lift embedded hair",
      "Full interior vacuum",
      "Fabric-safe treatment",
    ],
    pricing: [
      {
        label: "Pet Hair Removal",
        price: getAddOn("pet-hair-removal").price,
        href: "/book?addon=pet-hair-removal",
      },
    ],
    priceNote: undefined as string | undefined,
    cta: "book" as const,
  },
  {
    slug: getAddOn("odor-elimination").id,
    name: "Odor Elimination",
    shortDescription: getAddOn("odor-elimination").description,
    description:
      "Smoke, pet, and mildew odors live deep in fabric and vents where a standard clean can't reach. Ozone treatment neutralizes odor at the source instead of masking it.",
    image: "/gallery/gallery-02-porsche-911gts-interior.jpg",
    imageAlt: "Porsche 911 GTS interior, clean and fresh",
    frequency: "As needed",
    duration: "30–45 minutes",
    includes: [
      "Ozone treatment for smoke, pet & mildew odors",
      "Interior deep clean",
      "Air vent & cabin filter freshening",
      "Fabric & surface deodorizing",
    ],
    pricing: [
      {
        label: "Odor Elimination",
        price: getAddOn("odor-elimination").price,
        href: "/book?addon=odor-elimination",
      },
    ],
    priceNote: undefined as string | undefined,
    cta: "book" as const,
  },
] as const;

const paintCorrection = addOns.find((addOn) => addOn.name === "Paint Correction");
if (!paintCorrection || !("priceCents" in paintCorrection)) {
  throw new Error("Paint Correction add-on with priceCents is missing from site-config.");
}

export const paintCorrectionDepositCents = Math.round(paintCorrection.priceCents / 2);

export const timeWindows = [
  "Morning (7am – 10am)",
  "Midday (10am – 1pm)",
  "Afternoon (1pm – 4pm)",
] as const;

export const testimonials = [
  {
    name: "Kyle D.",
    initials: "KD",
    quote:
      "Aiden did a fantastic job detailing my car! He arrived right on time and was incredibly courteous and professional throughout the process. The quality of the wash was top-notch, and the pricing was very reasonable. Highly recommend!",
    rating: 5,
  },
  {
    name: "MaiLan H.",
    initials: "MH",
    quote:
      "10/10!! Aiden is the best! He is so professional and thorough. Attention to detail is so important when it comes to car detailing and Aiden delivers when it comes to this. He goes above and beyond to ensure that he treats your vehicle like it was his own. That type of service is hard to find nowadays.",
    rating: 5,
  },
  {
    name: "Billy D.",
    initials: "BD",
    quote:
      "I recently used ADetail and was extremely pleased with the service! They did a fantastic job on the engine and paid close attention to all the details inside. My car truly looks brand new.",
    rating: 5,
  },
  {
    name: "Joshua B.",
    initials: "JB",
    quote:
      "Aiden does a STELLER job. He is fully prepared, has all the high tech gear, and doesn't rush perfection. Highly recommended for every type of whip!",
    rating: 5,
    reviewerMeta: "Local Guide · 110 reviews",
  },
  {
    name: "Lasha Z.",
    initials: "LZ",
    quote:
      "Quality work, amazing results and fair pricing. Great communication and discussion of my needs.",
    rating: 5,
  },
] as const;
