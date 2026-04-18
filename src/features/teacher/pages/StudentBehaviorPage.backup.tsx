/* eslint-disable react-hooks/purity, @typescript-eslint/no-unused-vars */
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
    Plus,
    ThumbsUp,
    ThumbsDown,
    ClipboardList,
    AlertTriangle,
    FilePenLine,
    User,
    Clock,
    MapPin,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
];

export default function StudentBehaviorPage() {
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // History filters
    const [historySearchQuery, setHistorySearchQuery] = useState("");
    const [historySelectedClass, setHistorySelectedClass] = useState("all");

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<typeof mockStudentsInitial[0] | null>(null);

    // View Dialog State
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewRecord, setViewRecord] = useState<typeof records[0] & { student?: typeof mockStudentsInitial[0] } | null>(null);

    // Form state - UPDATED
    const [teacherName, setTeacherName] = useState("");
    const [problemDescription, setProblemDescription] = useState("");
    const [followUpAction, setFollowUpAction] = useState("");
    const [locationContext, setLocationContext] = useState<"sekolah" | "asrama">("sekolah");

    // Current logged-in teacher (mock data - should come from auth context)
    const currentTeacher = "Pak Ahmad Hidayat"; // TODO: Replace with actual auth context

    // Pagination for Discovery
    const [discoveryPage, setDiscoveryPage] = useState(1);
    const [discoveryItemsPerPage, setDiscoveryItemsPerPage] = useState(10);

    // Pagination for History
    const [historyPage, setHistoryPage] = useState(1);
    const [historyItemsPerPage, setHistoryItemsPerPage] = useState(5);

    // Filter states
    const [historyAcademicYear, setHistoryAcademicYear] = useState("2025/2026");
    const [historySemester, setHistorySemester] = useState("Ganjil");
    const [historyTeacher, setHistoryTeacher] = useState("all");

    // Date Filters
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
    const [activeDateFilter, setActiveDateFilter] = useState<"today" | "week" | "month" | null>(null);

    // Date Filter Helpers
    const formatLocalDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const setToday = () => {
        const today = new Date();
        const formatted = formatLocalDate(today);
        setDateRange({ from: formatted, to: formatted });
        setActiveDateFilter('today');
    };

    const setThisWeek = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust Monday as start
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() + diff);
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        setDateRange({
            from: formatLocalDate(firstDay),
            to: formatLocalDate(lastDay)
        });
        setActiveDateFilter('week');
    };

    const setThisMonth = () => {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        setDateRange({
            from: formatLocalDate(firstDay),
            to: formatLocalDate(lastDay)
        });
        setActiveDateFilter('month');
    };

    // Records state - UPDATED
    const [records, setRecords] = useState<Array<{
        id: number;
        studentId: number;
        teacherName: string;
        problem: string;
        followUp: string;
        location: "sekolah" | "asrama";
        date: string;
    }>>([
        {
            id: 1,
            studentId: 3,
            teacherName: "Pak Budi",
            problem: "Terlambat masuk kelas lebih dari 15 menit tanpa keterangan.",
            followUp: "Diberikan teguran lisan dan dicatat.",
            location: "sekolah",
            date: new Date(Date.now() - 86400000).toISOString(), // Kemarin
        },
        {
            id: 2,
            studentId: 5,
            teacherName: "Bu Siti",
            problem: "Tidak memakai seragam lengkap saat upacara.",
            followUp: "Diminta melengkapi atribut seragam.",
            location: "sekolah",
            date: new Date(Date.now() - 172800000).toISOString(), // 2 hari lalu
        },
        {
            id: 3,
            studentId: 10,
            teacherName: "Ust. Ahmad",
            problem: "Ribut di asrama saat jam istirahat malam.",
            followUp: "Diberikan nasehat dan poin pelanggaran.",
            location: "asrama",
            date: new Date(Date.now() - 259200000).toISOString(), // 3 hari lalu
        },
        {
            id: 4,
            studentId: 1,
            teacherName: "Pak Budi",
            problem: "Tidak membawa buku paket pelajaran.",
            followUp: "Diberikan tugas tambahan.",
            location: "sekolah",
            date: new Date(Date.now() - 345600000).toISOString(),
        },
        {
            id: 5,
            studentId: 7,
            teacherName: "Bu Rina",
            problem: "Tidur di kelas saat jam pelajaran berlangsung.",
            followUp: "Dibangunkan dan diminta cuci muka.",
            location: "sekolah",
            date: new Date(Date.now() - 432000000).toISOString(),
        },
        {
            id: 6,
            studentId: 12,
            teacherName: "Ust. Yusuf",
            problem: "Keluar lingkungan asrama tanpa izin.",
            followUp: "Panggilan orang tua dan skorsing asrama 1 hari.",
            location: "asrama",
            date: new Date(Date.now() - 518400000).toISOString(),
        },
        {
            id: 7,
            studentId: 2,
            teacherName: "Pak Joko",
            problem: "Membuang sampah sembarangan di koridor.",
            followUp: "Diminta membersihkan koridor.",
            location: "sekolah",
            date: new Date(Date.now() - 604800000).toISOString(),
        },
    ]);

    const handleOpenForm = (student: typeof mockStudentsInitial[0]) => {
        setSelectedStudent(student);
        setTeacherName(currentTeacher); // Auto-fill with current teacher
        setProblemDescription("");
        setFollowUpAction("");
        setLocationContext("sekolah");
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!selectedStudent) return;

        const newRecord = {
            id: Date.now(),
            studentId: selectedStudent.id,
            teacherName: teacherName,
            problem: problemDescription,
            followUp: followUpAction,
            location: locationContext,
            date: new Date().toISOString(),
        };

        setRecords([newRecord, ...records]);
        setIsDialogOpen(false);
    };

    // Filter students
    const filteredStudents = useMemo(() => {
        return mockStudentsInitial.filter((student) => {
            const matchClass = selectedClass === "all" || student.class === selectedClass;
            const matchSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.nis.includes(searchQuery);
            return matchClass && matchSearch;
        });
    }, [selectedClass, searchQuery]);

    // Pagination Logic for Students
    const totalStudents = filteredStudents.length;
    const totalStudentPages = Math.ceil(totalStudents / discoveryItemsPerPage);
    const studentStartIndex = (discoveryPage - 1) * discoveryItemsPerPage;
    const paginatedStudents = filteredStudents.slice(studentStartIndex, studentStartIndex + discoveryItemsPerPage);

    // Filter records
    const filteredRecords = useMemo(() => {
        return records.map(record => {
            const student = mockStudentsInitial.find(s => s.id === record.studentId);
            return { ...record, student };
        }).filter(record => {
            // Filter logic
            const matchClass = historySelectedClass === "all" || record.student?.class === historySelectedClass;
            const matchTeacher = historyTeacher === "all" || record.teacherName === historyTeacher;

            // Mock Data Logic: Assume all mock data is for "2025/2026" and "Ganjil"
            const matchYear = historyAcademicYear === "all" || historyAcademicYear === "2025/2026";
            const matchSemester = historySemester === "all" || historySemester === "Ganjil";

            // Date Range Logic
            let matchDate = true;
            if (dateRange.from || dateRange.to) {
                const recordDate = new Date(record.date);
                // Reset time for accurate date comparison
                recordDate.setHours(0, 0, 0, 0);

                if (dateRange.from) {
                    const fromDate = new Date(dateRange.from);
                    fromDate.setHours(0, 0, 0, 0);
                    if (recordDate < fromDate) matchDate = false;
                }
                if (dateRange.to && matchDate) {
                    const toDate = new Date(dateRange.to);
                    toDate.setHours(0, 0, 0, 0);
                    if (recordDate > toDate) matchDate = false;
                }
            }

            // Search logic (Student Name, NIS, Problem)
            const searchLower = historySearchQuery.toLowerCase();
            const matchSearch = !historySearchQuery ||
                record.student?.name.toLowerCase().includes(searchLower) ||
                record.student?.nis.includes(searchLower) ||
                record.problem.toLowerCase().includes(searchLower);

            return matchClass && matchTeacher && matchYear && matchSemester && matchSearch && matchDate;
        });
    }, [records, historySearchQuery, historySelectedClass, historyTeacher, historyAcademicYear, historySemester, dateRange]);

    // Derived data for filters
    const uniqueTeachers = useMemo(() => Array.from(new Set(records.map(r => r.teacherName))).sort(), [records]);
    const uniqueClasses = useMemo(() => Array.from(new Set(mockStudentsInitial.map(s => s.class))).sort(), []);

    // Pagination Logic for History
    const totalRecords = filteredRecords.length;
    const totalHistoryPages = Math.ceil(totalRecords / historyItemsPerPage);
    const historyStartIndex = (historyPage - 1) * historyItemsPerPage;
    const paginatedRecords = filteredRecords.slice(historyStartIndex, historyStartIndex + historyItemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Catatan <span className="text-primary">Pelanggaran Siswa</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Catat dan kelola pelanggaran atau perilaku negatif siswa.
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-muted-foreground text-sm font-medium text-primary">Semester Ganjil</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
                        <FileText className="mr-2 h-4 w-4" />
                        Unduh Laporan
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="record" className="space-y-6">
                <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1.5 gap-1">
                    <TabsTrigger
                        value="record"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                    >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Catat Pelanggaran
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                    >
                        <History className="h-4 w-4 mr-2" />
                        Riwayat Pelanggaran
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="record" className="space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Search className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold">Daftar Siswa</CardTitle>
                                        <CardDescription>
                                            Pilih siswa untuk mencatat masalah dan pelanggaran.
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari nama atau NIS..."
                                            className="pl-9 w-full sm:w-[250px]"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                                        <SelectTrigger className="w-full sm:w-[150px]">
                                            <SelectValue placeholder="Semua Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kelas</SelectItem>
                                            <SelectItem value="XII A">XII A</SelectItem>
                                            <SelectItem value="XII B">XII B</SelectItem>
                                            <SelectItem value="XI A">XI A</SelectItem>
                                            <SelectItem value="XI B">XI B</SelectItem>
                                            <SelectItem value="X A">X A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {paginatedStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 hover:border-primary/20 transition-all cursor-pointer group"
                                        onClick={() => handleOpenForm(student)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {student.class.substring(0, 3)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground group-hover:text-primary transition-colors">{student.name}</p>
                                                <p className="text-xs text-muted-foreground"><span className="font-mono">{student.nis}</span> • {student.class}</p>
                                            </div>
                                        </div>
                                        <Button size="icon" className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground shadow-sm">
                                            <FilePenLine className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {paginatedStudents.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-muted-foreground">
                                        Tidak ada siswa ditemukan.
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalStudentPages > 1 && (
                                <div className="flex items-center justify-between pt-6 border-t mt-6">
                                    <div className="text-sm text-muted-foreground">
                                        Menampilkan {studentStartIndex + 1}-{Math.min(studentStartIndex + discoveryItemsPerPage, totalStudents)} dari {totalStudents} siswa
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDiscoveryPage(p => Math.max(1, p - 1))}
                                            disabled={discoveryPage === 1}
                                            className="w-9 h-9 p-0"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: totalStudentPages }, (_, i) => i + 1).map((page) => (
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
                                            onClick={() => setDiscoveryPage(p => Math.min(totalStudentPages, p + 1))}
                                            disabled={discoveryPage === totalStudentPages}
                                            className="w-9 h-9 p-0"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <History className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg font-semibold">Riwayat Pelanggaran</CardTitle>
                                        <Badge variant="secondary" className="px-2.5 py-0.5 h-auto text-xs font-medium text-primary bg-primary/10 border border-primary/20">
                                            {filteredRecords.length} Data
                                        </Badge>
                                    </div>
                                    <CardDescription>
                                        Daftar semua catatan pelanggaran siswa.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Filter Section - Compact Layout */}
                            <Card className="mb-3 border-muted bg-muted/10">
                                <CardContent className="px-4 py-2">
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3">
                                        {/* Row 1: Search & Dropdowns (12 cols total on LG) */}

                                        {/* Search: 4 cols */}
                                        <div className="col-span-2 md:col-span-4 lg:col-span-4 space-y-1">
                                            <Label className="text-sm font-medium text-foreground ml-0.5">Pencarian</Label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Cari nama, NIS..."
                                                    className="pl-9 h-10 w-full bg-background/80 focus:bg-background text-sm"
                                                    value={historySearchQuery}
                                                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Year: 2 cols */}
                                        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-1">
                                            <Label className="text-sm font-medium text-foreground ml-0.5">Tahun Ajaran</Label>
                                            <Select value={historyAcademicYear} onValueChange={setHistoryAcademicYear}>
                                                <SelectTrigger className="h-10 bg-background/80 text-sm focus:bg-background">
                                                    <SelectValue placeholder="Pilih Tahun" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Tahun</SelectItem>
                                                    <SelectItem value="2025/2026">2025/2026</SelectItem>
                                                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Semester: 2 cols */}
                                        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-1">
                                            <Label className="text-sm font-medium text-foreground ml-0.5">Semester</Label>
                                            <Select value={historySemester} onValueChange={setHistorySemester}>
                                                <SelectTrigger className="h-10 bg-background/80 text-sm focus:bg-background">
                                                    <SelectValue placeholder="Pilih Semester" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Semester</SelectItem>
                                                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                                                    <SelectItem value="Genap">Genap</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Class: 2 cols */}
                                        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-1">
                                            <Label className="text-sm font-medium text-foreground ml-0.5">Kelas</Label>
                                            <Select value={historySelectedClass} onValueChange={setHistorySelectedClass}>
                                                <SelectTrigger className="h-10 bg-background/80 text-sm focus:bg-background">
                                                    <SelectValue placeholder="Kelas" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                                    {uniqueClasses.map((cls) => (
                                                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Teacher: 2 cols */}
                                        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-1">
                                            <Label className="text-sm font-medium text-foreground ml-0.5">Guru</Label>
                                            <Select value={historyTeacher} onValueChange={setHistoryTeacher}>
                                                <SelectTrigger className="h-10 bg-background/80 text-sm focus:bg-background">
                                                    <SelectValue placeholder="Guru" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Guru</SelectItem>
                                                    {uniqueTeachers.map((teacher) => (
                                                        <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Row 2: Time Filters */}

                                        {/* Quick Filters: 6 cols */}
                                        <div className="col-span-2 md:col-span-4 lg:col-span-6 space-y-1 pt-1">
                                            <Label className="text-sm font-medium text-foreground ml-0.5">Filter Cepat</Label>
                                            <div className="flex items-center gap-2 h-10">
                                                <Button
                                                    variant={activeDateFilter === 'today' ? 'default' : 'outline'}
                                                    size="sm"
                                                    className={`h-10 text-sm font-normal flex-1 ${activeDateFilter !== 'today' ? 'bg-background/50 hover:bg-background' : ''}`}
                                                    onClick={setToday}
                                                >
                                                    Hari Ini
                                                </Button>
                                                <Button
                                                    variant={activeDateFilter === 'week' ? 'default' : 'outline'}
                                                    size="sm"
                                                    className={`h-10 text-sm font-normal flex-1 ${activeDateFilter !== 'week' ? 'bg-background/50 hover:bg-background' : ''}`}
                                                    onClick={setThisWeek}
                                                >
                                                    Minggu Ini
                                                </Button>
                                                <Button
                                                    variant={activeDateFilter === 'month' ? 'default' : 'outline'}
                                                    size="sm"
                                                    className={`h-10 text-sm font-normal flex-1 ${activeDateFilter !== 'month' ? 'bg-background/50 hover:bg-background' : ''}`}
                                                    onClick={setThisMonth}
                                                >
                                                    Bulan Ini
                                                </Button>
                                                {(dateRange.from || dateRange.to) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
                                                        onClick={() => {
                                                            setActiveDateFilter(null);
                                                            setDateRange({ from: "", to: "" });
                                                        }}
                                                        title="Reset"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Custom Range: 6 cols */}
                                        <div className="col-span-2 md:col-span-4 lg:col-span-6 space-y-1 pt-1">
                                            <Label className="text-sm font-medium text-foreground ml-0.5">Rentang Tanggal</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="relative">
                                                    <Input
                                                        type="date"
                                                        value={dateRange.from}
                                                        onChange={(e) => {
                                                            setDateRange(prev => ({ ...prev, from: e.target.value }));
                                                            setActiveDateFilter(null);
                                                        }}
                                                        className="h-10 w-full px-3 py-2 text-sm bg-background/80 focus:bg-background"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <Input
                                                        type="date"
                                                        value={dateRange.to}
                                                        onChange={(e) => {
                                                            setDateRange(prev => ({ ...prev, to: e.target.value }));
                                                            setActiveDateFilter(null);
                                                        }}
                                                        className="h-10 w-full px-3 py-2 text-sm bg-background/80 focus:bg-background"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="mb-3 px-1">
                                <p className="text-sm text-muted-foreground">
                                    Daftar riwayat perilaku siswa terbaru. Klik tombol <span className="inline-flex items-center justify-center rounded-md bg-blue-50 border border-blue-100 p-1 align-middle mx-1"><Eye className="h-3 w-3 text-blue-600" /></span> untuk melihat detail lengkap masalah dan tindak lanjut.
                                </p>
                            </div>

                            <div className="rounded-md border overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50 text-left">
                                            <th className="p-4 font-medium text-muted-foreground w-[150px]">Waktu & Lokasi</th>
                                            <th className="p-4 font-medium text-muted-foreground w-[150px]">Guru Penemu</th>
                                            <th className="p-4 font-medium text-muted-foreground w-[200px]">Siswa</th>
                                            <th className="p-4 font-medium text-muted-foreground">Masalah / Pelanggaran</th>
                                            <th className="p-4 font-medium text-muted-foreground">Tindak Lanjut</th>
                                            <th className="p-4 font-medium text-muted-foreground text-right w-[50px]"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRecords.length > 0 ? (
                                            paginatedRecords.map((record) => (
                                                <tr key={record.id} className="border-b last:border-0 hover:bg-muted/30">
                                                    <td className="p-4 align-top">
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="font-medium text-foreground">
                                                                {format(new Date(record.date), "dd MMMM yyyy", { locale: id })}
                                                            </span>
                                                            <div className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary w-fit">
                                                                <MapPin className="mr-1 h-3 w-3" />
                                                                {record.location === "sekolah" ? "Sekolah" : "Asrama"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                                            <User className="h-4 w-4" />
                                                            {record.teacherName}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <div className="font-medium">{record.student?.name}</div>
                                                        <div className="text-xs text-muted-foreground"><span className="font-mono">{record.student?.nis}</span> • {record.student?.class}</div>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <p className="text-sm line-clamp-2" title={record.problem}>
                                                            {record.problem}
                                                        </p>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <p className="text-sm text-muted-foreground line-clamp-2" title={record.followUp}>
                                                            {record.followUp || "-"}
                                                        </p>
                                                    </td>
                                                    <td className="p-4 align-top text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="icon"
                                                                className="h-8 w-8 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 shadow-sm transition-all"
                                                                onClick={() => {
                                                                    setViewRecord(record);
                                                                    setIsViewOpen(true);
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="p-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                        <div className="p-4 bg-muted/50 rounded-full mb-3">
                                                            <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                                                        </div>
                                                        <p className="font-medium text-lg">Belum ada catatan pelanggaran</p>
                                                        <p className="text-sm mt-1 max-w-sm">
                                                            Belum ada data pelanggaran yang tercatat sesuai dengan filter yang Anda pilih.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination for History */}
                            {totalHistoryPages > 1 && (
                                <div className="flex items-center justify-between pt-6 border-t mt-6">
                                    <div className="text-sm text-muted-foreground">
                                        Menampilkan {historyStartIndex + 1}-{Math.min(historyStartIndex + historyItemsPerPage, totalRecords)} dari {totalRecords} data
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                                            disabled={historyPage === 1}
                                            className="w-9 h-9 p-0"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: totalHistoryPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={historyPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setHistoryPage(page)}
                                                    className="w-9 h-9"
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setHistoryPage(p => Math.min(totalHistoryPages, p + 1))}
                                            disabled={historyPage === totalHistoryPages}
                                            className="w-9 h-9 p-0"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-full shrink-0">
                                <ClipboardList className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1 text-left">
                                <DialogTitle>Catat Pelanggaran Siswa</DialogTitle>
                                <DialogDescription>
                                    Silahkan isi formulir di bawah ini untuk mencatat pelanggaran atau masalah perilaku yang dilakukan oleh <b>{selectedStudent?.name}</b> ({selectedStudent?.class}).
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Row 1: Guru & Lokasi */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="teacher">Guru Penemu</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="teacher"
                                        value={teacherName}
                                        readOnly
                                        className="pl-9 bg-muted/50 cursor-not-allowed text-foreground font-medium"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Terisi otomatis berdasarkan akun Anda</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Lokasi Kejadian</Label>
                                <RadioGroup
                                    defaultValue="sekolah"
                                    value={locationContext}
                                    onValueChange={(v: "sekolah" | "asrama") => setLocationContext(v)}
                                    className="flex gap-4 pt-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="sekolah" id="loc-sekolah" />
                                        <Label htmlFor="loc-sekolah" className="cursor-pointer">Sekolah</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="asrama" id="loc-asrama" />
                                        <Label htmlFor="loc-asrama" className="cursor-pointer">Asrama</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="problem">Masalah / Pelanggaran</Label>
                            <Textarea
                                id="problem"
                                placeholder="Deskripsikan pelanggaran yang dilakukan..."
                                value={problemDescription}
                                onChange={(e) => setProblemDescription(e.target.value)}
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="followUp">Tindak Lanjut</Label>
                            <Textarea
                                id="followUp"
                                placeholder="Tindakan yang sudah atau akan dilakukan..."
                                value={followUpAction}
                                onChange={(e) => setFollowUpAction(e.target.value)}
                                rows={2}
                                className="resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Simpan Pelanggaran
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* View Detail Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-full shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1 text-left">
                                <DialogTitle>Detail Pelanggaran Siswa</DialogTitle>
                                <DialogDescription>
                                    Informasi lengkap mengenai catatan pelanggaran.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {viewRecord && (
                        <div className="space-y-6 py-4">
                            {/* Metadata Section */}
                            <div className="bg-muted/30 p-4 rounded-lg border grid grid-cols-2 gap-y-4 gap-x-6">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Siswa</Label>
                                    <div className="font-medium">{viewRecord.student?.name}</div>
                                    <div className="text-xs text-muted-foreground"><span className="font-mono">{viewRecord.student?.nis}</span> • {viewRecord.student?.class}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Waktu Kejadian</Label>
                                    <div className="text-sm font-medium flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                        {format(new Date(viewRecord.date), "dd MMMM yyyy", { locale: id })}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Guru Penemu</Label>
                                    <div className="text-sm flex items-center gap-2">
                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                        {viewRecord.teacherName}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Lokasi</Label>
                                    <div>
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-normal">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {viewRecord.location === "sekolah" ? "Lingkungan Sekolah" : "Asrama"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label className="font-semibold text-base">Masalah / Pelanggaran</Label>
                                    </div>
                                    <div className="p-3 bg-red-50/50 border border-red-100 rounded-md text-sm leading-relaxed text-foreground/90">
                                        {viewRecord.problem}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label className="font-semibold text-base">Tindak Lanjut</Label>
                                    </div>
                                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-md text-sm leading-relaxed text-foreground/90">
                                        {viewRecord.followUp || "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={() => setIsViewOpen(false)}>Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
