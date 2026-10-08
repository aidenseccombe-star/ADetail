import { randomBytes } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { getCalendarAuthUrl } from "@/lib/google/calendar";
import { createClient } from "@/lib/supabase/server";

// One-time (or re-authorize-anytime) admin action: click "Connect" on
// /admin, land here, get redirected to Google's consent screen, come back
// at the callback route below. Session-gated the same way /admin itself is
// — not just anyone who finds this URL can start the flow.
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // CSRF defense for the OAuth round trip: a random value that must come
  // back unchanged on the callback, compared against this same cookie.
  const state = randomBytes(16).toString("hex");
  const authUrl = getCalendarAuthUrl(state);

  const response = NextResponse.redirect(authUrl);
  response.cookies.set("google_calendar_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 300,
    path: "/",
  });

  return response;
}
