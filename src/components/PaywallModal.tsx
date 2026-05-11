"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { STRIPE_PRODUCTS } from "@/lib/stripe";
import type { ProductType } from "@/types";

interface PaywallModalProps {
  productType: ProductType;
  onClose: () => void;
  metadata?: Record<string, string>;
}

export function PaywallModal({ productType, onClose, metadata }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const product = STRIPE_PRODUCTS[productType];

  const price = (product.price / 100).toFixed(2);

  const [stripeError, setStripeError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setStripeError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType, metadata }),
      });
      const data = await res.json();
      if (res.status === 503) {
        setStripeError("Pagos no disponibles aún. Configura tus claves Stripe en .env");
        setLoading(false);
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tinta-500/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-parchment-100 border-2 border-terracota-400/40 rounded-sm p-8 max-w-md w-full shadow-2xl relative"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Corner ornaments */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-terracota-400/60" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-terracota-400/60" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-terracota-400/60" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-terracota-400/60" />

          <div className="text-center space-y-4">
            <div className="text-4xl">✦</div>
            <h2 className="font-cinzel text-xl text-terracota-500 tracking-wider">{product.name}</h2>
            <p className="font-garamond text-tinta-200 text-sm leading-relaxed">{product.description}</p>

            <div className="border-y border-parchment-400 py-4 my-4">
              <p className="font-cinzel text-3xl text-tinta-400">
                ${price} <span className="text-base text-tinta-100">MXN</span>
              </p>
              <p className="text-xs text-tinta-100 font-garamond mt-1">Pago único · Sin suscripción</p>
            </div>

            <ul className="text-left space-y-2 text-sm font-garamond text-tinta-200">
              {productType === "carta_natal_detallada" && (
                <>
                  <li className="flex items-start gap-2"><span className="text-terracota-400">✦</span> Interpretación completa de planetas en casas</li>
                  <li className="flex items-start gap-2"><span className="text-terracota-400">✦</span> Análisis de aspectos y patrones kármicos</li>
                  <li className="flex items-start gap-2"><span className="text-terracota-400">✦</span> Lectura de amor, carrera y propósito de vida</li>
                </>
              )}
              {productType === "compatibilidad" && (
                <>
                  <li className="flex items-start gap-2"><span className="text-terracota-400">✦</span> Análisis profundo de sinastría</li>
                  <li className="flex items-start gap-2"><span className="text-terracota-400">✦</span> Compatibilidad en amor, amistad y trabajo</li>
                  <li className="flex items-start gap-2"><span className="text-terracota-400">✦</span> Consejos personalizados para la relación</li>
                </>
              )}
              {productType === "sesion_oraculo" && (
                <>
                  <li className="flex items-start gap-2"><span className="text-terracota-400">✦</span> 10 mensajes con el Oráculo IA personalizado</li>
                  <li className="flex items-start gap-2"><span className="text-terracota-400">✦</span> Respuestas basadas en tu carta natal</li>
                  <li className="flex items-start gap-2"><span className="text-terracota-400">✦</span> Acceso inmediato al completar el pago</li>
                </>
              )}
            </ul>

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Después
              </Button>
              <Button onClick={handleCheckout} loading={loading} className="flex-1">
                Continuar al pago
              </Button>
            </div>

            {stripeError && (
              <p className="text-xs text-amber-700 font-garamond bg-amber-50 border border-amber-200 px-3 py-2 rounded-sm">
                ⚠ {stripeError}
              </p>
            )}
            <p className="text-xs text-tinta-100 font-garamond flex items-center justify-center gap-1">
              <span>🔒</span> Pago seguro con Stripe
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
