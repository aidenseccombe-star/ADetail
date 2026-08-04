import { MaintenanceWashCard } from "@/components/site/maintenance-wash-card";
import { PackageCard } from "@/components/site/package-card";
import { getPackage } from "@/lib/site-config";

export function Packages() {
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-18 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-sm font-semibold tracking-wide text-brand uppercase">
          Packages
        </h2>
        <p className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-4xl">
          One core detail, built to your car
        </p>
        <p className="mt-4 text-base text-ink/60">
          Choose the level of detail your car needs — each package builds on the one
          before it.
        </p>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        <PackageCard pkg={getPackage("basic-detail")} />
        <PackageCard pkg={getPackage("full-detail")} />
        <PackageCard pkg={getPackage("signature-detail")} />
      </div>

      <div className="mt-8">
        <MaintenanceWashCard pkg={getPackage("maintenance-wash")} />
      </div>
    </section>
  );
}
