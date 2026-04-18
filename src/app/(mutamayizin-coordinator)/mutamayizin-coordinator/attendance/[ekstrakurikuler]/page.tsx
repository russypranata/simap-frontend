"use client";

import React, { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
    Calendar,
    CalendarCheck,
    Users,
    TrendingUp,
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    Download,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    ClipboardList,
} from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { cn } from "@/lib/utils";

interface EkskulData {
    id: number;
    name: string;
    tutor: string;
    category: string;
}

// Mock ekstrakurikuler data
const mockEkstrakurikulerData: Record<string, EkskulData> = {
    "1": { id: 1, name: "Pramuka", tutor: "Ahmad Fauzi, S.Pd", category: "Kepanduan" },
    "2": { id: 2, name: "PMR", tutor: "Siti Nurhaliza, S.Kep", category: "Kesehatan" },
    "3": { id: 3, name: "Paskibra", tutor: "Bambang Sutrisno, S.Pd", category: "Bela Negara" },
    "4": { id: 4, name: "Basket", tutor: "Dimas Prakoso, S.Pd", category: "Olahraga" },
};

// Mock attendance history
const mockAttendanceHistory = [
    {
        id: 1,
        date: "2026-01-02",
        activity: "Pertemuan Rutin",
        tutorStatus: "hadir",
        totalPresent: 42,
        totalAbsent: 3,
        percentage: 93,
        semester: "ganjil",
        academicYear: "2025/2026",
    },
    {
        id: 2,
        date: "2024-12-20",
        activity: "Pertemuan Rutin",
        tutorStatus: "hadir",
        totalPresent: 40,
        totalAbsent: 5,
        percentage: 89,
        semester: "ganjil",
        academicYear: "2024/2025",
    },
    {
        id: 3,
        date: "2024-11-29",
        activity: "Jambore Sekolah",
        tutorStatus: "hadir",
        totalPresent: 43,
        totalAbsent: 2,
        percentage: 96,
        semester: "ganjil",
        academicYear: "2024/2025",
    },
    {
        id: 4,
        date: "2024-10-25",
        activity: "Persiapan Lomba",
        tutorStatus: "hadir",
        totalPresent: 45,
        totalAbsent: 0,
        percentage: 100,
        semester: "ganjil",
        academicYear: "2024/2025",
    },
    {
        id: 5,
        date: "2024-09-20",
        activity: "Simulasi Kegiatan",
        tutorStatus: "hadir",
        totalPresent: 43,
        totalAbsent: 2,
        percentage: 96,
        semester: "ganjil",
        academicYear: "2024/2025",
    },
    {
        id: 5,
        date: "2024-05-15",
        activity: "Evaluasi Akhir",
        tutorStatus: "hadir",
        totalPresent: 40,
        totalAbsent: 5,
        percentage: 89,
        semester: "genap",
        academicYear: "2023/2024",
    },
    {
        id: 6,
        date: "2024-04-12",
        activity: "Latihan Dasar",
        tutorStatus: "hadir",
        totalPresent: 44,
        totalAbsent: 1,
        percentage: 98,
        semester: "genap",
        academicYear: "2023/2024",
    },
    {
        id: 7,
        date: "2024-03-08",
        activity: "Pertemuan Rutin",
        tutorStatus: "hadir",
        totalPresent: 38,
        totalAbsent: 7,
        percentage: 84,
        semester: "genap",
        academicYear: "2023/2024",
    },
    {
        id: 8,
        date: "2024-02-02",
        activity: "Materi Ruangan",
        tutorStatus: "hadir",
        totalPresent: 45,
        totalAbsent: 0,
        percentage: 100,
        semester: "genap",
        academicYear: "2023/2024",
    },
    {
        id: 9,
        date: "2024-01-26",
        activity: "Persiapan Semester",
        tutorStatus: "hadir",
        totalPresent: 44,
        totalAbsent: 1,
        percentage: 98,
        semester: "genap",
        academicYear: "2023/2024",
    },
    {
        id: 10,
        date: "2024-01-19",
        activity: "Pertemuan Rutin",
        tutorStatus: "hadir",
        totalPresent: 40,
        totalAbsent: 5,
        percentage: 89,
        semester: "genap",
        academicYear: "2023/2024",
    },
    {
        id: 11,
        date: "2024-12-06",
        activity: "Remedial Materi",
        tutorStatus: "hadir",
        totalPresent: 42,
        totalAbsent: 3,
        percentage: 93,
        semester: "ganjil",
        academicYear: "2024/2025",
    },
    {
        id: 12,
        date: "2024-11-22",
        activity: "Latihan Gabungan",
        tutorStatus: "hadir",
        totalPresent: 45,
        totalAbsent: 0,
        percentage: 100,
        semester: "ganjil",
        academicYear: "2024/2025",
    },
    {
        id: 13,
        date: "2024-11-15",
        activity: "Pertemuan Rutin",
        tutorStatus: "hadir",
        totalPresent: 38,
        totalAbsent: 7,
        percentage: 84,
        semester: "ganjil",
        academicYear: "2024/2025",
    },
    {
        id: 14,
        date: "2024-11-08",
        activity: "Evaluasi Bulanan",
        tutorStatus: "hadir",
        totalPresent: 43,
        totalAbsent: 2,
        percentage: 96,
        semester: "ganjil",
        academicYear: "2024/2025",
    },
];

export default function EkstrakurikulerAttendancePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const ekstrakurikulerId = params.ekstrakurikuler as string;

    const ekskul = mockEkstrakurikulerData[ekstrakurikulerId];

    const [searchQuery, setSearchQuery] = useState("");
    const [academicYearFilter, setAcademicYearFilter] = useState(searchParams.get("year") || "2025/2026");
    const [semesterFilter, setSemesterFilter] = useState(searchParams.get("semester") || "Ganjil");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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

    // Filter
    const filteredHistory = mockAttendanceHistory.filter((record) => {
        const matchesAcademicYear = academicYearFilter === "all" || record.academicYear === academicYearFilter;
        const matchesSemester = semesterFilter === "all" || record.semester === semesterFilter.toLowerCase();

        const formattedDate = formatDate(record.date, "dd MMMM yyyy").toLowerCase();
        const matchesSearch = formattedDate.includes(searchQuery.toLowerCase());

        return matchesSearch && matchesAcademicYear && matchesSemester;
    });

    // Calculate stats based on filtered data
    const totalMeetings = filteredHistory.length;
    const avgAttendance = totalMeetings > 0 ? Math.round(
        filteredHistory.reduce((sum, record) => sum + record.percentage, 0) / totalMeetings
    ) : 0;
    const lastMeeting = filteredHistory.length > 0 ? filteredHistory[0].date : null;

    // Pagination
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const paginatedHistory = filteredHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getSemesterLabel = (sem: string) => {
        if (sem === "all") return "Semua Semester";
        return sem === "ganjil" ? "Semester Ganjil" : "Semester Genap";
    };

    const getAcademicYearLabel = (year: string) => {
        if (year === "all") return "Semua Tahun";
        return `TA ${year}`;
    };

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
                    <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
                        <div>
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Presensi </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">{ekskul.name}</span>
                        </div>
                        <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
                            <CalendarCheck className="h-5 w-5 text-blue-700" />
                        </div>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Riwayat pertemuan dan kehadiran ekstrakurikuler {ekskul.name}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tutor: {ekskul.tutor}</span>
                        </div>
                    </div>
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
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white">Statistik Presensi</h2>
                            <p className="text-blue-100 text-sm">
                                Ringkasan performa kehadiran TA {academicYearFilter} {semesterFilter === "all" ? "(1 Tahun Penuh)" : `Semester ${semesterFilter}`}
                            </p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                                <Calendar className="h-4 w-4 text-blue-800" />
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

                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-purple-100 rounded-full mb-1.5">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <p className="text-lg font-bold">
                                {lastMeeting ? formatDate(lastMeeting, "dd MMM yyyy") : "-"}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Pertemuan Terakhir</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance History Table */}
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ClipboardList className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Riwayat Presensi Kegiatan</CardTitle>
                                <CardDescription>
                                    Daftar data kehadiran TA {academicYearFilter} {semesterFilter === "all" ? "(1 Tahun Penuh)" : `Semester ${semesterFilter}`}
                                </CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                            {filteredHistory.length} Presensi
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="p-4 border-b">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari tanggal..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
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
                            <div className="flex items-center gap-2">
                                <Button className="bg-blue-800 hover:bg-blue-900 text-white">
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

                                    <th className="text-left p-4 font-medium text-sm min-w-[180px]">Status Tutor</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Hadir</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Tidak Hadir</th>
                                    <th className="text-center p-4 font-medium text-sm w-32">Persentase</th>
                                    <th className="text-center p-4 font-medium text-sm w-32">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-0">
                                            <div className="flex flex-col items-center justify-center py-16">
                                                <div className="p-4 bg-muted/50 rounded-full mb-4">
                                                    <Calendar className="h-10 w-10 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                                    Belum Ada Data Presensi
                                                </h3>
                                                <p className="text-sm text-muted-foreground text-center max-w-md px-4">
                                                    Tidak ada data presensi untuk periode {getAcademicYearLabel(academicYearFilter)} - {getSemesterLabel(semesterFilter)}.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedHistory.map((record, index) => {
                                        const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                                        return (
                                            <tr key={record.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="p-4 text-sm">{globalIndex}</td>
                                                <td className="p-4 text-sm">
                                                    {formatDate(record.date, "dd MMMM yyyy")}
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
                                                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 min-w-[3rem] justify-center">
                                                        {record.totalPresent}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 min-w-[3rem] justify-center">
                                                        {record.totalAbsent}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Badge variant="outline" className={getAttendanceBadgeColor(record.percentage)}>
                                                        {record.percentage}%
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-3 bg-blue-100 hover:bg-blue-200 text-blue-800 hover:text-blue-900 border-blue-200 transition-colors"
                                                            onClick={() => router.push(`/mutamayizin-coordinator/attendance/${ekstrakurikulerId}/${record.id}`)}
                                                        >
                                                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                            Detail
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer with Pagination */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-muted/20">
                        {/* Left: Pagination Info */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Menampilkan</span>
                            <span className="font-medium text-foreground">
                                {filteredHistory.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                            </span>
                            <span>-</span>
                            <span className="font-medium text-foreground">
                                {Math.min(currentPage * itemsPerPage, filteredHistory.length)}
                            </span>
                            <span>dari</span>
                            <span className="font-medium text-foreground">{filteredHistory.length}</span>
                            <span>data</span>
                        </div>

                        {/* Right: Pagination Controls */}
                        <div className="flex items-center gap-3">
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(val) => {
                                    setItemsPerPage(Number(val));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[110px] h-8 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 / hal</SelectItem>
                                    <SelectItem value="10">10 / hal</SelectItem>
                                    <SelectItem value="25">25 / hal</SelectItem>
                                    <SelectItem value="50">50 / hal</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNumber = i + 1;
                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={currentPage === pageNumber ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={cn(
                                                "h-8 w-8 p-0",
                                                currentPage === pageNumber && "bg-blue-800 hover:bg-blue-900 text-white"
                                            )}
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
