"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "El nombre es requerido";
    if (!form.email.includes("@")) e.email = "Correo inválido";
    if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const res = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setErrors({ general: data.error ?? "Error al registrarse" });
      setLoading(false);
      return;
    }

    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/dashboard");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm"
    >
      <div className="bg-parchment-100 border-2 border-parchment-400 p-8 rounded-sm shadow-md relative">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-terracota-400/50" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-terracota-400/50" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-terracota-400/50" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-terracota-400/50" />

        <div className="text-center mb-8 space-y-1">
          <div className="text-3xl text-terracota-400">☽</div>
          <h1 className="font-cinzel text-xl text-tinta-400 tracking-wider">Iniciar el viaje</h1>
          <p className="font-garamond text-sm text-tinta-100">Tu carta astral te está esperando</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Tu nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Como te llamas"
            error={errors.name}
            autoComplete="name"
          />
          <Input
            id="email"
            type="email"
            label="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tu@correo.com"
            error={errors.email}
            autoComplete="email"
          />
          <Input
            id="password"
            type="password"
            label="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Mínimo 8 caracteres"
            error={errors.password}
            autoComplete="new-password"
          />
          {errors.general && (
            <p className="text-sm text-red-600 font-garamond text-center">{errors.general}</p>
          )}
          <Button type="submit" loading={loading} className="w-full mt-2">
            Abrir mi portal
          </Button>
        </form>

        <p className="mt-6 text-center text-sm font-garamond text-tinta-100">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-terracota-500 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
