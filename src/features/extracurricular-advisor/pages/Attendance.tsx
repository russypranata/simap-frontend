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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Heart,
    Calendar,
    Users,
    Save,
    Download,
    Search,
    Filter,
} from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter";

// Mock Data
const mockMembers = [
    {
        id: 1,
        nis: "2022001",
        name: "Andi Wijaya",
        class: "XII A",
    },
    {
        id: 2,
        nis: "2022002",
        name: "Rina Kusuma",
        class: "XI A",
    },
    {
        id: 3,
        nis: "2022003",
        name: "Doni Pratama",
        class: "XI B",
    },
    {
        id: 4,
        nis: "2022004",
        name: "Sari Dewi",
        class: "XII A",
    },
    {
        id: 5,
        nis: "2022005",
        name: "Budi Santoso",
        class: "X A",
    },
];

const mockAttendanceHistory = [
    {
        id: 1,
        date: "2025-12-15",
        activity: "Latihan Rutin",
        present: 42,
        total: 45,
        percentage: 93,
    },
    {
        id: 2,
        date: "2025-12-08",
        activity: "Latihan Rutin",
        present: 40,
        total: 45,
        percentage: 89,
    },
    {
        id: 3,
        date: "2025-12-01",
        activity: "Persiapan Lomba",
        present: 38,
        total: 45,
        percentage: 84,
    },
];

type AttendanceStatus = "Hadir" | "Izin" | "Sakit" | "Alpha";

interface AttendanceRecord {
    studentId: number;
    status: AttendanceStatus;
    note?: string;
}

export const ExtracurricularAttendance: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(
        formatDate(new Date(), "yyyy-MM-dd")
    );
    const [activityName, setActivityName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [attendanceRecords, setAttendanceRecords] = useState<
        AttendanceRecord[]
    >(
        mockMembers.map((member) => ({
            studentId: member.id,
            status: "Hadir",
        }))
    );

    const filteredMembers = mockMembers.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.nis.includes(searchQuery);
        return matchesSearch;
    });

    const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
        setAttendanceRecords((prev) =>
            prev.map((record) =>
                record.studentId === studentId ? { ...record, status } : record
            )
        );
    };

    const handleSaveAttendance = () => {
        // Mock: Save attendance data
        console.log("Saving attendance:", {
            date: selectedDate,
            activity: activityName,
            records: attendanceRecords,
        });
        alert("Presensi berhasil disimpan!");
    };

    const getStatusIcon = (status: AttendanceStatus) => {
        switch (status) {
            case "Hadir":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "Izin":
                return <AlertCircle className="h-4 w-4 text-blue-600" />;
            case "Sakit":
                return <Heart className="h-4 w-4 text-amber-600" />;
            case "Alpha":
                return <XCircle className="h-4 w-4 text-red-600" />;
        }
    };

    const getStatusBadgeVariant = (status: AttendanceStatus) => {
        switch (status) {
            case "Hadir":
                return "default";
            case "Izin":
                return "secondary";
            case "Sakit":
                return "outline";
            case "Alpha":
                return "destructive";
        }
    };

    const stats = {
        hadir: attendanceRecords.filter((r) => r.status === "Hadir").length,
        izin: attendanceRecords.filter((r) => r.status === "Izin").length,
        sakit: attendanceRecords.filter((r) => r.status === "Sakit").length,
        alpha: attendanceRecords.filter((r) => r.status === "Alpha").length,
    };

    const attendancePercentage = Math.round(
        (stats.hadir / mockMembers.length) * 100
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Presensi <span className="text-primary">Kegiatan Ekskul</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Catat kehadiran anggota ekstrakurikuler Pramuka
                    </p>
                </div>
            </div>

            <Tabs defaultValue="attendance" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="attendance">Input Presensi</TabsTrigger>
                    <TabsTrigger value="history">Riwayat Presensi</TabsTrigger>
                </TabsList>

                {/* Input Presensi Tab */}
                <TabsContent value="attendance" className="space-y-6">
                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kegiatan</CardTitle>
                            <CardDescription>
                                Isi informasi kegiatan dan tanggal presensi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Tanggal Kegiatan</Label>
                                    <Input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nama Kegiatan</Label>
                                    <Input
                                        placeholder="Contoh: Latihan Rutin"
                                        value={activityName}
                                        onChange={(e) => setActivityName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ekstrakurikuler</Label>
                                    <Input value="Pramuka" disabled />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Anggota
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mockMembers.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    Hadir
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.hadir}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    Izin
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.izin}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-amber-600 flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    Sakit
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-amber-600">
                                    {stats.sakit}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    Alpha
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {stats.alpha}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Attendance Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Daftar Kehadiran</CardTitle>
                                    <CardDescription>
                                        Tandai status kehadiran setiap anggota
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-base px-3 py-1">
                                        Kehadiran: {attendancePercentage}%
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Search */}
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama atau NIS..."
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
                                            <TableHead className="w-12">#</TableHead>
                                            <TableHead>NIS</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Kelas</TableHead>
                                            <TableHead>Status Kehadiran</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMembers.map((member, index) => {
                                            const record = attendanceRecords.find(
                                                (r) => r.studentId === member.id
                                            );
                                            return (
                                                <TableRow key={member.id}>
                                                    <TableCell className="font-medium">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">
                                                        {member.nis}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {member.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{member.class}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={record?.status}
                                                            onValueChange={(value: AttendanceStatus) =>
                                                                handleStatusChange(member.id, value)
                                                            }
                                                        >
                                                            <SelectTrigger className="w-[140px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Hadir">
                                                                    <div className="flex items-center gap-2">
                                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                                        Hadir
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="Izin">
                                                                    <div className="flex items-center gap-2">
                                                                        <AlertCircle className="h-4 w-4 text-blue-600" />
                                                                        Izin
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="Sakit">
                                                                    <div className="flex items-center gap-2">
                                                                        <Heart className="h-4 w-4 text-amber-600" />
                                                                        Sakit
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="Alpha">
                                                                    <div className="flex items-center gap-2">
                                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                                        Alpha
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                                <Button onClick={handleSaveAttendance}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Simpan Presensi
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Riwayat Presensi Tab */}
                <TabsContent value="history" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Presensi</CardTitle>
                            <CardDescription>
                                Rekap kehadiran kegiatan ekstrakurikuler
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Nama Kegiatan</TableHead>
                                            <TableHead>Hadir</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Persentase</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockAttendanceHistory.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="font-medium">
                                                    {formatDate(new Date(record.date), "dd MMM yyyy")}
                                                </TableCell>
                                                <TableCell>{record.activity}</TableCell>
                                                <TableCell>
                                                    <span className="text-green-600 font-semibold">
                                                        {record.present}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{record.total}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-medium">
                                                            {record.percentage}%
                                                        </div>
                                                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${record.percentage >= 90
                                                                        ? "bg-green-500"
                                                                        : record.percentage >= 75
                                                                            ? "bg-amber-500"
                                                                            : "bg-red-500"
                                                                    }`}
                                                                style={{ width: `${record.percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
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
                </TabsContent>
            </Tabs>
        </div>
    );
};
