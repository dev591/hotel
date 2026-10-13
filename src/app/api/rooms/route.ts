import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeRoom } from "@/lib/serialize";
import { requireAdmin } from "@/lib/auth";
import { roomInputSchema } from "@/lib/validation";

export async function GET() {
  const rooms = await prisma.room.findMany({ orderBy: { pricePerNight: "asc" } });
  return NextResponse.json(rooms.map(serializeRoom));
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = roomInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const room = await prisma.room.create({
    data: {
      ...parsed.data,
      images: JSON.stringify(parsed.data.images),
      amenities: JSON.stringify(parsed.data.amenities),
    },
  });

  return NextResponse.json(serializeRoom(room), { status: 201 });
}
