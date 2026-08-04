import Link from "next/link";
import { Clock, CreditCard, Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/site/logo";
import { FacebookIcon, InstagramIcon } from "@/components/site/social-icons";
import { siteConfig } from "@/lib/site-config";

const footerLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/fleet", label: "Commercial & Fleet" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-ink/60">{siteConfig.tagline}</p>
            <div className="mt-5 flex gap-3">
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                className="text-ink/50 transition-colors hover:text-ink"
              >
                <InstagramIcon className="size-5" />
              </a>
              <a
                href={siteConfig.social.facebook}
                aria-label="Facebook"
                className="text-ink/50 transition-colors hover:text-ink"
              >
                <FacebookIcon className="size-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/60">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Business Info</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/60">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-brand" aria-hidden />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-ink">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-brand" aria-hidden />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-ink">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-4 border-t border-ink/10 pt-14 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-xl border border-ink/10 p-5">
            <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-ink">Service Area</p>
              <p className="mt-1 text-sm text-ink/60">
                {siteConfig.city} &amp; {siteConfig.serviceArea}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-ink/10 p-5">
            <CreditCard className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-ink">Payments Accepted</p>
              <p className="mt-1 text-sm text-ink/60">
                {siteConfig.paymentsAccepted.join(", ")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-ink/10 p-5">
            <Clock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-ink">Hours</p>
              {siteConfig.hours.map((h) => (
                <p key={h.days} className="mt-1 text-sm text-ink/60">
                  {h.days}: {h.time}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-8 text-xs text-ink/50 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
