'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentSubjectAttendance, type SubjectAttendanceRecord } from '../services/studentSubjectAttendanceService';

export const useStudentSubjectAttendance = () => {
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('all');
    const [selectedSemester, setSelectedSemester]         = useState<string>('all');
    const [selectedSubject, setSelectedSubject]           = useState<string>('all');
    const [selectedStatus, setSelectedStatus]             = useState<string>('all');
    const [currentPage, setCurrentPage]                   = useState(1);
    const [itemsPerPage, setItemsPerPage]                 = useState(10);
    const [isFetchingOverlay, setIsFetchingOverlay]       = useState(false);

    const query = useQuery<SubjectAttendanceRecord[]>({
        queryKey: ['student-subject-attendance'],
        queryFn: getStudentSubjectAttendance,
        staleTime: 2 * 60 * 1000,
    });

    const allRecords = query.data ?? [];
    const subjects      = useMemo(() => Array.from(new Set(allRecords.map(r => r.subject))).sort(), [allRecords]);
    const academicYears = useMemo(() => Array.from(new Set(allRecords.map(r => r.academicYearId))).sort((a, b) => b.localeCompare(a)), [allRecords]);

    // Auto-select latest year/semester when data loads
    const latestYear = useMemo(() => academicYears[0] ?? 'all', [academicYears]);
    const effectiveYear     = selectedAcademicYear !== 'all' ? selectedAcademicYear : latestYear;
    const latestSemester = useMemo(() => {
        const forYear = allRecords.filter(r => r.academicYearId === effectiveYear);
        const semesters = [...new Set(forYear.map(r => r.semester))].sort((a, b) => b - a);
        return semesters[0] ? String(semesters[0]) : 'all';
    }, [allRecords, effectiveYear]);
    const effectiveSemester = selectedSemester !== 'all' ? selectedSemester : latestSemester;

    const recordsForStats = useMemo(() => allRecords.filter(r => {
        const matchSubject  = selectedSubject  === 'all' || r.subject === selectedSubject;
        const matchYear     = r.academicYearId === effectiveYear;
        const matchSemester = effectiveSemester === 'all' || r.semester === Number(effectiveSemester);
        return matchSubject && matchYear && matchSemester;
    }), [allRecords, selectedSubject, effectiveYear, effectiveSemester]);

    const stats = useMemo(() => {
        const total = recordsForStats.length;
        const hadir = recordsForStats.filter(r => r.status === 'hadir').length;
        const izin  = recordsForStats.filter(r => r.status === 'izin').length;
        const sakit = recordsForStats.filter(r => r.status === 'sakit').length;
        const alpa  = recordsForStats.filter(r => r.status === 'alpa').length;
        return {
            hadir: { value: hadir, percentage: total > 0 ? (hadir / total) * 100 : 0 },
            izin:  { value: izin,  percentage: total > 0 ? (izin  / total) * 100 : 0 },
            sakit: { value: sakit, percentage: total > 0 ? (sakit / total) * 100 : 0 },
            alpa:  { value: alpa,  percentage: total > 0 ? (alpa  / total) * 100 : 0 },
            total,
        };
    }, [recordsForStats]);

    const filteredRecords = useMemo(() =>
        recordsForStats.filter(r => selectedStatus === 'all' || r.status === selectedStatus),
        [recordsForStats, selectedStatus]
    );

    const totalPages   = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
    const startIndex   = (currentPage - 1) * itemsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    const triggerFetchingOverlay = () => { setIsFetchingOverlay(true); setTimeout(() => setIsFetchingOverlay(false), 300); };

    return {
        paginatedRecords, subjects, academicYears, stats,
        selectedStatus, setSelectedStatus,
        selectedSubject, setSelectedSubject,
        selectedAcademicYear: effectiveYear,
        setSelectedAcademicYear: (v: string) => { setSelectedAcademicYear(v); setSelectedSemester('all'); setCurrentPage(1); },
        selectedSemester: effectiveSemester,
        setSelectedSemester: (v: string) => { setSelectedSemester(v); setCurrentPage(1); },
        currentPage, totalPages, itemsPerPage,
        setItemsPerPage: (v: number) => { setItemsPerPage(v); setCurrentPage(1); },
        filteredTotal: filteredRecords.length,
        startIndexDisplay: filteredRecords.length === 0 ? 0 : startIndex + 1,
        endIndexDisplay: Math.min(startIndex + itemsPerPage, filteredRecords.length),
        goToPage: (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages))),
        goToNextPage: () => setCurrentPage(p => Math.min(totalPages, p + 1)),
        goToPrevPage: () => setCurrentPage(p => Math.max(1, p - 1)),
        refetch: () => query.refetch(),
        triggerFetchingOverlay,
        isLoading:  query.isLoading,
        isFetching: query.isFetching || isFetchingOverlay,
        error:      query.error instanceof Error ? query.error.message : null,
    };
};
