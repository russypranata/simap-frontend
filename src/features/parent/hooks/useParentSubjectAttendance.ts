import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSubjectAttendance, getParentChildren, type SubjectAttendanceRecord, type ChildInfo } from "../services/parentSubjectAttendanceService";

export const useParentSubjectAttendance = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [selectedSemester, setSelectedSemester] = useState<string>("all");
    const [selectedSubject, setSelectedSubject] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isFetchingOverlay, setIsFetchingOverlay] = useState(false);

    const childrenQuery = useQuery<ChildInfo[]>({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
        staleTime: 5 * 60 * 1000,
    });

    const children = childrenQuery.data ?? [];
    const effectiveChildId = selectedChildId || children[0]?.id || "";

    const subjectQuery = useQuery<SubjectAttendanceRecord[]>({
        queryKey: ["parent-subject-attendance", effectiveChildId],
        queryFn: () => getSubjectAttendance(effectiveChildId),
        enabled: !!effectiveChildId,
        staleTime: 2 * 60 * 1000,
        select: (data) => {
            // Auto-select latest year/semester on first load
            if (selectedAcademicYear === "all" && data.length > 0) {
                const sorted = [...data].sort((a, b) => {
                    const yc = b.academicYearId.localeCompare(a.academicYearId);
                    return yc !== 0 ? yc : b.semester - a.semester;
                });
                const latest = sorted[0];
                if (latest) {
                    setSelectedAcademicYear(latest.academicYearId);
                    setSelectedSemester(String(latest.semester));
                }
            }
            return data;
        },
    });

    const allRecords = subjectQuery.data ?? [];

    const subjects = useMemo(() => Array.from(new Set(allRecords.map(r => r.subject))).sort(), [allRecords]);
    const academicYears = useMemo(() => Array.from(new Set(allRecords.map(r => r.academicYearId))).sort((a, b) => b.localeCompare(a)), [allRecords]);

    const recordsForStats = useMemo(() => allRecords.filter(r => {
        const matchesSubject = selectedSubject === "all" || r.subject === selectedSubject;
        const matchesYear = selectedAcademicYear === "all" || r.academicYearId === selectedAcademicYear;
        const matchesSemester = selectedSemester === "all" || r.semester === Number(selectedSemester);
        return matchesSubject && matchesYear && matchesSemester;
    }), [allRecords, selectedSubject, selectedAcademicYear, selectedSemester]);

    const stats = useMemo(() => {
        const total = recordsForStats.length;
        const hadir = recordsForStats.filter(r => r.status === "hadir").length;
        const izin = recordsForStats.filter(r => r.status === "izin").length;
        const sakit = recordsForStats.filter(r => r.status === "sakit").length;
        const alpa = recordsForStats.filter(r => r.status === "alpa").length;
        return {
            hadir: { value: hadir, percentage: total > 0 ? (hadir / total) * 100 : 0 },
            izin:  { value: izin,  percentage: total > 0 ? (izin  / total) * 100 : 0 },
            sakit: { value: sakit, percentage: total > 0 ? (sakit / total) * 100 : 0 },
            alpa:  { value: alpa,  percentage: total > 0 ? (alpa  / total) * 100 : 0 },
            total,
        };
    }, [recordsForStats]);

    const filteredRecords = useMemo(() =>
        recordsForStats.filter(r => selectedStatus === "all" || r.status === selectedStatus),
        [recordsForStats, selectedStatus]
    );

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    const triggerFetchingOverlay = () => {
        setIsFetchingOverlay(true);
        setTimeout(() => setIsFetchingOverlay(false), 300);
    };

    const error = childrenQuery.error instanceof Error
        ? childrenQuery.error.message
        : subjectQuery.error instanceof Error
        ? subjectQuery.error.message
        : null;

    return {
        children,
        selectedChildId: effectiveChildId,
        setSelectedChildId,
        paginatedRecords,
        subjects,
        academicYears,
        stats,
        selectedStatus, setSelectedStatus,
        selectedSubject, setSelectedSubject,
        selectedAcademicYear,
        setSelectedAcademicYear: (val: string) => { setSelectedAcademicYear(val); setCurrentPage(1); },
        selectedSemester,
        setSelectedSemester: (val: string) => { setSelectedSemester(val); setCurrentPage(1); },
        currentPage,
        totalPages,
        itemsPerPage,
        setItemsPerPage: (val: number) => { setItemsPerPage(val); setCurrentPage(1); },
        filteredTotal: filteredRecords.length,
        startIndexDisplay: filteredRecords.length === 0 ? 0 : startIndex + 1,
        endIndexDisplay: Math.min(startIndex + itemsPerPage, filteredRecords.length),
        goToPage: (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
        goToNextPage: () => setCurrentPage(p => Math.min(totalPages, p + 1)),
        goToPrevPage: () => setCurrentPage(p => Math.max(1, p - 1)),
        refetch: () => subjectQuery.refetch(),
        triggerFetchingOverlay,
        isLoading: childrenQuery.isLoading || (!!effectiveChildId && subjectQuery.isLoading),
        isFetching: childrenQuery.isFetching || subjectQuery.isFetching || isFetchingOverlay,
        error,
    };
};
