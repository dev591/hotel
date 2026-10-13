import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeRoom } from "@/lib/serialize";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomGallery from "@/components/rooms/RoomGallery";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) notFound();

  const dto = serializeRoom(room);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Link
            href="/rooms"
            className="text-xs uppercase tracking-[0.15em] text-gold hover:underline"
          >
            ← Back to all rooms
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <RoomGallery images={dto.images} />

              <p className="mt-10 text-xs uppercase tracking-[0.3em] text-gold">
                {dto.type.replace("_", " ")}
              </p>
              <h1 className="font-display mt-3 text-4xl text-cream md:text-5xl">
                {dto.name}
              </h1>
              <p className="mt-5 max-w-2xl text-cream/70">
                {dto.description}
              </p>

              <div className="mt-10">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">
                  Amenities
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {dto.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="rounded-lg border border-gold/15 bg-charcoal-soft px-3 py-2 text-sm text-cream/80"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-gold/15 bg-charcoal-soft p-8">
              <p className="text-sm text-cream/60">From</p>
              <p className="font-display text-3xl text-cream">
                ${dto.pricePerNight}
                <span className="text-base text-cream/50"> / night</span>
              </p>
              <div className="mt-6 space-y-2 text-sm text-cream/70">
                <p>Sleeps up to {dto.capacity} guests</p>
                <p>{dto.totalUnits} rooms of this type available</p>
              </div>
              <Link
                href={`/booking?roomId=${dto.id}`}
                className="mt-8 block rounded-full bg-gold px-6 py-3 text-center text-sm uppercase tracking-[0.15em] text-charcoal transition-transform hover:scale-105"
              >
                Book This Room
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
