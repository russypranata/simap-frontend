import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
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
    members: AdvisorMember[];
    history: AttendanceHistoryEntry[];
    tutorName: string;
    extracurricularName: string;
    isLoading: boolean;
    isHistoryLoading: boolean;
    isRefreshing: boolean;
    selectedDate: string;
    setSelectedDate: (d: string) => void;
    startTime: string;
    setStartTime: (t: string) => void;
    endTime: string;
    setEndTime: (t: string) => void;
    topic: string;
    setTopic: (t: string) => void;
    attendanceRecords: Map<number, AttendanceRecord>;
    handleStatusChange: (studentId: number, status: AttendanceStatus) => void;
    handleMarkAllPresent: () => void;
    handleSaveAttendance: () => Promise<void>;
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
    latestPresent: number;
    overallAveragePercentage: number;
    attendanceColor: "green" | "amber" | "red";
    handleRefresh: () => Promise<void>;
    getStatusBadgeClass: (status: AttendanceStatus) => string;
    error: string | null;
}

const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const useAdvisorAttendance = (): UseAdvisorAttendanceReturn => {
    const searchParams = useSearchParams();
    const { academicYear } = useAcademicYear();
    const queryClient = useQueryClient();

    // ── Server state (TanStack Query) ──────────────────────────────────────
    const profileQuery = useQuery({
        queryKey: ["advisor-profile"],
        queryFn: getProfile,
        staleTime: 5 * 60 * 1000,
    });

    const membersQuery = useQuery({
        queryKey: ["advisor-attendance-members", academicYear.academicYear],
        queryFn: () => getMembers({ limit: 100, status: "Aktif", academicYear: academicYear.academicYear }),
        staleTime: 2 * 60 * 1000,
    });

    const historyQuery = useQuery({
        queryKey: ["advisor-attendance-history"],
        queryFn: () => getAttendanceHistory(),
        staleTime: 1 * 60 * 1000,
    });

    // ── Local UI state ─────────────────────────────────────────────────────
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [topic, setTopic] = useState("");
    const [attendanceRecords, setAttendanceRecords] = useState<Map<number, AttendanceRecord>>(new Map());
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | AttendanceStatus>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "history" ? "history" : "attendance");
    const [historySearchTerm, setHistorySearchTerm] = useState("");
    const [historyDateRange, setHistoryDateRange] = useState({ from: "", to: "" });
    const [activeDateFilter, setActiveDateFilter] = useState<"today" | "week" | "month" | null>(null);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyItemsPerPage, setHistoryItemsPerPage] = useState(10);

    const members = useMemo(() => membersQuery.data?.data ?? [], [membersQuery.data?.data]);
    const history = useMemo(() => historyQuery.data ?? [], [historyQuery.data]);
    const tutorName = profileQuery.data?.name ?? "";
    const extracurricularName = profileQuery.data?.extracurricular ?? "";
    const isLoading = membersQuery.isLoading || profileQuery.isLoading;
    const isHistoryLoading = historyQuery.isLoading;
    const error = membersQuery.error instanceof Error ? membersQuery.error.message
        : profileQuery.error instanceof Error ? profileQuery.error.message
        : null;

    // ── Derived / memoized ─────────────────────────────────────────────────
    const filteredMembers = useMemo(() => members.filter((m) => {
        const matchesSearch =
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.nis.includes(searchTerm) ||
            m.class.toLowerCase().includes(searchTerm.toLowerCase());
        const record = attendanceRecords.get(m.id);
        const matchesStatus = statusFilter === "all" || record?.status === statusFilter;
        return matchesSearch && matchesStatus;
    }), [members, searchTerm, statusFilter, attendanceRecords]);

    const paginatedMembers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMembers.slice(start, start + itemsPerPage);
    }, [filteredMembers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    const filteredHistory = useMemo(() => history.filter((record) => {
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
    }), [history, historySearchTerm, historyDateRange]);

    const paginatedHistory = useMemo(() => {
        const start = (historyPage - 1) * historyItemsPerPage;
        return filteredHistory.slice(start, start + historyItemsPerPage);
    }, [filteredHistory, historyPage, historyItemsPerPage]);

    const totalHistoryPages = Math.ceil(filteredHistory.length / historyItemsPerPage);
    const presentCount = Array.from(attendanceRecords.values()).filter((r) => r.status === "hadir").length;
    const currentSessionPercentage = members.length > 0 ? Math.round((presentCount / members.length) * 100) : 0;
    const latestPresent = history[0]?.studentStats.present ?? 0;
    const overallAveragePercentage = history.length > 0
        ? Math.round(history.reduce((acc, curr) => acc + curr.studentStats.percentage, 0) / history.length)
        : 0;
    const attendanceColor: "green" | "amber" | "red" =
        overallAveragePercentage >= 90 ? "green" : overallAveragePercentage >= 75 ? "amber" : "red";

    // ── Actions ────────────────────────────────────────────────────────────
    const handleStatusChange = useCallback((studentId: number, status: AttendanceStatus) => {
        setAttendanceRecords((prev) => {
            const next = new Map(prev);
            next.set(studentId, { studentId, status });
            return next;
        });
    }, []);

    const handleMarkAllPresent = useCallback(() => {
        setAttendanceRecords((prev) => {
            const next = new Map(prev);
            filteredMembers.forEach((m) => next.set(m.id, { studentId: m.id, status: "hadir" }));
            return next;
        });
        toast.success("Semua siswa ditandai hadir.");
    }, [filteredMembers]);

    const handleSaveAttendance = useCallback(async () => {
        if (!selectedDate) { toast.error("Tanggal belum diisi"); return; }
        if (!startTime || !endTime) { toast.error("Waktu kegiatan tidak lengkap"); return; }
        const missingCount = members.length - attendanceRecords.size;
        if (missingCount > 0) { toast.error("Data presensi belum lengkap", { description: `Masih ada ${missingCount} siswa yang belum ditandai.` }); return; }

        try {
            const payload: CreateAttendanceRequest = {
                date: selectedDate,
                start_time: startTime,
                end_time: endTime,
                topic: topic || undefined,
                students: Array.from(attendanceRecords.entries()).map(([studentId, r]) => ({
                    student_id: studentId, status: r.status, note: r.note,
                })),
            };
            await submitAttendance(payload);
            const presentCountLocal = payload.students.filter((r) => r.status === "hadir").length;
            toast.success("Presensi Berhasil Disimpan", {
                description: `${presentCountLocal} dari ${members.length} siswa hadir`,
            });
            // Invalidate cache supaya history otomatis refetch
            queryClient.invalidateQueries({ queryKey: ["advisor-attendance-history"] });
            setAttendanceRecords(new Map());
            setStartTime("");
            setEndTime("");
            setTopic("");
        } catch {
            toast.error("Gagal menyimpan presensi");
        }
    }, [selectedDate, startTime, endTime, topic, members, attendanceRecords, queryClient]);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["advisor-attendance-members"] }),
                queryClient.invalidateQueries({ queryKey: ["advisor-attendance-history"] }),
            ]);
            setAttendanceRecords(new Map());
            setSelectedDate(todayStr());
            toast.success("Data berhasil di-refresh");
        } catch {
            toast.error("Gagal merefresh data");
        } finally {
            setIsRefreshing(false);
        }
    }, [queryClient]);

    const setToday = useCallback(() => {
        const today = new Date().toISOString().split("T")[0];
        setHistoryDateRange({ from: today, to: today });
        setActiveDateFilter("today");
        setHistoryPage(1);
    }, []);

    const setThisWeek = useCallback(() => {
        const today = new Date();
        const first = today.getDate() - today.getDay();
        const firstDay = new Date(today.setDate(first)).toISOString().split("T")[0];
        const lastDay = new Date(today.setDate(first + 6)).toISOString().split("T")[0];
        setHistoryDateRange({ from: firstDay, to: lastDay });
        setActiveDateFilter("week");
        setHistoryPage(1);
    }, []);

    const setThisMonth = useCallback(() => {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];
        setHistoryDateRange({ from: firstDay, to: lastDay });
        setActiveDateFilter("month");
        setHistoryPage(1);
    }, []);

    const getStatusBadgeClass = useCallback((status: AttendanceStatus): string => ({
        hadir: "bg-green-100 text-green-700 border-green-200",
        sakit: "bg-yellow-100 text-yellow-700 border-yellow-200",
        izin: "bg-sky-100 text-sky-700 border-sky-200",
        alpa: "bg-red-100 text-red-700 border-red-200",
    }[status]), []);

    return {
        members, history, tutorName, extracurricularName, isLoading, isHistoryLoading, isRefreshing,
        selectedDate, setSelectedDate, startTime, setStartTime, endTime, setEndTime,
        topic, setTopic,
        attendanceRecords, handleStatusChange, handleMarkAllPresent, handleSaveAttendance,
        searchTerm, setSearchTerm, statusFilter, setStatusFilter,
        currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
        filteredMembers, paginatedMembers, totalPages, presentCount, currentSessionPercentage,
        activeTab, setActiveTab, historySearchTerm, setHistorySearchTerm,
        historyDateRange, setHistoryDateRange, activeDateFilter, setActiveDateFilter,
        historyPage, setHistoryPage, historyItemsPerPage, setHistoryItemsPerPage,
        filteredHistory, paginatedHistory, totalHistoryPages,
        setToday, setThisWeek, setThisMonth,
        latestPresent, overallAveragePercentage, attendanceColor,
        handleRefresh, getStatusBadgeClass,
        error,
    };
};
