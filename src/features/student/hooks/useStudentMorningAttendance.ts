import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentMorningTardiness, getStudentAcademicYears, type LateRecord } from '../services/studentMorningAttendanceService';
import type { AcademicYearItem } from '@/features/parent/services/parentApiClient';

export const useStudentMorningAttendance = () => {
    const [selectedYearId, setSelectedYearId] = useState<string>('all');
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
        queryKey: ['student-morning', effectiveYearId],
        queryFn: () => getStudentMorningTardiness(effectiveYearId),
        staleTime: 2 * 60 * 1000,
    });

    const records = morningQuery.data ?? [];
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
        isLoading:  academicYearsQuery.isLoading || morningQuery.isLoading,
        isFetching: morningQuery.isFetching,
        error,
        setSelectedYearId: (id: string) => { setSelectedYearId(id); setCurrentPage(1); },
        refetch: () => morningQuery.refetch(),
        currentPage, setCurrentPage,
        itemsPerPage,
        setItemsPerPage: (v: number) => { setItemsPerPage(v); setCurrentPage(1); },
        totalPages,
        showPagination: totalItems > 10,
    };
};
