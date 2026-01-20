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
    Calendar,
    Users,
    Save,
    Download,
    Search,
    RefreshCw,
    Clock,
    ChevronLeft,
    ChevronRight,
    History,
    TrendingUp,
    Eye,
    ChevronsLeft,
    ChevronsRight,
    ClipboardCheck,
    CheckCheck,
} from "lucide-react";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { advisorService, AdvisorMember, AttendanceHistoryEntry, CreateAttendanceRequest } from "../services/advisorService";
import { useAcademicYear } from "@/context/AcademicYearContext";
import { AttendanceSkeleton } from "../components/AdvisorSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpa";

interface AttendanceRecord {
    studentId: number;
    status: AttendanceStatus;
    note?: string;
}

export const ExtracurricularAttendance: React.FC = () => {
    const [members, setMembers] = useState<AdvisorMember[]>([]);
    const [history, setHistory] = useState<AttendanceHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [tutorName, setTutorName] = useState("");
    const { academicYear, isLoading: isConfigLoading } = useAcademicYear();


    
    // Attendance Tab State
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    });
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [attendanceRecords, setAttendanceRecords] = useState<Map<number, AttendanceRecord>>(new Map());
    
    // UI State
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | AttendanceStatus>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Tabs & History State
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(tabFromUrl === "history" ? "history" : "attendance");

    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);
    
    // History Filters
    // History Filters - Enforce Active Period
    // Note: These could be used for API filtering in the future
    const [historySearchTerm, setHistorySearchTerm] = useState("");
    const [historyDateRange, setHistoryDateRange] = useState({ from: "", to: "" });
    const [activeDateFilter, setActiveDateFilter] = useState<"today" | "week" | "month" | null>(null);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyItemsPerPage, setHistoryItemsPerPage] = useState(10);

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

    const handleMarkAllPresent = () => {
        setAttendanceRecords((prev) => {
            const newMap = new Map(prev);
            // Only update filtered members (visible ones)
            filteredMembers.forEach((member) => {
                 newMap.set(member.id, { studentId: member.id, status: "hadir" });
            });
            return newMap;
        });
        toast.success("Semua siswa ditandai hadir.");
    };

    // Initial load
    // Initial load
    // Initial load
    useEffect(() => {
        if (isConfigLoading) return;

        const fetchInitialData = async () => {
            try {
                // Fetch config first or in parallel
                const profileData = await advisorService.getProfile();

                setTutorName(profileData.name);

                // Fetch Members for that academic year
                const membersResponse = await advisorService.getMembers({
                    limit: 100,
                    status: "Aktif",
                    academicYear: academicYear.academicYear,
                    // semester: academicYear.semester
                });
                
                // Assuming membersResponse gives data in unified format now
                // If getMembers returns { data, meta }
                const membersData = membersResponse.data || []; 

                setMembers(membersData);
                
                setMembers(membersData);
                
                // Init records - REMOVED default "hadir" initialization per user request
                // Default is empty
                const initialRecords = new Map<number, AttendanceRecord>();
                setAttendanceRecords(initialRecords);

                // Fetch History for Stats (regardless of tab)
                const historyData = await advisorService.getAttendanceHistory();
                setHistory(historyData);

            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                toast.error("Gagal memuat data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [isConfigLoading, academicYear]);

    // Load History Separate Effect - Re-fetch when tab changes to history if needed, 
    // but we already fetched on mount. 
    // Maybe we keep this to "Refresh" when tab is clicked? 
    // Yes, but let's make sure we don't double fetch on mount if tab is 'history'.
    // Actually, simple refactor: Just fetch on tab change if we want fresh data, 
    // but simpler to just rely on the initial fetch + manual refresh button.
    // However, user might expect fresh data when switching tabs.
    // Let's keep it but check if it's already loaded? No, easiest is just let it refresh or remove it if initial is enough.
    // Given the previous bug, "Initial Load" is the priority.
    // For now, I will COMMENT OUT this specific effect to prevent double fetching on mount 
    // and rely on the initial fetch + manual refresh.
    // OR: Only fetch if history is empty?
    
    // DECISION: Remove automatic refetch on tab switch for now to avoid complexity, 
    // since we fetch all on mount. The manual "Refresh" button exists.
    
    useEffect(() => {
        if (activeTab === "history") {
            const fetchHistory = async () => {
                setIsHistoryLoading(true);
                try {
                   // Add artificial delay for visual feedback if needed, mostly handled by service
                   const historyData = await advisorService.getAttendanceHistory();
                   setHistory(historyData);
                } catch(e) { console.log(e); } 
                finally { setIsHistoryLoading(false); }
            };
            fetchHistory();
        }
    }, [activeTab]);



    const handleSaveAttendance = async () => {
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
        const totalMembers = members.length;
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

        setIsSubmitting(true);
        try {
            const attendanceList = Array.from(attendanceRecords.entries()).map(([studentId, record]) => ({
                studentId,
                status: record.status,
                note: record.note
            }));

            const payload: CreateAttendanceRequest = {
                date: selectedDate,
                startTime,
                endTime,
                topic: "Kegiatan Rutin", // Should probably add this field to UI later
                students: attendanceList
            };

            await advisorService.submitAttendance(payload);

            const presentCount = attendanceList.filter(r => r.status === "hadir").length;

            toast.success("Data Presensi Berhasil Disimpan", {
                description: (
                    <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(new Date(selectedDate), "EEEE, dd MMMM yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{startTime} - {endTime} WIB</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                            <Users className="h-3.5 w-3.5" />
                            <span>{presentCount} dari {totalMembers} siswa hadir</span>
                        </div>
                    </div>
                ),
                duration: 5000,
                className: "!bg-green-50 !border-green-200 !text-green-900",
                icon: <div className="p-1 bg-green-100 rounded-full"><CheckCircle className="h-4 w-4 text-green-600" /></div>,
            });

            // Refresh history and reset form
            const newHistory = await advisorService.getAttendanceHistory();
            setHistory(newHistory);
            setAttendanceRecords(new Map());
             // Keep date/time for convenience or reset? Let's keep date, reset time maybe?
            setStartTime("");
            setEndTime("");

        } catch (error) {
            console.error("Failed to submit attendance:", error);
            toast.error("Gagal menyimpan presensi");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        // setIsRefreshing(true); // Optional: keep if you want button state update before unmount
        try {
            const [membersData, historyData] = await Promise.all([
                 advisorService.getMembers({ limit: 50, status: "Aktif" }),
                 advisorService.getAttendanceHistory()
            ]);
            setMembers(membersData.data);
            setHistory(historyData);
            setAttendanceRecords(new Map());
            
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            setSelectedDate(`${year}-${month}-${day}`);

            toast.success("Halaman presensi telah di-refresh!");
        } catch {
             toast.error("Gagal merefresh data");
        } finally {
            setIsLoading(false);
            // setIsRefreshing(false);
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

    const getClassBadgeColor = () => {
        return "bg-blue-50 text-blue-800 border-blue-200";
    };

    // Filter members based on search and status
    const filteredMembers = React.useMemo(() => {
        return members.filter((member) => {
            const matchesSearch =
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.nis.includes(searchTerm) ||
                member.class.toLowerCase().includes(searchTerm.toLowerCase());

            const record = attendanceRecords.get(member.id);
            const matchesStatus =
                statusFilter === "all" || record?.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, attendanceRecords, members]);

    // Paginate filtered members
    const paginatedMembers = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredMembers.slice(startIndex, endIndex);
    }, [filteredMembers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const filteredHistory = React.useMemo(() => {
        return history.filter((record) => {
            // Filter by Search Term
            let matchesSearch = true;
            if (historySearchTerm) {
                const lowerTerm = historySearchTerm.toLowerCase();
                const dateStr = formatDate(record.date, "dd MMMM yyyy").toLowerCase();
                matchesSearch = dateStr.includes(lowerTerm);
            }

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
    }, [historyDateRange, history, historySearchTerm]);

    // Paginate history
    const paginatedHistory = React.useMemo(() => {
        const startIndex = (historyPage - 1) * historyItemsPerPage;
        const endIndex = startIndex + historyItemsPerPage;
        return filteredHistory.slice(startIndex, endIndex);
    }, [filteredHistory, historyPage, historyItemsPerPage]);

    const totalHistoryPages = Math.ceil(filteredHistory.length / historyItemsPerPage);

    // Reset history page when filters change
    useEffect(() => {
        setHistoryPage(1);
    }, [historySearchTerm, historyDateRange, historyItemsPerPage]);

    // Latest Stats derivation
    const latestHistory = history[0];
    const latestPresent = latestHistory ? latestHistory.studentStats.present : 0;
    // Calculate overall average attendance percentage from history
    const overallAveragePercentage = history.length > 0
        ? Math.round(
            history.reduce((acc, curr) => acc + curr.studentStats.percentage, 0) / history.length
          )
        : 0;

    const presentCount = Array.from(attendanceRecords.values()).filter(
        (r) => r.status === "hadir"
    ).length;
    
    // For current session stats (badge in header) which uses mockMembers previously
    const currentSessionPercentage =
        members.length > 0
            ? Math.round((presentCount / members.length) * 100)
            : 0;

    if (isLoading) {
        return <AttendanceSkeleton />;
    }

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
                        Kelola presensi dan kegiatan ekstrakurikuler pada Tahun Ajaran aktif
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

            {/* Stats Card */}
            <Card className="overflow-hidden p-0 gap-0">
                {/* Header */}
                <div className="bg-blue-800 p-4 rounded-t-lg relative overflow-hidden">
                    {/* Decorative circles */}
                    {/* Decorative Icon */}
                    <div className="absolute -right-6 -bottom-6 text-white/10 transform rotate-12">
                        <ClipboardCheck className="w-32 h-32" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
                            <ClipboardCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Ringkasan Kehadiran</h3>
                            <p className="text-blue-100 text-sm">Ringkasan data kehadiran siswa pada Tahun Ajaran aktif</p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
                        {/* Total Anggota */}
                        <div className="p-4 text-center">
                            <div className="inline-flex p-2.5 bg-blue-100 rounded-full mb-2">
                                <Users className="h-5 w-5 text-blue-800" />
                            </div>
                            <p className="text-xl font-bold text-blue-800">{members.length}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Anggota</p>
                        </div>

                        {/* Hadir Pertemuan Lalu */}
                        <div className="p-4 text-center">
                            <div className="inline-flex p-2.5 bg-green-100 rounded-full mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-xl font-bold text-green-600">{latestPresent}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Kehadiran Terakhir</p>
                        </div>

                        {/* Rata-rata Kehadiran */}
                        <div className="p-4 text-center">
                            <div className={cn(
                                "inline-flex p-2.5 rounded-full mb-2",
                                overallAveragePercentage >= 90 ? "bg-green-100" :
                                    overallAveragePercentage >= 75 ? "bg-yellow-100" : "bg-red-100"
                            )}>
                                <TrendingUp className={cn(
                                    "h-5 w-5",
                                    overallAveragePercentage >= 90 ? "text-green-600" :
                                        overallAveragePercentage >= 75 ? "text-yellow-600" : "text-red-600"
                                )} />
                            </div>
                            <p className={cn(
                                "text-xl font-bold",
                                overallAveragePercentage >= 90 ? "text-green-600" :
                                    overallAveragePercentage >= 75 ? "text-yellow-600" : "text-red-600"
                            )}>
                                {overallAveragePercentage}%
                            </p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Rata-rata Kehadiran</p>
                        </div>

                        {/* Tanggal Pertemuan Terakhir */}
                        <div className="p-4 text-center">
                            <div className="inline-flex p-2.5 bg-purple-100 rounded-full mb-2">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <p className="text-xl font-bold text-purple-600">{history.length}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Pertemuan</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs 
                value={activeTab} 
                onValueChange={(value) => {
                    setActiveTab(value);
                    const newParams = new URLSearchParams(searchParams.toString());
                    newParams.set("tab", value);
                    router.push(`?${newParams.toString()}`, { scroll: false });
                }} 
                className="space-y-6"
            >
                <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1.5 gap-1">
                    <TabsTrigger
                        value="attendance"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=active]:hover:bg-blue-900 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Isi Presensi
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
                                        Informasi Kegiatan
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Lengkapi detail waktu dan tanggal pelaksanaan kegiatan ekstrakurikuler
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
                                    {/* Date Input moved here */}
                                    <div className="space-y-2">
                                        <Label htmlFor="attendance-date" className="text-sm font-semibold text-gray-900">
                                            Tanggal Kegiatan <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="attendance-date"
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                className="h-11 pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
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
                                            Daftar Anggota
                                        </CardTitle>
                                        <CardDescription className="text-sm text-muted-foreground">
                                            Catat status kehadiran (Hadir, Sakit, Izin, Alpa) untuk setiap anggota
                                        </CardDescription>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-50 text-blue-800 border-blue-200">
                                        {filteredMembers.length} Anggota
                                    </Badge>

                                    {/* Attendance Stats in Header */}
                                    <div className="flex items-center gap-3 bg-muted/30 px-3 py-1.5 rounded-lg border">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium text-foreground">
                                                <span className="text-green-600 font-semibold">{presentCount}</span>
                                                <span className="text-muted-foreground mx-1">/</span>
                                                <span className="font-semibold">{members.length}</span>
                                                <span className="text-muted-foreground ml-1">hadir</span>
                                            </span>
                                        </div>
                                        <div className="h-4 w-[1px] bg-border" />
                                        <Badge
                                            variant="outline"
                                            className={`font-semibold ${currentSessionPercentage >= 90
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : currentSessionPercentage >= 75
                                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                    : 'bg-red-50 text-red-700 border-red-200'
                                                }`}
                                        >
                                            {currentSessionPercentage}%
                                        </Badge>
                                    </div>
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
                                <Select value={statusFilter} onValueChange={(value: "all" | AttendanceStatus) => setStatusFilter(value)}>
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

                                <Button
                                    variant="outline"
                                    onClick={handleMarkAllPresent}
                                    disabled={filteredMembers.length === 0}
                                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 w-full lg:w-auto"
                                >
                                    <div className="flex items-center justify-center p-1 bg-green-200/50 rounded-full mr-2">
                                        <CheckCheck className="h-3.5 w-3.5" />
                                    </div>
                                    <span>Tandai {filteredMembers.length > 0 ? filteredMembers.length : ""} Siswa Hadir</span>
                                </Button>
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
                                                            <Badge className={getClassBadgeColor()}>
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
                                            Riwayat Presensi
                                        </CardTitle>
                                        <CardDescription className="text-sm text-muted-foreground">
                                            Riwayat kegiatan dan presensi lengkap pada Tahun Ajaran aktif
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
                                    {isHistoryLoading ? (
                                        <Skeleton className="h-6 w-24 rounded-full" />
                                    ) : (
                                        <Badge className="bg-blue-50 text-blue-800 border-blue-200">
                                            {filteredHistory.length} Riwayat
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        {/* Toolbar - Filters */}
                        <div className="px-6 py-3 bg-muted/20">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                {/* Search Field */}
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        type="text"
                                        className="pl-9 h-9"
                                        placeholder="Cari riwayat tanggal..."
                                        value={historySearchTerm}
                                        onChange={(e) => setHistorySearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Quick Filters */}
                                {/* Quick Filters - Segmented Control Style */}
                                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                    <span className="text-sm font-medium text-muted-foreground mr-1 whitespace-nowrap">Filter Cepat:</span>
                                    <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
                                        <button
                                            onClick={setToday}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                                                activeDateFilter === 'today'
                                                    ? "bg-blue-800 text-white shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            )}
                                        >
                                            Hari Ini
                                        </button>
                                        <div className="w-[1px] h-4 bg-border/50 mx-1" />
                                        <button
                                            onClick={setThisWeek}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                                                activeDateFilter === 'week'
                                                    ? "bg-blue-800 text-white shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            )}
                                        >
                                            Minggu Ini
                                        </button>
                                        <div className="w-[1px] h-4 bg-border/50 mx-1" />
                                        <button
                                            onClick={setThisMonth}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                                                activeDateFilter === 'month'
                                                    ? "bg-blue-800 text-white shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                            )}
                                        >
                                            Bulan Ini
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <CardContent className="pt-2">
                            <div className="space-y-3">
                                {isHistoryLoading ? (
                                    // Local Skeleton for History Items
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4 animate-pulse">
                                            <div className="flex items-center space-x-4 min-w-[200px]">
                                                <div className="h-10 w-10 rounded-full bg-slate-200" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-slate-200 rounded" />
                                                    <div className="h-3 w-20 bg-slate-200 rounded" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="h-12 w-24 bg-slate-200 rounded" />
                                                <div className="h-12 w-24 bg-slate-200 rounded" />
                                            </div>
                                            <div className="h-9 w-24 bg-slate-200 rounded" />
                                        </div>
                                    ))
                                ) : ((filteredHistory.length === 0)) ? (
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
                                    paginatedHistory.map((record) => {
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
                                                        <p className="text-sm font-medium text-gray-900">
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
                                                                <Badge className="bg-blue-50 text-blue-800 border-blue-200 font-normal text-[10px] px-1.5 h-5">
                                                                    {record.advisorStats.startTime} - {record.advisorStats.endTime}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Actions */}
                                                <div className="flex items-center justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 hover:text-blue-900 rounded-lg gap-2"
                                                        onClick={() => router.push(`/extracurricular-advisor/attendance/${record.id}?tab=${activeTab}`)}
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

                            {/* Pagination (History) */}
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 mt-4 bg-muted/20">
                                {/* Left: Pagination Info */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Menampilkan</span>
                                    <span className="font-medium text-foreground">
                                        {filteredHistory.length === 0 ? 0 : (historyPage - 1) * historyItemsPerPage + 1}
                                    </span>
                                    <span>-</span>
                                    <span className="font-medium text-foreground">
                                        {Math.min(historyPage * historyItemsPerPage, filteredHistory.length)}
                                    </span>
                                    <span>dari</span>
                                    <span className="font-medium text-foreground">{filteredHistory.length}</span>
                                    <span>data</span>
                                </div>

                                {/* Right: Pagination & Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    {totalHistoryPages > 1 && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                Hal {historyPage}/{totalHistoryPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setHistoryPage((prev) => Math.max(1, prev - 1))}
                                                disabled={historyPage === 1}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <div className="flex items-center space-x-1">
                                                {Array.from({ length: Math.min(5, totalHistoryPages) }, (_, i) => {
                                                    const pageNumber = i + 1;
                                                    return (
                                                        <Button
                                                            key={pageNumber}
                                                            variant={historyPage === pageNumber ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setHistoryPage(pageNumber)}
                                                            className={cn(
                                                                "w-8 h-8 p-0",
                                                                historyPage === pageNumber && "bg-blue-800 hover:bg-blue-900 text-white"
                                                            )}
                                                        >
                                                            {pageNumber}
                                                        </Button>
                                                    );
                                                })}
                                                {totalHistoryPages > 5 && (
                                                    <>
                                                        <span className="text-sm text-muted-foreground">...</span>
                                                        <Button
                                                            variant={historyPage === totalHistoryPages ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setHistoryPage(totalHistoryPages)}
                                                            className={cn(
                                                                "w-8 h-8 p-0",
                                                                historyPage === totalHistoryPages && "bg-blue-800 hover:bg-blue-900 text-white"
                                                            )}
                                                        >
                                                            {totalHistoryPages}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setHistoryPage((prev) => Math.min(totalHistoryPages, prev + 1))}
                                                disabled={historyPage === totalHistoryPages}
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
                </TabsContent>
            </Tabs>
        </div>
    );
};
