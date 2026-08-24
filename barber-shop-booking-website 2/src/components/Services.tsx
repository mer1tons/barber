"use client";

import { useMemo, useState } from "react";
import { Reveal } from "./Reveal";
import { ScrambleText } from "./ScrambleText";
import { ArrowIcon, ClockIcon } from "./icons";
import { formatDuration } from "@/lib/time";

export type ServiceItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
};

export function Services({ items }: { items: ServiceItem[] }) {
  const categories = useMemo(
    () => ["Të gjitha", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );
  const [active, setActive] = useState("Të gjitha");
  const list = active === "Të gjitha" ? items : items.filter((i) => i.category === active);

  const reserve = (serviceId: number) => {
    window.dispatchEvent(new CustomEvent("sj:preselect", { detail: { serviceId } }));
    document.getElementById("rezervo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="sherbimet" className="relative border-b border-line/60 bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-brass" />
                Lista e çmimeve
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display text-[clamp(2.8rem,8vw,6.4rem)] text-bone">
                <ScrambleText text="Shërbimet" /> <span className="text-brass">& çmimet</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <p className="max-w-sm text-sm leading-relaxed text-bone-3">
              Çdo shërbim ka kohëzgjatjen e vet reale — oraret që sheh më poshtë llogariten sipas
              këtyre minutave. Çmimet janë në euro, pagesa bëhet në studio.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`border px-4 py-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] transition-all duration-300 ${
                active === c
                  ? "border-brass bg-brass text-ink"
                  : "border-line text-bone-3 hover:border-brass/60 hover:text-bone"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 border-t border-line/70">
          {list.map((s, i) => (
            <Reveal key={s.id} delay={i * 40}>
              <button
                type="button"
                onClick={() => reserve(s.id)}
                className="group relative grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line/60 py-6 text-left transition-colors duration-300 hover:bg-char/60 md:grid-cols-[3.5rem_1fr_auto_auto] md:gap-8 md:px-4"
              >
                <span className="absolute inset-y-0 left-0 w-[2px] origin-bottom scale-y-0 bg-brass transition-transform duration-500 group-hover:scale-y-100" />
                <span className="font-mono text-xs text-bone-3 transition-colors group-hover:text-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0">
                  <span className="block overflow-hidden">
                    <span className="display block text-3xl text-bone transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
                      {s.name}
                    </span>
                  </span>
                  <span className="mt-1.5 block max-w-xl text-sm text-bone-3">{s.description}</span>
                  <span className="mt-2 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone-3/80">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {formatDuration(s.duration)} · {s.category}
                  </span>
                </span>

                <span className="display hidden text-4xl text-brass transition-transform duration-500 group-hover:scale-110 md:block">
                  {s.price}€
                </span>

                <span className="flex items-center gap-3 justify-self-end">
                  <span className="display text-3xl text-brass md:hidden">{s.price}€</span>
                  <span className="grid h-10 w-10 place-items-center border border-line text-bone-3 transition-all duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-ink">
                    <ArrowIcon className="h-4 w-4" />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-bone-3">
          Kliko mbi një shërbim për ta rezervuar direkt ↓
        </p>
      </div>
    </section>
  );
}
