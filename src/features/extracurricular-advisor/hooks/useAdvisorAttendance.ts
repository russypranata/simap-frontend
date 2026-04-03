import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAcademicYear } from "@/context/AcademicYearContext";
import { toast } from "sonner";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import {
    getAttendanceHistory,
    submitAttendance,
    type AttendanceHistoryEntry,
    type CreateAttendanceRequest,
} from "../services/advisorAttendanceService";
import { getMembers, type AdvisorMember } from "../services/advisorMembersService";
import { getProfile } from "../services/advisorProfileService";

export type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpa";

export interface AttendanceRecord {
    studentId: number;
    status: AttendanceStatus;
    note?: string;
}

interface UseAdvisorAttendanceReturn {
    // Data
    members: AdvisorMember[];
    history: AttendanceHistoryEntry[];
    tutorName: string;
    isLoading: boolean;
    isHistoryLoading: boolean;
    isRefreshing: boolean;

    // Attendance form state
    selectedDate: string;
    setSelectedDate: (d: string) => void;
    startTime: string;
    setStartTime: (t: string) => void;
    endTime: string;
    setEndTime: (t: string) => void;
    attendanceRecords: Map<number, AttendanceRecord>;
    handleStatusChange: (studentId: number, status: AttendanceStatus) => void;
    handleMarkAllPresent: () => void;
    handleSaveAttendance: () => Promise<void>;

    // Attendance tab filters/pagination
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    statusFilter: "all" | AttendanceStatus;
    setStatusFilter: (s: "all" | AttendanceStatus) => void;
    currentPage: number;
    setCurrentPage: (p: number) => void;
    itemsPerPage: number;
    setItemsPerPage: (n: number) => void;
    filteredMembers: AdvisorMember[];
    paginatedMembers: AdvisorMember[];
    totalPages: number;
    presentCount: number;
    currentSessionPercentage: number;

    // History tab
    activeTab: string;
    setActiveTab: (t: string) => void;
    historySearchTerm: string;
    setHistorySearchTerm: (s: string) => void;
    historyDateRange: { from: string; to: string };
    setHistoryDateRange: (r: { from: string; to: string }) => void;
    activeDateFilter: "today" | "week" | "month" | null;
    setActiveDateFilter: (f: "today" | "week" | "month" | null) => void;
    historyPage: number;
    setHistoryPage: (p: number) => void;
    historyItemsPerPage: number;
    setHistoryItemsPerPage: (n: number) => void;
    filteredHistory: AttendanceHistoryEntry[];
    paginatedHistory: AttendanceHistoryEntry[];
    totalHistoryPages: number;
    setToday: () => void;
    setThisWeek: () => void;
    setThisMonth: () => void;

    // Derived stats
    latestPresent: number;
    overallAveragePercentage: number;
    attendanceColor: "green" | "amber" | "red";

    // Actions
    handleRefresh: () => Promise<void>;
    getStatusBadgeClass: (status: AttendanceStatus) => string;
}

export const useAdvisorAttendance = (): UseAdvisorAttendanceReturn => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { academicYear, isLoading: isConfigLoading } = useAcademicYear();

    const [members, setMembers] = useState<AdvisorMember[]>([]);
    const [history, setHistory] = useState<AttendanceHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [tutorName, setTutorName] = useState("");

    // Attendance form
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    });
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [attendanceRecords, setAttendanceRecords] = useState<Map<number, AttendanceRecord>>(new Map());

    // Attendance tab filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | AttendanceStatus>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Tabs
    const tabFromUrl = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(tabFromUrl === "history" ? "history" : "attendance");

    // History filters
    const [historySearchTerm, setHistorySearchTerm] = useState("");
    const [historyDateRange, setHistoryDateRange] = useState({ from: "", to: "" });
    const [activeDateFilter, setActiveDateFilter] = useState<"today" | "week" | "month" | null>(null);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyItemsPerPage, setHistoryItemsPerPage] = useState(10);

    useEffect(() => {
        if (tabFromUrl) setActiveTab(tabFromUrl);
    }, [tabFromUrl]);

    // Initial data fetch
    useEffect(() => {
        if (isConfigLoading) return;
        const fetchInitialData = async () => {
            try {
                const profileData = await getProfile();
                setTutorName(profileData.name);
                const membersResponse = await getMembers({
                    limit: 100,
                    status: "Aktif",
                    academicYear: academicYear.academicYear,
                });
                setMembers(membersResponse.data || []);
                setAttendanceRecords(new Map());
                const historyData = await getAttendanceHistory();
                setHistory(historyData);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                toast.error("Gagal memuat data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [isConfigLoading, academicYear]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch history when switching to history tab
    useEffect(() => {
        if (activeTab === "history") {
            const fetchHistory = async () => {
                setIsHistoryLoading(true);
                try {
                    const historyData = await getAttendanceHistory();
                    setHistory(historyData);
                } catch (e) {
                    console.log(e);
                } finally {
                    setIsHistoryLoading(false);
                }
            };
            fetchHistory();
        }
    }, [activeTab]);

    // Reset history page on filter change
    useEffect(() => {
        setHistoryPage(1);
    }, [historySearchTerm, historyDateRange, historyItemsPerPage]);

    const handleStatusChange = useCallback((studentId: number, status: AttendanceStatus) => {
        setAttendanceRecords((prev) => {
            const newMap = new Map(prev);
            newMap.set(studentId, { studentId, status });
            return newMap;
        });
    }, []);

    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            const matchesSearch =
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.nis.includes(searchTerm) ||
                member.class.toLowerCase().includes(searchTerm.toLowerCase());
            const record = attendanceRecords.get(member.id);
            const matchesStatus = statusFilter === "all" || record?.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, attendanceRecords, members]);

    const handleMarkAllPresent = useCallback(() => {
        setAttendanceRecords((prev) => {
            const newMap = new Map(prev);
            filteredMembers.forEach((member) => {
                newMap.set(member.id, { studentId: member.id, status: "hadir" });
            });
            return newMap;
        });
        toast.success("Semua siswa ditandai hadir.");
    }, [filteredMembers]);

    const paginatedMembers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMembers.slice(start, start + itemsPerPage);
    }, [filteredMembers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const filteredHistory = useMemo(() => {
        return history.filter((record) => {
            let matchesSearch = true;
            if (historySearchTerm) {
                const dateStr = formatDate(record.date, "dd MMMM yyyy").toLowerCase();
                matchesSearch = dateStr.includes(historySearchTerm.toLowerCase());
            }
            let matchesDateRange = true;
            if (historyDateRange.from && historyDateRange.to) {
                const d = new Date(record.date);
                matchesDateRange = d >= new Date(historyDateRange.from) && d <= new Date(historyDateRange.to);
            } else if (historyDateRange.from) {
                matchesDateRange = new Date(record.date) >= new Date(historyDateRange.from);
            } else if (historyDateRange.to) {
                matchesDateRange = new Date(record.date) <= new Date(historyDateRange.to);
            }
            return matchesSearch && matchesDateRange;
        });
    }, [historyDateRange, history, historySearchTerm]);

    const paginatedHistory = useMemo(() => {
        const start = (historyPage - 1) * historyItemsPerPage;
        return filteredHistory.slice(start, start + historyItemsPerPage);
    }, [filteredHistory, historyPage, historyItemsPerPage]);

    const totalHistoryPages = Math.ceil(filteredHistory.length / historyItemsPerPage);

    const presentCount = Array.from(attendanceRecords.values()).filter((r) => r.status === "hadir").length;
    const currentSessionPercentage = members.length > 0 ? Math.round((presentCount / members.length) * 100) : 0;
    const latestPresent = history[0]?.studentStats.present ?? 0;
    const overallAveragePercentage =
        history.length > 0
            ? Math.round(history.reduce((acc, curr) => acc + curr.studentStats.percentage, 0) / history.length)
            : 0;
    const attendanceColor: "green" | "amber" | "red" =
        overallAveragePercentage >= 90 ? "green" : overallAveragePercentage >= 75 ? "amber" : "red";

    const setToday = useCallback(() => {
        const today = new Date().toISOString().split("T")[0];
        setHistoryDateRange({ from: today, to: today });
        setActiveDateFilter("today");
    }, []);

    const setThisWeek = useCallback(() => {
        const today = new Date();
        const first = today.getDate() - today.getDay();
        const firstDay = new Date(today.setDate(first)).toISOString().split("T")[0];
        const lastDay = new Date(today.setDate(first + 6)).toISOString().split("T")[0];
        setHistoryDateRange({ from: firstDay, to: lastDay });
        setActiveDateFilter("week");
    }, []);

    const setThisMonth = useCallback(() => {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];
        setHistoryDateRange({ from: firstDay, to: lastDay });
        setActiveDateFilter("month");
    }, []);

    const handleSaveAttendance = useCallback(async () => {
        if (!selectedDate) {
            toast.error("Tanggal belum diisi", { description: "Silakan pilih tanggal pelaksanaan kegiatan." });
            return;
        }
        if (!startTime || !endTime) {
            toast.error("Waktu kegiatan tidak lengkap", { description: "Mohon lengkapi jam mulai dan jam selesai." });
            return;
        }
        const missingCount = members.length - attendanceRecords.size;
        if (missingCount > 0) {
            toast.error("Data presensi belum lengkap", { description: `Masih ada ${missingCount} siswa yang belum ditandai.` });
            return;
        }
        setIsSubmitting(true);
        try {
            const attendanceList = Array.from(attendanceRecords.entries()).map(([studentId, record]) => ({
                student_id: studentId,
                status: record.status,
                note: record.note,
            }));
            const payload: CreateAttendanceRequest = {
                date: selectedDate,
                start_time: startTime,
                end_time: endTime,
                topic: "Kegiatan Rutin",
                students: attendanceList,
            };
            await submitAttendance(payload);
            const presentCountLocal = attendanceList.filter((r) => r.status === "hadir").length;
            toast.success("Data Presensi Berhasil Disimpan", {
                description: `${presentCountLocal} dari ${members.length} siswa hadir`,
                duration: 5000,
            });
            const newHistory = await getAttendanceHistory();
            setHistory(newHistory);
            setAttendanceRecords(new Map());
            setStartTime("");
            setEndTime("");
        } catch (error) {
            console.error("Failed to submit attendance:", error);
            toast.error("Gagal menyimpan presensi");
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedDate, startTime, endTime, members, attendanceRecords]);

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        setIsRefreshing(true);
        try {
            const [membersData, historyData] = await Promise.all([
                getMembers({ limit: 50, status: "Aktif" }),
                getAttendanceHistory(),
            ]);
            setMembers(membersData.data);
            setHistory(historyData);
            setAttendanceRecords(new Map());
            const today = new Date();
            setSelectedDate(
                `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
            );
            toast.success("Halaman presensi telah di-refresh!");
        } catch {
            toast.error("Gagal merefresh data");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    const getStatusBadgeClass = useCallback((status: AttendanceStatus): string => {
        const map: Record<AttendanceStatus, string> = {
            hadir: "bg-green-100 text-green-700 border-green-200",
            sakit: "bg-yellow-100 text-yellow-700 border-yellow-200",
            izin: "bg-sky-100 text-sky-700 border-sky-200",
            alpa: "bg-red-100 text-red-700 border-red-200",
        };
        return map[status];
    }, []);

    // Suppress unused variable warning
    void isSubmitting;
    void router;

    return {
        members,
        history,
        tutorName,
        isLoading,
        isHistoryLoading,
        isRefreshing,
        selectedDate,
        setSelectedDate,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        attendanceRecords,
        handleStatusChange,
        handleMarkAllPresent,
        handleSaveAttendance,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        filteredMembers,
        paginatedMembers,
        totalPages,
        presentCount,
        currentSessionPercentage,
        activeTab,
        setActiveTab,
        historySearchTerm,
        setHistorySearchTerm,
        historyDateRange,
        setHistoryDateRange,
        activeDateFilter,
        setActiveDateFilter,
        historyPage,
        setHistoryPage,
        historyItemsPerPage,
        setHistoryItemsPerPage,
        filteredHistory,
        paginatedHistory,
        totalHistoryPages,
        setToday,
        setThisWeek,
        setThisMonth,
        latestPresent,
        overallAveragePercentage,
        attendanceColor,
        handleRefresh,
        getStatusBadgeClass,
    };
};
