"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Correo o contraseña incorrectos");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm"
    >
      <div className="bg-parchment-100 border-2 border-parchment-400 p-8 rounded-sm shadow-md relative">
        {/* Ornamental corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-terracota-400/50" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-terracota-400/50" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-terracota-400/50" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-terracota-400/50" />

        <div className="text-center mb-8 space-y-1">
          <div className="text-3xl text-terracota-400">✦</div>
          <h1 className="font-cinzel text-xl text-tinta-400 tracking-wider">Bienvenida</h1>
          <p className="font-garamond text-sm text-tinta-100">Los astros te han estado esperando</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="email"
            type="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            autoComplete="email"
          />
          <Input
            id="password"
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          {error && (
            <p className="text-sm text-red-600 font-garamond text-center">{error}</p>
          )}
          <Button type="submit" loading={loading} className="w-full mt-2">
            Entrar al Oráculo
          </Button>
        </form>

        <p className="mt-6 text-center text-sm font-garamond text-tinta-100">
          ¿Primera vez aquí?{" "}
          <Link href="/registro" className="text-terracota-500 hover:underline">
            Crea tu cuenta
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
