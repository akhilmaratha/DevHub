"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Image from "next/image";
import {
  Search,
  Menu,
  X,
  Code2,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

const navLinks = [
  { href: "/explore/developers", label: "Developers" },
  { href: "/explore/projects", label: "Projects" },
  { href: "/blogs", label: "Blog" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore/projects?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${scrolled
          ? "bg-background/95 border-b border-border"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="group">
              <Image src="/DevHub_Logo.png" alt="logo" width={140} height={36} className="w-full h-42" priority />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-150 ${pathname === link.href || pathname.startsWith(link.href)
                    ? "text-zinc-100 bg-border"
                    : "text-zinc-500 hover:text-zinc-200"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-2">
              {/* Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-44 pl-8 pr-3 py-1.5 bg-[rgba(255,255,255,0.03)] border border-border rounded-md text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[rgba(255,255,255,0.12)] focus:w-56 transition-all duration-200"
                  />
                </div>
              </form>

              <ThemeToggle />

              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-md bg-card-hover border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[10px] font-semibold text-zinc-300">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-150 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-full mt-1.5 w-48 bg-surface border border-border rounded-lg py-1 shadow-xl shadow-black/20"
                      >
                        <div className="px-3 py-2 border-b border-border">
                          <p className="text-[13px] font-medium text-zinc-200">{user.name}</p>
                          <p className="text-[11px] text-zinc-500">@{user.username}</p>
                        </div>
                        <Link
                          href={`/profile/${user.username}`}
                          className="flex items-center gap-2 px-3 py-2 text-[13px] text-zinc-400 hover:text-zinc-200 hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                        >
                          <User className="w-3.5 h-3.5" /> Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 text-[13px] text-zinc-400 hover:text-zinc-200 hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Log out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Log in</Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 text-zinc-400 hover:text-white cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="absolute top-14 left-0 right-0 bg-card border-b border-border p-4 space-y-1">
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-md text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[rgba(255,255,255,0.12)]"
                  />
                </div>
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === link.href
                    ? "text-zinc-100 bg-border"
                    : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-border space-y-1">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-zinc-500">Theme</span>
                  <ThemeToggle />
                </div>
                {user ? (
                  <>
                    <Link href="/dashboard" className="block px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-200">
                      Dashboard
                    </Link>
                    <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-sm text-red-400 cursor-pointer">
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">Log in</Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button size="sm" className="w-full">Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
