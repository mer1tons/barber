import { db } from "@/db";
import { barbers, bookings, services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jsonError } from "@/lib/api";
import { formatLongDate, toHHMM } from "@/lib/time";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ code: string }> };

async function findBooking(code: string) {
  const rows = await db
    .select({ booking: bookings, service: services, barber: barbers })
    .from(bookings)
    .leftJoin(services, eq(bookings.serviceId, services.id))
    .leftJoin(barbers, eq(bookings.barberId, barbers.id))
    .where(eq(bookings.code, code.toUpperCase()))
    .limit(1);
  return rows[0];
}

export async function GET(_req: Request, { params }: Params) {
  const { code } = await params;
  if (!code || code.trim().length < 3) return jsonError("Kod i pavlefshëm", 400);

  const row = await findBooking(code.trim());
  if (!row) return jsonError("Nuk u gjet asnjë term me këtë kod", 404);

  return Response.json({
    ok: true,
    booking: {
      code: row.booking.code,
      status: row.booking.status,
      date: row.booking.date,
      dateLabel: formatLongDate(row.booking.date),
      time: toHHMM(row.booking.startMinutes),
      endTime: toHHMM(row.booking.endMinutes),
      service: row.service?.name ?? "—",
      barber: row.barber?.name ?? "—",
      price: row.service?.price ?? 0,
      customerName: row.booking.customerName,
      phone: row.booking.phone,
      notes: row.booking.notes,
    },
  });
}

export async function PATCH(req: Request, { params }: Params) {
  const { code } = await params;
  const row = await findBooking(code.trim());
  if (!row) return jsonError("Nuk u gjet asnjë term me këtë kod", 404);

  const body = (await req.json().catch(() => ({}))) as { status?: string };
  const next = body.status;

  if (next !== "cancelled" && next !== "confirmed" && next !== "completed") {
    return jsonError("Status i pavlefshëm");
  }
  if (row.booking.status === "cancelled") {
    return jsonError("Ky term është anuluar tashmë");
  }

  const [updated] = await db
    .update(bookings)
    .set({ status: next })
    .where(eq(bookings.id, row.booking.id))
    .returning();

  return Response.json({ ok: true, status: updated.status });
}
