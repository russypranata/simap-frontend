import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAttendanceDetail, type AttendanceDetail } from "../services/advisorAttendanceService";
import { getProfile } from "../services/advisorProfileService";

interface AttendanceStats {
    present: number;
    sick: number;
    permit: number;
    absent: number;
    total: number;
    percentage: number;
}

interface UseAdvisorAttendanceDetailReturn {
    detail: AttendanceDetail | null;
    stats: AttendanceStats;
    isLoading: boolean;
    extracurricularName: string;
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    statusFilter: string;
    setStatusFilter: (s: string) => void;
    classFilter: string;
    setClassFilter: (s: string) => void;
    uniqueClasses: string[];
    currentPage: number;
    setCurrentPage: (p: number) => void;
    itemsPerPage: number;
    filteredStudents: AttendanceDetail["students"];
    paginatedStudents: AttendanceDetail["students"];
    totalPages: number;
}

const DEFAULT_STATS: AttendanceStats = { present: 0, sick: 0, permit: 0, absent: 0, total: 0, percentage: 0 };

export const useAdvisorAttendanceDetail = (id: number): UseAdvisorAttendanceDetailReturn => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [classFilter, setClassFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const detailQuery = useQuery({
        queryKey: ["advisor-attendance-detail", id],
        queryFn: () => getAttendanceDetail(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });

    const profileQuery = useQuery({
        queryKey: ["advisor-profile"],
        queryFn: getProfile,
        staleTime: 30 * 60 * 1000,
    });

    // Show error toast jika fetch gagal
    useEffect(() => {
        if (detailQuery.isError) toast.error("Gagal memuat detail presensi");
    }, [detailQuery.isError]);

    const detail = detailQuery.data ?? null;
    const students = detail?.students ?? [];
    const isLoading = detailQuery.isLoading || profileQuery.isLoading;

    const uniqueClasses = useMemo(
        () => [...new Set(students.map((s) => s.class))].sort(),
        [students]
    );

    const stats = useMemo<AttendanceStats>(() => {
        if (!detail) return DEFAULT_STATS;
        return {
            present: students.filter((s) => s.status === "hadir").length,
            sick: students.filter((s) => s.status === "sakit").length,
            permit: students.filter((s) => s.status === "izin").length,
            absent: students.filter((s) => s.status === "alpa").length,
            total: students.length,
            percentage: detail.studentStats.percentage,
        };
    }, [detail, students]);

    const filteredStudents = useMemo(() =>
        students.filter((s) => {
            const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.nis.includes(searchTerm);
            const matchStatus = statusFilter === "all" || s.status === statusFilter;
            const matchClass = classFilter === "all" || s.class === classFilter;
            return matchSearch && matchStatus && matchClass;
        }),
        [students, searchTerm, statusFilter, classFilter]
    );

    // Reset page on filter change
    useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, classFilter]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredStudents.slice(start, start + itemsPerPage);
    }, [filteredStudents, currentPage, itemsPerPage]);

    return {
        detail, stats, isLoading,
        extracurricularName: profileQuery.data?.extracurricular ?? "",
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        classFilter, setClassFilter,
        uniqueClasses,
        currentPage, setCurrentPage, itemsPerPage,
        filteredStudents, paginatedStudents, totalPages,
    };
};
