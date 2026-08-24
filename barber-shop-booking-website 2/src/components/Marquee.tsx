import { TICKER } from "@/lib/data";

export function Marquee({ reverse = false }: { reverse?: boolean }) {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="relative flex overflow-hidden border-y border-line/70 bg-char py-4 select-none">
      <div
        className="flex min-w-max animate-marquee items-center gap-10 pr-10"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {items.map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center gap-10">
            <span className="display text-2xl text-bone-2 md:text-3xl">{t}</span>
            <span className="text-brass">✦</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-char to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-char to-transparent" />
    </div>
  );
}
