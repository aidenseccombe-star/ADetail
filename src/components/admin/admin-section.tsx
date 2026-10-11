import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// "Needs attention" renders without a trigger at all (alwaysOpen) — it's the
// one section the owner should never be able to collapse away by accident.
export function AdminSection({
  title,
  count,
  defaultOpen = false,
  alwaysOpen = false,
  children,
}: {
  title: string;
  count: number;
  defaultOpen?: boolean;
  alwaysOpen?: boolean;
  children: ReactNode;
}) {
  const header = (
    <>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <span className="text-sm font-normal text-ink/50">{count}</span>
    </>
  );

  if (alwaysOpen) {
    return (
      <section className="mt-8">
        <div className="flex min-h-11 items-center gap-2">{header}</div>
        <div className="mt-3">{children}</div>
      </section>
    );
  }

  return (
    <Collapsible defaultOpen={defaultOpen} className="mt-8">
      <CollapsibleTrigger className="flex min-h-11 w-full items-center gap-2 text-left">
        {header}
        <ChevronDown className="ml-auto size-4 shrink-0 text-ink/50 transition-transform duration-200 in-data-[panel-open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsiblePanel className="mt-3">{children}</CollapsiblePanel>
    </Collapsible>
  );
}
