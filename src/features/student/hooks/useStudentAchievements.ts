'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentAchievements, type Achievement } from '../services/studentAchievementsService';

export const useStudentAchievements = () => {
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('all');
    const [selectedLevel, setSelectedLevel] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    const query = useQuery<Achievement[]>({
        queryKey: ['student-achievements'],
        queryFn: () => getStudentAchievements(),
        staleTime: 2 * 60 * 1000,
    });

    const allRecords = useMemo(() => query.data ?? [], [query.data]);

    const academicYears = useMemo(() => {
        const unique = new Set(allRecords.map(r => r.academicYearId).filter(Boolean));
        return Array.from(unique).sort((a, b) => b.localeCompare(a));
    }, [allRecords]);

    const yearFiltered = useMemo(() =>
        selectedAcademicYear === 'all' ? allRecords : allRecords.filter(r => r.academicYearId === selectedAcademicYear),
        [allRecords, selectedAcademicYear]
    );

    const filteredRecords = useMemo(() =>
        yearFiltered.filter(r => {
            const matchLevel  = selectedLevel === 'all' || r.level === selectedLevel;
            const matchSearch = !searchQuery ||
                r.competitionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.eventName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchLevel && matchSearch;
        }),
        [yearFiltered, selectedLevel, searchQuery]
    );

    const stats = useMemo(() => ({
        totalAchievements:    yearFiltered.length,
        nationalAchievements: yearFiltered.filter(a => a.level === 'Nasional' || a.level === 'Internasional').length,
        firstPlaceCount:      yearFiltered.filter(a => a.rank === 'Juara 1').length,
    }), [yearFiltered]);

    const totalPages  = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
    const startIndex  = (currentPage - 1) * itemsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    const ITEMS_PER_PAGE = itemsPerPage;

    return {
        // Aliases used by Achievements.tsx page
        paginatedAchievements: paginatedRecords,
        filteredAchievements: filteredRecords,
        totalAchievements: stats.totalAchievements,
        nationalAchievements: stats.nationalAchievements,
        firstPlaceCount: stats.firstPlaceCount,
        levelFilter: selectedLevel,
        setLevelFilter: setSelectedLevel,
        ITEMS_PER_PAGE,

        // Standard names
        paginatedRecords, academicYears, stats,
        selectedAcademicYear,
        setSelectedAcademicYear: (v: string) => { setSelectedAcademicYear(v); setCurrentPage(1); },
        selectedLevel, setSelectedLevel,
        searchQuery, setSearchQuery,
        selectedAchievement, setSelectedAchievement,
        currentPage,
        setCurrentPage,
        totalPages,
        itemsPerPage,
        setItemsPerPage: (v: number) => { setItemsPerPage(v); setCurrentPage(1); },
        filteredTotal: filteredRecords.length,
        startIndexDisplay: filteredRecords.length === 0 ? 0 : startIndex + 1,
        goToPage: (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages))),
        isLoading:  query.isLoading,
        isFetching: query.isFetching,
        error:      query.error instanceof Error ? query.error.message : null,
        refetch:    query.refetch,
    };
};
