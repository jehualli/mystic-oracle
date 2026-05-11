"use client";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  className, variant = "primary", size = "md", loading, disabled, children, ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-cinzel tracking-wider transition-all duration-200 rounded-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracota-400",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-terracota-500 text-parchment-100 hover:bg-terracota-600 shadow-md hover:shadow-lg active:translate-y-px": variant === "primary",
          "bg-oro-400 text-tinta-400 hover:bg-oro-300 shadow-md": variant === "secondary",
          "border border-terracota-500 text-terracota-500 hover:bg-terracota-500 hover:text-parchment-100": variant === "outline",
          "text-tinta-200 hover:text-terracota-500 hover:bg-parchment-300": variant === "ghost",
          "text-xs px-3 py-1.5": size === "sm",
          "text-sm px-5 py-2.5": size === "md",
          "text-base px-8 py-3.5": size === "lg",
        },
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </span>
      )}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
}
