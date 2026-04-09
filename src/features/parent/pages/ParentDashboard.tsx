"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
    Calendar,
    GraduationCap,
    CheckCircle,
    Trophy,
    User,
    ChevronRight,
    TrendingUp,
    AlertTriangle,
    ClipboardList,
    Timer,
    Moon,
    Activity,
    Clock,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useParentDashboard } from '../hooks/useParentDashboard';
import { ErrorState, ChildSelector } from "@/features/shared/components";
import { RefreshCw } from 'lucide-react';

// ==================== SKELETON ====================

const DashboardSkeleton: React.FC = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-9 w-[220px]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-9 w-9 rounded-xl" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-3 w-24" />
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-lg" />
                            <div className="space-y-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {Array.from({ length: 3 }).map((_, j) => (
                            <Skeleton key={j} className="h-16 w-full rounded-xl" />
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);



// ==================== STAT CARD ====================

const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    color: string;
    href: string;
    alert?: boolean;
    badgeColor?: "green" | "amber" | "red";
}> = ({ title, value, subtitle, icon: Icon, color, href, badgeColor }) => {
    const badge = badgeColor ?? (color as "green" | "amber" | "red");
    const badgeClass = {
        green: "bg-green-50 text-green-600 border-green-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        red:   "bg-red-50 text-red-600 border-red-100",
    }[badge] ?? `bg-${color}-50 text-${color}-600 border-${color}-100`;

    return (
    <Link href={href}>
        <div className={cn(
            "group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col",
            `hover:border-${color}-200`
        )}>
            <div className="p-4 flex-1">
                <div className="flex items-center justify-between mb-3">
                    <div className={cn("p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300", `bg-${color}-50`)}>
                        <Icon className={cn("h-5 w-5", `text-${color}-600`)} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{title}</span>
                </div>
                <p className="text-2xl font-bold tabular-nums text-slate-800">{value}</p>
            </div>
            <div className={cn("mx-3 mb-3 px-2.5 py-1 rounded-md border text-[11px] font-medium truncate", badgeClass)}>
                {subtitle}
            </div>
        </div>
    </Link>
    );
};

// ==================== MAIN COMPONENT ====================

export const ParentDashboard: React.FC = () => {
    const {
        data,
        children,
        selectedChildId,
        setSelectedChildId,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useParentDashboard();

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat pagi';
        if (hour < 15) return 'Selamat siang';
        if (hour < 18) return 'Selamat sore';
        return 'Selamat malam';
    }, []);

    if (isLoading) return <DashboardSkeleton />;
    if (error) return <ErrorState error={error} onRetry={refetch} />;
    if (!data) return null;

    const { stats, todaySchedule, topSubjects, bottomSubjects, monthlyAttendance, ekskulSummary, hasWarning } = data;

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
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-2">
                        {greeting}, <span className="font-semibold text-foreground">{data.parentName}</span>
                        {data.child && (
                            <span className="text-slate-500"> · Memantau perkembangan <span className="font-medium text-foreground">{data.child.name}</span> ({data.child.class})</span>
                        )}
                    </p>
                </div>

                {/* Child Selector */}
                <div className="flex items-center gap-2">
                    {isFetching && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span className="hidden sm:inline">Memperbarui...</span>
                        </div>
                    )}
                    <ChildSelector childList={children} selectedChildId={selectedChildId} onSelect={setSelectedChildId} />
                </div>
            </div>

            {/* Warning Banner */}
            {hasWarning && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-800 flex-1">
                        {stats.violationCount >= 3 && `${data.child.name} memiliki ${stats.violationCount} catatan pelanggaran. `}
                        {stats.averageScore < 75 && `Nilai rata-rata di bawah KKM. `}
                        {stats.attendanceRate < 80 && `Tingkat kehadiran rendah (${stats.attendanceRate}%). `}
                        Pantau perkembangan anak Anda.
                    </p>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <StatCard title="Nilai" value={stats.averageScore} subtitle="Rata-rata Akademik" icon={GraduationCap} color="blue" href="/parent/academic/grades"
                    badgeColor={stats.averageScore >= 75 ? "green" : stats.averageScore >= 70 ? "amber" : "red"} />
                <StatCard title="Kehadiran" value={`${stats.attendanceRate}%`} subtitle="Kehadiran Harian" icon={CheckCircle} color="green" href="/parent/attendance/daily"
                    badgeColor={stats.attendanceRate >= 80 ? "green" : stats.attendanceRate >= 75 ? "amber" : "red"} />
                <StatCard title="Pagi" value={stats.lateCount} subtitle="Keterlambatan Pagi" icon={Timer} color="amber" href="/parent/attendance/morning"
                    badgeColor={stats.lateCount <= 5 ? "green" : stats.lateCount <= 10 ? "amber" : "red"} />
                <StatCard title="Ibadah" value={`${stats.prayerRate}%`} subtitle="Keaktifan Sholat" icon={Moon} color="indigo" href="/parent/attendance/prayer"
                    badgeColor={stats.prayerRate >= 85 ? "green" : stats.prayerRate >= 75 ? "amber" : "red"} />
                <StatCard title="Prestasi" value={stats.achievementsCount} subtitle="Penghargaan Siswa" icon={Trophy} color="purple" href="/parent/academic/achievements"
                    badgeColor="green" />
                <StatCard title="Perilaku" value={stats.violationCount} subtitle="Pelanggaran Aktif" icon={ClipboardList} color="rose" href="/parent/behavior"
                    badgeColor={stats.violationCount === 0 ? "green" : stats.violationCount <= 3 ? "amber" : "red"} />
            </div>

            {/* Row: Schedule + Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Schedule */}
                <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Calendar className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">Jadwal Hari Ini</CardTitle>
                                    <CardDescription>
                                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </CardDescription>
                                </div>
                            </div>
                            <Link href="/parent/academic/schedule">
                                <Button variant="ghost" size="sm" className="gap-1 text-blue-700 hover:text-blue-800 hover:bg-blue-50">
                                    Selengkapnya <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        {todaySchedule.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Calendar className="h-8 w-8 text-slate-300 mb-2" />
                                <p className="text-sm text-slate-500">Tidak ada jadwal hari ini</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {todaySchedule.map((item) => (
                                    <div key={item.id} className={cn(
                                        'flex items-center justify-between p-2.5 rounded-lg border',
                                        item.isOngoing
                                            ? 'bg-blue-100/60 border-blue-200'
                                            : 'bg-blue-50/50 border-blue-100'
                                    )}>
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="p-1.5 rounded-md bg-blue-100 shrink-0">
                                                <Calendar className="h-3.5 w-3.5 text-blue-700" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 truncate">{item.subject}</p>
                                                <p className="text-[11px] text-slate-500 mt-0.5">{data.child?.class ?? ''}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm font-medium text-slate-800 shrink-0 tabular-nums ml-2">
                                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                                            {item.time}{item.endTime && ` – ${item.endTime}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Subject Performance */}
                <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">Performa Nilai</CardTitle>
                                    <CardDescription>Tertinggi & terendah semester ini</CardDescription>
                                </div>
                            </div>
                            <Link href="/parent/academic/grades">
                                <Button variant="ghost" size="sm" className="gap-1 text-blue-700 hover:text-blue-800 hover:bg-blue-50">
                                    Semua Nilai <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Tertinggi</p>
                            <div className="space-y-2">
                                {topSubjects.length === 0 ? (
                                    <p className="text-sm text-slate-400 italic text-center py-3">Belum ada data nilai</p>
                                ) : topSubjects.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                                        <span className="text-sm font-medium text-slate-700 truncate">{s.subject}</span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-sm font-bold text-emerald-600">{s.score}</span>
                                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">{s.grade}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">Perlu Perhatian</p>
                            <div className="space-y-2">
                                {bottomSubjects.length === 0 ? (
                                    <p className="text-sm text-slate-400 italic text-center py-3">Belum ada data nilai</p>
                                ) : bottomSubjects.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 border border-amber-100">
                                        <span className="text-sm font-medium text-slate-700 truncate">{s.subject}</span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-sm font-bold text-amber-600">{s.score}</span>
                                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">{s.grade}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Row: Attendance + Ekskul */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Monthly Attendance */}
                <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">Kehadiran Bulan Ini</CardTitle>
                                    <CardDescription>Rekap presensi harian</CardDescription>
                                </div>
                            </div>
                            <Link href="/parent/attendance/daily">
                                <Button variant="ghost" size="sm" className="gap-1 text-green-700 hover:text-green-800 hover:bg-green-50">
                                    Detail <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-3">
                        <div className="flex items-center justify-center mb-3">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-green-600 tabular-nums">{monthlyAttendance.percentage}%</p>
                                <p className="text-sm text-slate-500 mt-0.5">Tingkat Kehadiran</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            <div className="text-center p-3 rounded-xl bg-green-50 border border-green-200">
                                <p className="text-xl font-bold text-green-600 tabular-nums">{monthlyAttendance.hadir}</p>
                                <p className="text-xs text-slate-600 mt-1">Hadir</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-amber-50 border border-amber-200">
                                <p className="text-xl font-bold text-amber-600 tabular-nums">{monthlyAttendance.sakit}</p>
                                <p className="text-xs text-slate-600 mt-1">Sakit</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-200">
                                <p className="text-xl font-bold text-blue-600 tabular-nums">{monthlyAttendance.izin}</p>
                                <p className="text-xs text-slate-600 mt-1">Izin</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-red-50 border border-red-200">
                                <p className={cn("text-xl font-bold tabular-nums", monthlyAttendance.alpa > 0 ? "text-red-600" : "text-slate-400")}>{monthlyAttendance.alpa}</p>
                                <p className="text-xs text-slate-600 mt-1">Alpha</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ekskul Summary */}
                <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Activity className="h-5 w-5 text-purple-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">Ekstrakurikuler</CardTitle>
                                    <CardDescription>Keaktifan kegiatan ekskul</CardDescription>
                                </div>
                            </div>
                            <Link href="/parent/extracurricular">
                                <Button variant="ghost" size="sm" className="gap-1 text-purple-700 hover:text-purple-800 hover:bg-purple-50">
                                    Detail <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-3">
                        {ekskulSummary.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Activity className="h-8 w-8 text-slate-300 mb-2" />
                                <p className="text-sm text-slate-500">Belum ada ekskul yang diikuti</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {ekskulSummary.map(ekskul => (
                                    <div key={ekskul.id} className="p-3 rounded-xl border border-slate-100 hover:border-purple-100 hover:bg-purple-50/30 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-slate-800">{ekskul.name}</span>
                                            <span className={cn("text-sm font-bold tabular-nums",
                                                ekskul.attendanceRate >= 90 ? "text-emerald-600" :
                                                ekskul.attendanceRate >= 75 ? "text-amber-600" : "text-red-600"
                                            )}>{ekskul.attendanceRate}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                                            <div
                                                className={cn("h-1.5 rounded-full transition-all",
                                                    ekskul.attendanceRate >= 90 ? "bg-emerald-500" :
                                                    ekskul.attendanceRate >= 75 ? "bg-amber-500" : "bg-red-500"
                                                )}
                                                style={{ width: `${ekskul.attendanceRate}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Tingkat kehadiran</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
