"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  UserPlus,
  FolderKanban,
  BookOpen,
  Heart,
  Bookmark,
} from "lucide-react";

const activityConfig = {
  follow: { icon: UserPlus, color: "text-blue-400", verb: "followed" },
  project_created: { icon: FolderKanban, color: "text-emerald-400", verb: "added a project" },
  blog_created: { icon: BookOpen, color: "text-violet-400", verb: "published a blog" },
  like_project: { icon: Heart, color: "text-rose-400", verb: "liked a project" },
  like_blog: { icon: Heart, color: "text-rose-400", verb: "liked a blog" },
  bookmark: { icon: Bookmark, color: "text-amber-400", verb: "bookmarked" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

function ActivityItem({ activity }) {
  const config = activityConfig[activity.type] || {};
  const Icon = config.icon || FolderKanban;
  const actor = activity.userId;

  let targetLabel = "";
  let targetHref = "";

  if (activity.type === "follow" && activity.targetUserId) {
    targetLabel = activity.targetUserId.name || activity.targetUserId.username;
    targetHref = `/profile/${activity.targetUserId.username}`;
  } else if (activity.projectId) {
    targetLabel = activity.projectId.title;
    targetHref = `/projects/${activity.projectId._id}`;
  } else if (activity.blogId) {
    targetLabel = activity.blogId.title;
    targetHref = `/blogs/${activity.blogId.slug}`;
  }

  return (
    <div className="flex items-start gap-2.5 py-2.5">
      <div className={`w-6 h-6 rounded-md bg-card-hover flex items-center justify-center shrink-0 mt-0.5 ${config.color}`}>
        <Icon className="w-3 h-3" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-zinc-300 leading-snug">
          <Link href={`/profile/${actor?.username}`} className="font-medium hover:text-white transition-colors">
            {actor?.name || "Someone"}
          </Link>
          {" "}
          <span className="text-zinc-500">{config.verb}</span>
          {targetLabel && (
            <>
              {" "}
              <Link href={targetHref} className="font-medium text-zinc-300 hover:text-white transition-colors">
                {targetLabel}
              </Link>
            </>
          )}
        </p>
        <p className="text-[11px] text-zinc-600 mt-0.5">{timeAgo(activity.createdAt)}</p>
      </div>
    </div>
  );
}

export default function ActivityFeed({ userId, limit = 15, title = "Recent Activity" }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams({ limit: String(limit) });
        if (userId) params.set("userId", userId);
        const res = await fetch(`/api/activity?${params}`);
        const data = await res.json();
        if (!cancelled) setActivities(data.activities || []);
      } catch {}
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [userId, limit]);

  if (loading) {
    return (
      <div className="space-y-3">
        {title && <h3 className="text-[13px] font-medium text-zinc-300">{title}</h3>}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-2.5">
            <div className="w-6 h-6 skeleton rounded-md shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 skeleton rounded w-3/4" />
              <div className="h-2.5 skeleton rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div>
        {title && <h3 className="text-[13px] font-medium text-zinc-300 mb-2">{title}</h3>}
        <p className="text-[12px] text-zinc-600 py-3">No activity yet.</p>
      </div>
    );
  }

  return (
    <div>
      {title && <h3 className="text-[13px] font-medium text-zinc-300 mb-1">{title}</h3>}
      <div className="divide-y divide-border">
        {activities.map((a) => (
          <ActivityItem key={a._id} activity={a} />
        ))}
      </div>
    </div>
  );
}
