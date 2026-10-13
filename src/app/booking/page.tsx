import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingFlow from "@/components/booking/BookingFlow";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ roomId?: string }>;
}) {
  const { roomId } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="px-6 pt-32 pb-24 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Reservations
          </p>
          <h1 className="font-display mt-4 text-4xl text-cream md:text-5xl">
            Book your stay
          </h1>
        </div>
        <div className="mt-16">
          <BookingFlow initialRoomId={roomId} />
        </div>
      </main>
      <Footer />
    </>
  );
}
