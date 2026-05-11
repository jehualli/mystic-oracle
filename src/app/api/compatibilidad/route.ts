import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateCompatibility } from "@/lib/astrology";
import { generateCompatibilityReport } from "@/lib/openai";
import { getUserPurchases } from "@/lib/stripe";
import type { ZodiacSign } from "@/types";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { sign1, sign2, name1, name2 } = await req.json();

  if (!sign1 || !sign2) {
    return NextResponse.json({ error: "Dos signos son requeridos" }, { status: 400 });
  }

  const result = calculateCompatibility(sign1 as ZodiacSign, sign2 as ZodiacSign);

  const purchases = await getUserPurchases(userId);
  const hasPurchased = purchases.includes("compatibilidad");

  let report: string | null = null;
  if (hasPurchased) {
    report = await generateCompatibilityReport(
      sign1 as ZodiacSign,
      sign2 as ZodiacSign,
      name1 ?? "Persona 1",
      name2 ?? "Persona 2",
    );
  }

  return NextResponse.json({ result, hasPurchased, report });
}
