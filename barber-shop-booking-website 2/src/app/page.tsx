import { db } from "@/db";
import { barbers } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getActiveServices } from "@/lib/api";
import { ensureSeed } from "@/lib/seed";
import { weekdayOf, todayISO } from "@/lib/time";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Booking } from "@/components/Booking";
import { Team } from "@/components/Team";
import { Gallery } from "@/components/Gallery";
import { Reviews } from "@/components/Reviews";
import { Lookup } from "@/components/Lookup";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  await ensureSeed();
  const [services, barberList] = await Promise.all([
    getActiveServices(),
    db.select().from(barbers).where(eq(barbers.active, true)).orderBy(asc(barbers.sortOrder)),
  ]);

  const firstBarber = barberList[0];
  const defaultService = services.find((s) => s.duration === 45) ?? services[0];

  return (
    <main className="relative">
      <Nav />
      <Hero
        firstBarberId={firstBarber?.id ?? 1}
        firstBarberName={firstBarber?.name.split(" ")[0] ?? "Shpendi"}
        defaultServiceId={defaultService?.id ?? 1}
      />
      <Marquee />
      <About />
      <Services
        items={services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          category: s.category,
          price: s.price,
          duration: s.duration,
        }))}
      />
      <Booking
        services={services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          category: s.category,
          price: s.price,
          duration: s.duration,
        }))}
        barbers={barberList.map((b) => ({
          id: b.id,
          name: b.name,
          role: b.role,
          bio: b.bio,
          avatarUrl: b.avatarUrl,
          specialties: b.specialties,
        }))}
      />
      <Marquee reverse />
      <Team
        barbers={barberList.map((b) => ({
          id: b.id,
          name: b.name,
          role: b.role,
          bio: b.bio,
          avatarUrl: b.avatarUrl,
          specialties: b.specialties,
        }))}
      />
      <Gallery />
      <Reviews />
      <Lookup />
      <Faq />
      <Contact todayIndex={weekdayOf(todayISO())} />
      <Footer />

      <a
        href="#rezervo"
        className="btn fixed bottom-5 right-5 z-40 shadow-[0_10px_40px_-10px_rgba(217,164,65,.6)] sm:hidden"
      >
        <span>Rezervo</span>
      </a>
    </main>
  );
}
