import { useState, useEffect, useMemo, useCallback } from "react";
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
    // Filters
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    statusFilter: string;
    setStatusFilter: (s: string) => void;
    classFilter: string;
    setClassFilter: (s: string) => void;
    uniqueClasses: string[];
    // Pagination
    currentPage: number;
    setCurrentPage: (p: number) => void;
    itemsPerPage: number;
    filteredStudents: AttendanceDetail["students"];
    paginatedStudents: AttendanceDetail["students"];
    totalPages: number;
}

const DEFAULT_STATS: AttendanceStats = { present: 0, sick: 0, permit: 0, absent: 0, total: 0, percentage: 0 };

export const useAdvisorAttendanceDetail = (id: number): UseAdvisorAttendanceDetailReturn => {
    const [detail, setDetail] = useState<AttendanceDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [extracurricularName, setExtracurricularName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [classFilter, setClassFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const [data, profileData] = await Promise.all([
                getAttendanceDetail(id),
                getProfile(),
            ]);
            setDetail(data);
            setExtracurricularName(profileData.extracurricular ?? "");
        } catch {
            toast.error("Gagal memuat detail presensi");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const students = detail?.students || [];

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
        extracurricularName,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        classFilter, setClassFilter,
        uniqueClasses,
        currentPage, setCurrentPage, itemsPerPage,
        filteredStudents, paginatedStudents, totalPages,
    };
};
