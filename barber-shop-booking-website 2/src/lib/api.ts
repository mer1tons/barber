import { db } from "@/db";
import { bookings, services } from "@/db/schema";
import { asc, eq, inArray } from "drizzle-orm";

export const ADMIN_CODE = process.env.ADMIN_CODE || "lipjan2026";

export function isAdmin(req: Request): boolean {
  const header = req.headers.get("x-admin-code") || "";
  return header.length > 0 && header === ADMIN_CODE;
}

export async function getActiveServices() {
  return db.select().from(services).where(eq(services.active, true)).orderBy(asc(services.sortOrder));
}

export async function getUpcomingBookingsFor(barberIds: number[], dateISO: string) {
  if (barberIds.length === 0) return [];
  return db
    .select()
    .from(bookings)
    .where(inArray(bookings.barberId, barberIds));
}

export function makeCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 4; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `SJ-${out}`;
}

export function jsonError(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}
