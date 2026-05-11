import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Mystic Oracle · Astrología Bohemia",
  description: "Descubre los secretos de tu carta natal, horóscopo diario y compatibilidad zodiacal.",
  keywords: ["astrología", "horóscopo", "carta natal", "compatibilidad", "zodíaco"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="parchment-bg min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
