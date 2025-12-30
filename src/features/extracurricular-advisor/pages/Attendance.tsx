"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
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
    RefreshCw,
    Clock,
    ChevronLeft,
    ChevronRight,
    History,
    Award,
    TrendingUp,
    ChevronDown,
    Eye,
    ChevronsLeft,
    ChevronsRight,
    FileDown,
    Edit,
    Trash2,
    ArrowDownUp,
} from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock Data
const mockMembers = [
    { id: 1, nis: "2022001", name: "Andi Wijaya", class: "XII A" },
    { id: 2, nis: "2022002", name: "Rina Kusuma", class: "XI A" },
    { id: 3, nis: "2022003", name: "Doni Pratama", class: "XI B" },
    { id: 4, nis: "2022004", name: "Siti Aminah", class: "XII B" },
    { id: 5, nis: "2022005", name: "Budi Santoso", class: "X A" },
    { id: 6, nis: "2022006", name: "Dewi Lestari", class: "XII A" },
    { id: 7, nis: "2022007", name: "Eko Prasetyo", class: "XI A" },
    { id: 8, nis: "2022008", name: "Fitri Handayani", class: "XI B" },
    { id: 9, nis: "2022009", name: "Gilang Ramadhan", class: "XII B" },
    { id: 10, nis: "2022010", name: "Hana Safitri", class: "X A" },
    { id: 11, nis: "2022011", name: "Indra Gunawan", class: "XII A" },
    { id: 12, nis: "2022012", name: "Joko Widodo", class: "XI A" },
    { id: 13, nis: "2022013", name: "Kartika Sari", class: "XI B" },
    { id: 14, nis: "2022014", name: "Lukman Hakim", class: "XII B" },
    { id: 15, nis: "2022015", name: "Maya Puspita", class: "X A" },
    { id: 16, nis: "2022016", name: "Nanda Pratama", class: "XII A" },
    { id: 17, nis: "2022017", name: "Olivia Putri", class: "XI A" },
    { id: 18, nis: "2022018", name: "Putra Mahendra", class: "XI B" },
    { id: 19, nis: "2022019", name: "Qori Azzahra", class: "XII B" },
    { id: 20, nis: "2022020", name: "Reza Pahlevi", class: "X A" },
    { id: 21, nis: "2022021", name: "Sinta Dewi", class: "XII A" },
    { id: 22, nis: "2022022", name: "Taufik Hidayat", class: "XI A" },
    { id: 23, nis: "2022023", name: "Umar Bakri", class: "XI B" },
    { id: 24, nis: "2022024", name: "Vina Melati", class: "XII B" },
    { id: 25, nis: "2022025", name: "Wahyu Nugroho", class: "X A" },
    { id: 26, nis: "2022026", name: "Xena Pramesti", class: "XII A" },
    { id: 27, nis: "2022027", name: "Yudi Setiawan", class: "XI A" },
    { id: 28, nis: "2022028", name: "Zahra Amelia", class: "XI B" },
    { id: 29, nis: "2022029", name: "Arif Rahman", class: "XII B" },
    { id: 30, nis: "2022030", name: "Bella Safira", class: "X A" },
    { id: 31, nis: "2022031", name: "Citra Kirana", class: "XII A" },
    { id: 32, nis: "2022032", name: "Dimas Aditya", class: "XI A" },
    { id: 33, nis: "2022033", name: "Elsa Permata", class: "XI B" },
    { id: 34, nis: "2022034", name: "Fajar Maulana", class: "XII B" },
    { id: 35, nis: "2022035", name: "Gita Savitri", class: "X A" },
    { id: 36, nis: "2022036", name: "Hendra Wijaya", class: "XII A" },
    { id: 37, nis: "2022037", name: "Intan Permatasari", class: "XI A" },
    { id: 38, nis: "2022038", name: "Jihan Aulia", class: "XI B" },
    { id: 39, nis: "2022039", name: "Kevin Aprilio", class: "XII B" },
    { id: 40, nis: "2022040", name: "Linda Maharani", class: "X A" },
    { id: 41, nis: "2022041", name: "Muhammad Rizki", class: "XII A" },
    { id: 42, nis: "2022042", name: "Nabila Syakira", class: "XI A" },
    { id: 43, nis: "2022043", name: "Omar Sharif", class: "XI B" },
    { id: 44, nis: "2022044", name: "Putri Ayu", class: "XII B" },
    { id: 45, nis: "2022045", name: "Qonita Rahmawati", class: "X A" },
];

const unifiedAttendanceHistory = [
    {
        id: 1,
        date: "2025-12-20",
        studentStats: {
            present: 42,
            total: 45,
            percentage: 93,
        },
        advisorStats: {
            tutorName: "Ahmad Fauzi, S.Pd",
            startTime: "14:00",
            endTime: "16:00",
            status: "hadir",
        }
    },
    {
        id: 2,
        date: "2025-12-13",
        studentStats: {
            present: 40,
            total: 45,
            percentage: 89,
        },
        advisorStats: {
            tutorName: "Ahmad Fauzi, S.Pd",
            startTime: "14:00",
            endTime: "16:30",
            status: "hadir",
        }
    },
    {
        id: 3,
        date: "2025-12-06",
        studentStats: {
            present: 38,
            total: 45,
            percentage: 84,
        },
        advisorStats: {
            tutorName: "Ahmad Fauzi, S.Pd",
            startTime: "14:00",
            endTime: "16:00",
            status: "hadir",
        }
    },
    {
        id: 4,
        date: "2025-11-29",
        studentStats: {
            present: 43,
            total: 45,
            percentage: 96,
        },
        advisorStats: {
            tutorName: "Ahmad Fauzi, S.Pd",
            startTime: "14:00",
            endTime: "15:30",
            status: "hadir",
        }
    },
    {
        id: 5,
        date: "2025-11-22",
        studentStats: {
            present: 41,
            total: 45,
            percentage: 91,
        },
        advisorStats: {
            tutorName: "Ahmad Fauzi, S.Pd",
            startTime: "14:00",
            endTime: "16:00",
            status: "hadir",
        }
    },
    {
        id: 6,
        date: "2025-11-15",
        studentStats: {
            present: 44,
            total: 45,
            percentage: 98,
        },
        advisorStats: {
            tutorName: "Ahmad Fauzi, S.Pd",
            startTime: "08:00",
            endTime: "17:00",
            status: "hadir",
        }
    },
    {
        id: 7,
        date: "2025-11-08",
        studentStats: {
            present: 39,
            total: 45,
            percentage: 87,
        },
        advisorStats: {
            tutorName: "Ahmad Fauzi, S.Pd",
            startTime: "14:00",
            endTime: "16:00",
            status: "hadir",
        }
    },
    {
        id: 8,
        date: "2025-11-01",
        studentStats: {
            present: 45,
            total: 45,
            percentage: 100,
        },
        advisorStats: {
            tutorName: "Ahmad Fauzi, S.Pd",
            startTime: "07:00",
            endTime: "18:00",
            status: "hadir",
        }
    },
];


type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpa";

interface AttendanceRecord {
    studentId: number;
    status: AttendanceStatus;
    note?: string;
}

export const ExtracurricularAttendance: React.FC = () => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    });
    const [attendanceRecords, setAttendanceRecords] = useState<
        Map<number, AttendanceRecord>
    >(new Map());
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | AttendanceStatus>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Advisor Attendance State
    const [tutorName, setTutorName] = useState("Ahmad Fauzi, S.Pd"); // Mock: logged-in tutor name
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    // Active tab state - read from URL query parameter
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(tabFromUrl === "history" ? "history" : "attendance");

    // Update active tab when URL changes
    useEffect(() => {
        if (tabFromUrl === "history") {
            setActiveTab("history");
        }
    }, [tabFromUrl]);

    // History Filter State
    const [historyAcademicYear, setHistoryAcademicYear] = useState("2025/2026");
    const [historySemester, setHistorySemester] = useState("Ganjil");
    const [historySearchTerm, setHistorySearchTerm] = useState("");
    const [historyDateRange, setHistoryDateRange] = useState({ from: "", to: "" });
    const [activeDateFilter, setActiveDateFilter] = useState<"today" | "week" | "month" | null>(null);

    const setToday = () => {
        const today = new Date().toISOString().split('T')[0];
        setHistoryDateRange({ from: today, to: today });
        setActiveDateFilter('today');
    };

    const setThisWeek = () => {
        const today = new Date();
        const first = today.getDate() - today.getDay();
        const last = first + 6;
        const firstDay = new Date(today.setDate(first)).toISOString().split('T')[0];
        const lastDay = new Date(today.setDate(last)).toISOString().split('T')[0];
        setHistoryDateRange({ from: firstDay, to: lastDay });
        setActiveDateFilter('week');
    };

    const setThisMonth = () => {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
        setHistoryDateRange({ from: firstDay, to: lastDay });
        setActiveDateFilter('month');
    };

    const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
        setAttendanceRecords((prev) => {
            const newMap = new Map(prev);
            newMap.set(studentId, { studentId, status });
            return newMap;
        });
    };

    const handleSaveAttendance = () => {
        // 1. Validate Date
        if (!selectedDate) {
            toast.error("Tanggal belum diisi", {
                description: "Silakan pilih tanggal pelaksanaan kegiatan terlebih dahulu untuk melanjutkan.",
                icon: <XCircle className="h-5 w-5 !text-red-600" />,
                className: "!bg-red-50 !border-red-200 !text-red-800",
            });
            return;
        }

        // 2. Validate Tutor Time
        if (!startTime || !endTime) {
            toast.error("Waktu kegiatan tidak lengkap", {
                description: "Mohon lengkapi jam mulai dan jam selesai kegiatan.",
                icon: <XCircle className="h-5 w-5 !text-red-600" />,
                className: "!bg-red-50 !border-red-200 !text-red-800",
            });
            return;
        }

        // 3. Validate Student Attendance (Must fill ALL)
        const totalMembers = mockMembers.length;
        const filledRecords = attendanceRecords.size;

        if (filledRecords < totalMembers) {
            const missingCount = totalMembers - filledRecords;
            toast.error("Data presensi belum lengkap", {
                description: `Masih ada ${missingCount} siswa yang belum ditandai statusnya. Mohon lengkapi semua data siswa.`,
                icon: <XCircle className="h-5 w-5 !text-red-600" />,
                className: "!bg-red-50 !border-red-200 !text-red-800",
            });
            return;
        }

        const presentCount = Array.from(attendanceRecords.values()).filter(
            (r) => r.status === "hadir"
        ).length;

        // Success Toast matching Teacher Role style (Standard Sonner)
        // Using description to show details cleanly
        toast.success("Presensi Berhasil Disimpan", {
            description: `Tanggal: ${formatDate(selectedDate, "dd MMMM yyyy")} • Hadir: ${presentCount}/${totalMembers} • Waktu: ${startTime}-${endTime}`,
            duration: 5000,
            icon: <CheckCircle className="h-5 w-5 !text-green-600" />,
            className: "!bg-green-50 !border-green-200 !text-green-800",
        });

        // Reset form
        setAttendanceRecords(new Map());
        setStartTime("");
        setEndTime("");
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setAttendanceRecords(new Map());
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        setSelectedDate(`${year}-${month}-${day}`);

        setTimeout(() => {
            setIsRefreshing(false);
            toast.success("Halaman presensi telah di-refresh!");
        }, 500);
    };


    const getStatusIcon = (status: AttendanceStatus) => {
        switch (status) {
            case "hadir":
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case "sakit":
                return <Heart className="h-5 w-5 text-yellow-600" />;
            case "izin":
                return <Clock className="h-5 w-5 text-sky-600" />;
            case "alpa":
                return <XCircle className="h-5 w-5 text-red-600" />;
        }
    };

    const getStatusBadgeVariant = (status: AttendanceStatus) => {
        switch (status) {
            case "hadir":
                return "bg-green-100 text-green-700 border-green-200";
            case "sakit":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "izin":
                return "bg-sky-100 text-sky-700 border-sky-200";
            case "alpa":
                return "bg-red-100 text-red-700 border-red-200";
        }
    };

    const getClassBadgeColor = (className: string) => {
        return "bg-blue-50 text-blue-800 border-blue-200";
    };

    // Filter members based on search and status
    const filteredMembers = React.useMemo(() => {
        return mockMembers.filter((member) => {
            const matchesSearch =
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.nis.includes(searchTerm) ||
                member.class.toLowerCase().includes(searchTerm.toLowerCase());

            const record = attendanceRecords.get(member.id);
            const matchesStatus =
                statusFilter === "all" || record?.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, attendanceRecords]);

    // Paginate filtered members
    const paginatedMembers = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredMembers.slice(startIndex, endIndex);
    }, [filteredMembers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const filteredHistory = React.useMemo(() => {
        return unifiedAttendanceHistory.filter((record) => {
            // Filter by date range
            let matchesDateRange = true;
            if (historyDateRange.from && historyDateRange.to) {
                const recordDate = new Date(record.date);
                const fromDate = new Date(historyDateRange.from);
                const toDate = new Date(historyDateRange.to);
                matchesDateRange = recordDate >= fromDate && recordDate <= toDate;
            } else if (historyDateRange.from) {
                const recordDate = new Date(record.date);
                const fromDate = new Date(historyDateRange.from);
                matchesDateRange = recordDate >= fromDate;
            } else if (historyDateRange.to) {
                const recordDate = new Date(record.date);
                const toDate = new Date(historyDateRange.to);
                matchesDateRange = recordDate <= toDate;
            }

            return matchesDateRange;
        });
    }, [historyDateRange]);

    const presentCount = Array.from(attendanceRecords.values()).filter(
        (r) => r.status === "hadir"
    ).length;
    const percentage =
        mockMembers.length > 0
            ? Math.round((presentCount / mockMembers.length) * 100)
            : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Presensi </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Ekstrakurikuler Pramuka</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola presensi anggota dan kegiatan ekstrakurikuler Pramuka
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                                Tahun Ajaran 2025/2026
                            </span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-sm font-medium text-blue-800">
                            Semester Ganjil
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center space-x-2 bg-blue-800 text-white hover:bg-blue-900 hover:text-white border-blue-800"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        <span>Refresh</span>
                    </Button>
                </div>
            </div>

            {/* Stats Cards - Global for all tabs */}
            <Card className="overflow-hidden p-0">
                {/* Header Section with Decorative Pattern */}
                <div className="bg-blue-800 p-5 relative overflow-hidden">
                    {/* Decorative Geometric Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Award className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Statistik Kehadiran</h2>
                                <p className="text-blue-100 text-sm">Ringkasan performa kehadiran semester ini</p>
                            </div>
                        </div>
                    </div>
                </div>

                <CardContent className="p-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
                        {/* Total Anggota */}
                        <div className="p-4 text-center">
                            <div className="inline-flex p-2.5 bg-blue-100 rounded-full mb-2">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{mockMembers.length}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Anggota</p>
                        </div>

                        {/* Hadir Pertemuan Lalu */}
                        <div className="p-4 text-center">
                            <div className="inline-flex p-2.5 bg-green-100 rounded-full mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">{unifiedAttendanceHistory[0].studentStats.present}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Hadir Terakhir</p>
                        </div>

                        {/* Rata-rata Kehadiran */}
                        <div className="p-4 text-center">
                            <div className={cn(
                                "inline-flex p-2.5 rounded-full mb-2",
                                unifiedAttendanceHistory[0].studentStats.percentage >= 90 ? "bg-green-100" :
                                    unifiedAttendanceHistory[0].studentStats.percentage >= 75 ? "bg-yellow-100" : "bg-red-100"
                            )}>
                                <TrendingUp className={cn(
                                    "h-5 w-5",
                                    unifiedAttendanceHistory[0].studentStats.percentage >= 90 ? "text-green-600" :
                                        unifiedAttendanceHistory[0].studentStats.percentage >= 75 ? "text-yellow-600" : "text-red-600"
                                )} />
                            </div>
                            <p className={cn(
                                "text-2xl font-bold",
                                unifiedAttendanceHistory[0].studentStats.percentage >= 90 ? "text-green-600" :
                                    unifiedAttendanceHistory[0].studentStats.percentage >= 75 ? "text-yellow-600" : "text-red-600"
                            )}>
                                {unifiedAttendanceHistory[0].studentStats.percentage}%
                            </p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Rata-rata</p>
                        </div>

                        {/* Tanggal Pertemuan Terakhir */}
                        <div className="p-4 text-center">
                            <div className="inline-flex p-2.5 bg-purple-100 rounded-full mb-2">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-600">12</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Pertemuan</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1.5 gap-1">
                    <TabsTrigger
                        value="attendance"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=active]:hover:bg-blue-900 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Presensi Hari Ini
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=active]:hover:bg-blue-900 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                    >
                        <History className="h-4 w-4 mr-2" />
                        Riwayat Presensi
                    </TabsTrigger>
                </TabsList>


                <TabsContent value="attendance" className="space-y-6">
                    {/* Date Selector - Improved */}
                    {/* Date Selector - Improved Consistency */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        Tanggal Kegiatan
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-normal">
                                            Wajib Diisi
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Pilih tanggal kegiatan untuk memulai pencatatan presensi
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="attendance-date" className="text-sm font-medium">
                                        Pilih Tanggal
                                    </Label>
                                    <Input
                                        id="attendance-date"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Tahun Ajaran & Semester</Label>
                                    <div className="flex items-center gap-3 h-11 px-3 bg-muted/30 rounded-md border text-sm text-muted-foreground">
                                        <span>Tahun Ajaran 2025/2026 - Ganjil</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tutor Info & Time Section */}
                    {/* Tutor Info & Time Section - Improved Consistency */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        Presensi Tutor & Waktu
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-normal">
                                            Wajib Diisi
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Konfirmasi kehadiran Anda sebagai tutor dan tentukan waktu pelaksanaan kegiatan
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left: Tutor Info */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tutor-name" className="text-sm font-semibold text-gray-900">
                                            Nama Tutor
                                        </Label>
                                        <Input
                                            id="tutor-name"
                                            value={tutorName}
                                            readOnly
                                            className="h-11 bg-muted/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type-eskul" className="text-sm font-semibold text-gray-900">
                                            Jenis Ekstrakurikuler
                                        </Label>
                                        <Input
                                            id="type-eskul"
                                            value="Pramuka"
                                            readOnly
                                            className="h-11 bg-muted/50"
                                        />
                                    </div>
                                </div>

                                {/* Right: Time Fields */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start-time" className="text-sm font-semibold text-gray-900">
                                            Waktu Mulai <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="start-time"
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="h-11 pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end-time" className="text-sm font-semibold text-gray-900">
                                            Waktu Selesai <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="end-time"
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className="h-11 pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    {/* Attendance Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-gray-900">
                                            Daftar Anggota ({filteredMembers.length})
                                        </CardTitle>
                                        <CardDescription className="text-sm text-muted-foreground">
                                            Catat status kehadiran (Hadir, Sakit, Izin, Alpa) untuk setiap anggota
                                        </CardDescription>
                                    </div>
                                </div>

                                {/* Attendance Stats in Header */}
                                <div className="flex items-center gap-3 bg-muted/30 px-3 py-2 rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium text-foreground">
                                            <span className="text-green-600 font-semibold">{presentCount}</span>
                                            <span className="text-muted-foreground mx-1">/</span>
                                            <span className="font-semibold">{mockMembers.length}</span>
                                            <span className="text-muted-foreground ml-1">hadir</span>
                                        </span>
                                    </div>
                                    <div className="h-4 w-[1px] bg-border" />
                                    <Badge
                                        variant="outline"
                                        className={`font-semibold ${percentage >= 90
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : percentage >= 75
                                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                            }`}
                                    >
                                        {percentage}%
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Toolbar - Search & Filters */}
                        <div className="px-6 py-4 border-b">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search Input */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari nama, NIS, atau kelas..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-10"
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm("")}
                                                className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                                                title="Clear search"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Status Filter */}
                                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                    <SelectTrigger className="w-full lg:w-40">
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="hadir">Hadir</SelectItem>
                                        <SelectItem value="sakit">Sakit</SelectItem>
                                        <SelectItem value="izin">Izin</SelectItem>
                                        <SelectItem value="alpa">Alpa</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Items per page */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">Show:</span>
                                    <Select
                                        value={itemsPerPage.toString()}
                                        onValueChange={(value) => {
                                            setItemsPerPage(parseInt(value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-24">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                            <SelectItem value={mockMembers.length.toString()}>Semua</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 sticky top-0">
                                        <tr>
                                            <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                            <th className="text-left p-4 font-medium text-sm w-24">NIS</th>
                                            <th className="text-left p-4 font-medium text-sm min-w-48">Nama Siswa</th>
                                            <th className="text-left p-4 font-medium text-sm w-24">Kelas</th>
                                            <th className="text-left p-4 font-medium text-sm min-w-96">Status Kehadiran</th>
                                            <th className="text-center p-4 font-medium text-sm w-32">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedMembers.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-12">
                                                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                        <div className="rounded-full bg-muted p-6">
                                                            <Search className="h-12 w-12 text-muted-foreground" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h3 className="text-lg font-semibold text-foreground">
                                                                Tidak Ada Data Ditemukan
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground max-w-md">
                                                                {searchTerm
                                                                    ? `Tidak ada anggota yang cocok dengan pencarian "${searchTerm}"`
                                                                    : "Tidak ada data anggota yang tersedia untuk ditampilkan."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedMembers.map((member, index) => {
                                                const record = attendanceRecords.get(member.id);
                                                const status = record?.status;
                                                const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;

                                                return (
                                                    <tr
                                                        key={member.id}
                                                        className="border-b hover:bg-muted/30 transition-colors"
                                                    >
                                                        <td className="p-4 text-sm font-medium">{globalIndex}</td>
                                                        <td className="p-4 text-sm font-mono">{member.nis}</td>
                                                        <td className="p-4">
                                                            <div className="text-sm font-medium">{member.name}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge className={getClassBadgeColor(member.class)}>
                                                                {member.class}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleStatusChange(member.id, "hadir")}
                                                                    className={cn(
                                                                        "h-8 px-2 text-xs transition-all",
                                                                        status === "hadir"
                                                                            ? "bg-green-50 text-green-700 border-green-200 font-medium"
                                                                            : "text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                                                    )}
                                                                >
                                                                    <div className={cn(
                                                                        "mr-1.5 flex items-center justify-center rounded-full transition-colors",
                                                                        status === "hadir" ? "bg-green-600 p-0.5" : "bg-transparent"
                                                                    )}>
                                                                        <CheckCircle className={cn(
                                                                            "h-3 w-3",
                                                                            status === "hadir" ? "text-white" : "currentColor"
                                                                        )} />
                                                                    </div>
                                                                    Hadir
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleStatusChange(member.id, "sakit")}
                                                                    className={cn(
                                                                        "h-8 px-2 text-xs transition-all",
                                                                        status === "sakit"
                                                                            ? "bg-yellow-50 text-yellow-700 border-yellow-200 font-medium"
                                                                            : "text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700"
                                                                    )}
                                                                >
                                                                    <div className={cn(
                                                                        "mr-1.5 flex items-center justify-center rounded-full transition-colors",
                                                                        status === "sakit" ? "bg-yellow-600 p-0.5" : "bg-transparent"
                                                                    )}>
                                                                        <AlertCircle className={cn(
                                                                            "h-3 w-3",
                                                                            status === "sakit" ? "text-white" : "currentColor"
                                                                        )} />
                                                                    </div>
                                                                    Sakit
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleStatusChange(member.id, "izin")}
                                                                    className={cn(
                                                                        "h-8 px-2 text-xs transition-all",
                                                                        status === "izin"
                                                                            ? "bg-sky-50 text-sky-700 border-sky-200 font-medium"
                                                                            : "text-sky-600 border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                                                                    )}
                                                                >
                                                                    <div className={cn(
                                                                        "mr-1.5 flex items-center justify-center rounded-full transition-colors",
                                                                        status === "izin" ? "bg-sky-600 p-0.5" : "bg-transparent"
                                                                    )}>
                                                                        <Clock className={cn(
                                                                            "h-3 w-3",
                                                                            status === "izin" ? "text-white" : "currentColor"
                                                                        )} />
                                                                    </div>
                                                                    Izin
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleStatusChange(member.id, "alpa")}
                                                                    className={cn(
                                                                        "h-8 px-2 text-xs transition-all",
                                                                        status === "alpa"
                                                                            ? "bg-red-50 text-red-700 border-red-200 font-medium"
                                                                            : "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                                    )}
                                                                >
                                                                    <div className={cn(
                                                                        "mr-1.5 flex items-center justify-center rounded-full transition-colors",
                                                                        status === "alpa" ? "bg-red-600 p-0.5" : "bg-transparent"
                                                                    )}>
                                                                        <XCircle className={cn(
                                                                            "h-3 w-3",
                                                                            status === "alpa" ? "text-white" : "currentColor"
                                                                        )} />
                                                                    </div>
                                                                    Alpa
                                                                </Button>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            {status ? (
                                                                <Badge className={getStatusBadgeVariant(status)}>
                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground text-sm italic">Belum diisi</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer: Summary & Actions */}
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 mt-4 bg-muted/20">
                                {/* Left: Pagination Info */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Menampilkan</span>
                                    <span className="font-medium text-foreground">
                                        {filteredMembers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                                    </span>
                                    <span>-</span>
                                    <span className="font-medium text-foreground">
                                        {Math.min(currentPage * itemsPerPage, filteredMembers.length)}
                                    </span>
                                    <span>dari</span>
                                    <span className="font-medium text-foreground">{filteredMembers.length}</span>
                                    <span>data</span>
                                </div>

                                {/* Right: Pagination & Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    {/* Pagination */}
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

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex items-center gap-2">
                                            <Download className="h-4 w-4" />
                                            Export
                                        </Button>
                                        <Button onClick={handleSaveAttendance} className="flex items-center gap-2 bg-blue-800 text-white hover:bg-blue-900 hover:text-white">
                                            <Save className="h-4 w-4" />
                                            Simpan Presensi
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="history" className="space-y-6">
                    {/* Riwayat Kegiatan - Unified Card with Filters */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <History className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-gray-900">
                                            Riwayat Kegiatan
                                        </CardTitle>
                                        <CardDescription className="text-sm text-muted-foreground">
                                            Riwayat kegiatan dan presensi lengkap tahun ajaran ini
                                        </CardDescription>
                                    </div>
                                </div>

                                {/* Actions & Summary */}
                                <div className="flex items-center gap-2">
                                    {(historyDateRange.from || historyDateRange.to || activeDateFilter) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-sm text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                                setHistoryDateRange({ from: "", to: "" });
                                                setHistorySearchTerm("");
                                                setActiveDateFilter(null);
                                            }}
                                        >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Reset
                                        </Button>
                                    )}
                                    <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                                        {filteredHistory.length} Riwayat
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Toolbar - Filters */}
                        <div className="px-6 py-4 bg-muted/20">
                            <div className="flex flex-col space-y-4">
                                {/* Top Row: Main Filter Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                                    {/* Year */}
                                    <div className="lg:col-span-3 space-y-2">
                                        <Label className="text-sm font-medium">Tahun Ajaran</Label>
                                        <div className="relative">
                                            <select
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                                value={historyAcademicYear}
                                                onChange={(e) => setHistoryAcademicYear(e.target.value)}
                                            >
                                                <option value="2025/2026">2025/2026</option>
                                                <option value="2024/2025">2024/2025</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Semester */}
                                    <div className="lg:col-span-3 space-y-2">
                                        <Label className="text-sm font-medium">Semester</Label>
                                        <div className="relative">
                                            <select
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                                value={historySemester}
                                                onChange={(e) => setHistorySemester(e.target.value)}
                                            >
                                                <option value="Ganjil">Ganjil</option>
                                                <option value="Genap">Genap</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Date Range Start */}
                                    <div className="lg:col-span-3 space-y-2">
                                        <Label className="text-sm font-medium">Dari Tanggal</Label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={historyDateRange.from}
                                                onChange={(e) => setHistoryDateRange({ ...historyDateRange, from: e.target.value })}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Pilih tanggal"
                                            />
                                        </div>
                                    </div>

                                    {/* Date Range End */}
                                    <div className="lg:col-span-3 space-y-2">
                                        <Label className="text-sm font-medium">Sampai Tanggal</Label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={historyDateRange.to}
                                                onChange={(e) => setHistoryDateRange({ ...historyDateRange, to: e.target.value })}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Pilih tanggal"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row: Quick Filters & Actions */}
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
                                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                        <span className="text-sm font-medium text-muted-foreground mr-1 whitespace-nowrap">Filter Cepat:</span>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "h-8 px-3 text-sm font-normal",
                                                activeDateFilter === 'today'
                                                    ? "bg-blue-800 text-white hover:bg-blue-900 hover:text-white border-blue-800"
                                                    : ""
                                            )}
                                            onClick={setToday}
                                        >
                                            Hari Ini
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "h-8 px-3 text-sm font-normal",
                                                activeDateFilter === 'week'
                                                    ? "bg-blue-800 text-white hover:bg-blue-900 hover:text-white border-blue-800"
                                                    : ""
                                            )}
                                            onClick={setThisWeek}
                                        >
                                            Minggu Ini
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "h-8 px-3 text-sm font-normal",
                                                activeDateFilter === 'month'
                                                    ? "bg-blue-800 text-white hover:bg-blue-900 hover:text-white border-blue-800"
                                                    : ""
                                            )}
                                            onClick={setThisMonth}
                                        >
                                            Bulan Ini
                                        </Button>
                                    </div>


                                </div>
                            </div>
                        </div>

                        <CardContent className="pt-3">
                            <div className="space-y-3">
                                {/* Empty State */}
                                {((filteredHistory.length === 0)) ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="p-4 rounded-full bg-muted mb-4">
                                            <Calendar className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            Tidak ada riwayat ditemukan
                                        </h3>
                                        <p className="text-sm text-muted-foreground max-w-sm">
                                            {historyDateRange.from || historyDateRange.to
                                                ? "Tidak ada data riwayat pada rentang tanggal yang dipilih. Coba ubah filter tanggal."
                                                : historySearchTerm
                                                    ? `Tidak ada kegiatan dengan nama "${historySearchTerm}". Coba kata kunci lain.`
                                                    : "Belum ada riwayat presensi yang tersimpan."}
                                        </p>
                                        {(historyDateRange.from || historyDateRange.to || historySearchTerm) && (
                                            <Button
                                                size="sm"
                                                className="mt-4 bg-blue-800 hover:bg-blue-900 text-white"
                                                onClick={() => {
                                                    setHistoryDateRange({ from: "", to: "" });
                                                    setHistorySearchTerm("");
                                                    setActiveDateFilter(null);
                                                }}
                                            >
                                                Reset Filter
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    filteredHistory.map((record) => {
                                        // Calculate duration
                                        const start = new Date(`2000-01-01 ${record.advisorStats.startTime}`);
                                        const end = new Date(`2000-01-01 ${record.advisorStats.endTime}`);
                                        const durationMs = end.getTime() - start.getTime();
                                        const hours = Math.floor(durationMs / (1000 * 60 * 60));
                                        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                                        const duration = `${hours}j ${minutes}m`;

                                        return (
                                            <div key={record.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                                                {/* Left: Date & Activity */}
                                                <div className="flex items-start md:items-center space-x-4 min-w-[200px]">
                                                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mt-1 md:mt-0">
                                                        <Calendar className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {formatDate(record.date, "dd MMMM yyyy")}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Middle: Student Stats */}
                                                <div className="flex flex-col md:flex-row gap-4 md:gap-8 flex-1 md:justify-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1.5 rounded-full bg-muted text-muted-foreground hidden md:block">
                                                            <Users className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium text-gray-700">Kehadiran Siswa</span>
                                                                <Badge
                                                                    className={
                                                                        record.studentStats.percentage >= 90
                                                                            ? "bg-green-100 text-green-700 border-green-200"
                                                                            : record.studentStats.percentage >= 75
                                                                                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                                                : "bg-red-100 text-red-700 border-red-200"
                                                                    }
                                                                >
                                                                    {record.studentStats.percentage}%
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                <span className="font-medium text-green-600">{record.studentStats.present}</span>
                                                                <span className="mx-0.5">/</span>
                                                                <span>{record.studentStats.total}</span> Anggota Hadir
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1.5 rounded-full bg-green-100 text-green-600 hidden md:block">
                                                            <CheckCircle className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-medium text-gray-700 block">Status Tutor</span>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-normal text-[10px] px-1.5 h-5">
                                                                    {record.advisorStats.startTime} - {record.advisorStats.endTime}
                                                                </Badge>
                                                                <span className="text-xs text-muted-foreground">({duration})</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Actions */}
                                                <div className="flex items-center justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                                                        onClick={() => router.push(`/extracurricular-advisor/attendance/${record.id}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Detail
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination (Mock) */}
                            <div className="flex items-center justify-between pt-4 border-t mt-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-muted-foreground">
                                        Menampilkan {filteredHistory.length === 0 ? 0 : 1}-{filteredHistory.length} dari {filteredHistory.length} data
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Baris:</span>
                                        <select
                                            className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" disabled>
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" disabled>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button variant="default" size="sm" className="min-w-[40px] bg-blue-800 hover:bg-blue-900">
                                        1
                                    </Button>
                                    <Button variant="outline" size="sm" disabled>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" disabled>
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
