import { HERO_IMAGE, STATS, STUDIO } from "@/lib/data";
import { OPENING_HOURS, todayISO, weekdayOf } from "@/lib/time";
import { TodaySlots } from "./TodaySlots";
import { InstagramIcon, PinIcon, StarIcon } from "./icons";

const today = OPENING_HOURS[weekdayOf(todayISO())];

export function Hero({
  firstBarberId,
  firstBarberName,
  defaultServiceId,
}: {
  firstBarberId: number;
  firstBarberName: string;
  defaultServiceId: number;
}) {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Berber duke prerë flokë në studio"
          className="h-full w-full animate-kenburns object-cover object-center opacity-55"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(217,164,65,.35) 0 1px, transparent 1px 4px)",
          }}
        />
      </div>

      <span className="absolute left-6 top-1/2 hidden -translate-y-1/2 rotate-180 [writing-mode:vertical-rl] font-mono text-[0.6rem] uppercase tracking-[0.5em] text-bone-3 xl:block">
        {STUDIO.city} · Kosovë · Est. 2013
      </span>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-10 pt-32 lg:px-10 lg:pb-14">
        <div className="grid flex-1 items-end gap-12 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-brass" />
              Berber studio · {STUDIO.city}
            </p>

            <h1 className="display text-[clamp(3.6rem,13vw,11rem)] text-bone">
              <span className="block overflow-hidden">
                <span className="rise block">Shpend</span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="rise rise-2 block text-transparent"
                  style={{ WebkitTextStroke: "1px rgba(242,233,221,.65)" }}
                >
                  Januzi
                </span>
              </span>
            </h1>

            <p className="rise rise-3 mt-2 font-serif text-[clamp(1.4rem,4vw,2.6rem)] italic text-brass">
              hair studio
            </p>

            <p className="rise rise-3 mt-7 max-w-xl text-[0.98rem] leading-relaxed text-bone-2">
              Fade i pastër, brisk i mprehtë dhe një karrige që të pret në kohë. Rezervo terminin
              online në dy studiot tona në Lipjan — pa pritje në derë, pa telefonata.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#rezervo" className="btn group">
                <span>Rezervo termin</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a href="#sherbimet" className="btn btn-ghost">
                <span>Shiko çmimet</span>
              </a>
              <a
                href={STUDIO.instagram}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-bone-2 transition-colors hover:text-brass"
              >
                <InstagramIcon className="h-4 w-4" />
                {STUDIO.instagramHandle}
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start gap-6 lg:items-end">
            <TodaySlots
              barberId={firstBarberId}
              barberName={firstBarberName}
              serviceId={defaultServiceId}
              dateISO={todayISO()}
              closed={!today}
            />
            <div className="hidden items-center gap-3 border border-line/70 px-4 py-3 lg:flex">
              <span className="flex gap-0.5 text-brass">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-3.5 w-3.5" />
                ))}
              </span>
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-bone-2">
                4.9 / 5 · mbi 320 vlerësime
              </span>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-px border border-line/70 bg-line/40 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-ink/80 px-5 py-5 backdrop-blur-sm">
              <p className="display text-4xl text-brass">{s.value}</p>
              <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone-3">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone-3">
          <span className="flex items-center gap-2">
            <PinIcon className="h-3.5 w-3.5 text-brass" />
            Rr. Haradin Bajrami · Rr. Fatmir Reqica
          </span>
          <span className="hidden items-center gap-2 sm:flex">
            <span className="inline-block h-8 w-px animate-pulse bg-brass/60" />
            Zbrit poshtë
          </span>
        </div>
      </div>
    </section>
  );
}
