"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Clock,
    UserMinus,
    AlertCircle,
    History,
    Calendar,
    ArrowRight,
    X,
    Filter,
    FileText,
    ChevronLeft,
    ChevronRight,
    Eye,
    Trash2
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import LateRecordHistory from "@/features/teacher/components/picket/LateRecordHistory";
import { StatCard } from "@/features/shared/components";

// Mock data for students
const mockStudentsInitial = [
    { id: 1, name: "Ahmad Rizky", class: "XII A", nis: "2024101" },
    { id: 2, name: "Budi Santoso", class: "XII A", nis: "2024102" },
    { id: 3, name: "Citra Dewi", class: "XII A", nis: "2024103" },
    { id: 4, name: "Dewi Putri", class: "XII A", nis: "2024104" },
    { id: 5, name: "Eko Prasetyo", class: "XII B", nis: "2024105" },
    { id: 6, name: "Fani Rahmawati", class: "XII B", nis: "2024106" },
    { id: 7, name: "Gunawan", class: "XI A", nis: "2024107" },
    { id: 8, name: "Hesti", class: "XI A", nis: "2024108" },
    { id: 9, name: "Indra", class: "X A", nis: "2024109" },
    { id: 10, name: "Joko", class: "X B", nis: "2024110" },
    { id: 11, name: "Kartika Sari", class: "XII A", nis: "2024111" },
    { id: 12, name: "Lestari", class: "XII B", nis: "2024112" },
    { id: 13, name: "Muhammad Iqbal", class: "XI A", nis: "2024113" },
    { id: 14, name: "Nur Azizah", class: "XI B", nis: "2024114" },
    { id: 15, name: "Omar Bakri", class: "X A", nis: "2024115" },
    { id: 16, name: "Putri Ayu", class: "X B", nis: "2024116" },
    { id: 17, name: "Qori Amalia", class: "XII A", nis: "2024117" },
    { id: 18, name: "Rudi Hartono", class: "XII B", nis: "2024118" },
    { id: 19, name: "Siti Nurhaliza", class: "XI A", nis: "2024119" },
    { id: 20, name: "Taufik Hidayat", class: "XI B", nis: "2024120" },
    { id: 21, name: "Umar Faruq", class: "XII A", nis: "2024121" },
    { id: 22, name: "Vina Melati", class: "XII B", nis: "2024122" },
    { id: 23, name: "Wahyu Setiawan", class: "XI A", nis: "2024123" },
    { id: 24, name: "Xena Putri", class: "XI B", nis: "2024124" },
    { id: 25, name: "Yusuf Rahman", class: "X A", nis: "2024125" },
];

export default function PicketStudentAttendance() {
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Riwayat filters
    const [riwayatSearchQuery, setRiwayatSearchQuery] = useState("");
    const [riwayatSelectedClass, setRiwayatSelectedClass] = useState("all");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<typeof mockStudentsInitial[0] | null>(null);

    // Bulk selection state
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

    // Form state
    const [lateTime, setLateTime] = useState("");
    const [lateNote, setLateNote] = useState("");

    // Pagination state for Riwayat Hari Ini
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Pagination state for Cari & Catat
    const [discoveryPage, setDiscoveryPage] = useState(1);
    const [discoveryItemsPerPage, setDiscoveryItemsPerPage] = useState(10);

    // Detail modal state
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    // Delete confirmation state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<number | null>(null);

    // Bulk delete state for Riwayat
    const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

    // Store late records: { studentId, time, note, recordedBy }
    const [lateRecords, setLateRecords] = useState<Array<{ studentId: number; time: string; note: string; recordedBy: string }>>([]);

    const handleOpenLateForm = (student: typeof mockStudentsInitial[0]) => {
        setSelectedStudent(student);
        setLateTime(format(new Date(), "HH:mm"));
        setLateNote("");
        setIsDialogOpen(true);
    };

    const handleSubmitLate = () => {
        if (!selectedStudent || !lateTime) return;

        const newRecord = {
            studentId: selectedStudent.id,
            time: lateTime,
            note: lateNote,
            recordedBy: "Pak Budi Santoso" // Mock: In real app, get from auth context
        };

        setLateRecords([...lateRecords, newRecord]);
        setIsDialogOpen(false);
        // Reset to first page when new record is added
        setCurrentPage(1);
    };

    const handleDeleteRecord = (studentId: number) => {
        setRecordToDelete(studentId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (recordToDelete !== null) {
            setLateRecords(lateRecords.filter(r => r.studentId !== recordToDelete));
            // Adjust current page if needed after deletion
            const newTotalPages = Math.ceil((lateRecords.length - 1) / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
        }
        setIsDeleteDialogOpen(false);
        setRecordToDelete(null);
    };

    const handleViewDetail = (record: any) => {
        setSelectedRecord(record);
        setIsDetailOpen(true);
    };

    // Bulk selection handlers
    const handleToggleStudent = (studentId: number) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleToggleAll = () => {
        if (selectedStudents.length === paginatedDiscoveryStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(paginatedDiscoveryStudents.map(s => s.id));
        }
    };

    const handleOpenBulkDialog = () => {
        if (selectedStudents.length > 0) {
            setIsBulkDialogOpen(true);
        }
    };

    const handleSubmitBulk = () => {
        if (!lateTime) return;

        const newRecords = selectedStudents.map(studentId => ({
            studentId,
            time: lateTime,
            note: lateNote,
            date: new Date().toISOString(),
            recordedBy: "Pak Budi Santoso" // Mock: In real app, get from auth context
        }));

        setLateRecords([...lateRecords, ...newRecords]);
        setIsBulkDialogOpen(false);
        setSelectedStudents([]);
        setLateTime("");
        setLateNote("");
        setCurrentPage(1);
    };

    // Bulk delete handlers for Riwayat
    const handleToggleRecord = (studentId: number) => {
        setSelectedRecords(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleToggleAllRecords = () => {
        if (selectedRecords.length === paginatedData.length) {
            setSelectedRecords([]);
        } else {
            setSelectedRecords(paginatedData.map(r => r.studentId));
        }
    };

    const handleOpenBulkDeleteDialog = () => {
        if (selectedRecords.length > 0) {
            setIsBulkDeleteDialogOpen(true);
        }
    };

    const confirmBulkDelete = () => {
        setLateRecords(lateRecords.filter(r => !selectedRecords.includes(r.studentId)));
        const newTotalPages = Math.ceil((lateRecords.length - selectedRecords.length) / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        }
        setIsBulkDeleteDialogOpen(false);
        setSelectedRecords([]);
    };

    // Filter students for discovery - Exclude those who are already recorded
    const discoveryStudents = useMemo(() => {
        return mockStudentsInitial.filter((student) => {
            const matchClass = selectedClass === "all" || student.class === selectedClass;
            const matchSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.nis.includes(searchQuery);
            const isAlreadyRecorded = lateRecords.some(r => r.studentId === student.id);

            return matchClass && matchSearch && !isAlreadyRecorded;
        });
    }, [selectedClass, searchQuery, lateRecords]);

    // Pagination for discovery students
    const discoveryTotalPages = Math.ceil(discoveryStudents.length / discoveryItemsPerPage);
    const discoveryStartIndex = (discoveryPage - 1) * discoveryItemsPerPage;
    const discoveryEndIndex = discoveryStartIndex + discoveryItemsPerPage;
    const paginatedDiscoveryStudents = discoveryStudents.slice(discoveryStartIndex, discoveryEndIndex);

    // Reset discovery page when filters change
    useEffect(() => {
        setDiscoveryPage(1);
    }, [selectedClass, searchQuery, lateRecords.length]);

    // Get combined data for the log with filtering
    const logData = useMemo(() => {
        return lateRecords.map(record => {
            const student = mockStudentsInitial.find(s => s.id === record.studentId);
            return {
                ...record,
                student
            };
        })
            .filter(record => {
                const matchSearch = !riwayatSearchQuery ||
                    record.student?.name.toLowerCase().includes(riwayatSearchQuery.toLowerCase()) ||
                    record.student?.nis.includes(riwayatSearchQuery);
                const matchClass = riwayatSelectedClass === "all" || record.student?.class === riwayatSelectedClass;
                return matchSearch && matchClass;
            })
            .sort((a, b) => b.time.localeCompare(a.time));
    }, [lateRecords, riwayatSearchQuery, riwayatSelectedClass]);

    // Reset page when riwayat filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [riwayatSearchQuery, riwayatSelectedClass]);

    // Pagination calculations
    const totalPages = Math.ceil(logData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = logData.slice(startIndex, endIndex);

    // Statistics
    const stats = useMemo(() => {
        const total = lateRecords.length;
        const lastTime = lateRecords.length > 0
            ? lateRecords.sort((a, b) => b.time.localeCompare(a.time))[0].time
            : "-";

        // Count by class
        const byClass: Record<string, number> = {};
        lateRecords.forEach(r => {
            const s = mockStudentsInitial.find(st => st.id === r.studentId);
            if (s) {
                byClass[s.class] = (byClass[s.class] || 0) + 1;
            }
        });
        const mostLateClass = Object.entries(byClass).length > 0
            ? Object.entries(byClass).sort((a, b) => b[1] - a[1])[0][0]
            : "-";

        return { total, lastTime, mostLateClass };
    }, [lateRecords]);

    return (
        <Tabs defaultValue="today" className="space-y-6">
            {/* Pill Style Tabs */}
            <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1 gap-0.5">
                <TabsTrigger
                    value="today"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
                >
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Keterlambatan Pagi
                </TabsTrigger>
                <TabsTrigger
                    value="history"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
                >
                    <History className="h-3.5 w-3.5 mr-1.5" />
                    Riwayat Lengkap
                </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-6">
                {/* Top Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <StatCard title="Total Terlambat" value={stats.total} subtitle="Siswa terlambat hari ini" icon={UserMinus} color="red" />
                    <StatCard title="Terakhir Datang" value={stats.lastTime} subtitle="Waktu kedatangan terakhir" icon={Clock} color="amber" />
                    <StatCard title="Kelas Terbanyak" value={stats.mostLateClass} subtitle="Kelas dengan keterlambatan tertinggi" icon={AlertCircle} color="blue" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] h-fit">
                    {/* LEFT: Discovery Section (42% width on large screens) */}
                    <Card className="lg:col-span-5 flex flex-col h-full">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Search className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold">
                                            Daftar Siswa
                                        </CardTitle>
                                        <CardDescription>
                                            Cari siswa untuk dicatat keterlambatannya
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col gap-3 mt-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama atau NIS..."
                                        className="pl-9 bg-muted/30"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                                        <SelectTrigger className="bg-muted/30 flex-1">
                                            <SelectValue placeholder="Semua Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kelas</SelectItem>
                                            <SelectItem value="XII A">XII A</SelectItem>
                                            <SelectItem value="XII B">XII B</SelectItem>
                                            <SelectItem value="XI A">XI A</SelectItem>
                                            <SelectItem value="X A">X A</SelectItem>
                                            <SelectItem value="X B">X B</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={discoveryItemsPerPage === 999999 ? "all" : discoveryItemsPerPage.toString()}
                                        onValueChange={(value) => {
                                            setDiscoveryItemsPerPage(value === "all" ? 999999 : Number(value));
                                            setDiscoveryPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="bg-muted/30 w-[130px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">Tampil 10</SelectItem>
                                            <SelectItem value="20">Tampil 20</SelectItem>
                                            <SelectItem value="50">Tampil 50</SelectItem>
                                            <SelectItem value="all">Semua</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-hidden flex flex-col pt-2">
                            {/* Description */}
                            <div className="mb-2">
                                <p className="text-sm text-muted-foreground">
                                    Daftar siswa yang belum dicatat terlambat. Klik siswa atau tombol <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium"><Clock className="h-3 w-3" />Catat</span> untuk mencatat keterlambatan.
                                </p>
                            </div>

                            {/* Bulk Selection Controls */}
                            {paginatedDiscoveryStudents.length > 0 && (
                                <div className="flex items-center justify-between mb-3 pb-2 border-b">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={selectedStudents.length === paginatedDiscoveryStudents.length && paginatedDiscoveryStudents.length > 0}
                                            onCheckedChange={handleToggleAll}
                                            id="select-all"
                                            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                                            Pilih Semua {selectedStudents.length > 0 && `(${selectedStudents.length} terpilih)`}
                                        </label>
                                    </div>
                                    {selectedStudents.length > 0 && (
                                        <Button
                                            onClick={handleOpenBulkDialog}
                                            size="sm"
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            <Clock className="h-4 w-4 mr-2" />
                                            Catat Terpilih ({selectedStudents.length})
                                        </Button>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                {paginatedDiscoveryStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                                    >
                                        <Checkbox
                                            checked={selectedStudents.includes(student.id)}
                                            onCheckedChange={() => handleToggleStudent(student.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <div
                                            className="flex items-center justify-between flex-1 cursor-pointer"
                                            onClick={() => handleOpenLateForm(student)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                    {student.class.substring(0, 3)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground whitespace-nowrap"><span className="font-mono">{student.nis}</span> • {student.class}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenLateForm(student);
                                                }}
                                            >
                                                <Clock className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {discoveryStudents.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                        <Search className="h-10 w-10 mb-2 opacity-20" />
                                        <p className="text-sm">Tidak ditemukan siswa</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination for Discovery */}
                            {discoveryTotalPages > 1 && (
                                <div className="flex items-center justify-between pt-4 px-4 pb-4">
                                    <div className="text-sm text-muted-foreground">
                                        Menampilkan {discoveryStartIndex + 1}-{Math.min(discoveryEndIndex, discoveryStudents.length)} dari {discoveryStudents.length} siswa
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDiscoveryPage(discoveryPage - 1)}
                                            disabled={discoveryPage === 1}
                                            className="w-9 h-9 p-0"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: discoveryTotalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={discoveryPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setDiscoveryPage(page)}
                                                    className="w-9 h-9"
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDiscoveryPage(discoveryPage + 1)}
                                            disabled={discoveryPage === discoveryTotalPages}
                                            className="w-9 h-9 p-0"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* RIGHT: Late Log Section (58% width) */}
                    <Card className="lg:col-span-7 flex flex-col h-full">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <History className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold">Riwayat Hari Ini</CardTitle>
                                        <CardDescription>
                                            Catatan keterlambatan <span className="font-semibold">{format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}</span>
                                        </CardDescription>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 px-3 py-1 flex items-center gap-1.5">
                                    <UserMinus className="h-3.5 w-3.5" />
                                    {logData.length} Siswa
                                </Badge>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col gap-3 mt-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama atau NIS..."
                                        className="pl-9 bg-muted/30"
                                        value={riwayatSearchQuery}
                                        onChange={(e) => setRiwayatSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Select value={riwayatSelectedClass} onValueChange={setRiwayatSelectedClass}>
                                        <SelectTrigger className="bg-muted/30 flex-1">
                                            <SelectValue placeholder="Semua Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kelas</SelectItem>
                                            <SelectItem value="XII A">XII A</SelectItem>
                                            <SelectItem value="XII B">XII B</SelectItem>
                                            <SelectItem value="XI A">XI A</SelectItem>
                                            <SelectItem value="XI B">XI B</SelectItem>
                                            <SelectItem value="X A">X A</SelectItem>
                                            <SelectItem value="X B">X B</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={itemsPerPage === 999999 ? "all" : itemsPerPage.toString()}
                                        onValueChange={(value) => {
                                            setItemsPerPage(value === "all" ? 999999 : Number(value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="bg-muted/30 w-[130px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">Tampil 10</SelectItem>
                                            <SelectItem value="20">Tampil 20</SelectItem>
                                            <SelectItem value="50">Tampil 50</SelectItem>
                                            <SelectItem value="all">Semua</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden flex flex-col pt-2">
                            {/* Description */}
                            <div className="mb-2">
                                <p className="text-sm text-muted-foreground">
                                    Daftar siswa yang sudah dicatat terlambat hari ini. Klik baris untuk melihat detail atau gunakan <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-xs font-medium"><Trash2 className="h-3 w-3" />Hapus</span> untuk menghapus catatan.
                                </p>
                            </div>

                            {/* Nested Card for Table */}
                            {logData.length > 0 ? (
                                <Card className="flex-1 overflow-hidden border-muted flex flex-col">
                                    {/* Bulk Delete Button */}
                                    {selectedRecords.length > 0 && (
                                        <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {selectedRecords.length} catatan terpilih
                                            </span>
                                            <Button
                                                onClick={handleOpenBulkDeleteDialog}
                                                size="sm"
                                                variant="destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Hapus Terpilih
                                            </Button>
                                        </div>
                                    )}

                                    <div className="overflow-x-auto flex-1">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="w-[50px] p-3">
                                                        <div className="flex items-center justify-start">
                                                            <Checkbox
                                                                checked={selectedRecords.length === paginatedData.length && paginatedData.length > 0}
                                                                onCheckedChange={handleToggleAllRecords}
                                                                className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                            />
                                                        </div>
                                                    </th>
                                                    <th className="text-left p-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Siswa</th>
                                                    <th className="text-center p-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider w-[120px]">Waktu</th>
                                                    <th className="text-left p-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Keterangan</th>
                                                    <th className="w-[60px] p-3"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedData.map((record) => (
                                                    <tr
                                                        key={record.studentId}
                                                        className="border-b hover:bg-muted/30 transition-colors group"
                                                    >
                                                        <td className="p-3">
                                                            <Checkbox
                                                                checked={selectedRecords.includes(record.studentId)}
                                                                onCheckedChange={() => handleToggleRecord(record.studentId)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                            />
                                                        </td>
                                                        <td className="p-3 cursor-pointer" onClick={() => handleViewDetail(record)}>
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold shrink-0 border border-red-200">
                                                                    {record.student?.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-sm">{record.student?.name}</div>
                                                                    <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
                                                                        <span className="text-xs font-mono text-muted-foreground">{record.student?.nis}</span>
                                                                        <span className="text-xs text-muted-foreground">•</span>
                                                                        <span className="text-xs text-muted-foreground">{record.student?.class}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <Badge className="font-mono text-xs bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200">
                                                                {record.time}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3">
                                                            <p className="text-sm text-muted-foreground italic line-clamp-2" title={record.note}>
                                                                {record.note || "-"}
                                                            </p>
                                                        </td>
                                                        <td className="p-3 text-right">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-8 w-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteRecord(record.studentId);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between pt-4 px-4">
                                            <div className="text-sm text-muted-foreground">
                                                Menampilkan {startIndex + 1}-{Math.min(endIndex, logData.length)} dari {logData.length} siswa
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="w-9 h-9 p-0"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>

                                                <div className="flex items-center space-x-1">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                        <Button
                                                            key={page}
                                                            variant={currentPage === page ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(page)}
                                                            className="w-9 h-9"
                                                        >
                                                            {page}
                                                        </Button>
                                                    ))}
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="w-9 h-9 p-0"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ) : (
                                <Card className="flex-1 border-muted">
                                    <CardContent className="flex flex-col items-center justify-center py-16 px-4 h-full">
                                        <div className="relative mb-6">
                                            <div className="h-20 w-20 bg-muted/20 rounded-full flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                                                <History className="h-10 w-10 text-muted-foreground/40" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 bg-background p-1.5 rounded-full border shadow-sm">
                                                <div className="bg-orange-100 p-1.5 rounded-full">
                                                    <Clock className="h-4 w-4 text-orange-600" />
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-base font-semibold text-foreground mb-2">Belum Ada Keterlambatan</h3>
                                        <p className="text-sm text-muted-foreground text-center max-w-sm leading-relaxed">
                                            Belum ada siswa yang tercatat terlambat hari ini. Gunakan panel di sebelah kiri untuk mencatat siswa yang terlambat.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Late Entry Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-red-100 rounded-lg">
                                    <Clock className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-foreground">
                                        Catat Keterlambatan
                                    </DialogTitle>
                                    <DialogDescription className="text-sm">
                                        Masukkan detail keterlambatan siswa
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Student Info Card */}
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-4 my-2">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200 font-bold text-lg text-red-600 shrink-0">
                                {selectedStudent?.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-base text-foreground truncate">{selectedStudent?.name}</p>
                                <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
                                    <span className="text-xs text-muted-foreground font-mono">{selectedStudent?.nis}</span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">{selectedStudent?.class}</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="time" className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                    Jam Kedatangan
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="time"
                                        type="time"
                                        className="pl-3 h-11 text-base font-mono"
                                        value={lateTime}
                                        onChange={(e) => setLateTime(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Waktu saat siswa tiba di sekolah</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="note" className="text-sm font-medium flex items-center gap-2">
                                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                    Keterangan <span className="text-muted-foreground font-normal">(Opsional)</span>
                                </Label>
                                <Textarea
                                    id="note"
                                    placeholder="Contoh: Bangun kesiangan, kendaraan mogok, dll..."
                                    value={lateNote}
                                    onChange={(e) => setLateNote(e.target.value)}
                                    className="resize-none min-h-[100px]"
                                    rows={4}
                                />
                                <p className="text-xs text-muted-foreground">Alasan atau catatan tambahan (jika ada)</p>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="flex-1 sm:flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleSubmitLate}
                                className="flex-1 sm:flex-1 bg-red-600 hover:bg-red-700 text-white"
                                disabled={!lateTime}
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                Simpan Keterlambatan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Detail Modal */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-red-100 rounded-lg">
                                    <Eye className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-foreground">
                                        Detail Keterlambatan
                                    </DialogTitle>
                                    <DialogDescription className="text-sm">
                                        Informasi lengkap siswa yang terlambat
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        {selectedRecord && (
                            <div className="space-y-4 py-2">
                                {/* Student Info Card */}
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200 font-bold text-lg text-red-600 shrink-0">
                                        {selectedRecord.student?.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-base text-foreground truncate">
                                            {selectedRecord.student?.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
                                            <span className="text-xs text-muted-foreground font-mono">{selectedRecord.student?.nis}</span>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <span className="text-xs text-muted-foreground">{selectedRecord.student?.class}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Time Info */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        Waktu Kedatangan
                                    </Label>
                                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                        <p className="text-lg font-bold font-mono text-orange-700">{selectedRecord.time}</p>
                                    </div>
                                </div>

                                {/* Note Info */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                        Keterangan
                                    </Label>
                                    <div className="p-4 bg-muted/30 border rounded-lg min-h-[100px]">
                                        <p className="text-sm text-foreground whitespace-pre-wrap">
                                            {selectedRecord.note || "Tidak ada keterangan"}
                                        </p>
                                    </div>
                                </div>

                                {/* Recorded By Info */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <UserMinus className="h-3.5 w-3.5 text-muted-foreground" />
                                        Dicatat Oleh
                                    </Label>
                                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                        <p className="text-sm font-medium text-primary">
                                            {selectedRecord.recordedBy || "Guru Piket"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="default"
                                onClick={() => setIsDetailOpen(false)}
                            >
                                <X className="h-4 w-4 mr-2" strokeWidth={2.5} />
                                Tutup
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Bulk Late Record Dialog */}
                <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle>Catat Keterlambatan Massal</DialogTitle>
                                    <DialogDescription>
                                        {selectedStudents.length} siswa terpilih
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Selected Students List */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Siswa Terpilih:</Label>
                                <div className="max-h-[150px] overflow-y-auto space-y-1 p-3 bg-muted/30 rounded-lg">
                                    {selectedStudents.map(id => {
                                        const student = mockStudentsInitial.find(s => s.id === id);
                                        return student ? (
                                            <div key={id} className="text-sm flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                    {student.class.substring(0, 2)}
                                                </div>
                                                <span className="font-medium">{student.name}</span>
                                                <span className="text-muted-foreground">•</span>
                                                <span className="text-muted-foreground text-xs">{student.class}</span>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>

                            {/* Time Input */}
                            <div className="space-y-2">
                                <Label htmlFor="bulk-time">Waktu Kedatangan</Label>
                                <Input
                                    id="bulk-time"
                                    type="time"
                                    value={lateTime}
                                    onChange={(e) => setLateTime(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Note Input */}
                            <div className="space-y-2">
                                <Label htmlFor="bulk-note">Keterangan (Opsional)</Label>
                                <Textarea
                                    id="bulk-note"
                                    placeholder="Contoh: Terlambat karena hujan deras"
                                    value={lateNote}
                                    onChange={(e) => setLateNote(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsBulkDialogOpen(false)}
                                className="flex-1 sm:flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleSubmitBulk}
                                disabled={!lateTime}
                                className="flex-1 sm:flex-1 bg-primary hover:bg-primary/90"
                            >
                                Catat Semua
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-destructive" />
                                </div>
                                <div>
                                    <DialogTitle>Hapus Catatan Keterlambatan?</DialogTitle>
                                    <DialogDescription>
                                        Tindakan ini tidak dapat dibatalkan
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="py-4">
                            {recordToDelete !== null && (() => {
                                const record = lateRecords.find(r => r.studentId === recordToDelete);
                                const student = mockStudentsInitial.find(s => s.id === recordToDelete);
                                return record && student ? (
                                    <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-sm font-bold border border-red-200">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    <span className="font-mono">{student.nis}</span> • {student.class}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-mono">{record.time}</span>
                                        </div>
                                        {record.note && (
                                            <p className="text-sm text-muted-foreground italic">"{record.note}"</p>
                                        )}
                                    </div>
                                ) : null;
                            })()}
                        </div>

                        <DialogFooter className="gap-2 sm:gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="flex-1 sm:flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                className="flex-1 sm:flex-1"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Bulk Delete Confirmation Dialog */}
                <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-destructive" />
                                </div>
                                <div>
                                    <DialogTitle>Hapus {selectedRecords.length} Catatan?</DialogTitle>
                                    <DialogDescription>
                                        Tindakan ini tidak dapat dibatalkan
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="py-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Catatan yang akan dihapus:</Label>
                                <div className="max-h-[250px] overflow-y-auto space-y-2 p-3 bg-muted/30 rounded-lg">
                                    {selectedRecords.map(studentId => {
                                        const record = lateRecords.find(r => r.studentId === studentId);
                                        const student = mockStudentsInitial.find(s => s.id === studentId);
                                        return record && student ? (
                                            <div key={studentId} className="p-3 bg-background rounded border">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold border border-red-200">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            <span className="font-mono">{student.nis}</span> • {student.class}
                                                        </p>
                                                    </div>
                                                    <Badge className="font-mono text-xs bg-orange-100 text-orange-700 border-orange-200">
                                                        {record.time}
                                                    </Badge>
                                                </div>
                                                {record.note && (
                                                    <p className="text-xs text-muted-foreground italic pl-11">"{record.note}"</p>
                                                )}
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsBulkDeleteDialogOpen(false)}
                                className="flex-1 sm:flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmBulkDelete}
                                className="flex-1 sm:flex-1"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus Semua ({selectedRecords.length})
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </TabsContent>

            <TabsContent value="history">
                <LateRecordHistory />
            </TabsContent>
        </Tabs>
    );
}
