"use client";

import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "Content will appear here once it's been added.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-10 h-10 rounded-lg bg-card-hover border border-border flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-zinc-500" />
      </div>
      <h3 className="text-sm font-medium text-zinc-200 mb-1">{title}</h3>
      <p className="text-[13px] text-zinc-500 max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}
