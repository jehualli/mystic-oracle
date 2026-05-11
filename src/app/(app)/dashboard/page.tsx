import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ZODIAC_INFO, getSignLabel } from "@/lib/astrology";
import type { ZodiacSign } from "@/types";

const QUICK_LINKS = [
  { href: "/horoscopo",      icon: "☉", label: "Horóscopo del Día",  desc: "Tu energía de hoy" },
  { href: "/carta-natal",    icon: "✧", label: "Carta Natal",         desc: "Tu mapa cósmico" },
  { href: "/compatibilidad", icon: "♡", label: "Compatibilidad",      desc: "Sinastría y amor" },
  { href: "/oraculo",        icon: "◈", label: "Oráculo",             desc: "Consulta a Mystika" },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as { id: string }).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, sunSign: true, moonSign: true, ascendant: true, birthDate: true },
  });

  if (!user) redirect("/login");

  const hasBirthData = !!user.birthDate;
  const sunInfo = user.sunSign ? ZODIAC_INFO[user.sunSign as ZodiacSign] : null;

  return (
    <div className="space-y-10 page-enter">
      {/* Welcome */}
      <div>
        <div className="ornament text-xs font-cinzel tracking-widest text-terracota-400 mb-3">
          PORTAL CÓSMICO
        </div>
        <h1 className="font-cinzel text-3xl text-tinta-400">
          Bienvenida, <span className="text-terracota-500">{user.name?.split(" ")[0]}</span>
        </h1>
        {sunInfo && (
          <p className="font-garamond text-tinta-200 mt-2">
            {sunInfo.symbol} {getSignLabel(user.sunSign as ZodiacSign)} · {sunInfo.dates}
          </p>
        )}
      </div>

      {/* Birth data prompt */}
      {!hasBirthData && (
        <div className="bg-terracota-400/10 border border-terracota-400/40 rounded-sm p-6 flex items-start gap-4">
          <div className="text-2xl text-terracota-400 flex-shrink-0">✦</div>
          <div className="flex-1">
            <p className="font-cinzel text-sm text-terracota-500 tracking-wider mb-1">COMPLETA TU PERFIL</p>
            <p className="font-garamond text-tinta-200 text-sm mb-4">
              Para generar tu carta natal necesitamos tu fecha, hora y lugar de nacimiento.
            </p>
            <Link
              href="/carta-natal"
              className="inline-block bg-terracota-500 text-parchment-100 font-cinzel tracking-wider text-xs px-5 py-2 rounded-sm hover:bg-terracota-600 transition-colors"
            >
              Ingresar datos de nacimiento
            </Link>
          </div>
        </div>
      )}

      {/* Sign card */}
      {sunInfo && (
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Sol", sign: user.sunSign, desc: "Tu identidad esencial" },
            { label: "Luna", sign: user.moonSign, desc: "Tu mundo emocional" },
            { label: "Ascendente", sign: user.ascendant, desc: "Tu máscara exterior" },
          ].map(({ label, sign, desc }) => {
            if (!sign) return null;
            const info = ZODIAC_INFO[sign as ZodiacSign];
            return (
              <div key={label} className="bg-parchment-100 border border-parchment-400 rounded-sm p-5 text-center">
                <p className="text-xs font-cinzel tracking-widest text-tinta-100 mb-2">{label.toUpperCase()}</p>
                <div className="text-3xl mb-1">{info.symbol}</div>
                <p className="font-cinzel text-sm text-tinta-400">{getSignLabel(sign as ZodiacSign)}</p>
                <p className="font-garamond text-xs text-tinta-100 mt-1">{desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick links */}
      <div>
        <p className="font-cinzel text-xs tracking-widest text-tinta-100 mb-4">NAVEGACIÓN</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_LINKS.map(({ href, icon, label, desc }) => (
            <Link key={href} href={href} className="group block">
              <div className="bg-parchment-100 border border-parchment-400 rounded-sm p-5 hover:border-terracota-400/60 hover:shadow-md transition-all duration-200">
                <div className="text-2xl text-terracota-400 mb-3 group-hover:scale-110 transition-transform duration-200">{icon}</div>
                <p className="font-cinzel text-sm text-tinta-400 tracking-wide">{label}</p>
                <p className="font-garamond text-xs text-tinta-100 mt-1">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
