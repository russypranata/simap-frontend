"use client";

import React from "react";
import { Construction, LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/features/shared/components";

export const TeacherDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <PageHeader
        title="Dashboard"
        titleHighlight="Guru"
        icon={LayoutDashboard}
        description="Ringkasan aktivitas pembelajaran dan administrasi"
      />

      {/* Placeholder Content */}
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 bg-muted/10 rounded-3xl border border-dashed border-muted-foreground/20 p-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow"></div>
          <div className="relative p-6 bg-card border shadow-lg rounded-2xl">
            <Construction className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Fitur Segera Hadir</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Halaman ini sedang dalam tahap pengembangan. Nantikan pembaruan fitur dashboard guru yang lengkap.
          </p>
        </div>
        <div className="px-4 py-2 bg-muted/50 rounded-lg border text-xs font-mono text-muted-foreground">
          Status: Under Construction
        </div>
      </div>
    </div>
  );
};
