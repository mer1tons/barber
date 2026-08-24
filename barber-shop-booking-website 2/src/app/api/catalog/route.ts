import { barbers, services } from "@/db/schema";
import { db } from "@/db";
import { asc, eq } from "drizzle-orm";
import { getActiveServices } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const [serviceList, barberList] = await Promise.all([
    getActiveServices(),
    db.select().from(barbers).where(eq(barbers.active, true)).orderBy(asc(barbers.sortOrder)),
  ]);

  const categories = Array.from(new Set(serviceList.map((s) => s.category)));

  return Response.json({
    ok: true,
    services: serviceList satisfies typeof services.$inferSelect[],
    barbers: barberList,
    categories,
  });
}
