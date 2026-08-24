export const TIMEZONE = "Europe/Tirane";

/** Orari i punës sipas ditës së javës (0 = E Diel). null = mbyllur. */
export const OPENING_HOURS: Record<number, { open: number; close: number; label: string } | null> = {
  0: null,
  1: { open: 9 * 60, close: 20 * 60, label: "09:00 – 20:00" },
  2: { open: 9 * 60, close: 20 * 60, label: "09:00 – 20:00" },
  3: { open: 9 * 60, close: 20 * 60, label: "09:00 – 20:00" },
  4: { open: 9 * 60, close: 20 * 60, label: "09:00 – 20:00" },
  5: { open: 9 * 60, close: 20 * 60, label: "09:00 – 20:00" },
  6: { open: 9 * 60, close: 18 * 60, label: "09:00 – 18:00" },
};

export const DAY_NAMES = [
  "E Diel",
  "E Hënë",
  "E Martë",
  "E Mërkurë",
  "E Enjte",
  "E Premte",
  "E Shtunë",
];

export const DAY_SHORT = ["DIE", "HËN", "MAR", "MËR", "ENJ", "PRE", "SHT"];

export const MONTH_NAMES = [
  "Janar",
  "Shkurt",
  "Mars",
  "Prill",
  "Maj",
  "Qershor",
  "Korrik",
  "Gusht",
  "Shtator",
  "Tetor",
  "Nëntor",
  "Dhjetor",
];

export const SLOT_STEP = 30;
/** Koha minimale përpara terminave të ditës së sotme (në minuta). */
export const LEAD_TIME = 60;

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  return (h || 0) * 60 + (m || 0);
}

export function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Data e sotme në orarin e dyqanit, si YYYY-MM-DD. */
export function todayISO(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "01";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function minutesNow(now = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parseInt(parts.find((p) => p.type === t)?.value ?? "0", 10);
  return get("hour") * 60 + get("minute");
}

export function isoFromParts(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function parseISO(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return { y, m, d };
}

export function weekdayOf(iso: string): number {
  const { y, m, d } = parseISO(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(iso: string, days: number): string {
  const { y, m, d } = parseISO(iso);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return isoFromParts(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

export function formatLongDate(iso: string): string {
  const { y, m, d } = parseISO(iso);
  return `${DAY_NAMES[weekdayOf(iso)]}, ${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

export type Busy = { start: number; end: number };

/** Gjeneron oraret e lira për një ditë, duke respektuar orarin, kohëzgjatjen dhe terminet e zëna. */
export function generateSlots(options: {
  dateISO: string;
  duration: number;
  busy: Busy[];
  now?: Date;
}): { time: string; minutes: number }[] {
  const { dateISO, duration, busy, now = new Date() } = options;
  const day = OPENING_HOURS[weekdayOf(dateISO)];
  if (!day) return [];

  const today = todayISO(now);
  const nowMin = minutesNow(now);
  const earliest = dateISO === today ? nowMin + LEAD_TIME : 0;
  const slots: { time: string; minutes: number }[] = [];

  for (let start = day.open; start + duration <= day.close; start += SLOT_STEP) {
    if (start < earliest) continue;
    const end = start + duration;
    const clash = busy.some((b) => start < b.end && b.start < end);
    if (clash) continue;
    slots.push({ time: toHHMM(start), minutes: start });
  }
  return slots;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} orë` : `${h} orë ${m} min`;
}

export function formatPrice(eur: number): string {
  return `${eur} €`;
}

/** Gjeneron një skedar .ics për terminin e konfirmuar. */
export function buildICS(opts: {
  dateISO: string;
  start: number;
  end: number;
  title: string;
  description: string;
}): string {
  const { y, m, d } = parseISO(opts.dateISO);
  const stamp = (minutes: number, offset: number) => {
    const dt = new Date(Date.UTC(y, m - 1, d + offset));
    const total = minutes;
    const hh = String(Math.floor(total / 60)).padStart(2, "0");
    const mm = String(total % 60).padStart(2, "0");
    return `${dt.getUTCFullYear()}${String(dt.getUTCMonth() + 1).padStart(2, "0")}${String(
      dt.getUTCDate(),
    ).padStart(2, "0")}T${hh}${mm}00`;
  };
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shpend Januzi Hair Studio//Rezervime//SQ",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@shpendjanuzi`,
    `DTSTAMP:${stamp(minutesNow(), 0)}Z`,
    `DTSTART;TZID=${TIMEZONE}:${stamp(opts.start, 0)}`,
    `DTEND;TZID=${TIMEZONE}:${stamp(opts.end, 0)}`,
    `SUMMARY:${esc(opts.title)}`,
    `DESCRIPTION:${esc(opts.description)}`,
    "LOCATION:Shpend Januzi Hair Studio\\, Lipjan",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
