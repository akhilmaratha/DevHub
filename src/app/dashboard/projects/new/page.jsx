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

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", techStack: [], githubUrl: "", liveUrl: "", image: "", featured: false });
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTech = () => { const t = techInput.trim(); if (t && !form.techStack.includes(t)) { setForm({ ...form, techStack: [...form.techStack, t] }); setTechInput(""); } };
  const removeTech = (t) => setForm({ ...form, techStack: form.techStack.filter((x) => x !== t) });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!form.title || !form.description) { setError("Title and description required."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { const data = await res.json(); router.push(`/projects/${data.project._id}`); }
      else { const data = await res.json(); setError(data.error || "Failed."); }
    } catch { setError("Something went wrong."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl space-y-5">
      <AnimateIn>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors mb-3"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</Link>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight mb-0.5">New Project</h1>
        <p className="text-[13px] text-zinc-500">Add a project to your portfolio.</p>
      </AnimateIn>

      {error && <div className="px-3 py-2.5 rounded-md bg-red-500/6 border border-red-500/10 text-[13px] text-red-400">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-border rounded-lg p-4 space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project name" required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does this project do?" className="min-h-[120px]" required />
          <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
        </div>

        <div className="border border-border rounded-lg p-4 space-y-3">
          <p className="text-[13px] font-medium text-zinc-300">Tech Stack</p>
          <div className="flex gap-2">
            <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="e.g. React" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }} />
            <Button type="button" onClick={addTech} variant="outline" size="md"><Plus className="w-3.5 h-3.5" /></Button>
          </div>
          {form.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.techStack.map((t) => <button key={t} type="button" onClick={() => removeTech(t)} className="cursor-pointer"><Badge variant="secondary">{t} <X className="w-2.5 h-2.5 ml-0.5" /></Badge></button>)}
            </div>
          )}
        </div>

        <div className="border border-border rounded-lg p-4 space-y-4">
          <Input label="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." />
          <Input label="Live URL" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." />
          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-zinc-400">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-800" />
            Featured project
          </label>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <div className="w-3.5 h-3.5 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Create</>}
        </Button>
      </form>
    </div>
  );
}
