"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/dashboard",      label: "Inicio",        icon: "✦" },
  { href: "/horoscopo",      label: "Horóscopo",     icon: "☉" },
  { href: "/carta-natal",    label: "Carta Natal",   icon: "✧" },
  { href: "/compatibilidad", label: "Compatibilidad", icon: "♡" },
  { href: "/oraculo",        label: "Oráculo",       icon: "◈" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-parchment-200/95 backdrop-blur-sm border-b border-parchment-400">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="font-cinzel text-xl text-terracota-500 tracking-widest flex items-center gap-2">
          <span className="text-2xl">☽</span>
          <span className="hidden sm:block">Mystic Oracle</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 text-xs font-cinzel tracking-wider rounded-sm transition-colors",
                pathname === href
                  ? "bg-terracota-500 text-parchment-100"
                  : "text-tinta-200 hover:text-terracota-500 hover:bg-parchment-300",
              )}
            >
              <span className="mr-1">{icon}</span>{label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {session?.user && (
            <span className="hidden sm:block text-xs font-garamond text-tinta-100">
              {session.user.name?.split(" ")[0]}
            </span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-xs font-cinzel text-tinta-200 hover:text-terracota-500 transition-colors tracking-wider"
          >
            Salir
          </button>
          <button
            className="md:hidden text-tinta-300 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-parchment-400 bg-parchment-200">
          {NAV_LINKS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-cinzel tracking-wider border-b border-parchment-300",
                pathname === href ? "text-terracota-500 bg-parchment-300" : "text-tinta-200",
              )}
            >
              <span>{icon}</span>{label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
