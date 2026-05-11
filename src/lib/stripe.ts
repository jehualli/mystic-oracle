import Stripe from "stripe";
import type { ProductType } from "@/types";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

export const STRIPE_PRODUCTS: Record<ProductType, { name: string; description: string; price: number }> = {
  carta_natal_detallada: {
    name: "Lectura Detallada de Carta Natal",
    description: "Interpretación completa de tu carta astral con análisis de planetas, casas y aspectos. Generada por IA especializada.",
    price: 499,
  },
  compatibilidad: {
    name: "Informe de Compatibilidad",
    description: "Análisis profundo de la sinastría entre dos personas. Incluye amor, amistad y trabajo.",
    price: 399,
  },
  sesion_oraculo: {
    name: "Sesión con el Oráculo",
    description: "10 mensajes de consulta con Mystika, tu oráculo de IA personalizado.",
    price: 299,
  },
};

export async function createCheckoutSession(
  productType: ProductType,
  userId: string,
  userEmail: string,
  metadata?: Record<string, string>,
): Promise<string> {
  if (!stripe) throw new Error("Stripe no está configurado");
  const product = STRIPE_PRODUCTS[productType];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: "mxn",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      productType,
      ...metadata,
    },
    success_url: `${process.env.NEXTAUTH_URL}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}&product=${productType}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  });

  return session.url!;
}

export async function getUserPurchases(userId: string): Promise<ProductType[]> {
  const { prisma } = await import("./prisma");
  const purchases = await prisma.purchase.findMany({
    where: { userId, status: "completed" },
    select: { productType: true },
  });
  return purchases.map((p) => p.productType as ProductType);
}

export function hasPurchased(purchases: ProductType[], product: ProductType): boolean {
  return purchases.includes(product);
}
