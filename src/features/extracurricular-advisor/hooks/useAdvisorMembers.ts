import { useState, useEffect, useCallback } from "react";
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

    // Pagination
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    setItemsPerPage: (n: number) => void;
    startIndex: number;
    endIndex: number;

    // Filters
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    classFilter: string;
    setClassFilter: (c: string) => void;

    // Detail dialog
    isDetailDialogOpen: boolean;
    setIsDetailDialogOpen: (open: boolean) => void;
    selectedMember: AdvisorMember | null;
    isDetailLoading: boolean;
    handleViewDetail: (member: AdvisorMember) => void;
}

export const useAdvisorMembers = (): UseAdvisorMembersReturn => {
    const { academicYear, isLoading: isConfigLoading } = useAcademicYear();

    const [members, setMembers] = useState<AdvisorMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isStatsLoading, setIsStatsLoading] = useState(true);
    const [stats, setStats] = useState<MembersStats>({
        totalMembers: 0,
        avgAttendance: 0,
        topPerformers: 0,
        needsAttention: 0,
    });

    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<AdvisorMember | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 500);

    // Fetch members list
    useEffect(() => {
        if (isConfigLoading) return;
        const fetchMembers = async () => {
            try {
                setIsLoading(true);
                const response = await getMembers({
                    page: currentPage,
                    limit: itemsPerPage,
                    search: debouncedSearch,
                    class: classFilter,
                    academicYear: academicYear.academicYear,
                    status: "Aktif",
                });
                setMembers(response.data || []);
                if (response.meta) {
                    setTotalPages(response.meta.totalPages);
                    setTotalItems(response.meta.totalItems);
                }
            } catch (error) {
                console.error("Failed to fetch members:", error);
                setMembers([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMembers();
    }, [currentPage, debouncedSearch, classFilter, academicYear.academicYear, itemsPerPage, isConfigLoading]);

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, classFilter, academicYear.academicYear]);

    // Fetch stats
    useEffect(() => {
        if (isConfigLoading) return;
        const fetchStats = async () => {
            try {
                setIsStatsLoading(true);
                const data = await getDashboardStats({
                    academicYear: academicYear.academicYear,
                    semester: academicYear.semester,
                });
                setStats({
                    totalMembers: data.totalMembers,
                    avgAttendance: data.averageAttendance,
                    topPerformers: data.activeStudents,
                    needsAttention: data.needsAttention,
                });
            } catch (e) {
                console.error("Stats fetch error", e);
            } finally {
                setIsStatsLoading(false);
            }
        };
        fetchStats();
    }, [academicYear.academicYear, academicYear.semester, isConfigLoading]);

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
        isLoading,
        isStatsLoading,
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
