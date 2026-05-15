"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import AnimateIn from "@/components/shared/AnimateIn";
import { Save, Plus, X, ArrowLeft } from "lucide-react";

export default function NewBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", tags: [], coverImage: "", excerpt: "" });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTag = () => { const t = tagInput.trim(); if (t && !form.tags.includes(t)) { setForm({ ...form, tags: [...form.tags, t] }); setTagInput(""); } };
  const removeTag = (t) => setForm({ ...form, tags: form.tags.filter((x) => x !== t) });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!form.title || !form.content) { setError("Title and content required."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/blogs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { const data = await res.json(); router.push(`/blogs/${data.blog.slug}`); }
      else { const data = await res.json(); setError(data.error || "Failed."); }
    } catch { setError("Something went wrong."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl space-y-5">
      <AnimateIn>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors mb-3"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</Link>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight mb-0.5">New Post</h1>
        <p className="text-[13px] text-zinc-500">Share your knowledge.</p>
      </AnimateIn>

      {error && <div className="px-3 py-2.5 rounded-md bg-red-500/6 border border-red-500/10 text-[13px] text-red-400">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-border rounded-lg p-4 space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="How I built..." required />
          <Textarea label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary..." maxLength={300} className="min-h-[60px]" />
          <Input label="Cover Image URL" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." />
        </div>

        <div className="border border-border rounded-lg p-4 space-y-3">
          <p className="text-[13px] font-medium text-zinc-300">Tags</p>
          <div className="flex gap-2">
            <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g. JavaScript" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
            <Button type="button" onClick={addTag} variant="outline" size="md"><Plus className="w-3.5 h-3.5" /></Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((t) => <button key={t} type="button" onClick={() => removeTag(t)} className="cursor-pointer"><Badge variant="secondary">{t} <X className="w-2.5 h-2.5 ml-0.5" /></Badge></button>)}
            </div>
          )}
        </div>

        <div className="border border-border rounded-lg p-4">
          <Textarea label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your post..." className="min-h-[240px]" required />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <div className="w-3.5 h-3.5 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Publish</>}
        </Button>
      </form>
    </div>
  );
}
