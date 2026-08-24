import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shpend Januzi Hair Studio — Berber në Lipjan | Rezervo Termin",
  description:
    "Skin fade, prerje klasike, kontur mjekre dhe hot towel shave në Lipjan. Rezervo terminin online te Shpend Januzi Hair Studio — pa pritje, pa telefonata.",
  keywords: [
    "berber Lipjan",
    "barber shop Lipjan",
    "Shpend Januzi",
    "skin fade Kosovë",
    "rezervo termin berber",
  ],
  openGraph: {
    title: "Shpend Januzi Hair Studio — Lipjan",
    description: "Rezervo terminin online. Prerje, mjekër dhe rruajtje tradicionale.",
    type: "website",
    locale: "sq_AL",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sq">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@300;400;500;600;700;800&family=Bodoni+Moda:ital,opsz,wght@1,6..96,400;1,6..96,600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain bg-ink text-bone antialiased">{children}</body>
    </html>
  );
}
