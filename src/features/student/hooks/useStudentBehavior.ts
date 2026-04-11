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
        select: (records) => {
            if (selectedAcademicYear === 'all' && records.length > 0) {
                const years = [...new Set(records.map(r => r.academicYearId))].sort((a, b) => b.localeCompare(a));
                if (years[0]) setSelectedAcademicYear(years[0]);
            }
            return records;
        },
    });

    const allRecords = query.data ?? [];

    const academicYears = useMemo(() => {
        const unique = new Set(allRecords.map(r => r.academicYearId).filter(Boolean));
        return Array.from(unique).sort((a, b) => b.localeCompare(a));
    }, [allRecords]);

    const recordsForYear = useMemo(() =>
        selectedAcademicYear === 'all' ? allRecords : allRecords.filter(r => r.academicYearId === selectedAcademicYear),
        [allRecords, selectedAcademicYear]
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
        selectedAcademicYear,
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
