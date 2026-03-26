import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getBehaviorData,
    getParentChildren,
    type ViolationRecord,
    type ChildInfo,
} from "../services/parentBehaviorService";

export const useParentBehavior = () => {
    // Core Data
    const [children, setChildren] = useState<ChildInfo[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [allRecords, setAllRecords] = useState<ViolationRecord[]>([]);

    // Filters
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [locationFilter, setLocationFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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

        const isInitial = allRecords.length === 0 && isLoading;
        if (!isInitial) {
            setIsFetching(true);
        }
        setError(null);

        try {
            const data = await getBehaviorData(selectedChildId);
            setAllRecords(data.records);

            // Auto-select latest academic year on load if records exist
            if (data.records.length > 0) {
                const years = [...new Set(data.records.map(r => r.academicYearId))];
                const latest = years.sort((a, b) => b.localeCompare(a))[0];
                if (latest) {
                    setSelectedAcademicYear(latest);
                }
            } else {
                setSelectedAcademicYear("all");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat catatan perilaku.";
            setError(message);
            setAllRecords([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
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
        const unique = new Set(allRecords.map(r => r.academicYearId));
        return Array.from(unique).sort((a, b) => b.localeCompare(a)); // newest first
    }, [allRecords]);

    // 4. Pre-filter by academic year for calculating top stats
    const recordsForYear = useMemo(() => {
        if (selectedAcademicYear === "all") return allRecords;
        return allRecords.filter(r => r.academicYearId === selectedAcademicYear);
    }, [allRecords, selectedAcademicYear]);

    // 5. Derived Stats (based on academic year selection)
    const stats = useMemo(() => {
        const totalViolations = recordsForYear.length;
        const schoolViolations = recordsForYear.filter(r => r.location === "sekolah").length;
        const dormViolations = recordsForYear.filter(r => r.location === "asrama").length;

        return { totalViolations, schoolViolations, dormViolations };
    }, [recordsForYear]);

    // 6. Filter for the list/table (Year + Location)
    const filteredRecords = useMemo(() => {
        return recordsForYear.filter(record => {
            return locationFilter === "all" || record.location === locationFilter;
        });
    }, [recordsForYear, locationFilter]);

    // 7. Pagination Logic
    const totalItems = filteredRecords.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const showPagination = totalItems > 10;

    const pagedRecords = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRecords.slice(start, start + itemsPerPage);
    }, [filteredRecords, currentPage]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedChildId, selectedAcademicYear, locationFilter]);

    // Reset location filter when year changes
    useEffect(() => {
        setLocationFilter("all");
    }, [selectedAcademicYear]);

    // Helper for fetching overlay
    const triggerFetchingOverlay = () => {
        setIsFetching(true);
        setTimeout(() => setIsFetching(false), 300);
    };

    const handleLocationChange = (val: string) => {
        setLocationFilter(val);
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
        filteredRecords: pagedRecords, // Return paged data for the list
        allFilteredCount: totalItems, // Original count for UI badges

        // Pagination
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        showPagination,

        // Stats
        stats,

        // Filters
        academicYears,
        selectedAcademicYear,
        handleAcademicYearChange,
        locationFilter,
        handleLocationChange,

        // Actions
        refetch,
        triggerFetchingOverlay,

        // Status
        isLoading,
        isFetching,
        error,
    };
};
