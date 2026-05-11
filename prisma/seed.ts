import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SIGNS = [
  "aries", "tauro", "geminis", "cancer", "leo", "virgo",
  "libra", "escorpio", "sagitario", "capricornio", "acuario", "piscis",
];

const horoscopeTemplates: Record<string, { energy: string; love: string; work: string; lucky: string }> = {
  aries:       { energy: "Fuego expansivo", love: "Apasionado y directo", work: "Líder natural", lucky: "Martes" },
  tauro:       { energy: "Tierra firme",    love: "Sensual y leal",       work: "Constante y productivo", lucky: "Viernes" },
  geminis:     { energy: "Aire cambiante",  love: "Curioso y sociable",   work: "Multitarea brillante", lucky: "Miércoles" },
  cancer:      { energy: "Agua profunda",   love: "Tierno y protector",   work: "Intuitivo y creativo", lucky: "Lunes" },
  leo:         { energy: "Fuego radiante",  love: "Generoso y magnético", work: "Creativo y audaz", lucky: "Domingo" },
  virgo:       { energy: "Tierra perfecta", love: "Detallista y fiel",    work: "Analítico y eficiente", lucky: "Miércoles" },
  libra:       { energy: "Aire armonioso",  love: "Diplomático y romántico", work: "Equilibrado y justo", lucky: "Viernes" },
  escorpio:    { energy: "Agua intensa",    love: "Intenso y transformador", work: "Investigador y perspicaz", lucky: "Martes" },
  sagitario:   { energy: "Fuego expansivo", love: "Aventurero y honesto",  work: "Optimista y filosófico", lucky: "Jueves" },
  capricornio: { energy: "Tierra sólida",   love: "Serio y comprometido",  work: "Ambicioso y disciplinado", lucky: "Sábado" },
  acuario:     { energy: "Aire innovador",  love: "Libre y original",     work: "Visionario y humanitario", lucky: "Sábado" },
  piscis:      { energy: "Agua mística",    love: "Romántico y empático",  work: "Intuitivo y artístico", lucky: "Jueves" },
};

async function main() {
  const today = new Date().toISOString().split("T")[0];

  for (const sign of SIGNS) {
    const tmpl = horoscopeTemplates[sign];
    await prisma.dailyHoroscope.upsert({
      where: { sign_date: { sign, date: today } },
      update: {},
      create: {
        sign,
        date: today,
        content: `Las estrellas favorecen a ${sign} hoy. Es un momento propicio para tomar iniciativas y confiar en tu intuición. Los astros traen energía renovada para enfrentar los desafíos con sabiduría y valentía.`,
        energy: tmpl.energy,
        love: tmpl.love,
        work: tmpl.work,
        lucky: tmpl.lucky,
      },
    });
  }

  console.log("✓ Seed completado");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
