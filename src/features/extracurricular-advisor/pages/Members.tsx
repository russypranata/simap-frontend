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
import { Label } from "@/components/ui/label";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Trash2,
    Calendar,
    CheckCircle,
    AlertTriangle,
    Settings,
    Eye,
    Activity,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { toast } from "sonner";

// Mock Data - Available students (not yet registered)
const mockAvailableStudents = [
    { id: 101, nis: "2024001", name: "Ahmad Rizky", class: "X A" },
    { id: 102, nis: "2024002", name: "Siti Nurhaliza", class: "X A" },
    { id: 103, nis: "2024003", name: "Budi Santoso", class: "X B" },
    { id: 104, nis: "2024004", name: "Dewi Lestari", class: "X A" },
    { id: 105, nis: "2024005", name: "Eko Prasetyo", class: "X B" },
    { id: 106, nis: "2024006", name: "Fitri Handayani", class: "X A" },
    { id: 107, nis: "2024007", name: "Gilang Ramadhan", class: "X B" },
];

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
    const [members, setMembers] = useState<Member[]>(mockMembers);
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [dialogSearchQuery, setDialogSearchQuery] = useState("");
    const [dialogClassFilter, setDialogClassFilter] = useState("all");

    // Form state for adding members
    const [formData, setFormData] = useState({
        academicYear: "2024/2025",
        semester: "Ganjil",
        startDate: formatDate(new Date(), "yyyy-MM-dd"),
        notes: "",
    });

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

    // Filter available students for dialog
    const filteredAvailableStudents = useMemo(() => {
        return mockAvailableStudents.filter((student) => {
            const matchesSearch =
                student.name.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
                student.nis.includes(dialogSearchQuery);
            const matchesClass = dialogClassFilter === "all" || student.class === dialogClassFilter;
            return matchesSearch && matchesClass;
        });
    }, [dialogSearchQuery, dialogClassFilter]);

    // Stats
    const totalMembers = members.length;
    const avgAttendance = Math.round(members.reduce((acc, curr) => acc + curr.attendance, 0) / (members.length || 1));
    const topPerformers = members.filter((m) => m.attendance >= 90).length;
    const needsAttention = members.filter((m) => m.attendance < 75).length;

    const handleSelectStudent = (studentId: number) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === filteredAvailableStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredAvailableStudents.map((s) => s.id));
        }
    };

    const handleSubmitRegistration = () => {
        const newMembers = selectedStudents.map((studentId) => {
            const student = mockAvailableStudents.find((s) => s.id === studentId);
            return {
                id: members.length + studentId,
                nis: student!.nis,
                name: student!.name,
                class: student!.class,
                joinDate: formData.startDate,
                attendance: 0,
            };
        });

        setMembers([...members, ...newMembers]);
        setSelectedStudents([]);
        setIsAddDialogOpen(false);
        setFormData({
            academicYear: "2024/2025",
            semester: "Ganjil",
            startDate: formatDate(new Date(), "yyyy-MM-dd"),
            notes: "",
        });
        toast.success(`${newMembers.length} siswa berhasil didaftarkan!`);
    };

    const handleOpenDeleteDialog = (member: Member) => {
        setMemberToDelete(member);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (memberToDelete) {
            setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
            toast.success(`Anggota "${memberToDelete.name}" berhasil dihapus`);
            setMemberToDelete(null);
            setIsDeleteDialogOpen(false);
        }
    };

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
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Kelola </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anggota Ekskul</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Daftarkan dan kelola anggota ekstrakurikuler Pramuka
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2024/2025</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-sm font-medium text-blue-800">
                            Semester Ganjil
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-800 text-white hover:bg-blue-900 px-6 py-2.5">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Daftarkan Anggota
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Daftarkan Anggota Baru</DialogTitle>
                                <DialogDescription>
                                    Pilih siswa yang akan didaftarkan ke ekstrakurikuler Pramuka
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                {/* Form Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Tahun Ajaran</Label>
                                        <Select
                                            value={formData.academicYear}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, academicYear: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="2024/2025">2024/2025</SelectItem>
                                                <SelectItem value="2023/2024">2023/2024</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Semester</Label>
                                        <Select
                                            value={formData.semester}
                                            onValueChange={(value) =>
                                                setFormData({ ...formData, semester: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ganjil">Ganjil</SelectItem>
                                                <SelectItem value="Genap">Genap</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Tanggal Mulai</Label>
                                        <Input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, startDate: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Ekstrakurikuler</Label>
                                        <Input value="Pramuka" disabled />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Keterangan (Opsional)</Label>
                                    <Textarea
                                        placeholder="Tambahkan catatan jika diperlukan..."
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({ ...formData, notes: e.target.value })
                                        }
                                        rows={2}
                                    />
                                </div>

                                {/* Student Selection */}
                                <div className="space-y-4 border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-semibold">Pilih Siswa</Label>
                                        <Badge variant="secondary">
                                            {selectedStudents.length} dipilih
                                        </Badge>
                                    </div>

                                    {/* Filters */}
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Cari nama atau NIS..."
                                                value={dialogSearchQuery}
                                                onChange={(e) => setDialogSearchQuery(e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>
                                        <Select value={dialogClassFilter} onValueChange={setDialogClassFilter}>
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Filter Kelas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua Kelas</SelectItem>
                                                <SelectItem value="X A">X A</SelectItem>
                                                <SelectItem value="X B">X B</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Student Table */}
                                    <div className="border rounded-lg max-h-[250px] overflow-y-auto">
                                        <table className="w-full">
                                            <thead className="bg-muted/50 sticky top-0">
                                                <tr>
                                                    <th className="text-left p-3 font-medium text-sm w-12">
                                                        <Checkbox
                                                            checked={
                                                                selectedStudents.length === filteredAvailableStudents.length &&
                                                                filteredAvailableStudents.length > 0
                                                            }
                                                            onCheckedChange={handleSelectAll}
                                                        />
                                                    </th>
                                                    <th className="text-left p-3 font-medium text-sm">NIS</th>
                                                    <th className="text-left p-3 font-medium text-sm">Nama Siswa</th>
                                                    <th className="text-left p-3 font-medium text-sm">Kelas</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredAvailableStudents.map((student) => (
                                                    <tr key={student.id} className="border-b hover:bg-muted/30">
                                                        <td className="p-3">
                                                            <Checkbox
                                                                checked={selectedStudents.includes(student.id)}
                                                                onCheckedChange={() => handleSelectStudent(student.id)}
                                                            />
                                                        </td>
                                                        <td className="p-3 font-mono text-sm">{student.nis}</td>
                                                        <td className="p-3 font-medium">{student.name}</td>
                                                        <td className="p-3">
                                                            <Badge variant="outline">{student.class}</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button onClick={handleSubmitRegistration} disabled={selectedStudents.length === 0}>
                                    Daftarkan {selectedStudents.length} Siswa
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Anggota</p>
                                <p className="text-2xl font-bold">{totalMembers}</p>
                                <p className="text-xs text-muted-foreground">Terdaftar aktif</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                                <p className="text-2xl font-bold text-green-600">{topPerformers}</p>
                                <p className="text-xs text-muted-foreground">Kehadiran ≥90%</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Rata-rata Kehadiran</p>
                                <p className="text-2xl font-bold text-primary">{avgAttendance}%</p>
                                <p className="text-xs text-muted-foreground">Semester ini</p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Activity className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Perlu Perhatian</p>
                                <p className="text-2xl font-bold text-red-600">{needsAttention}</p>
                                <p className="text-xs text-muted-foreground">Kehadiran &lt;75%</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-xl">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Members Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Daftar Anggota</CardTitle>
                            <CardDescription>Kelola dan pantau anggota ekstrakurikuler</CardDescription>
                        </div>
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
                                {filteredMembers.length === 0 ? (
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
                                    filteredMembers.map((member, index) => (
                                        <tr key={member.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4 text-sm">{index + 1}</td>
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg">
                                                            <Settings className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => handleViewDetail(member)}
                                                        >
                                                            <div className="p-1 rounded bg-blue-50 mr-2">
                                                                <Eye className="h-3.5 w-3.5 text-blue-600" />
                                                            </div>
                                                            Lihat Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="cursor-pointer text-red-600 focus:text-red-600"
                                                            onClick={() => handleOpenDeleteDialog(member)}
                                                        >
                                                            <div className="p-1 rounded bg-red-50 mr-2">
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </div>
                                                            Hapus Anggota
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

                    {/* Footer Info */}
                    <div className="p-4 border-t text-sm text-muted-foreground">
                        Menampilkan {filteredMembers.length} dari {members.length} anggota
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <DialogTitle>Hapus Anggota</DialogTitle>
                                <DialogDescription>
                                    Tindakan ini tidak dapat dibatalkan
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {memberToDelete && (
                        <div className="py-4">
                            <p className="text-sm text-muted-foreground">
                                Apakah Anda yakin ingin menghapus anggota berikut dari ekstrakurikuler?
                            </p>
                            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                <p className="font-medium">{memberToDelete.name}</p>
                                <p className="text-sm text-muted-foreground">NIS: {memberToDelete.nis} • Kelas {memberToDelete.class}</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setMemberToDelete(null);
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus Anggota
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
