"use client";

import { useState, useEffect } from "react";
import BlogCard from "@/components/cards/BlogCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AnimateIn from "@/components/shared/AnimateIn";
import { Search, BookOpen, X } from "lucide-react";

const popularTags = ["JavaScript", "React", "Web Dev", "AI", "DevOps", "Career", "Tutorial", "Open Source"];

export default function BlogsFeedPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeTag) params.set("tag", activeTag);
        params.set("sort", sort);
        const res = await fetch(`/api/blogs?${params}`);
        const data = await res.json();
        if (!cancelled) setBlogs(data.blogs || []);
      } catch { if (!cancelled) setBlogs([]); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [activeTag, sort]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (activeTag) params.set("tag", activeTag);
      params.set("sort", sort);
      const res = await fetch(`/api/blogs?${params}`);
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch { setBlogs([]); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimateIn className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-1">Blog</h1>
          <p className="text-[14px] text-zinc-500">Technical articles and insights from the community.</p>
        </AnimateIn>

        <AnimateIn delay={0.05} className="mb-6 space-y-3">
          <div className="flex gap-2 flex-wrap">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-md text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[rgba(255,255,255,0.12)] transition-colors" />
              </div>
              <Button type="submit" variant="secondary">Search</Button>
            </form>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-md text-sm text-zinc-300 focus:outline-none cursor-pointer">
              <option value="newest">Newest</option>
              <option value="popular">Most Liked</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {popularTags.map((tag) => (
              <button key={tag} onClick={() => setActiveTag(activeTag === tag ? "" : tag)} className="cursor-pointer">
                <Badge variant={activeTag === tag ? "default" : "secondary"}>
                  {tag} {activeTag === tag && <X className="w-2.5 h-2.5 ml-0.5" />}
                </Badge>
              </button>
            ))}
          </div>
        </AnimateIn>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState icon={BookOpen} title="No posts found" description="Try adjusting your search." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        )}
      </div>
    </div>
  );
}
