"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProjectCard from "@/components/cards/ProjectCard";
import BlogCard from "@/components/cards/BlogCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import AnimateIn from "@/components/shared/AnimateIn";
import FollowButton from "@/components/shared/FollowButton";
import FollowersModal from "@/components/shared/FollowersModal";
import GitHubCard from "@/components/shared/GitHubCard";
import ActivityFeed from "@/components/shared/ActivityFeed";
import {
  MapPin, Calendar, FolderKanban, BookOpen, Users, Briefcase, Zap, ExternalLink,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { formatDate } from "@/lib/utils";

const statusLabels = {
  available: "Available",
  busy: "Busy",
  "open-to-collaborate": "Open to Collaborate",
  hiring: "Hiring",
};
const statusColors = {
  available: "bg-emerald-500",
  busy: "bg-rose-500",
  "open-to-collaborate": "bg-amber-500",
  hiring: "bg-violet-500",
};
const levelLabels = {
  junior: "Junior",
  mid: "Mid-Level",
  senior: "Senior",
  lead: "Lead",
  staff: "Staff",
};

export default function ProfilePage({ params }) {
  const { username } = use(params);
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${username}`);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          setFollowersCount(data.user.followers?.length || 0);
          if (currentUser) setIsFollowing(data.user.followers?.some(fid => fid.toString() === currentUser.id));
          const [projRes, blogRes] = await Promise.all([
            fetch(`/api/projects?userId=${data.user._id}`),
            fetch(`/api/blogs?userId=${data.user._id}`),
          ]);
          if (cancelled) return;
          setProjects((await projRes.json()).projects || []);
          setBlogs((await blogRes.json()).blogs || []);
        }
      } catch {} finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [username, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex gap-4"><div className="w-20 h-20 skeleton rounded-lg" /><div className="flex-1 space-y-2"><div className="h-5 skeleton rounded w-1/3" /><div className="h-3 skeleton rounded w-1/4" /><div className="h-3 skeleton rounded w-1/2" /></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}</div>
        </div>
      </div>
    );
  }

  if (!profile) return <div className="min-h-screen pt-20"><EmptyState title="Developer not found" /></div>;
  const isOwner = currentUser?.id === profile._id;
  const tabs = [
    { key: "projects", label: "Projects", count: projects.length },
    { key: "blogs", label: "Posts", count: blogs.length },
    { key: "activity", label: "Activity" },
  ];
  if (profile.githubUsername) tabs.push({ key: "github", label: "GitHub" });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <AnimateIn>
          {/* Profile Header */}
          <div className="flex items-start gap-4 sm:gap-5 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-card-hover border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-2xl font-semibold text-zinc-300 shrink-0">
              {profile.avatar ? (
                <Image src={profile.avatar} alt={profile.name} width={80} height={80} className="w-full h-full rounded-lg object-cover" unoptimized />
              ) : (
                profile.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl font-bold text-zinc-100 tracking-tight">{profile.name}</h1>
                {profile.availabilityStatus && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium text-zinc-300 bg-card-hover border border-border">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColors[profile.availabilityStatus]}`} />
                    {statusLabels[profile.availabilityStatus]}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-zinc-500 mb-1.5">@{profile.username}</p>
              <div className="flex items-center gap-3 text-[12px] text-zinc-500 flex-wrap">
                {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location}</span>}
                {profile.experienceLevel && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{levelLabels[profile.experienceLevel]}</span>}
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Joined {formatDate(profile.createdAt)}</span>
              </div>
            </div>
            <div className="shrink-0 flex gap-2">
              {isOwner ? (
                <Link href="/dashboard/profile"><Button variant="outline" size="sm">Edit Profile</Button></Link>
              ) : (
                <FollowButton username={profile.username} initialFollowing={isFollowing} onUpdate={(d) => { setIsFollowing(d.following); setFollowersCount(d.followersCount); }} />
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && <p className="text-[14px] text-zinc-400 leading-relaxed mb-4 max-w-2xl">{profile.bio}</p>}

          {/* Stats + Links */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <FollowersModal username={profile.username} type="followers" count={followersCount} />
            <FollowersModal username={profile.username} type="following" count={profile.following?.length || 0} />
            <span className="text-[13px] text-zinc-500"><span className="font-semibold text-zinc-200">{projects.length}</span> projects</span>
            <span className="text-[13px] text-zinc-500"><span className="font-semibold text-zinc-200">{blogs.length}</span> posts</span>
          </div>

          {/* Skills + Links */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {profile.skills?.length > 0 && profile.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors"><GithubIcon className="w-4 h-4" /></a>}
            {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors"><LinkedinIcon className="w-4 h-4" /></a>}
            {profile.portfolioUrl && <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-[12px]"><ExternalLink className="w-3.5 h-3.5" /> Portfolio</a>}
          </div>
        </AnimateIn>

        {/* Tabs */}
        <AnimateIn delay={0.05}>
          <div className="flex gap-0.5 border-b border-border mb-6">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-3 py-2 text-[13px] font-medium transition-colors border-b-2 cursor-pointer ${activeTab === t.key ? "text-zinc-100 border-zinc-100" : "text-zinc-500 border-transparent hover:text-zinc-300"}`}>
                {t.label}{t.count !== undefined && ` (${t.count})`}
              </button>
            ))}
          </div>
        </AnimateIn>

        {/* Tab Content */}
        <AnimateIn delay={0.1}>
          {activeTab === "projects" && (
            projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{projects.map((p) => <ProjectCard key={p._id} project={p} />)}</div>
            ) : <EmptyState icon={FolderKanban} title="No projects yet" description={isOwner ? "Showcase your first project." : `${profile.name} hasn't added any projects yet.`} />
          )}
          {activeTab === "blogs" && (
            blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{blogs.map((b) => <BlogCard key={b._id} blog={b} />)}</div>
            ) : <EmptyState icon={BookOpen} title="No posts yet" description={isOwner ? "Share your first article." : `${profile.name} hasn't published any posts yet.`} />
          )}
          {activeTab === "activity" && <ActivityFeed userId={profile._id} title="" />}
          {activeTab === "github" && <GitHubCard username={profile.githubUsername} />}
        </AnimateIn>
      </div>
    </div>
  );
}
