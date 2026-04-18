import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentDailyAttendance, type DailyAttendanceRecord } from '../services/studentAttendanceService';
import { getAcademicYears, type AcademicYearItem } from '@/features/parent/services/parentApiClient';

export const useStudentDailyAttendance = () => {
    const [selectedYearId, setSelectedYearId] = useState<string>('');
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const academicYearsQuery = useQuery<AcademicYearItem[]>({
        queryKey: ['academic-years'],
        queryFn: getAcademicYears,
        staleTime: 10 * 60 * 1000,
    });

    const academicYears = useMemo(() => academicYearsQuery.data ?? [], [academicYearsQuery.data]);

    const effectiveYearId = useMemo(() => {
        if (selectedYearId) return selectedYearId;
        return academicYears.find(y => y.isActive)?.id ?? academicYears[0]?.id ?? '';
    }, [selectedYearId, academicYears]);

    const effectiveSemesterId = useMemo(() => {
        if (selectedSemesterId) return selectedSemesterId;
        const year = academicYears.find(y => y.id === effectiveYearId);
        return year?.semesters.find(s => s.isActive)?.id ?? year?.semesters[0]?.id ?? '';
    }, [selectedSemesterId, academicYears, effectiveYearId]);

    const attendanceQuery = useQuery({
        queryKey: ['student-daily-attendance', currentDate.getFullYear(), currentDate.getMonth(), effectiveSemesterId],
        queryFn: () => getStudentDailyAttendance(currentDate.getFullYear(), currentDate.getMonth(), effectiveSemesterId),
        enabled: !!effectiveSemesterId,
        staleTime: 2 * 60 * 1000,
    });

    const records: DailyAttendanceRecord[] = useMemo(() => attendanceQuery.data?.records ?? [], [attendanceQuery.data]);

    const activeSemester = useMemo(() => {
        const year = academicYears.find(y => y.id === effectiveYearId);
        return year?.semesters.find(s => s.id === effectiveSemesterId) ?? null;
    }, [academicYears, effectiveYearId, effectiveSemesterId]);

    const canGoPrev = useMemo(() => {
        if (!activeSemester) return false;
        const semStart = new Date(activeSemester.startDate);
        const cur = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        return cur > new Date(semStart.getFullYear(), semStart.getMonth(), 1);
    }, [currentDate, activeSemester]);

    const canGoNext = useMemo(() => {
        if (!activeSemester) return false;
        const semEnd = new Date(activeSemester.endDate);
        const cur = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        return cur < new Date(semEnd.getFullYear(), semEnd.getMonth(), 1);
    }, [currentDate, activeSemester]);

    const stats = useMemo(() => {
        const totalDays      = records.length;
        const holidayCount   = records.filter(r => r.status === 'libur').length;
        const unrecordedCount = records.filter(r => r.status === 'belum_dicatat').length;
        const effectiveDays  = totalDays - holidayCount - unrecordedCount;
        const presentCount   = records.filter(r => r.status === 'hadir').length;
        const sickCount      = records.filter(r => r.status === 'sakit').length;
        const permitCount    = records.filter(r => r.status === 'izin').length;
        const absentCount    = records.filter(r => r.status === 'alpa').length;
        const percentage     = effectiveDays > 0 ? Math.round((presentCount / effectiveDays) * 100) : 0;
        return { totalDays, holidayCount, unrecordedCount, effectiveDays, presentCount, sickCount, permitCount, absentCount, percentage };
    }, [records]);

    const error = academicYearsQuery.error instanceof Error ? academicYearsQuery.error.message
        : attendanceQuery.error instanceof Error ? attendanceQuery.error.message : null;

    return {
        records, stats, academicYears,
        selectedYearId: effectiveYearId,
        selectedSemesterId: effectiveSemesterId,
        currentDate,
        isLoading:  academicYearsQuery.isLoading || (!!effectiveSemesterId && attendanceQuery.isLoading),
        isFetching: attendanceQuery.isFetching,
        error,
        setSelectedYearId: (id: string) => { setSelectedYearId(id); setSelectedSemesterId(''); },
        setSelectedSemesterId,
        prevMonth: useCallback(() => { if (canGoPrev) setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)); }, [canGoPrev]),
        nextMonth: useCallback(() => { if (canGoNext) setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)); }, [canGoNext]),
        canGoPrev, canGoNext,
        refetch: () => attendanceQuery.refetch(),
    };
};
