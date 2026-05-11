import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  ornate?: boolean;
}

export function Card({ className, ornate, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-parchment-100 border border-parchment-400 rounded-sm shadow-sm",
        ornate && "border-2 border-terracota-400/40 shadow-md relative overflow-hidden",
        className,
      )}
      {...props}
    >
      {ornate && (
        <>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-terracota-400/60 rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-terracota-400/60 rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-terracota-400/60 rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-terracota-400/60 rounded-br-sm" />
        </>
      )}
      {children}
    </div>
  );
}
