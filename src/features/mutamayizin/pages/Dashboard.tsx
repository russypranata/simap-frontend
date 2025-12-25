"use client";

import React, { useEffect, useState } from "react";
import {
    Calendar,
    Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mutamayizinService } from "../services/mutamayizinService";

export const MutamayizinDashboard: React.FC = () => {
    const [userName, setUserName] = useState<string>("Koordinator Program Mutamayizin");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await mutamayizinService.getProfileData();
                setUserName(profileData.name);
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Dashboard </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">PJ Mutamayizin</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Selamat datang, {loading ? "..." : userName}
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-sm font-medium text-blue-800">Semester Ganjil</span>
                    </div>
                </div>
            </div>

            {/* Coming Soon Card */}
            <Card>
                <CardContent className="p-12 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="inline-flex p-4 bg-primary/10 rounded-full">
                            <Award className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">
                            Fitur Segera Hadir
                        </h2>
                        <p className="text-muted-foreground">
                            Fitur lengkap untuk manajemen Program Mutamayizin sedang dalam tahap pengembangan. Sementara waktu, Anda dapat mengelola profil melalui menu Profil.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
