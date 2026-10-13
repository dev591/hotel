import { prisma } from "@/lib/prisma";
import { serializeRoom } from "@/lib/serialize";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomsGrid from "@/components/rooms/RoomsGrid";

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { pricePerNight: "asc" },
  });

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Rooms &amp; Suites
          </p>
          <h1 className="font-display mt-4 text-4xl text-cream md:text-5xl">
            Every room tells its own story
          </h1>
          <p className="mt-4 max-w-xl text-cream/60">
            Eight rooms, four categories — from a quiet standard with harbor
            glimpses to the Presidential Residence at the top of the house.
          </p>
          <div className="mt-14">
            <RoomsGrid rooms={rooms.map(serializeRoom)} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Room data changes via the admin dashboard, so never prerender at build time.
export const dynamic = "force-dynamic";
