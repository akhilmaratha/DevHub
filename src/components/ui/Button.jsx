"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-foreground text-background hover:bg-foreground/90",
  secondary:
    "bg-card-hover text-zinc-200 hover:bg-card-hover/80 border border-border",
  outline:
    "border border-border text-zinc-300 hover:text-zinc-100 hover:border-border-hover hover:bg-card-hover/50",
  ghost:
    "text-zinc-400 hover:text-zinc-200 hover:bg-card-hover/50",
  danger:
    "text-red-400 hover:bg-red-500/8 border border-red-500/10",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-3.5 py-2 text-[13px]",
  lg: "px-5 py-2.5 text-sm",
  icon: "p-2",
};

const Button = forwardRef(function Button(
  { className, variant = "primary", size = "md", disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors duration-150 focus-ring disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
