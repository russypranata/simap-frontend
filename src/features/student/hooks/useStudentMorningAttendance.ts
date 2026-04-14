import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentMorningTardiness, getStudentAcademicYears, type LateRecord } from '../services/studentMorningAttendanceService';
import type { AcademicYearItem } from '@/features/parent/services/parentApiClient';

export const useStudentMorningAttendance = () => {
    const [selectedYearId, setSelectedYearId] = useState<string>('all');
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const academicYearsQuery = useQuery<AcademicYearItem[]>({
        queryKey: ['academic-years'],
        queryFn: getStudentAcademicYears,
        staleTime: 10 * 60 * 1000,
    });

    const academicYears = academicYearsQuery.data ?? [];

    const effectiveYearId = useMemo(() => {
        if (selectedYearId !== 'all') return selectedYearId;
        return academicYears.find(y => y.isActive)?.id ?? 'all';
    }, [selectedYearId, academicYears]);

    const morningQuery = useQuery<LateRecord[]>({
        queryKey: ['student-morning', effectiveYearId, selectedSemesterId],
        queryFn: () => getStudentMorningTardiness(effectiveYearId),
        staleTime: 2 * 60 * 1000,
    });

    const allRecords = morningQuery.data ?? [];

    // Filter by semester if selected
    const records = useMemo(() => {
        if (selectedSemesterId === 'all') return allRecords;
        const year = academicYears.find(y => y.id === effectiveYearId);
        const semester = year?.semesters.find(s => s.id === selectedSemesterId);
        if (!semester) return allRecords;
        return allRecords.filter(r => {
            const d = new Date(r.date);
            return d >= new Date(semester.startDate) && d <= new Date(semester.endDate);
        });
    }, [allRecords, selectedSemesterId, academicYears, effectiveYearId]);

    const totalItems = records.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const pagedRecords = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return records.slice(start, start + itemsPerPage);
    }, [records, currentPage, itemsPerPage]);

    const error = academicYearsQuery.error instanceof Error ? academicYearsQuery.error.message
        : morningQuery.error instanceof Error ? morningQuery.error.message : null;

    return {
        records: pagedRecords,
        totalRecords: totalItems,
        academicYears,
        selectedYearId: effectiveYearId,
        selectedSemesterId,
        isLoading:  academicYearsQuery.isLoading || morningQuery.isLoading,
        isFetching: morningQuery.isFetching,
        error,
        setSelectedYearId: (id: string) => { setSelectedYearId(id); setSelectedSemesterId('all'); setCurrentPage(1); },
        setSelectedSemesterId: (id: string) => { setSelectedSemesterId(id); setCurrentPage(1); },
        refetch: () => morningQuery.refetch(),
        currentPage, setCurrentPage,
        itemsPerPage,
        setItemsPerPage: (v: number) => { setItemsPerPage(v); setCurrentPage(1); },
        totalPages,
        showPagination: totalItems > 10,
    };
};
