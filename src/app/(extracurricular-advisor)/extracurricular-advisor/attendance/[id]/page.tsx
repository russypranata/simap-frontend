"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    CheckCircle,
    Clock,
    Users,
    Search,
    XCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { cn } from "@/lib/utils";

import { AttendanceDetailSkeleton } from "@/features/extracurricular-advisor/components/AdvisorSkeletons";

import { advisorService, AttendanceDetail } from "@/features/extracurricular-advisor/services/advisorService";
import { toast } from "sonner";

export default function AttendanceDetailPage() {
    const params = useParams();
    const id = Number(params.id);

    // State
    const [isLoading, setIsLoading] = useState(true);
    const [attendanceDetail, setAttendanceDetail] = useState<AttendanceDetail | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [classFilter, setClassFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await advisorService.getAttendanceDetail(id);
                setAttendanceDetail(data);
            } catch (error) {
                console.error("Failed to fetch attendance detail:", error);
                toast.error("Gagal memuat detail presensi");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // Derived State
    const students = attendanceDetail?.students || [];
    const uniqueClasses = useMemo(() => [...new Set(students.map(s => s.class))].sort(), [students]);

    // Calculate stats
    const stats = useMemo(() => {
        if (!attendanceDetail) return { present: 0, sick: 0, permit: 0, absent: 0, total: 0, percentage: 0 };
        
        // Use stats from the record directly if available and accurate, or recalculate from list
        // Let's rely on the record's stats for the summary cards to match history exactly
        // But for the break down (Sakit, Izin, Alpa) we might need to count if the history object doesn't have it broken down
        // The history object has: present, total, percentage.
        // It does NOT have sick/permit/absent counts in the summary.
        // So we must count them from the student list.
        
        const present = students.filter(s => s.status === "hadir").length;
        const sick = students.filter(s => s.status === "sakit").length;
        const permit = students.filter(s => s.status === "izin").length;
        const absent = students.filter(s => s.status === "alpa").length;
        const total = students.length;
        
        // Re-calculate percentage to be sure or use from detail?
        // Let's use detail percentage for consistency with history card
        const percentage = attendanceDetail.studentStats.percentage;

        return { present, sick, permit, absent, total, percentage };
    }, [attendanceDetail, students]);

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "hadir":
                return "bg-green-100 text-green-700 border-green-200";
            case "sakit":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "izin":
                return "bg-sky-100 text-sky-700 border-sky-200";
            case "alpa":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "hadir":
                return <CheckCircle className="h-3 w-3" />;
            case "sakit":
                return <AlertCircle className="h-3 w-3" />;
            case "izin":
                return <Clock className="h-3 w-3" />;
            case "alpa":
                return <XCircle className="h-3 w-3" />;
            default:
                return null;
        }
    };

    const getClassBadgeColor = () => {
        return "bg-blue-50 text-blue-800 border-blue-200";
    };

    // Filter students
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.nis.includes(searchTerm);
            const matchesStatus = statusFilter === "all" || student.status === statusFilter;
            const matchesClass = classFilter === "all" || student.class === classFilter;
            return matchesSearch && matchesStatus && matchesClass;
        });
    }, [students, searchTerm, statusFilter, classFilter]);

    // Paginate filtered students
    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredStudents.slice(startIndex, endIndex);
    }, [filteredStudents, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, classFilter, itemsPerPage]);

    if (isLoading) {
        return <AttendanceDetailSkeleton />;
    }

    if (!attendanceDetail) {
         return (
             <div className="flex flex-col items-center justify-center py-12">
                 <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                 <h2 className="text-lg font-semibold text-gray-900">Data Tidak Ditemukan</h2>
                 <p className="text-muted-foreground">Detail presensi tidak dapat ditemukan atau terjadi kesalahan.</p>
                 <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                     Coba Lagi
                 </Button>
             </div>
         );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Detail Riwayat </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Presensi</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Rincian lengkap data kehadiran siswa pada pertemuan ekstrakurikuler
                    </p>
                </div>
            </div>

            {/* Activity Info Card with Stats */}
            <Card className="overflow-hidden p-0 gap-0">
                {/* Header */}
                <div className="bg-blue-800 p-4 rounded-t-lg relative overflow-hidden">
                    {/* Decorative Icon */}
                    <div className="absolute -right-6 -bottom-6 text-white/10 transform rotate-12">
                        <Calendar className="w-32 h-32" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">{attendanceDetail.topic || "Kegiatan Rutin"}</h3>
                                <p className="text-blue-100 text-sm">Ekstrakurikuler Pramuka</p>
                            </div>
                        </div>
                        <Badge className="bg-green-500 text-white border-0 gap-1 px-2.5 py-1 text-xs font-medium w-fit">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Presensi Lengkap
                        </Badge>
                    </div>
                </div>

                {/* Activity Details */}
                <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-b">
                    {/* Tanggal */}
                    <div className="px-3 py-4 flex items-center gap-3">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                            <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Tanggal</p>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(attendanceDetail.date, "dd MMMM yyyy")}</p>
                        </div>
                    </div>

                    {/* Waktu */}
                    <div className="px-3 py-4 flex items-center gap-3">
                        <div className="p-1.5 bg-purple-50 rounded-lg">
                            <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Waktu</p>
                            <p className="text-sm font-semibold text-gray-900">{attendanceDetail.advisorStats.startTime} - {attendanceDetail.advisorStats.endTime} WIB</p>
                        </div>
                    </div>

                    {/* Tutor */}
                    <div className="px-3 py-4 flex items-center gap-3">
                        <div className="p-1.5 bg-green-50 rounded-lg">
                            <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Tutor</p>
                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                                {attendanceDetail.advisorStats.tutorName}
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </p>
                        </div>
                    </div>

                    {/* Kehadiran */}
                    <div className="px-3 py-4 flex items-center gap-3">
                        <div className={cn(
                            "p-1.5 rounded-lg",
                            stats.percentage >= 90 ? "bg-green-100" :
                                stats.percentage >= 75 ? "bg-amber-100" : "bg-red-100"
                        )}>
                            <CheckCircle className={cn(
                                "h-4 w-4",
                                stats.percentage >= 90 ? "text-green-700" :
                                    stats.percentage >= 75 ? "text-amber-700" : "text-red-700"
                            )} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Kehadiran</p>
                            <p className={cn(
                                "text-sm font-semibold",
                                stats.percentage >= 90 ? "text-green-700" :
                                    stats.percentage >= 75 ? "text-amber-700" : "text-red-700"
                            )}>
                                {stats.present}/{stats.total} ({stats.percentage}%)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - 5 columns */}
                <div className="grid grid-cols-5 divide-x">
                    {/* Total */}
                    <div className="p-3 text-center">
                        <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                            <Users className="h-4 w-4 text-blue-800" />
                        </div>
                        <p className="text-xl font-bold text-blue-800">{stats.total}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>

                    {/* Hadir */}
                    <div className="p-3 text-center">
                        <div className="inline-flex p-2 bg-green-100 rounded-full mb-1.5">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-green-600">{stats.present}</p>
                        <p className="text-xs text-muted-foreground">Hadir</p>
                    </div>

                    {/* Sakit */}
                    <div className="p-3 text-center">
                        <div className="inline-flex p-2 bg-yellow-100 rounded-full mb-1.5">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                        </div>
                        <p className="text-xl font-bold text-yellow-600">{stats.sick}</p>
                        <p className="text-xs text-muted-foreground">Sakit</p>
                    </div>

                    {/* Izin */}
                    <div className="p-3 text-center">
                        <div className="inline-flex p-2 bg-sky-100 rounded-full mb-1.5">
                            <Clock className="h-4 w-4 text-sky-600" />
                        </div>
                        <p className="text-xl font-bold text-sky-600">{stats.permit}</p>
                        <p className="text-xs text-muted-foreground">Izin</p>
                    </div>

                    {/* Alpa */}
                    <div className="p-3 text-center">
                        <div className="inline-flex p-2 bg-red-100 rounded-full mb-1.5">
                            <XCircle className="h-4 w-4 text-red-600" />
                        </div>
                        <p className="text-xl font-bold text-red-600">{stats.absent}</p>
                        <p className="text-xs text-muted-foreground">Alpa</p>
                    </div>
                </div>
            </Card>

            {/* Student List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Daftar Kehadiran Siswa</CardTitle>
                            <CardDescription>Data kehadiran setiap siswa pada kegiatan ini</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="p-4 border-b">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau NIS..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-9"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm whitespace-nowrap">Kelas:</Label>
                                    <Select value={classFilter} onValueChange={setClassFilter}>
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua</SelectItem>
                                            {uniqueClasses.map(cls => (
                                                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Label className="text-sm whitespace-nowrap">Status:</Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua</SelectItem>
                                            <SelectItem value="hadir">Hadir</SelectItem>
                                            <SelectItem value="sakit">Sakit</SelectItem>
                                            <SelectItem value="izin">Izin</SelectItem>
                                            <SelectItem value="alpa">Alpa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Info */}
                        {(searchTerm || statusFilter !== "all" || classFilter !== "all") && (
                            <div className="flex items-center justify-end mt-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("all");
                                        setClassFilter("all");
                                    }}
                                >
                                    Reset Filter
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                    <th className="text-left p-4 font-medium text-sm w-24">NIS</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-48">Nama Siswa</th>
                                    <th className="text-left p-4 font-medium text-sm w-24">Kelas</th>
                                    <th className="text-center p-4 font-medium text-sm w-32">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-12">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="rounded-full bg-muted p-6">
                                                    <Search className="h-12 w-12 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold">Tidak Ada Data</h3>
                                                    <p className="text-sm text-muted-foreground max-w-md">
                                                        {searchTerm
                                                            ? `Tidak ada siswa yang cocok dengan pencarian "${searchTerm}"`
                                                            : "Tidak ada data siswa yang sesuai dengan filter."}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedStudents.map((student, index) => {
                                        const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                                        return (
                                            <tr key={student.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="p-4 text-sm">{globalIndex}</td>
                                                <td className="p-4 text-sm font-mono">{student.nis}</td>
                                                <td className="p-4">
                                                    <span className="text-sm font-medium">{student.name}</span>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className={getClassBadgeColor()}>
                                                        {student.class}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Badge className={cn("gap-1", getStatusBadgeVariant(student.status))}>
                                                        {getStatusIcon(student.status)}
                                                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer with Pagination */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 border-t bg-muted/20">
                        {/* Left: Pagination Info */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Menampilkan</span>
                            <span className="font-medium text-foreground">
                                {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                            </span>
                            <span>-</span>
                            <span className="font-medium text-foreground">
                                {Math.min(currentPage * itemsPerPage, filteredStudents.length)}
                            </span>
                            <span>dari</span>
                            <span className="font-medium text-foreground">{filteredStudents.length}</span>
                            <span>data</span>
                        </div>

                        {/* Right: Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">
                                    Hal {currentPage}/{totalPages}
                                </span>
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
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNumber: number;
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                pageNumber = currentPage - 2 + i;
                                            }
                                            return (
                                                <Button
                                                    key={pageNumber}
                                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                    className={cn(
                                                        "w-8 h-8 p-0",
                                                        currentPage === pageNumber && "bg-blue-800 hover:bg-blue-900 text-white"
                                                    )}
                                                >
                                                    {pageNumber}
                                                </Button>
                                            );
                                        })}
                                        {totalPages > 5 && currentPage < totalPages - 2 && (
                                            <>
                                                <span className="text-sm text-muted-foreground px-1">...</span>
                                                <Button
                                                    variant={currentPage === totalPages ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    className={cn(
                                                        "w-8 h-8 p-0",
                                                        currentPage === totalPages && "bg-blue-800 hover:bg-blue-900 text-white"
                                                    )}
                                                >
                                                    {totalPages}
                                                </Button>
                                            </>
                                        )}
                                    </div>
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
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
