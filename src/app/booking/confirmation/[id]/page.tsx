import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeBooking } from "@/lib/serialize";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SceneArt from "@/components/visuals/SceneArt";

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });
  if (!booking) notFound();

  const dto = serializeBooking(booking);

  return (
    <>
      <Navbar />
      <main className="px-6 pt-32 pb-24 md:px-10">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Reservation Confirmed
          </p>
          <h1 className="font-display mt-4 text-4xl text-cream">
            See you soon, {dto.guestName.split(" ")[0]}
          </h1>
          <p className="mt-4 text-cream/60">
            A confirmation has been sent to {dto.guestEmail}. Your booking
            reference is{" "}
            <span className="text-gold">{dto.id.slice(-8).toUpperCase()}</span>
            .
          </p>

          <div className="mt-10 rounded-2xl border border-gold/15 bg-charcoal-soft p-8 text-left">
            <div className="flex gap-4">
              <SceneArt
                token={dto.room?.images[0] ?? "room-fallback"}
                className="h-16 w-24 flex-shrink-0 rounded-lg"
              />
              <div>
                <p className="text-cream">{dto.room?.name}</p>
                <p className="text-sm text-cream/50">
                  {new Date(dto.checkIn).toLocaleDateString()} –{" "}
                  {new Date(dto.checkOut).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-2 border-t border-gold/10 pt-4 text-sm text-cream/70">
              <div className="flex justify-between">
                <span>Guests</span>
                <span>{dto.guests}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-gold">{dto.status}</span>
              </div>
              <div className="flex justify-between border-t border-gold/10 pt-2 text-cream">
                <span>Total</span>
                <span>${dto.totalPrice}</span>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="mt-10 inline-block text-sm uppercase tracking-[0.15em] text-gold hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
