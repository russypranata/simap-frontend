"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    User,
    Search,
    Download,
    Filter,
    History
} from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter";

// Mock Data for Detail
const mockDetailData = {
    id: 1,
    date: "2025-12-20",
    activity: "Pertemuan Ekstrakurikuler Pramuka",
    present: 42,
    total: 45,
    percentage: 93,
    students: [
        { id: 1, nis: "2022001", name: "Andi Wijaya", class: "XII A", status: "hadir" },
        { id: 2, nis: "2022002", name: "Rina Kusuma", class: "XI A", status: "sakit" },
        { id: 3, nis: "2022003", name: "Doni Pratama", class: "XI B", status: "hadir" },
        { id: 4, nis: "2022004", name: "Siti Aminah", class: "XII B", status: "izin" },
        { id: 5, nis: "2022005", name: "Budi Santoso", class: "X A", status: "hadir" },
        // Add more mock data as needed
    ]
};

export default function AttendanceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

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

    const filteredStudents = mockDetailData.students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nis.includes(searchTerm) ||
            student.class.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || student.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Button
                        variant="ghost"
                        className="mb-2 pl-0 hover:bg-transparent hover:text-blue-600"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Detail Riwayat <span className="text-primary">Presensi Siswa</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <History className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Informasi detail kehadiran siswa pada pertemuan {formatDate(mockDetailData.date, "dd MMMM yyyy")}
                    </p>
                </div>

            </div>



            {/* Student List */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>Daftar Kehadiran Siswa</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="search"
                                    placeholder="Cari siswa..."
                                    className="pl-9 h-9 w-full sm:w-[250px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Semua Status</option>
                                <option value="hadir">Hadir</option>
                                <option value="izin">Izin</option>
                                <option value="sakit">Sakit</option>
                                <option value="alpa">Alpa</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">NIS</TableHead>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.nis}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-slate-500" />
                                                </div>
                                                <span className="font-medium">{student.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{student.class}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className={getStatusBadgeVariant(student.status)}>
                                                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Tidak ada data siswa ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
