"use client";

import React from "react";
import {
    Calendar,
    Users,
    CheckCircle,
    Clock,
    TrendingUp,
    Award,
    ClipboardList,
    ArrowRight,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { advisorService } from "../services/advisorService";
import { DashboardSkeleton } from "../components/AdvisorSkeletons";



export const ExtracurricularDashboard: React.FC = () => {
    const router = useRouter();
    const [stats, setStats] = React.useState({
        totalMembers: 0,
        lastAttendancePresent: 0,
        averageAttendance: 0,
        totalMeetings: 0,
    });
    const [upcomingSchedules, setUpcomingSchedules] = React.useState<any[]>([]);
    const [recentActivities, setRecentActivities] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [advisorName, setAdvisorName] = React.useState("Tutor Ekskul");

    // Fetch initial data
    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, scheduleData, activitiesData, profileData] = await Promise.all([
                    advisorService.getDashboardStats(),
                    advisorService.getUpcomingSchedule(),
                    advisorService.getRecentActivities(),
                    advisorService.getProfile() // To get name and extracurricular info if needed
                ]);

                setStats(statsData);
                setUpcomingSchedules(scheduleData);
                setRecentActivities(activitiesData);
                setAdvisorName(profileData.name);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Tutor Ekskul</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Selamat datang, {advisorName}
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

                <div className="flex items-center gap-2">
                    <Button
                        className="bg-blue-800 hover:bg-blue-900 text-white"
                        onClick={() => router.push("/extracurricular-advisor/attendance")}
                    >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Isi Presensi
                    </Button>
                </div>
            </div>

            {/* Extracurricular Info + Stats Card */}
            <Card className="overflow-hidden p-0">
                {/* Header Section with Decorative Pattern */}
                <div className="bg-blue-800 p-5 relative overflow-hidden">
                    {/* Decorative Geometric Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Award className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Pramuka</h2>
                                <p className="text-blue-100 text-sm">Tutor: {advisorName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                Jumat, 14:00 - 16:00
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <CardContent className="p-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
                        {/* Total Anggota */}
                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-blue-100 rounded-full mb-2">
                                <Users className="h-5 w-5 text-blue-800" />
                            </div>
                            <p className="text-2xl font-bold text-blue-800">{stats.totalMembers}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Anggota</p>
                        </div>

                        {/* Kehadiran Terakhir */}
                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-green-100 rounded-full mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">{stats.lastAttendancePresent}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Hadir Terakhir</p>
                        </div>

                        {/* Rata-rata Kehadiran */}
                        <div className="p-3 text-center">
                            <div className={cn(
                                "inline-flex p-2.5 rounded-full mb-2",
                                stats.averageAttendance >= 90 ? "bg-green-100" :
                                    stats.averageAttendance >= 75 ? "bg-yellow-100" : "bg-red-100"
                            )}>
                                <TrendingUp className={cn(
                                    "h-5 w-5",
                                    stats.averageAttendance >= 90 ? "text-green-600" :
                                        stats.averageAttendance >= 75 ? "text-yellow-600" : "text-red-600"
                                )} />
                            </div>
                            <p className={cn(
                                "text-2xl font-bold",
                                stats.averageAttendance >= 90 ? "text-green-600" :
                                    stats.averageAttendance >= 75 ? "text-yellow-600" : "text-red-600"
                            )}>{stats.averageAttendance}%</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Kehadiran</p>
                        </div>

                        {/* Total Pertemuan */}
                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-purple-100 rounded-full mb-2">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-600">{stats.totalMeetings}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Pertemuan</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Schedule Info */}
                <Card>
                    <CardHeader className="pb-0">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Jadwal Kegiatan
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    Jadwal rutin ekstrakurikuler Pramuka
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="relative ml-3">
                            {/* Timeline Line */}
                            <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-blue-300" />

                            {/* Jadwal Rutin */}
                            <div className="relative pl-6 pb-3">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-800 -ml-1" />
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 border border-dashed border-blue-800">
                                    <div className="p-2.5 rounded-full bg-blue-100 border border-blue-800">
                                        <Clock className="h-5 w-5 text-blue-800" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-blue-800 font-medium">Jadwal Rutin</p>
                                        <p className="font-semibold text-blue-900">Jumat, 14:00 - 16:00</p>
                                    </div>
                                </div>
                            </div>

                            {/* Jadwal Berikutnya */}
                            {upcomingSchedules.length > 0 && (
                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-800 -ml-1" />
                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 border border-blue-800/20">
                                        <div className="p-2.5 rounded-full bg-blue-100">
                                            <Calendar className="h-5 w-5 text-blue-800" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-blue-800 font-medium">Pertemuan Berikutnya</p>
                                            <p className="font-semibold text-blue-900">{upcomingSchedules[0].day}, {upcomingSchedules[0].date}</p>
                                        </div>
                                        <p className="text-sm font-medium text-blue-900">{upcomingSchedules[0].time}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <ClipboardList className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Presensi Siswa
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Kehadiran 3 pertemuan terakhir
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary"
                                onClick={() => router.push("/extracurricular-advisor/attendance?tab=history")}
                            >
                                Lihat Semua
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-2">
                            {recentActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    onClick={() => router.push(`/extracurricular-advisor/attendance/${activity.id}`)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                                        "hover:scale-[1.02]",
                                        activity.attendance >= 90
                                            ? "bg-green-50 border-green-200 hover:bg-green-100/80 hover:border-green-300"
                                            : activity.attendance >= 75
                                                ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100/80 hover:border-yellow-300"
                                                : "bg-red-50 border-red-200 hover:bg-red-100/80 hover:border-red-300"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-full",
                                            activity.attendance >= 90
                                                ? "bg-green-100 text-green-600"
                                                : activity.attendance >= 75
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-red-100 text-red-600"
                                        )}>
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className={cn(
                                                "font-medium text-sm",
                                                activity.attendance >= 90
                                                    ? "text-green-900"
                                                    : activity.attendance >= 75
                                                        ? "text-yellow-900"
                                                        : "text-red-900"
                                            )}>{activity.day}, {activity.date}</p>
                                            <p className={cn(
                                                "text-xs",
                                                activity.attendance >= 90
                                                    ? "text-green-700"
                                                    : activity.attendance >= 75
                                                        ? "text-yellow-700"
                                                        : "text-red-700"
                                            )}>{activity.time}</p>
                                        </div>
                                    </div>
                                    <Badge
                                        className={cn(
                                            activity.attendance >= 90
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : activity.attendance >= 75
                                                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                    : "bg-red-100 text-red-700 border-red-200"
                                        )}
                                    >
                                        {activity.attendance}%
                                    </Badge>
                                </div>
                            ))}
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
                            <p className="text-sm font-semibold text-blue-800">Tips untuk Tutor</p>
                            <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
                                <li>Isi presensi siswa dan tutor setiap ada kegiatan ekstrakurikuler</li>
                                <li>Pantau kehadiran anggota untuk memastikan partisipasi aktif</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
