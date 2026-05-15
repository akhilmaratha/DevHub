"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Bookmark, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookmarkButton({
  type = "project", // "project" | "blog"
  id,
  initialBookmarked = false,
  onUpdate,
}) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setLoading(true);

    setBookmarked(!bookmarked);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookmarked(data.bookmarked);
        onUpdate?.(data);
      } else {
        setBookmarked(bookmarked);
      }
    } catch {
      setBookmarked(bookmarked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={loading || !user}
      className={cn(
        "inline-flex items-center gap-1 text-[12px] transition-all duration-150 cursor-pointer group",
        bookmarked ? "text-amber-400" : "text-zinc-500 hover:text-amber-400",
        !user && "opacity-50 cursor-default"
      )}
      title={!user ? "Log in to bookmark" : bookmarked ? "Remove bookmark" : "Bookmark"}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Bookmark
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-150",
            bookmarked && "fill-current",
            !loading && "group-hover:scale-110"
          )}
        />
      )}
    </button>
  );
}
