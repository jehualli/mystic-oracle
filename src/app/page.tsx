"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ZodiacWheel } from "@/components/ZodiacWheel";
import { useState } from "react";
import type { ZodiacSign } from "@/types";
import { ZODIAC_INFO, getSignLabel } from "@/lib/astrology";

const FEATURES = [
  { icon: "✧", title: "Carta Natal", desc: "Mapa celeste de tu nacimiento con posiciones planetarias y casas astrológicas.", href: "/carta-natal" },
  { icon: "☉", title: "Horóscopo Diario", desc: "Energías del día, amor y trabajo según tu signo solar.", href: "/horoscopo" },
  { icon: "♡", title: "Compatibilidad", desc: "Descubre la sinastría entre tú y otra persona.", href: "/compatibilidad" },
  { icon: "◈", title: "Oráculo IA", desc: "Consulta a Mystika, tu guía cósmica personalizada.", href: "/oraculo" },
];

export default function LandingPage() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const info = selectedSign ? ZODIAC_INFO[selectedSign] : null;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative background dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-terracota-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Text */}
          <motion.div
            className="flex-1 text-center lg:text-left space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="ornament text-sm font-cinzel tracking-widest text-terracota-400">
              ASTROLOGÍA ANCESTRAL
            </div>
            <h1 className="font-cinzel text-5xl lg:text-6xl text-tinta-400 leading-tight">
              Mystic<br />
              <span className="text-terracota-500">Oracle</span>
            </h1>
            <p className="font-garamond text-xl text-tinta-200 leading-relaxed max-w-lg">
              Los astros guardan el mapa de tu alma. Descubre tu carta natal,
              consulta al oráculo y comprende las estrellas que te guían.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/registro"
                className="bg-terracota-500 text-parchment-100 font-cinzel tracking-wider px-8 py-3.5 rounded-sm hover:bg-terracota-600 transition-colors text-sm shadow-md hover:shadow-lg"
              >
                Comenzar mi viaje
              </Link>
              <Link
                href="/login"
                className="border border-terracota-500 text-terracota-500 font-cinzel tracking-wider px-8 py-3.5 rounded-sm hover:bg-terracota-500 hover:text-parchment-100 transition-colors text-sm"
              >
                Iniciar sesión
              </Link>
            </div>
          </motion.div>

          {/* Right: Zodiac Wheel */}
          <motion.div
            className="flex-shrink-0 flex flex-col items-center gap-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ZodiacWheel
              selectedSign={selectedSign}
              onSelectSign={setSelectedSign}
              size={340}
            />

            {/* Selected sign info */}
            <div className="h-20 flex items-center justify-center">
              {info ? (
                <motion.div
                  key={selectedSign}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="font-cinzel text-lg text-terracota-500">{getSignLabel(selectedSign!)}</p>
                  <p className="text-sm font-garamond text-tinta-200">{info.dates} · {info.element}</p>
                  <p className="text-xs font-garamond text-tinta-100 mt-1">{info.traits.join(" · ")}</p>
                </motion.div>
              ) : (
                <p className="text-sm font-garamond text-tinta-100 italic">Toca un signo para descubrir su energía</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-parchment-400 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="ornament text-sm font-cinzel tracking-widest text-terracota-400 mb-12">
            EL CAMINO CÓSMICO
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link href={f.href} className="block group">
                  <div className="bg-parchment-100 border border-parchment-400 p-6 rounded-sm hover:border-terracota-400/60 hover:shadow-md transition-all duration-300 text-center space-y-3">
                    <div className="text-3xl text-terracota-400 group-hover:scale-110 transition-transform duration-300">
                      {f.icon}
                    </div>
                    <h3 className="font-cinzel text-sm text-tinta-400 tracking-wider">{f.title}</h3>
                    <p className="font-garamond text-tinta-100 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="border-t border-parchment-400 py-16 text-center">
        <div className="max-w-xl mx-auto px-6 space-y-6">
          <div className="text-4xl">☽ ✦ ☾</div>
          <h2 className="font-cinzel text-2xl text-tinta-400">Tu destino te espera</h2>
          <p className="font-garamond text-tinta-200">
            Únete a miles de almas que han descubierto su camino a través de los astros.
          </p>
          <Link
            href="/registro"
            className="inline-block bg-terracota-500 text-parchment-100 font-cinzel tracking-wider px-10 py-3.5 rounded-sm hover:bg-terracota-600 transition-colors text-sm shadow-md"
          >
            Crear mi cuenta gratuita
          </Link>
        </div>
      </section>
    </main>
  );
}
