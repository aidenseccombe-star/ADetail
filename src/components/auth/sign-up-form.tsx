"use client";

import Link from "next/link";
import { useActionState } from "react";

import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithPassword } from "@/lib/actions/auth";

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpWithPassword, undefined);

  return (
    <div className="space-y-6">
      <GoogleButton next="/dashboard" />

      <div className="flex items-center gap-3 text-xs font-medium text-ink/40">
        <div className="h-px flex-1 bg-ink/10" />
        OR
        <div className="h-px flex-1 bg-ink/10" />
      </div>

      <form action={action} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button
          type="submit"
          variant="brand"
          size="lg"
          className="w-full"
          disabled={pending}
        >
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-ink hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
