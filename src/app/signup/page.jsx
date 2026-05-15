"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (form.username.length < 3) { setError("Username must be at least 3 characters"); return; }

    setLoading(true);
    try {
      await signup(form.name, form.username, form.email, form.password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-14">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight mb-1">Create your account</h1>
          <p className="text-[13px] text-zinc-500">Join the developer community.</p>
        </div>

        {error && (
          <div className="px-3 py-2.5 mb-5 rounded-md bg-red-500/6 border border-red-500/10 text-[13px] text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Full name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            type="text"
            label="Username"
            placeholder="janedoe"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
            required
          />
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
            ) : (
              <>Create account <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </Button>
        </form>

        <p className="text-center text-[13px] text-zinc-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-zinc-300 hover:text-white transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
