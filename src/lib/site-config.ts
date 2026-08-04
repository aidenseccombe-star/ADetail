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
  // Placeholder — no confirmed source for this yet.
  paymentsAccepted: ["Cash", "Card", "Apple Pay", "Google Pay"],
} as const;

export const vehicleTypes = [
  { id: "sedan-coupe", label: "Sedan / Coupe" },
  { id: "suv-truck", label: "SUV / Truck" },
] as const;

// Legacy compound service_tier values from before packages had a single
// price and a separate vehicle-type field (each "Full Detail" tier used to
// be priced per vehicle size). Old Supabase rows may still have these —
// kept only so booking-availability.ts can still resolve a duration for
// them; nothing in the UI writes these values anymore.
export const legacyTierDurations = {
  "Full Detail — Sedan/Coupe": 120,
  "Full Detail — SUV/Truck": 150,
} as const;

export const packages = [
  {
    id: "basic-detail",
    name: "Basic Detail",
    price: "Starting at $130",
    // Placeholder — will be corrected later.
    priceCents: 13000,
    description:
      "A thorough inside-and-out clean that keeps your car looking sharp between full details.",
    checklist: {
      type: "split",
      exterior: [
        "Full hand wash",
        "Wheel & tire cleaning + dressing",
        "Exterior window cleaning",
      ],
      interior: [
        "Interior vacuum",
        "Dashboard & console wipe-down",
        "Interior window cleaning",
      ],
    },
    durationMinutes: { "sedan-coupe": 75, "suv-truck": 90 },
  },
  {
    id: "full-detail",
    name: "Full Detail",
    price: "Starting at $219",
    // Placeholder — will be corrected later.
    priceCents: 21900,
    description:
      "Our most-booked package. A complete restoration of your car's interior and exterior.",
    badge: "Most Popular",
    checklist: {
      type: "plus",
      plusFrom: "Basic Detail",
      items: [
        "2-step hand wash",
        "Wax for a deep shine",
        "Dashboard & console wipe-down",
        "Interior leather cleaning & conditioning",
        "Door jamb cleaning",
      ],
    },
    durationMinutes: { "sedan-coupe": 120, "suv-truck": 150 },
  },
  {
    id: "signature-detail",
    name: "Signature Detail",
    price: "Starting at $379",
    // Placeholder — will be corrected later.
    priceCents: 37900,
    description: "The full treatment. Every surface corrected, conditioned, and protected.",
    checklist: {
      type: "plus",
      plusFrom: "Full Detail",
      items: [
        "Engine bay cleaning & dressing",
        "Clay bar treatment",
        "Iron decontamination",
        "Steam cleaning of all interior surfaces",
        "Paint sealant for longer-lasting protection",
      ],
    },
    durationMinutes: { "sedan-coupe": 240, "suv-truck": 300 },
  },
  {
    id: "maintenance-wash",
    name: "Maintenance Wash",
    price: "Starting at $105",
    // Placeholder — will be corrected later.
    priceCents: 10500,
    description: "Keeps a finish we've already restored looking new.",
    eyebrow: "For vehicles we've already detailed",
    gateNote: "Available to clients whose vehicles we've detailed before.",
    checklist: {
      type: "flat",
      items: [
        "Hand wash & foam pre-soak",
        "Wheel & tire cleaning",
        "Exterior window cleaning",
        "Interior vacuum & touch-point wipe-down",
      ],
    },
    hasFrequencyToggle: true,
    durationMinutes: { "sedan-coupe": 45, "suv-truck": 60 },
  },
] as const;

// Overloads so each call site gets the exact package's shape back (the four
// packages don't all share the same checklist shape) instead of a union.
export function getPackage(
  id: "basic-detail"
): Extract<(typeof packages)[number], { id: "basic-detail" }>;
export function getPackage(
  id: "full-detail"
): Extract<(typeof packages)[number], { id: "full-detail" }>;
export function getPackage(
  id: "signature-detail"
): Extract<(typeof packages)[number], { id: "signature-detail" }>;
export function getPackage(
  id: "maintenance-wash"
): Extract<(typeof packages)[number], { id: "maintenance-wash" }>;
export function getPackage(id: (typeof packages)[number]["id"]) {
  const found = packages.find((pkg) => pkg.id === id);
  if (!found) {
    throw new Error(`Package with id "${id}" is missing from site-config.`);
  }
  return found;
}

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
    // Excluded from calendar duration math on purpose — handled via its own
    // deposit flow, not scheduled like the other add-ons.
    durationMinutes: null,
  },
  {
    id: "engine-bay-detail",
    name: "Engine Bay Detail",
    price: "From $49",
    description: "Safe degreasing and detailing of the engine compartment.",
    durationMinutes: 30,
  },
  {
    id: "headlight-restoration",
    name: "Headlight Restoration",
    price: "From $95",
    description: "Removes fog and yellowing for clearer, brighter headlights.",
    durationMinutes: 60,
  },
  {
    id: "pet-hair-removal",
    name: "Pet Hair Removal",
    price: "From $39",
    description: "Deep extraction of embedded pet hair from carpet and upholstery.",
    durationMinutes: 60,
  },
  {
    id: "odor-elimination",
    name: "Odor Elimination",
    price: "From $59",
    description: "Ozone treatment to neutralize smoke, pet, and mildew odors.",
    durationMinutes: 60,
  },
  {
    id: "clay-bar-iron-decon",
    name: "Clay Bar + Iron Decontamination",
    // Placeholder — will be corrected later.
    price: "From $79",
    description:
      "Removes embedded contaminants and iron particles the wash alone can't lift, leaving paint glass-smooth.",
    durationMinutes: 30,
  },
  {
    id: "exterior-plastic-restoration",
    name: "Exterior Plastic Restoration",
    // Placeholder — will be corrected later.
    price: "From $65",
    description: "Restores faded trim, bumpers, and plastic panels to a rich, like-new finish.",
    durationMinutes: 45,
  },
] as const;

export const frequencyOptions = [
  { id: "one-time", label: "One Time", discountPercent: 0 },
  { id: "monthly", label: "Monthly", discountPercent: 10 },
  { id: "bi-weekly", label: "Bi-Weekly", discountPercent: 15 },
  { id: "weekly", label: "Weekly", discountPercent: 20 },
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
    slug: "basic-detail",
    name: "Basic Detail",
    shortDescription: getPackage("basic-detail").description,
    description:
      "Basic Detail is a thorough inside-and-out clean that keeps your car looking sharp between full details — a full hand wash, wheel and tire care, and a full interior vacuum and wipe-down. Performed at your home or office.",
    image: "/gallery/gallery-06-rangerover-interior.jpg",
    imageAlt: "Range Rover interior, clean and freshly wiped down",
    duration: "75–90 minutes",
    includes: [
      ...getPackage("basic-detail").checklist.exterior,
      ...getPackage("basic-detail").checklist.interior,
    ],
    pricing: [
      {
        label: "Basic Detail",
        price: getPackage("basic-detail").price,
        href: "/book?tier=basic-detail",
      },
    ],
    priceNote: undefined as string | undefined,
    cta: "book" as const,
  },
  {
    slug: "full-detail",
    name: "Full Detail",
    shortDescription: getPackage("full-detail").description,
    description:
      "Full Detail is our most-booked package — a complete restoration of your car's interior and exterior. It builds on everything in Basic Detail with a 2-step hand wash, a fresh coat of wax for a deeper shine, leather cleaning and conditioning, and door jamb cleaning. Performed at your home or office.",
    image: "/gallery/gallery-03-bmw-x3-exterior.jpg",
    imageAlt: "Freshly detailed BMW X3 exterior, showroom shine",
    duration: "2–2.5 hours",
    includes: [
      ...new Set([
        ...getPackage("basic-detail").checklist.exterior,
        ...getPackage("basic-detail").checklist.interior,
        ...getPackage("full-detail").checklist.items,
      ]),
    ],
    pricing: [
      {
        label: "Full Detail",
        price: getPackage("full-detail").price,
        href: "/book?tier=full-detail",
      },
    ],
    priceNote: undefined as string | undefined,
    cta: "book" as const,
  },
  {
    slug: "signature-detail",
    name: "Signature Detail",
    shortDescription: getPackage("signature-detail").description,
    description:
      "Signature Detail is the full treatment — every surface corrected, conditioned, and protected. It builds on everything in Full Detail with an engine bay clean, clay bar and iron decontamination, a full steam cleaning of every interior surface, and a paint sealant for longer-lasting protection.",
    image: "/gallery/gallery-01-bmw-x5m-exterior.jpg",
    imageAlt: "BMW X5 M exterior, fully corrected and finished to a showroom shine",
    duration: "4–5 hours",
    includes: [
      ...new Set([
        ...getPackage("basic-detail").checklist.exterior,
        ...getPackage("basic-detail").checklist.interior,
        ...getPackage("full-detail").checklist.items,
        ...getPackage("signature-detail").checklist.items,
      ]),
    ],
    pricing: [
      {
        label: "Signature Detail",
        price: getPackage("signature-detail").price,
        href: "/book?tier=signature-detail",
      },
    ],
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
        href: "/consultation",
      },
    ],
    priceNote:
      "Final pricing depends on vehicle size and condition — request a consultation and we'll follow up with a quote. A 50% deposit secures your appointment." as
        | string
        | undefined,
    cta: "consultation" as const,
  },
  {
    slug: ceramicCoating.id,
    name: "Ceramic Coating",
    shortDescription: ceramicCoating.description,
    description: `${ceramicCoating.description} ${ceramicCoating.note}`,
    image: "/gallery/gallery-07-corvette-front.jpg",
    imageAlt: "Corvette front end with a high-gloss, ceramic-coated finish",
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
    image: "/gallery/toyota-tundra-trd-pro.jpg",
    imageAlt: "Toyota Tundra TRD Pro exterior, detailed to a rich, glossy finish",
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
    image: "/gallery/porsche-911-interior.jpg",
    imageAlt: "Porsche 911 interior with red leather seats, detailed and conditioned",
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
