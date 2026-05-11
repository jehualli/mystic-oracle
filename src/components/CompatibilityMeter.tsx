"use client";
import { motion } from "framer-motion";
import type { CompatibilityResult } from "@/types";
import { ZODIAC_INFO, getSignLabel } from "@/lib/astrology";

interface CompatibilityMeterProps {
  result: CompatibilityResult;
}

function ScoreBar({ label, score, delay = 0 }: { label: string; score: number; delay?: number }) {
  const color = score >= 80 ? "#6db56d" : score >= 60 ? "#d4a96a" : "#c87070";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-cinzel text-tinta-200 tracking-wider">
        <span>{label}</span>
        <span style={{ color }}>{score}%</span>
      </div>
      <div className="h-2 bg-parchment-300 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function CompatibilityMeter({ result }: CompatibilityMeterProps) {
  const info1 = ZODIAC_INFO[result.sign1];
  const info2 = ZODIAC_INFO[result.sign2];
  const overall = result.overall;
  const strokeDasharray = `${(overall / 100) * 283} 283`;

  return (
    <div className="space-y-8">
      {/* Signs header */}
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="text-5xl mb-1">{info1.symbol}</div>
          <p className="font-cinzel text-sm text-tinta-300">{getSignLabel(result.sign1)}</p>
          <p className="text-xs text-tinta-100 font-garamond">{info1.element}</p>
        </div>

        {/* Circular overall score */}
        <div className="relative flex items-center justify-center">
          <svg width="110" height="110">
            <circle cx="55" cy="55" r="45" fill="none" stroke="#e8d5c0" strokeWidth="8" />
            <motion.circle
              cx="55" cy="55" r="45"
              fill="none"
              stroke={overall >= 80 ? "#6db56d" : overall >= 60 ? "#d4a96a" : "#c87070"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset="283"
              transform="rotate(-90 55 55)"
              animate={{ strokeDashoffset: 283 - (overall / 100) * 283 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-cinzel text-2xl text-tinta-400">{overall}%</span>
            <span className="text-xs text-tinta-100 font-garamond">afinidad</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-5xl mb-1">{info2.symbol}</div>
          <p className="font-cinzel text-sm text-tinta-300">{getSignLabel(result.sign2)}</p>
          <p className="text-xs text-tinta-100 font-garamond">{info2.element}</p>
        </div>
      </div>

      {/* Score bars */}
      <div className="space-y-4">
        <ScoreBar label="Amor" score={result.love} delay={0.2} />
        <ScoreBar label="Amistad" score={result.friendship} delay={0.4} />
        <ScoreBar label="Trabajo" score={result.work} delay={0.6} />
      </div>

      {/* Description */}
      <p className="text-sm font-garamond text-tinta-200 italic text-center leading-relaxed border-t border-parchment-400 pt-4">
        {result.description}
      </p>

      {/* Strengths & Challenges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-cinzel text-terracota-500 tracking-widest">FORTALEZAS</p>
          {result.strengths.map((s, i) => (
            <p key={i} className="text-xs font-garamond text-tinta-200 flex items-start gap-1">
              <span className="text-oro-500 mt-0.5">✦</span> {s}
            </p>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-cinzel text-tinta-200 tracking-widest">DESAFÍOS</p>
          {result.challenges.map((c, i) => (
            <p key={i} className="text-xs font-garamond text-tinta-200 flex items-start gap-1">
              <span className="text-tinta-100 mt-0.5">◇</span> {c}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
