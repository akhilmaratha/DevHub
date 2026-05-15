"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-zinc-800 mb-4">404</p>
        <h1 className="text-lg font-semibold text-zinc-200 mb-1">Page not found</h1>
        <p className="text-[13px] text-zinc-500 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/">
          <Button variant="outline"><ArrowLeft className="w-3.5 h-3.5" /> Go home</Button>
        </Link>
      </div>
    </div>
  );
}
