import { prisma } from "@/lib/prisma";
import { serializeRoom } from "@/lib/serialize";
import ExperienceLoader from "@/components/experience/ExperienceLoader";

export default async function HomePage() {
  const rooms = await prisma.room.findMany({ orderBy: { pricePerNight: "asc" } });
  return <ExperienceLoader rooms={rooms.map(serializeRoom)} />;
}

// Room data changes via the admin dashboard, so never prerender at build time.
export const dynamic = "force-dynamic";
