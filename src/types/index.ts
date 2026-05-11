export type ZodiacSign =
  | "aries" | "tauro" | "geminis" | "cancer" | "leo" | "virgo"
  | "libra" | "escorpio" | "sagitario" | "capricornio" | "acuario" | "piscis";

export type Element = "fuego" | "tierra" | "aire" | "agua";
export type Modality = "cardinal" | "fijo" | "mutable";
export type ProductType = "carta_natal_detallada" | "compatibilidad" | "sesion_oraculo";

export interface ZodiacInfo {
  sign: ZodiacSign;
  symbol: string;
  glyph: string;
  element: Element;
  modality: Modality;
  rulingPlanet: string;
  dates: string;
  traits: string[];
  color: string;
}

export interface Planet {
  name: string;
  glyph: string;
  sign: ZodiacSign;
  degree: number;
  house: number;
  retrograde: boolean;
}

export interface BirthChartData {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  ascendant: ZodiacSign;
  planets: Planet[];
  houses: ZodiacSign[];
}

export interface CompatibilityResult {
  sign1: ZodiacSign;
  sign2: ZodiacSign;
  overall: number;
  love: number;
  friendship: number;
  work: number;
  description: string;
  strengths: string[];
  challenges: string[];
}

export interface DailyHoroscope {
  sign: ZodiacSign;
  date: string;
  content: string;
  energy: string;
  love: string;
  work: string;
  lucky: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface StripeProduct {
  type: ProductType;
  name: string;
  description: string;
  price: number;
  priceId: string;
}
