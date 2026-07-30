"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { testimonials as testimonialsData } from "@/lib/site-config";

type TestimonialsCarouselProps = {
  testimonials: typeof testimonialsData;
};

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [index, testimonials.length]);

  const t = testimonials[index];

  return (
    <div className="mt-16">
      <div className="relative mx-auto max-w-2xl">
        <Card className="border-ink/10 shadow-none">
          <CardContent className="flex flex-col items-center gap-4 px-8 py-10 text-center sm:px-14">
            <div className="flex gap-0.5 text-brand">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" aria-hidden />
              ))}
            </div>
            <p className="text-base text-ink/70">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-ink text-xs font-semibold text-white">
                  {t.initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <span className="block text-sm font-semibold text-ink">{t.name}</span>
                {"reviewerMeta" in t && (
                  <span className="block text-xs text-ink/50">{t.reviewerMeta}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute top-1/2 -left-4 -translate-y-1/2 rounded-full bg-white sm:-left-12"
          onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute top-1/2 -right-4 -translate-y-1/2 rounded-full bg-white sm:-right-12"
          onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {testimonials.map((item, i) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-6 bg-brand" : "w-2 bg-ink/15 hover:bg-ink/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
