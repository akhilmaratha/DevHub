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
import { ArrowLeft, Calendar, Pencil, Trash2, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function BlogDetailPage({ params }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        if (!cancelled && res.ok) { const data = await res.json(); setBlog(data.blog); }
      } catch {} finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    try { const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" }); if (res.ok) router.push("/dashboard"); } finally { setDeleting(false); }
  };

  if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" /></div>;
  if (!blog) return <div className="min-h-screen pt-20"><EmptyState title="Post not found" /></div>;

  const author = blog.userId;
  const isOwner = user?.id === author?._id;
  const readTime = Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200));

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <AnimateIn>
          <Link href="/blogs" className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Blog
          </Link>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {blog.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-8 text-[13px] text-zinc-500">
            {author && (
              <Link href={`/profile/${author.username}`} className="flex items-center gap-2 hover:text-zinc-300 transition-colors">
                <div className="w-6 h-6 rounded-md bg-card-hover border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[9px] font-semibold text-zinc-400">
                  {author.name?.charAt(0).toUpperCase()}
                </div>
                {author.name}
              </Link>
            )}
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(blog.createdAt)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readTime} min</span>
            <LikeButton type="blog" id={blog.slug} initialLiked={blog.likes?.some(uid => uid.toString() === user?.id)} initialCount={blog.likes?.length || 0} />
            <BookmarkButton type="blog" id={blog._id} />
          </div>

          {/* Content */}
          <article className="text-[15px] text-zinc-300 leading-[1.8] whitespace-pre-wrap mb-10">
            {blog.content}
          </article>

          {/* Author & Actions */}
          <div className="flex items-center justify-between py-4 border-t border-border">
            {author && (
              <Link href={`/profile/${author.username}`} className="flex items-center gap-2.5 group">
                <div className="w-7 h-7 rounded-md bg-card-hover border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[10px] font-semibold text-zinc-400">
                  {author.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-zinc-300 group-hover:text-white transition-colors">{author.name}</p>
                  <p className="text-[11px] text-zinc-600">{author.bio || `@${author.username}`}</p>
                </div>
              </Link>
            )}
            {isOwner && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/blogs/${blog.slug}/edit`)}><Pencil className="w-3 h-3" /> Edit</Button>
                <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}><Trash2 className="w-3 h-3" /> Delete</Button>
              </div>
            )}
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
