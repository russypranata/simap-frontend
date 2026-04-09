import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPrayerAttendanceByMonth, getParentChildren, type PrayerRecord, type ChildInfo } from "../services/parentPrayerAttendanceService";

export const useParentPrayerAttendance = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

    const childrenQuery = useQuery<ChildInfo[]>({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
        staleTime: 5 * 60 * 1000,
    });

    const children = childrenQuery.data ?? [];
    const effectiveChildId = selectedChildId || children[0]?.id || "";

    const prayerQuery = useQuery<PrayerRecord[]>({
        queryKey: ["parent-prayer", effectiveChildId, selectedYear, selectedMonth],
        queryFn: () => getPrayerAttendanceByMonth(effectiveChildId, selectedYear, selectedMonth),
        enabled: !!effectiveChildId,
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
    const handleCurrentMonth = () => {
        setSelectedMonth(today.getMonth());
        setSelectedYear(today.getFullYear());
    };

    const error = childrenQuery.error instanceof Error
        ? childrenQuery.error.message
        : prayerQuery.error instanceof Error
        ? prayerQuery.error.message
        : null;

    return {
        records: prayerQuery.data ?? [],
        children,
        selectedChildId: effectiveChildId,
        selectedMonth,
        selectedYear,
        isLoading: childrenQuery.isLoading || (!!effectiveChildId && prayerQuery.isLoading),
        isFetching: childrenQuery.isFetching || prayerQuery.isFetching,
        error,
        isCurrentMonth,
        setSelectedChildId,
        handlePrevMonth,
        handleNextMonth,
        handleCurrentMonth,
        refetch: () => prayerQuery.refetch(),
    };
};
