import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeBooking } from "@/lib/serialize";
import { requireAdmin } from "@/lib/auth";
import { bookingInputSchema } from "@/lib/validation";
import { createBookingAtomically } from "@/lib/availability";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookings.map(serializeBooking));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = bookingInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { roomId, checkIn, checkOut, guests, ...guestInfo } = parsed.data;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (guests > room.capacity) {
    return NextResponse.json(
      { error: `This room sleeps up to ${room.capacity} guests` },
      { status: 400 },
    );
  }

  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const result = await createBookingAtomically({
    roomId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests,
    totalPrice: nights * room.pricePerNight,
    ...guestInfo,
  });

  if (result.status === "unavailable") {
    return NextResponse.json(
      { error: "This room is not available for the selected dates" },
      { status: 409 },
    );
  }
  if (result.status === "busy") {
    return NextResponse.json(
      { error: "High demand right now — please try again in a moment" },
      { status: 503 },
    );
  }

  return NextResponse.json(serializeBooking(result.booking), { status: 201 });
}
