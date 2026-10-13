import type { Booking, Room } from "@prisma/client";
import type { BookingDTO, BookingStatus, RoomDTO, RoomType } from "./types";

export function serializeRoom(room: Room): RoomDTO {
  return {
    id: room.id,
    name: room.name,
    type: room.type as RoomType,
    description: room.description,
    pricePerNight: room.pricePerNight,
    capacity: room.capacity,
    images: JSON.parse(room.images) as string[],
    amenities: JSON.parse(room.amenities) as string[],
    totalUnits: room.totalUnits,
    createdAt: room.createdAt.toISOString(),
  };
}

export function serializeBooking(
  booking: Booking & { room?: Room },
): BookingDTO {
  return {
    id: booking.id,
    roomId: booking.roomId,
    room: booking.room ? serializeRoom(booking.room) : undefined,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    guests: booking.guests,
    totalPrice: booking.totalPrice,
    status: booking.status as BookingStatus,
    createdAt: booking.createdAt.toISOString(),
  };
}
