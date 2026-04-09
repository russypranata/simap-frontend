import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getAchievements,
    getParentChildren,
    type AchievementRecord,
    type ChildInfo,
} from "../services/parentAchievementsService";

export const useParentAchievements = () => {
    // Core Data
    const [children, setChildren] = useState<ChildInfo[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [allRecords, setAllRecords] = useState<AchievementRecord[]>([]);
    
    // Filters
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [selectedLevel, setSelectedLevel] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    
    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Selected View Detail
    const [selectedAchievement, setSelectedAchievement] = useState<AchievementRecord | null>(null);

    // 1. Initial Fetch for Children
    useEffect(() => {
        const init = async () => {
            try {
                const childrenData = await getParentChildren();
                setChildren(childrenData);
                if (childrenData.length > 0) {
                    setSelectedChildId(childrenData[0].id);
                }
            } catch {
                setError("Gagal memuat profil anak.");
                setIsLoading(false);
            }
        };
        init();
    }, []);

    // 2. Fetch Records when Child Changes
    const fetchRecords = useCallback(async () => {
        if (!selectedChildId) return;

        const isInitial = allRecords.length === 0 && isLoading;
        if (!isInitial) {
            setIsFetching(true);
        }
        setError(null);

        try {
            const data = await getAchievements(selectedChildId);
            setAllRecords(data);
            
            // Note: Unlike attendance, achievements are cumulative,
            // we often want to show "Semua Tahun Ajaran" by default unless requested otherwise.
            // Leaving academicYear as "all" by default is usually preferred for achievements.
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat daftar prestasi.";
            setError(message);
            setAllRecords([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
            setCurrentPage(1); // Reset page on new data
        }
    }, [selectedChildId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (selectedChildId) {
            fetchRecords();
        }
    }, [fetchRecords]); // eslint-disable-line react-hooks/exhaustive-deps

    const refetch = useCallback(() => {
        fetchRecords();
    }, [fetchRecords]);

    // 3. Extract Uniques for Dropdowns
    const academicYears = useMemo(() => {
        const unique = new Set(allRecords.map(r => r.academicYearId));
        return Array.from(unique).sort((a, b) => b.localeCompare(a));
    }, [allRecords]);

    // 4a. Records filtered by Academic Year only (for stats)
    const yearFilteredRecords = useMemo(() => {
        if (selectedAcademicYear === "all") return allRecords;
        return allRecords.filter(r => r.academicYearId === selectedAcademicYear);
    }, [allRecords, selectedAcademicYear]);

    // 4b. Client-side Filtering (year + level + search for list)
    const filteredRecords = useMemo(() => {
        return yearFilteredRecords.filter(record => {
            const matchesLevel = selectedLevel === "all" || record.level === selectedLevel;
            const matchesSearch = 
                record.competitionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.eventName.toLowerCase().includes(searchQuery.toLowerCase());
                
            return matchesLevel && matchesSearch;
        });
    }, [yearFilteredRecords, selectedLevel, searchQuery]);

    // Calculate Statistics based on year-filtered records
    const stats = useMemo(() => {
        const totalAchievements = yearFilteredRecords.length;
        const nationalAchievements = yearFilteredRecords.filter((a) => a.level === "Nasional" || a.level === "Internasional").length;
        const firstPlaceCount = yearFilteredRecords.filter((a) => a.rank === "Juara 1").length;

        return {
            totalAchievements,
            nationalAchievements,
            firstPlaceCount
        };
    }, [yearFilteredRecords]);

    // Pagination
    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

    const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
    const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedLevel, selectedAcademicYear, searchQuery]);

    // Helper for forcing fetching UI (used by UI components mimicking loading on filter change)
    const triggerFetchingOverlay = () => {
        setIsFetching(true);
        setTimeout(() => setIsFetching(false), 300);
    };

    return {
        // Data & State
        children,
        selectedChildId,
        setSelectedChildId,
        paginatedRecords,
        
        // Context/Meta
        academicYears,
        stats,
        
        // Filter States
        selectedLevel, setSelectedLevel,
        selectedAcademicYear, setSelectedAcademicYear,
        searchQuery, setSearchQuery,

        // Modal State
        selectedAchievement, setSelectedAchievement,

        // Pagination State
        currentPage,
        totalPages,
        itemsPerPage,
        setItemsPerPage,
        filteredTotal: filteredRecords.length,
        startIndexDisplay: filteredRecords.length === 0 ? 0 : startIndex + 1,
        endIndexDisplay: Math.min(endIndex, filteredRecords.length),
        
        // Actions
        goToPage,
        goToNextPage,
        goToPrevPage,
        refetch,
        triggerFetchingOverlay,

        // Status
        isLoading,
        isFetching,
        error
    };
};
