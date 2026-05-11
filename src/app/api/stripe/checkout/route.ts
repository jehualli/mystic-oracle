import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession } from "@/lib/stripe";
import type { ProductType } from "@/types";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { productType, metadata } = await req.json();

  if (!productType) return NextResponse.json({ error: "Producto requerido" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user?.email) return NextResponse.json({ error: "Usuario inválido" }, { status: 400 });

  let url: string;
  try {
    url = await createCheckoutSession(productType as ProductType, userId, user.email, metadata);
  } catch {
    return NextResponse.json({ error: "Stripe no está configurado. Agrega tus claves en .env" }, { status: 503 });
  }

  return NextResponse.json({ url });
}
