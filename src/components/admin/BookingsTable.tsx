"use client";

import { useState } from "react";
import type { BookingDTO, BookingStatus } from "@/lib/types";

const STATUS_OPTIONS: BookingStatus[] = ["PENDING", "CONFIRMED", "CANCELLED"];

export default function BookingsTable({
  initialBookings,
}: {
  initialBookings: BookingDTO[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: BookingStatus) {
    setUpdatingId(id);
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated: BookingDTO = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: updated.status } : b)),
      );
    }
    setUpdatingId(null);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gold/15">
      <table className="w-full text-left text-sm">
        <thead className="bg-charcoal-soft text-cream/50">
          <tr>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Room</th>
            <th className="px-4 py-3">Dates</th>
            <th className="px-4 py-3">Guests</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t border-gold/10">
              <td className="px-4 py-3">
                <p className="text-cream">{booking.guestName}</p>
                <p className="text-xs text-cream/40">{booking.guestEmail}</p>
              </td>
              <td className="px-4 py-3 text-cream/70">
                {booking.room?.name}
              </td>
              <td className="px-4 py-3 text-cream/70">
                {new Date(booking.checkIn).toLocaleDateString()} –{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-cream/70">{booking.guests}</td>
              <td className="px-4 py-3 text-cream/70">
                ${booking.totalPrice}
              </td>
              <td className="px-4 py-3">
                <select
                  value={booking.status}
                  disabled={updatingId === booking.id}
                  onChange={(e) =>
                    updateStatus(booking.id, e.target.value as BookingStatus)
                  }
                  className="rounded-lg border border-gold/20 bg-charcoal px-2 py-1 text-xs text-cream"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-cream/40">
                No bookings yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
