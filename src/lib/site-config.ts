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

export const serviceNavItems = [
  {
    label: "Full Detail",
    description: "Complete interior & exterior detail",
    href: "/#services",
  },
  {
    label: "Paint Correction",
    description: "Machine polishing for swirls & scratches",
    href: "/#paint-correction",
  },
  {
    label: "Ceramic Coating",
    description: "Long-term protection, by consultation",
    href: "/consultation",
  },
  {
    label: "Engine Bay Detail",
    description: "Safe degreasing & detailing",
    href: "/#engine-bay-detail",
  },
  {
    label: "Headlight Restoration",
    description: "Clearer, brighter headlights",
    href: "/#headlight-restoration",
  },
  {
    label: "Pet Hair Removal",
    description: "Deep extraction from carpet & upholstery",
    href: "/#pet-hair-removal",
  },
  {
    label: "Odor Elimination",
    description: "Ozone treatment for smoke & pet odors",
    href: "/#odor-elimination",
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
