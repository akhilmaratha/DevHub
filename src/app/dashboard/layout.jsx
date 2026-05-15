"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          className="transition-all duration-200 min-h-screen"
          style={{ marginLeft: collapsed ? 56 : 220 }}
        >
          <div className="p-5 sm:p-8 max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
