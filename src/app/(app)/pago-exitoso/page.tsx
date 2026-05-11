import Link from "next/link";

const PRODUCT_REDIRECTS: Record<string, { label: string; href: string }> = {
  carta_natal_detallada: { label: "Ver tu carta natal completa", href: "/carta-natal" },
  compatibilidad:        { label: "Ver informe de compatibilidad", href: "/compatibilidad" },
  sesion_oraculo:        { label: "Consultar al Oráculo", href: "/oraculo" },
};

export default function PagoExitosoPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const product = String(searchParams?.product ?? "");
  const redirect = PRODUCT_REDIRECTS[product];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-sm">
        <div className="space-y-2">
          <div className="text-6xl animate-float">✦</div>
          <h1 className="font-cinzel text-2xl text-tinta-400">¡Pago exitoso!</h1>
          <p className="font-garamond text-tinta-200">
            Los astros han aceptado tu ofrenda. Tu lectura ya está disponible.
          </p>
        </div>

        <div className="ornament text-terracota-400/60">☽ ✦ ☾</div>

        <div className="space-y-3">
          {redirect && (
            <Link
              href={redirect.href}
              className="block bg-terracota-500 text-parchment-100 font-cinzel tracking-wider px-8 py-3.5 rounded-sm hover:bg-terracota-600 transition-colors text-sm"
            >
              {redirect.label}
            </Link>
          )}
          <Link
            href="/dashboard"
            className="block border border-parchment-400 text-tinta-200 font-cinzel tracking-wider px-8 py-3 rounded-sm hover:border-terracota-400/60 transition-colors text-sm"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
