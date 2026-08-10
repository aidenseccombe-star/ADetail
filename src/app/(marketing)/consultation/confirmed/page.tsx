import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export default function ConsultationConfirmedPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand/15">
        <Sparkles className="size-6 text-ink" aria-hidden />
      </div>
      <h1 className="mt-4 text-2xl font-black text-ink">Consultation requested</h1>
      <p className="mt-2 text-sm text-ink/60">
        Thanks! We&apos;ll review your vehicle details and follow up by phone or email
        with a personalized ceramic coating quote. If it&apos;s urgent, call us at{" "}
        <a href={siteConfig.phoneHref} className="font-medium text-ink underline">
          {siteConfig.phone}
        </a>
        .
      </p>
      <Button variant="outline" size="lg" className="mt-8" render={<Link href="/" />}>
        Back to home
      </Button>
    </div>
  );
}
