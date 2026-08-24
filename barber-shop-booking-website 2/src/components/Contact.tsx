import { HOURS_LIST, STUDIO } from "@/lib/data";
import { Reveal } from "./Reveal";
import { ArrowIcon, FacebookIcon, InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";

export function Contact({ todayIndex }: { todayIndex: number }) {
  return (
    <section id="kontakt" className="relative bg-ink py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="relative overflow-hidden border border-brass/30 bg-char">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #d9a441 0 2px, transparent 2px 12px)",
            }}
          />
          <div className="relative flex flex-col items-start justify-between gap-8 p-8 md:flex-row md:items-center md:p-14">
            <div>
              <p className="eyebrow mb-4">Hapur për rezervime</p>
              <h2 className="display text-[clamp(2.4rem,6.5vw,5.4rem)] leading-[0.9] text-bone">
                Gati për një
                <br />
                <span className="text-brass">prerje të re?</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#rezervo" className="btn">
                <span>Rezervo online</span>
                <ArrowIcon className="h-4 w-4" />
              </a>
              <a href={STUDIO.phoneHref} className="btn btn-ghost">
                <PhoneIcon className="h-4 w-4" />
                <span>{STUDIO.phone}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          <Reveal>
            <div className="h-full border border-line/70 p-7">
              <p className="eyebrow mb-6">Orari i punës</p>
              <ul className="space-y-0">
                {HOURS_LIST.map((h, i) => {
                  const idx = i + 1; // 0 = e diel => index 7 në listë
                  const isToday = idx % 7 === todayIndex;
                  return (
                    <li
                      key={h.day}
                      className={`flex items-center justify-between border-b border-line/50 py-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] ${
                        isToday ? "text-brass" : "text-bone-2"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isToday && <span className="inline-block h-1.5 w-1.5 bg-brass" />}
                        {h.day}
                      </span>
                      <span className={h.hours === "Mbyllur" ? "text-bone-3/60" : ""}>
                        {h.hours}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-bone-3">
                Të hënën mbasdite zakonisht është më qetë. Të shtunën rezervoni herët — mbushet
                shpejt.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full border border-line/70 p-7">
              <p className="eyebrow mb-6">Ku na gjeni</p>
              <div className="space-y-6">
                {STUDIO.addresses.map((a) => (
                  <a
                    key={a.street}
                    href={STUDIO.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex gap-4"
                  >
                    <PinIcon className="mt-1 h-5 w-5 shrink-0 text-brass" />
                    <span>
                      <span className="block font-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone-3">
                        {a.label}
                      </span>
                      <span className="mt-1 block text-lg text-bone transition-colors group-hover:text-brass">
                        {a.street}
                      </span>
                      <span className="block text-sm text-bone-3">{a.detail}</span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-line/60 pt-6">
                <a
                  href={STUDIO.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border border-line px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-bone transition-colors hover:border-brass hover:text-brass"
                >
                  <InstagramIcon className="h-4 w-4" /> Instagram
                </a>
                <a
                  href={STUDIO.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border border-line px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-bone transition-colors hover:border-moss hover:text-moss"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
                <a
                  href={STUDIO.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 border border-line px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-bone transition-colors hover:border-brass hover:text-brass"
                >
                  <FacebookIcon className="h-4 w-4" /> Facebook
                </a>
              </div>

              <a
                href={`mailto:${STUDIO.email}`}
                className="mt-6 block font-mono text-[0.64rem] uppercase tracking-[0.16em] text-bone-3 transition-colors hover:text-brass"
              >
                {STUDIO.email}
              </a>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="h-full overflow-hidden border border-line/70">
              <iframe
                title="Harta e studios në Lipjan"
                src={STUDIO.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[340px] w-full grayscale-[0.6] contrast-[1.05] invert-[0.92] lg:h-full"
                style={{ minHeight: 340 }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
