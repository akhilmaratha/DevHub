"use client";

import { useAuth } from "@/providers/AuthProvider";
import Button from "@/components/ui/Button";
import AnimateIn from "@/components/shared/AnimateIn";
import { Settings, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl space-y-5">
      <AnimateIn>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight mb-0.5">Settings</h1>
        <p className="text-[13px] text-zinc-500">Manage your account.</p>
      </AnimateIn>

      <div className="border border-border rounded-lg p-4 space-y-3">
        <p className="text-[13px] font-medium text-zinc-300">Account</p>
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between py-1.5"><span className="text-zinc-500">Email</span><span className="text-zinc-300">{user?.email}</span></div>
          <div className="flex justify-between py-1.5 border-t border-border"><span className="text-zinc-500">Username</span><span className="text-zinc-300">@{user?.username}</span></div>
        </div>
      </div>

      <div className="border border-red-500/10 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-zinc-300">Log out</p>
            <p className="text-[12px] text-zinc-600">End your current session.</p>
          </div>
          <Button variant="danger" size="sm" onClick={logout}><LogOut className="w-3.5 h-3.5" /> Log out</Button>
        </div>
      </div>
    </div>
  );
}
