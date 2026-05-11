import { ChatOracle } from "@/components/ChatOracle";

export default function OraculoPage() {
  return (
    <div className="space-y-8 page-enter max-w-2xl mx-auto">
      <div>
        <div className="ornament text-xs font-cinzel tracking-widest text-terracota-400 mb-3">ORÁCULO CÓSMICO</div>
        <h1 className="font-cinzel text-3xl text-tinta-400">Mystika</h1>
        <p className="font-garamond text-tinta-200 mt-1">
          Guardiana de los secretos estelares. Consulta al oráculo y recibe guía del cosmos.
        </p>
      </div>

      <div className="bg-parchment-200 rounded-sm p-4 text-sm font-garamond text-tinta-200 border border-parchment-400 flex items-start gap-3">
        <span className="text-terracota-400 text-lg flex-shrink-0">◈</span>
        <p>
          Tienes <strong>3 consultas gratuitas</strong> con el Oráculo. Para sesiones ilimitadas,
          desbloquea una sesión completa de 10 mensajes por <strong>$2.99 MXN</strong>.
        </p>
      </div>

      <ChatOracle />
    </div>
  );
}
