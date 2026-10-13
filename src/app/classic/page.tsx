import { prisma } from "@/lib/prisma";
import { serializeRoom } from "@/lib/serialize";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/landing/Hero";
import AboutSection from "@/components/landing/AboutSection";
import JourneySection from "@/components/landing/JourneySection";
import FeaturedRooms from "@/components/landing/FeaturedRooms";
import StatsSection from "@/components/landing/StatsSection";
import Testimonials from "@/components/landing/Testimonials";
import CTASection from "@/components/landing/CTASection";

export default async function ClassicHomePage() {
  const rooms = await prisma.room.findMany({
    orderBy: { pricePerNight: "desc" },
    take: 4,
  });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <JourneySection />
        <FeaturedRooms rooms={rooms.map(serializeRoom)} />
        <StatsSection />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

// Room data changes via the admin dashboard, so never prerender at build time.
export const dynamic = "force-dynamic";
