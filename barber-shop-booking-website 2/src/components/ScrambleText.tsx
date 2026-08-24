"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "./Reveal";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*/\\<>+=";

export function ScrambleText({
  text,
  className = "",
  speed = 34,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [output, setOutput] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOutput(text);
      return;
    }
    frame.current = 0;
    const total = text.length * 2.2;
    const id = window.setInterval(() => {
      frame.current += 1;
      const progress = frame.current / 2.2;
      const next = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < progress) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setOutput(next);
      if (frame.current > total) {
        setOutput(text);
        window.clearInterval(id);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [inView, text, speed]);

  return (
    <span ref={ref} className={className}>
      {output}
    </span>
  );
}
