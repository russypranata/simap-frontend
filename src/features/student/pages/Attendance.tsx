"use client";

import React, { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    Filter,
    ChevronLeft,
    ChevronRight,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface AttendanceRecord {
    id: number;
    date: string;
    day: string;
    subject: string;
    teacher: string;
    status: "hadir" | "izin" | "sakit" | "alpa";
    time: string;
    notes?: string;
}

interface MonthlyAttendance {
    month: string;
    year: number;
    hadir: number;
    izin: number;
    sakit: number;
    alpa: number;
    totalDays: number;
}

// Mock data
const mockAttendanceRecords: AttendanceRecord[] = [
    { id: 1, date: "2026-01-10", day: "Jumat", subject: "Matematika", teacher: "Pak Ahmad", status: "hadir", time: "07:45" },
    { id: 2, date: "2026-01-10", day: "Jumat", subject: "Fisika", teacher: "Bu Sari", status: "hadir", time: "09:30" },
    { id: 3, date: "2026-01-09", day: "Kamis", subject: "Kimia", teacher: "Pak Rudi", status: "hadir", time: "07:00" },
    { id: 4, date: "2026-01-09", day: "Kamis", subject: "PKn", teacher: "Bu Rina", status: "hadir", time: "10:15" },
    { id: 5, date: "2026-01-08", day: "Rabu", subject: "Bahasa Inggris", teacher: "Pak Budi", status: "izin", time: "08:30", notes: "Izin mengikuti lomba" },
    { id: 6, date: "2026-01-08", day: "Rabu", subject: "Seni Budaya", teacher: "Bu Ratna", status: "izin", time: "10:15", notes: "Izin mengikuti lomba" },
    { id: 7, date: "2026-01-07", day: "Selasa", subject: "Biologi", teacher: "Bu Ani", status: "hadir", time: "07:45" },
    { id: 8, date: "2026-01-07", day: "Selasa", subject: "Sejarah", teacher: "Pak Hendra", status: "hadir", time: "10:15" },
    { id: 9, date: "2026-01-06", day: "Senin", subject: "Upacara", teacher: "-", status: "hadir", time: "07:00" },
    { id: 10, date: "2026-01-06", day: "Senin", subject: "Matematika", teacher: "Pak Ahmad", status: "hadir", time: "07:45" },
    { id: 11, date: "2026-01-03", day: "Jumat", subject: "Biologi", teacher: "Bu Ani", status: "sakit", time: "07:00", notes: "Demam" },
    { id: 12, date: "2026-01-02", day: "Kamis", subject: "Fisika", teacher: "Bu Sari", status: "hadir", time: "07:00" },
    { id: 13, date: "2025-12-20", day: "Jumat", subject: "Matematika", teacher: "Pak Ahmad", status: "hadir", time: "08:30" },
    { id: 14, date: "2025-12-19", day: "Kamis", subject: "Kimia", teacher: "Pak Rudi", status: "hadir", time: "07:00" },
    { id: 15, date: "2025-12-18", day: "Rabu", subject: "PJOK", teacher: "Pak Dedi", status: "alpa", time: "12:30" },
];

const mockMonthlyData: MonthlyAttendance[] = [
    { month: "Januari", year: 2026, hadir: 18, izin: 2, sakit: 1, alpa: 0, totalDays: 21 },
    { month: "Desember", year: 2025, hadir: 19, izin: 1, sakit: 0, alpa: 1, totalDays: 21 },
    { month: "November", year: 2025, hadir: 20, izin: 1, sakit: 1, alpa: 0, totalDays: 22 },
    { month: "Oktober", year: 2025, hadir: 21, izin: 0, sakit: 1, alpa: 0, totalDays: 22 },
];

// Status colors and labels
const getStatusConfig = (status: AttendanceRecord["status"]) => {
    const configs = {
        hadir: { label: "Hadir", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
        izin: { label: "Izin", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
        sakit: { label: "Sakit", color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertCircle },
        alpa: { label: "Alpa", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    };
    return configs[status];
};

export const StudentAttendance: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");

    // Calculate overall statistics
    const overallStats = useMemo(() => {
        const total = mockAttendanceRecords.length;
        const hadir = mockAttendanceRecords.filter(r => r.status === "hadir").length;
        const izin = mockAttendanceRecords.filter(r => r.status === "izin").length;
        const sakit = mockAttendanceRecords.filter(r => r.status === "sakit").length;
        const alpa = mockAttendanceRecords.filter(r => r.status === "alpa").length;
        const percentage = Math.round((hadir / total) * 100);

        return { total, hadir, izin, sakit, alpa, percentage };
    }, []);

    // Filter records
    const filteredRecords = useMemo(() => {
        return mockAttendanceRecords.filter(record => {
            const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
            // Add month filter logic if needed
            return matchesStatus;
        });
    }, [selectedStatus]);

    // Current semester stats
    const semesterStats = useMemo(() => {
        const totalDays = mockMonthlyData.reduce((sum, m) => sum + m.totalDays, 0);
        const totalHadir = mockMonthlyData.reduce((sum, m) => sum + m.hadir, 0);
        const percentage = Math.round((totalHadir / totalDays) * 100);
        return { totalDays, totalHadir, percentage };
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Rekap </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Kehadiran</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Lihat riwayat kehadiran di setiap mata pelajaran
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
            </div>

            {/* Stats Overview */}
            <Card className="overflow-hidden p-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 relative overflow-hidden">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Statistik Kehadiran</h2>
                                <p className="text-blue-100 text-sm">Semester Ganjil 2025/2026</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-white">{semesterStats.percentage}%</p>
                            <p className="text-blue-100 text-sm">Tingkat Kehadiran</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <CardContent className="p-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
                        {/* Hadir */}
                        <div className="p-4 text-center">
                            <div className="inline-flex p-2.5 bg-green-100 rounded-full mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">{overallStats.hadir}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Hadir</p>
                        </div>

                        {/* Izin */}
                        <div className="p-4 text-center">
                            <div className="inline-flex p-2.5 bg-blue-100 rounded-full mb-2">
                                <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{overallStats.izin}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Izin</p>
                        </div>

                        {/* Sakit */}
                        <div className="p-4 text-center">
                            <div className="inline-flex p-2.5 bg-amber-100 rounded-full mb-2">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                            </div>
                            <p className="text-2xl font-bold text-amber-600">{overallStats.sakit}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Sakit</p>
                        </div>

                        {/* Alpa */}
                        <div className="p-4 text-center">
                            <div className="inline-flex p-2.5 bg-red-100 rounded-full mb-2">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-red-600">{overallStats.alpa}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Alpa</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Progress */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Kehadiran Per Bulan</CardTitle>
                            <CardDescription>Persentase kehadiran bulanan</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockMonthlyData.map((month) => {
                            const percentage = Math.round((month.hadir / month.totalDays) * 100);
                            return (
                                <div key={`${month.month}-${month.year}`} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{month.month} {month.year}</span>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-green-600">{month.hadir} hadir</span>
                                            {month.izin > 0 && <span className="text-blue-600">{month.izin} izin</span>}
                                            {month.sakit > 0 && <span className="text-amber-600">{month.sakit} sakit</span>}
                                            {month.alpa > 0 && <span className="text-red-600">{month.alpa} alpa</span>}
                                            <Badge className={cn(
                                                percentage >= 90 ? "bg-green-100 text-green-700" :
                                                    percentage >= 75 ? "bg-amber-100 text-amber-700" :
                                                        "bg-red-100 text-red-700"
                                            )}>
                                                {percentage}%
                                            </Badge>
                                        </div>
                                    </div>
                                    <Progress
                                        value={percentage}
                                        className={cn(
                                            "h-2",
                                            percentage >= 90 ? "[&>div]:bg-green-600" :
                                                percentage >= 75 ? "[&>div]:bg-amber-600" :
                                                    "[&>div]:bg-red-600"
                                        )}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Attendance History */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Riwayat Kehadiran</CardTitle>
                                <CardDescription>Detail kehadiran per mata pelajaran</CardDescription>
                            </div>
                        </div>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[150px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="hadir">Hadir</SelectItem>
                                <SelectItem value="izin">Izin</SelectItem>
                                <SelectItem value="sakit">Sakit</SelectItem>
                                <SelectItem value="alpa">Alpa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-medium text-sm w-32">Tanggal</th>
                                    <th className="text-left p-4 font-medium text-sm">Mata Pelajaran</th>
                                    <th className="text-left p-4 font-medium text-sm">Guru</th>
                                    <th className="text-left p-4 font-medium text-sm w-20">Jam</th>
                                    <th className="text-center p-4 font-medium text-sm w-28">Status</th>
                                    <th className="text-left p-4 font-medium text-sm">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            Tidak ada data kehadiran untuk filter ini
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRecords.map((record) => {
                                        const statusConfig = getStatusConfig(record.status);
                                        const StatusIcon = statusConfig.icon;
                                        return (
                                            <tr key={record.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium text-sm">{record.day}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(record.date).toLocaleDateString("id-ID", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric"
                                                            })}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-medium">{record.subject}</td>
                                                <td className="p-4 text-sm text-muted-foreground">{record.teacher}</td>
                                                <td className="p-4 text-sm">{record.time}</td>
                                                <td className="p-4 text-center">
                                                    <Badge variant="outline" className={cn("gap-1", statusConfig.color)}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusConfig.label}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {record.notes || "-"}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-800" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-900">Tips Kehadiran</h3>
                            <ul className="mt-2 space-y-1 text-sm text-green-800">
                                <li>• Tingkat kehadiran minimal 75% untuk dapat mengikuti ujian</li>
                                <li>• Jika berhalangan hadir, segera informasikan ke wali kelas</li>
                                <li>• Surat izin/sakit harus diserahkan maksimal 3 hari setelah tidak hadir</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
