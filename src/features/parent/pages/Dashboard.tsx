"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
    Calendar,
    GraduationCap,
    CheckCircle,
    TrendingUp,
    ChevronRight,
    Megaphone,
    Users,
    BookOpen,
    Award,
    Star,
    Clock,
    User,
    MapPin,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Types
interface TodayScheduleItem {
    id: number;
    time: string;
    subject: string;
    teacher: string;
    room: string;
}

interface RecentAnnouncement {
    id: number;
    title: string;
    category: string;
    date: string;
    isNew: boolean;
}

// Mock data
const mockChildInfo = {
    name: "Ahmad Fauzan Ramadhan",
    class: "XII IPA 1",
    avatar: "",
};

const mockTodaySchedule: TodayScheduleItem[] = [
    { id: 1, time: "07:00", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi" },
    { id: 2, time: "08:30", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1" },
    { id: 3, time: "09:30", subject: "Bahasa Indonesia", teacher: "Bu Dewi", room: "XII IPA 1" },
];

const mockAnnouncements: RecentAnnouncement[] = [
    { id: 1, title: "Jadwal Ujian Akhir Semester Ganjil 2025/2026", category: "Penting", date: "10 Jan", isNew: true },
    { id: 2, title: "Undangan Rapat Wali Murid", category: "Kegiatan", date: "9 Jan", isNew: true },
    { id: 3, title: "Libur Semester Ganjil 2025/2026", category: "Jadwal", date: "8 Jan", isNew: false },
];

export const ParentDashboard: React.FC = () => {
    const [parentName, setParentName] = useState<string>("Orang Tua");
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        setParentName("Budi Santoso");
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const greeting = useMemo(() => {
        const hour = currentTime.getHours();
        if (hour < 11) return "Selamat pagi";
        if (hour < 15) return "Selamat siang";
        if (hour < 18) return "Selamat sore";
        return "Selamat malam";
    }, [currentTime]);

    // Mock stats
    const stats = {
        averageScore: 85.2,
        rank: 5,
        totalStudents: 32,
        attendanceRate: 96,
        unreadAnnouncements: 2,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Dashboard </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Orang Tua</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        {greeting}, <span className="font-medium text-foreground">Bapak/Ibu {parentName}</span>
                    </p>
                </div>
            </div>

            {/* Child Info Card */}
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-lg">
                            {mockChildInfo.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{mockChildInfo.name}</h3>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 mt-1">
                                <GraduationCap className="h-3.5 w-3.5 mr-1" />
                                {mockChildInfo.class}
                            </Badge>
                        </div>
                        <Link href="/parent/profile">
                            <Button variant="outline" size="sm" className="gap-1">
                                Lihat Profil
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-blue-800" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-blue-800">{stats.averageScore}</p>
                        <p className="text-xs text-muted-foreground">Rata-rata Nilai</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Award className="h-4 w-4 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">#{stats.rank}</p>
                        <p className="text-xs text-muted-foreground">dari {stats.totalStudents} siswa</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{stats.attendanceRate}%</p>
                        <p className="text-xs text-muted-foreground">Kehadiran</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Megaphone className="h-4 w-4 text-red-600" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-red-600">{stats.unreadAnnouncements}</p>
                        <p className="text-xs text-muted-foreground">Pengumuman Baru</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Schedule */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Calendar className="h-5 w-5 text-blue-800" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Jadwal Hari Ini</CardTitle>
                                    <CardDescription>
                                        {currentTime.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
                                    </CardDescription>
                                </div>
                            </div>
                            <Link href="/parent/schedule">
                                <Button variant="ghost" size="sm" className="gap-1 text-blue-800">
                                    Lihat Semua
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockTodaySchedule.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "flex items-center gap-4 p-3 rounded-lg",
                                        index === 0 ? "bg-blue-50 border border-blue-200" : "bg-muted/30"
                                    )}
                                >
                                    <div className="text-center min-w-[50px]">
                                        <p className={cn(
                                            "text-sm font-bold",
                                            index === 0 ? "text-blue-800" : "text-muted-foreground"
                                        )}>
                                            {item.time}
                                        </p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.subject}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{item.teacher}</span>
                                            <span>•</span>
                                            <span>{item.room}</span>
                                        </div>
                                    </div>
                                    {index === 0 && (
                                        <Badge className="bg-blue-800 text-white text-xs">Sekarang</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Announcements */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Megaphone className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Pengumuman Terbaru</CardTitle>
                                    <CardDescription>Informasi penting dari sekolah</CardDescription>
                                </div>
                            </div>
                            <Link href="/parent/announcements">
                                <Button variant="ghost" size="sm" className="gap-1 text-blue-800">
                                    Lihat Semua
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockAnnouncements.map((item) => (
                                <Link key={item.id} href="/parent/announcements" className="block">
                                    <div className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className={cn(
                                                        "text-xs",
                                                        item.category === "Penting" ? "bg-red-100 text-red-700 border-red-200" :
                                                            item.category === "Kegiatan" ? "bg-purple-100 text-purple-700 border-purple-200" :
                                                                "bg-amber-100 text-amber-700 border-amber-200"
                                                    )}>
                                                        {item.category}
                                                    </Badge>
                                                    {item.isNew && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                                                </div>
                                                <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground flex-shrink-0">{item.date}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Access */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Star className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Akses Cepat</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/parent/grades">
                            <div className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-center group">
                                <div className="inline-flex p-3 bg-blue-100 rounded-full mb-2 group-hover:bg-blue-200 transition-colors">
                                    <GraduationCap className="h-6 w-6 text-blue-800" />
                                </div>
                                <p className="font-medium text-sm text-blue-800">Nilai Anak</p>
                            </div>
                        </Link>
                        <Link href="/parent/attendance">
                            <div className="p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-center group">
                                <div className="inline-flex p-3 bg-green-100 rounded-full mb-2 group-hover:bg-green-200 transition-colors">
                                    <CheckCircle className="h-6 w-6 text-green-700" />
                                </div>
                                <p className="font-medium text-sm text-green-700">Kehadiran</p>
                            </div>
                        </Link>
                        <Link href="/parent/schedule">
                            <div className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-center group">
                                <div className="inline-flex p-3 bg-purple-100 rounded-full mb-2 group-hover:bg-purple-200 transition-colors">
                                    <Calendar className="h-6 w-6 text-purple-700" />
                                </div>
                                <p className="font-medium text-sm text-purple-700">Jadwal</p>
                            </div>
                        </Link>
                        <Link href="/parent/announcements">
                            <div className="p-4 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors text-center group">
                                <div className="inline-flex p-3 bg-amber-100 rounded-full mb-2 group-hover:bg-amber-200 transition-colors">
                                    <Megaphone className="h-6 w-6 text-amber-700" />
                                </div>
                                <p className="font-medium text-sm text-amber-700">Pengumuman</p>
                            </div>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
