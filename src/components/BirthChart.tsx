"use client";
import { useState } from "react";
import type { BirthChartData, Planet } from "@/types";
import { ZODIAC_INFO, getSignLabel } from "@/lib/astrology";

const PLANET_COLORS: Record<string, string> = {
  Sol: "#d4a96a", Luna: "#9db8d4", Mercurio: "#a8c8a0",
  Venus: "#d4a0a0", Marte: "#c87070", Júpiter: "#c8a870", Saturno: "#9898a8",
};

interface BirthChartProps {
  data: BirthChartData;
  size?: number;
}

export function BirthChart({ data, size = 380 }: BirthChartProps) {
  const [tooltip, setTooltip] = useState<{ planet: Planet; x: number; y: number } | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 6;
  const zodiacR = outerR - 22;
  const houseR = zodiacR - 28;
  const planetR = houseR - 16;

  const SIGNS_ORDER = [
    "aries","tauro","geminis","cancer","leo","virgo",
    "libra","escorpio","sagitario","capricornio","acuario","piscis",
  ];

  function degToRad(deg: number) {
    return (deg - 90) * (Math.PI / 180);
  }

  function zodiacToAngle(sign: string, degree: number): number {
    const signIdx = SIGNS_ORDER.indexOf(sign);
    return signIdx * 30 + degree;
  }

  function polarToXY(angleDeg: number, r: number) {
    const rad = degToRad(angleDeg);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const ascDeg = zodiacToAngle(data.ascendant, 0);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Outer zodiac ring */}
        <circle cx={cx} cy={cy} r={outerR} fill="#f5ede0" stroke="#d4b896" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={zodiacR} fill="#fdf6ef" stroke="#d4b896" strokeWidth="1" />

        {/* Zodiac sign segments */}
        {SIGNS_ORDER.map((sign, i) => {
          const info = ZODIAC_INFO[sign as keyof typeof ZODIAC_INFO];
          const startAngle = degToRad(i * 30 - ascDeg);
          const endAngle = degToRad((i + 1) * 30 - ascDeg);
          const midAngle = degToRad(i * 30 + 15 - ascDeg);
          const lx = cx + (outerR - 11) * Math.cos(midAngle);
          const ly = cy + (outerR - 11) * Math.sin(midAngle);
          const x1 = cx + outerR * Math.cos(startAngle);
          const y1 = cy + outerR * Math.sin(startAngle);
          const x2 = cx + zodiacR * Math.cos(startAngle);
          const y2 = cy + zodiacR * Math.sin(startAngle);

          const elementColors: Record<string, string> = {
            fuego: "#f0d8c0", tierra: "#d8e8c0", aire: "#c8e0f0", agua: "#c8d0f0",
          };

          return (
            <g key={sign}>
              <path
                d={`M ${cx + outerR * Math.cos(startAngle)} ${cy + outerR * Math.sin(startAngle)}
                    A ${outerR} ${outerR} 0 0 1 ${cx + outerR * Math.cos(endAngle)} ${cy + outerR * Math.sin(endAngle)}
                    L ${cx + zodiacR * Math.cos(endAngle)} ${cy + zodiacR * Math.sin(endAngle)}
                    A ${zodiacR} ${zodiacR} 0 0 0 ${cx + zodiacR * Math.cos(startAngle)} ${cy + zodiacR * Math.sin(startAngle)} Z`}
                fill={elementColors[info.element]}
                stroke="#d4b896"
                strokeWidth="0.5"
              />
              <text x={lx} y={ly + 4} textAnchor="middle" fontSize="11" fill="#6b4f3c">
                {info.symbol}
              </text>
              {/* Divider line */}
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4b896" strokeWidth="0.5" />
            </g>
          );
        })}

        {/* House ring */}
        <circle cx={cx} cy={cy} r={houseR} fill="#fefaf5" stroke="#e8d5c0" strokeWidth="0.8" />

        {/* House divisions (12 equal) */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = degToRad(i * 30);
          const x1 = cx + zodiacR * Math.cos(angle);
          const y1 = cy + zodiacR * Math.sin(angle);
          const x2 = cx + houseR * Math.cos(angle);
          const y2 = cy + houseR * Math.sin(angle);
          const lx = cx + (zodiacR - 14) * Math.cos(degToRad(i * 30 + 15));
          const ly = cy + (zodiacR - 14) * Math.sin(degToRad(i * 30 + 15));
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d4b896" strokeWidth={i % 3 === 0 ? "1.5" : "0.5"} />
              <text x={lx} y={ly + 3} textAnchor="middle" fontSize="7" fill="#9c7b5e">{i + 1}</text>
            </g>
          );
        })}

        {/* Planet ring */}
        <circle cx={cx} cy={cy} r={planetR} fill="none" stroke="#e8d5c0" strokeWidth="0.5" strokeDasharray="2 4" />

        {/* Planet glyphs */}
        {data.planets.map((planet) => {
          const angle = zodiacToAngle(planet.sign, planet.degree) - ascDeg;
          const pos = polarToXY(angle, planetR - 6);
          const color = PLANET_COLORS[planet.name] ?? "#8b7a6a";
          return (
            <g key={planet.name}>
              <circle cx={pos.x} cy={pos.y} r={11} fill={color} opacity="0.85" stroke="#d4b896" strokeWidth="0.5" />
              <text
                x={pos.x} y={pos.y + 4}
                textAnchor="middle" fontSize="9" fill="#2c1810"
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => setTooltip({ planet, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setTooltip(null)}
              >
                {planet.glyph}
              </text>
            </g>
          );
        })}

        {/* Ascendant marker */}
        {(() => {
          const p1 = polarToXY(0, houseR);
          const p2 = polarToXY(0, zodiacR);
          return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#c4783a" strokeWidth="2" strokeLinecap="round" />;
        })()}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={5} fill="#8b4513" />
        <circle cx={cx} cy={cy} r={3} fill="#d4a96a" />
      </svg>

      {/* Planet tooltip */}
      {tooltip && (
        <div className="fixed z-50 bg-tinta-400 text-parchment-100 text-xs font-garamond px-3 py-2 rounded-sm pointer-events-none shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y - 30 }}>
          <p className="font-cinzel text-oro-300">{tooltip.planet.name}</p>
          <p>{getSignLabel(tooltip.planet.sign)} {tooltip.planet.degree.toFixed(1)}°</p>
          <p>Casa {tooltip.planet.house}{tooltip.planet.retrograde ? " · Rx" : ""}</p>
        </div>
      )}
    </div>
  );
}
