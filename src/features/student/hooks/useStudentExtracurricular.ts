import { useState, useEffect, useCallback, useMemo } from "react";
import { getStudentExtracurricularData, type Extracurricular, type ExtracurricularAttendance } from "../services/studentExtracurricularService";

export const useStudentExtracurricular = () => {
    const [allExtracurriculars, setAllExtracurriculars] = useState<Extracurricular[]>([]);
    const [allAttendance, setAllAttendance] = useState<ExtracurricularAttendance[]>([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [filterActivity, setFilterActivity] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        setError(null);
        try {
            const data = await getStudentExtracurricularData();
            setAllExtracurriculars(data.extracurriculars);
            setAllAttendance(data.recentAttendance);
            if (data.extracurriculars.length > 0) {
                const years = [...new Set(data.extracurriculars.map(e => e.academicYearId))];
                const latest = years.sort((a, b) => b.localeCompare(a))[0];
                setSelectedAcademicYear(latest);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat data ekstrakurikuler.");
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, []);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);
    useEffect(() => { setCurrentPage(1); }, [selectedAcademicYear, filterActivity]);
    useEffect(() => { setFilterActivity("all"); }, [selectedAcademicYear]);

    const academicYears = useMemo(() => Array.from(new Set(allExtracurriculars.map(e => e.academicYearId))).sort((a, b) => b.localeCompare(a)), [allExtracurriculars]);

    const extracurriculars = useMemo(() => selectedAcademicYear === "all" ? allExtracurriculars : allExtracurriculars.filter(e => e.academicYearId === selectedAcademicYear), [allExtracurriculars, selectedAcademicYear]);

    const stats = useMemo(() => ({
        totalEkskul: new Set(extracurriculars.map(e => e.name)).size,
        avgAttendance: extracurriculars.length > 0 ? Math.round(extracurriculars.reduce((s, e) => s + e.attendanceRate, 0) / extracurriculars.length) : 0,
        totalAchievements: extracurriculars.reduce((s, e) => s + (e.achievements?.length || 0), 0),
    }), [extracurriculars]);

    const uniqueActivitiesList = useMemo(() => Array.from(new Set(extracurriculars.map(e => e.name))).sort(), [extracurriculars]);

    const filteredAttendance = useMemo(() => allAttendance.filter(r => {
        const matchYear = selectedAcademicYear === "all" || r.academicYearId === selectedAcademicYear;
        const matchActivity = filterActivity === "all" || r.activity.split(" - ")[0].trim().toLowerCase() === filterActivity.toLowerCase();
        return matchYear && matchActivity;
    }), [allAttendance, selectedAcademicYear, filterActivity]);

    const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAttendance = filteredAttendance.slice(startIndex, startIndex + itemsPerPage);

    const triggerFetchingOverlay = () => { setIsFetching(true); setTimeout(() => setIsFetching(false), 300); };

    return {
        extracurriculars, paginatedAttendance, stats, academicYears,
        selectedAcademicYear, filterActivity, uniqueActivitiesList,
        currentPage, totalPages, itemsPerPage, setItemsPerPage,
        filteredTotal: filteredAttendance.length,
        startIndexDisplay: filteredAttendance.length === 0 ? 0 : startIndex + 1,
        endIndexDisplay: Math.min(startIndex + itemsPerPage, filteredAttendance.length),
        goToPage: (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages))),
        goToPrevPage: () => setCurrentPage(p => Math.max(1, p - 1)),
        isLoading, isFetching, error,
        handleAcademicYearChange: (val: string) => { setSelectedAcademicYear(val); triggerFetchingOverlay(); },
        handleFilterChange: (val: string) => { setFilterActivity(val); triggerFetchingOverlay(); },
        triggerFetchingOverlay, refetch: fetchRecords,
    };
};
