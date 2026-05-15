"use client";

import { useState, useEffect } from "react";
import DeveloperCard from "@/components/cards/DeveloperCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AnimateIn from "@/components/shared/AnimateIn";
import { Search, Users, X } from "lucide-react";

const popularSkills = ["React", "Node.js", "Python", "TypeScript", "Next.js", "Go", "Rust", "Docker"];

export default function ExploreDevelopersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeSkill, setActiveSkill] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeSkill) params.set("skill", activeSkill);
        const res = await fetch(`/api/users?${params}`);
        const data = await res.json();
        if (!cancelled) setUsers(data.users || []);
      } catch { if (!cancelled) setUsers([]); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [activeSkill]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (activeSkill) params.set("skill", activeSkill);
      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch { setUsers([]); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimateIn className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight mb-1">Developers</h1>
          <p className="text-[16px] text-zinc-500">Find and connect with developers.</p>
        </AnimateIn>

        <AnimateIn delay={0.05} className="mb-6 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or skill..." className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-md text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[rgba(255,255,255,0.12)] transition-colors" />
            </div>
            <Button type="submit" variant="secondary">Search</Button>
          </form>

          <div className="flex items-center gap-1.5 flex-wrap">
            {popularSkills.map((skill) => (
              <button key={skill} onClick={() => setActiveSkill(activeSkill === skill ? "" : skill)} className="cursor-pointer">
                <Badge variant={activeSkill === skill ? "default" : "secondary"}>
                  {skill} {activeSkill === skill && <X className="w-2.5 h-2.5 ml-0.5" />}
                </Badge>
              </button>
            ))}
          </div>
        </AnimateIn>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : users.length === 0 ? (
          <EmptyState icon={Users} title="No developers found" description="Try adjusting your search." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map((user) => <DeveloperCard key={user._id} user={user} />)}
          </div>
        )}
      </div>
    </div>
  );
}
