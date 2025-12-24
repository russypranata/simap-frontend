"use client";

import React from "react";
import { Construction, Calendar, LayoutDashboard } from "lucide-react";

export const ExtracurricularDashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Dashboard <span className="text-primary">Pembina Ekskul</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <LayoutDashboard className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground">
                        Kelola kegiatan, anggota, dan presensi ekstrakurikuler
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2024/2025</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-muted-foreground text-sm font-medium text-primary">Semester Ganjil</span>
                    </div>
                </div>
            </div>

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
                        Halaman dashboard ini sedang dalam tahap pengembangan. Nantikan pembaruan fitur manajemen ekstrakurikuler yang lengkap.
                    </p>
                </div>

                <div className="px-4 py-2 bg-muted/50 rounded-lg border text-xs font-mono text-muted-foreground">
                    Status: Under Construction
                </div>
            </div>
        </div>
    );
};
