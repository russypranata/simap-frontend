import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAchievements, getParentChildren, type AchievementRecord, type ChildInfo } from "../services/parentAchievementsService";

export const useParentAchievements = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [selectedLevel, setSelectedLevel] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedAchievement, setSelectedAchievement] = useState<AchievementRecord | null>(null);

    const childrenQuery = useQuery<ChildInfo[]>({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
        staleTime: 5 * 60 * 1000,
    });

    const children = childrenQuery.data ?? [];
    const effectiveChildId = selectedChildId || children[0]?.id || "";

    const achievementsQuery = useQuery<AchievementRecord[]>({
        queryKey: ["parent-achievements", effectiveChildId],
        queryFn: () => getAchievements(effectiveChildId),
        enabled: !!effectiveChildId,
        staleTime: 2 * 60 * 1000,
    });

    const allRecords = achievementsQuery.data ?? [];

    const academicYears = useMemo(() => {
        const unique = new Set(allRecords.map(r => r.academicYearId));
        return Array.from(unique).sort((a, b) => b.localeCompare(a));
    }, [allRecords]);

    const yearFilteredRecords = useMemo(() =>
        selectedAcademicYear === "all" ? allRecords : allRecords.filter(r => r.academicYearId === selectedAcademicYear),
        [allRecords, selectedAcademicYear]
    );

    const filteredRecords = useMemo(() =>
        yearFilteredRecords.filter(r => {
            const matchesLevel = selectedLevel === "all" || r.level === selectedLevel;
            const matchesSearch = !searchQuery ||
                r.competitionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.eventName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesLevel && matchesSearch;
        }),
        [yearFilteredRecords, selectedLevel, searchQuery]
    );

    const stats = useMemo(() => ({
        totalAchievements: yearFilteredRecords.length,
        nationalAchievements: yearFilteredRecords.filter(a => a.level === "Nasional" || a.level === "Internasional").length,
        firstPlaceCount: yearFilteredRecords.filter(a => a.rank === "Juara 1").length,
    }), [yearFilteredRecords]);

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    const error = childrenQuery.error instanceof Error
        ? childrenQuery.error.message
        : achievementsQuery.error instanceof Error
        ? achievementsQuery.error.message
        : null;

    return {
        children,
        selectedChildId: effectiveChildId,
        setSelectedChildId,
        paginatedRecords,
        academicYears,
        stats,
        selectedLevel, setSelectedLevel,
        selectedAcademicYear,
        setSelectedAcademicYear: (val: string) => { setSelectedAcademicYear(val); setCurrentPage(1); },
        searchQuery, setSearchQuery,
        selectedAchievement, setSelectedAchievement,
        currentPage,
        totalPages,
        itemsPerPage,
        setItemsPerPage: (val: number) => { setItemsPerPage(val); setCurrentPage(1); },
        filteredTotal: filteredRecords.length,
        startIndexDisplay: filteredRecords.length === 0 ? 0 : startIndex + 1,
        goToPage: (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
        isLoading: childrenQuery.isLoading || (!!effectiveChildId && achievementsQuery.isLoading),
        isFetching: childrenQuery.isFetching || achievementsQuery.isFetching,
        error,
        refetch: () => achievementsQuery.refetch(),
        triggerFetchingOverlay: () => {},
    };
};
