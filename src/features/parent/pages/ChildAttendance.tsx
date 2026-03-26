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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface AttendanceRecord {
    id: number;
    date: string;
    day: string;
    subject: string;
    status: "hadir" | "izin" | "sakit" | "alpa";
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
const mockChildInfo = {
    name: "Ahmad Fauzan Ramadhan",
    nis: "0012345678",
    class: "XII IPA 1",
};

const mockAttendanceRecords: AttendanceRecord[] = [
    { id: 1, date: "2026-01-10", day: "Jumat", subject: "Matematika", status: "hadir" },
    { id: 2, date: "2026-01-10", day: "Jumat", subject: "Fisika", status: "hadir" },
    { id: 3, date: "2026-01-09", day: "Kamis", subject: "Kimia", status: "hadir" },
    { id: 4, date: "2026-01-08", day: "Rabu", subject: "Bahasa Inggris", status: "izin" },
    { id: 5, date: "2026-01-07", day: "Selasa", subject: "Biologi", status: "hadir" },
    { id: 6, date: "2026-01-06", day: "Senin", subject: "Matematika", status: "hadir" },
    { id: 7, date: "2026-01-03", day: "Jumat", subject: "Biologi", status: "sakit" },
    { id: 8, date: "2025-12-18", day: "Rabu", subject: "PJOK", status: "alpa" },
];

const mockMonthlyData: MonthlyAttendance[] = [
    { month: "Januari", year: 2026, hadir: 18, izin: 2, sakit: 1, alpa: 0, totalDays: 21 },
    { month: "Desember", year: 2025, hadir: 19, izin: 1, sakit: 0, alpa: 1, totalDays: 21 },
    { month: "November", year: 2025, hadir: 20, izin: 1, sakit: 1, alpa: 0, totalDays: 22 },
];

const getStatusConfig = (status: AttendanceRecord["status"]) => {
    const configs = {
        hadir: { label: "Hadir", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
        izin: { label: "Izin", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
        sakit: { label: "Sakit", color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertCircle },
        alpa: { label: "Alpa", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    };
    return configs[status];
};

export const ChildAttendance: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState("all");

    const overallStats = useMemo(() => {
        const total = mockAttendanceRecords.length;
        const hadir = mockAttendanceRecords.filter(r => r.status === "hadir").length;
        const izin = mockAttendanceRecords.filter(r => r.status === "izin").length;
        const sakit = mockAttendanceRecords.filter(r => r.status === "sakit").length;
        const alpa = mockAttendanceRecords.filter(r => r.status === "alpa").length;
        const percentage = Math.round((hadir / total) * 100);

        return { total, hadir, izin, sakit, alpa, percentage };
    }, []);

    const filteredRecords = useMemo(() => {
        if (selectedStatus === "all") return mockAttendanceRecords;
        return mockAttendanceRecords.filter(r => r.status === selectedStatus);
    }, [selectedStatus]);

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
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Kehadiran </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anak</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Pantau kehadiran anak di sekolah
                    </p>

                </div>
            </div>

            {/* Child Info */}
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                            {mockChildInfo.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">{mockChildInfo.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>NIS: {mockChildInfo.nis}</span>
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                    {mockChildInfo.class}
                                </Badge>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Tingkat Kehadiran</p>
                            <p className={cn(
                                "text-2xl font-bold",
                                semesterStats.percentage >= 90 ? "text-green-600" :
                                    semesterStats.percentage >= 75 ? "text-amber-600" : "text-red-600"
                            )}>
                                {semesterStats.percentage}%
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-green-100 rounded-full mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-green-600">{overallStats.hadir}</p>
                        <p className="text-xs text-muted-foreground">Hadir</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-blue-100 rounded-full mb-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{overallStats.izin}</p>
                        <p className="text-xs text-muted-foreground">Izin</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-amber-100 rounded-full mb-2">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{overallStats.sakit}</p>
                        <p className="text-xs text-muted-foreground">Sakit</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-red-100 rounded-full mb-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-red-600">{overallStats.alpa}</p>
                        <p className="text-xs text-muted-foreground">Alpa</p>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Progress */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Kehadiran Per Bulan</CardTitle>
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
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-green-600">{month.hadir} hadir</span>
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
                                    <Progress value={percentage} className="h-2" />
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Attendance History */}
            <Card>
                <CardHeader className="bg-slate-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                <Calendar className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Kehadiran</CardTitle>
                                <CardDescription className="text-sm text-slate-600">Daftar kehadiran per mata pelajaran</CardDescription>
                            </div>
                        </div>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[140px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
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
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Tanggal</th>
                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Mata Pelajaran</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecords.map((record) => {
                                    const statusConfig = getStatusConfig(record.status);
                                    const StatusIcon = statusConfig.icon;
                                    return (
                                        <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-medium text-sm">{record.day}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(record.date).toLocaleDateString("id-ID", {
                                                        day: "numeric", month: "short", year: "numeric"
                                                    })}
                                                </p>
                                            </td>
                                            <td className="p-4 font-medium">{record.subject}</td>
                                            <td className="p-4 text-center">
                                                <Badge variant="outline" className={cn("gap-1", statusConfig.color)}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {statusConfig.label}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Warning if low attendance */}
            {semesterStats.percentage < 90 && (
                <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-amber-800" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-900">Perhatian</h3>
                                <p className="text-sm text-amber-800 mt-1">
                                    Tingkat kehadiran anak Anda di bawah 90%. Kehadiran minimal 75% diperlukan untuk mengikuti ujian.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
