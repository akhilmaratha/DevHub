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

export default function EditProjectPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: [],
    githubUrl: "",
    liveUrl: "",
    image: "",
    featured: false,
  });
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        const p = data.project;
        setForm({
          title: p.title || "",
          description: p.description || "",
          techStack: p.techStack || [],
          githubUrl: p.githubUrl || "",
          liveUrl: p.liveUrl || "",
          image: p.image || "",
          featured: p.featured || false,
        });
      }
    } finally {
      setFetching(false);
    }
  };

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !form.techStack.includes(tech)) {
      setForm({ ...form, techStack: [...form.techStack, tech] });
      setTechInput("");
    }
  };

  const removeTech = (techToRemove) => {
    setForm({ ...form, techStack: form.techStack.filter((t) => t !== techToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push(`/projects/${id}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update project");
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
        <h1 className="text-2xl font-bold text-white mb-1">Edit <span className="gradient-text">Project</span></h1>
      </AnimateIn>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-6 bg-card border border-border rounded-xl space-y-5">
          <Input label="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[150px]" required />
          <Input label="Cover Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>

        <div className="p-6 bg-card border border-border rounded-xl space-y-5">
          <h2 className="text-base font-semibold text-zinc-200">Tech Stack</h2>
          <div className="flex gap-2">
            <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add technology..." onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }} />
            <Button type="button" onClick={addTech} variant="outline" size="md"><Plus className="w-4 h-4" /></Button>
          </div>
          {form.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.techStack.map((tech) => (
                <Badge key={tech} className="cursor-pointer group" onClick={() => removeTech(tech)}>{tech}<X className="w-3 h-3 ml-1 text-zinc-500 group-hover:text-red-400" /></Badge>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-card border border-border rounded-xl space-y-5">
          <Input label="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
          <Input label="Live Demo URL" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-violet-600" />
            <span className="text-sm text-zinc-300">Mark as featured</span>
          </label>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
        </Button>
      </form>
    </div>
  );
}
