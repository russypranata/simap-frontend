"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Calendar,
    Trophy,
    Users,
    Clock,
    MapPin,
    CheckCircle,
    Star,
    Award,
    ChevronRight,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Extracurricular {
    id: number;
    name: string;
    category: string;
    schedule: string;
    time: string;
    location: string;
    advisor: string;
    members: number;
    status: "active" | "inactive";
    attendanceRate: number;
    joinDate: string;
    achievements?: string[];
}

interface ExtracurricularAttendance {
    id: number;
    date: string;
    activity: string;
    status: "hadir" | "izin" | "alpa";
}

// Mock data
const mockExtracurriculars: Extracurricular[] = [
    {
        id: 1,
        name: "Pramuka",
        category: "Kepramukaan",
        schedule: "Jumat",
        time: "14:00 - 16:00",
        location: "Lapangan Sekolah",
        advisor: "Pak Ahmad Fauzi",
        members: 45,
        status: "active",
        attendanceRate: 92,
        joinDate: "2023-07-15",
        achievements: ["Juara 2 Jambore Tingkat Kota 2024", "Best Team Camping 2025"],
    },
    {
        id: 2,
        name: "Basket",
        category: "Olahraga",
        schedule: "Selasa & Kamis",
        time: "15:00 - 17:00",
        location: "Lapangan Basket",
        advisor: "Pak Dedi Kurniawan",
        members: 20,
        status: "active",
        attendanceRate: 88,
        joinDate: "2024-08-01",
        achievements: ["Juara 1 Turnamen Antar SMA 2025"],
    },
];

const mockRecentAttendance: ExtracurricularAttendance[] = [
    { id: 1, date: "2026-01-10", activity: "Pramuka - Latihan Rutin", status: "hadir" },
    { id: 2, date: "2026-01-09", activity: "Basket - Latihan", status: "hadir" },
    { id: 3, date: "2026-01-07", activity: "Basket - Latihan", status: "hadir" },
    { id: 4, date: "2026-01-03", activity: "Pramuka - Latihan Rutin", status: "izin" },
    { id: 5, date: "2025-12-26", activity: "Basket - Latihan", status: "hadir" },
];

// Helper functions
const getStatusConfig = (status: ExtracurricularAttendance["status"]) => {
    const configs = {
        hadir: { label: "Hadir", color: "bg-green-100 text-green-700 border-green-200" },
        izin: { label: "Izin", color: "bg-blue-100 text-blue-700 border-blue-200" },
        alpa: { label: "Alpa", color: "bg-red-100 text-red-700 border-red-200" },
    };
    return configs[status];
};

const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        "Kepramukaan": "bg-amber-100 text-amber-800 border-amber-200",
        "Olahraga": "bg-blue-100 text-blue-800 border-blue-200",
        "Seni": "bg-pink-100 text-pink-800 border-pink-200",
        "Akademik": "bg-purple-100 text-purple-800 border-purple-200",
        "Teknologi": "bg-cyan-100 text-cyan-800 border-cyan-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
};

export const ParentExtracurricularAttendance: React.FC = () => {
    const totalEkskul = mockExtracurriculars.length;
    const avgAttendance = Math.round(
        mockExtracurriculars.reduce((sum, e) => sum + e.attendanceRate, 0) / totalEkskul
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Kegiatan </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Ekstrakurikuler</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Trophy className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Lihat kegiatan ekstrakurikuler yang diikuti anak dan riwayat keaktifannya
                    </p>

                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Ekskul Diikuti</p>
                                <p className="text-2xl font-bold text-blue-800 mt-1">{totalEkskul}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Trophy className="h-5 w-5 text-blue-800" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Rata-rata Kehadiran</p>
                                <p className={cn(
                                    "text-2xl font-bold mt-1",
                                    avgAttendance >= 90 ? "text-green-600" :
                                        avgAttendance >= 75 ? "text-amber-600" : "text-red-600"
                                )}>
                                    {avgAttendance}%
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Prestasi</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">
                                    {mockExtracurriculars.reduce((sum, e) => sum + (e.achievements?.length || 0), 0)}
                                </p>
                            </div>
                            <div className="p-3 bg-amber-100 rounded-full">
                                <Award className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Extracurricular Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockExtracurriculars.map((ekskul) => (
                    <Card key={ekskul.id} className="overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-32 h-32 border-[16px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                            </div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                        <Trophy className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{ekskul.name}</h3>
                                        <Badge className="bg-white/20 text-white border-white/30 text-xs mt-1">
                                            {ekskul.category}
                                        </Badge>
                                    </div>
                                </div>
                                <Badge className={cn(
                                    "text-xs",
                                    ekskul.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                )}>
                                    {ekskul.status === "active" ? "Aktif" : "Tidak Aktif"}
                                </Badge>
                            </div>
                        </div>

                        <CardContent className="p-4">
                            {/* Schedule Info */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{ekskul.schedule}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{ekskul.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{ekskul.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{ekskul.advisor}</span>
                                </div>
                            </div>

                            {/* Attendance Progress */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Tingkat Kehadiran</span>
                                    <span className={cn(
                                        "font-bold",
                                        ekskul.attendanceRate >= 90 ? "text-green-600" :
                                            ekskul.attendanceRate >= 75 ? "text-amber-600" : "text-red-600"
                                    )}>
                                        {ekskul.attendanceRate}%
                                    </span>
                                </div>
                                <Progress
                                    value={ekskul.attendanceRate}
                                    className={cn(
                                        "h-2",
                                        ekskul.attendanceRate >= 90 ? "[&>div]:bg-green-600" :
                                            ekskul.attendanceRate >= 75 ? "[&>div]:bg-amber-600" :
                                                "[&>div]:bg-red-600"
                                    )}
                                />
                            </div>

                            {/* Achievements */}
                            {ekskul.achievements && ekskul.achievements.length > 0 && (
                                <div className="pt-3 border-t">
                                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                                        <Award className="h-4 w-4 text-amber-600" />
                                        Prestasi
                                    </p>
                                    <div className="space-y-1">
                                        {ekskul.achievements.map((achievement, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                <Star className="h-3 w-3 text-amber-500" />
                                                <span className="text-muted-foreground">{achievement}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-4 pt-3 border-t">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>{ekskul.members} anggota</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    Bergabung: {new Date(ekskul.joinDate).toLocaleDateString("id-ID", {
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Attendance */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Riwayat Kehadiran Terbaru</CardTitle>
                            <CardDescription>5 kegiatan terakhir yang diikuti anak</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {mockRecentAttendance.map((record) => {
                            const statusConfig = getStatusConfig(record.status);
                            return (
                                <div
                                    key={record.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Trophy className="h-4 w-4 text-blue-800" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{record.activity}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(record.date).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={statusConfig.color}>
                                        {statusConfig.label}
                                    </Badge>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
