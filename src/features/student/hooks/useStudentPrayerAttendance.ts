import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentPrayerAttendanceByMonth, type PrayerRecord } from '../services/studentPrayerAttendanceService';

export const useStudentPrayerAttendance = () => {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
    const [selectedYear, setSelectedYear]   = useState<number>(today.getFullYear());

    const query = useQuery<PrayerRecord[]>({
        queryKey: ['student-prayer', selectedYear, selectedMonth],
        queryFn: () => getStudentPrayerAttendanceByMonth(selectedYear, selectedMonth),
        staleTime: 2 * 60 * 1000,
    });

    const isCurrentMonth = selectedMonth === today.getMonth() && selectedYear === today.getFullYear();

    const handlePrevMonth = () => {
        if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
        else setSelectedMonth(m => m - 1);
    };
    const handleNextMonth = () => {
        if (isCurrentMonth) return;
        if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
        else setSelectedMonth(m => m + 1);
    };

    return {
        records:     query.data ?? [],
        selectedMonth, selectedYear,
        isLoading:   query.isLoading,
        isFetching:  query.isFetching,
        error:       query.error instanceof Error ? query.error.message : null,
        isCurrentMonth,
        handlePrevMonth,
        handleNextMonth,
        handleCurrentMonth: () => { setSelectedMonth(today.getMonth()); setSelectedYear(today.getFullYear()); },
        refetch: query.refetch,
    };
};
