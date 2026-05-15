"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import LikeButton from "@/components/shared/LikeButton";
import BookmarkButton from "@/components/shared/BookmarkButton";
import { Calendar } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

export default function BlogCard({ blog }) {
  const author = blog.userId;
  const { user } = useAuth();
  const isLiked = user && blog.likes?.some(uid => uid.toString() === user.id);
  const isBookmarked = user && user.bookmarkedBlogs?.some(bid => bid.toString() === blog._id);
  const readTime = Math.max(1, Math.ceil((blog.content?.split(/\s+/).length || 0) / 200));

  return (
    <div className="border border-border rounded-lg p-4 hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150 group">
      <Link href={`/blogs/${blog.slug}`}>
        <h3 className="text-[14px] font-medium text-zinc-200 group-hover:text-white transition-colors leading-tight mb-1.5">
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p className="text-[13px] text-zinc-500 leading-relaxed mb-2.5 line-clamp-2">
            {truncate(blog.excerpt, 120)}
          </p>
        )}
        <div className="flex items-center gap-3 mb-3 text-[11px] text-zinc-600">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(blog.createdAt)}</span>
          <span>{readTime} min read</span>
        </div>
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {blog.tags.slice(0, 3).map((tag) => <Badge key={tag}>{tag}</Badge>)}
          </div>
        )}
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.04)]">
        {author && (
          <Link href={`/profile/${author.username}`} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-card-hover border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[9px] font-semibold text-zinc-400">
              {author.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-[12px] text-zinc-500">{author.name}</span>
          </Link>
        )}
        <div className="flex items-center gap-2">
          <LikeButton type="blog" id={blog.slug} initialLiked={isLiked} initialCount={blog.likes?.length || 0} />
          <BookmarkButton type="blog" id={blog._id} initialBookmarked={isBookmarked} />
        </div>
      </div>
    </div>
  );
}
