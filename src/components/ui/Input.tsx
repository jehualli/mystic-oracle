"use client";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-cinzel tracking-widest text-tinta-200 uppercase">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full bg-parchment-100 border border-parchment-400 rounded-sm px-4 py-2.5",
          "text-tinta-400 placeholder:text-tinta-100 font-garamond text-base",
          "focus:outline-none focus:border-terracota-400 focus:ring-1 focus:ring-terracota-400",
          "transition-colors duration-200",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-garamond">{error}</p>}
    </div>
  );
}
