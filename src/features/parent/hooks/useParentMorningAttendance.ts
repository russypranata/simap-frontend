import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getMorningTardiness,
    getParentChildren,
    getAcademicYears,
    type LateRecord,
    type ChildInfo,
} from "../services/parentMorningAttendanceService";
import type { AcademicYearItem as AcademicYear } from "../services/parentApiClient";

export const useParentMorningAttendance = () => {
    const [records, setRecords] = useState<LateRecord[]>([]);
    const [children, setChildren] = useState<ChildInfo[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedYearId, setSelectedYearId] = useState<string>("all");
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch for Children and Academic Years
    useEffect(() => {
        const init = async () => {
            try {
                const [childrenData, yearsData] = await Promise.all([
                    getParentChildren(),
                    getAcademicYears()
                ]);
                
                setChildren(childrenData);
                setAcademicYears(yearsData);
                
                if (childrenData.length > 0) {
                    setSelectedChildId(childrenData[0].id);
                }
                
                const activeYear = yearsData.find(y => y.isActive) || yearsData[0];
                if (activeYear) {
                    setSelectedYearId(activeYear.id);
                    // Default to active/latest semester for focused monitoring
                    const activeSem = activeYear.semesters.find(s => s.isActive) || activeYear.semesters[0];
                    if (activeSem) {
                        setSelectedSemesterId(activeSem.id);
                    } else {
                        setSelectedSemesterId("all");
                    }
                }
            } catch {
                setError("Gagal memuat data awal.");
                setIsLoading(false);
            }
        };
        init();
    }, []);

    const fetchRecords = useCallback(async () => {
        if (!selectedChildId) return;

        const isInitial = records.length === 0 && isLoading;
        if (!isInitial) {
            setIsFetching(true);
        }
        setError(null);

        try {
            const data = await getMorningTardiness(selectedChildId, selectedYearId, selectedSemesterId);
            setRecords(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat riwayat keterlambatan.";
            setError(message);
            setRecords([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [selectedChildId, selectedYearId, selectedSemesterId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Pagination Logic
    const totalItems = records.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const showPagination = totalItems > 10;

    const pagedRecords = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return records.slice(start, start + itemsPerPage);
    }, [records, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedChildId, selectedYearId, selectedSemesterId]);

    useEffect(() => {
        if (selectedChildId) {
            fetchRecords();
        }
    }, [fetchRecords]); // eslint-disable-line react-hooks/exhaustive-deps

    const refetch = useCallback(() => {
        fetchRecords();
    }, [fetchRecords]);

    return {
        records: pagedRecords,
        totalRecords: totalItems,
        children,
        academicYears,
        selectedChildId,
        selectedYearId,
        selectedSemesterId,
        isLoading,
        isFetching,
        error,
        setSelectedChildId,
        setSelectedYearId,
        setSelectedSemesterId,
        refetch,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        showPagination,
    };
};
