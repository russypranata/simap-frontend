 
"use client";

import React, { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    History,
    Search,
    User,
    Moon,
    Eye,
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    Sun,
    Sunrise,
    CloudSun,
    Sunset,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Prayer times
const PRAYER_TIMES = [
    { id: "subuh", name: "Subuh", icon: Sunrise },
    { id: "dhuha", name: "Dhuha", icon: Sun },
    { id: "dzuhur", name: "Dzuhur", icon: CloudSun },
    { id: "ashar", name: "Ashar", icon: Sun },
    { id: "maghrib", name: "Maghrib", icon: Sunset },
    { id: "isya", name: "Isya", icon: Moon },
] as const;

// Mock history data
const mockHistoryData = [
    {
        id: 1,
        date: "2025-12-14",
        studentId: 1,
        studentName: "Ahmad Rizky",
        studentNIS: "2024101",
        studentClass: "XII A",
        prayerTime: "dzuhur",
        prayerName: "Dzuhur",
        status: "hadir",
        note: "Tepat waktu",
        recordedBy: "Pak Budi Santoso",
        recordedAt: "2025-12-14T12:15:30Z",
    },
    {
        id: 2,
        date: "2025-12-14",
        studentId: 2,
        studentName: "Budi Santoso",
        studentNIS: "2024102",
        studentClass: "XII A",
        prayerTime: "dzuhur",
        prayerName: "Dzuhur",
        status: "tidak",
        note: "Sakit",
        recordedBy: "Pak Budi Santoso",
        recordedAt: "2025-12-14T12:16:15Z",
    },
    {
        id: 3,
        date: "2025-12-13",
        studentId: 3,
        studentName: "Citra Dewi",
        studentNIS: "2024103",
        studentClass: "XII A",
        prayerTime: "ashar",
        prayerName: "Ashar",
        status: "hadir",
        note: "",
        recordedBy: "Bu Ani Wijaya",
        recordedAt: "2025-12-13T15:10:45Z",
    },
    {
        id: 4,
        date: "2025-12-13",
        studentId: 5,
        studentName: "Eko Prasetyo",
        studentNIS: "2024105",
        studentClass: "XII B",
        prayerTime: "dzuhur",
        prayerName: "Dzuhur",
        status: "hadir",
        note: "",
        recordedBy: "Pak Budi Santoso",
        recordedAt: "2025-12-13T12:25:20Z",
    },
    {
        id: 5,
        date: "2025-12-12",
        studentId: 7,
        studentName: "Gunawan",
        studentNIS: "2024107",
        studentClass: "XI A",
        prayerTime: "subuh",
        prayerName: "Subuh",
        status: "hadir",
        note: "Jamaah di masjid",
        recordedBy: "Pak Budi Santoso",
        recordedAt: "2025-12-12T05:05:30Z",
    },
];

export default function PrayerRecordHistory() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("all");
    const [selectedPrayer, setSelectedPrayer] = useState("all");
    const [selectedTeacher, setSelectedTeacher] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter data
    const filteredData = useMemo(() => {
        return mockHistoryData.filter((record) => {
            const matchSearch =
                !searchQuery ||
                record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.studentNIS.includes(searchQuery);
            const matchClass = selectedClass === "all" || record.studentClass === selectedClass;
            const matchPrayer = selectedPrayer === "all" || record.prayerTime === selectedPrayer;
            const matchTeacher = selectedTeacher === "all" || record.recordedBy === selectedTeacher;
            return matchSearch && matchClass && matchPrayer && matchTeacher;
        });
    }, [searchQuery, selectedClass, selectedPrayer, selectedTeacher]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Get unique teachers
    const teachers = Array.from(new Set(mockHistoryData.map((r) => r.recordedBy)));

    // Statistics
    const stats = useMemo(() => {
        const total = filteredData.length;
        const today = filteredData.filter((r) => r.date === format(new Date(), "yyyy-MM-dd")).length;
        const hadir = filteredData.filter((r) => r.status === "hadir").length;
        return { total, today, hadir };
    }, [filteredData]);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Catatan</CardTitle>
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <History className="h-5 w-5 text-slate-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Dari {mockHistoryData.length} total catatan
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Moon className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
                        <p className="text-xs text-muted-foreground mt-1">Catatan hari ini</p>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kehadiran</CardTitle>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Check className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.hadir}</div>
                        <p className="text-xs text-muted-foreground mt-1">Siswa hadir sholat</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <History className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Riwayat Lengkap</CardTitle>
                                <CardDescription>
                                    Data presensi sholat dari semua guru piket
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col gap-3 mt-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau NIS siswa..."
                                className="pl-9 bg-muted/30"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            <Select value={selectedPrayer} onValueChange={setSelectedPrayer}>
                                <SelectTrigger className="bg-muted/30 flex-1 min-w-[150px]">
                                    <SelectValue placeholder="Waktu Sholat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Waktu</SelectItem>
                                    {PRAYER_TIMES.map((prayer) => (
                                        <SelectItem key={prayer.id} value={prayer.id}>
                                            {prayer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className="bg-muted/30 flex-1 min-w-[150px]">
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    <SelectItem value="XII A">XII A</SelectItem>
                                    <SelectItem value="XII B">XII B</SelectItem>
                                    <SelectItem value="XI A">XI A</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                <SelectTrigger className="bg-muted/30 flex-1 min-w-[150px]">
                                    <SelectValue placeholder="Guru Piket" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Guru</SelectItem>
                                    {teachers.map((teacher) => (
                                        <SelectItem key={teacher} value={teacher}>
                                            {teacher}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={itemsPerPage === 999999 ? "all" : String(itemsPerPage)}
                                onValueChange={(value) => {
                                    setItemsPerPage(value === "all" ? 999999 : Number(value));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="bg-muted/30 w-[130px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">Tampil 10</SelectItem>
                                    <SelectItem value="20">Tampil 20</SelectItem>
                                    <SelectItem value="50">Tampil 50</SelectItem>
                                    <SelectItem value="all">Semua</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    {filteredData.length > 0 ? (
                        <Card className="border-slate-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                            <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                                                Siswa
                                            </th>
                                            <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider w-[100px]">
                                                Waktu
                                            </th>
                                            <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider w-[100px]">
                                                Status
                                            </th>
                                            <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                                                Keterangan
                                            </th>
                                            <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                                                Dicatat Oleh
                                            </th>
                                            <th className="w-[60px] p-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.map((record) => {
                                            const PrayerIcon = PRAYER_TIMES.find((p) => p.id === record.prayerTime)?.icon || Moon;
                                            return (
                                                <tr
                                                    key={record.id}
                                                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                                                >
                                                    <td className="p-4">
                                                        <div className="text-sm font-semibold text-slate-800">
                                                            {format(new Date(record.date), "dd MMM yyyy", { locale: id })}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0 border border-indigo-100">
                                                                {record.studentName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-sm text-slate-800">{record.studentName}</div>
                                                                <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
                                                                    <span className="text-xs font-mono text-slate-500">
                                                                        {record.studentNIS}
                                                                    </span>
                                                                    <span className="text-xs text-slate-400">·</span>
                                                                    <span className="text-xs text-slate-500">
                                                                        {record.studentClass}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <PrayerIcon className="h-3 w-3 text-slate-500" />
                                                            <span className="text-sm font-medium text-slate-700">{record.prayerName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <Badge
                                                            className={
                                                                record.status === "hadir"
                                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                                    : "bg-red-100 text-red-700 border-red-200"
                                                            }
                                                        >
                                                            {record.status === "hadir" ? (
                                                                <Check className="h-3 w-3 mr-1" />
                                                            ) : (
                                                                <X className="h-3 w-3 mr-1" />
                                                            )}
                                                            {record.status === "hadir" ? "Hadir" : "Tidak"}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">
                                                        <p className="text-sm text-slate-500 italic line-clamp-2">
                                                            {record.note || "-"}
                                                        </p>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-slate-400" />
                                                            <span className="text-sm font-medium text-blue-700">
                                                                {record.recordedBy}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between p-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredData.length)} dari{" "}
                                        {filteredData.length} catatan
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="text-sm font-medium">
                                            Halaman {currentPage} dari {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <History className="h-12 w-12 mb-3 opacity-20" />
                            <p className="text-sm font-medium">Tidak ada data riwayat</p>
                            <p className="text-xs mt-1">Coba ubah filter pencarian</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
