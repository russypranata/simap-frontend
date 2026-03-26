"use client";

import React from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { GraduationCap, Wrench } from "lucide-react";

export const ParentGrades: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Nilai & </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Rapor Anak</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Monitoring hasil belajar dan pencapaian akademik anak
                    </p>
                </div>
            </div>

            {/* Placeholder Content */}
            <Card className="border-dashed border-2 shadow-sm border-slate-200 mt-8">
                <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                        <Wrench className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Fitur Segera Hadir</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Halaman untuk memantau detail nilai akademis dan rapor anak saat ini sedang dalam tahap pengembangan. Nantikan pembaruannya segera!
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
