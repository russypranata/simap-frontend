'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    getStudentGrades,
    getStudentGradeTrend,
    getStudentAttitude,
    getStudentReportCardNotes,
    type SubjectGrade as ServiceSubjectGrade,
} from '../services/studentGradesService';
import { getAcademicYears } from '@/features/parent/services/parentApiClient';
import type {
    SubjectGrade,
    AttitudeScore,
    SemesterSummary,
    AcademicYear,
} from '@/features/parent/components/grades';

const defaultAttitude: AttitudeScore = {
    spiritual: { score: 'B', predicate: 'Baik', description: 'Memuat data sikap...' },
    social:    { score: 'B', predicate: 'Baik', description: 'Memuat data sikap...' },
};

const defaultReportCardNotes: { category: string; note: string; icon: string }[] = [];

const getDefaultYearId = (years: AcademicYear[]): string => {
    const active = years.find(y => y.semesters.some(s => s.status === 'active'));
    if (active) return active.id;
    const withCompleted = years.find(y => y.semesters.some(s => s.status === 'completed'));
    return withCompleted?.id ?? years[0]?.id ?? '';
};

const getDefaultSemester = (years: AcademicYear[], yearId: string): string => {
    const year = years.find(y => y.id === yearId);
    const active = year?.semesters.find(s => s.status === 'active');
    if (active) return active.id;
    const completed = year?.semesters.find(s => s.status === 'completed');
    return completed?.id ?? 'ganjil';
};

export const useStudentGrades = () => {
    const [selectedYearId, setSelectedYearId]     = useState<string>('');
    const [selectedSemester, setSelectedSemester] = useState<string>('ganjil');
    const [selectedTab, setSelectedTab]           = useState('nilai');
    const [filterOpen, setFilterOpen]             = useState(false);
    const [selectedGrade, setSelectedGrade]       = useState<SubjectGrade | null>(null);

    // ── Academic years ────────────────────────────────────────────────────────
    const academicYearsQuery = useQuery({
        queryKey: ['academic-years'],
        queryFn: getAcademicYears,
        staleTime: 10 * 60 * 1000,
    });

    const rawYears = academicYearsQuery.data ?? [];

    // Map raw years to AcademicYear shape (with semesters)
    const academicYears: AcademicYear[] = useMemo(() => {
        return rawYears.map(y => ({
            id:   y.id,
            year: y.name ?? y.id,
            semesters: [
                { id: 'ganjil', label: 'Ganjil', status: (y.isActive ? 'active'   : 'completed') as 'active' | 'completed' | 'upcoming' },
                { id: 'genap',  label: 'Genap',  status: (y.isActive ? 'upcoming' : 'completed') as 'active' | 'completed' | 'upcoming' },
            ],
        }));
    }, [rawYears]);

    // ── Effective year & semester ─────────────────────────────────────────────
    const effectiveYearId = useMemo(() => {
        if (selectedYearId && academicYears.some(y => y.id === selectedYearId)) return selectedYearId;
        return getDefaultYearId(academicYears);
    }, [selectedYearId, academicYears]);

    const effectiveSemester = useMemo(() => {
        if (selectedYearId) return selectedSemester;
        return getDefaultSemester(academicYears, effectiveYearId);
    }, [selectedYearId, selectedSemester, academicYears, effectiveYearId]);

    // Resolve semester_id: find the semester record whose id matches effectiveSemester
    // The backend expects a numeric semester_id; effectiveSemester is 'ganjil'|'genap'.
    // We pass it as-is — the service will send it as semester_id param and the backend
    // resolves it via the active-semester fallback when it's not a numeric id.
    const effectiveSemesterId = effectiveSemester;

    // ── Grades query ──────────────────────────────────────────────────────────
    const gradesQuery = useQuery({
        queryKey: ['student-grades', effectiveYearId, effectiveSemesterId],
        queryFn: () => getStudentGrades(effectiveSemesterId),
        enabled: !!effectiveYearId,
        staleTime: 2 * 60 * 1000,
    });

    // ── Trend query ───────────────────────────────────────────────────────────
    const trendQuery = useQuery({
        queryKey: ['student-grades-trend'],
        queryFn: () => getStudentGradeTrend(),
        staleTime: 5 * 60 * 1000,
    });

    // ── Attitude query ────────────────────────────────────────────────────────
    const attitudeQuery = useQuery({
        queryKey: ['student-grades-attitude', effectiveYearId, effectiveSemester],
        queryFn: () => getStudentAttitude(effectiveYearId, effectiveSemester),
        enabled: !!effectiveYearId,
        staleTime: 2 * 60 * 1000,
    });

    // ── Report card notes query ───────────────────────────────────────────────
    const reportCardQuery = useQuery({
        queryKey: ['student-grades-report-card', effectiveYearId, effectiveSemester],
        queryFn: () => getStudentReportCardNotes(effectiveYearId, effectiveSemester),
        enabled: !!effectiveYearId,
        staleTime: 2 * 60 * 1000,
    });

    // ── Map service grades → SubjectGrade shape ───────────────────────────────
    const grades: SubjectGrade[] = useMemo(() => {
        return (gradesQuery.data?.grades ?? []).map((item: ServiceSubjectGrade) => {
            const ki3Avg = item.ki3Average ?? 0;
            const ki4Avg = item.ki4Average ?? 0;
            const ki3Desc = ki3Avg >= 90
                ? `Siswa menguasai materi ${item.subject} dengan sangat baik pada aspek pengetahuan.`
                : ki3Avg >= 80
                ? `Siswa memahami materi ${item.subject} dengan baik pada aspek pengetahuan.`
                : ki3Avg >= 75
                ? `Siswa cukup memahami materi ${item.subject} pada aspek pengetahuan.`
                : `Siswa perlu meningkatkan pemahaman materi ${item.subject} pada aspek pengetahuan.`;
            const ki4Desc = ki4Avg >= 90
                ? `Siswa menunjukkan keterampilan yang sangat baik dalam praktik ${item.subject}.`
                : ki4Avg >= 80
                ? `Siswa menunjukkan keterampilan yang baik dalam praktik ${item.subject}.`
                : ki4Avg >= 75
                ? `Siswa cukup terampil dalam praktik ${item.subject}.`
                : `Siswa perlu berlatih lebih banyak dalam praktik ${item.subject}.`;
            return {
                id:             item.id,
                subject:        item.subject,
                teacher:        item.teacher,
                ki3Scores:      item.ki3Scores ?? [],
                ki3Average:     ki3Avg,
                ki3Predicate:   item.ki3Predicate ?? '-',
                ki3Description: ki3Desc,
                ki4Scores:      item.ki4Scores ?? [],
                ki4Average:     ki4Avg,
                ki4Predicate:   item.ki4Predicate ?? '-',
                ki4Description: ki4Desc,
                finalAverage:   item.finalAverage ?? 0,
                finalGrade:     item.finalGrade ?? '-',
                kkm:            item.kkm,
                academicYear:   effectiveYearId,
                semester:       effectiveSemester as 'ganjil' | 'genap',
            };
        });
    }, [gradesQuery.data, effectiveYearId, effectiveSemester]);

    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        if (grades.length === 0) return {
            totalAverage:   0,
            highestSubject: { subject: '-', finalAverage: 0 },
            lowestSubject:  { subject: '-', finalAverage: 0 },
            aboveKKM:       0,
            totalSubjects:  0,
            currentRank:    gradesQuery.data?.rank ?? 0,
            totalStudents:  gradesQuery.data?.totalStudents ?? 0,
        };
        const totalAverage    = grades.reduce((sum, g) => sum + g.finalAverage, 0) / grades.length;
        const highestSubject  = grades.reduce((prev, cur) => prev.finalAverage > cur.finalAverage ? prev : cur);
        const lowestSubject   = grades.reduce((prev, cur) => prev.finalAverage < cur.finalAverage ? prev : cur);
        const aboveKKM        = grades.filter(g => g.finalAverage >= g.kkm).length;
        return {
            totalAverage:  Math.round(totalAverage * 10) / 10,
            highestSubject,
            lowestSubject,
            aboveKKM,
            totalSubjects: grades.length,
            currentRank:   gradesQuery.data?.rank ?? 0,
            totalStudents: gradesQuery.data?.totalStudents ?? 0,
        };
    }, [grades, gradesQuery.data]);

    // ── Attitude ──────────────────────────────────────────────────────────────
    const attitude: AttitudeScore = attitudeQuery.data
        ? {
            spiritual: {
                score:       attitudeQuery.data.spiritual.score as 'A' | 'B' | 'C',
                predicate:   attitudeQuery.data.spiritual.predicate as 'Sangat Baik' | 'Baik' | 'Cukup',
                description: attitudeQuery.data.spiritual.description,
            },
            social: {
                score:       attitudeQuery.data.social.score as 'A' | 'B' | 'C',
                predicate:   attitudeQuery.data.social.predicate as 'Sangat Baik' | 'Baik' | 'Cukup',
                description: attitudeQuery.data.social.description,
            },
        }
        : defaultAttitude;

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleApplyFilter = useCallback((yearId: string, semester: string) => {
        setSelectedYearId(yearId);
        setSelectedSemester(semester);
    }, []);

    // ── Derived ───────────────────────────────────────────────────────────────
    const activeYear      = academicYears.find(y => y.id === effectiveYearId);
    const displaySemester = effectiveSemester === 'ganjil' ? 'Ganjil' : 'Genap';

    const isLoading = academicYearsQuery.isLoading || (!!effectiveYearId && gradesQuery.isLoading);
    const isFetching = academicYearsQuery.isFetching || gradesQuery.isFetching
        || trendQuery.isFetching || attitudeQuery.isFetching || reportCardQuery.isFetching;

    const error = academicYearsQuery.error instanceof Error ? academicYearsQuery.error.message
        : gradesQuery.error instanceof Error ? gradesQuery.error.message : null;

    return {
        // Data
        grades,
        academicYears,
        activeYear,
        attitude,
        semesterHistory: (trendQuery.data ?? []) as SemesterSummary[],
        reportCardNotes: reportCardQuery.data ?? defaultReportCardNotes,
        stats,
        displaySemester,

        // Selected state
        selectedYearId:   effectiveYearId,
        selectedSemester: effectiveSemester,
        selectedTab,      setSelectedTab,
        filterOpen,       setFilterOpen,
        selectedGrade,    setSelectedGrade,

        // Callbacks
        handleApplyFilter,
        refetch: () => gradesQuery.refetch(),

        // Loading / error
        isLoading,
        isFetching,
        error,
    };
};
