"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LikeButton({
  type = "project", // "project" | "blog"
  id,
  initialLiked = false,
  initialCount = 0,
  onUpdate,
}) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setLoading(true);

    // Optimistic
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    try {
      const url = type === "project" ? `/api/projects/${id}/like` : `/api/blogs/${id}/like`;
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setCount(data.likesCount);
        onUpdate?.(data);
      } else {
        setLiked(liked);
        setCount(count);
      }
    } catch {
      setLiked(liked);
      setCount(count);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading || !user}
      className={cn(
        "inline-flex items-center gap-1 text-[12px] transition-all duration-150 cursor-pointer group",
        liked ? "text-rose-400" : "text-zinc-500 hover:text-rose-400",
        !user && "opacity-50 cursor-default"
      )}
      title={!user ? "Log in to like" : liked ? "Unlike" : "Like"}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Heart
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-150",
            liked && "fill-current",
            !loading && "group-hover:scale-110"
          )}
        />
      )}
      {count > 0 && <span className="font-medium">{count}</span>}
    </button>
  );
}
