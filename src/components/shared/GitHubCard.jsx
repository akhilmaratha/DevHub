"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { Star, GitFork, MapPin, Users, BookOpen, ExternalLink, Loader2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

function RepoCard({ repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-border rounded-lg p-3.5 hover:border-border-hover hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="text-[13px] font-medium text-accent group-hover:text-accent-hover transition-colors truncate">
          {repo.name}
        </h4>
        <ExternalLink className="w-3 h-3 text-zinc-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {repo.description && (
        <p className="text-[12px] text-zinc-500 mb-2.5 line-clamp-2 leading-relaxed">{repo.description}</p>
      )}
      <div className="flex items-center gap-3 text-[11px] text-zinc-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: LANG_COLORS[repo.language] || "#8b949e" }}
            />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="flex items-center gap-0.5">
            <Star className="w-3 h-3" /> {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="flex items-center gap-0.5">
            <GitFork className="w-3 h-3" /> {repo.forks}
          </span>
        )}
      </div>
    </a>
  );
}

export default function GitHubCard({ username }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!username) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/github?username=${encodeURIComponent(username)}`);
        if (!cancelled && res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        } else if (!cancelled) {
          setError(true);
        }
      } catch { if (!cancelled) setError(true); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [username]);

  if (!username) return null;

  if (loading) {
    return (
      <div className="border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <GithubIcon className="w-4 h-4 text-zinc-500" />
          <span className="text-[13px] font-medium text-zinc-300">GitHub</span>
        </div>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-4 h-4 text-zinc-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <GithubIcon className="w-4 h-4 text-zinc-500" />
          <span className="text-[13px] font-medium text-zinc-300">GitHub</span>
        </div>
        <p className="text-[12px] text-zinc-600">Unable to load GitHub data.</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GithubIcon className="w-4 h-4 text-zinc-400" />
            <span className="text-[13px] font-medium text-zinc-200">GitHub</span>
          </div>
          <a
            href={profile.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            @{profile.login} <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-border">
        {[
          { label: "Repos", value: profile.publicRepos },
          { label: "Followers", value: profile.followers },
          { label: "Following", value: profile.following },
        ].map((s) => (
          <div key={s.label} className="bg-background px-3 py-2.5 text-center">
            <p className="text-sm font-semibold text-zinc-200">{s.value}</p>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Languages */}
      {profile.topLanguages?.length > 0 && (
        <div className="px-4 py-3 border-t border-border">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium mb-2">Top Languages</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.topLanguages.map((lang) => (
              <span
                key={lang.name}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-zinc-400 bg-card-hover border border-border"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: LANG_COLORS[lang.name] || "#8b949e" }}
                />
                {lang.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top Repos */}
      {profile.topRepos?.length > 0 && (
        <div className="px-4 py-3 border-t border-border">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium mb-2.5">Popular Repos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {profile.topRepos.slice(0, 4).map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
