"use client";

import React from "react";
import { Calendar, Users, CheckCircle, TrendingUp, Award, ClipboardList, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAdvisorDashboard } from "../hooks/useAdvisorDashboard";
import { ScheduleCard, RecentActivitiesCard } from "../components/dashboard";
import {
    PageHeader,
    StatCard,
    SkeletonPageHeader,
    SkeletonStatCard,
} from "@/features/shared/components";

// ==================== SKELETON ====================
const CardSkeleton: React.FC = () => (
    <Card>
        <div className="p-6 pb-3">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-100 animate-pulse" />
                <div className="space-y-1.5">
                    <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
                </div>
            </div>
        </div>
        <CardContent className="space-y-3">
            {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="h-16 w-full rounded-lg bg-slate-100 animate-pulse" />
            ))}
        </CardContent>
    </Card>
);

// ==================== MAIN ====================
export const ExtracurricularDashboard: React.FC = () => {
    const router = useRouter();
    const { stats, upcomingSchedules, recentActivities, advisorName, extracurricularName, isLoading, isStatsLoading } = useAdvisorDashboard();

    if (isLoading && !advisorName) return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <SkeletonPageHeader withAction />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </div>
    );

    const attendanceColor =
        stats.averageAttendance >= 90 ? "green" :
        stats.averageAttendance >= 75 ? "amber" : "red" as const;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                titleHighlight="Tutor Ekstrakurikuler"
                icon={Award}
                description={`Selamat datang, ${advisorName}`}
            >
                <Button
                    className="bg-blue-800 hover:bg-blue-900 text-white"
                    onClick={() => router.push("/extracurricular-advisor/attendance")}
                >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Isi Presensi
                </Button>
            </PageHeader>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard title="Total Anggota" value={isStatsLoading ? "..." : stats.totalMembers} subtitle="Anggota aktif" icon={Users} color="blue" />
                <StatCard title="Hadir Terakhir" value={isStatsLoading ? "..." : stats.lastAttendancePresent} subtitle="Pertemuan lalu" icon={CheckCircle} color="green" />
                <StatCard title="Rata-rata Kehadiran" value={isStatsLoading ? "..." : `${stats.averageAttendance}%`} subtitle="Tahun ajaran ini" icon={TrendingUp} color={attendanceColor} />
                <StatCard title="Total Pertemuan" value={isStatsLoading ? "..." : stats.totalMeetings} subtitle="Kegiatan tercatat" icon={Calendar} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                ) : (
                    <>
                        <ScheduleCard upcomingSchedules={upcomingSchedules} extracurricularName={extracurricularName} />
                        <RecentActivitiesCard recentActivities={recentActivities} />
                    </>
                )}
            </div>

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
