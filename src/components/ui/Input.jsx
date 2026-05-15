"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef(function Input({ className, label, error, ...props }, ref) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[13px] font-medium text-zinc-400">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-3 py-2 bg-card border border-border rounded-md text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors duration-150 focus:outline-none focus:border-border-hover",
          error && "border-red-500/30 focus:border-red-500/40",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});

export default Input;
