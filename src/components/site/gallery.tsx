import Image from "next/image";

import { InstagramIcon } from "@/components/site/social-icons";
import { siteConfig } from "@/lib/site-config";

const galleryImages = [
  {
    src: "/gallery/gallery-03-bmw-x3-exterior.jpg",
    alt: "Detailed BMW X3 exterior, wet from a fresh hand wash",
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: "/gallery/gallery-02-porsche-911gts-interior.jpg",
    alt: "Porsche 911 Carrera 4 GTS interior after a full detail",
    span: "",
  },
  {
    src: "/gallery/gallery-04-mercedes-amg-wheel.jpg",
    alt: "Close-up of a cleaned and dressed Mercedes-AMG wheel",
    span: "",
  },
  {
    src: "/gallery/gallery-05-porsche-taycan-exterior.jpg",
    alt: "Porsche Taycan exterior with a fresh, glossy finish",
    span: "",
  },
  {
    src: "/gallery/gallery-06-rangerover-interior.jpg",
    alt: "Range Rover interior detailed and vacuumed",
    span: "",
  },
  {
    src: "/gallery/gallery-07-corvette-front.jpg",
    alt: "Chevrolet Corvette front end with a showroom-quality shine",
    span: "sm:col-span-2",
  },
] as const;

export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-18 bg-secondary/50 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold tracking-wide text-brand uppercase">
            Our Work
          </h2>
          <p className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
            See the difference
          </p>
          <p className="mt-4 text-base text-ink/60">
            A few recent details from around Costa Mesa and Orange County.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {galleryImages.map((image) => (
            <div
              key={image.src}
              className={`relative aspect-4/3 overflow-hidden rounded-2xl border border-ink/10 ${image.span}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 transition-colors hover:text-brand"
          >
            <InstagramIcon className="size-5" />
            Follow us on Instagram for more before &amp; afters
          </a>
        </div>
      </div>
    </section>
  );
}
