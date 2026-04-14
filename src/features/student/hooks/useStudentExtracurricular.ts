'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentExtracurricularData, type Extracurricular, type ExtracurricularAttendance } from '../services/studentExtracurricularService';

interface ExtracurricularData {
    extracurriculars: Extracurricular[];
    recentAttendance: ExtracurricularAttendance[];
}

export const useStudentExtracurricular = () => {
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('all');
    const [filterActivity, setFilterActivity]             = useState<string>('all');
    const [currentPage, setCurrentPage]                   = useState(1);
    const [itemsPerPage, setItemsPerPage]                 = useState(5);
    const [isFetchingOverlay, setIsFetchingOverlay]       = useState(false);

    const query = useQuery<ExtracurricularData>({
        queryKey: ['student-extracurricular'],
        queryFn: () => getStudentExtracurricularData(),
        staleTime: 2 * 60 * 1000,
    });

    const allExtracurriculars = query.data?.extracurriculars ?? [];
    const allAttendance       = query.data?.recentAttendance ?? [];

    const academicYears = useMemo(() => {
        const unique = new Set(allExtracurriculars.map(e => e.academicYearId).filter(Boolean));
        return Array.from(unique).sort((a, b) => b.localeCompare(a));
    }, [allExtracurriculars]);

    // Auto-select latest year when data loads
    const effectiveYear = useMemo(() => {
        if (selectedAcademicYear !== 'all') return selectedAcademicYear;
        return academicYears[0] ?? 'all';
    }, [selectedAcademicYear, academicYears]);

    const extracurriculars = useMemo(() =>
        effectiveYear === 'all' ? allExtracurriculars : allExtracurriculars.filter(e => e.academicYearId === effectiveYear),
        [allExtracurriculars, effectiveYear]
    );

    const stats = useMemo(() => ({
        totalEkskul:       new Set(extracurriculars.map(e => e.name)).size,
        avgAttendance:     extracurriculars.length > 0
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
            const matchYear     = effectiveYear === 'all' || r.academicYearId === effectiveYear;
            const matchActivity = filterActivity === 'all' ||
                r.activity.split(' - ')[0].trim().toLowerCase() === filterActivity.toLowerCase();
            return matchYear && matchActivity;
        }),
        [allAttendance, effectiveYear, filterActivity]
    );

    const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAttendance = filteredAttendance.slice(startIndex, startIndex + itemsPerPage);

    const triggerFetchingOverlay = () => { setIsFetchingOverlay(true); setTimeout(() => setIsFetchingOverlay(false), 300); };

    return {
        extracurriculars, paginatedAttendance, stats, academicYears,
        selectedAcademicYear: effectiveYear,
        handleAcademicYearChange: (v: string) => { setSelectedAcademicYear(v); setFilterActivity('all'); setCurrentPage(1); },
        uniqueActivitiesList, filterActivity,
        handleFilterChange: (v: string) => { setFilterActivity(v); setCurrentPage(1); triggerFetchingOverlay(); },
        currentPage, totalPages, itemsPerPage,
        setItemsPerPage: (v: number) => { setItemsPerPage(v); setCurrentPage(1); },
        filteredTotal: filteredAttendance.length,
        startIndexDisplay: filteredAttendance.length === 0 ? 0 : startIndex + 1,
        endIndexDisplay: Math.min(startIndex + itemsPerPage, filteredAttendance.length),
        goToPage: (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages))),
        refetch: () => query.refetch(),
        triggerFetchingOverlay,
        isLoading:  query.isLoading,
        isFetching: query.isFetching || isFetchingOverlay,
        error:      query.error instanceof Error ? query.error.message : null,
    };
};
