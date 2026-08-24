import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const ScissorsIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="6" r="2.6" />
    <circle cx="6" cy="18" r="2.6" />
    <path d="M20 4 8.6 15.4M8.6 8.6 20 20M14.5 10.6 11 12l3.5 1.4" />
  </svg>
);

export const RazorIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 8h13l5 4-5 4H3z" />
    <path d="M3 12h9M16 8v8" />
  </svg>
);

export const BeardIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 4v7c0 5 3.1 9 7 9s7-4 7-9V4" />
    <path d="M8.5 12.5c1 1 2.2 1.5 3.5 1.5s2.5-.5 3.5-1.5" />
    <path d="M5 8h3M16 8h3" />
  </svg>
);

export const ChairIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 4h10v8H7zM6 12h12l1 4H5zM9 16v4M15 16v4M7 20h10" />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.4l3.4 2" />
  </svg>
);

export const PhoneIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.2 2 2 0 0 1 5.5 3z" />
  </svg>
);

export const PinIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const InstagramIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14.5 8.5H17V5.4h-2.6c-2.3 0-3.7 1.5-3.7 3.8v1.6H8.4v3.1h2.3V21h3.1v-7.1H16l.5-3.1h-2.9V9.5c0-.7.3-1 .9-1z" />
  </svg>
);

export const WhatsAppIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.6-4.4A8.4 8.4 0 1 1 20.5 11.6z" />
    <path d="M9 9.3c0 3 2.2 5.2 5.1 5.4.6 0 1.2-.5 1.2-1.1l-1.6-.8-.8.9a4.4 4.4 0 0 1-2.2-2.2l.9-.8-.8-1.6c-.6 0-1.1.5-1.1 1.1z" />
  </svg>
);

export const ArrowIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
  </svg>
);

export const StarIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="m12 2.8 2.7 5.9 6.4.7-4.8 4.3 1.3 6.3-5.6-3.2-5.6 3.2 1.3-6.3L2.9 9.4l6.4-.7z" />
  </svg>
);

export const CalendarIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ChevronIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8 4l8 8-8 8" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const SparkIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />
  </svg>
);

export const BarberPole = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 120" className={className} aria-hidden="true">
    <defs>
      <pattern id="pole" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <rect width="14" height="14" fill="#f2e9dd" />
        <rect width="7" height="14" fill="#a83b20" />
      </pattern>
    </defs>
    <rect x="6" y="10" width="28" height="100" rx="6" fill="url(#pole)" />
    <rect x="4" y="4" width="32" height="8" rx="3" fill="#d9a441" />
    <rect x="4" y="108" width="32" height="8" rx="3" fill="#d9a441" />
  </svg>
);
