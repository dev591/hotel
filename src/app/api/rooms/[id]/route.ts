import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeRoom } from "@/lib/serialize";
import { requireAdmin } from "@/lib/auth";
import { roomInputSchema } from "@/lib/validation";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
  return NextResponse.json(serializeRoom(room));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = roomInputSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { images, amenities, ...rest } = parsed.data;

  const room = await prisma.room.update({
    where: { id },
    data: {
      ...rest,
      ...(images ? { images: JSON.stringify(images) } : {}),
      ...(amenities ? { amenities: JSON.stringify(amenities) } : {}),
    },
  });

  return NextResponse.json(serializeRoom(room));
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.booking.deleteMany({ where: { roomId: id } });
  await prisma.room.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
