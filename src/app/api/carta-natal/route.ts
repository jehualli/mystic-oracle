import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateBirthChart } from "@/lib/astrology";
import { generateDetailedBirthChart } from "@/lib/openai";
import { getUserPurchases } from "@/lib/stripe";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, birthDate: true, birthTime: true, birthLat: true, sunSign: true, moonSign: true, ascendant: true },
  });

  if (!user?.birthDate) {
    return NextResponse.json({ error: "Necesitas ingresar tu fecha de nacimiento" }, { status: 400 });
  }

  const chart = calculateBirthChart(
    user.birthDate,
    user.birthTime ?? "12:00",
    user.birthLat ?? 0,
  );

  const purchases = await getUserPurchases(userId);
  const hasPurchased = purchases.includes("carta_natal_detallada");

  let detailedReading: string | null = null;
  if (hasPurchased) {
    detailedReading = await generateDetailedBirthChart(chart, user.name ?? "querida alma");
  }

  return NextResponse.json({ chart, hasPurchased, detailedReading });
}
