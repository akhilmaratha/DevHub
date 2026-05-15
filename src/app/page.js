"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import AnimateIn, { StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import ActivityFeed from "@/components/shared/ActivityFeed";
import {
  ArrowRight,
  Code2,
  Users,
  BookOpen,
  FolderKanban,
  ArrowUpRight,
  Terminal,
  GitBranch,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero — structured, not centered blob */}
      <section className="pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-[13px] text-zinc-500 font-medium mb-4 tracking-wide">
                FOR DEVELOPERS, BY DEVELOPERS
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 leading-[1.15] mb-5">
                Your work deserves<br />a better home.
              </h1>
              <p className="text-[16px] text-zinc-500 leading-relaxed mb-8 max-w-lg">
                DevHub is where developers showcase projects, write about what they know,
                and build a presence that actually matters.
              </p>
              <div className="flex items-center gap-3">
                <Link href="/signup">
                  <Button size="lg">
                    Get started <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Link href="/explore/projects">
                  <Button variant="outline" size="lg">
                    Explore projects
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product preview — feels like real UI, not a mockup */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimateIn>
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-surface">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                </div>
                <div className="h-5 flex-1 max-w-xs bg-[rgba(255,255,255,0.04)] rounded" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-[rgba(255,255,255,0.04)]">
                {[
                  { title: "Projects Shipped", value: "25,431", sub: "+12% this month", icon: FolderKanban },
                  { title: "Active Developers", value: "10,892", sub: "+340 this week", icon: Users },
                  { title: "Blog Posts", value: "15,203", sub: "+89 this week", icon: BookOpen },
                ].map((stat) => (
                  <div key={stat.title} className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <stat.icon className="w-4 h-4 text-zinc-600" />
                      <span className="text-[12px] text-zinc-500 font-medium">{stat.title}</span>
                    </div>
                    <p className="text-2xl font-semibold text-zinc-200 tracking-tight">{stat.value}</p>
                    <p className="text-[12px] text-zinc-600 mt-1">{stat.sub}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[rgba(255,255,255,0.04)] p-5 sm:p-6 space-y-2.5">
                {[
                  { name: "next-saas-starter", desc: "Full-stack SaaS boilerplate with auth, billing, and dashboard", tech: ["Next.js", "Stripe", "Postgres"] },
                  { name: "rust-cli-tools", desc: "Collection of performant CLI utilities written in Rust", tech: ["Rust", "Clap", "Serde"] },
                  { name: "design-system-kit", desc: "Accessible component library with dark mode and theming", tech: ["React", "Radix", "CSS"] },
                ].map((item) => (
                  <div key={item.name} className="flex items-start justify-between py-2.5 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                    <div>
                      <p className="text-[13px] font-medium text-zinc-300">{item.name}</p>
                      <p className="text-[12px] text-zinc-600 mt-0.5">{item.desc}</p>
                    </div>
                    <div className="flex gap-1 shrink-0 ml-4">
                      {item.tech.map((t) => (
                        <span key={t} className="text-[10px] text-zinc-600 bg-[rgba(255,255,255,0.04)] px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Features — clean grid, no gradient icons */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimateIn className="mb-12">
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-3">What you get</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-200 tracking-tight">
              Everything a developer needs.
            </h2>
          </AnimateIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
            {[
              { icon: FolderKanban, title: "Project Showcase", desc: "Display work with descriptions, tech stacks, and live links. Not just screenshots." },
              { icon: Users, title: "Developer Profiles", desc: "Skills, social links, followers — a profile that represents what you actually do." },
              { icon: BookOpen, title: "Technical Blog", desc: "Write about what you build. Share tutorials, learnings, and opinions." },
              { icon: Terminal, title: "Search & Discovery", desc: "Find developers by skill, projects by tech stack, and content that matters." },
              { icon: GitBranch, title: "Follow System", desc: "Follow developers whose work interests you. Build a genuine network." },
              { icon: Zap, title: "Dashboard", desc: "Analytics, quick actions, and an overview of everything in one place." },
            ].map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="bg-card p-6 sm:p-7">
                  <feature.icon className="w-5 h-5 text-zinc-500 mb-3" />
                  <h3 className="text-[14px] font-semibold text-zinc-200 mb-1.5">{feature.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">{feature.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How it works — asymmetric, numbered */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <AnimateIn>
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-3">How it works</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-200 tracking-tight mb-3">
                Sign up. Ship. Share.
              </h2>
              <p className="text-[15px] text-zinc-500 leading-relaxed max-w-md">
                No bloated onboarding. Create your profile, add your projects,
                write a blog post. Takes about five minutes.
              </p>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <div className="space-y-0">
                {[
                  { step: "1", title: "Create your profile", desc: "Set up your bio, skills, and social links." },
                  { step: "2", title: "Add projects", desc: "Showcase your work with tech stacks and live links." },
                  { step: "3", title: "Write & connect", desc: "Share knowledge and follow other developers." },
                ].map((item, i) => (
                  <div key={item.step} className={`flex gap-4 py-5 ${i < 2 ? "border-b border-border" : ""}`}>
                    <span className="text-[13px] font-mono text-zinc-600 mt-0.5">{item.step}.</span>
                    <div>
                      <h3 className="text-[14px] font-medium text-zinc-200 mb-1">{item.title}</h3>
                      <p className="text-[13px] text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Community Activity */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimateIn>
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-3">Community</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-200 tracking-tight mb-3">
                See what developers are building.
              </h2>
              <p className="text-[15px] text-zinc-500 leading-relaxed max-w-md mb-6">
                A live feed of projects, articles, and connections happening on DevHub right now.
              </p>
              <div className="flex gap-3">
                <Link href="/explore/developers">
                  <Button variant="outline" size="sm">
                    <Users className="w-3.5 h-3.5" /> Browse Developers
                  </Button>
                </Link>
                <Link href="/blogs">
                  <Button variant="outline" size="sm">
                    <BookOpen className="w-3.5 h-3.5" /> Read Blog
                  </Button>
                </Link>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <div className="border border-border rounded-lg p-4 max-h-[340px] overflow-y-auto">
                <ActivityFeed limit={8} title="" />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* CTA — clean, not a gradient card */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimateIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-200 tracking-tight mb-2">
                  Ready to build your developer presence?
                </h2>
                <p className="text-[15px] text-zinc-500">Free to use. No credit card required.</p>
              </div>
              <Link href="/signup">
                <Button size="lg">
                  Get started <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
