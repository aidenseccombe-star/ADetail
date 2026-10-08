import { google } from "googleapis";

import { businessTimeZone } from "@/lib/site-config";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

// Both scopes are requested together in the one OAuth grant — .events now,
// for creating booking events, and .readonly for a later feature (reading
// free/busy to block the public booking calendar) — so that feature needs
// no re-authorization when it's built.
export const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

// Deliberately a separate OAuth client from the one behind "Sign in with
// Google" (GOOGLE_CLIENT_ID/SECRET, configured in the Supabase dashboard for
// customer auth) — this one is owned by this app directly, never touches
// the customer-facing consent screen, and is scoped to Calendar access only.
function getOAuthClient() {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "GOOGLE_CALENDAR_CLIENT_ID, GOOGLE_CALENDAR_CLIENT_SECRET, or GOOGLE_CALENDAR_REDIRECT_URI is not set."
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getCalendarAuthUrl(state: string): string {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    // Forces Google to re-issue a refresh token on every authorization, not
    // just the first one — required for "re-authorize later" to work, since
    // Google normally only returns a refresh token the very first time a
    // user grants access.
    prompt: "consent",
    scope: GOOGLE_CALENDAR_SCOPES,
    state,
  });
}

export async function storeRefreshTokenFromCode(code: string): Promise<void> {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh token. If you've connected before, revoke A Detail's " +
        "access at https://myaccount.google.com/permissions and try connecting again."
    );
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("google_calendar_tokens").upsert(
    {
      id: 1,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope ?? GOOGLE_CALENDAR_SCOPES.join(" "),
    },
    { onConflict: "id" }
  );

  if (error) throw error;
}

export async function isCalendarConnected(): Promise<boolean> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("google_calendar_tokens")
    .select("id")
    .eq("id", 1)
    .maybeSingle();

  return !!data;
}

async function getAuthorizedClient() {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("google_calendar_tokens")
    .select("refresh_token")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Google Calendar is not connected yet.");

  const client = getOAuthClient();
  // Only the refresh token needs to be stored — the googleapis client
  // transparently exchanges it for a fresh access token on demand.
  client.setCredentials({ refresh_token: data.refresh_token });
  return client;
}

// Adds minutes to a wall-clock date + time and returns the resulting
// wall-clock date + time, with correct day/month rollover. Date.UTC here is
// purely a scratch calendar for that rollover arithmetic — the result is
// never treated as a real UTC instant, so this has nothing to do with (and
// doesn't need) the DST-safe zone-offset math the cron generator uses: the
// Google Calendar API is handed `{ dateTime, timeZone }` separately and does
// its own timezone-correct interpretation of these wall-clock strings.
function addMinutesToWallClock(date: string, time: string, minutes: number) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const scratch = new Date(Date.UTC(year, month - 1, day, hour, minute) + minutes * 60000);

  return {
    date: scratch.toISOString().slice(0, 10),
    time: scratch.toISOString().slice(11, 16),
  };
}

export type CalendarEventInput = {
  serviceTier: string;
  vehicleType: string | null;
  customerName: string;
  phone: string;
  address: string;
  date: string; // YYYY-MM-DD, business-local calendar date
  time: string; // HH:MM, 24-hour, business-local wall clock
  durationMinutes: number;
};

export async function createCalendarEvent(input: CalendarEventInput): Promise<string> {
  const client = await getAuthorizedClient();
  const calendar = google.calendar({ version: "v3", auth: client });
  const end = addMinutesToWallClock(input.date, input.time, input.durationMinutes);

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: `${input.serviceTier} — ${input.customerName}`,
      location: input.address,
      description: [
        `Vehicle type: ${input.vehicleType ?? "—"}`,
        `Phone: ${input.phone}`,
      ].join("\n"),
      start: { dateTime: `${input.date}T${input.time}:00`, timeZone: businessTimeZone },
      end: { dateTime: `${end.date}T${end.time}:00`, timeZone: businessTimeZone },
    },
  });

  const eventId = response.data.id;
  if (!eventId) throw new Error("Google Calendar did not return an event id.");
  return eventId;
}
