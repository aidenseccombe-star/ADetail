import { Star } from "lucide-react";

import { TestimonialsCarousel } from "@/components/site/testimonials-carousel";
import { Badge } from "@/components/ui/badge";
import { siteConfig, testimonials } from "@/lib/site-config";

export function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-6xl scroll-mt-18 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-sm font-semibold tracking-wide text-brand uppercase">
          Testimonials
        </h2>
        <p className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Trusted with the keys
        </p>
        <Badge variant="outline" className="mt-4 gap-1.5 border-brand/40 text-ink">
          <Star className="size-3.5 fill-brand text-brand" aria-hidden />
          {siteConfig.rating} rating on Google
        </Badge>
      </div>

      <TestimonialsCarousel testimonials={testimonials} />
    </section>
  );
}
