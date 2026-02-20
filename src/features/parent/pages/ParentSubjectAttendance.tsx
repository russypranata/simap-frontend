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
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    BookOpen,
    Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface SubjectAttendanceRecord {
    id: number;
    date: string;
    day: string;
    subject: string;
    teacher: string;
    status: "hadir" | "izin" | "sakit" | "alpa";
    time: string;
    notes?: string;
}

// Mock data (Subject Attendance Only)
const mockSubjectRecords: SubjectAttendanceRecord[] = [
    { id: 1, date: "2026-01-10", day: "Jumat", subject: "Matematika", teacher: "Pak Ahmad", status: "hadir", time: "07:45" },
    { id: 2, date: "2026-01-10", day: "Jumat", subject: "Fisika", teacher: "Bu Sari", status: "hadir", time: "09:30" },
    { id: 3, date: "2026-01-09", day: "Kamis", subject: "Kimia", teacher: "Pak Rudi", status: "hadir", time: "07:00" },
    { id: 4, date: "2026-01-09", day: "Kamis", subject: "PKn", teacher: "Bu Rina", status: "hadir", time: "10:15" },
    { id: 5, date: "2026-01-08", day: "Rabu", subject: "Bahasa Inggris", teacher: "Pak Budi", status: "izin", time: "08:30", notes: "Lomba" },
    { id: 6, date: "2026-01-08", day: "Rabu", subject: "Seni Budaya", teacher: "Bu Ratna", status: "izin", time: "10:15", notes: "Lomba" },
    { id: 7, date: "2026-01-07", day: "Selasa", subject: "Biologi", teacher: "Bu Ani", status: "hadir", time: "07:45" },
    { id: 8, date: "2026-01-07", day: "Selasa", subject: "Sejarah", teacher: "Pak Hendra", status: "hadir", time: "10:15" },
    { id: 9, date: "2026-01-06", day: "Senin", subject: "Upacara", teacher: "-", status: "hadir", time: "07:00" },
    { id: 10, date: "2026-01-06", day: "Senin", subject: "Matematika", teacher: "Pak Ahmad", status: "hadir", time: "07:45" },
    { id: 13, date: "2025-12-20", day: "Jumat", subject: "Matematika", teacher: "Pak Ahmad", status: "hadir", time: "08:30" },
    { id: 14, date: "2025-12-19", day: "Kamis", subject: "Kimia", teacher: "Pak Rudi", status: "hadir", time: "07:00" },
    { id: 15, date: "2025-12-18", day: "Rabu", subject: "PJOK", teacher: "Pak Dedi", status: "alpa", time: "12:30" },
];

const getStatusConfig = (status: SubjectAttendanceRecord["status"]) => {
    const configs = {
        hadir: { label: "Hadir", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
        izin: { label: "Izin", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
        sakit: { label: "Sakit", color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertCircle },
        alpa: { label: "Alpa", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
    };
    return configs[status];
};

export const ParentSubjectAttendance: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedSubject, setSelectedSubject] = useState("all");

    // Extract unique subjects
    const subjects = useMemo(() => {
        const unique = new Set(mockSubjectRecords.map(r => r.subject));
        return Array.from(unique).sort();
    }, []);

    // Filter records
    const filteredRecords = useMemo(() => {
        return mockSubjectRecords.filter(record => {
            const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
            const matchesSubject = selectedSubject === "all" || record.subject === selectedSubject;
            return matchesStatus && matchesSubject;
        });
    }, [selectedStatus, selectedSubject]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Presensi </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Mata Pelajaran</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <BookOpen className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Rekap kehadiran KBM di kelas
                    </p>
                </div>
            </div>

            {/* Attendance History */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg">Riwayat KBM</CardTitle>
                            <CardDescription>Detail kehadiran per jam pelajaran</CardDescription>
                        </div>
                        <div className="flex gap-3">
                             <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger className="w-[180px]">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Pilih Mapel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Mapel</SelectItem>
                                    {subjects.map(s => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-[150px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Status" />
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
                            <tbody className="divide-y">
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
                                            <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{record.day}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(record.date).toLocaleDateString("id-ID", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric"
                                                            })}
                                                        </span>
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
        </div>
    );
};
