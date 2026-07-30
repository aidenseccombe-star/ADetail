import { MailCheck } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand/15">
        <MailCheck className="size-6 text-ink" aria-hidden />
      </div>
      <h1 className="mt-4 text-xl font-black text-ink">Check your email</h1>
      <p className="mt-2 text-sm text-ink/60">
        We sent you a confirmation link. Click it to activate your account and finish
        signing in.
      </p>
    </div>
  );
}
