import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getExtracurricularData, getParentChildren, type Extracurricular, type ExtracurricularAttendance, type ChildInfo } from "../services/parentExtracurricularAttendanceService";

interface ExtracurricularData {
    extracurriculars: Extracurricular[];
    recentAttendance: ExtracurricularAttendance[];
}

export const useParentExtracurricularAttendance = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [filterActivity, setFilterActivity] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isFetchingOverlay, setIsFetchingOverlay] = useState(false);

    const childrenQuery = useQuery<ChildInfo[]>({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
        staleTime: 5 * 60 * 1000,
    });

    const children = childrenQuery.data ?? [];
    const effectiveChildId = selectedChildId || children[0]?.id || "";

    const ekskulQuery = useQuery<ExtracurricularData>({
        queryKey: ["parent-extracurricular", effectiveChildId],
        queryFn: () => getExtracurricularData(effectiveChildId),
        enabled: !!effectiveChildId,
        staleTime: 2 * 60 * 1000,
        select: (data) => {
            // Auto-select latest year on first load
            if (selectedAcademicYear === "all" && data.extracurriculars.length > 0) {
                const years = [...new Set(data.extracurriculars.map(e => e.academicYearId))].sort((a, b) => b.localeCompare(a));
                if (years[0]) setSelectedAcademicYear(years[0]);
            }
            return data;
        },
    });

    const allExtracurriculars = useMemo(() => ekskulQuery.data?.extracurriculars ?? [], [ekskulQuery.data]);
    const allAttendance = useMemo(() => ekskulQuery.data?.recentAttendance ?? [], [ekskulQuery.data]);

    const academicYears = useMemo(() => {
        const unique = new Set(allExtracurriculars.map(e => e.academicYearId));
        return Array.from(unique).sort((a, b) => b.localeCompare(a));
    }, [allExtracurriculars]);

    const extracurriculars = useMemo(() =>
        selectedAcademicYear === "all" ? allExtracurriculars : allExtracurriculars.filter(e => e.academicYearId === selectedAcademicYear),
        [allExtracurriculars, selectedAcademicYear]
    );

    const stats = useMemo(() => ({
        totalEkskul: new Set(extracurriculars.map(e => e.name)).size,
        avgAttendance: extracurriculars.length > 0
            ? Math.round(extracurriculars.reduce((s, e) => s + e.attendanceRate, 0) / extracurriculars.length)
            : 0,
        totalAchievements: extracurriculars.reduce((s, e) => s + (e.achievements?.length ?? 0), 0),
    }), [extracurriculars]);

    const uniqueActivitiesList = useMemo(() =>
        Array.from(new Set(extracurriculars.map(e => e.name))).sort(),
        [extracurriculars]
    );

    const filteredAttendance = useMemo(() =>
        allAttendance.filter(r => {
            const matchesYear = selectedAcademicYear === "all" || r.academicYearId === selectedAcademicYear;
            const matchesActivity = filterActivity === "all" ||
                r.activity.split(" - ")[0].trim().toLowerCase() === filterActivity.toLowerCase();
            return matchesYear && matchesActivity;
        }),
        [allAttendance, selectedAcademicYear, filterActivity]
    );

    const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAttendance = filteredAttendance.slice(startIndex, startIndex + itemsPerPage);

    const triggerFetchingOverlay = () => {
        setIsFetchingOverlay(true);
        setTimeout(() => setIsFetchingOverlay(false), 300);
    };

    const error = childrenQuery.error instanceof Error
        ? childrenQuery.error.message
        : ekskulQuery.error instanceof Error
        ? ekskulQuery.error.message
        : null;

    return {
        children,
        selectedChildId: effectiveChildId,
        setSelectedChildId,
        extracurriculars,
        paginatedAttendance,
        stats,
        academicYears,
        selectedAcademicYear,
        handleAcademicYearChange: (val: string) => { setSelectedAcademicYear(val); setFilterActivity("all"); setCurrentPage(1); triggerFetchingOverlay(); },
        uniqueActivitiesList,
        filterActivity,
        handleFilterChange: (val: string) => { setFilterActivity(val); setCurrentPage(1); triggerFetchingOverlay(); },
        currentPage,
        totalPages,
        itemsPerPage,
        setItemsPerPage: (val: number) => { setItemsPerPage(val); setCurrentPage(1); },
        filteredTotal: filteredAttendance.length,
        startIndexDisplay: filteredAttendance.length === 0 ? 0 : startIndex + 1,
        endIndexDisplay: Math.min(startIndex + itemsPerPage, filteredAttendance.length),
        goToPage: (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
        goToNextPage: () => setCurrentPage(p => Math.min(totalPages, p + 1)),
        goToPrevPage: () => setCurrentPage(p => Math.max(1, p - 1)),
        refetch: () => ekskulQuery.refetch(),
        triggerFetchingOverlay,
        isLoading: childrenQuery.isLoading || (!!effectiveChildId && ekskulQuery.isLoading),
        isFetching: childrenQuery.isFetching || ekskulQuery.isFetching || isFetchingOverlay,
        error,
    };
};
