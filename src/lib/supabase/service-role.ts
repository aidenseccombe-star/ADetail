import { createClient } from "@supabase/supabase-js";

// Server-only client authenticated with the service role key — bypasses RLS
// entirely. Only for trusted server contexts with no end user attached (e.g.
// the recurring-bookings cron route). Never import this from client code or
// anything reachable from a browser bundle.
export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
