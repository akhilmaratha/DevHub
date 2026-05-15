"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import LikeButton from "@/components/shared/LikeButton";
import BookmarkButton from "@/components/shared/BookmarkButton";
import { ExternalLink, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { truncate } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

export default function ProjectCard({ project }) {
  const author = project.userId;
  const { user } = useAuth();
  const isLiked = user && project.likes?.some(uid => uid.toString() === user.id);
  const isBookmarked = user && user.bookmarkedProjects?.some(pid => pid.toString() === project._id);

  return (
    <div className="border border-border rounded-lg p-4 hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150 group">
      <Link href={`/projects/${project._id}`}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-[14px] font-medium text-zinc-200 group-hover:text-white transition-colors leading-tight">
            {project.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {project.featured && <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />}
            {project.githubUrl && <GithubIcon className="w-3 h-3 text-zinc-600" />}
            {project.liveUrl && <ExternalLink className="w-3 h-3 text-zinc-600" />}
          </div>
        </div>
        <p className="text-[13px] text-zinc-500 leading-relaxed mb-3 line-clamp-2">
          {truncate(project.description, 120)}
        </p>
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
            {project.techStack.length > 4 && <Badge variant="secondary">+{project.techStack.length - 4}</Badge>}
          </div>
        )}
      </Link>

      {/* Footer: author + actions */}
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
          <LikeButton type="project" id={project._id} initialLiked={isLiked} initialCount={project.likes?.length || 0} />
          <BookmarkButton type="project" id={project._id} initialBookmarked={isBookmarked} />
        </div>
      </div>
    </div>
  );
}
