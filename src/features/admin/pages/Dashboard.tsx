'use client';


import React, { useMemo } from 'react';
import Link from 'next/link';
import {
    Shield, Calendar, GraduationCap, Users, School,
    UserCheck, ArrowLeftRight, UserPlus, ChevronRight,
    RefreshCw, Activity, AlertTriangle, BookOpen,
    CheckCircle2, ClipboardList, Award, ArrowRight,
} from 'lucide-react';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { ErrorState } from '@/features/shared/components';
import { useBreadcrumbAction } from '@/context/BreadcrumbActionContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 11) return 'Selamat pagi';
    if (h < 15) return 'Selamat siang';
    if (h < 18) return 'Selamat sore';
    return 'Selamat malam';
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const DashboardSkeleton: React.FC = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-52" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        </div>
    </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

type BadgeColor = 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'emerald' | 'rose';

const BADGE_CLASSES: Record<BadgeColor, string> = {
    blue:    'bg-blue-50 text-blue-600 border-blue-100',
    green:   'bg-green-50 text-green-600 border-green-100',
    amber:   'bg-amber-50 text-amber-600 border-amber-100',
    red:     'bg-red-50 text-red-600 border-red-100',
    purple:  'bg-purple-50 text-purple-600 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose:    'bg-rose-50 text-rose-600 border-rose-100',
};

const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    color: BadgeColor;
    href: string;
    alert?: boolean;
}> = ({ title, value, subtitle, icon: Icon, color, href, alert }) => (
    <Link href={href}>
        <div className={cn(
            'group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm',
            'transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col',
            alert ? 'border-amber-200' : `hover:border-${color}-200`
        )}>
            {alert && (
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            )}
            <div className="p-4 flex-1">
                <div className="flex items-center justify-between mb-3">
                    <div className={cn('p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300', `bg-${color}-50`)}>
                        <Icon className={cn('h-5 w-5', `text-${color}-600`)} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{title}</span>
                </div>
                <p className="text-2xl font-bold tabular-nums text-slate-800">{value}</p>
            </div>
            <div className={cn('mx-3 mb-3 px-2.5 py-1 rounded-md border text-[11px] font-medium truncate', BADGE_CLASSES[color])}>
                {subtitle}
            </div>
        </div>
    </Link>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const AdminDashboard: React.FC = () => {
    const { setAction, clearAction } = useBreadcrumbAction();
    const { data, isLoading, isFetching, isError, refetch } = useAdminDashboard();
    const greeting = useMemo(() => getGreeting(), []);

    React.useEffect(() => {
        if (isFetching && !isLoading) {
            setAction(
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden sm:inline">Memperbarui...</span>
                </div>
            );
        } else {
            clearAction();
        }
        return () => clearAction();
    }, [isFetching, isLoading, setAction, clearAction]);

    if (isLoading) return <DashboardSkeleton />;
    if (isError) return <ErrorState error="Gagal memuat data dashboard." onRetry={refetch} />;
    if (!data) return null;

    const { stats, pending_actions, ekskul_summary, class_distribution, avg_students_per_class, academic_year } = data;

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Dashboard </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Admin</span>
                        </h1>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Shield className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-2">
                        {greeting}, <span className="font-semibold text-foreground">Administrator</span>
                        {academic_year && (
                            <span className="text-slate-500"> · Tahun Ajaran <span className="font-medium text-foreground">{academic_year.name}</span></span>
                        )}
                    </p>
                </div>
                {academic_year && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 w-fit shrink-0">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-semibold">TA. {academic_year.name}</span>
                    </div>
                )}
            </div>

            {/* ── 6 Stat Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard
                    title="Siswa"
                    value={stats.total_students}
                    subtitle={`${stats.enrolled_this_year} terdaftar TA ini`}
                    icon={GraduationCap}
                    color="blue"
                    href="/admin/users/students"
                />
                <StatCard
                    title="Guru / PTK"
                    value={stats.total_teachers}
                    subtitle="Pendidik & tenaga kependidikan"
                    icon={Users}
                    color="emerald"
                    href="/admin/users/teachers"
                />
                <StatCard
                    title="Kelas"
                    value={stats.total_classes}
                    subtitle={stats.classes_without_homeroom > 0
                        ? `${stats.classes_without_homeroom} tanpa wali kelas`
                        : 'Semua ada wali kelas'}
                    icon={School}
                    color={stats.classes_without_homeroom > 0 ? 'amber' : 'blue'}
                    href="/admin/class"
                    alert={stats.classes_without_homeroom > 0}
                />
                <StatCard
                    title="Hadir Pagi"
                    value={stats.morning_rate !== null ? `${stats.morning_rate}%` : '—'}
                    subtitle={stats.morning_hadir > 0
                        ? `${stats.morning_hadir} dari ${stats.morning_total_active} siswa`
                        : 'Belum ada data hari ini'}
                    icon={UserCheck}
                    color={
                        stats.morning_rate === null ? 'blue'
                        : stats.morning_rate >= 90 ? 'green'
                        : stats.morning_rate >= 75 ? 'amber'
                        : 'red'
                    }
                    href="/admin/attendance"
                />
                <StatCard
                    title="PPDB"
                    value={stats.ppdb_total}
                    subtitle={stats.ppdb_pending > 0
                        ? `${stats.ppdb_pending} menunggu review`
                        : 'Semua sudah diproses'}
                    icon={UserPlus}
                    color={stats.ppdb_pending > 0 ? 'amber' : 'blue'}
                    href="/admin/users/ppdb"
                    alert={stats.ppdb_pending > 0}
                />
                <StatCard
                    title="Mutasi"
                    value={stats.mutation_pending}
                    subtitle={stats.mutation_pending > 0
                        ? 'Menunggu persetujuan'
                        : 'Tidak ada yang pending'}
                    icon={ArrowLeftRight}
                    color={stats.mutation_pending > 0 ? 'rose' : 'blue'}
                    href="/admin/users/mutation"
                    alert={stats.mutation_pending > 0}
                />
            </div>

            {/* ── Main Content: 2/3 + 1/3 ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Kolom Kiri (2/3) ── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Presensi Pagi Hari Ini */}
                    <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                        <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <UserCheck className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg text-slate-800">Presensi Pagi Hari Ini</CardTitle>
                                        <CardDescription>
                                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Link href="/admin/attendance">
                                    <Button variant="ghost" size="sm" className="gap-1 text-green-700 hover:text-green-800 hover:bg-green-50">
                                        Detail <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {stats.morning_hadir === 0 && stats.morning_rate === null ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <UserCheck className="h-8 w-8 text-slate-300 mb-2" />
                                    <p className="text-sm text-slate-500">Belum ada data presensi hari ini</p>
                                    <p className="text-xs text-slate-400 mt-1">Data akan muncul setelah siswa melakukan presensi pagi</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-6">
                                    {/* Rate besar di kiri */}
                                    <div className="text-center shrink-0">
                                        <p className={cn(
                                            'text-5xl font-bold tabular-nums',
                                            stats.morning_rate !== null && stats.morning_rate >= 90 ? 'text-green-600' :
                                            stats.morning_rate !== null && stats.morning_rate >= 75 ? 'text-amber-600' :
                                            'text-red-600'
                                        )}>
                                            {stats.morning_rate !== null ? `${stats.morning_rate}%` : '—'}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1">Tingkat Kehadiran</p>
                                    </div>
                                    {/* Divider */}
                                    <div className="h-16 w-px bg-slate-200 shrink-0" />
                                    {/* Breakdown */}
                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                                            <div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold text-green-700 tabular-nums">{stats.morning_hadir}</p>
                                                <p className="text-xs text-slate-600">Hadir</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                                            <div className="h-9 w-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold text-red-600 tabular-nums">{stats.morning_tidak_hadir}</p>
                                                <p className="text-xs text-slate-600">Tidak Hadir</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Distribusi Siswa per Kelas */}
                    <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                        <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <School className="h-5 w-5 text-blue-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg text-slate-800">Distribusi Siswa per Kelas</CardTitle>
                                        <CardDescription>
                                            Rata-rata {avg_students_per_class} siswa per kelas · {stats.total_classes} kelas aktif
                                        </CardDescription>
                                    </div>
                                </div>
                                <Link href="/admin/class">
                                    <Button variant="ghost" size="sm" className="gap-1 text-blue-700 hover:text-blue-800 hover:bg-blue-50">
                                        Kelola <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {class_distribution.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <School className="h-8 w-8 text-slate-300 mb-2" />
                                    <p className="text-sm text-slate-500">Belum ada data kelas</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {class_distribution.slice(0, 10).map((c) => {
                                        const maxCount = Math.max(...class_distribution.map(x => x.count), 1);
                                        const pct = Math.round((c.count / maxCount) * 100);
                                        const isLow = c.count < avg_students_per_class * 0.7;
                                        const isHigh = c.count > avg_students_per_class * 1.3;
                                        return (
                                            <div key={c.class} className="flex items-center gap-3">
                                                <span className="text-xs font-medium text-slate-600 w-14 shrink-0">{c.class}</span>
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            'h-full rounded-full transition-all duration-500',
                                                            isHigh ? 'bg-amber-400' : isLow ? 'bg-slate-300' : 'bg-blue-400'
                                                        )}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className={cn(
                                                    'text-xs font-semibold w-6 text-right shrink-0',
                                                    isHigh ? 'text-amber-600' : isLow ? 'text-slate-400' : 'text-slate-700'
                                                )}>{c.count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ── Kolom Kanan (1/3) ── */}
                <div className="space-y-6">

                    {/* Tindakan Diperlukan */}
                    <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                        <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <ClipboardList className="h-5 w-5 text-amber-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">Perlu Tindakan</CardTitle>
                                    <CardDescription>Item yang membutuhkan perhatian</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {pending_actions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
                                    <p className="text-sm font-medium text-slate-700">Semua beres!</p>
                                    <p className="text-xs text-slate-400 mt-1">Tidak ada item yang perlu ditindaklanjuti</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {pending_actions.map((action) => {
                                        const colorMap = {
                                            amber: 'bg-amber-50 border-amber-200 text-amber-800',
                                            blue:  'bg-blue-50 border-blue-200 text-blue-800',
                                            red:   'bg-red-50 border-red-200 text-red-800',
                                            green: 'bg-green-50 border-green-200 text-green-800',
                                        };
                                        const badgeMap = {
                                            amber: 'bg-amber-100 text-amber-700 border-amber-200',
                                            blue:  'bg-blue-100 text-blue-700 border-blue-200',
                                            red:   'bg-red-100 text-red-700 border-red-200',
                                            green: 'bg-green-100 text-green-700 border-green-200',
                                        };
                                        return (
                                            <Link key={action.type} href={action.href}>
                                                <div className={cn(
                                                    'flex items-center justify-between p-3 rounded-lg border',
                                                    'hover:shadow-sm transition-all cursor-pointer',
                                                    colorMap[action.color]
                                                )}>
                                                    <p className="text-sm font-medium leading-snug flex-1 mr-2">{action.label}</p>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <Badge variant="outline" className={cn('text-xs font-bold', badgeMap[action.color])}>
                                                            {action.count}
                                                        </Badge>
                                                        <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Ringkasan Ekskul */}
                    <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                        <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Activity className="h-5 w-5 text-purple-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg text-slate-800">Ekskul</CardTitle>
                                        <CardDescription>Ringkasan kegiatan ekskul</CardDescription>
                                    </div>
                                </div>
                                <Link href="/admin/extracurricular">
                                    <Button variant="ghost" size="sm" className="gap-1 text-purple-700 hover:text-purple-800 hover:bg-purple-50">
                                        Kelola <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-3 rounded-xl bg-purple-50 border border-purple-100">
                                    <p className="text-2xl font-bold text-purple-700 tabular-nums">{ekskul_summary.total_ekskul}</p>
                                    <p className="text-xs text-slate-600 mt-1">Ekskul Aktif</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                                    <p className="text-2xl font-bold text-indigo-700 tabular-nums">{ekskul_summary.total_members}</p>
                                    <p className="text-xs text-slate-600 mt-1">Total Anggota</p>
                                </div>
                            </div>
                            {ekskul_summary.avg_rate !== null && (
                                <div className="p-3 rounded-xl border border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-slate-600">Rata-rata Kehadiran (30 hari)</span>
                                        <span className={cn(
                                            'text-sm font-bold tabular-nums',
                                            ekskul_summary.avg_rate >= 80 ? 'text-emerald-600' :
                                            ekskul_summary.avg_rate >= 60 ? 'text-amber-600' : 'text-red-600'
                                        )}>
                                            {ekskul_summary.avg_rate}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                'h-full rounded-full transition-all duration-500',
                                                ekskul_summary.avg_rate >= 80 ? 'bg-emerald-400' :
                                                ekskul_summary.avg_rate >= 60 ? 'bg-amber-400' : 'bg-red-400'
                                            )}
                                            style={{ width: `${ekskul_summary.avg_rate}%` }}
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1.5">
                                        Dari {ekskul_summary.sessions_count} sesi terakhir
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Akses Cepat */}
                    <Card className="border-slate-100 shadow-sm overflow-hidden gap-0">
                        <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">Akses Cepat</CardTitle>
                                    <CardDescription>Halaman yang sering digunakan</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-1.5">
                                {([
                                    { label: 'Data Siswa',        icon: GraduationCap,  href: '/admin/users/students',  color: 'blue' },
                                    { label: 'Data PTK',          icon: Users,          href: '/admin/users/teachers',  color: 'emerald' },
                                    { label: 'Manajemen Kelas',   icon: School,         href: '/admin/class',           color: 'indigo' },
                                    { label: 'Penempatan Kelas',  icon: UserCheck,      href: '/admin/class/placement', color: 'amber' },
                                    { label: 'Kenaikan Kelas',    icon: CheckCircle2,   href: '/admin/class/promotion', color: 'green' },
                                    { label: 'Kalender Akademik', icon: Calendar,       href: '/admin/academic-calendar', color: 'rose' },
                                    { label: 'Manajemen Ekskul',  icon: Award,          href: '/admin/extracurricular', color: 'purple' },
                                ] as const).map(({ label, icon: Icon, href, color }) => (
                                    <Link key={href} href={href}>
                                        <div className={cn(
                                            'flex items-center gap-2.5 px-3 py-2.5 rounded-lg',
                                            'hover:bg-slate-50 transition-colors group cursor-pointer'
                                        )}>
                                            <div className={cn('p-1.5 rounded-md shrink-0', `bg-${color}-50`)}>
                                                <Icon className={cn('h-3.5 w-3.5', `text-${color}-600`)} />
                                            </div>
                                            <span className="text-sm text-slate-600 group-hover:text-slate-900 flex-1">{label}</span>
                                            <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
