'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentBehaviorData, type ViolationRecord } from '../services/studentBehaviorService';

export const useStudentBehavior = () => {
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('all');
    const [locationFilter, setLocationFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isFetchingOverlay, setIsFetchingOverlay] = useState(false);

    const query = useQuery<ViolationRecord[]>({
        queryKey: ['student-behavior'],
        queryFn: async () => {
            const data = await getStudentBehaviorData();
            return data.records;
        },
        staleTime: 2 * 60 * 1000,
    });

    const allRecords = query.data ?? [];

    // Auto-select latest academic year once data loads
    const academicYears = useMemo(() => {
        const unique = new Set(allRecords.map(r => r.academicYearId).filter(Boolean));
        return Array.from(unique).sort((a, b) => b.localeCompare(a));
    }, [allRecords]);

    // Auto-select latest year when data first loads
    const effectiveYear = useMemo(() => {
        if (selectedAcademicYear !== 'all') return selectedAcademicYear;
        return academicYears[0] ?? 'all';
    }, [selectedAcademicYear, academicYears]);

    const recordsForYear = useMemo(() =>
        effectiveYear === 'all' ? allRecords : allRecords.filter(r => r.academicYearId === effectiveYear),
        [allRecords, effectiveYear]
    );

    const stats = useMemo(() => ({
        totalViolations:  recordsForYear.length,
        schoolViolations: recordsForYear.filter(r => r.location === 'sekolah').length,
        dormViolations:   recordsForYear.filter(r => r.location === 'asrama').length,
    }), [recordsForYear]);

    const filteredRecords = useMemo(() =>
        recordsForYear.filter(r => locationFilter === 'all' || r.location === locationFilter),
        [recordsForYear, locationFilter]
    );

    const totalItems  = filteredRecords.length;
    const totalPages  = Math.ceil(totalItems / itemsPerPage);
    const pagedRecords = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredRecords.slice(start, start + itemsPerPage);
    }, [filteredRecords, currentPage, itemsPerPage]);

    const triggerFetchingOverlay = () => { setIsFetchingOverlay(true); setTimeout(() => setIsFetchingOverlay(false), 300); };

    return {
        filteredRecords: pagedRecords,
        allFilteredCount: totalItems,
        stats, academicYears,
        selectedAcademicYear: effectiveYear,
        handleAcademicYearChange: (v: string) => { setSelectedAcademicYear(v); setCurrentPage(1); triggerFetchingOverlay(); },
        locationFilter,
        handleLocationChange: (v: string) => { setLocationFilter(v); setCurrentPage(1); triggerFetchingOverlay(); },
        currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
        totalPages, showPagination: totalItems > 10,
        isLoading:  query.isLoading,
        isFetching: query.isFetching || isFetchingOverlay,
        error:      query.error instanceof Error ? query.error.message : null,
        refetch:    query.refetch,
        triggerFetchingOverlay,
    };
};
