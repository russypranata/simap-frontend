"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calendar,
    Users,
    TrendingUp,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit,
    Trash2,
    Download,
    ArrowLeft,
    Plus,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { cn } from "@/lib/utils";

// Mock ekstrakurikuler data
const mockEkstrakurikulerData: Record<string, any> = {
    "1": { id: 1, name: "Pramuka", tutor: "Ahmad Fauzi, S.Pd", category: "Kepanduan" },
    "2": { id: 2, name: "PMR", tutor: "Siti Nurhaliza, S.Kep", category: "Kesehatan" },
    "3": { id: 3, name: "Paskibra", tutor: "Bambang Sutrisno, S.Pd", category: "Bela Negara" },
    "4": { id: 4, name: "Basket", tutor: "Dimas Prakoso, S.Pd", category: "Olahraga" },
};

// Mock attendance history
const mockAttendanceHistory = [
    {
        id: 1,
        date: "2024-12-20",
        activity: "Pertemuan Rutin",
        tutorStatus: "hadir",
        totalPresent: 40,
        totalAbsent: 5,
        percentage: 89,
    },
    {
        id: 2,
        date: "2024-12-13",
        activity: "Latihan Upacara",
        tutorStatus: "hadir",
        totalPresent: 42,
        totalAbsent: 3,
        percentage: 93,
    },
    {
        id: 3,
        date: "2024-12-06",
        activity: "Pertemuan Rutin",
        tutorStatus: null, // Tutor lupa isi tab presensi sendiri
        totalPresent: 38,
        totalAbsent: 7,
        percentage: 84,
    },
    {
        id: 4,
        date: "2024-11-29",
        activity: "Jambore Sekolah",
        tutorStatus: "hadir",
        totalPresent: 43,
        totalAbsent: 2,
        percentage: 96,
    },
    {
        id: 5,
        date: "2024-11-22",
        activity: "Pertemuan Rutin",
        tutorStatus: null, // Tutor lupa isi tab presensi sendiri
        totalPresent: 41,
        totalAbsent: 4,
        percentage: 91,
    },
];

export default function EkstrakurikulerAttendancePage() {
    const router = useRouter();
    const params = useParams();
    const ekstrakurikulerId = params.ekstrakurikuler as string;

    const ekskul = mockEkstrakurikulerData[ekstrakurikulerId];

    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    if (!ekskul) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Ekstrakurikuler Tidak Ditemukan</h2>
                    <Button onClick={() => router.back()} className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                    </Button>
                </div>
            </div>
        );
    }

    // Calculate stats
    const totalMeetings = mockAttendanceHistory.length;
    const avgAttendance = Math.round(
        mockAttendanceHistory.reduce((sum, record) => sum + record.percentage, 0) / totalMeetings
    );

    // Filter
    const filteredHistory = mockAttendanceHistory.filter((record) => {
        const matchesSearch = record.activity.toLowerCase().includes(searchQuery.toLowerCase());
        // Add date filter logic here
        return matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const paginatedHistory = filteredHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getAttendanceBadgeColor = (percentage: number) => {
        if (percentage >= 90) return "bg-green-100 text-green-700 border-green-200";
        if (percentage >= 75) return "bg-yellow-100 text-yellow-700 border-yellow-200";
        return "bg-red-100 text-red-700 border-red-200";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start space-x-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                    className="mt-1.5"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Presensi </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">{ekskul.name}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Tutor: {ekskul.tutor} • {ekskul.category}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <Card>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-purple-100 rounded-full mb-2">
                                <Calendar className="h-5 w-5 text-purple-600" />
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

                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-blue-100 rounded-full mb-2">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="text-lg font-bold">{formatDate(mockAttendanceHistory[0].date, "dd MMM yyyy")}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Pertemuan Terakhir</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance History Table */}
            <Card>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="p-4 border-b">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kegiatan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 sticky top-0">
                                <tr>
                                    <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-[120px]">Tanggal</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-[200px]">Kegiatan</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-[180px]">Status Tutor</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Hadir</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Tidak Hadir</th>
                                    <th className="text-center p-4 font-medium text-sm w-32">Persentase</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedHistory.map((record, index) => {
                                    const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                                    return (
                                        <tr key={record.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-sm">{globalIndex}</td>
                                            <td className="p-4 text-sm">
                                                {formatDate(record.date, "dd MMMM yyyy")}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium">{record.activity}</div>
                                            </td>
                                            <td className="p-4">
                                                {record.tutorStatus === "hadir" ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                        </div>
                                                        <span className="text-sm font-medium">{ekskul.tutor}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                            <AlertCircle className="h-4 w-4 text-amber-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-amber-700">Belum Terisi</p>
                                                            <p className="text-xs text-muted-foreground">Tutor belum mengisi presensi</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="font-semibold text-green-600">
                                                    {record.totalPresent}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="font-semibold text-red-600">
                                                    {record.totalAbsent}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <Badge variant="outline" className={getAttendanceBadgeColor(record.percentage)}>
                                                    {record.percentage}%
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.push(`/mutamayizin-coordinator/attendance/${ekstrakurikulerId}/${record.id}`)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Lihat
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {paginatedHistory.length} dari {filteredHistory.length} data
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm">
                                    Halaman {currentPage} dari {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
