import { siteConfig } from "@/lib/site-config";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl scroll-mt-18 px-6 py-20 text-center lg:px-8">
      <h2 className="text-sm font-semibold tracking-wide text-brand uppercase">About</h2>
      <p className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl">
        Owner-operated, every job.
      </p>
      <p className="mt-4 text-base text-ink/70">
        {siteConfig.name} is owned and operated by {siteConfig.ownerName}, serving{" "}
        {siteConfig.city} and {siteConfig.serviceArea}.
      </p>
    </section>
  );
}
