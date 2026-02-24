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
import {
    Calendar,
    Clock,
    Sun,
    Moon,
    CheckCircle,
    XCircle,
    AlertCircle,
    MapPin,
    Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface MorningAttendanceRecord {
    id: number;
    date: string;
    day: string;
    timeIn: string;
    timeOut: string;
    status: "hadir" | "terlambat" | "izin" | "sakit" | "alpa";
    notes?: string;
    location?: string;
}

interface AttendanceStats {
    total: number;
    hadir: number;
    terlambat: number;
    izin: number;
    sakit: number;
    alpa: number;
    percentage: number;
}

// Mock Data
const mockMorningRecords: MorningAttendanceRecord[] = [
    { id: 1, date: "2026-01-10", day: "Jumat", timeIn: "06:45", timeOut: "14:00", status: "hadir", location: "Gerbang Depan" },
    { id: 2, date: "2026-01-09", day: "Kamis", timeIn: "06:50", timeOut: "15:30", status: "hadir", location: "Gerbang Depan" },
    { id: 3, date: "2026-01-08", day: "Rabu", timeIn: "-", timeOut: "-", status: "izin", notes: "Lomba Matematika" },
    { id: 4, date: "2026-01-07", day: "Selasa", timeIn: "07:10", timeOut: "15:30", status: "terlambat", notes: "Macet", location: "Gerbang Samping" },
    { id: 5, date: "2026-01-06", day: "Senin", timeIn: "06:40", timeOut: "15:30", status: "hadir", location: "Gerbang Depan" },
    { id: 6, date: "2026-01-03", day: "Jumat", timeIn: "-", timeOut: "-", status: "sakit", notes: "Demam" },
    { id: 7, date: "2026-01-02", day: "Kamis", timeIn: "06:55", timeOut: "15:30", status: "hadir", location: "Gerbang Depan" },
    { id: 8, date: "2025-12-19", day: "Jumat", timeIn: "06:45", timeOut: "11:00", status: "hadir", location: "Gerbang Depan" },
    { id: 9, date: "2025-12-18", day: "Kamis", timeIn: "-", timeOut: "-", status: "alpa" },
    { id: 10, date: "2025-12-17", day: "Rabu", timeIn: "06:50", timeOut: "15:30", status: "hadir", location: "Gerbang Depan" },
];

const getStatusConfig = (status: MorningAttendanceRecord["status"]) => {
    const configs = {
        hadir: { label: "Hadir", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
        terlambat: { label: "Terlambat", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
        izin: { label: "Izin", color: "bg-blue-100 text-blue-700 border-blue-200", icon: AlertCircle },
        sakit: { label: "Sakit", color: "bg-purple-100 text-purple-700 border-purple-200", icon: AlertCircle },
        alpa: { label: "Alpa", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    };
    return configs[status];
};

export const ParentMorningAttendance: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState("all");

    // Filter records by month
    const filteredRecords = useMemo(() => {
        if (selectedMonth === "all") return mockMorningRecords;
        return mockMorningRecords.filter(r => r.date.startsWith(selectedMonth));
    }, [selectedMonth]);

    // Calculate Stats from FILTERED records
    const stats: AttendanceStats = useMemo(() => {
        const total = filteredRecords.length;
        const hadir = filteredRecords.filter(r => r.status === "hadir").length;
        const terlambat = filteredRecords.filter(r => r.status === "terlambat").length;
        const izin = filteredRecords.filter(r => r.status === "izin").length;
        const sakit = filteredRecords.filter(r => r.status === "sakit").length;
        const alpa = filteredRecords.filter(r => r.status === "alpa").length;
        
        // Calculate percentage (Hadir + Terlambat considered present)
        const relevantTotal = total; 
        const presentCount = hadir + terlambat;
        const percentage = relevantTotal > 0 ? Math.round((presentCount / relevantTotal) * 100) : 0;

        return { total, hadir, terlambat, izin, sakit, alpa, percentage };
    }, [filteredRecords]);

    // Helper to get day name only
    const getFormattedDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Kehadiran </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Pagi</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Sun className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Rekap kehadiran (Check-in/Check-out) harian anak
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Pilih Bulan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Bulan</SelectItem>
                            <SelectItem value="2026-01">Januari 2026</SelectItem>
                            <SelectItem value="2025-12">Desember 2025</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="p-2 bg-green-100 rounded-full mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-2xl font-bold text-green-700">{stats.hadir}</span>
                        <span className="text-xs text-muted-foreground">Tepat Waktu</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="p-2 bg-amber-100 rounded-full mb-2">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <span className="text-2xl font-bold text-amber-700">{stats.terlambat}</span>
                        <span className="text-xs text-muted-foreground">Terlambat</span>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="p-2 bg-blue-100 rounded-full mb-2">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-2xl font-bold text-blue-700">{stats.izin}</span>
                        <span className="text-xs text-muted-foreground">Izin</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="p-2 bg-purple-100 rounded-full mb-2">
                            <AlertCircle className="h-5 w-5 text-purple-600" />
                        </div>
                        <span className="text-2xl font-bold text-purple-700">{stats.sakit}</span>
                        <span className="text-xs text-muted-foreground">Sakit</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className="p-2 bg-red-100 rounded-full mb-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <span className="text-2xl font-bold text-red-700">{stats.alpa}</span>
                        <span className="text-xs text-muted-foreground">Alpa</span>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance List */}
            <Card>
                <CardHeader>
                     <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Riwayat Kehadiran</CardTitle>
                            <CardDescription>
                                Daftar riwayat tap kartu/fingerprint
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                                    <th className="px-6 py-3 text-center font-medium text-muted-foreground">Jam Masuk</th>
                                    <th className="px-6 py-3 text-center font-medium text-muted-foreground">Jam Pulang</th>
                                    <th className="px-6 py-3 text-center font-medium text-muted-foreground">Status</th>
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Lokasi / Ket</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                                            Tidak ada data kehadiran untuk bulan ini.
                                        </td>
                                    </tr>
                                ) : filteredRecords.map((record) => {
                                    const config = getStatusConfig(record.status);
                                    const Icon = config.icon;
                                    
                                    return (
                                        <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{record.day}</span>
                                                    <span className="text-xs text-muted-foreground">{getFormattedDate(record.date)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                                                    <Sun className="h-3.5 w-3.5" />
                                                    {record.timeIn}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-sm font-medium border border-orange-100">
                                                    <Moon className="h-3.5 w-3.5" />
                                                    {record.timeOut}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge className={cn("inline-flex items-center gap-1", config.color)}>
                                                    <Icon className="h-3 w-3" />
                                                    {config.label}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {record.location ? (
                                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {record.location}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground italic">
                                                        {record.notes || "-"}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
