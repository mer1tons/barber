import { db } from "@/db";
import { barbers, bookings, services } from "@/db/schema";
import { and, desc, eq, gte, ne, sql } from "drizzle-orm";
import {
  LEAD_TIME,
  OPENING_HOURS,
  SLOT_STEP,
  addDays,
  minutesNow,
  toHHMM,
  todayISO,
  weekdayOf,
} from "@/lib/time";
import { isAdmin, jsonError, makeCode } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET: lista e termineve (vetëm për admin me header x-admin-code). */
export async function GET(req: Request) {
  if (!isAdmin(req)) return jsonError("I paautorizuar", 401);

  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  const status = url.searchParams.get("status");

  const conditions = [];
  if (date) conditions.push(eq(bookings.date, date));
  else conditions.push(gte(bookings.date, todayISO()));
  if (status && status !== "all") conditions.push(eq(bookings.status, status as "pending"));

  const rows = await db
    .select({
      booking: bookings,
      service: services.name,
      barber: barbers.name,
    })
    .from(bookings)
    .leftJoin(services, eq(bookings.serviceId, services.id))
    .leftJoin(barbers, eq(bookings.barberId, barbers.id))
    .where(and(...conditions))
    .orderBy(bookings.date, bookings.startMinutes);

  return Response.json({ ok: true, bookings: rows });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Trup i pavlefshëm JSON");
  }

  const serviceId = Number(body.serviceId);
  const barberId = Number(body.barberId);
  const dateISO = typeof body.date === "string" ? body.date.trim() : "";
  const timeRaw = typeof body.time === "string" ? body.time.trim() : "";
  const customerName = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 500) : "";

  if (!Number.isInteger(serviceId) || !Number.isInteger(barberId)) {
    return jsonError("Shërbimi ose berberi mungon");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) return jsonError("Datë e pavlefshme");
  if (!/^\d{2}:\d{2}$/.test(timeRaw)) return jsonError("Orë e pavlefshme");
  if (customerName.length < 2) return jsonError("Shkruaj emrin tënd");
  if (!/^[+0-9][0-9\s-]{5,19}$/.test(phone)) return jsonError("Numri i telefonit nuk është i saktë");
  if (email && !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) return jsonError("Email-i nuk është i saktë");

  const today = todayISO();
  if (dateISO < today || dateISO > addDays(today, 90)) {
    return jsonError("Zgjidh një datë brenda 90 ditëve të ardhshme");
  }

  const day = OPENING_HOURS[weekdayOf(dateISO)];
  if (!day) return jsonError("Të dielën studioja është e mbyllur");

  const [service] = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
  if (!service || !service.active) return jsonError("Shërbimi nuk ekziston");

  const [barber] = await db.select().from(barbers).where(eq(barbers.id, barberId)).limit(1);
  if (!barber || !barber.active) return jsonError("Berberi nuk ekziston");

  const start = Number(timeRaw.slice(0, 2)) * 60 + Number(timeRaw.slice(3, 5));
  const end = start + service.duration;

  if (start % SLOT_STEP !== 0 || start < day.open || end > day.close) {
    return jsonError("Ky orar është jashtë orarit të punës");
  }
  if (dateISO === today && start < minutesNow() + LEAD_TIME) {
    return jsonError("Rezervo të paktën 1 orë përpara");
  }

  try {
    const created = await db.transaction(async (tx) => {
      const clash = await tx
        .select({ id: bookings.id })
        .from(bookings)
        .where(
          and(
            eq(bookings.barberId, barberId),
            eq(bookings.date, dateISO),
            ne(bookings.status, "cancelled"),
            sql`${bookings.startMinutes} < ${end}`,
            sql`${bookings.endMinutes} > ${start}`,
          ),
        )
        .limit(1);

      if (clash.length > 0) {
        throw new Error("CONFLICT: Ky orar sapo u zu. Zgjidh një orar tjetër.");
      }

      const code = makeCode();
      const [row] = await tx
        .insert(bookings)
        .values({
          code,
          serviceId,
          barberId,
          date: dateISO,
          startMinutes: start,
          endMinutes: end,
          customerName,
          phone,
          email: email || null,
          notes: notes || null,
          status: "confirmed",
        })
        .returning();

      return row;
    });

    return Response.json({
      ok: true,
      booking: {
        code: created.code,
        date: created.date,
        time: toHHMM(created.startMinutes),
        endTime: toHHMM(created.endMinutes),
        service: service.name,
        barber: barber.name,
        price: service.price,
        duration: service.duration,
        status: created.status,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Rezervimi dështoi";
    if (message.startsWith("CONFLICT:")) {
      return jsonError(message.replace("CONFLICT: ", ""), 409);
    }
    console.error("[bookings] create failed:", message);
    return jsonError("Rezervimi dështoi. Provo përsëri.", 500);
  }
}
