"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { ScrambleText } from "./ScrambleText";
import { CheckIcon, SearchIcon } from "./icons";

type Found = {
  code: string;
  status: string;
  dateLabel: string;
  time: string;
  endTime: string;
  service: string;
  barber: string;
  price: number;
  customerName: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Në pritje",
  confirmed: "I konfirmuar",
  cancelled: "I anuluar",
  completed: "I përfunduar",
};

export function Lookup() {
  const [code, setCode] = useState("");
  const [found, setFound] = useState<Found | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "notfound" | "ok">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean.length < 4) {
      setStatus("notfound");
      setMessage("Kodi duhet të ketë formatin SJ-XXXX.");
      return;
    }
    setStatus("loading");
    setFound(null);
    const res = await fetch(`/api/bookings/${encodeURIComponent(clean)}`);
    const data = await res.json();
    if (res.ok && data.ok) {
      setFound(data.booking as Found);
      setStatus("ok");
      setMessage(null);
    } else {
      setStatus("notfound");
      setMessage(data?.error ?? "Nuk u gjet termi.");
    }
  };

  const cancel = async () => {
    if (!found) return;
    const res = await fetch(`/api/bookings/${encodeURIComponent(found.code)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setFound({ ...found, status: "cancelled" });
      setMessage("Termi u anulua. Shihemi së shpejti!");
    } else {
      setMessage(data?.error ?? "Anulimi dështoi.");
    }
  };

  return (
    <section id="kontrollo" className="relative border-b border-line/60 bg-ink-2 py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-brass" />
                Menaxho terminin
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display text-[clamp(2.4rem,6vw,5rem)] text-bone">
                <ScrambleText text="Kontrollo" />
                <br />
                <span className="text-brass">terminin</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-bone-3">
                Fut kodin që more pas rezervimit (p.sh. SJ-4K9M) për të parë detajet, për ta anuluar
                ose për ta rikonfirmuar para se të vish.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <form onSubmit={search} className="mt-8 flex flex-wrap gap-3">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="SJ-XXXX"
                  className="field max-w-[220px] font-mono uppercase tracking-[0.2em]"
                  aria-label="Kodi i termit"
                />
                <button type="submit" className="btn" disabled={status === "loading"}>
                  <span>{status === "loading" ? "Duke kërkuar…" : "Kërko"}</span>
                  <SearchIcon className="h-4 w-4" />
                </button>
              </form>
            </Reveal>

            {message && (
              <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-bone-3">
                {message}
              </p>
            )}
          </div>

          <Reveal delay={160}>
            <div className="border border-line/70 bg-char p-6 md:p-9">
              {!found && status !== "loading" && (
                <div className="py-10 text-center">
                  <span className="display text-6xl text-brass/25">SJ-••••</span>
                  <p className="mt-4 text-sm text-bone-3">
                    Detajet e termit shfaqen këtu sapo fut kodin.
                  </p>
                </div>
              )}
              {status === "loading" && (
                <div className="space-y-3 py-6">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="block h-12 animate-pulse bg-smoke/70" />
                  ))}
                </div>
              )}
              {found && (
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="display text-4xl text-brass">{found.code}</span>
                    <span
                      className={`border px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] ${
                        found.status === "cancelled"
                          ? "border-rust/60 text-rust"
                          : "border-moss/60 text-moss"
                      }`}
                    >
                      {STATUS_LABEL[found.status] ?? found.status}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-px bg-line/50 sm:grid-cols-2">
                    {[
                      ["Klienti", found.customerName],
                      ["Shërbimi", found.service],
                      ["Berberi", found.barber],
                      ["Data", found.dateLabel],
                      ["Ora", `${found.time} – ${found.endTime}`],
                      ["Çmimi", `${found.price} €`],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-char px-4 py-4">
                        <p className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-bone-3">
                          {k}
                        </p>
                        <p className="mt-1 text-sm text-bone">{v}</p>
                      </div>
                    ))}
                  </div>

                  {found.status !== "cancelled" && (
                    <button
                      type="button"
                      onClick={cancel}
                      className="mt-6 w-full border border-line px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-bone transition-colors hover:border-rust hover:text-rust"
                    >
                      Anulo këtë termin
                    </button>
                  )}
                  {found.status === "cancelled" && (
                    <p className="mt-6 flex items-center justify-center gap-2 border border-moss/40 bg-moss/10 px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-moss">
                      <CheckIcon className="h-4 w-4" /> Orari u lirua
                    </p>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
