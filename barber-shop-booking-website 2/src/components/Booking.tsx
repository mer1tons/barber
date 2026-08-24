"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { ScrambleText } from "./ScrambleText";
import { ArrowIcon, CalendarIcon, CheckIcon, ClockIcon, SparkIcon } from "./icons";
import {
  DAY_SHORT,
  MONTH_NAMES,
  addDays,
  buildICS,
  formatDuration,
  formatLongDate,
  todayISO,
  weekdayOf,
} from "@/lib/time";
import type { BarberItem } from "./Team";
import type { ServiceItem } from "./Services";

type Confirmed = {
  code: string;
  date: string;
  time: string;
  endTime: string;
  service: string;
  barber: string;
  price: number;
  duration: number;
};

const STEPS = ["Shërbimi", "Berberi", "Data & ora", "Të dhënat"];

export function Booking({
  services,
  barbers,
}: {
  services: ServiceItem[];
  barbers: BarberItem[];
}) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [barberId, setBarberId] = useState<number | null>(null);
  const [date, setDate] = useState<string>(todayISO());
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [closed, setClosed] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Confirmed | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const service = services.find((s) => s.id === serviceId) ?? null;
  const barber = barbers.find((b) => b.id === barberId) ?? null;

  const days = useMemo(() => {
    const start = todayISO();
    return Array.from({ length: 21 }, (_, i) => addDays(start, i));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        serviceId?: number;
        barberId?: number;
        date?: string;
        time?: string;
      };
      setDone(null);
      let nextStep = step;

      if (detail.serviceId && services.some((s) => s.id === detail.serviceId)) {
        setServiceId(detail.serviceId);
        setTime(null);
        nextStep = 1;
      }
      if (detail.barberId && barbers.some((b) => b.id === detail.barberId)) {
        setBarberId(detail.barberId);
        nextStep = 2;
      }
      if (detail.date) {
        setDate(detail.date);
        nextStep = 2;
      }
      if (detail.time) {
        setTime(detail.time);
        nextStep = 3;
      }
      setStep(nextStep);
    };
    window.addEventListener("sj:preselect", handler as EventListener);
    return () => window.removeEventListener("sj:preselect", handler as EventListener);
  }, [services, barbers, step]);

  useEffect(() => {
    if (!barberId || !service) {
      setSlots(null);
      return;
    }
    let alive = true;
    setLoadingSlots(true);
    setSlots(null);
    setClosed(false);
    fetch(`/api/availability?barberId=${barberId}&date=${date}&duration=${service.duration}`)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (data?.ok) {
          setSlots(data.slots as string[]);
          setClosed(Boolean(data.closed));
        } else {
          setSlots([]);
        }
      })
      .catch(() => alive && setSlots([]))
      .finally(() => alive && setLoadingSlots(false));
    return () => {
      alive = false;
    };
  }, [barberId, service, date]);

  const endTimeLabel = useMemo(() => {
    if (!service || !time) return "—";
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + service.duration;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }, [service, time]);

  const canNext = step === 0 ? Boolean(service) : step === 1 ? Boolean(barber) : step === 2 ? Boolean(time) : true;

  const submit = async () => {
    if (!service || !barber || !time) return;
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          barberId: barber.id,
          date,
          time,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data?.error ?? "Diçka shkoi keq. Provo përsëri.");
        if (res.status === 409) {
          setTime(null);
        }
        return;
      }
      setDone(data.booking as Confirmed);
      setStep(4);
    } catch {
      setError("Nuk u lidhëm me serverin. Kontrollo internetin.");
    } finally {
      setSending(false);
    }
  };

  const downloadIcs = (b: Confirmed) => {
    const ics = buildICS({
      dateISO: b.date,
      start: Number(b.time.slice(0, 2)) * 60 + Number(b.time.slice(3, 5)),
      end: Number(b.endTime.slice(0, 2)) * 60 + Number(b.endTime.slice(3, 5)),
      title: `${b.service} — Shpend Januzi Hair Studio`,
      description: `Berberi: ${b.barber}. Kodi: ${b.code}`,
    });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `termini-${b.code}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setDone(null);
    setStep(0);
    setServiceId(null);
    setBarberId(null);
    setTime(null);
    setForm({ name: "", phone: "", email: "", notes: "" });
  };

  if (done) {
    return (
      <section id="rezervo" className="relative border-b border-line/60 bg-ink py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-10">
          <span className="mx-auto grid h-20 w-20 animate-pulse-ring place-items-center rounded-full border border-brass text-brass">
            <CheckIcon className="h-9 w-9" />
          </span>
          <h2 className="display mt-8 text-[clamp(2.4rem,7vw,4.6rem)] text-bone">
            Termi u konfirmua
          </h2>
          <p className="mt-3 text-bone-3">
            Ruaje kodin — të duhet për ta kontrolluar ose anuluar terminin.
          </p>

          <div className="mt-10 border border-brass/50 bg-char p-8 text-left">
            <p className="eyebrow text-center">Kodi i termit</p>
            <p className="display mt-3 text-center text-6xl tracking-widest text-brass">
              {done.code}
            </p>
            <div className="mt-8 grid gap-px bg-line/60 sm:grid-cols-2">
              {[
                ["Shërbimi", done.service],
                ["Berberi", done.barber],
                ["Data", formatLongDate(done.date)],
                ["Ora", `${done.time} – ${done.endTime}`],
                ["Kohëzgjatja", formatDuration(done.duration)],
                ["Çmimi", `${done.price} €`],
              ].map(([k, v]) => (
                <div key={k} className="bg-char px-4 py-4">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-bone-3">
                    {k}
                  </p>
                  <p className="mt-1 text-sm text-bone">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => downloadIcs(done)} className="btn">
              <span>Shto në kalendar</span>
            </button>
            <a href="#kontrollo" className="btn btn-ghost">
              <span>Kontrollo / anulo</span>
            </a>
            <button type="button" onClick={reset} className="btn btn-ghost">
              <span>Rezervo tjetër</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rezervo" className="relative border-b border-line/60 bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-brass" />
                Rezervim online
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display text-[clamp(2.8rem,8vw,6.4rem)] text-bone">
                <ScrambleText text="Zë një termin" />
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <p className="max-w-sm text-sm leading-relaxed text-bone-3">
              Katër hapa, pa llogari dhe pa pagesë të parakohshme. Oraret janë të vërteta — merren
              direkt nga agjenda e berberit.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="border border-line/70 bg-ink-2">
            <ol className="grid grid-cols-2 border-b border-line/70 sm:grid-cols-4">
              {STEPS.map((label, i) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                    className={`flex w-full items-center gap-2 px-4 py-4 text-left font-mono text-[0.6rem] uppercase tracking-[0.16em] transition-colors ${
                      i === step
                        ? "bg-brass/12 text-brass"
                        : i < step
                          ? "text-bone-2 hover:bg-char"
                          : "text-bone-3/45"
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center border text-[0.6rem] ${
                        i < step
                          ? "border-brass bg-brass text-ink"
                          : i === step
                            ? "border-brass text-brass"
                            : "border-line"
                      }`}
                    >
                      {i < step ? "✓" : i + 1}
                    </span>
                    <span className="truncate">{label}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="p-5 md:p-8">
              {step === 0 && (
                <div>
                  <h3 className="display text-3xl text-bone">Çfarë po bëjmë sot?</h3>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {services.map((s) => {
                      const on = s.id === serviceId;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setServiceId(s.id);
                            setTime(null);
                          }}
                          className={`group border p-4 text-left transition-all duration-300 ${
                            on
                              ? "border-brass bg-brass/10"
                              : "border-line hover:border-brass/60 hover:bg-char"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="display text-2xl text-bone">{s.name}</span>
                            <span className="display text-2xl text-brass">{s.price}€</span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-xs text-bone-3">{s.description}</p>
                          <p className="mt-3 flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-bone-3">
                            <ClockIcon className="h-3.5 w-3.5" />
                            {formatDuration(s.duration)}
                            {on && (
                              <span className="ml-auto flex items-center gap-1 text-brass">
                                <CheckIcon className="h-3.5 w-3.5" /> zgjedhur
                              </span>
                            )}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="display text-3xl text-bone">Kujt i beson?</h3>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {barbers.map((b) => {
                      const on = b.id === barberId;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setBarberId(b.id);
                            setTime(null);
                          }}
                          className={`group overflow-hidden border text-left transition-all duration-300 ${
                            on ? "border-brass bg-brass/10" : "border-line hover:border-brass/60"
                          }`}
                        >
                          <img
                            src={b.avatarUrl}
                            alt={b.name}
                            loading="lazy"
                            className="h-40 w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                          />
                          <span className="block p-4">
                            <span className="display block text-xl text-bone">{b.name}</span>
                            <span className="mt-1 block font-mono text-[0.56rem] uppercase tracking-[0.18em] text-brass">
                              {b.role}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="display text-3xl text-bone">Kur të përshtatet?</h3>

                  <div
                    ref={stripRef}
                    className="mt-6 flex gap-2 overflow-x-auto pb-3 [scrollbar-width:thin]"
                  >
                    {days.map((d) => {
                      const wd = weekdayOf(d);
                      const isClosed = wd === 0;
                      const on = d === date;
                      const [, mm, dd] = d.split("-");
                      return (
                        <button
                          key={d}
                          type="button"
                          disabled={isClosed}
                          onClick={() => {
                            setDate(d);
                            setTime(null);
                          }}
                          className={`flex w-[68px] shrink-0 flex-col items-center gap-1 border px-2 py-3 transition-all duration-300 ${
                            isClosed
                              ? "cursor-not-allowed border-line/40 text-bone-3/30"
                              : on
                                ? "border-brass bg-brass text-ink"
                                : "border-line text-bone-2 hover:border-brass/70 hover:bg-char"
                          }`}
                        >
                          <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em]">
                            {DAY_SHORT[wd]}
                          </span>
                          <span className="display text-3xl leading-none">{dd}</span>
                          <span className="font-mono text-[0.5rem] uppercase tracking-[0.14em] opacity-70">
                            {MONTH_NAMES[Number(mm) - 1].slice(0, 3)}
                          </span>
                          {isClosed && <span className="font-mono text-[0.5rem]">mbyllur</span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex items-center justify-between border-b border-line/60 pb-3">
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone-3">
                      Oraret e lira · {formatLongDate(date)}
                    </span>
                    {service && (
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-brass">
                        {formatDuration(service.duration)}
                      </span>
                    )}
                  </div>

                  <div className="mt-5">
                    {loadingSlots && (
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <span key={i} className="h-11 animate-pulse bg-smoke/70" />
                        ))}
                      </div>
                    )}
                    {!loadingSlots && closed && (
                      <p className="border border-line bg-char px-4 py-6 text-center text-sm text-bone-3">
                        Të dielën studioja pushon. Zgjidh një ditë tjetër.
                      </p>
                    )}
                    {!loadingSlots && !closed && slots && slots.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
                        {slots.map((s) => {
                          const on = s === time;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setTime(s)}
                              className={`border py-3 font-mono text-sm transition-all duration-200 ${
                                on
                                  ? "border-brass bg-brass text-ink"
                                  : "border-line text-bone-2 hover:border-brass hover:bg-char"
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {!loadingSlots && !closed && slots && slots.length === 0 && (
                      <p className="border border-line bg-char px-4 py-6 text-center text-sm text-bone-3">
                        Nuk ka më orare të lira për këtë ditë te ky berber. Provo një ditë tjetër
                        ose zgjidh berber tjetër.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="display text-3xl text-bone">Ku të të gjejmë?</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="eyebrow mb-2 block">Emri *</span>
                      <input
                        className="field"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="p.sh. Arben Krasniqi"
                        autoComplete="name"
                      />
                    </label>
                    <label className="block">
                      <span className="eyebrow mb-2 block">Telefoni *</span>
                      <input
                        className="field"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+383 44 000 000"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="eyebrow mb-2 block">Email (opsional)</span>
                      <input
                        className="field"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="ti@shembull.com"
                        inputMode="email"
                        autoComplete="email"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="eyebrow mb-2 block">Shënim për berberin</span>
                      <textarea
                        className="field min-h-[100px] resize-y"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Fade #2 anash, lart me gërshërë…"
                      />
                    </label>
                  </div>
                  {error && (
                    <p className="mt-5 border border-rust/60 bg-rust/10 px-4 py-3 text-sm text-bone">
                      {error}
                    </p>
                  )}
                  <p className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-bone-3">
                    Duke rezervuar pranoni kushtet: ardhja në kohë, anulim 3 orë përpara.
                  </p>
                </div>
              )}

              <div className="mt-9 flex items-center justify-between border-t border-line/60 pt-6">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-bone-3 transition-colors hover:text-bone disabled:opacity-30"
                >
                  ← Kthehu
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => canNext && setStep((s) => s + 1)}
                    disabled={!canNext}
                    className="btn disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <span>Vazhdo</span>
                    <ArrowIcon className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={sending || form.name.trim().length < 2 || form.phone.trim().length < 6}
                    className="btn disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <span>{sending ? "Duke rezervuar…" : "Konfirmo terminin"}</span>
                    {sending ? <SparkIcon className="h-4 w-4 animate-spin-slow" /> : <CheckIcon className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line/70 bg-char p-6">
              <p className="eyebrow mb-5">Përmbledhja</p>
              <dl className="space-y-4 text-sm">
                {[
                  ["Shërbimi", service ? service.name : "—"],
                  ["Berberi", barber ? barber.name : "—"],
                  ["Data", date ? formatLongDate(date) : "—"],
                  ["Ora", time ? `${time} – ${endTimeLabel}` : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line/60 pb-3">
                    <dt className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-bone-3">
                      {k}
                    </dt>
                    <dd className="text-right text-bone">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-end justify-between">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-bone-3">
                  Totali
                </span>
                <span className="display text-5xl text-brass">{service ? `${service.price}€` : "—"}</span>
              </div>
              <p className="mt-4 flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-bone-3">
                <CalendarIcon className="h-4 w-4 text-brass" />
                Pagesa bëhet në studio
              </p>
            </div>

            <div className="mt-4 border border-line/70 p-6">
              <p className="font-serif text-lg italic text-bone-2">
                “Nuk të duhet as llogari as kartelë — vetëm emri dhe numri.”
              </p>
              <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-bone-3">
                Rezervimi zgjat 30 sekonda
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
