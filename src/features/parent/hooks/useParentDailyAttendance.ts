import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDailyAttendance, getParentChildren, getAcademicYears, type DailyAttendanceRecord, type ChildInfo } from "../services/dailyAttendanceService";
import type { AcademicYearItem as AcademicYear } from "../services/parentApiClient";

interface AttendanceStats {
    totalDays: number; holidayCount: number; unrecordedCount: number;
    effectiveDays: number; presentCount: number; sickCount: number;
    permitCount: number; absentCount: number; percentage: number;
}

export const useParentDailyAttendance = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedYearId, setSelectedYearId] = useState<string>("");
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const childrenQuery = useQuery<ChildInfo[]>({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
        staleTime: 5 * 60 * 1000,
    });

    const academicYearsQuery = useQuery<AcademicYear[]>({
        queryKey: ["academic-years"],
        queryFn: getAcademicYears,
        staleTime: 10 * 60 * 1000,
    });

    const children = childrenQuery.data ?? [];
    const academicYears = academicYearsQuery.data ?? [];
    const effectiveChildId = selectedChildId || children[0]?.id || "";

    // Auto-derive effective year/semester from data
    const effectiveYearId = useMemo(() => {
        if (selectedYearId) return selectedYearId;
        return academicYears.find(y => y.isActive)?.id ?? academicYears[0]?.id ?? "";
    }, [selectedYearId, academicYears]);

    const effectiveSemesterId = useMemo(() => {
        if (selectedSemesterId) return selectedSemesterId;
        const year = academicYears.find(y => y.id === effectiveYearId);
        return year?.semesters.find(s => s.isActive)?.id ?? year?.semesters[0]?.id ?? "";
    }, [selectedSemesterId, academicYears, effectiveYearId]);

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

    const prevMonth = useCallback(() => {
        if (canGoPrev) setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }, [canGoPrev]);

    const nextMonth = useCallback(() => {
        if (canGoNext) setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }, [canGoNext]);

    const attendanceQuery = useQuery({
        queryKey: ["parent-daily-attendance", effectiveChildId, currentDate.getFullYear(), currentDate.getMonth(), effectiveSemesterId],
        queryFn: () => getDailyAttendance(effectiveChildId, currentDate.getFullYear(), currentDate.getMonth(), effectiveSemesterId),
        enabled: !!effectiveChildId && !!effectiveSemesterId,
        staleTime: 2 * 60 * 1000,
    });

    const records: DailyAttendanceRecord[] = attendanceQuery.data?.records ?? [];
    const childName = attendanceQuery.data?.childName ?? "";
    const childClass = attendanceQuery.data?.childClass ?? "";

    const stats = useMemo((): AttendanceStats => {
        const totalDays = records.length;
        const holidayCount = records.filter(r => r.status === "libur").length;
        const unrecordedCount = records.filter(r => r.status === "belum_dicatat").length;
        const effectiveDays = totalDays - holidayCount - unrecordedCount;
        const presentCount = records.filter(r => r.status === "hadir").length;
        const sickCount = records.filter(r => r.status === "sakit").length;
        const permitCount = records.filter(r => r.status === "izin").length;
        const absentCount = records.filter(r => r.status === "alpa").length;
        const percentage = effectiveDays > 0 ? Math.round((presentCount / effectiveDays) * 100) : 0;
        return { totalDays, holidayCount, unrecordedCount, effectiveDays, presentCount, sickCount, permitCount, absentCount, percentage };
    }, [records]);

    const error = childrenQuery.error instanceof Error
        ? childrenQuery.error.message
        : academicYearsQuery.error instanceof Error
        ? academicYearsQuery.error.message
        : attendanceQuery.error instanceof Error
        ? attendanceQuery.error.message
        : null;

    return {
        records, stats, children, academicYears,
        selectedChildId: effectiveChildId,
        selectedYearId: effectiveYearId,
        selectedSemesterId: effectiveSemesterId,
        childName, childClass, currentDate,
        isLoading: childrenQuery.isLoading || academicYearsQuery.isLoading || (!!effectiveChildId && attendanceQuery.isLoading),
        isFetching: childrenQuery.isFetching || attendanceQuery.isFetching,
        error,
        setSelectedChildId,
        setSelectedYearId: (id: string) => { setSelectedYearId(id); setSelectedSemesterId(""); },
        setSelectedSemesterId,
        prevMonth, nextMonth, canGoPrev, canGoNext,
        refetch: () => attendanceQuery.refetch(),
    };
};
