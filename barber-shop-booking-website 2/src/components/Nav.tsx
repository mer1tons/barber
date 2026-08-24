"use client";

import { useEffect, useState } from "react";
import { STUDIO } from "@/lib/data";
import { CloseIcon, InstagramIcon, PhoneIcon, ScissorsIcon } from "./icons";

const LINKS = [
  { href: "#sherbimet", label: "Shërbimet" },
  { href: "#rezervo", label: "Rezervo" },
  { href: "#ekipi", label: "Ekipi" },
  { href: "#galeria", label: "Galeria" },
  { href: "#vleresime", label: "Vlerësime" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const h = document.body.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, y / h) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-ink/92 backdrop-blur-md border-b border-line/70 py-3"
            : "border-b border-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 lg:px-10">
          <a href="#top" className="group flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center border border-brass/60 text-brass transition-colors group-hover:bg-brass group-hover:text-ink">
              <ScissorsIcon className="h-5 w-5" />
            </span>
            <span className="leading-none">
              <span className="display block text-xl tracking-wide text-bone">
                Shpend Januzi
              </span>
              <span className="eyebrow block text-[0.55rem] text-brass/80">Hair Studio · Lipjan</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-underline font-mono text-[0.7rem] uppercase tracking-[0.2em] text-bone-2 transition-colors hover:text-bone"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={STUDIO.phoneHref}
              className="hidden items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-bone-2 transition-colors hover:text-brass md:flex"
            >
              <PhoneIcon className="h-4 w-4" />
              {STUDIO.phone}
            </a>
            <a href="#rezervo" className="btn hidden !px-6 !py-3 sm:inline-flex">
              <span>Rezervo</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Hap menynë"
              className="grid h-10 w-10 place-items-center border border-line text-bone transition-colors hover:border-brass hover:text-brass lg:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-3 bg-current" />
              </span>
            </button>
          </div>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-brass/70 transition-transform duration-150"
          style={{ transform: `scaleX(${progress})` }}
        />
      </header>

      <div
        className={`fixed inset-0 z-[70] bg-ink/97 backdrop-blur-sm transition-all duration-500 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Menyja</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Mbyll menynë"
              className="grid h-11 w-11 place-items-center border border-line text-bone"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="display border-b border-line/60 py-3 text-5xl text-bone transition-colors hover:text-brass"
                style={{
                  transitionDelay: `${i * 40}ms`,
                  transform: open ? "none" : "translateY(18px)",
                  opacity: open ? 1 : 0,
                  transitionProperty: "transform, opacity, color",
                  transitionDuration: "600ms",
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-between gap-4 border-t border-line/60 pt-5">
            <a href={STUDIO.phoneHref} className="font-mono text-xs text-bone-2">
              {STUDIO.phone}
            </a>
            <a href={STUDIO.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon className="h-5 w-5 text-brass" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
