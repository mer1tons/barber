import { STUDIO } from "@/lib/data";
import { InstagramIcon, ScissorsIcon } from "./icons";

const LINKS = [
  { href: "#sherbimet", label: "Shërbimet" },
  { href: "#rezervo", label: "Rezervo termin" },
  { href: "#ekipi", label: "Ekipi" },
  { href: "#galeria", label: "Galeria" },
  { href: "#kontrollo", label: "Kontrollo terminin" },
  { href: "#pyetje", label: "Pyetje" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line/70 bg-ink-2">
      <div className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center border border-brass/60 text-brass">
                <ScissorsIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="display block text-2xl text-bone">Shpend Januzi</span>
                <span className="eyebrow block text-[0.55rem]">Hair Studio · Lipjan</span>
              </span>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone-3">
              Dy studio në zemër të Lipjanit. Prerje, mjekër dhe rruajtje tradicionale — me
              rezervim online 24/7.
            </p>
            <a
              href={STUDIO.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-brass transition-colors hover:text-brass-2"
            >
              <InstagramIcon className="h-4 w-4" />
              {STUDIO.instagramHandle}
            </a>
          </div>

          <div>
            <p className="eyebrow mb-5">Navigimi</p>
            <ul className="space-y-3">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="link-underline text-sm text-bone-2 transition-colors hover:text-bone"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">Kontakt</p>
            <ul className="space-y-3 text-sm text-bone-2">
              <li>
                <a href={STUDIO.phoneHref} className="link-underline hover:text-bone">
                  {STUDIO.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${STUDIO.email}`} className="link-underline hover:text-bone">
                  {STUDIO.email}
                </a>
              </li>
              <li className="text-bone-3">Rr. Haradin Bajrami, Lipjan</li>
              <li className="text-bone-3">Rr. Fatmir Reqica, Lipjan</li>
            </ul>
            <a
              href="/admin"
              className="mt-6 inline-block font-mono text-[0.58rem] uppercase tracking-[0.2em] text-bone-3/60 transition-colors hover:text-brass"
            >
              Paneli i studios →
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line/60 pt-6 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-bone-3/70 md:flex-row">
          <span>© {year} Shpend Januzi Hair Studio · Të gjitha të drejtat e rezervuara</span>
          <span>Krijuar me brisk & piksel · Lipjan, Kosovë</span>
        </div>
      </div>
    </footer>
  );
}
