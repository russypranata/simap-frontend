'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Calendar,
    Award,
    GraduationCap,
    Clock,
    BookOpen,
    CheckCircle,
    Trophy,
    Megaphone,
    User,
    ChevronRight,
    TrendingUp,
    AlertCircle,
    Star,
    MapPin,
    AlertTriangle,
    ClipboardList,
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
import { getStudentProfile } from '@/features/student/services/studentProfileService';

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
        title: 'Libur Semester Ganjil 2025/2026',
        category: 'Jadwal',
        date: '9 Jan',
        isNew: true,
    },
    {
        id: 3,
        title: 'Pendaftaran Lomba OSN 2026',
        category: 'Akademik',
        date: '8 Jan',
        isNew: false,
    },
];

export const StudentDashboard: React.FC = () => {
    const [userName, setUserName] = useState<string>('Siswa');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Fetch real name from profile service
        const fetchUserName = async () => {
            try {
                const profile = await getStudentProfile();
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

        // Update time every minute
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Get greeting based on time
    const greeting = useMemo(() => {
        const hour = currentTime.getHours();
        if (hour < 11) return 'Selamat pagi';
        if (hour < 15) return 'Selamat siang';
        if (hour < 18) return 'Selamat sore';
        return 'Selamat malam';
    }, [currentTime]);

    // Mock stats
    const stats = {
        averageScore: 85.2,
        rank: 5,
        attendanceRate: 96,
        ekstrakurikuler: 2,
        unreadAnnouncements: 2,
        violationCount: 3, // Number of violations
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-linear-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Dashboard{' '}
                            </span>
                            <span className="bg-linear-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Siswa
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        {greeting},{' '}
                        <span className="font-medium text-foreground">
                            {userName}
                        </span>
                        !
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                                Tahun Ajaran 2025/2026
                            </span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <span className="text-sm font-medium text-blue-800">
                            Semester Ganjil
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 gap-1">
                        <GraduationCap className="h-3.5 w-3.5" />
                        XII IPA 1
                    </Badge>
                </div>
            </div>

            {/* Warning Banner - Show if violations >= 3 or low grades */}
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
                                    Perhatian Diperlukan!
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
                                        `Kamu memiliki ${stats.violationCount} catatan pelanggaran. `}
                                    {stats.averageScore < 75 &&
                                        `Nilai rata-rata kamu di bawah KKM. `}
                                    Segera perbaiki dan hubungi Guru BK jika
                                    membutuhkan bantuan.
                                </p>
                            </div>
                            <Link href="/student/behavior">
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
                {/* Rata-rata Nilai */}
                <Link href="/student/grades">
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-blue-100 hover:border-blue-300 bg-linear-to-br from-white to-blue-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                                    <TrendingUp className="h-5 w-5 text-blue-700" />
                                </div>
                                <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] px-1.5">
                                    {stats.averageScore >= 80
                                        ? 'Baik'
                                        : stats.averageScore >= 70
                                          ? 'Cukup'
                                          : 'Kurang'}
                                </Badge>
                            </div>
                            <p className="text-2xl font-bold text-blue-800">
                                {stats.averageScore}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Rata-rata Nilai
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                {/* Peringkat */}
                <Link href="/student/grades">
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-amber-100 hover:border-amber-300 bg-linear-to-br from-white to-amber-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                                    <Award className="h-5 w-5 text-amber-600" />
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                    dari 32
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-amber-600">
                                #{stats.rank}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Peringkat Kelas
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                {/* Kehadiran */}
                <Link href="/student/attendance">
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-green-100 hover:border-green-300 bg-linear-to-br from-white to-green-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <Badge
                                    className={cn(
                                        'border-0 text-[10px] px-1.5',
                                        stats.attendanceRate >= 90
                                            ? 'bg-green-100 text-green-700'
                                            : stats.attendanceRate >= 75
                                              ? 'bg-amber-100 text-amber-700'
                                              : 'bg-red-100 text-red-700',
                                    )}
                                >
                                    {stats.attendanceRate >= 90
                                        ? 'Bagus'
                                        : stats.attendanceRate >= 75
                                          ? 'Cukup'
                                          : 'Rendah'}
                                </Badge>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                                {stats.attendanceRate}%
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Kehadiran
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                {/* Catatan Perilaku */}
                <Link href="/student/behavior">
                    <Card
                        className={cn(
                            'group hover:shadow-lg transition-all duration-300 cursor-pointer',
                            stats.violationCount >= 3
                                ? 'ring-2 ring-red-300 border-red-200 bg-linear-to-br from-white to-red-50/50'
                                : stats.violationCount > 0
                                  ? 'border-amber-100 hover:border-amber-300 bg-linear-to-br from-white to-amber-50/50'
                                  : 'border-green-100 hover:border-green-300 bg-linear-to-br from-white to-green-50/50',
                        )}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className={cn(
                                        'p-2.5 rounded-xl transition-colors',
                                        stats.violationCount >= 3
                                            ? 'bg-red-100 group-hover:bg-red-200'
                                            : stats.violationCount > 0
                                              ? 'bg-amber-100 group-hover:bg-amber-200'
                                              : 'bg-green-100 group-hover:bg-green-200',
                                    )}
                                >
                                    <ClipboardList
                                        className={cn(
                                            'h-5 w-5',
                                            stats.violationCount >= 3
                                                ? 'text-red-600'
                                                : stats.violationCount > 0
                                                  ? 'text-amber-600'
                                                  : 'text-green-600',
                                        )}
                                    />
                                </div>
                                {stats.violationCount >= 3 ? (
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-red-600 font-medium">
                                            Perhatian
                                        </span>
                                    </span>
                                ) : stats.violationCount === 0 ? (
                                    <Badge className="bg-green-100 text-green-700 border-0 text-[10px] px-1.5">
                                        Bersih
                                    </Badge>
                                ) : null}
                            </div>
                            <p
                                className={cn(
                                    'text-2xl font-bold',
                                    stats.violationCount >= 3
                                        ? 'text-red-600'
                                        : stats.violationCount > 0
                                          ? 'text-amber-600'
                                          : 'text-green-600',
                                )}
                            >
                                {stats.violationCount}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Pelanggaran
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                {/* Ekstrakurikuler */}
                <Link href="/student/extracurricular">
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-purple-100 hover:border-purple-300 bg-linear-to-br from-white to-purple-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                                    <Trophy className="h-5 w-5 text-purple-600" />
                                </div>
                                <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px] px-1.5">
                                    Aktif
                                </Badge>
                            </div>
                            <p className="text-2xl font-bold text-purple-600">
                                {stats.ekstrakurikuler}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Ekstrakurikuler
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                {/* Pengumuman */}
                <Link href="/student/announcements">
                    <Card
                        className={cn(
                            'group hover:shadow-lg transition-all duration-300 cursor-pointer',
                            stats.unreadAnnouncements > 0
                                ? 'border-rose-100 hover:border-rose-300 bg-linear-to-br from-white to-rose-50/50'
                                : 'border-gray-100 hover:border-gray-300 bg-linear-to-br from-white to-gray-50/50',
                        )}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className={cn(
                                        'p-2.5 rounded-xl transition-colors',
                                        stats.unreadAnnouncements > 0
                                            ? 'bg-rose-100 group-hover:bg-rose-200'
                                            : 'bg-gray-100 group-hover:bg-gray-200',
                                    )}
                                >
                                    <Megaphone
                                        className={cn(
                                            'h-5 w-5',
                                            stats.unreadAnnouncements > 0
                                                ? 'text-rose-600'
                                                : 'text-gray-600',
                                        )}
                                    />
                                </div>
                                {stats.unreadAnnouncements > 0 && (
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-rose-600 font-medium">
                                            Baru
                                        </span>
                                    </span>
                                )}
                            </div>
                            <p
                                className={cn(
                                    'text-2xl font-bold',
                                    stats.unreadAnnouncements > 0
                                        ? 'text-rose-600'
                                        : 'text-gray-600',
                                )}
                            >
                                {stats.unreadAnnouncements}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Pengumuman Baru
                            </p>
                        </CardContent>
                    </Card>
                </Link>
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
                                    <CardTitle className="text-lg">
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
                            <Link href="/student/schedule">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 text-blue-800"
                                >
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
                                        'flex items-center gap-4 p-3 rounded-lg',
                                        index === 0
                                            ? 'bg-blue-50 border border-blue-200'
                                            : 'bg-muted/30',
                                    )}
                                >
                                    <div className="text-center min-w-[50px]">
                                        <p
                                            className={cn(
                                                'text-sm font-bold',
                                                index === 0
                                                    ? 'text-blue-800'
                                                    : 'text-muted-foreground',
                                            )}
                                        >
                                            {item.time}
                                        </p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {item.subject}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {item.teacher}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {item.room}
                                            </span>
                                        </div>
                                    </div>
                                    {index === 0 && (
                                        <Badge className="bg-blue-800 text-white text-xs">
                                            Sekarang
                                        </Badge>
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
                                    <CardTitle className="text-lg">
                                        Pengumuman Terbaru
                                    </CardTitle>
                                    <CardDescription>
                                        Informasi penting dari sekolah
                                    </CardDescription>
                                </div>
                            </div>
                            <Link href="/student/announcements">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 text-blue-800"
                                >
                                    Lihat Semua
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockAnnouncements.map((item) => (
                                <Link
                                    key={item.id}
                                    href="/student/announcements"
                                    className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-xs',
                                                        item.category ===
                                                            'Penting'
                                                            ? 'bg-red-100 text-red-700 border-red-200'
                                                            : item.category ===
                                                                'Akademik'
                                                              ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                              : 'bg-amber-100 text-amber-700 border-amber-200',
                                                    )}
                                                >
                                                    {item.category}
                                                </Badge>
                                                {item.isNew && (
                                                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                                                )}
                                            </div>
                                            <p className="font-medium text-sm line-clamp-1">
                                                {item.title}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground shrink-0">
                                            {item.date}
                                        </span>
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
                        <Link href="/student/schedule">
                            <div className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-center group">
                                <div className="inline-flex p-3 bg-blue-100 rounded-full mb-2 group-hover:bg-blue-200 transition-colors">
                                    <Calendar className="h-6 w-6 text-blue-800" />
                                </div>
                                <p className="font-medium text-sm text-blue-800">
                                    Jadwal
                                </p>
                            </div>
                        </Link>
                        <Link href="/student/grades">
                            <div className="p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-center group">
                                <div className="inline-flex p-3 bg-green-100 rounded-full mb-2 group-hover:bg-green-200 transition-colors">
                                    <GraduationCap className="h-6 w-6 text-green-700" />
                                </div>
                                <p className="font-medium text-sm text-green-700">
                                    Nilai
                                </p>
                            </div>
                        </Link>
                        <Link href="/student/attendance">
                            <div className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors text-center group">
                                <div className="inline-flex p-3 bg-purple-100 rounded-full mb-2 group-hover:bg-purple-200 transition-colors">
                                    <CheckCircle className="h-6 w-6 text-purple-700" />
                                </div>
                                <p className="font-medium text-sm text-purple-700">
                                    Kehadiran
                                </p>
                            </div>
                        </Link>
                        <Link href="/student/extracurricular">
                            <div className="p-4 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors text-center group">
                                <div className="inline-flex p-3 bg-amber-100 rounded-full mb-2 group-hover:bg-amber-200 transition-colors">
                                    <Trophy className="h-6 w-6 text-amber-700" />
                                </div>
                                <p className="font-medium text-sm text-amber-700">
                                    Ekstrakurikuler
                                </p>
                            </div>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
