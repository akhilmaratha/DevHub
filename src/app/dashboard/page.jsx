"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import Button from "@/components/ui/Button";
import ProjectCard from "@/components/cards/ProjectCard";
import BlogCard from "@/components/cards/BlogCard";
import AnimateIn from "@/components/shared/AnimateIn";
import ActivityFeed from "@/components/shared/ActivityFeed";
import { FolderPlus, PenSquare, Users, FolderKanban, BookOpen, TrendingUp, ArrowRight, Eye, Heart, Bookmark } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const [projRes, blogRes, bookRes] = await Promise.all([
          fetch(`/api/projects?userId=${user.id}&limit=4`),
          fetch(`/api/blogs?userId=${user.id}&limit=4`),
          fetch("/api/bookmarks"),
        ]);
        if (cancelled) return;
        setProjects((await projRes.json()).projects || []);
        setBlogs((await blogRes.json()).blogs || []);
        const bookData = await bookRes.json();
        setSavedProjects(bookData.projects || []);
        setSavedBlogs(bookData.blogs || []);
      } catch {} finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const sections = [
    { key: "overview", label: "Overview" },
    { key: "saved", label: "Saved", count: savedProjects.length + savedBlogs.length },
    { key: "activity", label: "Activity" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimateIn>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Welcome back, {user?.name?.split(" ")[0]}</h1>
            <p className="text-[13px] text-zinc-500">Here&apos;s your overview.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/projects/new"><Button size="sm"><FolderPlus className="w-3.5 h-3.5" /> New Project</Button></Link>
            <Link href="/dashboard/blogs/new"><Button variant="outline" size="sm"><PenSquare className="w-3.5 h-3.5" /> New Post</Button></Link>
          </div>
        </div>
      </AnimateIn>

      {/* Stats */}
      <AnimateIn delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
          {[
            { label: "Projects", value: projects.length, icon: FolderKanban },
            { label: "Blog Posts", value: blogs.length, icon: BookOpen },
            { label: "Followers", value: user?.followers?.length || 0, icon: Users },
            { label: "Following", value: user?.following?.length || 0, icon: TrendingUp },
          ].map((stat) => (
            <div key={stat.label} className="bg-background p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-xl font-semibold text-zinc-200">{stat.value}</p>
            </div>
          ))}
        </div>
      </AnimateIn>

      {/* Section tabs */}
      <AnimateIn delay={0.08}>
        <div className="flex gap-0.5 border-b border-border">
          {sections.map((s) => (
            <button key={s.key} onClick={() => setActiveSection(s.key)} className={`px-3 py-2 text-[13px] font-medium transition-colors border-b-2 cursor-pointer ${activeSection === s.key ? "text-zinc-100 border-zinc-100" : "text-zinc-500 border-transparent hover:text-zinc-300"}`}>
              {s.label}{s.count !== undefined ? ` (${s.count})` : ""}
            </button>
          ))}
        </div>
      </AnimateIn>

      {/* Section Content */}
      {activeSection === "overview" && (
        <>
          {/* Quick links */}
          <AnimateIn delay={0.1}>
            <div className="flex gap-2">
              <Link href={`/profile/${user?.username}`} className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-[13px] text-zinc-400 hover:text-zinc-200 hover:border-border-hover transition-colors">
                <Eye className="w-3.5 h-3.5" /> View profile
              </Link>
              <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-[13px] text-zinc-400 hover:text-zinc-200 hover:border-border-hover transition-colors">
                <Users className="w-3.5 h-3.5" /> Edit profile
              </Link>
            </div>
          </AnimateIn>

          {/* Projects */}
          <AnimateIn delay={0.15}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-medium text-zinc-200">Recent Projects</h2>
              {projects.length > 0 && <Link href={`/profile/${user?.username}`} className="text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>}
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[1, 2].map((i) => <div key={i} className="h-32 skeleton rounded-lg" />)}</div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{projects.map((p) => <ProjectCard key={p._id} project={p} />)}</div>
            ) : (
              <div className="py-8 text-center border border-border rounded-lg">
                <p className="text-[13px] text-zinc-500 mb-3">No projects yet.</p>
                <Link href="/dashboard/projects/new"><Button size="sm"><FolderPlus className="w-3.5 h-3.5" /> Create Project</Button></Link>
              </div>
            )}
          </AnimateIn>

          {/* Blogs */}
          <AnimateIn delay={0.2}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-medium text-zinc-200">Recent Posts</h2>
              {blogs.length > 0 && <Link href={`/profile/${user?.username}`} className="text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>}
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[1, 2].map((i) => <div key={i} className="h-32 skeleton rounded-lg" />)}</div>
            ) : blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{blogs.map((b) => <BlogCard key={b._id} blog={b} />)}</div>
            ) : (
              <div className="py-8 text-center border border-border rounded-lg">
                <p className="text-[13px] text-zinc-500 mb-3">No posts yet.</p>
                <Link href="/dashboard/blogs/new"><Button size="sm"><PenSquare className="w-3.5 h-3.5" /> Write Post</Button></Link>
              </div>
            )}
          </AnimateIn>
        </>
      )}

      {activeSection === "saved" && (
        <AnimateIn delay={0.1}>
          {savedProjects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14px] font-medium text-zinc-200 mb-3 flex items-center gap-2"><Bookmark className="w-3.5 h-3.5 text-amber-400" /> Saved Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{savedProjects.map((p) => <ProjectCard key={p._id} project={p} />)}</div>
            </div>
          )}
          {savedBlogs.length > 0 && (
            <div>
              <h2 className="text-[14px] font-medium text-zinc-200 mb-3 flex items-center gap-2"><Bookmark className="w-3.5 h-3.5 text-amber-400" /> Saved Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{savedBlogs.map((b) => <BlogCard key={b._id} blog={b} />)}</div>
            </div>
          )}
          {savedProjects.length === 0 && savedBlogs.length === 0 && (
            <div className="py-12 text-center border border-border rounded-lg">
              <Bookmark className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
              <p className="text-[13px] text-zinc-500">No saved content yet.</p>
              <p className="text-[12px] text-zinc-600 mt-1">Bookmark projects and blogs to save them here.</p>
            </div>
          )}
        </AnimateIn>
      )}

      {activeSection === "activity" && (
        <AnimateIn delay={0.1}>
          <ActivityFeed userId={user?.id} title="" />
        </AnimateIn>
      )}
    </div>
  );
}
