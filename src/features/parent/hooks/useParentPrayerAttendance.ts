import { useState, useEffect, useCallback } from "react";
import {
    getPrayerAttendanceByMonth,
    getParentChildren,
    type PrayerRecord,
    type ChildInfo,
} from "../services/parentPrayerAttendanceService";

export const useParentPrayerAttendance = () => {
    const [records, setRecords] = useState<PrayerRecord[]>([]);
    const [children, setChildren] = useState<ChildInfo[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>("");

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const childrenData = await getParentChildren();
                setChildren(childrenData);
                if (childrenData.length > 0) setSelectedChildId(childrenData[0].id);
            } catch {
                setError("Gagal memuat daftar anak.");
                setIsLoading(false);
            }
        };
        init();
    }, []);

    const fetchRecords = useCallback(async () => {
        if (!selectedChildId) return;

        const isInitial = records.length === 0 && isLoading;
        if (!isInitial) setIsFetching(true);
        setError(null);

        try {
            const data = await getPrayerAttendanceByMonth(selectedChildId, selectedYear, selectedMonth);
            setRecords(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat riwayat presensi sholat.";
            setError(message);
            setRecords([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [selectedChildId, selectedMonth, selectedYear]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (selectedChildId) fetchRecords();
    }, [fetchRecords]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePrevMonth = () => {
        if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
        else setSelectedMonth(m => m - 1);
    };
    const handleNextMonth = () => {
        if (selectedYear === today.getFullYear() && selectedMonth === today.getMonth()) return;
        if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
        else setSelectedMonth(m => m + 1);
    };
    const handleCurrentMonth = () => {
        setSelectedMonth(today.getMonth());
        setSelectedYear(today.getFullYear());
    };

    const isCurrentMonth = selectedMonth === today.getMonth() && selectedYear === today.getFullYear();

    return {
        records,
        children,
        selectedChildId,
        selectedMonth,
        selectedYear,
        isLoading,
        isFetching,
        error,
        isCurrentMonth,
        setSelectedChildId,
        handlePrevMonth,
        handleNextMonth,
        handleCurrentMonth,
        refetch: fetchRecords,
    };
};
