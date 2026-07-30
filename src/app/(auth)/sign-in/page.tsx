import type { Metadata } from "next";

import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in | A Detail",
  description: "Sign in to your A Detail account to manage your mobile detailing bookings.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <>
      <h1 className="text-xl font-black text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-ink/60">Sign in to manage your bookings.</p>
      <div className="mt-6">
        <SignInForm next={next ?? "/dashboard"} />
      </div>
    </>
  );
}
