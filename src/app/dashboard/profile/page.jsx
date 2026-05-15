"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import AnimateIn from "@/components/shared/AnimateIn";
import { Save, Plus, X } from "lucide-react";

export default function EditProfilePage() {
  const { user, fetchUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    name: "", bio: "", skills: [], githubUrl: "", linkedinUrl: "", portfolioUrl: "", avatar: "", banner: "",
    githubUsername: "", location: "", experienceLevel: "", availabilityStatus: "", favoriteFramework: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({
      name: user.name || "", bio: user.bio || "", skills: user.skills || [],
      githubUrl: user.githubUrl || "", linkedinUrl: user.linkedinUrl || "", portfolioUrl: user.portfolioUrl || "",
      avatar: user.avatar || "", banner: user.banner || "",
      githubUsername: user.githubUsername || "", location: user.location || "",
      experienceLevel: user.experienceLevel || "", availabilityStatus: user.availabilityStatus || "",
      favoriteFramework: user.favoriteFramework || "",
    });
  }, [user]);

  const addSkill = () => { const s = skillInput.trim(); if (s && !form.skills.includes(s)) { setForm({ ...form, skills: [...form.skills, s] }); setSkillInput(""); } };
  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter((x) => x !== s) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.username}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success("Profile updated."); fetchUser(); }
      else { const data = await res.json(); toast.error(data.error || "Failed to update."); }
    } catch { toast.error("Something went wrong."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl space-y-5">
      <AnimateIn>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight mb-0.5">Edit Profile</h1>
        <p className="text-[13px] text-zinc-500">Update your developer profile.</p>
      </AnimateIn>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="border border-border rounded-lg p-4 space-y-4">
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A few words about you..." maxLength={300} />
          <Input label="Avatar URL" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="San Francisco, CA" />
        </div>

        {/* Developer Identity */}
        <div className="border border-border rounded-lg p-4 space-y-4">
          <p className="text-[13px] font-medium text-zinc-300">Developer Identity</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-zinc-500 mb-1.5">Experience Level</label>
              <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm text-zinc-100 focus:outline-none focus:border-[rgba(255,255,255,0.15)]">
                <option value="">Select...</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-zinc-500 mb-1.5">Availability</label>
              <select value={form.availabilityStatus} onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value })} className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm text-zinc-100 focus:outline-none focus:border-[rgba(255,255,255,0.15)]">
                <option value="">Select...</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="open-to-collaborate">Open to Collaborate</option>
                <option value="hiring">Hiring</option>
              </select>
            </div>
          </div>
          <Input label="Favorite Framework" value={form.favoriteFramework} onChange={(e) => setForm({ ...form, favoriteFramework: e.target.value })} placeholder="e.g. Next.js" />
        </div>

        {/* Skills */}
        <div className="border border-border rounded-lg p-4 space-y-3">
          <p className="text-[13px] font-medium text-zinc-300">Skills</p>
          <div className="flex gap-2">
            <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="e.g. React" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
            <Button type="button" onClick={addSkill} variant="outline" size="md"><Plus className="w-3.5 h-3.5" /></Button>
          </div>
          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.skills.map((s) => (
                <button key={s} type="button" onClick={() => removeSkill(s)} className="cursor-pointer">
                  <Badge variant="secondary">{s} <X className="w-2.5 h-2.5 ml-0.5" /></Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="border border-border rounded-lg p-4 space-y-4">
          <p className="text-[13px] font-medium text-zinc-300">Links</p>
          <Input label="GitHub Username" value={form.githubUsername} onChange={(e) => setForm({ ...form, githubUsername: e.target.value })} placeholder="e.g. torvalds" />
          <Input label="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." />
          <Input label="LinkedIn" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." />
          <Input label="Portfolio" value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} placeholder="https://..." />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? <div className="w-3.5 h-3.5 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Save</>}
        </Button>
      </form>
    </div>
  );
}
