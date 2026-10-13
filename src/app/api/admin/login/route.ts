import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createAdminSession(email);
  return NextResponse.json({ ok: true });
}
