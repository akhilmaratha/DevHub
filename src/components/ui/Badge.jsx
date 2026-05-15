import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-blue-500/8 text-blue-400 border-blue-500/10",
  secondary: "bg-card-hover/60 text-zinc-400 border-border",
  success: "bg-emerald-500/8 text-emerald-400 border-emerald-500/10",
  warning: "bg-amber-500/8 text-amber-400 border-amber-500/10",
  danger: "bg-red-500/8 text-red-400 border-red-500/10",
};

export default function Badge({ children, variant = "default", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium border leading-tight",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
