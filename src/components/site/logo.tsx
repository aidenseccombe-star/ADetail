import { cn } from "@/lib/utils";

// Placeholder wordmark matching the brand until the real logo file is dropped in.
// Swap this for an <Image src="/logo.svg" .../> once the asset is uploaded.
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-brand px-3 py-1.5 leading-none font-black tracking-tight text-brand-foreground",
        className
      )}
    >
      <span className="inline-block skew-x-[-12deg]">A</span>
      <span>DETAIL</span>
    </span>
  );
}
