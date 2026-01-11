"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    FileSpreadsheet,
    Calendar,
    Download,
    Search,
    Filter,
    TrendingUp,
    Users,
    Clock,
    ChevronLeft,
    ChevronRight,
    FileText,
    Eye,
    CheckCircle,
    FileType,
    RefreshCw,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
type ExportFormat = "csv" | "excel" | "pdf";
type SortField = "date" | "tutorName" | "ekstrakurikuler" | "startTime" | "endTime";
type SortOrder = "asc" | "desc";

// Helper Functions for Display
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
};

const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
};

// Interface
interface TutorAttendance {
    id: number;
    date: string;
    tutorName: string;
    ekstrakurikuler: string;
    startTime: string;
    endTime: string;
    duration: number; // in minutes
    academicYear: string; // e.g., "2024/2025", "2025/2026"
    semester: string; // "Ganjil" or "Genap"
}

// Mock Data
const mockTutorAttendance: TutorAttendance[] = [
    {
        id: 1,
        date: "2024-12-05",
        tutorName: "Ahmad Fauzi, S.Pd",
        ekstrakurikuler: "Pramuka",
        startTime: "15:30:00",
        endTime: "17:00:00",
        duration: 90,
        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 2,
        date: "2024-12-12",
        tutorName: "Ahmad Fauzi, S.Pd",
        ekstrakurikuler: "Pramuka",
        startTime: "15:30:00",
        endTime: "17:00:00",
        duration: 90,
        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 3,
        date: "2024-12-19",
        tutorName: "Ahmad Fauzi, S.Pd",
        ekstrakurikuler: "Pramuka",
        startTime: "15:30:00",
        endTime: "17:00:00",
        duration: 90,
        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 4,
        date: "2024-12-20",
        tutorName: "Ahmad Fauzi, S.Pd",
        ekstrakurikuler: "Pramuka",
        startTime: "15:30:00",
        endTime: "17:00:00",
        duration: 90,
        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 5,
        date: "2024-12-06",
        tutorName: "Siti Nurhaliza, S.Kep",
        ekstrakurikuler: "PMR",
        startTime: "16:00:00",
        endTime: "17:30:00",
        duration: 90,
        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 6,
        date: "2024-12-13",
        tutorName: "Siti Nurhaliza, S.Kep",
        ekstrakurikuler: "PMR",
        startTime: "16:00:00",
        endTime: "17:30:00",
        duration: 90,
        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 7,
        date: "2024-12-19",
        tutorName: "Siti Nurhaliza, S.Kep",
        ekstrakurikuler: "PMR",
        startTime: "16:00:00",
        endTime: "17:30:00",
        duration: 90,
        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 8,
        date: "2024-12-07",
        tutorName: "Bambang Sutrisno, S.Pd",
        ekstrakurikuler: "Paskibra",
        startTime: "14:00:00",
        endTime: "16:00:00",
        duration: 120,
        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 9,
        date: "2024-12-14",
        tutorName: "Bambang Sutrisno, S.Pd",
        ekstrakurikuler: "Paskibra",
        startTime: "14:00:00",
        endTime: "16:00:00",
        duration: 120,
        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 10,
        date: "2024-12-21",
        tutorName: "Bambang Sutrisno, S.Pd",
        ekstrakurikuler: "Paskibra",
        startTime: "14:00:00",
        endTime: "16:00:00",
        duration: 120,
        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 11,
        date: "2024-12-10",
        tutorName: "Dimas Prakoso, S.Pd",
        ekstrakurikuler: "Basket",
        startTime: "15:00:00",
        endTime: "17:00:00",
        duration: 120,

        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 12,
        date: "2024-12-11",
        tutorName: "Dimas Prakoso, S.Pd",
        ekstrakurikuler: "Basket",
        startTime: "15:00:00",
        endTime: "17:00:00",
        duration: 120,

        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 13,
        date: "2024-12-17",
        tutorName: "Dimas Prakoso, S.Pd",
        ekstrakurikuler: "Basket",
        startTime: "15:00:00",
        endTime: "17:00:00",
        duration: 120,

        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    {
        id: 14,
        date: "2024-12-18",
        tutorName: "Dimas Prakoso, S.Pd",
        ekstrakurikuler: "Basket",
        startTime: "15:00:00",
        endTime: "17:00:00",
        duration: 120,

        academicYear: "2024/2025",
        semester: "Ganjil",
    },
    // Tambahan data untuk tahun ajaran 2025/2026 Ganjil
    {
        id: 15,
        date: "2025-09-10",
        tutorName: "Ahmad Fauzi, S.Pd",
        ekstrakurikuler: "Pramuka",
        startTime: "15:30:00",
        endTime: "17:00:00",
        duration: 90,

        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    {
        id: 16,
        date: "2025-09-17",
        tutorName: "Ahmad Fauzi, S.Pd",
        ekstrakurikuler: "Pramuka",
        startTime: "15:30:00",
        endTime: "17:00:00",
        duration: 90,

        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    {
        id: 17,
        date: "2025-09-12",
        tutorName: "Siti Nurhaliza, S.Kep",
        ekstrakurikuler: "PMR",
        startTime: "16:00:00",
        endTime: "17:30:00",
        duration: 90,
        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    // Lebih banyak data Pramuka untuk 2025/2026 Ganjil
    {
        id: 18,
        date: "2025-09-24",
        tutorName: "Ahmad Fauzi, S.Pd",
        ekstrakurikuler: "Pramuka",
        startTime: "15:30:00",
        endTime: "17:00:00",
        duration: 90,

        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    {
        id: 19,
        date: "2025-10-01",
        tutorName: "Ahmad Fauzi, S.Pd",
        ekstrakurikuler: "Pramuka",
        startTime: "15:30:00",
        endTime: "17:00:00",
        duration: 90,

        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    {
        id: 20,
        date: "2025-10-08",
        tutorName: "Ahmad Fauzi, S.Pd",
        ekstrakurikuler: "Pramuka",
        startTime: "15:30:00",
        endTime: "17:00:00",
        duration: 90,

        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    {
        id: 21,
        date: "2025-10-15",
        tutorName: "Ahmad Fauzi, S.Pd",
        ekstrakurikuler: "Pramuka",
        startTime: "15:30:00",
        endTime: "17:00:00",
        duration: 90,

        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    {
        id: 22,
        date: "2025-09-19",
        tutorName: "Siti Nurhaliza, S.Kep",
        ekstrakurikuler: "PMR",
        startTime: "16:00:00",
        endTime: "17:30:00",
        duration: 90,

        academicYear: "2025/2026",
        semester: "Ganjil",
    },
    {
        id: 23,
        date: "2025-09-26",
        tutorName: "Siti Nurhaliza, S.Kep",
        ekstrakurikuler: "PMR",
        startTime: "16:00:00",
        endTime: "17:30:00",
        duration: 90,

        academicYear: "2025/2026",
        semester: "Ganjil",
    },

];

export default function TutorRecapPage() {
    const router = useRouter();
    const [localData, setLocalData] = useState<TutorAttendance[]>(mockTutorAttendance);
    const [searchQuery, setSearchQuery] = useState("");
    const [tutorFilter, setTutorFilter] = useState("all");
    const [ekskulFilter, setEkskulFilter] = useState("all");
    const [academicYearFilter, setAcademicYearFilter] = useState("2025/2026");
    const [semesterFilter, setSemesterFilter] = useState("Ganjil");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Sorting State - Default: date descending (newest first)
    const [sortField, setSortField] = useState<SortField>("date");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    // Export Preview State
    const [isExportPreviewOpen, setIsExportPreviewOpen] = useState(false);
    const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormat>("excel");
    const [exportFilename, setExportFilename] = useState("");

    // Update default filename when filters change or dialog opens
    useEffect(() => {
        if (isExportPreviewOpen) {
            const ta = academicYearFilter === "all" ? "semua-ta" : academicYearFilter.replace("/", "-");
            const smt = semesterFilter === "all" ? "1-tahun-penuh" : semesterFilter;
            const defaultName = `rekap-presensi-tutor-${ta}-${smt}`;
            // Only set if it hasn't been modified manually (optional logic, but typically resetting on open is safer/simpler for now)
            setExportFilename(defaultName);
        }
    }, [isExportPreviewOpen, academicYearFilter, semesterFilter]);

    // Get unique tutors and ekstrakurikuler from localData
    const uniqueTutors = Array.from(new Set(localData.map(a => a.tutorName))).sort();
    const uniqueEkskul = Array.from(new Set(localData.map(a => a.ekstrakurikuler))).sort();

    // Filter logic
    const filteredAttendance = useMemo(() => {
        const filtered = localData.filter((record) => {
            const matchesSearch =
                record.tutorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.ekstrakurikuler.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTutor = tutorFilter === "all" || record.tutorName === tutorFilter;
            const matchesEkskul = ekskulFilter === "all" || record.ekstrakurikuler === ekskulFilter;
            const matchesAcademicYear = record.academicYear === academicYearFilter;
            const matchesSemester = semesterFilter === "all" || record.semester === semesterFilter;

            return matchesSearch && matchesTutor && matchesEkskul && matchesAcademicYear && matchesSemester;
        });

        // Sort the filtered data
        return filtered.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case "date":
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case "tutorName":
                    comparison = a.tutorName.localeCompare(b.tutorName);
                    break;
                case "ekstrakurikuler":
                    comparison = a.ekstrakurikuler.localeCompare(b.ekstrakurikuler);
                    break;
                case "startTime":
                    comparison = a.startTime.localeCompare(b.startTime);
                    break;
                case "endTime":
                    comparison = a.endTime.localeCompare(b.endTime);
                    break;
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });
    }, [localData, searchQuery, tutorFilter, ekskulFilter, academicYearFilter, semesterFilter, sortField, sortOrder]);

    // Handle column header click for sorting
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle order if same field
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            // Set new field with default order
            setSortField(field);
            setSortOrder(field === "date" ? "desc" : "asc"); // Date defaults to desc, others to asc
        }
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    // Render sort icon
    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className="h-4 w-4 ml-1 text-slate-400" />;
        }
        return sortOrder === "asc"
            ? <ArrowUp className="h-4 w-4 ml-1 text-blue-600" />
            : <ArrowDown className="h-4 w-4 ml-1 text-blue-600" />;
    };



    // Export Handler - Calls Laravel Backend API
    const handleExport = async () => {
        try {
            // TODO: Replace with actual Laravel API endpoint
            // const response = await fetch('/api/tutor-recap/export', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         format: selectedExportFormat,
            //         academicYear: academicYearFilter,
            //         semester: semesterFilter,
            //         tutorFilter,
            //         ekskulFilter,
            //         filename: exportFilename
            //     })
            // });
            // 
            // if (!response.ok) throw new Error('Export failed');
            // 
            // const blob = await response.blob();
            // const url = window.URL.createObjectURL(blob);
            // const link = document.createElement('a');
            // link.href = url;
            // const ext = selectedExportFormat === 'excel' ? 'xlsx' : selectedExportFormat;
            // link.download = `${exportFilename}.${ext}`;
            // link.click();
            // window.URL.revokeObjectURL(url);

            // Placeholder - remove after Laravel API is ready
            alert(`Export ${selectedExportFormat.toUpperCase()} akan diproses oleh backend Laravel.\n\nFilename: ${exportFilename}\nFormat: ${selectedExportFormat}\nData: ${filteredAttendance.length} records`);

            setIsExportPreviewOpen(false);
        } catch (error) {
            console.error("Export error:", error);
            alert("Gagal mengexport data. Silakan coba lagi.");
        }
    };

    // Pagination
    const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
    const paginatedAttendance = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAttendance.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAttendance, currentPage, itemsPerPage]);

    // Stats
    const totalRecords = filteredAttendance.length;
    const totalTutors = new Set(filteredAttendance.map(a => a.tutorName)).size;
    const avgDuration = filteredAttendance.length > 0
        ? Math.round(filteredAttendance.reduce((sum, a) => sum + a.duration, 0) / filteredAttendance.length)
        : 0;

    // Helper: Format time
    const formatTime = (time: string) => {
        return time.substring(0, 5); // "15:30:00" -> "15:30"
    };

    // Helper: Format date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Helper: Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Rekap </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Presensi Tutor</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <FileSpreadsheet className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Rekap kehadiran dan jam mengajar tutor ekstrakurikuler
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

            {/* Stats Card */}
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
                            <h2 className="text-xl font-bold text-white">Statistik Presensi Tutor</h2>
                            <p className="text-blue-100 text-sm">
                                Ringkasan performa presensi tutor TA {academicYearFilter} {semesterFilter === "all" ? "(1 Tahun Penuh)" : `Semester ${semesterFilter}`}
                            </p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                        {/* Total Records */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                                <FileSpreadsheet className="h-4 w-4 text-blue-800" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{totalRecords}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Presensi</p>
                        </div>

                        {/* Total Tutors */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-green-100 rounded-full mb-1.5">
                                <Users className="h-4 w-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{totalTutors}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Tutor Aktif</p>
                        </div>

                        {/* Avg Duration */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-purple-100 rounded-full mb-1.5">
                                <Clock className="h-4 w-4 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-600">{avgDuration}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Menit/Sesi Rata-rata</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Card */}
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileSpreadsheet className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Daftar Presensi Tutor</CardTitle>
                                <CardDescription>
                                    Daftar data kehadiran tutor TA {academicYearFilter} {semesterFilter === "all" ? "(1 Tahun Penuh)" : `Semester ${semesterFilter}`}
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {filteredAttendance.length} Data
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="px-4 pb-4 pt-4 border-b">
                        <div className="flex flex-col xl:flex-row gap-4 justify-between">
                            {/* Left Group: Search & Entity Filters */}
                            <div className="flex flex-col sm:flex-row gap-2 flex-1">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari tutor / ekskul..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-9"
                                    />
                                </div>
                                <Select value={tutorFilter} onValueChange={setTutorFilter}>
                                    <SelectTrigger className="h-9 w-full sm:w-[240px]">
                                        <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground flex-shrink-0" />
                                        <span className="truncate">
                                            <SelectValue placeholder="Semua Tutor" />
                                        </span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tutor</SelectItem>
                                        {uniqueTutors.map(tutor => (
                                            <SelectItem key={tutor} value={tutor}>{tutor}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={ekskulFilter} onValueChange={setEkskulFilter}>
                                    <SelectTrigger className="h-9 w-full sm:w-[180px]">
                                        <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground flex-shrink-0" />
                                        <SelectValue placeholder="Semua Ekskul" className="truncate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Ekskul</SelectItem>
                                        {uniqueEkskul.map(ekskul => (
                                            <SelectItem key={ekskul} value={ekskul}>{ekskul}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Right Group: Time Filters & Export */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Select value={academicYearFilter} onValueChange={setAcademicYearFilter}>
                                    <SelectTrigger className="w-full sm:w-[150px] h-9">
                                        <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                        <SelectValue placeholder="TA" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua TA</SelectItem>
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
                                <Button
                                    className="bg-blue-800 text-white hover:bg-blue-900 gap-2 w-full sm:w-auto"
                                    onClick={() => setIsExportPreviewOpen(true)}
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-center p-4 font-medium text-sm w-12">No</th>
                                    <th
                                        className="text-left p-4 font-medium text-sm w-32 cursor-pointer hover:bg-muted/80 transition-colors select-none"
                                        onClick={() => handleSort("date")}
                                    >
                                        <div className="flex items-center">
                                            Tanggal
                                            {renderSortIcon("date")}
                                        </div>
                                    </th>
                                    <th
                                        className="text-left p-4 font-medium text-sm min-w-[200px] cursor-pointer hover:bg-muted/80 transition-colors select-none"
                                        onClick={() => handleSort("tutorName")}
                                    >
                                        <div className="flex items-center">
                                            Nama Tutor
                                            {renderSortIcon("tutorName")}
                                        </div>
                                    </th>
                                    <th
                                        className="text-left p-4 font-medium text-sm w-40 cursor-pointer hover:bg-muted/80 transition-colors select-none"
                                        onClick={() => handleSort("ekstrakurikuler")}
                                    >
                                        <div className="flex items-center">
                                            Ekstrakurikuler
                                            {renderSortIcon("ekstrakurikuler")}
                                        </div>
                                    </th>
                                    <th
                                        className="text-center p-4 font-medium text-sm w-32 cursor-pointer hover:bg-muted/80 transition-colors select-none"
                                        onClick={() => handleSort("startTime")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Waktu Mulai
                                            {renderSortIcon("startTime")}
                                        </div>
                                    </th>
                                    <th
                                        className="text-center p-4 font-medium text-sm w-32 cursor-pointer hover:bg-muted/80 transition-colors select-none"
                                        onClick={() => handleSort("endTime")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Waktu Selesai
                                            {renderSortIcon("endTime")}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedAttendance.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="rounded-full bg-muted p-6">
                                                    <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold">Tidak Ada Data</h3>
                                                    <p className="text-sm text-muted-foreground max-w-md">
                                                        {searchQuery
                                                            ? `Tidak ada presensi tutor yang cocok dengan pencarian "${searchQuery}"`
                                                            : `Tidak ada data presensi tutor untuk periode ${academicYearFilter} Semester ${semesterFilter}.`}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedAttendance.map((record, index) => {
                                        const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                                        // Generate initials for avatar
                                        const initials = record.tutorName
                                            .split(' ')
                                            .map(n => n[0])
                                            .slice(0, 2)
                                            .join('')
                                            .toUpperCase();

                                        return (
                                            <tr key={record.id} className="border-b hover:bg-blue-50/50 transition-colors group">
                                                <td className="p-4 text-center text-sm text-muted-foreground">{globalIndex}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-sm font-medium text-slate-700">
                                                            {formatDate(record.date)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200/50">
                                                            <span className="text-sm font-bold text-blue-800">
                                                                {initials}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900 group-hover:text-blue-800 transition-colors">
                                                                {record.tutorName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {record.ekstrakurikuler}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200">
                                                        {formatTime(record.startTime)}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200">
                                                        {formatTime(record.endTime)}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <span>Menampilkan</span>
                            <span className="font-medium text-foreground">
                                {filteredAttendance.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                            </span>
                            <span>-</span>
                            <span className="font-medium text-foreground">
                                {Math.min(currentPage * itemsPerPage, filteredAttendance.length)}
                            </span>
                            <span>dari</span>
                            <span className="font-medium text-foreground">{filteredAttendance.length}</span>
                            <span>data</span>
                        </div>

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

            {/* Export Preview DIALOG */}
            <Dialog open={isExportPreviewOpen} onOpenChange={setIsExportPreviewOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <div className="flex items-center gap-4 border-b pb-4 mb-2">
                            <div className="p-2.5 bg-blue-50 rounded-full border border-blue-100">
                                <Eye className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg text-slate-900">Preview & Export Data</DialogTitle>
                                <DialogDescription className="text-slate-500">
                                    Pilih format export dan preview data sebelum mengunduh
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-5 py-2 overflow-y-auto flex-1 pr-2">
                        {/* Info Card - Summary */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Data</label>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <p className="text-2xl font-bold text-blue-800">{filteredAttendance.length}</p>
                                        <span className="text-xs text-slate-500">data</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tahun Ajaran</label>
                                    <p className="font-semibold text-slate-900 text-sm mt-1">{academicYearFilter}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Semester</label>
                                    <p className="font-semibold text-slate-900 text-sm mt-1">{semesterFilter === "all" ? "1 Tahun Penuh" : semesterFilter}</p>
                                </div>
                            </div>
                        </div>

                        {/* Format Selection & Filename */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-slate-700 mb-2 block">Format Export</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={selectedExportFormat === "excel" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedExportFormat("excel")}
                                        className={cn(
                                            "flex-1 gap-1.5",
                                            selectedExportFormat === "excel" && "bg-blue-800 hover:bg-blue-900"
                                        )}
                                    >
                                        <FileSpreadsheet className="h-3.5 w-3.5" />
                                        Excel
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={selectedExportFormat === "csv" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedExportFormat("csv")}
                                        className={cn(
                                            "flex-1 gap-1.5",
                                            selectedExportFormat === "csv" && "bg-blue-800 hover:bg-blue-900"
                                        )}
                                    >
                                        <FileText className="h-3.5 w-3.5" />
                                        CSV
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={selectedExportFormat === "pdf" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedExportFormat("pdf")}
                                        className={cn(
                                            "flex-1 gap-1.5",
                                            selectedExportFormat === "pdf" && "bg-blue-800 hover:bg-blue-900"
                                        )}
                                    >
                                        <FileType className="h-3.5 w-3.5" />
                                        PDF
                                    </Button>
                                </div>
                            </div>

                            {/* Filename Input */}
                            <div>
                                <Label htmlFor="filename" className="text-sm font-medium text-slate-700 mb-2 block">Nama File</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="filename"
                                        value={exportFilename}
                                        onChange={(e) => setExportFilename(e.target.value)}
                                        placeholder="rekap-presensi-tutor..."
                                        className="h-9"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-slate-400 hover:text-slate-600 shrink-0"
                                        onClick={() => {
                                            const ta = academicYearFilter === "all" ? "semua-ta" : academicYearFilter.replace("/", "-");
                                            const smt = semesterFilter === "all" ? "1-tahun-penuh" : semesterFilter;
                                            setExportFilename(`rekap-presensi-tutor-${ta}-${smt}`);
                                        }}
                                        title="Reset nama default"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                    <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-500 whitespace-nowrap">
                                        .{selectedExportFormat === "excel" ? "xlsx" : selectedExportFormat}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Preview */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700">Preview Data</Label>
                            <div className="border-2 border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
                                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-slate-50 border-b-2 border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-700" />
                                        <p className="text-sm font-semibold text-slate-700">Menampilkan 5 baris pertama dari {filteredAttendance.length} data</p>
                                    </div>
                                </div>
                                <div>
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-slate-100 to-slate-50 sticky top-0 shadow-sm">
                                            <tr>
                                                <th className="text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 border-slate-300 text-slate-600">No</th>
                                                <th className="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 border-slate-300 text-slate-600">Tanggal</th>
                                                <th className="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 border-slate-300 text-slate-600">Tutor</th>
                                                <th className="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 border-slate-300 text-slate-600">Ekskul</th>
                                                <th className="text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 border-slate-300 text-slate-600">Mulai</th>
                                                <th className="text-center px-3 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 border-slate-300 text-slate-600">Selesai</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {filteredAttendance.slice(0, 5).map((record, index) => (
                                                <tr
                                                    key={record.id}
                                                    className={cn(
                                                        "transition-colors hover:bg-blue-50/50",
                                                        index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                                                    )}
                                                >
                                                    <td className="px-3 py-3 text-xs text-center font-medium text-slate-500">{index + 1}</td>
                                                    <td className="px-3 py-3 text-xs text-slate-700 font-medium">{formatDate(record.date)}</td>
                                                    <td className="px-3 py-3 text-xs text-slate-800 font-semibold">{record.tutorName}</td>
                                                    <td className="px-3 py-3 text-xs text-slate-600">{record.ekstrakurikuler}</td>
                                                    <td className="px-3 py-3 text-xs text-center font-mono text-slate-600 bg-slate-50/50">{formatTime(record.startTime)}</td>
                                                    <td className="px-3 py-3 text-xs text-center font-mono text-slate-600 bg-slate-50/50">{formatTime(record.endTime)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {filteredAttendance.length > 5 && (
                                        <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-blue-50 text-center border-t-2 border-slate-200">
                                            <p className="text-xs text-slate-600 font-medium">
                                                ... dan <span className="font-bold text-blue-800">{filteredAttendance.length - 5}</span> data lainnya akan diexport
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 mt-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsExportPreviewOpen(false)}
                            className="border-slate-300 text-slate-700"
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-blue-800 hover:bg-blue-900 gap-2"
                            onClick={handleExport}
                        >
                            <Download className="h-4 w-4" />
                            Download {selectedExportFormat === "excel" ? "Excel" : selectedExportFormat === "csv" ? "CSV" : "PDF"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
