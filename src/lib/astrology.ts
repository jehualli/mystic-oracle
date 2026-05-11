import type { ZodiacSign, ZodiacInfo, BirthChartData, Planet, CompatibilityResult, Element } from "@/types";

export const ZODIAC_INFO: Record<ZodiacSign, ZodiacInfo> = {
  aries:       { sign: "aries",       symbol: "♈", glyph: "♈", element: "fuego",  modality: "cardinal", rulingPlanet: "Marte",   dates: "21 Mar – 19 Abr", traits: ["valiente", "impulsivo", "líder"],       color: "#e05555" },
  tauro:       { sign: "tauro",       symbol: "♉", glyph: "♉", element: "tierra", modality: "fijo",     rulingPlanet: "Venus",   dates: "20 Abr – 20 May", traits: ["leal", "sensual", "tenaz"],              color: "#6db56d" },
  geminis:     { sign: "geminis",     symbol: "♊", glyph: "♊", element: "aire",   modality: "mutable",  rulingPlanet: "Mercurio",dates: "21 May – 20 Jun", traits: ["curioso", "adaptable", "comunicativo"],  color: "#e0c055" },
  cancer:      { sign: "cancer",      symbol: "♋", glyph: "♋", element: "agua",   modality: "cardinal", rulingPlanet: "Luna",    dates: "21 Jun – 22 Jul", traits: ["intuitivo", "protector", "sensible"],    color: "#55a8e0" },
  leo:         { sign: "leo",         symbol: "♌", glyph: "♌", element: "fuego",  modality: "fijo",     rulingPlanet: "Sol",     dates: "23 Jul – 22 Ago", traits: ["carismático", "generoso", "orgulloso"],  color: "#e08c35" },
  virgo:       { sign: "virgo",       symbol: "♍", glyph: "♍", element: "tierra", modality: "mutable",  rulingPlanet: "Mercurio",dates: "23 Ago – 22 Sep", traits: ["analítico", "metódico", "perfeccionista"],color: "#7db55e" },
  libra:       { sign: "libra",       symbol: "♎", glyph: "♎", element: "aire",   modality: "cardinal", rulingPlanet: "Venus",   dates: "23 Sep – 22 Oct", traits: ["diplomático", "justo", "romántico"],     color: "#c06bbf" },
  escorpio:    { sign: "escorpio",    symbol: "♏", glyph: "♏", element: "agua",   modality: "fijo",     rulingPlanet: "Plutón",  dates: "23 Oct – 21 Nov", traits: ["intenso", "perspicaz", "transformador"], color: "#8b4580" },
  sagitario:   { sign: "sagitario",   symbol: "♐", glyph: "♐", element: "fuego",  modality: "mutable",  rulingPlanet: "Júpiter", dates: "22 Nov – 21 Dic", traits: ["aventurero", "filosófico", "optimista"],  color: "#d47a35" },
  capricornio: { sign: "capricornio", symbol: "♑", glyph: "♑", element: "tierra", modality: "cardinal", rulingPlanet: "Saturno", dates: "22 Dic – 19 Ene", traits: ["ambicioso", "disciplinado", "prudente"],  color: "#5b7a9e" },
  acuario:     { sign: "acuario",     symbol: "♒", glyph: "♒", element: "aire",   modality: "fijo",     rulingPlanet: "Urano",   dates: "20 Ene – 18 Feb", traits: ["innovador", "humanitario", "excéntrico"], color: "#4a9ec0" },
  piscis:      { sign: "piscis",      symbol: "♓", glyph: "♓", element: "agua",   modality: "mutable",  rulingPlanet: "Neptuno", dates: "19 Feb – 20 Mar", traits: ["empático", "intuitivo", "soñador"],       color: "#7070d4" },
};

const SIGN_ORDER: ZodiacSign[] = [
  "aries","tauro","geminis","cancer","leo","virgo",
  "libra","escorpio","sagitario","capricornio","acuario","piscis",
];

export function getSunSign(date: Date): ZodiacSign {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "aries";
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "tauro";
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "geminis";
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "cancer";
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "leo";
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "virgo";
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "libra";
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "escorpio";
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "sagitario";
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return "capricornio";
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "acuario";
  return "piscis";
}

export function getMoonSign(date: Date): ZodiacSign {
  // Simplified: moon cycle ≈ 27.32 days, ~2.28 days per sign
  // Reference: Jan 1, 2000 moon was at ~318° (Aquarius)
  const j2000 = new Date("2000-01-01").getTime();
  const daysSinceRef = (date.getTime() - j2000) / 86400000;
  const moonLongitude = (318 + daysSinceRef * (360 / 27.32)) % 360;
  const signIndex = Math.floor(((moonLongitude + 360) % 360) / 30);
  return SIGN_ORDER[signIndex];
}

export function getAscendant(date: Date, birthTime: string, lat: number): ZodiacSign {
  // Simplified ascendant using local sidereal time
  const [hours, minutes] = birthTime.split(":").map(Number);
  const fractionalHour = hours + minutes / 60;
  // GMST at J2000 ≈ 18.697 hours, advances 24h per sidereal day (23h56m)
  const j2000 = new Date("2000-01-01T12:00:00Z").getTime();
  const daysSince = (date.getTime() - j2000) / 86400000;
  const gmst = (18.697 + 24.06571 * daysSince) % 24;
  const lst = (gmst + fractionalHour + lat / 15) % 24;
  const ascDeg = (lst * 15 + 90) % 360;
  const signIndex = Math.floor(ascDeg / 30);
  return SIGN_ORDER[signIndex];
}

const PLANETS = ["Sol", "Luna", "Mercurio", "Venus", "Marte", "Júpiter", "Saturno"];
const GLYPHS  = ["☉", "☽", "☿", "♀", "♂", "♃", "♄"];

export function calculateBirthChart(
  birthDate: Date,
  birthTime: string = "12:00",
  birthLat: number = 0,
): BirthChartData {
  const sunSign = getSunSign(birthDate);
  const moonSign = getMoonSign(birthDate);
  const ascendant = getAscendant(birthDate, birthTime, birthLat);

  // Simplified planetary positions seeded from birth data
  const seed = birthDate.getTime();
  const planets: Planet[] = PLANETS.map((name, i) => {
    const pseudo = ((seed / 1000 + i * 137.508) % 360 + 360) % 360;
    const signIndex = Math.floor(pseudo / 30);
    const degree = pseudo % 30;
    return {
      name,
      glyph: GLYPHS[i],
      sign: SIGN_ORDER[signIndex],
      degree: Math.round(degree * 10) / 10,
      house: ((signIndex - SIGN_ORDER.indexOf(ascendant) + 12) % 12) + 1,
      retrograde: Math.sin(seed / 1e10 + i) < -0.6,
    };
  });

  // Houses start from ascendant
  const ascIdx = SIGN_ORDER.indexOf(ascendant);
  const houses = Array.from({ length: 12 }, (_, i) => SIGN_ORDER[(ascIdx + i) % 12]);

  return { sunSign, moonSign, ascendant, planets, houses };
}

const COMPATIBILITY_MATRIX: Record<string, number> = {
  "fuego-fuego": 85, "fuego-tierra": 55, "fuego-aire": 90, "fuego-agua": 45,
  "tierra-tierra": 80, "tierra-aire": 60, "tierra-agua": 75,
  "aire-aire": 85, "aire-agua": 65,
  "agua-agua": 88,
};

function getBaseScore(e1: Element, e2: Element): number {
  const key = [e1, e2].sort().join("-") as string;
  return COMPATIBILITY_MATRIX[key] ?? 70;
}

export function calculateCompatibility(sign1: ZodiacSign, sign2: ZodiacSign): CompatibilityResult {
  const info1 = ZODIAC_INFO[sign1];
  const info2 = ZODIAC_INFO[sign2];
  const base = getBaseScore(info1.element, info2.element);

  const modalityBonus = info1.modality === info2.modality ? -5 : 5;
  const overall = Math.min(99, Math.max(30, base + modalityBonus));
  const love = Math.min(99, Math.max(20, base + Math.floor(Math.random() * 15) - 7));
  const friendship = Math.min(99, Math.max(20, base + Math.floor(Math.random() * 15) - 7));
  const work = Math.min(99, Math.max(20, base + Math.floor(Math.random() * 15) - 7));

  return {
    sign1, sign2, overall, love, friendship, work,
    description: `La energía de ${info1.element} de ${sign1} ${overall > 70 ? "fluye armoniosamente" : "crea tensión creativa"} con el ${info2.element} de ${sign2}.`,
    strengths: [`Complementan sus energías de ${info1.element} y ${info2.element}`, `Ambos valoran ${overall > 70 ? "la armonía" : "el crecimiento personal"}`],
    challenges: [`Diferencias en estilo de comunicación`, `Gestionar expectativas ${info1.modality === info2.modality ? "similares" : "distintas"}`],
  };
}

export function getSignLabel(sign: ZodiacSign): string {
  const labels: Record<ZodiacSign, string> = {
    aries: "Aries", tauro: "Tauro", geminis: "Géminis", cancer: "Cáncer",
    leo: "Leo", virgo: "Virgo", libra: "Libra", escorpio: "Escorpio",
    sagitario: "Sagitario", capricornio: "Capricornio", acuario: "Acuario", piscis: "Piscis",
  };
  return labels[sign];
}
