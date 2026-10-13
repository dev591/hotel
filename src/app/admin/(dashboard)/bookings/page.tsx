import { prisma } from "@/lib/prisma";
import { serializeBooking } from "@/lib/serialize";
import BookingsTable from "@/components/admin/BookingsTable";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-cream">Bookings</h1>
      <p className="mt-2 text-sm text-cream/50">
        Review reservations and update their status.
      </p>
      <div className="mt-8">
        <BookingsTable initialBookings={bookings.map(serializeBooking)} />
      </div>
    </div>
  );
}
