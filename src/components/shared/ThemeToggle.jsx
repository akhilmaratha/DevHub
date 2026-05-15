"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={`w-8 h-8 rounded-md ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`w-8 h-8 flex items-center justify-center rounded-md border border-border text-zinc-400 hover:text-zinc-200 hover:bg-card-hover transition-colors cursor-pointer ${className}`}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-3.5 h-3.5" />
      ) : (
        <Moon className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
