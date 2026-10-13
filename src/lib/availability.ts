import { Prisma, type Booking, type Room } from "@prisma/client";
import { prisma } from "./prisma";

type Db = Prisma.TransactionClient | typeof prisma;

export function countOverlappingBookings(
  db: Db,
  roomId: string,
  checkIn: Date,
  checkOut: Date,
) {
  return db.booking.count({
    where: {
      roomId,
      status: { not: "CANCELLED" },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
  });
}

type NewBooking = {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
};

type BookingResult =
  | { status: "ok"; booking: Booking & { room: Room } }
  | { status: "unavailable" }
  | { status: "busy" };

class Overbooked extends Error {}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isLockContention(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return e.code === "P2034" || e.code === "P1008";
  }
  return e instanceof Error && /database is locked|SQLITE_BUSY/i.test(e.message);
}

// Insert first, then verify inside the same transaction: the insert takes the write lock,
// so concurrent requests are serialized and any booking that would overbook rolls back.
export async function createBookingAtomically(
  data: NewBooking,
  attempts = 5,
): Promise<BookingResult> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const booking = await prisma.$transaction(async (tx) => {
        const created = await tx.booking.create({ data, include: { room: true } });
        const overlapping = await countOverlappingBookings(
          tx,
          data.roomId,
          data.checkIn,
          data.checkOut,
        );
        if (overlapping > created.room.totalUnits) throw new Overbooked();
        return created;
      });
      return { status: "ok", booking };
    } catch (e) {
      if (e instanceof Overbooked) return { status: "unavailable" };
      if (!isLockContention(e)) throw e;
      await sleep(30 * 2 ** attempt + Math.random() * 50);
    }
  }
  return { status: "busy" };
}
