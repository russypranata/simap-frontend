import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getExtracurricularData,
    getParentChildren,
    type Extracurricular,
    type ExtracurricularAttendance,
    type ChildInfo,
} from "../services/parentExtracurricularAttendanceService";

export const useParentExtracurricularAttendance = () => {
    // Core Data
    const [children, setChildren] = useState<ChildInfo[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [allExtracurriculars, setAllExtracurriculars] = useState<Extracurricular[]>([]);
    const [allAttendance, setAllAttendance] = useState<ExtracurricularAttendance[]>([]);

    // Filters
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [filterActivity, setFilterActivity] = useState<string>("all");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

        const isInitial = allAttendance.length === 0 && isLoading;
        if (!isInitial) {
            setIsFetching(true);
        }
        setError(null);

        try {
            const data = await getExtracurricularData(selectedChildId);
            setAllExtracurriculars(data.extracurriculars);
            setAllAttendance(data.recentAttendance);

            // Auto-select latest academic year on load
            if (data.extracurriculars.length > 0) {
                const years = [...new Set(data.extracurriculars.map(e => e.academicYearId))];
                const latest = years.sort((a, b) => b.localeCompare(a))[0];
                if (latest) {
                    setSelectedAcademicYear(latest);
                }
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat data ekstrakurikuler.";
            setError(message);
            setAllExtracurriculars([]);
            setAllAttendance([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
            setCurrentPage(1);
        }
    }, [selectedChildId]);

    useEffect(() => {
        if (selectedChildId) {
            fetchRecords();
        }
    }, [fetchRecords]);

    const refetch = useCallback(() => {
        fetchRecords();
    }, [fetchRecords]);

    // 3. Extract academic years for dropdown
    const academicYears = useMemo(() => {
        const unique = new Set(allExtracurriculars.map(e => e.academicYearId));
        return Array.from(unique).sort((a, b) => b.localeCompare(a)); // newest first
    }, [allExtracurriculars]);

    // 4. Filter extracurriculars by academic year
    const extracurriculars = useMemo(() => {
        if (selectedAcademicYear === "all") return allExtracurriculars;
        return allExtracurriculars.filter(e => e.academicYearId === selectedAcademicYear);
    }, [allExtracurriculars, selectedAcademicYear]);

    // 5. Derived Stats (based on filtered ekskul for selected year)
    const stats = useMemo(() => {
        const uniqueEkskulNames = new Set(extracurriculars.map(e => e.name));
        const totalEkskul = uniqueEkskulNames.size;
        const avgAttendance = extracurriculars.length > 0
            ? Math.round(extracurriculars.reduce((sum, e) => sum + e.attendanceRate, 0) / extracurriculars.length)
            : 0;
        const totalAchievements = extracurriculars.reduce((sum, e) => sum + (e.achievements?.length || 0), 0);

        return { totalEkskul, avgAttendance, totalAchievements };
    }, [extracurriculars]);

    // 5.5 Unique activities for filter dropdown
    const uniqueActivitiesList = useMemo(() => {
        const unique = new Set(extracurriculars.map(e => e.name));
        return Array.from(unique).sort();
    }, [extracurriculars]);

    // 6. Filter attendance by academic year + activity
    const filteredAttendance = useMemo(() => {
        return allAttendance.filter(record => {
            const matchesYear = selectedAcademicYear === "all" || record.academicYearId === selectedAcademicYear;
            
            let matchesActivity = true;
            if (filterActivity !== "all") {
                // record.activity format is "Ekskul Name - Activity Form"
                // e.g. "Pramuka - Latihan Rutin".
                // We split by " - " and match exactly the first part to avoid partial match bugs 
                // between "Basket" and "Mini Basket" or "Pra" and "Pramuka".
                const ekskulNameRaw = record.activity.split(" - ")[0].trim().toLowerCase();
                matchesActivity = ekskulNameRaw === filterActivity.toLowerCase();
            }

            return matchesYear && matchesActivity;
        });
    }, [allAttendance, selectedAcademicYear, filterActivity]);

    // 7. Pagination
    const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAttendance = filteredAttendance.slice(startIndex, endIndex);

    const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
    const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedAcademicYear, filterActivity]);

    // Reset activity filter when academic year changes (ekskul list changes per year)
    useEffect(() => {
        setFilterActivity("all");
    }, [selectedAcademicYear]);

    // Helper for fetching overlay
    const triggerFetchingOverlay = () => {
        setIsFetching(true);
        setTimeout(() => setIsFetching(false), 300);
    };

    const handleFilterChange = (val: string) => {
        setFilterActivity(val);
        triggerFetchingOverlay();
    };

    const handleAcademicYearChange = (val: string) => {
        setSelectedAcademicYear(val);
        triggerFetchingOverlay();
    };

    return {
        // Data & State
        children,
        selectedChildId,
        setSelectedChildId,
        extracurriculars,
        paginatedAttendance,

        // Stats
        stats,

        // Filter
        academicYears,
        selectedAcademicYear,
        handleAcademicYearChange,
        uniqueActivitiesList,
        filterActivity,
        handleFilterChange,

        // Pagination
        currentPage,
        totalPages,
        itemsPerPage,
        setItemsPerPage,
        filteredTotal: filteredAttendance.length,
        startIndexDisplay: filteredAttendance.length === 0 ? 0 : startIndex + 1,
        endIndexDisplay: Math.min(endIndex, filteredAttendance.length),

        // Actions
        goToPage,
        goToNextPage,
        goToPrevPage,
        refetch,
        triggerFetchingOverlay,

        // Status
        isLoading,
        isFetching,
        error,
    };
};
