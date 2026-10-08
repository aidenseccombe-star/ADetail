import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { storeRefreshTokenFromCode } from "@/lib/google/calendar";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  function redirectTo(destination: string) {
    const response = NextResponse.redirect(new URL(destination, request.url));
    response.cookies.delete("google_calendar_oauth_state");
    return response;
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get("google_calendar_oauth_state")?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    console.error("Google Calendar OAuth callback: missing or mismatched state");
    return redirectTo("/admin?calendar=error");
  }

  try {
    await storeRefreshTokenFromCode(code);
  } catch (error) {
    console.error("Failed to store Google Calendar refresh token", error);
    return redirectTo("/admin?calendar=error");
  }

  return redirectTo("/admin?calendar=connected");
}
