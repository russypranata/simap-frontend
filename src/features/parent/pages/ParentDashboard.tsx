"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
    Calendar,
    GraduationCap,
    Clock,
    CheckCircle,
    Trophy,
    User,
    ChevronRight,
    TrendingUp,
    AlertTriangle,
    ClipboardList,
    MapPin,
    Timer,
    Moon,
    Activity,
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
}> = ({ title, value, subtitle, icon: Icon, color, href, alert }) => (
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
                    {alert ? (
                        <span className="flex items-center gap-1">
                            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", `bg-${color}-500`)} />
                            <span className={cn("text-[10px] font-semibold", `text-${color}-600`)}>Cek</span>
                        </span>
                    ) : (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{title}</span>
                    )}
                </div>
                <p className={cn("text-2xl font-bold tabular-nums", alert ? `text-${color}-600` : "text-slate-800")}>{value}</p>
            </div>
            <div className={cn("mx-3 mb-3 px-2.5 py-1 rounded-md border text-[11px] font-medium truncate", `bg-${color}-50 text-${color}-600 border-${color}-100`)}>
                {subtitle}
            </div>
        </div>
    </Link>
);

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
                <ChildSelector children={children} selectedChildId={selectedChildId} onSelect={setSelectedChildId} />
            </div>

            {/* Warning Banner */}
            {hasWarning && (
                <Card className={cn('border-2', stats.violationCount >= 5 || stats.averageScore < 70 ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300')}>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <div className={cn('p-2 rounded-lg', stats.violationCount >= 5 || stats.averageScore < 70 ? 'bg-red-100' : 'bg-amber-100')}>
                                <AlertTriangle className={cn('h-5 w-5', stats.violationCount >= 5 || stats.averageScore < 70 ? 'text-red-600' : 'text-amber-600')} />
                            </div>
                            <div className="flex-1">
                                <h3 className={cn('font-semibold', stats.violationCount >= 5 || stats.averageScore < 70 ? 'text-red-900' : 'text-amber-900')}>
                                    Perhatian Diperlukan untuk {data.child.name}!
                                </h3>
                                <p className={cn('text-sm mt-1', stats.violationCount >= 5 || stats.averageScore < 70 ? 'text-red-800' : 'text-amber-800')}>
                                    {stats.violationCount >= 3 && `Anak Anda memiliki ${stats.violationCount} catatan pelanggaran. `}
                                    {stats.averageScore < 75 && `Nilai rata-rata di bawah KKM. `}
                                    Mohon pantau perkembangan dan hubungi Wali Kelas jika diperlukan.
                                </p>
                            </div>
                            <Link href="/parent/behavior">
                                <Button variant="outline" size="sm" className="gap-1 text-amber-800 border-amber-300 hover:bg-amber-100">
                                    Lihat Detail <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <StatCard title="Nilai" value={stats.averageScore} subtitle="Rata-rata Akademik" icon={GraduationCap} color="blue" href="/parent/academic/grades" />
                <StatCard title="Kehadiran" value={`${stats.attendanceRate}%`} subtitle="Hadir di Sekolah" icon={CheckCircle} color="green" href="/parent/attendance/daily" />
                <StatCard title="Pagi" value={stats.lateCount} subtitle="Kali Terlambat" icon={Timer} color="amber" href="/parent/attendance/morning" alert={stats.lateCount > 0} />
                <StatCard title="Ibadah" value={`${stats.prayerRate}%`} subtitle="Keaktifan Sholat" icon={Moon} color="indigo" href="/parent/attendance/prayer" />
                <StatCard title="Prestasi" value={stats.achievementsCount} subtitle="Penghargaan Siswa" icon={Trophy} color="purple" href="/parent/academic/achievements" />
                <StatCard title="Perilaku" value={stats.violationCount} subtitle="Pelanggaran Aktif" icon={ClipboardList} color="rose" href="/parent/behavior" alert={stats.violationCount > 0} />
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
                    <CardContent className="p-3 pt-3">
                        {todaySchedule.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Calendar className="h-8 w-8 text-slate-300 mb-2" />
                                <p className="text-sm text-slate-500">Tidak ada jadwal hari ini</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {todaySchedule.map((item, index) => (
                                    <div key={item.id} className={cn(
                                        'group flex items-center gap-4 p-3 rounded-xl border transition-all duration-200',
                                        item.isOngoing ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-100 hover:border-blue-100 hover:shadow-sm'
                                    )}>
                                        <div className="text-center min-w-[50px] shrink-0">
                                            <p className={cn('text-sm font-bold', item.isOngoing ? 'text-blue-700' : 'text-slate-600')}>{item.time}</p>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn('font-semibold text-sm truncate', item.isOngoing ? 'text-blue-900' : 'text-slate-800')}>{item.subject}</p>
                                            <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] font-medium text-slate-500">
                                                <span className="flex items-center gap-1.5"><User className="h-3 w-3 opacity-70" />{item.teacher}</span>
                                                <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 opacity-70" />{item.room}</span>
                                            </div>
                                        </div>
                                        {item.isOngoing && (
                                            <Badge className="bg-blue-100 text-blue-700 border-0 hover:bg-blue-100 px-2 py-0.5 text-[10px]">Berlangsung</Badge>
                                        )}
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
                    <CardContent className="p-3 pt-3 space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Tertinggi</p>
                            <div className="space-y-2">
                                {topSubjects.map((s, i) => (
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
                                {bottomSubjects.map((s, i) => (
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
