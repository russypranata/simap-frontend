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
    Calendar,
    User,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { StatCard } from "@/features/shared/components";

// Mock history data
const mockHistoryData = [
    {
        id: 1,
        date: "2025-12-13",
        studentId: 1,
        studentName: "Ahmad Rizky",
        studentNIS: "2024101",
        studentClass: "XII A",
        arrivalTime: "08:15",
        note: "Terlambat karena hujan deras",
        recordedBy: "Pak Budi Santoso",
        recordedAt: "2025-12-13T08:15:30Z",
    },
    {
        id: 2,
        date: "2025-12-13",
        studentId: 2,
        studentName: "Budi Santoso",
        studentNIS: "2024102",
        studentClass: "XII A",
        arrivalTime: "08:20",
        note: "Macet di jalan",
        recordedBy: "Bu Ani Wijaya",
        recordedAt: "2025-12-13T08:20:15Z",
    },
    {
        id: 3,
        date: "2025-12-12",
        studentId: 3,
        studentName: "Citra Dewi",
        studentNIS: "2024103",
        studentClass: "XII A",
        arrivalTime: "08:10",
        note: "Ban motor kempes",
        recordedBy: "Pak Budi Santoso",
        recordedAt: "2025-12-12T08:10:45Z",
    },
    {
        id: 4,
        date: "2025-12-12",
        studentId: 5,
        studentName: "Eko Prasetyo",
        studentNIS: "2024105",
        studentClass: "XII B",
        arrivalTime: "08:25",
        note: "Bangun kesiangan",
        recordedBy: "Bu Ani Wijaya",
        recordedAt: "2025-12-12T08:25:20Z",
    },
    {
        id: 5,
        date: "2025-12-11",
        studentId: 7,
        studentName: "Gunawan",
        studentNIS: "2024107",
        studentClass: "XI A",
        arrivalTime: "08:05",
        note: "Antar adik dulu",
        recordedBy: "Pak Budi Santoso",
        recordedAt: "2025-12-11T08:05:30Z",
    },
];

export default function LateRecordHistory() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("all");
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
            const matchTeacher = selectedTeacher === "all" || record.recordedBy === selectedTeacher;
            return matchSearch && matchClass && matchTeacher;
        });
    }, [searchQuery, selectedClass, selectedTeacher]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Get unique teachers
    const teachers = Array.from(new Set(mockHistoryData.map((r) => r.recordedBy)));

    const todayCount = mockHistoryData.filter((r) => r.date === format(new Date(), "yyyy-MM-dd")).length;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard title="Total Catatan" value={filteredData.length} subtitle={`Dari ${mockHistoryData.length} total catatan`} icon={History} color="blue" />
                <StatCard title="Hari Ini" value={todayCount} subtitle="Catatan hari ini" icon={Calendar} color="amber" />
                <StatCard title="Guru Piket Aktif" value={teachers.length} subtitle="Guru yang mencatat" icon={User} color="green" />
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <History className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Riwayat Lengkap</CardTitle>
                                <CardDescription>
                                    Data keterlambatan dari semua guru piket
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

                        <div className="flex gap-2">
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className="bg-muted/30 flex-1">
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    <SelectItem value="XII A">XII A</SelectItem>
                                    <SelectItem value="XII B">XII B</SelectItem>
                                    <SelectItem value="XI A">XI A</SelectItem>
                                    <SelectItem value="X A">X A</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                <SelectTrigger className="bg-muted/30 flex-1">
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
                        <Card className="border-muted">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="text-left p-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                            <th className="text-left p-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                                                Siswa
                                            </th>
                                            <th className="text-center p-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider w-[100px]">
                                                Waktu
                                            </th>
                                            <th className="text-left p-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                                                Keterangan
                                            </th>
                                            <th className="text-left p-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                                                Dicatat Oleh
                                            </th>
                                            <th className="w-[60px] p-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.map((record) => (
                                            <tr
                                                key={record.id}
                                                className="border-b hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="p-3">
                                                    <div className="text-sm font-medium">
                                                        {format(new Date(record.date), "dd MMM yyyy", { locale: id })}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold shrink-0 border border-red-200">
                                                            {record.studentName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-sm">{record.studentName}</div>
                                                            <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
                                                                <span className="text-xs font-mono text-muted-foreground">
                                                                    {record.studentNIS}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">•</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {record.studentClass}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <Badge className="font-mono text-xs bg-orange-100 text-orange-700 border-orange-200">
                                                        {record.arrivalTime}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <p className="text-sm text-muted-foreground italic line-clamp-2">
                                                        {record.note || "-"}
                                                    </p>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm font-medium text-primary">
                                                            {record.recordedBy}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
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
