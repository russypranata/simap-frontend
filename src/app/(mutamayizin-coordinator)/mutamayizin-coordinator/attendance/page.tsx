"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CalendarCheck,
    Users,
    TrendingUp,
    Award,
    Search,
    Plus,
    ArrowRight,
    Filter,
    Calendar,
} from "lucide-react";

// Mock data untuk ekstrakurikuler
const mockEkstrakurikuler = [
    {
        id: 1,
        name: "Pramuka",
        category: "Kepanduan",
        tutor: "Ahmad Fauzi, S.Pd",
        totalMembers: 45,
        totalMeetings: 12,
        avgAttendance: 92,
        lastMeeting: "2024-12-20",
        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    {
        id: 2,
        name: "PMR",
        category: "Kesehatan",
        tutor: "Siti Nurhaliza, S.Kep",
        totalMembers: 30,
        totalMeetings: 10,
        avgAttendance: 88,
        lastMeeting: "2024-12-19",
        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    {
        id: 3,
        name: "Paskibra",
        category: "Bela Negara",
        tutor: "Bambang Sutrisno, S.Pd",
        totalMembers: 25,
        totalMeetings: 15,
        avgAttendance: 95,
        lastMeeting: "2024-12-21",
        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    {
        id: 4,
        name: "Basket",
        category: "Olahraga",
        tutor: "Dimas Prakoso, S.Pd",
        totalMembers: 20,
        totalMeetings: 18,
        avgAttendance: 85,
        lastMeeting: "2024-12-18",
        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    {
        id: 5,
        name: "Futsal",
        category: "Olahraga",
        tutor: "Rudi Hartono, S.Pd",
        totalMembers: 22,
        totalMeetings: 16,
        avgAttendance: 88,
        lastMeeting: "2024-06-15",
        academicYear: "2024/2025",
        semester: "Genap",
    },
];

export default function AttendanceDashboard() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [academicYearFilter, setAcademicYearFilter] = useState("2025/2026");
    const [semesterFilter, setSemesterFilter] = useState("Ganjil");

    // Calculate overall stats
    // Filter ekstrakurikuler
    const filteredEkskul = mockEkstrakurikuler.filter((ekskul) => {
        const matchesSearch = ekskul.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ekskul.tutor.toLowerCase().includes(searchQuery.toLowerCase());

        // For mock purposes, assume standard props. In real app, data structure might differ.
        // We added dummy props to mock data above.
        const ekskulYear = (ekskul as any).academicYear;
        const ekskulSemester = (ekskul as any).semester;

        const matchesYear = academicYearFilter === "all" || ekskulYear === academicYearFilter;
        const matchesSemester = semesterFilter === "all" || ekskulSemester === semesterFilter;

        return matchesSearch && matchesYear && matchesSemester;
    });

    // Calculate overall stats based on FILTERED data
    const totalEkskul = filteredEkskul.length;
    const totalMembers = filteredEkskul.reduce((sum, ekskul) => sum + ekskul.totalMembers, 0);
    const totalMeetings = filteredEkskul.reduce((sum, ekskul) => sum + ekskul.totalMeetings, 0);
    const avgAttendance = totalEkskul > 0
        ? Math.round(filteredEkskul.reduce((sum, ekskul) => sum + ekskul.avgAttendance, 0) / totalEkskul)
        : 0;

    const getAttendanceBadgeColor = (percentage: number) => {
        if (percentage >= 90) return "bg-green-100 text-green-700 border-green-200";
        if (percentage >= 75) return "bg-yellow-100 text-yellow-700 border-yellow-200";
        return "bg-red-100 text-red-700 border-red-200";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Presensi </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Ekstrakurikuler</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <CalendarCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Monitor dan kelola data presensi semua kegiatan ekstrakurikuler
                    </p>

                </div>
            </div>

            {/* Stats Cards */}
            <Card className="overflow-hidden p-0">
                <div className="bg-blue-800 p-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Statistik Presensi</h2>
                            <p className="text-blue-100 text-sm">
                                Ringkasan performa kehadiran TA {academicYearFilter} {semesterFilter === "all" ? "(1 Tahun Penuh)" : `Semester ${semesterFilter}`}
                            </p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                                <Award className="h-4 w-4 text-blue-800" />
                            </div>
                            <p className="text-2xl font-bold">{totalEkskul}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Ekstrakurikuler</p>
                        </div>

                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-green-100 rounded-full mb-1.5">
                                <Users className="h-4 w-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold">{totalMembers}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Anggota</p>
                        </div>

                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-purple-100 rounded-full mb-1.5">
                                <CalendarCheck className="h-4 w-4 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold">{totalMeetings}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Pertemuan</p>
                        </div>

                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-green-100 rounded-full mb-1.5">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">{avgAttendance}%</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Rata-rata Kehadiran</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ekstrakurikuler List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <CalendarCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Rekap Presensi Ekstrakurikuler</CardTitle>
                                <CardDescription>
                                    Daftar kehadiran per ekstrakurikuler TA {academicYearFilter} {semesterFilter === "all" ? "(1 Tahun Penuh)" : `Semester ${semesterFilter}`}. Pilih untuk detail.
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {filteredEkskul.length} Ekstrakurikuler
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="px-4 pb-4 pt-4 border-b">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Search - Fixed Width (Not Full) */}
                            <div className="relative w-full lg:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama ekskul atau tutor..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9"
                                />
                            </div>

                            {/* Filters - Grouped Right */}
                            <div className="flex flex-wrap gap-2">
                                <Select value={academicYearFilter} onValueChange={setAcademicYearFilter}>
                                    <SelectTrigger className="w-full sm:w-[150px] h-9">
                                        <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                        <SelectValue placeholder="TA" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2025/2026">2025/2026</SelectItem>
                                        <SelectItem value="2024/2025">2024/2025</SelectItem>
                                        <SelectItem value="2023/2024">2023/2024</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                                    <SelectTrigger className="w-full sm:w-[140px] h-9">
                                        <SelectValue placeholder="Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">1 Tahun Penuh</SelectItem>
                                        <SelectItem value="Ganjil">Ganjil</SelectItem>
                                        <SelectItem value="Genap">Genap</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Grid Cards */}
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredEkskul.map((ekskul) => (
                                <Card
                                    key={ekskul.id}
                                    className="transition-colors cursor-pointer group hover:bg-muted/30"
                                    onClick={() => router.push(`/mutamayizin-coordinator/attendance/${ekskul.id}?year=${encodeURIComponent(academicYearFilter)}&semester=${encodeURIComponent(semesterFilter)}`)}
                                >
                                    <CardContent className="p-0">
                                        {/* Header with Icon */}
                                        <div className="p-4 border-b">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <Award className="h-5 w-5 text-blue-800" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-base group-hover:text-blue-800 transition-colors truncate">
                                                        {ekskul.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {ekskul.tutor}
                                                    </p>
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-800 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3 rounded-lg bg-muted/30">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Users className="h-4 w-4 text-blue-600" />
                                                        <span className="text-xs text-muted-foreground">Anggota</span>
                                                    </div>
                                                    <p className="text-lg font-bold text-blue-800">{ekskul.totalMembers}</p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-muted/30">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <CalendarCheck className="h-4 w-4 text-purple-600" />
                                                        <span className="text-xs text-muted-foreground">Pertemuan</span>
                                                    </div>
                                                    <p className="text-lg font-bold">{ekskul.totalMeetings}x</p>
                                                </div>
                                            </div>

                                            {/* Attendance */}
                                            <div className="mt-3 p-3 rounded-lg bg-muted/30">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                                        <span className="text-sm text-muted-foreground">Rata-rata Kehadiran</span>
                                                    </div>
                                                    <Badge variant="outline" className={getAttendanceBadgeColor(ekskul.avgAttendance)}>
                                                        {ekskul.avgAttendance}%
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredEkskul.length === 0 && (
                            <div className="text-center py-12">
                                <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">Tidak Ada Data</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Tidak ada ekstrakurikuler yang cocok dengan pencarian
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="p-4 text-sm text-muted-foreground flex items-center gap-1">
                        <span>Menampilkan</span>
                        <span className="font-medium text-foreground">{filteredEkskul.length}</span>
                        <span>dari</span>
                        <span className="font-medium text-foreground">{totalEkskul}</span>
                        <span>ekstrakurikuler</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
