"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BirthChart } from "@/components/BirthChart";
import { PaywallModal } from "@/components/PaywallModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ZODIAC_INFO, getSignLabel } from "@/lib/astrology";
import type { BirthChartData, ZodiacSign } from "@/types";

export default function CartaNatalPage() {
  const [birthData, setBirthData] = useState({ birthDate: "", birthTime: "", birthPlace: "", birthLat: "", birthLng: "" });
  const [chart, setChart] = useState<BirthChartData | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [detailedReading, setDetailedReading] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/carta-natal")
      .then((r) => r.json())
      .then((data) => {
        if (data.chart) {
          setChart(data.chart);
          setHasPurchased(data.hasPurchased);
          setDetailedReading(data.detailedReading);
        }
      })
      .finally(() => setFetchLoading(false));
  }, []);

  async function saveBirthData(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/user/birth-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        birthDate: birthData.birthDate,
        birthTime: birthData.birthTime,
        birthPlace: birthData.birthPlace,
        birthLat: birthData.birthLat ? parseFloat(birthData.birthLat) : undefined,
        birthLng: birthData.birthLng ? parseFloat(birthData.birthLng) : undefined,
      }),
    });

    setLoading(true);
    const res = await fetch("/api/carta-natal");
    const data = await res.json();
    setChart(data.chart);
    setHasPurchased(data.hasPurchased);
    setDetailedReading(data.detailedReading);
    setSaving(false);
    setLoading(false);
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-3">
          <div className="text-3xl animate-spin-slow">✦</div>
          <p className="font-garamond text-tinta-200">Consultando los astros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 page-enter">
      <div>
        <div className="ornament text-xs font-cinzel tracking-widest text-terracota-400 mb-3">CARTA ASTRAL</div>
        <h1 className="font-cinzel text-3xl text-tinta-400">Tu Carta Natal</h1>
        <p className="font-garamond text-tinta-200 mt-1">El mapa celeste del momento de tu nacimiento</p>
      </div>

      {!chart ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="max-w-lg bg-parchment-100 border border-parchment-400 rounded-sm p-8">
            <p className="font-cinzel text-sm text-tinta-300 tracking-wider mb-6">DATOS DE NACIMIENTO</p>
            <form onSubmit={saveBirthData} className="space-y-5">
              <Input
                label="Fecha de nacimiento"
                type="date"
                value={birthData.birthDate}
                onChange={(e) => setBirthData({ ...birthData, birthDate: e.target.value })}
                required
              />
              <Input
                label="Hora de nacimiento"
                type="time"
                value={birthData.birthTime}
                onChange={(e) => setBirthData({ ...birthData, birthTime: e.target.value })}
                placeholder="12:00 (si no la sabes)"
              />
              <Input
                label="Lugar de nacimiento"
                value={birthData.birthPlace}
                onChange={(e) => setBirthData({ ...birthData, birthPlace: e.target.value })}
                placeholder="Ciudad, País"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Latitud (opcional)"
                  type="number"
                  step="0.0001"
                  value={birthData.birthLat}
                  onChange={(e) => setBirthData({ ...birthData, birthLat: e.target.value })}
                  placeholder="19.4326"
                />
                <Input
                  label="Longitud (opcional)"
                  type="number"
                  step="0.0001"
                  value={birthData.birthLng}
                  onChange={(e) => setBirthData({ ...birthData, birthLng: e.target.value })}
                  placeholder="-99.1332"
                />
              </div>
              <Button type="submit" loading={saving} className="w-full">
                Generar mi carta natal
              </Button>
            </form>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-10">
          {/* Chart + planets grid */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <BirthChart data={chart} size={380} />
            </motion.div>

            <div className="flex-1 space-y-6">
              {/* Big three */}
              <div className="grid grid-cols-3 gap-3">
                {([
                  ["Sol", chart.sunSign, "Tu alma"],
                  ["Luna", chart.moonSign, "Tus emociones"],
                  ["Asc.", chart.ascendant, "Tu presencia"],
                ] as [string, ZodiacSign, string][]).map(([label, sign, desc]) => {
                  const info = ZODIAC_INFO[sign];
                  return (
                    <div key={label} className="bg-parchment-100 border border-parchment-400 rounded-sm p-4 text-center">
                      <p className="text-xs font-cinzel text-tinta-100 tracking-widest">{label.toUpperCase()}</p>
                      <div className="text-2xl my-1">{info.symbol}</div>
                      <p className="font-cinzel text-xs text-tinta-400">{getSignLabel(sign)}</p>
                      <p className="font-garamond text-xs text-tinta-100 mt-0.5">{desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Planet list */}
              <div className="bg-parchment-100 border border-parchment-400 rounded-sm p-5">
                <p className="font-cinzel text-xs tracking-widest text-tinta-100 mb-4">POSICIONES PLANETARIAS</p>
                <div className="space-y-2">
                  {chart.planets.map((planet) => (
                    <div key={planet.name} className="flex items-center justify-between text-sm">
                      <span className="font-garamond text-tinta-200 flex items-center gap-2">
                        <span>{planet.glyph}</span>
                        <span>{planet.name}</span>
                        {planet.retrograde && <span className="text-xs text-terracota-400">Rx</span>}
                      </span>
                      <span className="font-cinzel text-xs text-tinta-300 tracking-wide">
                        {getSignLabel(planet.sign)} {planet.degree.toFixed(1)}° · Casa {planet.house}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unlock detailed reading */}
              {!hasPurchased ? (
                <div className="bg-terracota-400/10 border border-terracota-400/40 rounded-sm p-5">
                  <p className="font-cinzel text-sm text-terracota-500 tracking-wider mb-2">LECTURA DETALLADA</p>
                  <p className="font-garamond text-sm text-tinta-200 mb-4">
                    Desbloquea la interpretación completa de tu carta con análisis de aspectos, patrones kármicos y guía personalizada.
                  </p>
                  <Button onClick={() => setShowPaywall(true)} variant="outline" size="sm">
                    Desbloquear por $4.99 MXN
                  </Button>
                </div>
              ) : detailedReading ? (
                <div className="bg-parchment-100 border border-terracota-400/40 rounded-sm p-6">
                  <p className="font-cinzel text-sm text-terracota-500 tracking-wider mb-4">✦ TU LECTURA PERSONAL</p>
                  <div className="font-garamond text-tinta-200 text-sm leading-relaxed whitespace-pre-line">
                    {detailedReading}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {showPaywall && (
        <PaywallModal productType="carta_natal_detallada" onClose={() => setShowPaywall(false)} />
      )}
    </div>
  );
}
