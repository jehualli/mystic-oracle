"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ZodiacWheel } from "@/components/ZodiacWheel";
import { ZODIAC_INFO, getSignLabel } from "@/lib/astrology";
import type { ZodiacSign, DailyHoroscope } from "@/types";

const SIGNS: ZodiacSign[] = [
  "aries","tauro","geminis","cancer","leo","virgo",
  "libra","escorpio","sagitario","capricornio","acuario","piscis",
];

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>("aries");
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHoroscope(selectedSign);
  }, [selectedSign]);

  async function loadHoroscope(sign: ZodiacSign) {
    setLoading(true);
    setHoroscope(null);
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`/api/horoscopo?sign=${sign}&date=${today}`);
    const data = await res.json();
    setHoroscope(data);
    setLoading(false);
  }

  const info = ZODIAC_INFO[selectedSign];

  return (
    <div className="space-y-10 page-enter">
      <div>
        <div className="ornament text-xs font-cinzel tracking-widest text-terracota-400 mb-3">HORÓSCOPO DIARIO</div>
        <h1 className="font-cinzel text-3xl text-tinta-400">Los Astros Hablan</h1>
        <p className="font-garamond text-tinta-200 mt-1">Energía cósmica del día para cada signo</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Wheel */}
        <div className="flex flex-col items-center gap-4">
          <ZodiacWheel
            selectedSign={selectedSign}
            onSelectSign={setSelectedSign}
            size={300}
          />
          <p className="text-xs font-garamond text-tinta-100 italic">Selecciona tu signo</p>
        </div>

        {/* Horoscope card */}
        <div className="flex-1">
          <motion.div
            key={selectedSign}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-parchment-100 border-2 border-parchment-400 rounded-sm p-8 relative overflow-hidden"
          >
            {/* Corner ornaments */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-terracota-400/40" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-terracota-400/40" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-terracota-400/40" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-terracota-400/40" />

            <div className="text-center mb-8">
              <div className="text-5xl mb-2">{info.symbol}</div>
              <h2 className="font-cinzel text-2xl text-tinta-400">{getSignLabel(selectedSign)}</h2>
              <p className="font-garamond text-sm text-tinta-100 mt-1">{info.dates} · Regido por {info.rulingPlanet}</p>
            </div>

            {loading ? (
              <div className="text-center py-10 space-y-3">
                <motion.div
                  className="text-3xl text-terracota-400 mx-auto w-fit"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ✦
                </motion.div>
                <p className="font-garamond text-tinta-100 italic">Los astros están hablando...</p>
              </div>
            ) : horoscope ? (
              <div className="space-y-6">
                <p className="font-garamond text-tinta-200 text-base leading-relaxed italic text-center">
                  &ldquo;{horoscope.content}&rdquo;
                </p>

                <div className="ornament text-xs font-cinzel tracking-widest text-terracota-400/60">
                  ✦
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Energía del día", value: horoscope.energy, icon: "✦" },
                    { label: "En el amor",       value: horoscope.love,   icon: "♡" },
                    { label: "En el trabajo",    value: horoscope.work,   icon: "◇" },
                    { label: "Día propicio",     value: horoscope.lucky,  icon: "☽" },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="bg-parchment-200 rounded-sm p-4">
                      <p className="text-xs font-cinzel tracking-widest text-tinta-100 flex items-center gap-1 mb-2">
                        <span className="text-terracota-400">{icon}</span> {label.toUpperCase()}
                      </p>
                      <p className="font-garamond text-tinta-300 text-sm">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Element & traits */}
                <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-parchment-400">
                  <span className="text-xs font-cinzel text-tinta-100 tracking-widest">CARACTERÍSTICAS:</span>
                  {info.traits.map((t) => (
                    <span key={t} className="text-xs bg-terracota-400/10 text-terracota-500 px-2.5 py-1 rounded-sm font-garamond">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* Sign grid */}
      <div>
        <p className="font-cinzel text-xs tracking-widest text-tinta-100 mb-4">TODOS LOS SIGNOS</p>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {SIGNS.map((sign) => {
            const i = ZODIAC_INFO[sign];
            return (
              <button
                key={sign}
                onClick={() => setSelectedSign(sign)}
                className={`p-2 rounded-sm text-center transition-all duration-200 border ${
                  sign === selectedSign
                    ? "bg-terracota-500 text-parchment-100 border-terracota-500"
                    : "bg-parchment-100 border-parchment-400 hover:border-terracota-400/60"
                }`}
              >
                <div className="text-lg">{i.symbol}</div>
                <p className="text-xs font-cinzel mt-0.5 hidden sm:block">{getSignLabel(sign).slice(0, 3)}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
