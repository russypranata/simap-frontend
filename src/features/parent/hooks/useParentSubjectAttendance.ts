import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getSubjectAttendance,
    getParentChildren,
    type SubjectAttendanceRecord,
    type ChildInfo,
} from "../services/parentSubjectAttendanceService";

export const useParentSubjectAttendance = () => {
    // Core Data
    const [children, setChildren] = useState<ChildInfo[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [allRecords, setAllRecords] = useState<SubjectAttendanceRecord[]>([]);
    
    // Filters
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [selectedSemester, setSelectedSemester] = useState<string>("all");
    const [selectedSubject, setSelectedSubject] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    
    // Pagination
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
            const data = await getSubjectAttendance(selectedChildId);
            setAllRecords(data);
            
            // Auto-select latest academic year and semester on load if still "all"
            if (data.length > 0 && selectedAcademicYear === "all") {
                const sortedByRecency = [...data].sort((a, b) => {
                    // Sort descending by year then semester
                    const yearCompare = b.academicYearId.localeCompare(a.academicYearId);
                    if (yearCompare !== 0) return yearCompare;
                    return b.semester - a.semester;
                });
                
                const latest = sortedByRecency[0];
                if (latest) {
                    setSelectedAcademicYear(latest.academicYearId);
                    setSelectedSemester(latest.semester.toString());
                }
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat riwayat mata pelajaran.";
            setError(message);
            setAllRecords([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
            setCurrentPage(1); // Reset page on new data
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

    // 3. Extract Uniques for Dropdowns
    const subjects = useMemo(() => {
        const unique = new Set(allRecords.map(r => r.subject));
        return Array.from(unique).sort();
    }, [allRecords]);

    const academicYears = useMemo(() => {
        const unique = new Set(allRecords.map(r => r.academicYearId));
        return Array.from(unique).sort((a, b) => b.localeCompare(a));
    }, [allRecords]);

    // 4. Client-side Filtering for Stats
    const recordsForStats = useMemo(() => {
        return allRecords.filter(record => {
            const matchesSubject = selectedSubject === "all" || record.subject === selectedSubject;
            const matchesAcademicYear = selectedAcademicYear === "all" || record.academicYearId === selectedAcademicYear;
            const matchesSemester = selectedSemester === "all" || record.semester === Number(selectedSemester);
            return matchesSubject && matchesAcademicYear && matchesSemester;
        });
    }, [allRecords, selectedSubject, selectedAcademicYear, selectedSemester]);

    // Calculate Statistics
    const stats = useMemo(() => {
        const total = recordsForStats.length;
        const hadir = recordsForStats.filter(r => r.status === "hadir").length;
        const izin = recordsForStats.filter(r => r.status === "izin").length;
        const sakit = recordsForStats.filter(r => r.status === "sakit").length;
        const alpa = recordsForStats.filter(r => r.status === "alpa").length;

        return {
            hadir: { value: hadir, percentage: total > 0 ? (hadir / total) * 100 : 0 },
            izin: { value: izin, percentage: total > 0 ? (izin / total) * 100 : 0 },
            sakit: { value: sakit, percentage: total > 0 ? (sakit / total) * 100 : 0 },
            alpa: { value: alpa, percentage: total > 0 ? (alpa / total) * 100 : 0 },
            total
        };
    }, [recordsForStats]);

    // 5. Final Filter for Table
    const filteredRecords = useMemo(() => {
        return recordsForStats.filter(record => {
            return selectedStatus === "all" || record.status === selectedStatus;
        });
    }, [recordsForStats, selectedStatus]);

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
    }, [selectedStatus, selectedSubject, selectedAcademicYear, selectedSemester]);

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
        subjects,
        academicYears,
        stats,
        
        // Filter States
        selectedStatus, setSelectedStatus,
        selectedSubject, setSelectedSubject,
        selectedAcademicYear, setSelectedAcademicYear,
        selectedSemester, setSelectedSemester,

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
