import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSunSign, getMoonSign, getAscendant } from "@/lib/astrology";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { birthDate, birthTime, birthPlace, birthLat, birthLng } = await req.json();

  if (!birthDate) return NextResponse.json({ error: "Fecha de nacimiento requerida" }, { status: 400 });

  const date = new Date(birthDate);
  const sunSign = getSunSign(date);
  const moonSign = getMoonSign(date);
  const ascendant = birthTime && birthLat
    ? getAscendant(date, birthTime, birthLat)
    : sunSign;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { birthDate: date, birthTime, birthPlace, birthLat, birthLng, sunSign, moonSign, ascendant },
    select: { id: true, sunSign: true, moonSign: true, ascendant: true },
  });

  return NextResponse.json(user);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { birthDate: true, birthTime: true, birthPlace: true, birthLat: true, birthLng: true, sunSign: true, moonSign: true, ascendant: true },
  });

  return NextResponse.json(user);
}
