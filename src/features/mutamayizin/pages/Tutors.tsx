"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Users,
    Search,
    Filter,
    Calendar,
    Eye,
    Briefcase,
    Mail,
    Phone,
    MoreVertical,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Edit,
    ShieldAlert,
    Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data - Tutors
interface Tutor {
    id: number;
    tutorId: string;
    name: string;
    email: string;
    phone: string;
    ekstrakurikuler: string[];
    status: "active" | "inactive";
    joinDate: string;
    photo: string | null;
}

const mockTutors: Tutor[] = [
    { id: 1, tutorId: "TUTOR001", name: "Ahmad Fauzi, S.Pd", email: "ahmad.fauzi@alfityan.sch.id", phone: "0812-3456-7890", ekstrakurikuler: ["Pramuka"], status: "active", joinDate: "2020-07-15", photo: null },
    { id: 2, tutorId: "TUTOR002", name: "Budi Santoso, S.Kom", email: "budi.santoso@alfityan.sch.id", phone: "0813-4567-8901", ekstrakurikuler: ["Futsal", "Basket"], status: "active", joinDate: "2021-08-01", photo: null },
    { id: 3, tutorId: "TUTOR003", name: "Citra Dewi, S.Sn", email: "citra.dewi@alfityan.sch.id", phone: "0814-5678-9012", ekstrakurikuler: ["Seni Tari"], status: "active", joinDate: "2022-01-10", photo: null },
    { id: 4, tutorId: "TUTOR004", name: "Dedi Kurniawan, S.Pd", email: "dedi.kurniawan@alfityan.sch.id", phone: "0815-6789-0123", ekstrakurikuler: ["Paskibra"], status: "inactive", joinDate: "2019-07-15", photo: null },
    { id: 5, tutorId: "TUTOR005", name: "Eka Pertiwi, S.Pd", email: "eka.pertiwi@alfityan.sch.id", phone: "0816-7890-1234", ekstrakurikuler: ["PMR"], status: "active", joinDate: "2023-07-20", photo: null },
    { id: 6, tutorId: "TUTOR006", name: "Fajar Nugraha, S.Kom", email: "fajar.nugraha@alfityan.sch.id", phone: "0817-8901-2345", ekstrakurikuler: ["Robotik", "Desain Grafis"], status: "active", joinDate: "2023-01-05", photo: null },
    { id: 7, tutorId: "TUTOR007", name: "Gita Savitri, S.Pd", email: "gita.savitri@alfityan.sch.id", phone: "0818-9012-3456", ekstrakurikuler: ["English Club"], status: "active", joinDate: "2020-02-15", photo: null },
    { id: 8, tutorId: "TUTOR008", name: "Hendra Wijaya, S.Pd", email: "hendra.wijaya@alfityan.sch.id", phone: "0819-0123-4567", ekstrakurikuler: ["Bulu Tangkis"], status: "inactive", joinDate: "2022-05-20", photo: null },
];

export const MutamayizinTutors: React.FC = () => {
    const router = useRouter();
    const [tutors] = useState<Tutor[]>(mockTutors);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [ekskulFilter, setEkskulFilter] = useState("all");
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Get unique ekskul list
    const uniqueEkskul = useMemo(() => {
        const allEkskul = tutors.flatMap(t => t.ekstrakurikuler);
        return Array.from(new Set(allEkskul)).sort();
    }, [tutors]);

    // Filter tutors
    const filteredTutors = useMemo(() => {
        return tutors.filter((tutor) => {
            const matchesSearch =
                tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tutor.tutorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tutor.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || tutor.status === statusFilter;
            const matchesEkskul = ekskulFilter === "all" || tutor.ekstrakurikuler.includes(ekskulFilter);
            return matchesSearch && matchesStatus && matchesEkskul;
        });
    }, [tutors, searchQuery, statusFilter, ekskulFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredTutors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTutors = filteredTutors.slice(startIndex, startIndex + itemsPerPage);

    // Reset page when filter changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, ekskulFilter, itemsPerPage]);

    // Stats
    const totalTutors = tutors.length;
    const activeTutors = tutors.filter((t) => t.status === "active").length;
    const multiEkskulTutors = tutors.filter((t) => t.ekstrakurikuler.length > 1).length;

    const handleViewDetail = (tutor: Tutor) => {
        setSelectedTutor(tutor);
        setIsDetailDialogOpen(true);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Data </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Tutor Ekskul</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data tutor ekstrakurikuler yang terdaftar
                    </p>

                </div>
                <div className="flex items-center gap-3">
                    <Button className="bg-blue-800 text-white hover:bg-blue-900 gap-2">
                        <Users className="h-4 w-4" />
                        Tambah Tutor
                    </Button>
                </div>
            </div>

            {/* Stats Card */}
            <Card className="overflow-hidden p-0">
                {/* Header */}
                <div className="bg-blue-800 p-4 relative overflow-hidden">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Statistik Tutor</h2>
                            <p className="text-blue-100 text-sm">Ringkasan data tenaga pengajar ekskul</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                        {/* Total Tutor */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                                <Users className="h-4 w-4 text-blue-800" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{totalTutors}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Tutor</p>
                        </div>

                        {/* Tutor Aktif */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-green-100 rounded-full mb-1.5">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{activeTutors}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Tutor Aktif</p>
                        </div>

                        {/* Multi Ekskul */}
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-purple-100 rounded-full mb-1.5">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-600">{multiEkskulTutors}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Mengajar &gt; 1 Ekskul</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tutors Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Daftar Tutor</CardTitle>
                                <CardDescription>Data lengkap tutor beserta ekstrakurikuler yang diampu</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {totalTutors} Tutor
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="px-4 pb-4 pt-2 border-b">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, ID, atau email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-11"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={ekskulFilter} onValueChange={setEkskulFilter}>
                                    <SelectTrigger className="w-[200px] h-11">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Ekstrakurikuler" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Ekskul</SelectItem>
                                        {uniqueEkskul.map((ekskul) => (
                                            <SelectItem key={ekskul} value={ekskul}>{ekskul}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px] h-11">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                    <th className="text-left p-4 font-medium text-sm w-36">ID</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-64">Nama Tutor</th>
                                    <th className="text-left p-4 font-medium text-sm">Ekstrakurikuler</th>
                                    <th className="text-left p-4 font-medium text-sm w-36">No HP</th>
                                    <th className="text-center p-4 font-medium text-sm w-32">Status</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTutors.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="rounded-full bg-muted p-6">
                                                    <Search className="h-12 w-12 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold text-foreground">Tidak Ada Data Ditemukan</h3>
                                                    <p className="text-sm text-muted-foreground max-w-md">
                                                        {searchQuery
                                                            ? `Tidak ada tutor yang cocok dengan pencarian "${searchQuery}"`
                                                            : "Tidak ada data tutor yang tersedia untuk ditampilkan."}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedTutors.map((tutor, index) => (
                                        <tr key={tutor.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-sm">{startIndex + index + 1}</td>
                                            <td className="p-4 text-sm font-mono">{tutor.tutorId}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {tutor.photo ? (
                                                        <img
                                                            src={tutor.photo}
                                                            alt={tutor.name}
                                                            className="h-10 w-10 rounded-full object-cover border border-slate-200"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200/50">
                                                            <span className="text-sm font-bold text-blue-800">
                                                                {getInitials(tutor.name)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">{tutor.name}</span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {tutor.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {tutor.ekstrakurikuler.map((ekskul, i) => (
                                                        <Badge key={i} className="bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100">
                                                            {ekskul}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm">{tutor.phone}</td>
                                            <td className="p-4 text-center">
                                                <Badge
                                                    variant={tutor.status === "active" ? "default" : "secondary"}
                                                    className={cn(
                                                        "pl-2 pr-3 py-1 rounded-full border shadow-none font-medium", // Common styles
                                                        tutor.status === "active"
                                                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" // Active styles
                                                            : "bg-red-100 text-red-700 border-red-200 hover:bg-red-100" // Inactive styles
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "mr-1.5 flex items-center justify-center rounded-full w-4 h-4",
                                                        tutor.status === "active" ? "bg-green-600/20 text-green-600" : "bg-red-600/20 text-red-600"
                                                    )}>
                                                        {tutor.status === "active" ? (
                                                            <CheckCircle className="h-3 w-3" />
                                                        ) : (
                                                            <ShieldAlert className="h-3 w-3" />
                                                        )}
                                                    </div>
                                                    {tutor.status === "active" ? "Aktif" : "Tidak Aktif"}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-3 bg-blue-100 hover:bg-blue-200 text-blue-800 hover:text-blue-900 border-blue-200"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleViewDetail(tutor)} className="focus:bg-blue-50">
                                                            <div className="p-1.5 bg-blue-100 rounded-md mr-2">
                                                                <Eye className="h-3.5 w-3.5 text-blue-800" />
                                                            </div>
                                                            <span className="text-blue-800">Lihat Detail</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="focus:bg-amber-50">
                                                            <div className="p-1.5 bg-amber-100 rounded-md mr-2">
                                                                <Edit className="h-3.5 w-3.5 text-amber-600" />
                                                            </div>
                                                            <span className="text-foreground">Edit Data</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="focus:bg-red-50">
                                                            <div className="p-1.5 bg-red-100 rounded-md mr-2">
                                                                <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                                                            </div>
                                                            <span className="text-red-600">Non-aktifkan</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer with Pagination */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-muted/20">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Menampilkan</span>
                            <span className="font-medium text-foreground">
                                {filteredTutors.length === 0 ? 0 : startIndex + 1}
                            </span>
                            <span>-</span>
                            <span className="font-medium text-foreground">
                                {Math.min(startIndex + itemsPerPage, filteredTutors.length)}
                            </span>
                            <span>dari</span>
                            <span className="font-medium text-foreground">{filteredTutors.length}</span>
                            <span>data</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(Number(val))}>
                                <SelectTrigger className="w-[100px] h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 / hal</SelectItem>
                                    <SelectItem value="10">10 / hal</SelectItem>
                                    <SelectItem value="25">25 / hal</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground mr-2">
                                    Hal {currentPage}/{totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNumber = i + 1;
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
                                    {totalPages > 5 && (
                                        <>
                                            <span className="text-sm text-muted-foreground">...</span>
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
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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

            {/* Detail Tutor Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Detail Tutor</DialogTitle>
                                <DialogDescription>
                                    Informasi lengkap tutor ekstrakurikuler
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedTutor && (
                        <div className="space-y-4">
                            {/* Profile Header */}
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                                    <span className="text-xl font-bold text-blue-800">
                                        {getInitials(selectedTutor.name)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedTutor.name}</h3>
                                    <p className="text-sm text-muted-foreground">ID: {selectedTutor.tutorId}</p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Status</p>
                                        <Badge
                                            variant={selectedTutor.status === "active" ? "default" : "secondary"}
                                            className={cn(
                                                "mt-1",
                                                selectedTutor.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            )}
                                        >
                                            {selectedTutor.status === "active" ? "Aktif" : "Tidak Aktif"}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Bergabung Sejak</p>
                                        <p className="text-sm font-medium mt-1">
                                            {formatDate(new Date(selectedTutor.joinDate), "dd MMM yyyy")}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Ekstrakurikuler yang Diampu</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedTutor.ekstrakurikuler.map((ekskul, i) => (
                                            <Badge key={i} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                                {ekskul}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                        <Mail className="h-3 w-3" /> Email
                                    </p>
                                    <p className="text-sm font-medium">{selectedTutor.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                        <Phone className="h-3 w-3" /> No Handphone
                                    </p>
                                    <p className="text-sm font-medium">{selectedTutor.phone}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                            Tutup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
