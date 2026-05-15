"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import AnimateIn from "@/components/shared/AnimateIn";
import LikeButton from "@/components/shared/LikeButton";
import BookmarkButton from "@/components/shared/BookmarkButton";
import { ExternalLink, ArrowLeft, Calendar, Pencil, Trash2, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { formatDate } from "@/lib/utils";

export default function ProjectDetailPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!cancelled && res.ok) { const data = await res.json(); setProject(data.project); }
      } catch { } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;
    setDeleting(true);
    try { const res = await fetch(`/api/projects/${id}`, { method: "DELETE" }); if (res.ok) router.push("/dashboard"); } finally { setDeleting(false); }
  };

  if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" /></div>;
  if (!project) return <div className="min-h-screen pt-20"><EmptyState title="Project not found" /></div>;

  const author = project.userId;
  const isOwner = user?.id === author?._id;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <AnimateIn>
          <Link href="/explore/projects" className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Projects
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-zinc-100 tracking-tight">{project.title}</h1>
                {project.featured && <Star className="w-4 h-4 text-amber-500" fill="currentColor" />}
              </div>
              <div className="flex items-center gap-2 text-[12px] text-zinc-600">
                <Calendar className="w-3 h-3" />
                {formatDate(project.createdAt)}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <LikeButton type="project" id={project._id} initialLiked={project.likes?.some(uid => uid.toString() === user?.id)} initialCount={project.likes?.length || 0} />
              <BookmarkButton type="project" id={project._id} />
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm"><GithubIcon className="w-3.5 h-3.5" /> Source</Button></a>}
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"><Button variant="secondary" size="sm"><ExternalLink className="w-3.5 h-3.5" /> Demo</Button></a>}
            </div>
          </div>

          {/* Tech */}
          {project.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.techStack.map((tech) => <Badge key={tech} variant="secondary">{tech}</Badge>)}
            </div>
          )}

          {/* Description */}
          <div className="border border-border rounded-lg p-5 mb-6">
            <p className="text-[14px] text-zinc-400 leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </div>

          {/* Author */}
          <div className="flex items-center justify-between py-4 border-t border-border">
            {author && (
              <Link href={`/profile/${author.username}`} className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 rounded-md bg-card-hover border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[10px] font-semibold text-zinc-400">
                  {author.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-zinc-300 group-hover:text-white transition-colors">{author.name}</p>
                  <p className="text-[11px] text-zinc-600">@{author.username}</p>
                </div>
              </Link>
            )}
            {isOwner && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/projects/${id}/edit`)}><Pencil className="w-3 h-3" /> Edit</Button>
                <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}><Trash2 className="w-3 h-3" /> Delete</Button>
              </div>
            )}
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
