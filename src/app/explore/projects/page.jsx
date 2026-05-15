"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProjectCard from "@/components/cards/ProjectCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AnimateIn from "@/components/shared/AnimateIn";
import { Search, FolderKanban, X, ArrowUpDown } from "lucide-react";

const popularTech = ["React", "Next.js", "Node.js", "Python", "TypeScript", "MongoDB", "Docker", "AWS"];

export default function ExploreProjectsPage() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeTech, setActiveTech] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let cancelled = false;
    const initialSearch = searchParams.get("search") || "";
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (initialSearch) params.set("search", initialSearch);
        if (activeTech) params.set("tech", activeTech);
        params.set("sort", sort);
        const res = await fetch(`/api/projects?${params}`);
        const data = await res.json();
        if (!cancelled) setProjects(data.projects || []);
      } catch { if (!cancelled) setProjects([]); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [activeTech, searchParams, sort]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (activeTech) params.set("tech", activeTech);
      params.set("sort", sort);
      const res = await fetch(`/api/projects?${params}`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch { setProjects([]); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimateIn className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-1">Projects</h1>
          <p className="text-[14px] text-zinc-500">Explore what developers are building.</p>
        </AnimateIn>

        <AnimateIn delay={0.05} className="mb-6 space-y-3">
          <div className="flex gap-2 flex-wrap">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-md text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[rgba(255,255,255,0.12)] transition-colors" />
              </div>
              <Button type="submit" variant="secondary">Search</Button>
            </form>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-md text-sm text-zinc-300 focus:outline-none cursor-pointer">
              <option value="newest">Newest</option>
              <option value="popular">Most Liked</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {popularTech.map((tech) => (
              <button key={tech} onClick={() => setActiveTech(activeTech === tech ? "" : tech)} className="cursor-pointer">
                <Badge variant={activeTech === tech ? "default" : "secondary"}>
                  {tech} {activeTech === tech && <X className="w-2.5 h-2.5 ml-0.5" />}
                </Badge>
              </button>
            ))}
          </div>
        </AnimateIn>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState icon={FolderKanban} title="No projects found" description="Try adjusting your search." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {projects.map((project) => <ProjectCard key={project._id} project={project} />)}
          </div>
        )}
      </div>
    </div>
  );
}
