import { prisma } from "@/lib/prisma";
import { serializeRoom } from "@/lib/serialize";
import RoomsManager from "@/components/admin/RoomsManager";

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { pricePerNight: "asc" },
  });

  return <RoomsManager initialRooms={rooms.map(serializeRoom)} />;
}
