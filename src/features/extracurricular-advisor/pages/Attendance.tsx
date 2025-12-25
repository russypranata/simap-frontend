"use client";

import React, { useState } from "react";
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

const mockAttendanceHistory = [
    {
        id: 1,
        date: "2025-12-20",
        activity: "Latihan Rutin",
        present: 42,
        total: 45,
        percentage: 93,
    },
    {
        id: 2,
        date: "2025-12-13",
        activity: "Lomba Internal",
        present: 40,
        total: 45,
        percentage: 89,
    },
    {
        id: 3,
        date: "2025-12-06",
        activity: "Persiapan Lomba",
        present: 38,
        total: 45,
        percentage: 84,
    },
    {
        id: 4,
        date: "2025-11-29",
        activity: "Latihan Rutin",
        present: 43,
        total: 45,
        percentage: 96,
    },
    {
        id: 5,
        date: "2025-11-22",
        activity: "Latihan Rutin",
        present: 41,
        total: 45,
        percentage: 91,
    },
    {
        id: 6,
        date: "2025-11-15",
        activity: "Outbound",
        present: 44,
        total: 45,
        percentage: 98,
    },
    {
        id: 7,
        date: "2025-11-08",
        activity: "Latihan Rutin",
        present: 39,
        total: 45,
        percentage: 87,
    },
    {
        id: 8,
        date: "2025-11-01",
        activity: "Kemah",
        present: 45,
        total: 45,
        percentage: 100,
    },
];

const mockAdvisorAttendanceHistory = [
    {
        id: 1,
        date: "2025-12-20",
        tutorName: "Ahmad Fauzi, S.Pd",
        startTime: "14:00",
        endTime: "16:00",
        status: "hadir",
    },
    {
        id: 2,
        date: "2025-12-13",
        tutorName: "Ahmad Fauzi, S.Pd",
        startTime: "14:00",
        endTime: "16:30",
        status: "hadir",
    },
    {
        id: 3,
        date: "2025-12-06",
        tutorName: "Ahmad Fauzi, S.Pd",
        startTime: "14:00",
        endTime: "16:00",
        status: "hadir",
    },
    {
        id: 4,
        date: "2025-11-29",
        tutorName: "Ahmad Fauzi, S.Pd",
        startTime: "14:00",
        endTime: "15:30",
        status: "hadir",
    },
    {
        id: 5,
        date: "2025-11-22",
        tutorName: "Ahmad Fauzi, S.Pd",
        startTime: "14:00",
        endTime: "16:00",
        status: "hadir",
    },
    {
        id: 6,
        date: "2025-11-15",
        tutorName: "Ahmad Fauzi, S.Pd",
        startTime: "08:00",
        endTime: "17:00",
        status: "hadir",
    },
    {
        id: 7,
        date: "2025-11-08",
        tutorName: "Ahmad Fauzi, S.Pd",
        startTime: "14:00",
        endTime: "16:00",
        status: "hadir",
    },
    {
        id: 8,
        date: "2025-11-01",
        tutorName: "Ahmad Fauzi, S.Pd",
        startTime: "07:00",
        endTime: "18:00",
        status: "hadir",
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

    // Active tab and history type state
    const [activeTab, setActiveTab] = useState("attendance");
    const [historyType, setHistoryType] = useState<"students" | "advisor">("students");

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
        const presentCount = Array.from(attendanceRecords.values()).filter(
            (r) => r.status === "hadir"
        ).length;

        toast.success(
            `Presensi berhasil disimpan! ${presentCount} dari ${mockMembers.length} siswa hadir`
        );
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

    const handleSaveAdvisorAttendance = () => {

        if (!startTime || !endTime) {
            toast.error("Silakan isi waktu mulai dan selesai!");
            return;
        }

        // Mengisi form otomatis berarti hadir
        toast.success(
            "Presensi pembina berhasil disimpan! Status: Hadir"
        );

        // Reset form (tutorName tetap karena readonly)
        setStartTime("");
        setEndTime("");
    };

    const getStatusIcon = (status: AttendanceStatus) => {
        switch (status) {
            case "hadir":
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case "sakit":
                return <Heart className="h-5 w-5 text-yellow-600" />;
            case "izin":
                return <AlertCircle className="h-5 w-5 text-blue-600" />;
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
                return "bg-blue-100 text-blue-700 border-blue-200";
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

    // Filter history based on search term and date range
    const filteredStudentHistory = React.useMemo(() => {
        return mockAttendanceHistory.filter((record) => {
            // Filter by search term (activity name)
            const matchesSearch = historySearchTerm === "" ||
                record.activity.toLowerCase().includes(historySearchTerm.toLowerCase());

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

            return matchesSearch && matchesDateRange;
        });
    }, [historySearchTerm, historyDateRange]);

    const filteredAdvisorHistory = React.useMemo(() => {
        return mockAdvisorAttendanceHistory.filter((record) => {
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
                        value="advisor"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=active]:hover:bg-blue-900 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                    >
                        <Users className="h-4 w-4 mr-2" />
                        Presensi Pembina
                    </TabsTrigger>
                    {/* Dropdown for History Selection */}
                    <Select
                        value={activeTab === "history" ? historyType : ""}
                        onValueChange={(value: "students" | "advisor") => {
                            setHistoryType(value);
                            setActiveTab("history");
                        }}
                    >
                        <SelectTrigger className={`inline-flex items-center justify-center whitespace-nowrap rounded-full pl-6 pr-3 h-9 py-2 text-sm font-medium border-0 focus:ring-0 focus:ring-offset-0 w-auto transition-all outline-none shadow-none ${activeTab === "history"
                            ? "bg-blue-800 text-white hover:bg-blue-900 [&_svg:not([class*='text-'])]:text-white [&_svg:not([class*='text-'])]:opacity-100"
                            : "bg-transparent text-muted-foreground hover:text-foreground"
                            }`}>
                            <SelectValue placeholder={
                                <div className="flex items-center gap-2">
                                    <History className="h-4 w-4" />
                                    <span>Riwayat Presensi</span>
                                </div>
                            }>
                                {activeTab === "history" && (
                                    <div className="flex items-center gap-2">
                                        {historyType === "students" ? (
                                            <>
                                                <Users className="h-4 w-4 text-inherit" />
                                                <span>Riwayat Presensi Siswa</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 text-inherit" />
                                                <span>Riwayat Presensi Pembina</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="students">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>Riwayat Presensi Siswa</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="advisor">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Riwayat Presensi Pembina</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </TabsList>

                <TabsContent value="attendance" className="space-y-6">
                    {/* Statistics Cards */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
                                {/* Total Anggota */}
                                <div className="p-4 text-center">
                                    <div className="inline-flex p-2.5 bg-blue-100 rounded-full mb-2">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{mockMembers.length}</p>
                                    <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Anggota</p>
                                </div>

                                {/* Hadir Pertemuan Lalu */}
                                <div className="p-4 text-center">
                                    <div className="inline-flex p-2.5 bg-green-100 rounded-full mb-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-green-600">{mockAttendanceHistory[0].present}</p>
                                    <p className="text-xs font-medium text-muted-foreground mt-0.5">Hadir Terakhir</p>
                                </div>

                                {/* Rata-rata Kehadiran */}
                                <div className="p-4 text-center">
                                    <div className={cn(
                                        "inline-flex p-2.5 rounded-full mb-2",
                                        mockAttendanceHistory[0].percentage >= 90 ? "bg-green-100" :
                                            mockAttendanceHistory[0].percentage >= 75 ? "bg-yellow-100" : "bg-red-100"
                                    )}>
                                        <CheckCircle className={cn(
                                            "h-5 w-5",
                                            mockAttendanceHistory[0].percentage >= 90 ? "text-green-600" :
                                                mockAttendanceHistory[0].percentage >= 75 ? "text-yellow-600" : "text-red-600"
                                        )} />
                                    </div>
                                    <p className={cn(
                                        "text-2xl font-bold",
                                        mockAttendanceHistory[0].percentage >= 90 ? "text-green-600" :
                                            mockAttendanceHistory[0].percentage >= 75 ? "text-yellow-600" : "text-red-600"
                                    )}>{mockAttendanceHistory[0].percentage}%</p>
                                    <p className="text-xs font-medium text-muted-foreground mt-0.5">Kehadiran</p>
                                </div>

                                {/* Pertemuan Bulan Ini */}
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

                    {/* Filter Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <Filter className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Filter Presensi
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Pilih tanggal dan filter data presensi
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="date" className="text-sm whitespace-nowrap">
                                        Tanggal:
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-40"
                                    />
                                </div>

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

                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="status-filter" className="text-sm whitespace-nowrap">
                                        Status:
                                    </Label>
                                    <Select
                                        value={statusFilter}
                                        onValueChange={(value) =>
                                            setStatusFilter(value as "all" | AttendanceStatus)
                                        }
                                    >
                                        <SelectTrigger className="w-32">
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

                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="items-per-page" className="text-sm whitespace-nowrap">
                                        Tampilkan:
                                    </Label>
                                    <Select
                                        value={itemsPerPage.toString()}
                                        onValueChange={(value) => {
                                            setItemsPerPage(parseInt(value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="w-20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {paginatedMembers.length} dari {filteredMembers.length}{" "}
                                    anggota
                                    {searchTerm && ` (hasil pencarian: "${searchTerm}")`}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Daftar Anggota
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Tandai kehadiran untuk setiap anggota ekstrakurikuler
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
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
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="radio"
                                                                        id={`hadir-${member.id}`}
                                                                        name={`status-${member.id}`}
                                                                        value="hadir"
                                                                        checked={status === "hadir"}
                                                                        onChange={() =>
                                                                            handleStatusChange(member.id, "hadir")
                                                                        }
                                                                        className="h-4 w-4 text-green-600"
                                                                    />
                                                                    <Label
                                                                        htmlFor={`hadir-${member.id}`}
                                                                        className="flex items-center gap-1.5 cursor-pointer text-sm font-medium"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                                        Hadir
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="radio"
                                                                        id={`sakit-${member.id}`}
                                                                        name={`status-${member.id}`}
                                                                        value="sakit"
                                                                        checked={status === "sakit"}
                                                                        onChange={() =>
                                                                            handleStatusChange(member.id, "sakit")
                                                                        }
                                                                        className="h-4 w-4 text-yellow-600"
                                                                    />
                                                                    <Label
                                                                        htmlFor={`sakit-${member.id}`}
                                                                        className="flex items-center gap-1.5 cursor-pointer text-sm font-medium"
                                                                    >
                                                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                                        Sakit
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="radio"
                                                                        id={`izin-${member.id}`}
                                                                        name={`status-${member.id}`}
                                                                        value="izin"
                                                                        checked={status === "izin"}
                                                                        onChange={() =>
                                                                            handleStatusChange(member.id, "izin")
                                                                        }
                                                                        className="h-4 w-4 text-blue-600"
                                                                    />
                                                                    <Label
                                                                        htmlFor={`izin-${member.id}`}
                                                                        className="flex items-center gap-1.5 cursor-pointer text-sm font-medium"
                                                                    >
                                                                        <Clock className="h-4 w-4 text-blue-500" />
                                                                        Izin
                                                                    </Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <input
                                                                        type="radio"
                                                                        id={`alpa-${member.id}`}
                                                                        name={`status-${member.id}`}
                                                                        value="alpa"
                                                                        checked={status === "alpa"}
                                                                        onChange={() =>
                                                                            handleStatusChange(member.id, "alpa")
                                                                        }
                                                                        className="h-4 w-4 text-red-600"
                                                                    />
                                                                    <Label
                                                                        htmlFor={`alpa-${member.id}`}
                                                                        className="flex items-center gap-1.5 cursor-pointer text-sm font-medium"
                                                                    >
                                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                                        Alpa
                                                                    </Label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            {status ? (
                                                                <Badge className={getStatusBadgeVariant(status)}>
                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-slate-100 text-slate-500 border-slate-300">
                                                                    Belum Diisi
                                                                </Badge>
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
                                {/* Left: Summary */}
                                <div className="flex items-center gap-3">
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
                                        {percentage}% Kehadiran
                                    </Badge>
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

                <TabsContent value="advisor" className="space-y-6">
                    {/* Advisor Attendance Form */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Form Presensi Pembina
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Lengkapi informasi kehadiran dan kegiatan hari ini
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Tutor Name - Readonly */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tutor-name" className="text-sm font-semibold text-gray-900">
                                        Nama Tutor Ekstrakurikuler <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="tutor-name"
                                        value={tutorName}
                                        readOnly
                                        className="h-12 bg-slate-50 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type-eskul" className="text-sm font-semibold text-gray-900">
                                        Jenis Ekstrakurikuler <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="type-eskul"
                                        value="Pramuka"
                                        readOnly
                                        className="h-12 bg-slate-50 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Date and Time - Responsive Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Date */}
                                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                                    <Label htmlFor="advisor-date" className="text-sm font-semibold text-gray-900">
                                        Tanggal <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="advisor-date"
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="h-12 pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Start Time */}
                                <div className="space-y-2">
                                    <Label htmlFor="start-time" className="text-sm font-semibold text-gray-900">
                                        Waktu Mulai <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="start-time"
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="h-12 pl-10"
                                        />
                                    </div>
                                </div>

                                {/* End Time */}
                                <div className="space-y-2">
                                    <Label htmlFor="end-time" className="text-sm font-semibold text-gray-900">
                                        Waktu Selesai <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="end-time"
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="h-12 pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Info Badge - Mengisi form = Hadir */}
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <p className="text-sm text-green-800">
                                    <span className="font-semibold">Status: Hadir.</span> Dengan mengisi form presensi ini, Anda otomatis tercatat hadir.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setStartTime("");
                                        setEndTime("");
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Reset Form
                                </Button>
                                <Button
                                    onClick={handleSaveAdvisorAttendance}
                                    className="flex items-center gap-2 bg-blue-800 text-white hover:bg-blue-900 hover:text-white"
                                >
                                    <Save className="h-4 w-4" />
                                    Simpan Presensi Pembina
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-2 pb-2 px-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-blue-900">Informasi Penting</p>
                                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                        <li>Pastikan mengisi presensi siswa terlebih dahulu sebelum mengisi presensi pembina</li>
                                        <li>Presensi pembina harus diisi setiap kali ada kegiatan ekstrakurikuler</li>
                                        <li>Waktu mulai dan selesai akan digunakan untuk perhitungan jam kegiatan</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                    {/* Enhanced Filter Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <Filter className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Filter Riwayat
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Sesuaikan tampilan riwayat berdasarkan kriteria
                                    </CardDescription>
                                </div>
                                <div className="ml-auto">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => {
                                            setHistoryDateRange({ from: "", to: "" });
                                            setHistorySearchTerm("");
                                            setActiveDateFilter(null);
                                        }}
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        Reset Filter
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Row 1: Academic Year, Semester, Search */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Tahun Ajaran</Label>
                                        <div className="relative">
                                            <select
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                                value={historyAcademicYear}
                                                onChange={(e) => setHistoryAcademicYear(e.target.value)}
                                            >
                                                <option value="2025/2026">2025/2026</option>
                                                <option value="2024/2025">2024/2025</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Semester</Label>
                                        <div className="relative">
                                            <select
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                                value={historySemester}
                                                onChange={(e) => setHistorySemester(e.target.value)}
                                            >
                                                <option value="Ganjil">Ganjil</option>
                                                <option value="Genap">Genap</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>

                                    {historyType === "students" && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Cari</Label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    placeholder="Cari kegiatan..."
                                                    value={historySearchTerm}
                                                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Row 2: Date Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Filter Cepat</Label>
                                        <div className="flex items-center gap-2 h-10">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={cn(
                                                    "h-9 text-xs flex-1",
                                                    activeDateFilter === 'today' && "bg-blue-800 text-white hover:bg-blue-900 hover:text-white"
                                                )}
                                                onClick={setToday}
                                            >
                                                Hari Ini
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={cn(
                                                    "h-9 text-xs flex-1",
                                                    activeDateFilter === 'week' && "bg-blue-800 text-white hover:bg-blue-900 hover:text-white"
                                                )}
                                                onClick={setThisWeek}
                                            >
                                                Minggu Ini
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={cn(
                                                    "h-9 text-xs flex-1",
                                                    activeDateFilter === 'month' && "bg-blue-800 text-white hover:bg-blue-900 hover:text-white"
                                                )}
                                                onClick={setThisMonth}
                                            >
                                                Bulan Ini
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Rentang Tanggal</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={historyDateRange.from}
                                                    onChange={(e) => setHistoryDateRange({ ...historyDateRange, from: e.target.value })}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={historyDateRange.to}
                                                    onChange={(e) => setHistoryDateRange({ ...historyDateRange, to: e.target.value })}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Records List */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        {historyType === "students" ? <History className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-gray-900">
                                            {historyType === "students" ? "Riwayat Presensi Siswa" : "Riwayat Presensi Pembina"}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-muted-foreground">
                                            {historyType === "students"
                                                ? "Daftar presensi kegiatan ekstrakurikuler sebelumnya"
                                                : "Daftar presensi kehadiran pembina ekstrakurikuler"}
                                        </CardDescription>
                                    </div>
                                </div>

                                {/* Summary Badge */}
                                <Badge variant="outline" className="gap-2 px-3 py-1.5 text-sm font-medium">
                                    <History className="h-4 w-4" />
                                    {historyType === "students" ? filteredStudentHistory.length : filteredAdvisorHistory.length} Riwayat
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {/* Empty State */}
                                {((historyType === "students" && filteredStudentHistory.length === 0) ||
                                    (historyType === "advisor" && filteredAdvisorHistory.length === 0)) ? (
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
                                ) : historyType === "students" ? (
                                    filteredStudentHistory.map((record) => (
                                        <div key={record.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                                            <div className="flex items-start md:items-center space-x-4">
                                                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mt-1 md:mt-0">
                                                    <Calendar className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {formatDate(record.date, "dd MMMM yyyy")}
                                                    </p>

                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                                                <div className="text-right">
                                                    <Badge
                                                        className={
                                                            record.percentage >= 90
                                                                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                                                                : record.percentage >= 75
                                                                    ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
                                                                    : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                                                        }
                                                    >
                                                        {record.percentage}% Kehadiran
                                                    </Badge>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        <span className="font-medium text-green-600">{record.present}</span>/{record.total} Hadir
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        title="Lihat Detail"
                                                        className="bg-blue-800 hover:bg-blue-900 text-white border-0"
                                                        onClick={() => router.push(`/extracurricular-advisor/attendance/${record.id}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    filteredAdvisorHistory.map((record) => {
                                        // Calculate duration
                                        const start = new Date(`2000-01-01 ${record.startTime}`);
                                        const end = new Date(`2000-01-01 ${record.endTime}`);
                                        const durationMs = end.getTime() - start.getTime();
                                        const hours = Math.floor(durationMs / (1000 * 60 * 60));
                                        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                                        const duration = `${hours}j ${minutes}m`;

                                        return (
                                            <div key={record.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
                                                <div className="flex items-start md:items-center space-x-4">
                                                    <div className="p-2 rounded-full bg-green-100 text-green-600 mt-1 md:mt-0">
                                                        <CheckCircle className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{record.tutorName}</p>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                            <span>{formatDate(record.date, "dd MMMM yyyy")}</span>
                                                            <span className="text-muted-foreground">•</span>
                                                            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{record.startTime} - {record.endTime}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                                                    <div className="text-right flex items-center gap-3">
                                                        <Badge variant="outline" className="font-medium">
                                                            Durasi: {duration}
                                                        </Badge>
                                                        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200">
                                                            Hadir
                                                        </Badge>
                                                    </div>
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
                                        Menampilkan 1 sampai {historyType === "students" ? filteredStudentHistory.length : filteredAdvisorHistory.length} dari {historyType === "students" ? filteredStudentHistory.length : filteredAdvisorHistory.length} data
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
