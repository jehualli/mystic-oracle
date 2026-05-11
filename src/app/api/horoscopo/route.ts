import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDailyHoroscope } from "@/lib/openai";
import type { ZodiacSign } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sign = searchParams.get("sign") as ZodiacSign;
  const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  if (!sign) return NextResponse.json({ error: "Signo requerido" }, { status: 400 });

  const cached = await prisma.dailyHoroscope.findUnique({
    where: { sign_date: { sign, date } },
  });

  if (cached) return NextResponse.json(cached);

  const generated = await generateDailyHoroscope(sign, date);

  const horoscope = await prisma.dailyHoroscope.create({
    data: { sign, date, ...generated },
  });

  return NextResponse.json(horoscope);
}
