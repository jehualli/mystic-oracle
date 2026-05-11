"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ZODIAC_INFO } from "@/lib/astrology";
import { getSignLabel } from "@/lib/astrology";
import type { ZodiacSign } from "@/types";

const SIGNS: ZodiacSign[] = [
  "aries","tauro","geminis","cancer","leo","virgo",
  "libra","escorpio","sagitario","capricornio","acuario","piscis",
];

interface ZodiacWheelProps {
  selectedSign?: ZodiacSign | null;
  onSelectSign?: (sign: ZodiacSign) => void;
  size?: number;
  interactive?: boolean;
  highlightSigns?: ZodiacSign[];
}

export function ZodiacWheel({
  selectedSign,
  onSelectSign,
  size = 340,
  interactive = true,
  highlightSigns = [],
}: ZodiacWheelProps) {
  const [hovered, setHovered] = useState<ZodiacSign | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * 0.55;
  const labelR = (outerR + innerR) / 2;

  function getSegmentPath(index: number) {
    const startAngle = (index * 30 - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180);
    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;
  }

  function getLabelPos(index: number) {
    const angle = (index * 30 - 75) * (Math.PI / 180);
    return {
      x: cx + labelR * Math.cos(angle),
      y: cy + labelR * Math.sin(angle),
    };
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.svg
        width={size}
        height={size}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", top: 0, left: 0 }}
        className="pointer-events-none opacity-10"
      >
        <circle cx={cx} cy={cy} r={outerR - 2} fill="none" stroke="#8b4513" strokeWidth="0.5" strokeDasharray="3 6" />
        <circle cx={cx} cy={cy} r={innerR + 2} fill="none" stroke="#8b4513" strokeWidth="0.5" strokeDasharray="3 6" />
      </motion.svg>

      <svg width={size} height={size} className="relative z-10">
        {/* Inner circle background */}
        <circle cx={cx} cy={cy} r={innerR - 2} fill="#fdf6ef" stroke="#d4b896" strokeWidth="1" />

        {/* Center ornament */}
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize="22" fill="#8b4513" opacity="0.8">☽</text>

        {/* Segments */}
        {SIGNS.map((sign, i) => {
          const info = ZODIAC_INFO[sign];
          const isSelected = sign === selectedSign;
          const isHighlighted = highlightSigns.includes(sign);
          const isHovered = sign === hovered;
          const labelPos = getLabelPos(i);
          const elementColors: Record<string, string> = {
            fuego: "#e8c4a0", tierra: "#c8d4a0", aire: "#c0d4e8", agua: "#c0c8e8",
          };
          const fill = isSelected || isHighlighted
            ? info.color + "cc"
            : isHovered
              ? elementColors[info.element]
              : elementColors[info.element] + "66";

          return (
            <g key={sign}>
              <path
                d={getSegmentPath(i)}
                fill={fill}
                stroke="#d4b896"
                strokeWidth="1"
                onClick={() => interactive && onSelectSign?.(sign)}
                onMouseEnter={() => interactive && setHovered(sign)}
                onMouseLeave={() => interactive && setHovered(null)}
                className={interactive ? "cursor-pointer transition-all duration-200" : ""}
              />
              <text
                x={labelPos.x}
                y={labelPos.y - 5}
                textAnchor="middle"
                fontSize={size > 280 ? 14 : 11}
                fill={isSelected || isHighlighted ? "#4a2509" : "#6b4f3c"}
                fontWeight={isSelected ? "bold" : "normal"}
              >
                {info.symbol}
              </text>
              {size > 260 && (
                <text
                  x={labelPos.x}
                  y={labelPos.y + 8}
                  textAnchor="middle"
                  fontSize={size > 320 ? 7 : 6}
                  fill="#9c7b5e"
                  letterSpacing="0.5"
                >
                  {getSignLabel(sign).toUpperCase().slice(0, 3)}
                </text>
              )}
            </g>
          );
        })}

        {/* Divider lines */}
        {SIGNS.map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          return (
            <line
              key={i}
              x1={cx + innerR * Math.cos(angle)}
              y1={cy + innerR * Math.sin(angle)}
              x2={cx + outerR * Math.cos(angle)}
              y2={cy + outerR * Math.sin(angle)}
              stroke="#d4b896"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovered && interactive && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-tinta-400 text-parchment-100 text-xs font-cinzel px-3 py-1 rounded-sm whitespace-nowrap z-20">
          {getSignLabel(hovered)} · {ZODIAC_INFO[hovered].dates}
        </div>
      )}
    </div>
  );
}
