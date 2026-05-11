import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(req: Request) {
  if (!stripe) return NextResponse.json({ error: "Stripe no configurado" }, { status: 503 });

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, productType } = session.metadata ?? {};

    if (!userId || !productType) return NextResponse.json({ ok: true });

    await prisma.purchase.upsert({
      where: { stripeId: session.id },
      update: { status: "completed" },
      create: {
        userId,
        productType,
        stripeId: session.id,
        amount: session.amount_total ?? 0,
        status: "completed",
        metadata: session.metadata ?? {},
      },
    });

    // If oracle session purchased, create a fresh chat session with credits
    if (productType === "sesion_oraculo") {
      await prisma.chatSession.create({
        data: { userId, credits: 10, messages: [], title: "Sesión del Oráculo" },
      });
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntent = charge.payment_intent as string;
    if (paymentIntent) {
      const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntent });
      for (const s of sessions.data) {
        await prisma.purchase.updateMany({
          where: { stripeId: s.id },
          data: { status: "refunded" },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
