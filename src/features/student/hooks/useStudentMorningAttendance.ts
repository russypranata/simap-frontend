import { useState, useEffect, useCallback, useMemo } from "react";
import { getStudentMorningTardiness, getStudentAcademicYears, type LateRecord, type AcademicYear } from "../services/studentMorningAttendanceService";

export const useStudentMorningAttendance = () => {
    const [records, setRecords] = useState<LateRecord[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [selectedYearId, setSelectedYearId] = useState<string>("all");
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const years = await getStudentAcademicYears();
                setAcademicYears(years);
                const activeYear = years.find(y => y.isActive) || years[0];
                if (activeYear) {
                    setSelectedYearId(activeYear.id);
                    const activeSem = activeYear.semesters.find(s => s.isActive) || activeYear.semesters[0];
                    if (activeSem) setSelectedSemesterId(activeSem.id);
                }
            } catch {
                setError("Gagal memuat data awal.");
                setIsLoading(false);
            }
        };
        init();
    }, []);

    const fetchRecords = useCallback(async () => {
        const isInitial = records.length === 0 && isLoading;
        if (!isInitial) setIsFetching(true);
        setError(null);
        try {
            const data = await getStudentMorningTardiness(selectedYearId, selectedSemesterId);
            setRecords(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat riwayat keterlambatan.");
            setRecords([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [selectedYearId, selectedSemesterId]);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);
    useEffect(() => { setCurrentPage(1); }, [selectedYearId, selectedSemesterId]);

    const totalItems = records.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagedRecords = useMemo(() => records.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [records, currentPage, itemsPerPage]);

    return {
        records: pagedRecords, totalRecords: totalItems, academicYears,
        selectedYearId, selectedSemesterId, isLoading, isFetching, error,
        setSelectedYearId, setSelectedSemesterId,
        currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
        totalPages, showPagination: totalItems > 10,
        refetch: fetchRecords,
    };
};
