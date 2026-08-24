import { db } from "@/db";
import { barbers, bookings } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { OPENING_HOURS, generateSlots, weekdayOf, addDays, todayISO } from "@/lib/time";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const barberId = Number(url.searchParams.get("barberId"));
  const duration = Number(url.searchParams.get("duration"));
  const dateISO = url.searchParams.get("date") ?? todayISO();

  if (!Number.isInteger(barberId) || !Number.isInteger(duration) || duration <= 0) {
    return Response.json({ ok: false, error: "Parametra të pavlefshëm" }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
    return Response.json({ ok: false, error: "Datë e pavlefshme" }, { status: 400 });
  }

  const today = todayISO();
  if (dateISO < today || dateISO > addDays(today, 90)) {
    return Response.json({ ok: false, error: "Datë jashtë periudhës së rezervimit" }, { status: 400 });
  }

  const day = OPENING_HOURS[weekdayOf(dateISO)];
  const barber = await db.select().from(barbers).where(eq(barbers.id, barberId)).limit(1);
  if (barber.length === 0) {
    return Response.json({ ok: false, error: "Berberi nuk u gjet" }, { status: 404 });
  }

  if (!day) {
    return Response.json({ ok: true, date: dateISO, closed: true, slots: [] });
  }

  const taken = await db
    .select({
      start: bookings.startMinutes,
      end: bookings.endMinutes,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.barberId, barberId),
        eq(bookings.date, dateISO),
        ne(bookings.status, "cancelled"),
      ),
    );

  const slots = generateSlots({
    dateISO,
    duration,
    busy: taken.map((t) => ({ start: t.start, end: t.end })),
  });

  return Response.json({
    ok: true,
    date: dateISO,
    closed: false,
    open: day.label,
    slots: slots.map((s) => s.time),
    totalSlots: Math.max(0, Math.ceil(((day.close - day.open - duration) / 30) + 1)),
  });
}


