"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  LayoutDashboard, User, FolderPlus, PenSquare, Settings,
  Code2, Compass, LogOut, Bookmark, Activity,
} from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Edit Profile", icon: User },
  { href: "/dashboard/projects/new", label: "New Project", icon: FolderPlus },
  { href: "/dashboard/blogs/new", label: "New Blog", icon: PenSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-40 bg-background border-r border-border flex flex-col transition-all duration-200"
      style={{ width: collapsed ? 56 : 220 }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
          {!collapsed && <span className="text-[14px] font-semibold text-zinc-200 tracking-tight">DevHub</span>}
        </Link>
      </div>

      {/* User */}
      {user && !collapsed && (
        <div className="px-3 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-card-hover border border-border flex items-center justify-center text-[10px] font-semibold text-zinc-300 shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-zinc-200 truncate">{user.name}</p>
              <p className="text-[11px] text-zinc-600 truncate">@{user.username}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors duration-150 ${isActive
                ? "text-zinc-100 bg-[rgba(255,255,255,0.06)]"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-[rgba(255,255,255,0.03)]"
                }`}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-zinc-300" : "text-zinc-600"}`} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-border space-y-0.5">
        {!collapsed && (
          <div className="flex items-center justify-between px-2.5 py-2 mb-1">
            <span className="text-[12px] text-zinc-500">Theme</span>
            <ThemeToggle />
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-1 mb-1">
            <ThemeToggle />
          </div>
        )}
        <Link href="/explore/projects" className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-zinc-500 hover:text-zinc-300 hover:bg-[rgba(255,255,255,0.03)] transition-colors" title={collapsed ? "Explore" : undefined}>
          <Compass className="w-4 h-4 shrink-0 text-zinc-600" />
          {!collapsed && <span>Explore</span>}
        </Link>
        <button onClick={logout} className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px] text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer" title={collapsed ? "Log out" : undefined}>
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-[72px] w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors z-50 cursor-pointer text-[10px]">
        {collapsed ? "→" : "←"}
      </button>
    </aside>
  );
}
