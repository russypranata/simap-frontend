import { useState, useEffect, useCallback, useMemo } from "react";
import { getStudentSubjectAttendance, type SubjectAttendanceRecord } from "../services/studentSubjectAttendanceService";

export const useStudentSubjectAttendance = () => {
    const [allRecords, setAllRecords] = useState<SubjectAttendanceRecord[]>([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [selectedSemester, setSelectedSemester] = useState<string>("all");
    const [selectedSubject, setSelectedSubject] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        setError(null);
        try {
            const data = await getStudentSubjectAttendance();
            setAllRecords(data);
            if (data.length > 0 && selectedAcademicYear === "all") {
                const sorted = [...data].sort((a, b) => {
                    const y = b.academicYearId.localeCompare(a.academicYearId);
                    return y !== 0 ? y : b.semester - a.semester;
                });
                setSelectedAcademicYear(sorted[0].academicYearId);
                setSelectedSemester(sorted[0].semester.toString());
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat riwayat mata pelajaran.");
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, []);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);
    useEffect(() => { setCurrentPage(1); }, [selectedStatus, selectedSubject, selectedAcademicYear, selectedSemester]);

    const subjects = useMemo(() => Array.from(new Set(allRecords.map(r => r.subject))).sort(), [allRecords]);
    const academicYears = useMemo(() => Array.from(new Set(allRecords.map(r => r.academicYearId))).sort((a, b) => b.localeCompare(a)), [allRecords]);

    const recordsForStats = useMemo(() => allRecords.filter(r => {
        const matchYear = selectedAcademicYear === "all" || r.academicYearId === selectedAcademicYear;
        const matchSem = selectedSemester === "all" || r.semester === Number(selectedSemester);
        const matchSubj = selectedSubject === "all" || r.subject === selectedSubject;
        return matchYear && matchSem && matchSubj;
    }), [allRecords, selectedAcademicYear, selectedSemester, selectedSubject]);

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
            total,
        };
    }, [recordsForStats]);

    const filteredRecords = useMemo(() => recordsForStats.filter(r => selectedStatus === "all" || r.status === selectedStatus), [recordsForStats, selectedStatus]);

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    const triggerFetchingOverlay = () => { setIsFetching(true); setTimeout(() => setIsFetching(false), 300); };

    return {
        paginatedRecords, subjects, academicYears, stats,
        selectedStatus, setSelectedStatus,
        selectedSubject, setSelectedSubject,
        selectedAcademicYear, setSelectedAcademicYear,
        selectedSemester, setSelectedSemester,
        currentPage, totalPages, itemsPerPage, setItemsPerPage,
        filteredTotal: filteredRecords.length,
        startIndexDisplay: filteredRecords.length === 0 ? 0 : startIndex + 1,
        endIndexDisplay: Math.min(startIndex + itemsPerPage, filteredRecords.length),
        goToPage: (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages))),
        goToNextPage: () => setCurrentPage(p => Math.min(totalPages, p + 1)),
        goToPrevPage: () => setCurrentPage(p => Math.max(1, p - 1)),
        isLoading, isFetching, error,
        refetch: fetchRecords, triggerFetchingOverlay,
    };
};
