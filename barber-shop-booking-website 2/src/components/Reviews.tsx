"use client";

import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { ScrambleText } from "./ScrambleText";
import { StarIcon } from "./icons";

type ReviewItem = {
  id: number;
  author: string;
  rating: number;
  body: string;
  service: string;
  createdAt: string;
};

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5 text-brass">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className={`h-3.5 w-3.5 ${i < n ? "" : "opacity-25"}`} />
      ))}
    </span>
  );
}

export function Reviews() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [form, setForm] = useState({ author: "", body: "", service: "", rating: 5 });
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => d?.ok && setItems(d.reviews as ReviewItem[]))
      .catch(() => undefined);
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setItems((cur) => [data.review as ReviewItem, ...cur]);
      setForm({ author: "", body: "", service: "", rating: 5 });
      setState("ok");
      window.setTimeout(() => setState("idle"), 4000);
    } else {
      setState("error");
    }
  };

  const rowA = items.slice(0, Math.ceil(items.length / 2));
  const rowB = items.slice(Math.ceil(items.length / 2));
  const avg = items.length
    ? (items.reduce((s, r) => s + r.rating, 0) / items.length).toFixed(1)
    : "5.0";

  const Card = ({ r }: { r: ReviewItem }) => (
    <article className="w-[330px] shrink-0 border border-line/70 bg-char p-6 transition-colors duration-300 hover:border-brass/60 md:w-[380px]">
      <div className="flex items-center justify-between">
        <Stars n={r.rating} />
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-bone-3">
          {r.service}
        </span>
      </div>
      <p className="mt-4 font-serif text-[1.05rem] italic leading-relaxed text-bone">“{r.body}”</p>
      <footer className="mt-5 flex items-center gap-3 border-t border-line/70 pt-4">
        <span className="grid h-9 w-9 place-items-center border border-brass/50 font-mono text-xs text-brass">
          {r.author.slice(0, 1)}
        </span>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-bone-2">
          {r.author}
        </span>
      </footer>
    </article>
  );

  return (
    <section id="vleresime" className="relative overflow-hidden border-b border-line/60 bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-brass" />
                Çfarë thonë klientët
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display text-[clamp(2.8rem,8vw,6.4rem)] text-bone">
                <ScrambleText text="Vlerësime" />
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <div className="flex items-center gap-5">
              <span className="display text-7xl text-brass">{avg}</span>
              <span className="max-w-[12rem] text-sm text-bone-3">
                mesatarja nga {items.length || "320+"} vlerësime të klientëve në Lipjan
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mt-14 space-y-4">
          {[rowA, rowB].map((row, idx) => (
            <div key={idx} className="flex overflow-hidden py-1">
              <div
                className="flex min-w-max animate-marquee-slow gap-4 pr-4"
                style={{ animationDirection: idx === 1 ? "reverse" : "normal" }}
              >
                {[...row, ...row].map((r, i) => (
                  <Card key={`${r.id}-${i}`} r={r} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-14 flex justify-center">
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-52 w-[330px] animate-pulse bg-char" />
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto mt-20 max-w-[1400px] px-5 lg:px-10">
        <Reveal>
          <div className="grid gap-10 border border-line/70 bg-ink-2 p-6 md:p-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h3 className="display text-4xl text-bone">Lëre një vlerësim</h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-3">
                Ke qenë në studio? Na thuaj si doli — vlerësimet shfaqen menjëherë në faqe.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone-3">
                  Yjet
                </span>
                <span className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} yje`}
                      onClick={() => setForm({ ...form, rating: n })}
                      className="transition-transform hover:scale-125"
                    >
                      <StarIcon
                        className={`h-6 w-6 ${n <= form.rating ? "text-brass" : "text-line"}`}
                      />
                    </button>
                  ))}
                </span>
              </div>
            </div>

            <form onSubmit={send} className="grid gap-4 sm:grid-cols-2">
              <input
                className="field"
                placeholder="Emri yt"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
                minLength={2}
              />
              <input
                className="field"
                placeholder="Shërbimi (opsional)"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
              />
              <textarea
                className="field min-h-[110px] sm:col-span-2"
                placeholder="Shkruaj përvojën tënde…"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                required
                minLength={10}
              />
              <div className="flex items-center gap-4 sm:col-span-2">
                <button type="submit" className="btn" disabled={state === "sending"}>
                  <span>{state === "sending" ? "Duke dërguar…" : "Dërgo vlerësimin"}</span>
                </button>
                {state === "ok" && (
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-moss">
                    Faleminderit! U publikua.
                  </span>
                )}
                {state === "error" && (
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-rust">
                    Kontrolloni fushat.
                  </span>
                )}
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
