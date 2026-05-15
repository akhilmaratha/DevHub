"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import AnimateIn from "@/components/shared/AnimateIn";
import { Save, Plus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

import MarkdownEditor from "@/components/shared/MarkdownEditor";

export default function EditBlogPage({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: [],
    coverImage: "",
    excerpt: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${slug}`);
      if (res.ok) {
        const data = await res.json();
        const b = data.blog;
        setForm({
          title: b.title || "",
          content: b.content || "",
          tags: b.tags || [],
          coverImage: b.coverImage || "",
          excerpt: b.excerpt || "",
        });
      }
    } finally {
      setFetching(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tagToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push(`/blogs/${slug}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update blog");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <AnimateIn>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white mb-1">Edit <span className="gradient-text">Blog Post</span></h1>
      </AnimateIn>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-6 bg-card border border-border rounded-xl space-y-5">
          <Input label="Blog Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} maxLength={300} className="min-h-[80px]" />
          <Input label="Cover Image URL" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
        </div>

        <div className="p-6 bg-card border border-border rounded-xl space-y-5">
          <h2 className="text-base font-semibold text-zinc-200">Tags</h2>
          <div className="flex gap-2">
            <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag..." onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
            <Button type="button" onClick={addTag} variant="outline" size="md"><Plus className="w-4 h-4" /></Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <Badge key={tag} className="cursor-pointer group" onClick={() => removeTag(tag)}>{tag}<X className="w-3 h-3 ml-1 text-zinc-500 group-hover:text-red-400" /></Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-[13px] font-medium text-zinc-300 px-1">Content</h2>
          <MarkdownEditor 
            value={form.content} 
            onChange={(val) => setForm({ ...form, content: val })} 
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
        </Button>
      </form>
    </div>
  );
}
