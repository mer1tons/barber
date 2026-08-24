"use client";

import { Reveal } from "./Reveal";
import { ScrambleText } from "./ScrambleText";
import { ArrowIcon } from "./icons";

export type BarberItem = {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  specialties: string;
};

export function Team({ barbers }: { barbers: BarberItem[] }) {
  const choose = (barberId: number) => {
    window.dispatchEvent(new CustomEvent("sj:preselect", { detail: { barberId } }));
    document.getElementById("rezervo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="ekipi" className="relative border-b border-line/60 bg-ink-2 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <Reveal>
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-10 bg-brass" />
            Pas karriges
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display text-[clamp(2.8rem,8vw,6.4rem)] text-bone">
            <ScrambleText text="Ekipi" /> <span className="text-brass">i studios</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {barbers.map((b, i) => (
            <Reveal key={b.id} delay={i * 120} as="article">
              <div className="group relative overflow-hidden border border-line/70 bg-char card-hover">
                <div className="relative h-[420px] overflow-hidden">
                  <img
                    src={b.avatarUrl}
                    alt={b.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale-[0.55] transition-all duration-[1.1s] ease-out group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-char via-char/25 to-transparent" />
                  <span className="absolute left-4 top-4 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-brass">
                    0{i + 1}
                  </span>
                </div>

                <div className="relative -mt-16 p-6">
                  <h3 className="display text-3xl text-bone">{b.name}</h3>
                  <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-brass">
                    {b.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-bone-3">{b.bio}</p>
                  <p className="mt-4 border-t border-line/70 pt-4 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-bone-3/80">
                    {b.specialties}
                  </p>

                  <button
                    type="button"
                    onClick={() => choose(b.id)}
                    className="mt-6 flex w-full items-center justify-between border border-line px-4 py-3 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-bone transition-all duration-300 hover:border-brass hover:bg-brass hover:text-ink"
                  >
                    Rezervo te {b.name.split(" ")[0]}
                    <ArrowIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
