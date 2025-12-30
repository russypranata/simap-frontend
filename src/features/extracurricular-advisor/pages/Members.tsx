"use client";

import React, { useState, useMemo } from "react";
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
    CheckCircle,
    Eye,
    Activity,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/shared/utils/dateFormatter";


// Mock Data - Registered members
const mockMembers: Member[] = [
    { id: 1, nis: "2022001", name: "Andi Wijaya", class: "XII A", joinDate: "2024-07-15", attendance: 92 },
    { id: 2, nis: "2022002", name: "Rina Kusuma", class: "XI A", joinDate: "2024-07-15", attendance: 88 },
    { id: 3, nis: "2022003", name: "Doni Pratama", class: "XI B", joinDate: "2024-07-20", attendance: 95 },
    { id: 4, nis: "2022004", name: "Siti Aminah", class: "XII B", joinDate: "2024-07-15", attendance: 78 },
    { id: 5, nis: "2022005", name: "Budi Santoso", class: "X A", joinDate: "2024-08-01", attendance: 85 },
    { id: 6, nis: "2022006", name: "Dewi Lestari", class: "XII A", joinDate: "2024-07-15", attendance: 45 },
    { id: 7, nis: "2022007", name: "Eko Prasetyo", class: "XI A", joinDate: "2024-07-20", attendance: 90 },
    { id: 8, nis: "2022008", name: "Fitri Handayani", class: "XI B", joinDate: "2024-08-05", attendance: 82 },
    { id: 9, nis: "2022009", name: "Gilang Ramadhan", class: "XII B", joinDate: "2024-07-15", attendance: 88 },
    { id: 10, nis: "2022010", name: "Hana Safitri", class: "X A", joinDate: "2024-08-10", attendance: 91 },
    { id: 11, nis: "2022011", name: "Irfan Hakim", class: "X B", joinDate: "2024-08-12", attendance: 87 },
    { id: 12, nis: "2022012", name: "Julia Permata", class: "XI A", joinDate: "2024-07-18", attendance: 93 },
    { id: 13, nis: "2022013", name: "Kevin Anggara", class: "XI B", joinDate: "2024-07-22", attendance: 76 },
    { id: 14, nis: "2022014", name: "Luna Maya", class: "XII A", joinDate: "2024-07-15", attendance: 89 },
    { id: 15, nis: "2022015", name: "Muhammad Rizky", class: "XII B", joinDate: "2024-07-15", attendance: 94 },
    { id: 16, nis: "2022016", name: "Nabila Putri", class: "X A", joinDate: "2024-08-05", attendance: 81 },
    { id: 17, nis: "2022017", name: "Oscar Wijaya", class: "X B", joinDate: "2024-08-08", attendance: 72 },
    { id: 18, nis: "2022018", name: "Putri Ayu", class: "XI A", joinDate: "2024-07-20", attendance: 96 },
    { id: 19, nis: "2022019", name: "Qori Azzahra", class: "XI B", joinDate: "2024-07-25", attendance: 84 },
    { id: 20, nis: "2022020", name: "Reza Pahlevi", class: "XII A", joinDate: "2024-07-15", attendance: 91 },
    { id: 21, nis: "2022021", name: "Sinta Dewi", class: "XII B", joinDate: "2024-07-15", attendance: 68 },
    { id: 22, nis: "2022022", name: "Taufik Hidayat", class: "X A", joinDate: "2024-08-10", attendance: 79 },
    { id: 23, nis: "2022023", name: "Umar Bakri", class: "X B", joinDate: "2024-08-15", attendance: 86 },
    { id: 24, nis: "2022024", name: "Vina Melati", class: "XI A", joinDate: "2024-07-18", attendance: 92 },
    { id: 25, nis: "2022025", name: "Wahyu Pratama", class: "XI B", joinDate: "2024-07-22", attendance: 88 },
];

interface Member {
    id: number;
    nis: string;
    name: string;
    class: string;
    joinDate: string;
    attendance: number;
}

export const ExtracurricularMembers: React.FC = () => {
    const [members] = useState<Member[]>(mockMembers);
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter members for main table
    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            const matchesSearch =
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.nis.includes(searchQuery);
            const matchesClass = classFilter === "all" || member.class === classFilter;
            return matchesSearch && matchesClass;
        });
    }, [members, searchQuery, classFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

    // Reset page when filter changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, classFilter, itemsPerPage]);

    // Stats
    const totalMembers = members.length;
    const avgAttendance = Math.round(members.reduce((acc, curr) => acc + curr.attendance, 0) / (members.length || 1));
    const topPerformers = members.filter((m) => m.attendance >= 90).length;
    const needsAttention = members.filter((m) => m.attendance < 75).length;

    const handleViewDetail = (member: Member) => {
        setSelectedMember(member);
        setIsDetailDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Daftar </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anggota Ekskul</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Lihat daftar anggota ekstrakurikuler Pramuka
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
            <Card className="overflow-hidden p-0 gap-0">
                {/* Header */}
                <div className="bg-blue-800 p-4 rounded-t-lg relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full" />
                    <div className="absolute right-12 -bottom-6 w-16 h-16 bg-white/5 rounded-full" />

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Statistik Anggota</h3>
                            <p className="text-blue-100 text-sm">Ekstrakurikuler Pramuka</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 divide-x">
                    {/* Total Anggota */}
                    <div className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-blue-100 rounded-full mb-2">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
                        <p className="text-xs text-muted-foreground">Total Anggota</p>
                    </div>

                    {/* Top Performers */}
                    <div className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-green-100 rounded-full mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-green-600">{topPerformers}</p>
                        <p className="text-xs text-muted-foreground">Kehadiran ≥90%</p>
                    </div>

                    {/* Rata-rata Kehadiran */}
                    <div className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-primary/10 rounded-full mb-2">
                            <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-2xl font-bold text-primary">{avgAttendance}%</p>
                        <p className="text-xs text-muted-foreground">Rata-rata Kehadiran</p>
                    </div>

                    {/* Perlu Perhatian */}
                    <div className="p-4 text-center">
                        <div className="inline-flex p-2.5 bg-red-100 rounded-full mb-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-red-600">{needsAttention}</p>
                        <p className="text-xs text-muted-foreground">Kehadiran &lt;75%</p>
                    </div>
                </div>
            </Card>

            {/* Members Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Daftar Anggota Terdaftar</CardTitle>
                                <CardDescription>Anggota aktif ekstrakurikuler Pramuka</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {totalMembers} Anggota
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="p-4 border-b">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau NIS anggota..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    <SelectItem value="X A">X A</SelectItem>
                                    <SelectItem value="X B">X B</SelectItem>
                                    <SelectItem value="XI A">XI A</SelectItem>
                                    <SelectItem value="XI B">XI B</SelectItem>
                                    <SelectItem value="XII A">XII A</SelectItem>
                                    <SelectItem value="XII B">XII B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                    <th className="text-left p-4 font-medium text-sm w-24">NIS</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-48">Nama</th>
                                    <th className="text-left p-4 font-medium text-sm w-24">Kelas</th>
                                    <th className="text-left p-4 font-medium text-sm w-36">Tgl Bergabung</th>
                                    <th className="text-left p-4 font-medium text-sm w-32">Kehadiran</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="rounded-full bg-muted p-6">
                                                    <Search className="h-12 w-12 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-semibold">Tidak Ada Data</h3>
                                                    <p className="text-sm text-muted-foreground max-w-md">
                                                        {searchQuery
                                                            ? `Tidak ada anggota yang cocok dengan pencarian "${searchQuery}"`
                                                            : "Tidak ada data anggota."}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedMembers.map((member, index) => (
                                        <tr key={member.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-sm">{startIndex + index + 1}</td>
                                            <td className="p-4 text-sm font-mono">{member.nis}</td>
                                            <td className="p-4">
                                                <div className="font-medium">{member.name}</div>
                                            </td>
                                            <td className="p-4">
                                                <Badge className="bg-blue-50 text-blue-800 border-blue-200">
                                                    {member.class}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm">
                                                {formatDate(new Date(member.joinDate), "dd MMM yyyy")}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{member.attendance}%</span>
                                                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full",
                                                                member.attendance >= 90
                                                                    ? "bg-green-500"
                                                                    : member.attendance >= 75
                                                                        ? "bg-amber-500"
                                                                        : "bg-red-500"
                                                            )}
                                                            style={{ width: `${member.attendance}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg"
                                                    onClick={() => handleViewDetail(member)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1.5" />
                                                    Detail
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
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
                                {filteredMembers.length === 0 ? 0 : startIndex + 1}
                            </span>
                            <span>-</span>
                            <span className="font-medium text-foreground">
                                {Math.min(startIndex + itemsPerPage, filteredMembers.length)}
                            </span>
                            <span>dari</span>
                            <span className="font-medium text-foreground">{filteredMembers.length}</span>
                            <span>data</span>
                        </div>

                        {/* Right: Pagination */}
                        <div className="flex items-center gap-3">
                            {/* Items per page */}
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

                            {/* Pagination buttons */}
                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
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
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Member Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>Detail Anggota</DialogTitle>
                                <DialogDescription>
                                    Informasi lengkap anggota ekstrakurikuler
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedMember && (
                        <div className="space-y-4">
                            {/* Profile Header */}
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xl font-bold text-primary">
                                        {selectedMember.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedMember.name}</h3>
                                    <p className="text-sm text-muted-foreground">NIS: {selectedMember.nis}</p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Kelas</p>
                                    <Badge className="bg-blue-50 text-blue-800 border-blue-200">
                                        {selectedMember.class}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Ekstrakurikuler</p>
                                    <Badge className="bg-primary/10 text-primary border-primary/20">
                                        Pramuka
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Tanggal Bergabung</p>
                                    <p className="text-sm font-medium">
                                        {formatDate(new Date(selectedMember.joinDate), "dd MMMM yyyy")}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Kehadiran</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">{selectedMember.attendance}%</span>
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full",
                                                    selectedMember.attendance >= 90 ? "bg-green-500" :
                                                        selectedMember.attendance >= 75 ? "bg-amber-500" : "bg-red-500"
                                                )}
                                                style={{ width: `${selectedMember.attendance}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Status */}
                            <div className="p-3 rounded-lg border bg-card">
                                <p className="text-xs text-muted-foreground mb-2">Status Kehadiran</p>
                                <p className={cn(
                                    "text-sm font-medium",
                                    selectedMember.attendance >= 90 ? "text-green-600" :
                                        selectedMember.attendance >= 75 ? "text-amber-600" : "text-red-600"
                                )}>
                                    {selectedMember.attendance >= 90 ? "Sangat Baik - Anggota rajin hadir" :
                                        selectedMember.attendance >= 75 ? "Cukup Baik - Perlu ditingkatkan" :
                                            "Perlu Perhatian - Kehadiran rendah"}
                                </p>
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
