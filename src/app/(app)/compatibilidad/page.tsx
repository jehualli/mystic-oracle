"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CompatibilityMeter } from "@/components/CompatibilityMeter";
import { PaywallModal } from "@/components/PaywallModal";
import { ZodiacWheel } from "@/components/ZodiacWheel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getSignLabel } from "@/lib/astrology";
import type { ZodiacSign, CompatibilityResult } from "@/types";

export default function CompatibilidadPage() {
  const [step, setStep] = useState<"select" | "result">("select");
  const [sign1, setSign1] = useState<ZodiacSign | null>(null);
  const [sign2, setSign2] = useState<ZodiacSign | null>(null);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [selecting, setSelecting] = useState<1 | 2>(1);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  function handleSelectSign(sign: ZodiacSign) {
    if (selecting === 1) { setSign1(sign); setSelecting(2); }
    else { setSign2(sign); }
  }

  async function calculate() {
    if (!sign1 || !sign2) return;
    setLoading(true);
    const res = await fetch("/api/compatibilidad", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sign1, sign2, name1: name1 || undefined, name2: name2 || undefined }),
    });
    const data = await res.json();
    setResult(data.result);
    setReport(data.report);
    setHasPurchased(data.hasPurchased);
    setStep("result");
    setLoading(false);
  }

  const payloadMetadata = sign1 && sign2 ? { sign1, sign2, name1, name2 } : undefined;

  return (
    <div className="space-y-10 page-enter">
      <div>
        <div className="ornament text-xs font-cinzel tracking-widest text-terracota-400 mb-3">SINASTRÍA</div>
        <h1 className="font-cinzel text-3xl text-tinta-400">Compatibilidad Zodiacal</h1>
        <p className="font-garamond text-tinta-200 mt-1">Descubre la química cósmica entre dos almas</p>
      </div>

      {step === "select" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Sign selector */}
            <div className="flex flex-col items-center gap-4">
              <ZodiacWheel
                onSelectSign={handleSelectSign}
                highlightSigns={[...(sign1 ? [sign1] : []), ...(sign2 ? [sign2] : [])]}
                size={300}
              />
              <p className="text-xs font-garamond text-tinta-100 italic">
                {!sign1
                  ? "Selecciona el primer signo"
                  : !sign2
                  ? "Ahora selecciona el segundo signo"
                  : "Puedes cambiar la selección"}
              </p>
            </div>

            {/* Selection panel */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {([
                  { n: 1, sign: sign1, active: selecting === 1 },
                  { n: 2, sign: sign2, active: selecting === 2 },
                ] as { n: 1 | 2; sign: ZodiacSign | null; active: boolean }[]).map(({ n, sign, active }) => (
                  <button
                    key={n}
                    onClick={() => setSelecting(n)}
                    className={`bg-parchment-100 border-2 rounded-sm p-5 text-center transition-all duration-200 ${
                      active ? "border-terracota-400 shadow-md" : "border-parchment-400"
                    }`}
                  >
                    {sign ? (
                      <>
                        <div className="text-3xl mb-1">{/* sign symbol */}</div>
                        <p className="font-cinzel text-sm text-tinta-400">{getSignLabel(sign)}</p>
                        <p className="text-xs text-tinta-100 font-garamond">Persona {n}</p>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl text-parchment-400 mb-1">?</div>
                        <p className="font-cinzel text-xs text-tinta-100 tracking-wider">PERSONA {n}</p>
                        <p className="text-xs text-tinta-100 font-garamond mt-1">
                          {active ? "Selecciona en la rueda" : "Toca para seleccionar"}
                        </p>
                      </>
                    )}
                  </button>
                ))}
              </div>

              {sign1 && sign2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Nombre (opcional)"
                      placeholder="Persona 1"
                      value={name1}
                      onChange={(e) => setName1(e.target.value)}
                    />
                    <Input
                      label="Nombre (opcional)"
                      placeholder="Persona 2"
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculate} loading={loading} className="w-full">
                    Calcular compatibilidad
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {step === "result" && result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="bg-parchment-100 border-2 border-parchment-400 rounded-sm p-8 max-w-xl mx-auto">
            <CompatibilityMeter result={result} />
          </div>

          {/* Detailed report paywall */}
          {!hasPurchased && (
            <div className="bg-terracota-400/10 border border-terracota-400/40 rounded-sm p-6 max-w-xl mx-auto">
              <p className="font-cinzel text-sm text-terracota-500 tracking-wider mb-2">INFORME COMPLETO DE SINASTRÍA</p>
              <p className="font-garamond text-sm text-tinta-200 mb-4">
                Desbloquea el análisis profundo generado por IA: dinámica emocional, comunicación, karma compartido y guía para la relación.
              </p>
              <Button onClick={() => setShowPaywall(true)} variant="outline" size="sm">
                Desbloquear informe por $3.99 MXN
              </Button>
            </div>
          )}

          {hasPurchased && report && (
            <div className="bg-parchment-100 border border-terracota-400/40 rounded-sm p-8 max-w-xl mx-auto">
              <p className="font-cinzel text-sm text-terracota-500 tracking-wider mb-4">✦ INFORME DE SINASTRÍA</p>
              <div className="font-garamond text-tinta-200 text-sm leading-relaxed whitespace-pre-line">{report}</div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => { setStep("select"); setSign1(null); setSign2(null); setSelecting(1); }}
              className="text-sm font-cinzel text-tinta-100 hover:text-terracota-500 tracking-wider transition-colors"
            >
              ← Nueva consulta
            </button>
          </div>
        </motion.div>
      )}

      {showPaywall && (
        <PaywallModal
          productType="compatibilidad"
          onClose={() => setShowPaywall(false)}
          metadata={payloadMetadata}
        />
      )}
    </div>
  );
}
