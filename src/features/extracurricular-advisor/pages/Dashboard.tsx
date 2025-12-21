"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Users,
    Calendar,
    CheckCircle,
    Clock,
    TrendingUp,
    AlertCircle,
    Award,
    Activity,
    UserCheck,
    Bell,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Star,
} from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter";

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    description,
    icon: Icon,
    color,
    bgColor,
    trend,
}) => {
    return (
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="relative pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground pr-12">
                    {title}
                </CardTitle>
                <div className={`absolute top-4 right-4 p-2 rounded-lg ${bgColor}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-foreground">{value}</div>
                    {trend && (
                        <div
                            className={`flex items-center text-xs ${trend.isUp ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {trend.isUp ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                            ) : (
                                <ArrowDown className="h-3 w-3 mr-1" />
                            )}
                            {trend.value}%
                        </div>
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
        </Card>
    );
};

export const ExtracurricularDashboard: React.FC = () => {
    // Mock Data
    const pembinaInfo = {
        name: "Pak Ahmad Fauzi",
        nip: "198505152010011001",
        extracurricular: "Pramuka",
    };

    const stats = [
        {
            title: "Total Anggota",
            value: "45",
            description: "Anggota aktif tahun ini",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            trend: { value: 12, isUp: true },
        },
        {
            title: "Kehadiran Rata-rata",
            value: "87%",
            description: "Pertemuan bulan ini",
            icon: UserCheck,
            color: "text-green-600",
            bgColor: "bg-green-50",
            trend: { value: 5, isUp: true },
        },
        {
            title: "Pertemuan Bulan Ini",
            value: "8",
            description: "dari 12 pertemuan",
            icon: Calendar,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Prestasi",
            value: "3",
            description: "Penghargaan tahun ini",
            icon: Award,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
    ];

    const upcomingSchedule = [
        {
            id: 1,
            date: "2025-12-22",
            time: "14:00 - 16:00",
            activity: "Latihan Rutin",
            location: "Lapangan Upacara",
            participants: 45,
        },
        {
            id: 2,
            date: "2025-12-25",
            time: "14:00 - 16:00",
            activity: "Persiapan Lomba",
            location: "Aula Sekolah",
            participants: 20,
        },
        {
            id: 3,
            date: "2025-12-29",
            time: "08:00 - 12:00",
            activity: "Perkemahan Sabtu Minggu",
            location: "Bumi Perkemahan",
            participants: 45,
        },
    ];

    const recentActivities = [
        {
            id: 1,
            type: "attendance",
            title: "Presensi Latihan Rutin",
            description: "42 dari 45 anggota hadir",
            time: "2 jam yang lalu",
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            id: 2,
            type: "registration",
            title: "Pendaftaran Anggota Baru",
            description: "5 siswa baru bergabung",
            time: "1 hari yang lalu",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            id: 3,
            type: "achievement",
            title: "Juara 1 Lomba Tingkat Kota",
            description: "Regu Penggalang",
            time: "3 hari yang lalu",
            icon: Award,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
    ];

    const announcements = [
        {
            id: 1,
            title: "Persiapan Lomba Tingkat Provinsi",
            date: "20 Des 2025",
            category: "Kompetisi",
            priority: "high",
        },
        {
            id: 2,
            title: "Pengumpulan Iuran Ekskul Semester Genap",
            date: "18 Des 2025",
            category: "Administrasi",
            priority: "medium",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Dashboard <span className="text-primary">Pembina Ekskul</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Star className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola kegiatan ekstrakurikuler {pembinaInfo.extracurricular}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {pembinaInfo.name}
                        </span>
                        <span>•</span>
                        <span>NIP: {pembinaInfo.nip}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Jadwal Kegiatan
                    </Button>
                    <Button size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Kelola Anggota
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Schedule & Activities */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Upcoming Schedule */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Jadwal Mendatang
                                </CardTitle>
                                <Button variant="ghost" size="sm">
                                    Lihat Semua
                                </Button>
                            </div>
                            <CardDescription>
                                Kegiatan ekstrakurikuler minggu ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingSchedule.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-lg p-3 min-w-[60px]">
                                            <div className="text-xs font-medium">
                                                {formatDate(new Date(schedule.date), "MMM")}
                                            </div>
                                            <div className="text-2xl font-bold">
                                                {formatDate(new Date(schedule.date), "dd")}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-foreground">
                                                {schedule.activity}
                                            </h4>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {schedule.time}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {schedule.participants} peserta
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                📍 {schedule.location}
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Detail
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Aktivitas Terbaru
                            </CardTitle>
                            <CardDescription>
                                Riwayat kegiatan ekstrakurikuler
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                                            <activity.icon className={`h-4 w-4 ${activity.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">{activity.title}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Announcements & Quick Actions */}
                <div className="space-y-6">
                    {/* Announcements */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Bell className="h-4 w-4 text-primary" />
                                    Pengumuman
                                </CardTitle>
                                <Badge variant="secondary">2 Baru</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {announcements.map((announcement) => (
                                    <div
                                        key={announcement.id}
                                        className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            <Badge
                                                variant={
                                                    announcement.priority === "high"
                                                        ? "destructive"
                                                        : "secondary"
                                                }
                                                className="text-xs"
                                            >
                                                {announcement.category}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {announcement.date}
                                            </span>
                                        </div>
                                        <h4 className="font-medium text-sm leading-snug">
                                            {announcement.title}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4" size="sm">
                                Lihat Semua Pengumuman
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Aksi Cepat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="h-4 w-4 mr-2" />
                                    Daftarkan Anggota Baru
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Presensi Kegiatan
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Buat Jadwal Baru
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Award className="h-4 w-4 mr-2" />
                                    Catat Prestasi
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
