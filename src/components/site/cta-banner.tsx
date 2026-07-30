import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center lg:px-8">
        <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Ready for a showroom finish?
        </p>
        <p className="max-w-md text-white/60">
          Pick a time that works for you — we&apos;ll come to your home or office.
        </p>
        <Button
          variant="brand"
          size="lg"
          className="h-12 px-10 text-base"
          render={<Link href="/book" />}
        >
          Book Now
        </Button>
      </div>
    </section>
  );
}
