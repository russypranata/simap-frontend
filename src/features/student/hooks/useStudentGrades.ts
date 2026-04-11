'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentGrades, type SubjectGrade } from '../services/studentGradesService';
import { getAcademicYears } from '@/features/parent/services/parentApiClient';

export const useStudentGrades = () => {
    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>('');

    const academicYearsQuery = useQuery({
        queryKey: ['academic-years'],
        queryFn: getAcademicYears,
        staleTime: 10 * 60 * 1000,
    });

    const academicYears = academicYearsQuery.data ?? [];

    const effectiveYearId = useMemo(() => {
        if (selectedAcademicYearId) return selectedAcademicYearId;
        return academicYears.find(y => y.isActive)?.id ?? academicYears[0]?.id ?? '';
    }, [selectedAcademicYearId, academicYears]);

    const gradesQuery = useQuery<SubjectGrade[]>({
        queryKey: ['student-grades', effectiveYearId],
        queryFn: () => getStudentGrades(effectiveYearId),
        enabled: !!effectiveYearId,
        staleTime: 2 * 60 * 1000,
    });

    const grades = gradesQuery.data ?? [];

    const stats = useMemo(() => {
        if (grades.length === 0) return null;
        const withFinal = grades.filter(g => g.finalAverage !== null);
        if (withFinal.length === 0) return null;
        const totalAverage = withFinal.reduce((s, g) => s + (g.finalAverage ?? 0), 0) / withFinal.length;
        const highestSubject = withFinal.reduce((p, c) => (p.finalAverage ?? 0) > (c.finalAverage ?? 0) ? p : c);
        const lowestSubject  = withFinal.reduce((p, c) => (p.finalAverage ?? 0) < (c.finalAverage ?? 0) ? p : c);
        const aboveKKM = withFinal.filter(g => (g.finalAverage ?? 0) >= g.kkm).length;
        return { totalAverage: Math.round(totalAverage * 10) / 10, highestSubject, lowestSubject, aboveKKM, totalSubjects: withFinal.length };
    }, [grades]);

    const error = academicYearsQuery.error instanceof Error ? academicYearsQuery.error.message
        : gradesQuery.error instanceof Error ? gradesQuery.error.message : null;

    return {
        grades,
        academicYears,
        selectedAcademicYearId: effectiveYearId,
        setSelectedAcademicYearId,
        stats,
        isLoading: academicYearsQuery.isLoading || (!!effectiveYearId && gradesQuery.isLoading),
        isFetching: gradesQuery.isFetching,
        error,
        refetch: () => gradesQuery.refetch(),
    };
};
