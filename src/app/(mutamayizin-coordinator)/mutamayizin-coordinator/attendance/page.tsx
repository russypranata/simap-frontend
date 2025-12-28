"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
        pembina: "Ahmad Fauzi, S.Pd",
        totalMembers: 45,
        totalMeetings: 12,
        avgAttendance: 92,
        lastMeeting: "2024-12-20",
    },
    {
        id: 2,
        name: "PMR",
        category: "Kesehatan",
        pembina: "Siti Nurhaliza, S.Kep",
        totalMembers: 30,
        totalMeetings: 10,
        avgAttendance: 88,
        lastMeeting: "2024-12-19",
    },
    {
        id: 3,
        name: "Paskibra",
        category: "Bela Negara",
        pembina: "Bambang Sutrisno, S.Pd",
        totalMembers: 25,
        totalMeetings: 15,
        avgAttendance: 95,
        lastMeeting: "2024-12-21",
    },
    {
        id: 4,
        name: "Basket",
        category: "Olahraga",
        pembina: "Dimas Prakoso, S.Pd",
        totalMembers: 20,
        totalMeetings: 18,
        avgAttendance: 85,
        lastMeeting: "2024-12-18",
    },
];

export default function AttendanceDashboard() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Calculate overall stats
    const totalEkskul = mockEkstrakurikuler.length;
    const totalMembers = mockEkstrakurikuler.reduce((sum, ekskul) => sum + ekskul.totalMembers, 0);
    const totalMeetings = mockEkstrakurikuler.reduce((sum, ekskul) => sum + ekskul.totalMeetings, 0);
    const avgAttendance = Math.round(
        mockEkstrakurikuler.reduce((sum, ekskul) => sum + ekskul.avgAttendance, 0) / totalEkskul
    );

    // Filter ekstrakurikuler
    const filteredEkskul = mockEkstrakurikuler.filter((ekskul) => {
        const matchesSearch = ekskul.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ekskul.pembina.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || ekskul.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getCategoryBadgeColor = (category: string) => {
        const colors: Record<string, string> = {
            "Kepanduan": "bg-blue-100 text-blue-800 border-blue-200",
            "Kesehatan": "bg-green-100 text-green-800 border-green-200",
            "Bela Negara": "bg-red-100 text-red-800 border-red-200",
            "Olahraga": "bg-orange-100 text-orange-800 border-orange-200",
        };
        return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
    };

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
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-sm font-medium text-blue-800">
                            Semester Ganjil
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <Card>
                <CardContent className="p-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-blue-100 rounded-full mb-2">
                                <Award className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold">{totalEkskul}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Ekstrakurikuler</p>
                        </div>

                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-green-100 rounded-full mb-2">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold">{totalMembers}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Anggota</p>
                        </div>

                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-purple-100 rounded-full mb-2">
                                <CalendarCheck className="h-5 w-5 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold">{totalMeetings}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Pertemuan</p>
                        </div>

                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-green-100 rounded-full mb-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">{avgAttendance}%</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Rata-rata Kehadiran</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ekstrakurikuler List */}
            <Card>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="p-4 border-b">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama ekskul atau pembina..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        <SelectItem value="Kepanduan">Kepanduan</SelectItem>
                                        <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                                        <SelectItem value="Bela Negara">Bela Negara</SelectItem>
                                        <SelectItem value="Olahraga">Olahraga</SelectItem>
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
                                    className="hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => router.push(`/mutamayizin-coordinator/attendance/${ekskul.id}`)}
                                >
                                    <CardContent className="p-5">
                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">{ekskul.name}</h3>
                                                    <Badge variant="outline" className={`mt-1 ${getCategoryBadgeColor(ekskul.category)}`}>
                                                        {ekskul.category}
                                                    </Badge>
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                            </div>

                                            {/* Info */}
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center text-muted-foreground">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    <span>Pembina: {ekskul.pembina}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Anggota:</span>
                                                    <span className="font-semibold">{ekskul.totalMembers} siswa</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted-foreground">Pertemuan:</span>
                                                    <span className="font-semibold">{ekskul.totalMeetings}x</span>
                                                </div>
                                            </div>

                                            {/* Attendance Badge */}
                                            <div className="pt-3 border-t">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Rata-rata Kehadiran:</span>
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
                    <div className="p-4 border-t text-sm text-muted-foreground">
                        Menampilkan {filteredEkskul.length} dari {totalEkskul} ekstrakurikuler
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
