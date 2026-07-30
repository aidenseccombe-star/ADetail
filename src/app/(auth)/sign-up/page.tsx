import type { Metadata } from "next";

import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign up | A Detail",
  description: "Create an A Detail account to book and track your mobile detailing appointments.",
};

export default function SignUpPage() {
  return (
    <>
      <h1 className="text-xl font-black text-ink">Create your account</h1>
      <p className="mt-1 text-sm text-ink/60">
        Book details and track your appointments in one place.
      </p>
      <div className="mt-6">
        <SignUpForm />
      </div>
    </>
  );
}
