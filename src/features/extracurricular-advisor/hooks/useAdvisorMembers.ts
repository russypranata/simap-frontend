import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAcademicYear } from "@/context/AcademicYearContext";
import { useDebounce } from "@/hooks/use-debounce";
import {
    getMembers,
    getMemberDetail,
    type AdvisorMember,
} from "../services/advisorMembersService";
import { getDashboardStats } from "../services/advisorDashboardService";

interface MembersStats {
    totalMembers: number;
    avgAttendance: number;
    topPerformers: number;
    needsAttention: number;
}

interface UseAdvisorMembersReturn {
    members: AdvisorMember[];
    stats: MembersStats;
    isLoading: boolean;
    isStatsLoading: boolean;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    setItemsPerPage: (n: number) => void;
    startIndex: number;
    endIndex: number;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    classFilter: string;
    setClassFilter: (c: string) => void;
    isDetailDialogOpen: boolean;
    setIsDetailDialogOpen: (open: boolean) => void;
    selectedMember: AdvisorMember | null;
    isDetailLoading: boolean;
    handleViewDetail: (member: AdvisorMember) => void;
}

const DEFAULT_STATS: MembersStats = {
    totalMembers: 0,
    avgAttendance: 0,
    topPerformers: 0,
    needsAttention: 0,
};

export const useAdvisorMembers = (): UseAdvisorMembersReturn => {
    const { academicYear } = useAcademicYear();
    const ay = academicYear.academicYear;
    const semester = academicYear.semester;

    const [searchQuery, setSearchQueryRaw] = useState("");
    const [classFilter, setClassFilterRaw] = useState("all");
    const [currentPage, setCurrentPageRaw] = useState(1);
    const [itemsPerPage, setItemsPerPageRaw] = useState(10);

    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<AdvisorMember | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 500);

    // Reset page saat filter berubah
    const setSearchQuery = useCallback((q: string) => {
        setSearchQueryRaw(q);
        setCurrentPageRaw(1);
    }, []);
    const setClassFilter = useCallback((c: string) => {
        setClassFilterRaw(c);
        setCurrentPageRaw(1);
    }, []);
    const setItemsPerPage = useCallback((n: number) => {
        setItemsPerPageRaw(n);
        setCurrentPageRaw(1);
    }, []);
    const setCurrentPage = useCallback((p: number) => setCurrentPageRaw(p), []);

    const membersQuery = useQuery({
        queryKey: ["advisor-members", ay, debouncedSearch, classFilter, currentPage, itemsPerPage],
        queryFn: () => getMembers({
            page: currentPage,
            limit: itemsPerPage,
            search: debouncedSearch,
            class: classFilter,
            academicYear: ay,
            status: "Aktif",
        }),
        placeholderData: (prev) => prev, // keep previous data saat filter berubah (no flicker)
    });

    const statsQuery = useQuery({
        queryKey: ["advisor-members-stats", ay, semester],
        queryFn: () => getDashboardStats({ academicYear: ay, semester }),
        staleTime: 5 * 60 * 1000,
    });

    const members = membersQuery.data?.data ?? [];
    const totalItems = membersQuery.data?.meta?.totalItems ?? 0;
    const totalPages = membersQuery.data?.meta?.totalPages ?? 1;

    const rawStats = statsQuery.data;
    const stats: MembersStats = rawStats
        ? {
            totalMembers: rawStats.totalMembers,
            avgAttendance: rawStats.averageAttendance,
            topPerformers: rawStats.activeStudents,
            needsAttention: rawStats.needsAttention,
        }
        : DEFAULT_STATS;

    const handleViewDetail = useCallback(async (member: AdvisorMember) => {
        setIsDetailDialogOpen(true);
        setSelectedMember(null);
        setIsDetailLoading(true);
        try {
            const detail = await getMemberDetail(member.id);
            setSelectedMember(detail);
        } catch (error) {
            console.error("Failed to fetch member detail:", error);
        } finally {
            setIsDetailLoading(false);
        }
    }, []);

    const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    return {
        members,
        stats,
        isLoading: membersQuery.isLoading,
        isStatsLoading: statsQuery.isLoading,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        setItemsPerPage,
        startIndex,
        endIndex,
        searchQuery,
        setSearchQuery,
        classFilter,
        setClassFilter,
        isDetailDialogOpen,
        setIsDetailDialogOpen,
        selectedMember,
        isDetailLoading,
        handleViewDetail,
    };
};
