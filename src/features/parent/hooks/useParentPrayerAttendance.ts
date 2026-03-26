import { useState, useEffect, useCallback } from "react";
import {
    getPrayerAttendance,
    getParentChildren,
    type PrayerRecord,
    type ChildInfo,
} from "../services/parentPrayerAttendanceService";

export const useParentPrayerAttendance = () => {
    const [records, setRecords] = useState<PrayerRecord[]>([]);
    const [children, setChildren] = useState<ChildInfo[]>([]);
    
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [weekOffset, setWeekOffset] = useState<number>(0);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch for Children
    useEffect(() => {
        const init = async () => {
            try {
                const childrenData = await getParentChildren();
                setChildren(childrenData);
                if (childrenData.length > 0) {
                    setSelectedChildId(childrenData[0].id);
                }
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
        if (!isInitial) {
            setIsFetching(true);
        }
        setError(null);

        try {
            const data = await getPrayerAttendance(selectedChildId, weekOffset);
            setRecords(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat riwayat presensi sholat.";
            setError(message);
            setRecords([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [selectedChildId, weekOffset]); 

    useEffect(() => {
        if (selectedChildId) {
            fetchRecords();
        }
    }, [fetchRecords]);

    const refetch = useCallback(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleNextWeek = () => setWeekOffset(prev => prev + 1);
    const handlePrevWeek = () => setWeekOffset(prev => prev - 1);
    const handleTodayWeek = () => setWeekOffset(0);

    return {
        records,
        children,
        selectedChildId,
        weekOffset,
        isLoading,
        isFetching,
        error,
        setSelectedChildId,
        handleNextWeek,
        handlePrevWeek,
        handleTodayWeek,
        refetch,
    };
};
