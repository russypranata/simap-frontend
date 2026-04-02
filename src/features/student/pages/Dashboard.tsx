"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, GraduationCap, CheckCircle, Trophy, User, ChevronRight, AlertTriangle, ClipboardList, MapPin, RefreshCw, Timer, Moon, Activity, Megaphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getStudentDashboardData, type StudentDashboardData } from "../services/studentDashboardService";
import { ErrorState } from "@/features/shared/components";

const DashboardSkeleton = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2"><Skeleton className="h-10 w-64" /><Skeleton className="h-4 w-48" /></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded-xl bg-white border border-slate-100 shadow-sm p-4 space-y-3"><div className="flex items-center justify-between"><Skeleton className="h-9 w-9 rounded-xl" /><Skeleton className="h-3 w-12" /></div><Skeleton className="h-7 w-16" /><Skeleton className="h-3 w-24" /></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => <Card key={i}><CardHeader className="pb-3"><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-lg" /><div className="space-y-1"><Skeleton className="h-5 w-32" /><Skeleton className="h-3 w-48" /></div></div></CardHeader><CardContent className="space-y-3">{Array.from({ length: 3 }).map((_, j) => <Skeleton key={j} className="h-16 w-full rounded-xl" />)}</CardContent></Card>)}
        </div>
    </div>
);

const StatCard: React.FC<{ title: string; value: string | number; subtitle: string; icon: React.ElementType; color: string; href: string; alert?: boolean }> = ({ title, value, subtitle, icon: Icon, color, href, alert }) => (
    <Link href={href}>
        <div className={cn("group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col", `hover:border-${color}-200`)}>
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

export const StudentDashboard: React.FC = () => {
    const [data, setData] = useState<StudentDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        getStudentDashboardData().then(setData).catch(e => setError(e.message)).finally(() => setIsLoading(false));
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const greeting = useMemo(() => {
        const h = currentTime.getHours();
        if (h < 11) return "Selamat pagi";
        if (h < 15) return "Selamat siang";
        if (h < 18) return "Selamat sore";
        return "Selamat malam";
    }, [currentTime]);

    if (isLoading) return <DashboardSkeleton />;
    if (error || !data) return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Dashboard </span>
                    <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Siswa</span>
                </h1>
            </div>
            <ErrorState error={error ?? "Terjadi kesalahan"} onRetry={() => window.location.reload()} />
        </div>
    );

    const { stats, todaySchedule, monthlyAttendance, ekskulSummary, hasWarning } = data;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Dashboard </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Siswa</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-2">
                        {greeting}, <span className="font-semibold text-foreground">{data.studentName}</span>
                        <span className="text-slate-500"> · <span className="font-medium text-foreground">{data.studentClass}</span></span>
                    </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 gap-1 w-fit">
                    <GraduationCap className="h-3.5 w-3.5" />{data.studentClass}
                </Badge>
            </div>

            {/* Warning Banner */}
            {hasWarning && (
                <Card className={cn("border-2", stats.violationCount >= 5 || stats.averageScore < 70 ? "bg-red-50 border-red-300" : "bg-amber-50 border-amber-300")}>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <div className={cn("p-2 rounded-lg", stats.violationCount >= 5 || stats.averageScore < 70 ? "bg-red-100" : "bg-amber-100")}>
                                <AlertTriangle className={cn("h-5 w-5", stats.violationCount >= 5 || stats.averageScore < 70 ? "text-red-600" : "text-amber-600")} />
                            </div>
                            <div className="flex-1">
                                <h3 className={cn("font-semibold", stats.violationCount >= 5 || stats.averageScore < 70 ? "text-red-900" : "text-amber-900")}>Perhatian Diperlukan!</h3>
                                <p className={cn("text-sm mt-1", stats.violationCount >= 5 || stats.averageScore < 70 ? "text-red-800" : "text-amber-800")}>
                                    {stats.violationCount >= 3 && `Kamu memiliki ${stats.violationCount} catatan pelanggaran. `}
                                    {stats.averageScore < 75 && `Nilai rata-rata kamu di bawah KKM. `}
                                    Segera perbaiki dan hubungi Guru BK jika membutuhkan bantuan.
                                </p>
                            </div>
                            <Link href="/student/behavior">
                                <Button variant="outline" size="sm" className="gap-1 text-amber-800 border-amber-300 hover:bg-amber-100">Lihat Detail<ChevronRight className="h-4 w-4" /></Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <StatCard title="Nilai" value={stats.averageScore} subtitle="Rata-rata Akademik" icon={GraduationCap} color="blue" href="/student/grades" />
                <StatCard title="Kehadiran" value={`${stats.attendanceRate}%`} subtitle="Hadir di Sekolah" icon={CheckCircle} color="green" href="/student/attendance/daily" />
                <StatCard title="Pagi" value={stats.lateCount} subtitle="Kali Terlambat" icon={Timer} color="amber" href="/student/attendance/morning" alert={stats.lateCount > 0} />
                <StatCard title="Ibadah" value={`${stats.prayerRate}%`} subtitle="Keaktifan Sholat" icon={Moon} color="indigo" href="/student/attendance/prayer" />
                <StatCard title="Prestasi" value={stats.achievementsCount} subtitle="Penghargaan" icon={Trophy} color="purple" href="/student/achievements" />
                <StatCard title="Perilaku" value={stats.violationCount} subtitle="Pelanggaran Aktif" icon={ClipboardList} color="rose" href="/student/behavior" alert={stats.violationCount > 0} />
            </div>

            {/* Row: Schedule + Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Schedule */}
                <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg"><Calendar className="h-5 w-5 text-blue-700" /></div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">Jadwal Hari Ini</CardTitle>
                                    <CardDescription>{currentTime.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}</CardDescription>
                                </div>
                            </div>
                            <Link href="/student/schedule">
                                <Button variant="ghost" size="sm" className="gap-1 text-blue-700 hover:text-blue-800 hover:bg-blue-50">Selengkapnya<ChevronRight className="h-4 w-4" /></Button>
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
                                {todaySchedule.map(item => (
                                    <div key={item.id} className={cn("group flex items-center gap-4 p-3 rounded-xl border transition-all duration-200", item.isOngoing ? "bg-blue-50/50 border-blue-200" : "bg-white border-slate-100 hover:border-blue-100 hover:shadow-sm")}>
                                        <div className="text-center min-w-[50px] shrink-0">
                                            <p className={cn("text-sm font-bold", item.isOngoing ? "text-blue-700" : "text-slate-600")}>{item.time}</p>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("font-semibold text-sm truncate", item.isOngoing ? "text-blue-900" : "text-slate-800")}>{item.subject}</p>
                                            <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] font-medium text-slate-500">
                                                <span className="flex items-center gap-1.5"><User className="h-3 w-3 opacity-70" />{item.teacher}</span>
                                                <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 opacity-70" />{item.room}</span>
                                            </div>
                                        </div>
                                        {item.isOngoing && <Badge className="bg-blue-100 text-blue-700 border-0 hover:bg-blue-100 px-2 py-0.5 text-[10px]">Berlangsung</Badge>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Attendance */}
                <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="h-5 w-5 text-green-700" /></div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">Kehadiran Bulan Ini</CardTitle>
                                    <CardDescription>Rekap presensi harian</CardDescription>
                                </div>
                            </div>
                            <Link href="/student/attendance/daily">
                                <Button variant="ghost" size="sm" className="gap-1 text-green-700 hover:text-green-800 hover:bg-green-50">Detail<ChevronRight className="h-4 w-4" /></Button>
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
                            {[
                                { label: "Hadir", value: monthlyAttendance.hadir, color: "green" },
                                { label: "Sakit", value: monthlyAttendance.sakit, color: "amber" },
                                { label: "Izin", value: monthlyAttendance.izin, color: "blue" },
                                { label: "Alpha", value: monthlyAttendance.alpa, color: "red" },
                            ].map(({ label, value, color }) => (
                                <div key={label} className={cn("text-center p-3 rounded-xl border", `bg-${color}-50 border-${color}-200`)}>
                                    <p className={cn("text-xl font-bold tabular-nums", `text-${color}-600`)}>{value}</p>
                                    <p className="text-xs text-slate-600 mt-1">{label}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Row: Ekskul + Pengumuman */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Ekskul */}
                <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg"><Activity className="h-5 w-5 text-purple-700" /></div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">Ekstrakurikuler</CardTitle>
                                    <CardDescription>Keaktifan kegiatan ekskul</CardDescription>
                                </div>
                            </div>
                            <Link href="/student/extracurricular">
                                <Button variant="ghost" size="sm" className="gap-1 text-purple-700 hover:text-purple-800 hover:bg-purple-50">Detail<ChevronRight className="h-4 w-4" /></Button>
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
                                            <span className={cn("text-sm font-bold tabular-nums", ekskul.attendanceRate >= 90 ? "text-emerald-600" : ekskul.attendanceRate >= 75 ? "text-amber-600" : "text-red-600")}>{ekskul.attendanceRate}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                                            <div className={cn("h-1.5 rounded-full transition-all", ekskul.attendanceRate >= 90 ? "bg-emerald-500" : ekskul.attendanceRate >= 75 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${ekskul.attendanceRate}%` }} />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Tingkat kehadiran</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pengumuman */}
                <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg"><Megaphone className="h-5 w-5 text-amber-600" /></div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">Pengumuman Terbaru</CardTitle>
                                    <CardDescription>Informasi penting dari sekolah</CardDescription>
                                </div>
                            </div>
                            <Link href="/student/announcements">
                                <Button variant="ghost" size="sm" className="gap-1 text-amber-700 hover:text-amber-800 hover:bg-amber-50">Lihat Semua<ChevronRight className="h-4 w-4" /></Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-3">
                        <div className="space-y-3">
                            {[
                                { id: 1, title: "Jadwal Ujian Akhir Semester Ganjil 2025/2026", category: "Penting", date: "10 Jan", isNew: true },
                                { id: 2, title: "Libur Semester Ganjil 2025/2026", category: "Jadwal", date: "9 Jan", isNew: true },
                                { id: 3, title: "Pendaftaran Lomba OSN 2026", category: "Akademik", date: "8 Jan", isNew: false },
                            ].map(item => (
                                <Link key={item.id} href="/student/announcements" className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className={cn("text-xs", item.category === "Penting" ? "bg-red-100 text-red-700 border-red-200" : item.category === "Akademik" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-amber-100 text-amber-700 border-amber-200")}>{item.category}</Badge>
                                                {item.isNew && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                                            </div>
                                            <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground shrink-0">{item.date}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
