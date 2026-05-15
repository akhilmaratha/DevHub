"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

export default function FollowButton({ username, initialFollowing = false, onUpdate, compact = false }) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  if (!user || user.username === username) return null;

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    // Optimistic update
    setFollowing(!following);

    try {
      const res = await fetch(`/api/users/${username}/follow`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setFollowing(data.following);
        onUpdate?.(data);
      } else {
        setFollowing(following); // Revert
      }
    } catch {
      setFollowing(following); // Revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md text-[12px] font-medium transition-all duration-150 cursor-pointer border",
        following
          ? "border-border text-zinc-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5"
          : "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20",
        compact ? "px-2 py-1" : "px-3 py-1.5"
      )}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : following ? (
        <>
          <UserMinus className="w-3 h-3" />
          {!compact && "Unfollow"}
        </>
      ) : (
        <>
          <UserPlus className="w-3 h-3" />
          {!compact && "Follow"}
        </>
      )}
    </button>
  );
}
