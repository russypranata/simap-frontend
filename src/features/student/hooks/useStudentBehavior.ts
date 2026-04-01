import { useState, useEffect, useCallback, useMemo } from "react";
import { getStudentBehaviorData, type ViolationRecord } from "../services/studentBehaviorService";

export const useStudentBehavior = () => {
    const [allRecords, setAllRecords] = useState<ViolationRecord[]>([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [locationFilter, setLocationFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        setError(null);
        try {
            const data = await getStudentBehaviorData();
            setAllRecords(data.records);
            if (data.records.length > 0) {
                const years = [...new Set(data.records.map(r => r.academicYearId))];
                const latest = years.sort((a, b) => b.localeCompare(a))[0];
                setSelectedAcademicYear(latest);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat catatan perilaku.");
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, []);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);
    useEffect(() => { setCurrentPage(1); }, [selectedAcademicYear, locationFilter]);
    useEffect(() => { setLocationFilter("all"); }, [selectedAcademicYear]);

    const academicYears = useMemo(() => Array.from(new Set(allRecords.map(r => r.academicYearId))).sort((a, b) => b.localeCompare(a)), [allRecords]);

    const recordsForYear = useMemo(() => selectedAcademicYear === "all" ? allRecords : allRecords.filter(r => r.academicYearId === selectedAcademicYear), [allRecords, selectedAcademicYear]);

    const stats = useMemo(() => ({
        totalViolations: recordsForYear.length,
        schoolViolations: recordsForYear.filter(r => r.location === "sekolah").length,
        dormViolations: recordsForYear.filter(r => r.location === "asrama").length,
    }), [recordsForYear]);

    const filteredRecords = useMemo(() => recordsForYear.filter(r => locationFilter === "all" || r.location === locationFilter), [recordsForYear, locationFilter]);

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const pagedRecords = useMemo(() => filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredRecords, currentPage, itemsPerPage]);

    const triggerFetchingOverlay = () => { setIsFetching(true); setTimeout(() => setIsFetching(false), 300); };

    return {
        filteredRecords: pagedRecords, allFilteredCount: filteredRecords.length,
        stats, academicYears, selectedAcademicYear, locationFilter,
        isLoading, isFetching, error,
        currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
        totalPages, showPagination: filteredRecords.length > 10,
        handleAcademicYearChange: (val: string) => { setSelectedAcademicYear(val); triggerFetchingOverlay(); },
        handleLocationChange: (val: string) => { setLocationFilter(val); triggerFetchingOverlay(); },
        refetch: fetchRecords,
    };
};
