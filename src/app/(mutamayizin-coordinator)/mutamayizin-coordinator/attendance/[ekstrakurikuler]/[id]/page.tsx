"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Card,
    CardContent,
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
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    Users,
    Search,
    XCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Download,
} from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { cn } from "@/lib/utils";

// Mock Data
const mockDetailData = {
    id: 1,
    date: "2024-12-20",
    activity: "Pertemuan Rutin",
    ekstrakurikuler: "Pramuka",
    tutor: "Ahmad Fauzi, S.Pd",
    tutorStatus: "hadir", // hadir / tidak_hadir
    startTime: "14:00",
    endTime: "16:00",
    students: [
        { id: 1, nis: "2022001", name: "Andi Wijaya", class: "XII A", status: "hadir" },
        { id: 2, nis: "2022002", name: "Rina Kusuma", class: "XI A", status: "sakit" },
        { id: 3, nis: "2022003", name: "Doni Pratama", class: "XI B", status: "hadir" },
        { id: 4, nis: "2022004", name: "Siti Aminah", class: "XII B", status: "izin" },
        { id: 5, nis: "2022005", name: "Budi Santoso", class: "X A", status: "hadir" },
        { id: 6, nis: "2022006", name: "Dewi Lestari", class: "XII A", status: "hadir" },
        { id: 7, nis: "2022007", name: "Eko Prasetyo", class: "XI A", status: "hadir" },
        { id: 8, nis: "2022008", name: "Fitri Handayani", class: "XI B", status: "sakit" },
        { id: 9, nis: "2022009", name: "Gilang Ramadhan", class: "XII B", status: "hadir" },
        { id: 10, nis: "2022010", name: "Hana Safitri", class: "X A", status: "hadir" },
        { id: 11, nis: "2022011", name: "Indra Permana", class: "XII A", status: "hadir" },
        { id: 12, nis: "2022012", name: "Jihan Aulia", class: "XI A", status: "hadir" },
        { id: 13, nis: "2022013", name: "Kevin Anggara", class: "XI B", status: "alpa" },
        { id: 14, nis: "2022014", name: "Lina Marlina", class: "XII B", status: "hadir" },
        { id: 15, nis: "2022015", name: "Muhamad Rizky", class: "X A", status: "hadir" },
        { id: 16, nis: "2022016", name: "Nadia Putri", class: "XII A", status: "hadir" },
        { id: 17, nis: "2022017", name: "Oscar Wijaya", class: "XI A", status: "izin" },
        { id: 18, nis: "2022018", name: "Putri Ayu", class: "XI B", status: "hadir" },
        { id: 19, nis: "2022019", name: "Qori Azzahra", class: "XII B", status: "hadir" },
        { id: 20, nis: "2022020", name: "Reza Pahlevi", class: "X A", status: "hadir" },
        { id: 21, nis: "2022021", name: "Sinta Dewi", class: "XII A", status: "hadir" },
        { id: 22, nis: "2022022", name: "Taufik Hidayat", class: "XI A", status: "hadir" },
        { id: 23, nis: "2022023", name: "Umar Bakri", class: "XI B", status: "hadir" },
        { id: 24, nis: "2022024", name: "Vina Melati", class: "XII B", status: "hadir" },
        { id: 25, nis: "2022025", name: "Wahyu Pratama", class: "X A", status: "hadir" },
    ]
};

const uniqueClasses = [...new Set(mockDetailData.students.map(s => s.class))].sort();

export default function AttendanceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { ekstrakurikuler, id } = params as { ekstrakurikuler: string; id: string };

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [classFilter, setClassFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Calculate stats
    const stats = useMemo(() => {
        const present = mockDetailData.students.filter(s => s.status === "hadir").length;
        const sick = mockDetailData.students.filter(s => s.status === "sakit").length;
        const permit = mockDetailData.students.filter(s => s.status === "izin").length;
        const absent = mockDetailData.students.filter(s => s.status === "alpa").length;
        const total = mockDetailData.students.length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
        return { present, sick, permit, absent, total, percentage };
    }, []);

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "hadir":
                return "bg-green-100 text-green-700 border-green-200";
            case "sakit":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "izin":
                return "bg-blue-100 text-blue-700 border-blue-200";
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

    // Filter students
    const filteredStudents = useMemo(() => {
        return mockDetailData.students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.nis.includes(searchTerm);
            const matchesStatus = statusFilter === "all" || student.status === statusFilter;
            const matchesClass = classFilter === "all" || student.class === classFilter;
            return matchesSearch && matchesStatus && matchesClass;
        });
    }, [searchTerm, statusFilter, classFilter]);

    // Paginate
    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredStudents.slice(startIndex, endIndex);
    }, [filteredStudents, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, classFilter, itemsPerPage]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Detail Riwayat </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Presensi</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Informasi detail kehadiran siswa pada pertemuan ekstrakurikuler
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            <Card>
                <CardContent className="p-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x">
                        {/* Total */}
                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-blue-100 rounded-full mb-2">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Siswa</p>
                        </div>

                        {/* Hadir */}
                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-green-100 rounded-full mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Hadir</p>
                        </div>

                        {/* Sakit */}
                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-yellow-100 rounded-full mb-2">
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                            </div>
                            <p className="text-2xl font-bold text-yellow-600">{stats.sick}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Sakit</p>
                        </div>

                        {/* Izin */}
                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-purple-100 rounded-full mb-2">
                                <Clock className="h-5 w-5 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-600">{stats.permit}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Izin</p>
                        </div>

                        {/* Alpa */}
                        <div className="p-3 text-center">
                            <div className="inline-flex p-2.5 bg-red-100 rounded-full mb-2">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Alpa</p>
                        </div>

                        {/* Persentase */}
                        <div className="p-3 text-center">
                            <div className={cn(
                                "inline-flex p-2.5 rounded-full mb-2",
                                stats.percentage >= 90 ? "bg-green-100" :
                                    stats.percentage >= 75 ? "bg-yellow-100" : "bg-red-100"
                            )}>
                                <CheckCircle className={cn(
                                    "h-5 w-5",
                                    stats.percentage >= 90 ? "text-green-600" :
                                        stats.percentage >= 75 ? "text-yellow-600" : "text-red-600"
                                )} />
                            </div>
                            <p className={cn(
                                "text-2xl font-bold",
                                stats.percentage >= 90 ? "text-green-600" :
                                    stats.percentage >= 75 ? "text-yellow-600" : "text-red-600"
                            )}>{stats.percentage}%</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Kehadiran</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Activity Info Card */}
            <Card className="overflow-hidden">
                <div className="bg-blue-800 p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Calendar className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-white">{mockDetailData.activity}</h3>
                                <p className="text-blue-100">Ekstrakurikuler {mockDetailData.ekstrakurikuler}</p>
                            </div>
                        </div>
                        <Badge className="bg-green-500 text-white border-0 gap-1.5 px-3 py-1.5 text-sm font-medium">
                            <CheckCircle className="h-4 w-4" />
                            Presensi Lengkap
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x">
                        {/* Tanggal */}
                        <div className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Tanggal</p>
                                <p className="font-semibold text-gray-900">{formatDate(mockDetailData.date, "dd MMMM yyyy")}</p>
                            </div>
                        </div>

                        {/* Waktu */}
                        <div className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Clock className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Waktu Kegiatan</p>
                                <p className="font-semibold text-gray-900">{mockDetailData.startTime} - {mockDetailData.endTime} WIB</p>
                            </div>
                        </div>

                        {/* Tutor */}
                        <div className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Users className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground font-medium">Tutor</p>
                                <p className="font-semibold text-gray-900">{mockDetailData.tutor}</p>
                                {mockDetailData.tutorStatus === "hadir" ? (
                                    <Badge className="mt-1 gap-1 text-xs bg-green-100 text-green-700 border-green-200">
                                        <CheckCircle className="h-3 w-3" />
                                        Hadir
                                    </Badge>
                                ) : (
                                    <Badge className="mt-1 gap-1 text-xs bg-amber-100 text-amber-700 border-amber-200">
                                        <AlertCircle className="h-3 w-3" />
                                        Belum Mengisi
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Kehadiran Siswa */}
                        <div className="p-4 flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-lg",
                                stats.percentage >= 90 ? "bg-green-50" :
                                    stats.percentage >= 75 ? "bg-yellow-50" : "bg-red-50"
                            )}>
                                <CheckCircle className={cn(
                                    "h-5 w-5",
                                    stats.percentage >= 90 ? "text-green-600" :
                                        stats.percentage >= 75 ? "text-yellow-600" : "text-red-600"
                                )} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Kehadiran Siswa</p>
                                <p className={cn(
                                    "font-semibold",
                                    stats.percentage >= 90 ? "text-green-600" :
                                        stats.percentage >= 75 ? "text-yellow-600" : "text-red-600"
                                )}>
                                    {stats.present}/{stats.total} ({stats.percentage}%)
                                </p>
                            </div>
                        </div>

                        {/* Total Absen */}
                        <div className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Tidak Hadir</p>
                                <p className="font-semibold text-red-600">
                                    {stats.sick + stats.permit + stats.absent} Siswa
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Student List */}
            <Card>
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
                                    className="pl-9"
                                />
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

                                <div className="flex items-center gap-2">
                                    <Label className="text-sm whitespace-nowrap">Tampilkan:</Label>
                                    <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(parseInt(v))}>
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
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
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-primary">
                                                                {student.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <span className="font-medium">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className="bg-blue-50 text-blue-800 border-blue-200">
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                            <div className="text-sm text-muted-foreground">
                                Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
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
