"use client";

import { useCallback, useEffect, useState } from "react";
import { GALLERY } from "@/lib/data";
import { Reveal } from "./Reveal";
import { ScrambleText } from "./ScrambleText";
import { CloseIcon } from "./icons";

const SPANS = [
  "md:row-span-2",
  "",
  "md:row-span-2",
  "",
  "md:row-span-2",
  "",
  "",
  "md:row-span-2",
];

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  const move = useCallback(
    (dir: number) =>
      setOpen((cur) => (cur === null ? null : (cur + dir + GALLERY.length) % GALLERY.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, move]);

  return (
    <section id="galeria" className="relative border-b border-line/60 bg-ink-2 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-brass" />
                Punët tona
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display text-[clamp(2.8rem,8vw,6.4rem)] text-bone">
                <ScrambleText text="Galeria" />
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <p className="max-w-sm text-sm leading-relaxed text-bone-3">
              Fotot e fundit nga studioja. Për më shumë — dhe për videot e fade-ve — na ndiq në
              Instagram.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-[200px]">
          {GALLERY.map((g, i) => (
            <Reveal
              key={g.src}
              delay={(i % 4) * 90}
              className={`${SPANS[i] ?? ""} ${i % 5 === 0 ? "md:col-span-2" : ""}`}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block h-full w-full overflow-hidden border border-line/60"
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.3s] ease-out group-hover:scale-[1.09]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />
                <span className="absolute bottom-0 left-0 flex w-full items-center justify-between px-4 py-3">
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-bone">
                    {g.tag}
                  </span>
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-brass opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    shiko
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/96 p-5 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            aria-label="Mbyll"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center border border-line text-bone transition-colors hover:border-brass hover:text-brass"
            onClick={() => setOpen(null)}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <img
            src={GALLERY[open].src}
            alt={GALLERY[open].alt}
            className="max-h-[85vh] max-w-full border border-line object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                move(-1);
              }}
              className="font-mono text-xs uppercase tracking-[0.2em] text-bone-2 hover:text-brass"
            >
              ← Para
            </button>
            <span className="font-mono text-xs text-bone-3">
              {open + 1} / {GALLERY.length} · {GALLERY[open].tag}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                move(1);
              }}
              className="font-mono text-xs uppercase tracking-[0.2em] text-bone-2 hover:text-brass"
            >
              Tjetra →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
