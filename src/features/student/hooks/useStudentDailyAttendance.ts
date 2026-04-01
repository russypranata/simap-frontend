import { useState, useEffect, useCallback, useMemo } from "react";
import { getStudentDailyAttendance, type DailyAttendanceRecord } from "../services/studentAttendanceService";
import { mockAcademicYears, type AcademicYear } from "../services/studentMorningAttendanceService";

export const useStudentDailyAttendance = () => {
    const [records, setRecords] = useState<DailyAttendanceRecord[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [selectedYearId, setSelectedYearId] = useState<string>("");
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const years = mockAcademicYears;
                setAcademicYears(years);
                const activeYear = years.find(y => y.isActive) || years[0];
                if (activeYear) {
                    setSelectedYearId(activeYear.id);
                    const activeSem = activeYear.semesters.find(s => s.isActive) || activeYear.semesters[0];
                    if (activeSem) setSelectedSemesterId(activeSem.id);
                }
            } catch {
                setError("Gagal memuat data awal.");
                setIsLoading(false);
            }
        };
        init();
    }, []);

    const fetchAttendance = useCallback(async () => {
        if (!selectedSemesterId) return;
        const isInitial = records.length === 0;
        if (isInitial) setIsLoading(true);
        else setIsFetching(true);
        setError(null);
        try {
            const data = await getStudentDailyAttendance(currentDate.getFullYear(), currentDate.getMonth(), selectedSemesterId);
            setRecords(data.records);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memuat data presensi.");
            setRecords([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [selectedSemesterId, currentDate.getFullYear(), currentDate.getMonth()]);

    useEffect(() => { if (selectedSemesterId) fetchAttendance(); }, [fetchAttendance]);

    const activeSemester = useMemo(() => {
        const year = academicYears.find(y => y.id === selectedYearId);
        return year?.semesters.find(s => s.id === selectedSemesterId) || null;
    }, [academicYears, selectedYearId, selectedSemesterId]);

    const stats = useMemo(() => {
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

    const canGoPrev = useMemo(() => {
        if (!activeSemester) return false;
        const semStart = new Date(activeSemester.id.includes("sem-1") ? "2025-07-01" : "2026-01-01");
        const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        return currentMonthStart > new Date(semStart.getFullYear(), semStart.getMonth(), 1);
    }, [currentDate, activeSemester]);

    const canGoNext = useMemo(() => {
        const now = new Date();
        const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const nowMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return currentMonthStart < nowMonthStart;
    }, [currentDate]);

    return {
        records, stats, academicYears, selectedYearId, selectedSemesterId, currentDate,
        isLoading, isFetching, error,
        setSelectedYearId, setSelectedSemesterId,
        prevMonth: () => { if (canGoPrev) setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)); },
        nextMonth: () => { if (canGoNext) setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)); },
        canGoPrev, canGoNext,
        refetch: fetchAttendance,
    };
};
