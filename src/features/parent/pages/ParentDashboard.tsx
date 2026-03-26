"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Calendar,
    Award,
    GraduationCap,
    Clock,
    CheckCircle,
    Trophy,
    Megaphone,
    User,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    MapPin,
    AlertTriangle,
    ClipboardList,
    BookOpen,
    Activity,
    XCircle,
    AlertCircle,
    Star,
    Minus,
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
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { getParentProfile } from '@/features/parent/services/parentProfileService';
import { mockParentProfile } from '@/features/parent/data/mockParentData';

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

interface SubjectScore {
    subject: string;
    score: number;
    grade: string;
}

interface MonthlyAttendance {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
    totalSchoolDays: number;
}

interface EkskulSummary {
    id: number;
    name: string;
    category: string;
    schedule: string;
    attendanceRate: number;
    achievements: number;
}

// Mock data
const mockTodaySchedule: TodayScheduleItem[] = [
    {
        id: 1,
        time: '07:00',
        subject: 'Biologi',
        teacher: 'Bu Ani',
        room: 'Lab Biologi',
    },
    {
        id: 2,
        time: '08:30',
        subject: 'Matematika',
        teacher: 'Pak Ahmad',
        room: 'XII IPA 1',
    },
    {
        id: 3,
        time: '09:30',
        subject: 'Bahasa Indonesia',
        teacher: 'Bu Dewi',
        room: 'XII IPA 1',
    },
    { id: 4, time: '10:15', subject: 'BK', teacher: 'Bu Linda', room: 'R. BK' },
];

const mockAnnouncements: RecentAnnouncement[] = [
    {
        id: 1,
        title: 'Jadwal Ujian Akhir Semester Ganjil 2025/2026',
        category: 'Penting',
        date: '10 Jan',
        isNew: true,
    },
    {
        id: 2,
        title: 'Undangan Rapat Orang Tua Wali Murid',
        category: 'Umum',
        date: '9 Jan',
        isNew: true,
    },
    {
        id: 3,
        title: 'Laporan Perkembangan Akademik Tengah Semester',
        category: 'Akademik',
        date: '8 Jan',
        isNew: false,
    },
];

const mockSubjectScores: SubjectScore[] = [
    { subject: 'Pendidikan Agama', score: 93, grade: 'A' },
    { subject: 'Biologi', score: 90, grade: 'A' },
    { subject: 'TIK', score: 90, grade: 'A' },
    { subject: 'Seni Budaya', score: 88, grade: 'A-' },
    { subject: 'Bahasa Inggris', score: 86, grade: 'A-' },
    { subject: 'PJOK', score: 86, grade: 'A-' },
    { subject: 'Matematika', score: 85, grade: 'A-' },
    { subject: 'Kimia', score: 84, grade: 'A-' },
    { subject: 'PKn', score: 82, grade: 'B+' },
    { subject: 'Prakarya', score: 81, grade: 'B+' },
    { subject: 'Fisika', score: 80, grade: 'B+' },
    { subject: 'Bahasa Indonesia', score: 80, grade: 'B+' },
    { subject: 'Sejarah', score: 78, grade: 'B' },
];

const mockMonthlyAttendance: MonthlyAttendance = {
    hadir: 19,
    sakit: 1,
    izin: 1,
    alpa: 0,
    totalSchoolDays: 21,
};

const mockEkskulSummary: EkskulSummary[] = [
    {
        id: 1,
        name: 'Pramuka',
        category: 'Kepramukaan',
        schedule: 'Jumat, 14:00-16:00',
        attendanceRate: 92,
        achievements: 3,
    },
    {
        id: 2,
        name: 'Basket',
        category: 'Olahraga',
        schedule: 'Selasa & Kamis, 15:00-17:00',
        attendanceRate: 88,
        achievements: 1,
    },
];

// Helper
const getScoreBarColor = (score: number): string => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 75) return 'bg-amber-500';
    return 'bg-red-500';
};

const getAttendanceRateColor = (rate: number): string => {
    if (rate >= 90) return 'text-emerald-600';
    if (rate >= 75) return 'text-amber-600';
    return 'text-red-600';
};

export const ParentDashboard: React.FC = () => {
    const [userName, setUserName] = useState<string>('Orang Tua');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const profile = await getParentProfile();
                if (profile && profile.name) {
                    setUserName(profile.name);
                }
            } catch (error) {
                console.error(
                    'Failed to fetch user name for dashboard:',
                    error,
                );
            }
        };
        fetchUserName();

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const greeting = useMemo(() => {
        const hour = currentTime.getHours();
        if (hour < 11) return 'Selamat pagi';
        if (hour < 15) return 'Selamat siang';
        if (hour < 18) return 'Selamat sore';
        return 'Selamat malam';
    }, [currentTime]);

    // Mock stats
    const stats = {
        childName: mockParentProfile.children[0].name,
        childClass: mockParentProfile.children[0].class,
        averageScore: 85.2,
        rank: 5,
        attendanceRate: 96,
        ekstrakurikuler: 2,
        unreadAnnouncements: 2,
        violationCount: 0,
        lateCount: 0,
        achievementsCount: 3,
        prayerRate: 90,
    };

    // Computed values
    const attendancePercentage = Math.round(
        (mockMonthlyAttendance.hadir / mockMonthlyAttendance.totalSchoolDays) * 100,
    );

    const topSubjects = mockSubjectScores.slice(0, 3);
    const bottomSubjects = [...mockSubjectScores].slice(-3).reverse();

    const previousAverage = 84.5;
    const averageTrend = stats.averageScore - previousAverage;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Dashboard{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Orang Tua
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        {greeting},{' '}
                        <span className="font-medium text-foreground">
                            {userName}
                        </span>
                        !
                    </p>
                </div>
                {/* Child Info Badge */}
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border shadow-sm">
                    <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                         <User className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Memantau</p>
                        <p className="text-sm font-bold text-slate-900">{stats.childName}</p>
                    </div>
                    <Badge className="ml-2 bg-white text-blue-800 hover:bg-white border-transparent gap-1">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {stats.childClass}
                    </Badge>
                </div>
            </div>

            {/* Warning Banner */}
            {(stats.violationCount >= 3 || stats.averageScore < 75) && (
                <Card
                    className={cn(
                        'border-2',
                        stats.violationCount >= 5 || stats.averageScore < 70
                            ? 'bg-red-50 border-red-300'
                            : 'bg-amber-50 border-amber-300',
                    )}
                >
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <div
                                className={cn(
                                    'p-2 rounded-lg',
                                    stats.violationCount >= 5 ||
                                        stats.averageScore < 70
                                        ? 'bg-red-100'
                                        : 'bg-amber-100',
                                )}
                            >
                                <AlertTriangle
                                    className={cn(
                                        'h-5 w-5',
                                        stats.violationCount >= 5 ||
                                            stats.averageScore < 70
                                            ? 'text-red-600'
                                            : 'text-amber-600',
                                    )}
                                />
                            </div>
                            <div className="flex-1">
                                <h3
                                    className={cn(
                                        'font-semibold',
                                        stats.violationCount >= 5 ||
                                            stats.averageScore < 70
                                            ? 'text-red-900'
                                            : 'text-amber-900',
                                    )}
                                >
                                    Perhatian Diperlukan untuk {stats.childName}!
                                </h3>
                                <p
                                    className={cn(
                                        'text-sm mt-1',
                                        stats.violationCount >= 5 ||
                                            stats.averageScore < 70
                                            ? 'text-red-800'
                                            : 'text-amber-800',
                                    )}
                                >
                                    {stats.violationCount >= 3 &&
                                        `Anak Anda memiliki ${stats.violationCount} catatan pelanggaran. `}
                                    {stats.averageScore < 75 &&
                                        `Nilai rata-rata di bawah KKM. `}
                                    Mohon pantau perkembangan dan hubungi Wali Kelas jika diperlukan.
                                </p>
                            </div>
                            <Link href="/parent/behavior">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-amber-800 border-amber-300 hover:bg-amber-100"
                                >
                                    Lihat Detail
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Akademik */}
                <Link href="/parent/academic/grades">
                    <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Nilai</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800 tabular-nums">
                                {stats.averageScore}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                                Rata-rata Akademik
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Kehadiran Harian */}
                <Link href="/parent/attendance/daily">
                    <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-green-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Kehadiran</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800 tabular-nums">
                                {stats.attendanceRate}%
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                                Hadir di Sekolah
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Keterlambatan Pagi */}
                <Link href="/parent/attendance/morning">
                    <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-amber-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                </div>
                                {stats.lateCount > 0 ? (
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-amber-600 font-semibold">Cek</span>
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pagi</span>
                                )}
                            </div>
                            <p className={cn("text-2xl font-bold tabular-nums", stats.lateCount > 0 ? "text-amber-600" : "text-slate-800")}>
                                {stats.lateCount}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                                Kali Terlambat
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Presensi Sholat */}
                <Link href="/parent/attendance/prayer">
                    <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-indigo-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Calendar className="h-5 w-5 text-indigo-600" />
                                </div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Ibadah</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800 tabular-nums">
                                {stats.prayerRate}%
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                                Keaktifan Sholat
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Prestasi */}
                <Link href="/parent/academic/achievements">
                    <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:border-purple-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-purple-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Trophy className="h-5 w-5 text-purple-600" />
                                </div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Prestasi</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800 tabular-nums">
                                {stats.achievementsCount}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                                Penghargaan Siswa
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Catatan Perilaku */}
                <Link href="/parent/behavior">
                    <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:border-rose-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-rose-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <ClipboardList className="h-5 w-5 text-rose-600" />
                                </div>
                                {stats.violationCount > 0 ? (
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-rose-600 font-semibold">Cek</span>
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-green-500">Aman</span>
                                )}
                            </div>
                            <p className={cn("text-2xl font-bold tabular-nums", stats.violationCount > 0 ? "text-rose-600" : "text-slate-800")}>
                                {stats.violationCount}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                                Pelanggaran Aktif
                            </p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Row 1: Schedule + Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Schedule */}
                <Card className="border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Calendar className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">
                                        Jadwal Hari Ini
                                    </CardTitle>
                                    <CardDescription>
                                        {currentTime.toLocaleDateString(
                                            'id-ID',
                                            {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                            },
                                        )}
                                    </CardDescription>
                                </div>
                            </div>
                            <Link href="/parent/academic/schedule">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                                >
                                    Selengkapnya
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {mockTodaySchedule.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        'group flex items-center gap-4 p-3 rounded-xl border transition-all duration-200',
                                        index === 0
                                            ? 'bg-blue-50/50 border-blue-200'
                                            : 'bg-white border-slate-100 hover:border-blue-100 hover:shadow-sm',
                                    )}
                                >
                                    <div className="text-center min-w-[50px] shrink-0">
                                        <p
                                            className={cn(
                                                'text-sm font-bold',
                                                index === 0
                                                    ? 'text-blue-700'
                                                    : 'text-slate-600',
                                            )}
                                        >
                                            {item.time}
                                        </p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn("font-semibold text-sm truncate", index === 0 ? "text-blue-900" : "text-slate-800")}>
                                            {item.subject}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] font-medium text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <User className="h-3 w-3 opacity-70" />
                                                <span className="truncate">{item.teacher}</span>
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="h-3 w-3 opacity-70" />
                                                <span className="truncate">{item.room}</span>
                                            </span>
                                        </div>
                                    </div>
                                    {index === 0 && (
                                        <Badge className="bg-blue-100 text-blue-700 border-0 hover:bg-blue-100 px-2 py-0.5 text-[10px]">
                                            Berlangsung
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Announcements */}
                <Card className="border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Megaphone className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">
                                        Pengumuman
                                    </CardTitle>
                                    <CardDescription>
                                        Informasi terbaru sekolah
                                    </CardDescription>
                                </div>
                            </div>
                            <Link href="/parent/announcements">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                                >
                                    Lihat Semua
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {mockAnnouncements.map((item) => (
                                <Link
                                    key={item.id}
                                    href="/parent/announcements"
                                    className="group flex flex-col gap-2 p-3.5 rounded-xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'text-[10px] px-2 py-0',
                                                    item.category === 'Penting'
                                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                        : item.category === 'Akademik'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                            : 'bg-amber-50 text-amber-700 border-amber-200',
                                                )}
                                            >
                                                {item.category}
                                            </Badge>
                                            <span className="text-[11px] font-medium text-slate-400">
                                                {item.date}
                                            </span>
                                        </div>
                                        {item.isNew && (
                                            <span className="flex items-center gap-1 shrink-0">
                                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                                                <span className="text-[10px] text-rose-600 font-semibold">Baru</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-semibold text-sm text-slate-800 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
                                        {item.title}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: Kehadiran Bulan Ini + Performa Akademik */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kehadiran Bulan Ini */}
                <Card className="border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">
                                        Kehadiran Bulan Ini
                                    </CardTitle>
                                    <CardDescription>
                                        Ringkasan presensi harian {currentTime.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                    </CardDescription>
                                </div>
                            </div>
                            <Link href="/parent/attendance/daily">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 text-green-700 hover:text-green-800 hover:bg-green-50"
                                >
                                    Detail
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        {/* Attendance percentage highlight */}
                        <div className="flex items-center gap-4 mb-5 p-3.5 rounded-xl bg-green-50/70 border border-green-100">
                            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white border border-green-200 shadow-sm">
                                <span className={cn("text-xl font-bold tabular-nums", getAttendanceRateColor(attendancePercentage))}>
                                    {attendancePercentage}%
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-green-900">Tingkat Kehadiran</p>
                                <p className="text-xs text-green-700 mt-0.5">
                                    {mockMonthlyAttendance.hadir} dari {mockMonthlyAttendance.totalSchoolDays} hari sekolah
                                </p>
                            </div>
                        </div>

                        {/* Status breakdown */}
                        <div className="space-y-3">
                            {[
                                { label: 'Hadir', count: mockMonthlyAttendance.hadir, icon: CheckCircle, color: 'green' as const },
                                { label: 'Sakit', count: mockMonthlyAttendance.sakit, icon: AlertCircle, color: 'yellow' as const },
                                { label: 'Izin', count: mockMonthlyAttendance.izin, icon: Clock, color: 'blue' as const },
                                { label: 'Alpa', count: mockMonthlyAttendance.alpa, icon: XCircle, color: 'red' as const },
                            ].map((item) => {
                                const percentage = (item.count / mockMonthlyAttendance.totalSchoolDays) * 100;
                                const colorMap = {
                                    green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600', bar: '[&>div]:bg-green-500' },
                                    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'text-yellow-600', bar: '[&>div]:bg-yellow-500' },
                                    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600', bar: '[&>div]:bg-blue-500' },
                                    red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600', bar: '[&>div]:bg-red-500' },
                                };
                                const c = colorMap[item.color];
                                return (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <div className={cn("p-1.5 rounded-lg", c.bg)}>
                                            <item.icon className={cn("h-3.5 w-3.5", c.icon)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-slate-700">{item.label}</span>
                                                <span className={cn("text-xs font-bold tabular-nums", c.text)}>
                                                    {item.count} hari
                                                </span>
                                            </div>
                                            <Progress value={percentage} className={cn("h-1.5", c.bar)} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Performa Akademik */}
                <Card className="border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-slate-800">
                                        Performa Akademik
                                    </CardTitle>
                                    <CardDescription>
                                        Nilai tertinggi & terendah semester ini
                                    </CardDescription>
                                </div>
                            </div>
                            <Link href="/parent/academic/grades">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                                >
                                    Detail
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        {/* Average & Rank summary */}
                        <div className="flex gap-3 mb-5">
                            <div className="flex-1 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
                                <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider mb-1">Rata-rata</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-blue-900 tabular-nums">{stats.averageScore}</span>
                                    {averageTrend !== 0 && (
                                        <span className={cn("flex items-center gap-0.5 text-xs font-medium", averageTrend > 0 ? "text-emerald-600" : "text-red-600")}>
                                            {averageTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            {averageTrend > 0 ? '+' : ''}{averageTrend.toFixed(1)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
                                <p className="text-[11px] text-amber-600 font-semibold uppercase tracking-wider mb-1">Peringkat</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-bold text-amber-900 tabular-nums">#{stats.rank}</span>
                                    <span className="text-xs text-amber-700 font-medium">dari 32</span>
                                </div>
                            </div>
                        </div>

                        {/* Top subjects */}
                        <div className="mb-4">
                            <div className="flex items-center gap-1.5 mb-2.5">
                                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-xs font-semibold text-slate-700">Nilai Tertinggi</span>
                            </div>
                            <div className="space-y-2.5">
                                {topSubjects.map((subj) => (
                                    <div key={subj.subject} className="flex items-center gap-3">
                                        <span className="text-xs text-slate-600 font-medium min-w-[110px] truncate">{subj.subject}</span>
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-500", getScoreBarColor(subj.score))}
                                                style={{ width: `${subj.score}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-1.5 min-w-[55px] justify-end">
                                            <span className="text-xs font-bold text-slate-800 tabular-nums">{subj.score}</span>
                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-emerald-50 text-emerald-700 border-emerald-200">
                                                {subj.grade}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom subjects */}
                        <div>
                            <div className="flex items-center gap-1.5 mb-2.5">
                                <TrendingDown className="h-3.5 w-3.5 text-amber-600" />
                                <span className="text-xs font-semibold text-slate-700">Perlu Perhatian</span>
                            </div>
                            <div className="space-y-2.5">
                                {bottomSubjects.map((subj) => (
                                    <div key={subj.subject} className="flex items-center gap-3">
                                        <span className="text-xs text-slate-600 font-medium min-w-[110px] truncate">{subj.subject}</span>
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all duration-500", getScoreBarColor(subj.score))}
                                                style={{ width: `${subj.score}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-1.5 min-w-[55px] justify-end">
                                            <span className="text-xs font-bold text-slate-800 tabular-nums">{subj.score}</span>
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] px-1.5 py-0 h-4",
                                                subj.score >= 80
                                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                            )}>
                                                {subj.grade}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Row 3: Aktivitas Ekskul */}
            <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Trophy className="h-5 w-5 text-purple-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-slate-800">
                                    Aktivitas Ekstrakurikuler
                                </CardTitle>
                                <CardDescription>
                                    Kegiatan ekskul yang diikuti anak
                                </CardDescription>
                            </div>
                        </div>
                        <Link href="/parent/extracurricular">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-purple-700 hover:text-purple-800 hover:bg-purple-50"
                            >
                                Selengkapnya
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockEkskulSummary.map((ekskul) => (
                            <div
                                key={ekskul.id}
                                className="group p-4 rounded-xl border border-slate-100 bg-white hover:border-purple-200 hover:shadow-sm transition-all duration-200"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-purple-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                            <Trophy className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm text-slate-800">{ekskul.name}</h4>
                                            <p className="text-[11px] text-muted-foreground font-medium">{ekskul.category}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                                        Aktif
                                    </Badge>
                                </div>

                                {/* Schedule */}
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                                    <Calendar className="h-3 w-3 opacity-70" />
                                    <span>{ekskul.schedule}</span>
                                </div>

                                {/* Attendance & Achievement */}
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] text-muted-foreground font-medium">Kehadiran</span>
                                            <span className={cn(
                                                "text-xs font-bold tabular-nums",
                                                getAttendanceRateColor(ekskul.attendanceRate)
                                            )}>
                                                {ekskul.attendanceRate}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={ekskul.attendanceRate}
                                            className={cn(
                                                "h-1.5",
                                                ekskul.attendanceRate >= 90 ? "[&>div]:bg-emerald-500" :
                                                    ekskul.attendanceRate >= 75 ? "[&>div]:bg-amber-500" :
                                                        "[&>div]:bg-red-500"
                                            )}
                                        />
                                    </div>
                                    {ekskul.achievements > 0 && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-100">
                                            <Award className="h-3.5 w-3.5 text-amber-600" />
                                            <span className="text-xs font-bold text-amber-800 tabular-nums">{ekskul.achievements}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
