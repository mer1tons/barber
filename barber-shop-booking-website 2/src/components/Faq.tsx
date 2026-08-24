"use client";

import { useState } from "react";
import { FAQ } from "@/lib/data";
import { Reveal } from "./Reveal";
import { ScrambleText } from "./ScrambleText";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="pyetje" className="relative border-b border-line/60 bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-brass" />
                Pyetje të shpeshta
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display text-[clamp(2.4rem,6vw,5rem)] text-bone">
                <ScrambleText text="Gjithçka" />
                <br />
                <span className="text-brass">që pyesni</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone-3">
                Nuk e gjete përgjigjen? Shkruaj në Instagram ose telefono — përgjigjemi brenda
                orarit të punës.
              </p>
            </Reveal>
          </div>

          <div className="border-t border-line/70">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={f.q} delay={i * 60}>
                  <div className="border-b border-line/70">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <span className="flex gap-5">
                        <span className="mt-1 font-mono text-xs text-brass">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="display text-2xl text-bone transition-transform duration-500 group-hover:translate-x-1 md:text-3xl">
                          {f.q}
                        </span>
                      </span>
                      <span
                        className={`mt-1 grid h-8 w-8 shrink-0 place-items-center border transition-all duration-500 ${
                          isOpen
                            ? "rotate-45 border-brass bg-brass text-ink"
                            : "border-line text-bone-3 group-hover:border-brass"
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className="grid transition-all duration-500 ease-out"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-7 pl-10 text-sm leading-relaxed text-bone-3">
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
