"use client";

import React, { useState } from "react";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Download,
    Trash2,
    Calendar,
    Star,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter";

// Mock Data
const mockStudents = [
    { id: 1, nis: "2023001", name: "Ahmad Rizky", class: "XII A", status: "available" },
    { id: 2, nis: "2023002", name: "Siti Nurhaliza", class: "XII A", status: "available" },
    { id: 3, nis: "2023003", name: "Budi Santoso", class: "XII B", status: "available" },
    { id: 4, nis: "2023004", name: "Dewi Lestari", class: "XI A", status: "available" },
    { id: 5, nis: "2023005", name: "Eko Prasetyo", class: "XI B", status: "available" },
    { id: 6, nis: "2023006", name: "Fitri Handayani", class: "X A", status: "available" },
    { id: 7, nis: "2023007", name: "Gilang Ramadhan", class: "X B", status: "available" },
];

const mockMembers = [
    {
        id: 1,
        nis: "2022001",
        name: "Andi Wijaya",
        class: "XII A",
        joinDate: "2024-07-15",
        status: "active",
        attendance: 92,
    },
    {
        id: 2,
        nis: "2022002",
        name: "Rina Kusuma",
        class: "XI A",
        joinDate: "2024-07-15",
        status: "active",
        attendance: 88,
    },
    {
        id: 3,
        nis: "2022003",
        name: "Doni Pratama",
        class: "XI B",
        joinDate: "2024-07-20",
        status: "active",
        attendance: 95,
    },
];

export const ExtracurricularMembers: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [members, setMembers] = useState(mockMembers);

    // Form state for adding members
    const [formData, setFormData] = useState({
        academicYear: "2025/2026",
        semester: "Ganjil",
        startDate: formatDate(new Date(), "yyyy-MM-dd"),
        notes: "",
    });

    const filteredStudents = mockStudents.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.nis.includes(searchQuery);
        const matchesClass =
            selectedClass === "all" || student.class === selectedClass;
        return matchesSearch && matchesClass;
    });

    const filteredMembers = members.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.nis.includes(searchQuery);
        return matchesSearch;
    });

    const handleSelectStudent = (studentId: number) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map((s) => s.id));
        }
    };

    const handleSubmitRegistration = () => {
        // Mock: Add selected students to members
        const newMembers = selectedStudents.map((studentId) => {
            const student = mockStudents.find((s) => s.id === studentId);
            return {
                id: members.length + studentId,
                nis: student!.nis,
                name: student!.name,
                class: student!.class,
                joinDate: formData.startDate,
                status: "active" as const,
                attendance: 0,
            };
        });

        setMembers([...members, ...newMembers]);
        setSelectedStudents([]);
        setIsAddDialogOpen(false);
        setFormData({
            academicYear: "2025/2026",
            semester: "Ganjil",
            startDate: formatDate(new Date(), "yyyy-MM-dd"),
            notes: "",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Kelola <span className="text-primary">Anggota Ekskul</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Daftarkan dan kelola anggota ekstrakurikuler Pramuka
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Daftarkan Anggota Baru
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
                                                <SelectItem value="2025/2026">2025/2026</SelectItem>
                                                <SelectItem value="2024/2025">2024/2025</SelectItem>
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
                                        rows={3}
                                    />
                                </div>

                                {/* Student Selection */}
                                <div className="space-y-4 border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-semibold">
                                            Pilih Siswa
                                        </Label>
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
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>
                                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Filter Kelas" />
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

                                    {/* Student Table */}
                                    <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12">
                                                        <Checkbox
                                                            checked={
                                                                selectedStudents.length ===
                                                                filteredStudents.length &&
                                                                filteredStudents.length > 0
                                                            }
                                                            onCheckedChange={handleSelectAll}
                                                        />
                                                    </TableHead>
                                                    <TableHead>NIS</TableHead>
                                                    <TableHead>Nama Siswa</TableHead>
                                                    <TableHead>Kelas</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredStudents.map((student) => (
                                                    <TableRow key={student.id}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedStudents.includes(student.id)}
                                                                onCheckedChange={() =>
                                                                    handleSelectStudent(student.id)
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-mono text-sm">
                                                            {student.nis}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {student.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{student.class}</Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleSubmitRegistration}
                                    disabled={selectedStudents.length === 0}
                                >
                                    Daftarkan {selectedStudents.length} Siswa
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Anggota
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{members.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Anggota aktif</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Kelas X
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {members.filter((m) => m.class.startsWith("X")).length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Siswa</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Kelas XI
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {members.filter((m) => m.class.startsWith("XI")).length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Siswa</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Kelas XII
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {members.filter((m) => m.class.startsWith("XII")).length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Siswa</p>
                    </CardContent>
                </Card>
            </div>

            {/* Members Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Daftar Anggota</CardTitle>
                            <CardDescription>
                                Kelola dan pantau anggota ekstrakurikuler
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau NIS anggota..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIS</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Tanggal Bergabung</TableHead>
                                    <TableHead>Kehadiran</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMembers.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-mono text-sm">
                                            {member.nis}
                                        </TableCell>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{member.class}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(new Date(member.joinDate), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-medium">
                                                    {member.attendance}%
                                                </div>
                                                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${member.attendance >= 90
                                                                ? "bg-green-500"
                                                                : member.attendance >= 75
                                                                    ? "bg-amber-500"
                                                                    : "bg-red-500"
                                                            }`}
                                                        style={{ width: `${member.attendance}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    member.status === "active" ? "default" : "secondary"
                                                }
                                            >
                                                {member.status === "active" ? (
                                                    <>
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Aktif
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Tidak Aktif
                                                    </>
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">
                                                Detail
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
