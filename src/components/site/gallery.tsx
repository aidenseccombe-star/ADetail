"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InstagramIcon } from "@/components/site/social-icons";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

// Order is fixed by design: porsche-911-interior, corvette-front, and
// bmw-x5m-exterior lead, then the rest alternate exteriors with
// interior/detail shots so similar photos don't cluster together.
const galleryImages = [
  {
    src: "/gallery/porsche-911-interior.jpg",
    alt: "Porsche 911 interior with red leather seats, detailed and conditioned",
  },
  {
    src: "/gallery/gallery-07-corvette-front.jpg",
    alt: "Chevrolet Corvette front end with a showroom-quality shine",
  },
  {
    src: "/gallery/gallery-01-bmw-x5m-exterior.jpg",
    alt: "BMW X5 M exterior after a full detail, deep gloss finish in the driveway",
  },
  {
    src: "/gallery/gallery-06-rangerover-interior.jpg",
    alt: "Range Rover interior detailed and vacuumed",
  },
  {
    src: "/gallery/ford-raptor-exterior.jpg",
    alt: "Ford Raptor exterior, washed and detailed to a clean, glossy finish",
  },
  {
    src: "/gallery/porsche-wheel-detail.jpg",
    alt: "Porsche wheel and red brake caliper, cleaned and dressed",
  },
  {
    src: "/gallery/gallery-05-porsche-taycan-exterior.jpg",
    alt: "Porsche Taycan exterior with a fresh, glossy finish",
  },
  {
    src: "/gallery/gallery-02-porsche-911gts-interior.jpg",
    alt: "Porsche 911 Carrera 4 GTS interior after a full detail",
  },
  {
    src: "/gallery/bmw-m3-exterior.jpg",
    alt: "BMW M3 exterior, washed and finished to a deep, reflective shine",
  },
  {
    src: "/gallery/maserati-wheel-detail.jpg",
    alt: "Maserati wheel and red brake caliper, cleaned and dressed to a polished finish",
  },
  {
    src: "/gallery/gallery-03-bmw-x3-exterior.jpg",
    alt: "Detailed BMW X3 exterior, wet from a fresh hand wash",
  },
  {
    src: "/gallery/toyota-tundra-trd-pro.jpg",
    alt: "Toyota Tundra TRD Pro exterior, detailed to a rich, glossy finish",
  },
] as const;

export function Gallery() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [thumb, setThumb] = useState({ widthPct: 100, leftPct: 0 });

  function updateScrollState() {
    const el = scrollerRef.current;
    if (!el) return;

    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);

    const maxScroll = el.scrollWidth - el.clientWidth;
    const widthPct = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
    const leftPct = maxScroll > 0 ? (el.scrollLeft / maxScroll) * (100 - widthPct) : 0;
    setThumb({ widthPct, leftPct });
  }

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  // One image (its rendered width + the flex gap) per arrow press, at
  // every breakpoint — not a full page/viewport width.
  function getStepWidth() {
    const el = scrollerRef.current;
    if (!el) return 0;
    const firstSlide = el.firstElementChild as HTMLElement | null;
    if (!firstSlide) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0");
    return firstSlide.getBoundingClientRect().width + gap;
  }

  function scrollByDirection(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * getStepWidth(), behavior: "smooth" });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByDirection(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByDirection(1);
    }
  }

  function moveToClientX(clientX: number) {
    const track = trackRef.current;
    const el = scrollerRef.current;
    if (!track || !el) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    el.scrollLeft = ratio * (el.scrollWidth - el.clientWidth);
  }

  function handleTrackPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    moveToClientX(event.clientX);
  }

  function handleTrackPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      moveToClientX(event.clientX);
    }
  }

  function handleThumbKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByDirection(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByDirection(1);
    }
  }

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

        <div className="relative mt-16">
          <div
            ref={scrollerRef}
            role="region"
            aria-label="Photos of vehicles we've detailed"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth rounded-2xl [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-scrollbar]:hidden"
          >
            {galleryImages.map((image, index) => (
              <div
                key={image.src}
                className="relative aspect-4/3 w-full shrink-0 snap-start overflow-hidden rounded-2xl border border-ink/10 sm:w-[46%] lg:w-[31%]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 46vw, 31vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scrollByDirection(-1)}
            disabled={atStart}
            aria-label="Show previous photo"
            className="absolute top-1/2 -left-3 -translate-y-1/2 rounded-full bg-white sm:-left-5"
          >
            <ChevronLeft aria-hidden />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scrollByDirection(1)}
            disabled={atEnd}
            aria-label="Show next photo"
            className="absolute top-1/2 -right-3 -translate-y-1/2 rounded-full bg-white sm:-right-5"
          >
            <ChevronRight aria-hidden />
          </Button>
        </div>

        <div
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          className="relative mx-auto mt-6 flex h-6 w-full max-w-xs cursor-pointer touch-none items-center"
        >
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink/10" />
          <div
            role="slider"
            aria-label="Gallery scroll position"
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(
              thumb.widthPct >= 100 ? 0 : (thumb.leftPct / (100 - thumb.widthPct)) * 100
            )}
            tabIndex={0}
            onKeyDown={handleThumbKeyDown}
            style={{ width: `${thumb.widthPct}%`, left: `${thumb.leftPct}%` }}
            className={cn(
              "pointer-events-none absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-brand transition-[left,width] duration-100 ease-out",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            )}
          />
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
