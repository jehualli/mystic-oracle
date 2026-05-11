import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Link href="/" className="font-cinzel text-2xl text-terracota-500 tracking-widest mb-10 flex items-center gap-2">
        <span className="text-3xl">☽</span> Mystic Oracle
      </Link>
      {children}
    </div>
  );
}
