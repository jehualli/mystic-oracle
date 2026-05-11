import OpenAI from "openai";
import type { ZodiacSign, BirthChartData } from "@/types";
import { getSignLabel, ZODIAC_INFO } from "./astrology";

export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const FALLBACK_HOROSCOPE_CONTENT: Record<ZodiacSign, string> = {
  aries:       "El fuego de Aries arde con fuerza hoy. La energía marciana te impulsa hacia adelante con valentía y determinación. Es un día propicio para iniciar proyectos y liderar con confianza.",
  tauro:       "Venus ilumina tu camino, Tauro. La tierra firme bajo tus pies te da estabilidad y claridad. Los placeres simples de la vida cobran especial significado hoy.",
  geminis:     "Mercurio activa tu mente brillante, Géminis. Las conversaciones fluyen con gracia y las ideas se multiplican. Este es un día para comunicar y conectar.",
  cancer:      "La Luna, tu regente, te abraza con luz plateada. Las emociones son tu guía más confiable hoy. Confía en tu intuición y cuida de quienes amas.",
  leo:         "El Sol, tu astro rey, brilla sobre ti con especial intensidad. Tu carisma natural atrae miradas y tu corazón generoso toca a quienes te rodean.",
  virgo:       "Mercurio agudiza tu percepción analítica. Los detalles que otros ignoran se revelan ante ti con claridad. Es un día excelente para organizar y perfeccionar.",
  libra:       "Venus teje armonía en tu entorno. La balanza encuentra su equilibrio y las relaciones florecen con naturalidad. La belleza está en todas partes si la buscas.",
  escorpio:    "Plutón remueve las profundidades de tu alma. Las transformaciones que experimentas son necesarias y poderosas. Abraza el cambio con la fuerza del escorpión.",
  sagitario:   "Júpiter expande tu horizonte con nuevas posibilidades. La aventura te llama y la sabiduría se acumula con cada experiencia. Sigue la flecha hacia tu verdad.",
  capricornio: "Saturno recompensa tu disciplina constante. Los cimientos que has construido con esfuerzo comienzan a mostrar su solidez. La cima está más cerca de lo que crees.",
  acuario:     "Urano despierta tu visión innovadora. El futuro que imaginas puede convertirse en realidad con voluntad y creatividad. Tu originalidad es tu mayor fortaleza.",
  piscis:      "Neptuno envuelve tu alma en sueños luminosos. La intuición fluye como agua clara y los misterios se revelan suavemente. Conecta con tu esencia más profunda.",
};

export async function generateDailyHoroscope(sign: ZodiacSign, date: string): Promise<{
  content: string; energy: string; love: string; work: string; lucky: string;
}> {
  const info = ZODIAC_INFO[sign];
  const fallback = {
    content: FALLBACK_HOROSCOPE_CONTENT[sign],
    energy: info.element.charAt(0).toUpperCase() + info.element.slice(1) + " activo",
    love: "Conexiones auténticas florecen hoy",
    work: "La claridad guía tus decisiones",
    lucky: info.rulingPlanet,
  };

  if (!openai) return fallback;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Eres una astróloga experta. Generas horóscopos poéticos en español. Responde SOLO con JSON válido, sin markdown.`,
        },
        {
          role: "user",
          content: `Genera el horóscopo del día para ${getSignLabel(sign)} para el ${date}.
Responde con este JSON exacto:
{
  "content": "párrafo de 3-4 oraciones sobre energía general del día",
  "energy": "adjetivo + sustantivo (ej: Fuego expansivo)",
  "love": "frase corta de 5-8 palabras sobre amor",
  "work": "frase corta de 5-8 palabras sobre trabajo",
  "lucky": "día de la semana o número de la suerte"
}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    return JSON.parse(completion.choices[0].message.content ?? "{}");
  } catch {
    return fallback;
  }
}

export async function generateDetailedBirthChart(chart: BirthChartData, name: string): Promise<string> {
  if (!openai) {
    return `Lectura de carta natal para ${name}\n\nSol en ${getSignLabel(chart.sunSign)}, Luna en ${getSignLabel(chart.moonSign)}, Ascendente en ${getSignLabel(chart.ascendant)}.\n\nConfigura tu OPENAI_API_KEY en el archivo .env para recibir una interpretación personalizada completa generada por inteligencia artificial.`;
  }

  const prompt = `
Nombre: ${name}
Sol en ${getSignLabel(chart.sunSign)}, Luna en ${getSignLabel(chart.moonSign)}, Ascendente ${getSignLabel(chart.ascendant)}
Planetas: ${chart.planets.map(p => `${p.name} en ${getSignLabel(p.sign)} Casa ${p.house}${p.retrograde ? " (Rx)" : ""}`).join(", ")}

Genera una interpretación astrológica completa y personalizada en español. Incluye:
1. Perfil del alma (sol/luna/ascendente)
2. Patrones kármicos y dones
3. Relaciones y amor
4. Carrera y propósito de vida
5. Desafíos y crecimiento personal

Usa un tono poético, místico y profundo. Mínimo 600 palabras.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Eres una astróloga maestra. Tus lecturas son profundas, personalizadas y transformadoras." },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      max_tokens: 1500,
    });
    return completion.choices[0].message.content ?? "No se pudo generar la lectura.";
  } catch {
    return "Error al generar la lectura. Verifica tu OPENAI_API_KEY.";
  }
}

export async function generateCompatibilityReport(
  sign1: ZodiacSign, sign2: ZodiacSign,
  name1: string, name2: string,
): Promise<string> {
  if (!openai) {
    return `Informe de compatibilidad entre ${name1} (${getSignLabel(sign1)}) y ${name2} (${getSignLabel(sign2)}).\n\nConfigura tu OPENAI_API_KEY en el archivo .env para recibir un análisis de sinastría personalizado.`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Eres una astróloga especialista en sinastría. Tus análisis son profundos y útiles." },
        {
          role: "user",
          content: `Analiza la compatibilidad entre ${name1} (${getSignLabel(sign1)}) y ${name2} (${getSignLabel(sign2)}).
Incluye: dinámica general, química romántica, compatibilidad emocional, comunicación, desafíos y consejos.
Tono cálido, poético y honesto. Mínimo 500 palabras en español.`,
        },
      ],
      temperature: 0.85,
      max_tokens: 1200,
    });
    return completion.choices[0].message.content ?? "No se pudo generar el informe.";
  } catch {
    return "Error al generar el informe. Verifica tu OPENAI_API_KEY.";
  }
}

export async function* streamOracleResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  userBirthData: { sunSign?: string; moonSign?: string; ascendant?: string } | null,
) {
  if (!openai) {
    yield "El oráculo necesita una OPENAI_API_KEY para despertar. Configúrala en tu archivo .env y reinicia el servidor. ✦";
    return;
  }

  const systemPrompt = userBirthData?.sunSign
    ? `Eres Mystika, una oráculo ancestral de sabiduría cósmica. Hablas en español con un tono místico, poético y profundo.
       El consultante tiene: Sol en ${getSignLabel(userBirthData.sunSign as ZodiacSign)}, Luna en ${getSignLabel(userBirthData.moonSign as ZodiacSign)}, Ascendente ${getSignLabel(userBirthData.ascendant as ZodiacSign)}.
       Usa esta información para personalizar tus respuestas. Sé sabia, empática y reveladora.`
    : `Eres Mystika, una oráculo ancestral de sabiduría cósmica. Hablas en español con un tono místico, poético y profundo. Eres sabia, empática y reveladora.`;

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    temperature: 0.9,
    max_tokens: 600,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}
