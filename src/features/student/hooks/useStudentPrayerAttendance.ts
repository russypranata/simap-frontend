import { useState, useEffect, useCallback } from "react";
import { getStudentPrayerAttendanceByMonth, type PrayerRecord } from "../services/studentPrayerAttendanceService";

export const useStudentPrayerAttendance = () => {
    const [records, setRecords] = useState<PrayerRecord[]>([]);
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        const isInitial = records.length === 0 && isLoading;
        if (!isInitial) setIsFetching(true);
        setError(null);
        try {
            const data = await getStudentPrayerAttendanceByMonth(selectedYear, selectedMonth);
            setRecords(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat riwayat presensi sholat.");
            setRecords([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);

    const handlePrevMonth = () => {
        if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
        else setSelectedMonth(m => m - 1);
    };
    const handleNextMonth = () => {
        if (selectedYear === today.getFullYear() && selectedMonth === today.getMonth()) return;
        if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
        else setSelectedMonth(m => m + 1);
    };

    return {
        records, selectedMonth, selectedYear, isLoading, isFetching, error,
        isCurrentMonth: selectedMonth === today.getMonth() && selectedYear === today.getFullYear(),
        handlePrevMonth, handleNextMonth,
        handleCurrentMonth: () => { setSelectedMonth(today.getMonth()); setSelectedYear(today.getFullYear()); },
        refetch: fetchRecords,
    };
};
