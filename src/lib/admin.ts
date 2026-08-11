import { adminEmail } from "@/lib/site-config";

export function isAdmin(email: string | null | undefined) {
  return !!email && email === adminEmail;
}
