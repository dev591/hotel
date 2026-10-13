import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [bookings, rooms] = await Promise.all([
    prisma.booking.findMany({
      include: { room: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.room.findMany(),
  ]);

  const allBookings = await prisma.booking.findMany();
  const revenue = allBookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const pendingCount = allBookings.filter((b) => b.status === "PENDING").length;

  const cards = [
    { label: "Total Bookings", value: allBookings.length },
    { label: "Pending Review", value: pendingCount },
    { label: "Rooms Listed", value: rooms.length },
    { label: "Revenue (booked)", value: `$${revenue.toLocaleString()}` },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-cream">Overview</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gold/15 bg-charcoal-soft p-6"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-cream/50">
              {card.label}
            </p>
            <p className="font-display mt-2 text-2xl text-gold">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg text-cream">Recent Bookings</h2>
        <Link
          href="/admin/bookings"
          className="text-sm text-gold hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gold/15">
        <table className="w-full text-left text-sm">
          <thead className="bg-charcoal-soft text-cream/50">
            <tr>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-gold/10">
                <td className="px-4 py-3 text-cream">{booking.guestName}</td>
                <td className="px-4 py-3 text-cream/70">
                  {booking.room.name}
                </td>
                <td className="px-4 py-3 text-cream/70">
                  {booking.checkIn.toLocaleDateString()} –{" "}
                  {booking.checkOut.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      booking.status === "CONFIRMED"
                        ? "bg-emerald/40 text-cream"
                        : booking.status === "CANCELLED"
                          ? "bg-red-900/40 text-red-300"
                          : "bg-gold/20 text-gold"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-cream/40"
                >
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
