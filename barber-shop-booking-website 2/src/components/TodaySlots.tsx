"use client";

import { useEffect, useState } from "react";
import { ArrowIcon, ClockIcon } from "./icons";

type Props = {
  barberId: number;
  barberName: string;
  serviceId: number;
  dateISO: string;
  closed: boolean;
};

export function TodaySlots({ barberId, barberName, serviceId, dateISO, closed }: Props) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    const url = `/api/availability?barberId=${barberId}&date=${dateISO}&duration=45`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (data?.ok) setSlots((data.slots as string[]).slice(0, 5));
        else setError(true);
      })
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [barberId, dateISO]);

  const pick = (time: string) => {
    window.dispatchEvent(
      new CustomEvent("sj:preselect", {
        detail: { date: dateISO, time, barberId, serviceId },
      }),
    );
    document.getElementById("rezervo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative w-full max-w-sm border border-line/80 bg-ink-2/85 p-5 backdrop-blur-md">
      <div className="pointer-events-none absolute -top-px left-0 h-px w-16 bg-brass" />
      <div className="flex items-center justify-between">
        <span className="eyebrow flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-moss" />
          </span>
          Të lira sot
        </span>
        <span className="font-mono text-[0.62rem] uppercase tracking-widest text-bone-3">
          {barberName}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {closed && (
          <p className="font-mono text-xs text-bone-3">
            Të dielën studioja pushon — rezervo për të hënën.
          </p>
        )}
        {!closed && slots === null && !error && (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-9 w-[70px] animate-pulse bg-smoke/80" />
            ))}
          </div>
        )}
        {error && <p className="font-mono text-xs text-bone-3">Po ngarkoj oraret…</p>}
        {!closed &&
          slots?.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => pick(s)}
              className="group flex items-center gap-1.5 border border-line px-3 py-2 font-mono text-xs text-bone transition-all hover:border-brass hover:bg-brass hover:text-ink"
            >
              <ClockIcon className="h-3.5 w-3.5 opacity-70" />
              {s}
            </button>
          ))}
        {!closed && slots?.length === 0 && (
          <p className="font-mono text-xs text-bone-3">
            Sot nuk ka më orare — zgjidh një ditë tjetër.
          </p>
        )}
      </div>

      <a
        href="#rezervo"
        className="mt-5 inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-brass transition-colors hover:text-brass-2"
      >
        Shih të gjitha oraret
        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
}
