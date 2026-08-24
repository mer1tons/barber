import { ABOUT_IMAGES, PROCESS } from "@/lib/data";
import { Reveal } from "./Reveal";
import { ScrambleText } from "./ScrambleText";

export function About() {
  return (
    <section id="rreth" className="relative border-b border-line/60 bg-ink-2 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-brass" />
                Rreth studios
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="display text-[clamp(2.8rem,7vw,5.6rem)] text-bone">
                <ScrambleText text="Mjeshtëria" />
                <br />
                <span className="text-brass">nuk nxiton</span>
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-8 max-w-lg text-[0.98rem] leading-relaxed text-bone-2">
                Shpend Januzi Hair Studio nisi në Lipjan me një karrige, një makinë dhe një ide të
                thjeshtë: çdo klient të dalë më i sigurt se sa hyri. Sot jemi dy studio, tre berberë
                dhe mijëra prerje — por standardi është i njëjti.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <blockquote className="mt-10 border-l-2 border-brass pl-6">
                <p className="font-serif text-xl italic leading-snug text-bone md:text-2xl">
                  “Nuk pres flokë. Përpiqem t'i jap njeriut versionin më të mirë të vetvetes, para
                  se të dalë në derë.”
                </p>
                <footer className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-bone-3">
                  — Shpend Januzi, themelues
                </footer>
              </blockquote>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
                {[
                  { k: "Higjiena", v: "Vegla të sterilizuara për çdo klient" },
                  { k: "Konsultimi", v: "5 minuta para se të prek makinën" },
                  { k: "Finish", v: "Stilim dhe këshillë për në shtëpi" },
                ].map((item) => (
                  <div key={item.k}>
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-brass">
                      {item.k}
                    </p>
                    <p className="mt-1 max-w-[16rem] text-sm text-bone-3">{item.v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="space-y-6">
            {ABOUT_IMAGES.map((src, i) => (
              <Reveal
                key={src}
                delay={i * 120}
                className={i === 1 ? "lg:ml-16" : i === 2 ? "lg:ml-6" : ""}
              >
                <figure className="group relative overflow-hidden border border-line/70">
                  <img
                    src={src}
                    alt={`Ambient i studios ${i + 1}`}
                    loading="lazy"
                    className="h-[320px] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105 md:h-[420px]"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-ink to-transparent px-5 pb-4 pt-12 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-bone-2">
                    <span>0{i + 1} — {i === 0 ? "Karrigia" : i === 1 ? "Detaji" : "Atmosfera"}</span>
                    <span className="text-brass">Lipjan</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-24 max-w-[1400px] px-5 lg:px-10">
        <div className="hairline mb-14" />
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={i * 100}>
              <div className="group relative border-t border-line pt-6">
                <span className="display text-5xl text-brass/25 transition-colors duration-500 group-hover:text-brass">
                  {p.step}
                </span>
                <h3 className="mt-3 display text-2xl text-bone">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-3">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
