"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Calendar,
    Award,
    Users,
    Trophy,
    Star,
    Briefcase,
    ClipboardList,
    ArrowRight,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    mutamayizinService,
    type MutamayizinDashboardStats,
    type RecentAchievement,
    type EkskulSummary,
} from "../services/mutamayizinService";

// Skeleton component for loading state
const DashboardSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div>
            <div className="h-9 bg-muted rounded w-80 mb-2" />
            <div className="h-5 bg-muted rounded w-48 mb-4" />
            <div className="h-7 bg-muted rounded-full w-56" />
        </div>
        <div className="h-32 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 bg-muted rounded-lg" />
            <div className="h-72 bg-muted rounded-lg" />
        </div>
    </div>
);

export const MutamayizinDashboard: React.FC = () => {
    const router = useRouter();


    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState("Koordinator Program Mutamayizin");
    const [stats, setStats] = useState<MutamayizinDashboardStats>({
        totalStudents: 0,
        activeStudents: 0,
        totalAchievements: 0,
        totalEkskul: 0,
        totalTutors: 0,
        activeTutors: 0,
    });
    const [recentAchievements, setRecentAchievements] = useState<RecentAchievement[]>([]);
    const [ekskulSummary, setEkskulSummary] = useState<EkskulSummary[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, statsData, achievementsData, ekskulData] = await Promise.all([
                    mutamayizinService.getProfileData(),
                    mutamayizinService.getDashboardStats(),
                    mutamayizinService.getRecentAchievements(),
                    mutamayizinService.getEkskulSummary(),
                ]);

                setUserName(profileData.name);
                setStats(statsData);
                setRecentAchievements(achievementsData);
                setEkskulSummary(ekskulData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getRankColor = (rank: string) => {
        if (rank === "Juara 1") return "bg-emerald-100 text-emerald-700 border-emerald-200";
        if (rank === "Juara 2") return "bg-sky-100 text-sky-700 border-sky-200";
        if (rank === "Juara 3") return "bg-orange-100 text-orange-700 border-orange-200";
        return "bg-zinc-100 text-zinc-600 border-zinc-200";
    };

    const getLevelColor = (level: string) => {
        if (level === "Nasional") return "bg-red-50 text-red-700 border-red-200";
        if (level === "Provinsi") return "bg-amber-50 text-amber-700 border-amber-200";
        return "bg-blue-50 text-blue-700 border-blue-200";
    };

    if (isLoading) {
        return <DashboardSkeleton />;
    }

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
                        Selamat datang, <span className="font-medium text-foreground">{userName}</span>
                    </p>

                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="border-blue-200 text-blue-800 hover:bg-blue-50"
                        onClick={() => router.push("/mutamayizin-coordinator/attendance")}
                    >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Presensi Siswa
                    </Button>
                    <Button
                        className="bg-blue-800 hover:bg-blue-900 text-white"
                        onClick={() => router.push("/mutamayizin-coordinator/achievements")}
                    >
                        <Trophy className="h-4 w-4 mr-2" />
                        Kelola Prestasi
                    </Button>
                </div>
            </div>

            {/* Stats Overview Card */}
            <Card className="overflow-hidden p-0 gap-0">
                {/* Header Section */}
                <div className="bg-blue-800 p-4 relative overflow-hidden">
                    {/* Decorative */}
                    <div className="absolute -right-6 -bottom-6 text-white/10 transform rotate-12">
                        <Award className="w-32 h-32" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Ringkasan Program</h2>
                            <p className="text-blue-100 text-sm">Program Mutamayizin Alfityan</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid — 4 columns */}
                <CardContent className="p-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                                <Users className="h-4 w-4 text-blue-800" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{stats.totalStudents}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Siswa</p>
                        </div>

                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-green-100 rounded-full mb-1.5">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">{stats.activeStudents}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Siswa Aktif</p>
                        </div>

                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-amber-100 rounded-full mb-1.5">
                                <Trophy className="h-4 w-4 text-amber-600" />
                            </div>
                            <p className="text-2xl font-bold text-amber-600">{stats.totalAchievements}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Prestasi</p>
                        </div>

                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-purple-100 rounded-full mb-1.5">
                                <Star className="h-4 w-4 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-600">{stats.totalEkskul}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Ekstrakurikuler</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Achievements */}
                <Card>
                    <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Trophy className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">
                                        Prestasi Terbaru
                                    </CardTitle>
                                    <CardDescription>
                                        Pencapaian siswa terkini
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary"
                                onClick={() => router.push("/mutamayizin-coordinator/achievements")}
                            >
                                Lihat Semua
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-2">
                            {recentAchievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    onClick={() => router.push(`/mutamayizin-coordinator/achievements/${achievement.id}`)}
                                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer"
                                >
                                    {/* Icon */}
                                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                                        <Award className="h-4 w-4 text-blue-800" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {achievement.competitionName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {achievement.studentName} · {new Date(achievement.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <Badge variant="outline" className={`${getRankColor(achievement.rank)} text-[11px] px-1.5 py-0`}>
                                            {achievement.rank}
                                        </Badge>
                                        <Badge variant="outline" className={`${getLevelColor(achievement.level)} text-[11px] px-1.5 py-0`}>
                                            {achievement.level}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Extracurricular Summary */}
                <Card>
                    <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Star className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">
                                        Ringkasan Ekskul
                                    </CardTitle>
                                    <CardDescription>
                                        {ekskulSummary.length} ekstrakurikuler aktif
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary"
                                onClick={() => router.push("/mutamayizin-coordinator/members")}
                            >
                                Lihat Anggota
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-2">
                            {ekskulSummary.slice(0, 5).map((ekskul) => (
                                <div
                                    key={ekskul.name}
                                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-purple-50/50 hover:border-purple-200 transition-all"
                                >
                                    {/* Icon */}
                                    <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100">
                                        <Star className="h-4 w-4 text-purple-600" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">{ekskul.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {ekskul.tutorName}
                                        </p>
                                    </div>

                                    {/* Badge */}
                                    <Badge className="bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 flex-shrink-0 text-xs">
                                        <Users className="h-3 w-3 mr-1" />
                                        {ekskul.memberCount}
                                    </Badge>
                                </div>
                            ))}

                            {/* Show more indicator */}
                            {ekskulSummary.length > 5 && (
                                <button
                                    onClick={() => router.push("/mutamayizin-coordinator/members")}
                                    className="w-full text-center text-xs text-muted-foreground hover:text-primary py-2 transition-colors"
                                >
                                    +{ekskulSummary.length - 5} ekskul lainnya
                                </button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Tips */}
            <Card className="bg-blue-50 border-blue-800/20">
                <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-800 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-blue-800">Panduan untuk PJ Mutamayizin</p>
                            <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
                                <li>Kelola data prestasi siswa melalui menu <strong>Prestasi</strong></li>
                                <li>Pantau kehadiran siswa dan tutor melalui menu <strong>Ekstrakurikuler</strong></li>
                                <li>Perbarui data tutor dan anggota ekskul secara berkala</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
