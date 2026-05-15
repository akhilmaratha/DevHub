"use client";

import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import FollowButton from "@/components/shared/FollowButton";
import { Users, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { useAuth } from "@/providers/AuthProvider";

export default function DeveloperCard({ user: dev }) {
  const { user: currentUser } = useAuth();
  const isFollowing = currentUser && dev.followers?.some(fid => fid.toString() === currentUser.id);

  return (
    <div className="border border-border rounded-lg p-4 hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150 group">
      <div className="flex items-start gap-3">
        <Link href={`/profile/${dev.username}`} className="shrink-0">
          <div className="w-9 h-9 rounded-md bg-card-hover border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-sm font-semibold text-zinc-300">
            {dev.avatar ? (
              <Image src={dev.avatar} alt={dev.name} width={36} height={36} className="w-full h-full rounded-md object-cover" unoptimized />
            ) : (
              dev.name?.charAt(0).toUpperCase()
            )}
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <Link href={`/profile/${dev.username}`}>
              <h3 className="text-[14px] font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                {dev.name}
              </h3>
            </Link>
            <FollowButton username={dev.username} initialFollowing={isFollowing} compact />
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-[12px] text-zinc-600">@{dev.username}</p>
            {dev.location && <span className="text-[11px] text-zinc-600 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{dev.location}</span>}
          </div>

          {dev.bio && <p className="text-[13px] text-zinc-500 mb-2.5 line-clamp-2 leading-relaxed">{dev.bio}</p>}

          <div className="flex items-center justify-between">
            {dev.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {dev.skills.slice(0, 3).map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
              </div>
            )}
            <div className="flex items-center gap-3 text-[11px] text-zinc-600">
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{dev.followers?.length || 0}</span>
              {dev.githubUrl && <GithubIcon className="w-3 h-3" />}
              {dev.linkedinUrl && <LinkedinIcon className="w-3 h-3" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
