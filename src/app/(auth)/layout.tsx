import Link from "next/link";

import { Logo } from "@/components/site/logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/40 px-4 py-16">
      <Link href="/" className="mb-8" aria-label="A Detail home">
        <Logo />
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
