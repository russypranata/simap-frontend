import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getDailyAttendance,
    getParentChildren,
    getAcademicYears,
    type DailyAttendanceRecord,
    type ChildInfo,
} from "../services/dailyAttendanceService";
import type { AcademicYearItem as AcademicYear } from "../services/parentApiClient";

interface AttendanceStats {
    totalDays: number;
    holidayCount: number;
    unrecordedCount: number;
    effectiveDays: number;
    presentCount: number;
    sickCount: number;
    permitCount: number;
    absentCount: number;
    percentage: number;
}

interface UseParentDailyAttendanceReturn {
    // Data
    records: DailyAttendanceRecord[];
    stats: AttendanceStats;
    children: ChildInfo[];
    academicYears: AcademicYear[];
    
    // State
    selectedChildId: string;
    childName: string;
    childClass: string;
    selectedYearId: string;
    selectedSemesterId: string;
    currentDate: Date;
    isLoading: boolean;
    isFetching: boolean;
    error: string | null;

    // Actions
    setSelectedChildId: (id: string) => void;
    setSelectedYearId: (id: string) => void;
    setSelectedSemesterId: (id: string) => void;
    prevMonth: () => void;
    nextMonth: () => void;
    canGoPrev: boolean;
    canGoNext: boolean;
    refetch: () => void;
}

export const useParentDailyAttendance = (): UseParentDailyAttendanceReturn => {
    const [records, setRecords] = useState<DailyAttendanceRecord[]>([]);
    const [children, setChildren] = useState<ChildInfo[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedYearId, setSelectedYearId] = useState<string>("");
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    
    const [childName, setChildName] = useState<string>("");
    const [childClass, setChildClass] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch for Children and Academic Years
    useEffect(() => {
        const init = async () => {
            try {
                const [childrenData, yearsData] = await Promise.all([
                    getParentChildren(),
                    getAcademicYears()
                ]);
                
                setChildren(childrenData);
                setAcademicYears(yearsData);
                
                if (childrenData.length > 0) {
                    setSelectedChildId(childrenData[0].id);
                }
                
                const activeYear = yearsData.find(y => y.isActive) || yearsData[0];
                if (activeYear) {
                    setSelectedYearId(activeYear.id);
                    const activeSem = activeYear.semesters.find(s => s.isActive) || activeYear.semesters[0];
                    if (activeSem) {
                        setSelectedSemesterId(activeSem.id);
                        
                        // Snap current date to active semester bounds
                        const now = new Date();
                        const semStart = new Date(activeSem.startDate);
                        const semEnd = new Date(activeSem.endDate);
                        
                        if (now < semStart) setCurrentDate(semStart);
                        else if (now > semEnd) setCurrentDate(semEnd);
                        else setCurrentDate(now);
                    }
                }
            } catch {
                setError("Gagal memuat data awal.");
                setIsLoading(false);
            }
        };
        init();
    }, []);

    // Snap date when Semester changes
    useEffect(() => {
        if (!selectedYearId || !selectedSemesterId || academicYears.length === 0) return;
        
        const year = academicYears.find(y => y.id === selectedYearId);
        const sem = year?.semesters.find(s => s.id === selectedSemesterId);
        
        if (sem) {
            const semStart = new Date(sem.startDate);
            const semEnd = new Date(sem.endDate);
            const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const semMonthStart = new Date(semStart.getFullYear(), semStart.getMonth(), 1);
            const semMonthEnd = new Date(semEnd.getFullYear(), semEnd.getMonth(), 1);
            
            // If the current date is completely outside the new semester bounds, snap to start date
            if (currentMonthStart < semMonthStart) {
                setCurrentDate(semStart);
            } else if (currentMonthStart > semMonthEnd) {
                setCurrentDate(semEnd);
            }
        }
    }, [selectedSemesterId, selectedYearId, academicYears, currentDate]);

    // Derived State for Navigation Bounds
    const activeSemester = useMemo(() => {
        if (!selectedYearId || !selectedSemesterId) return null;
        const year = academicYears.find(y => y.id === selectedYearId);
        return year?.semesters.find(s => s.id === selectedSemesterId) || null;
    }, [academicYears, selectedYearId, selectedSemesterId]);

    const canGoPrev = useMemo(() => {
        if (!activeSemester) return false;
        const semStart = new Date(activeSemester.startDate);
        const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const semMonthStart = new Date(semStart.getFullYear(), semStart.getMonth(), 1);
        return currentMonthStart > semMonthStart;
    }, [currentDate, activeSemester]);

    const canGoNext = useMemo(() => {
        if (!activeSemester) return false;
        const semEnd = new Date(activeSemester.endDate);
        const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const semMonthEnd = new Date(semEnd.getFullYear(), semEnd.getMonth(), 1);
        return currentMonthStart < semMonthEnd;
    }, [currentDate, activeSemester]);

    const prevMonth = useCallback(() => {
        if (canGoPrev) {
            setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        }
    }, [canGoPrev]);

    const nextMonth = useCallback(() => {
        if (canGoNext) {
            setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
        }
    }, [canGoNext]);

    // Fetch Attendance Data
    const fetchAttendance = useCallback(async () => {
        if (!selectedChildId || !selectedSemesterId) return;

        const isInitial = records.length === 0;
        if (isInitial) {
            setIsLoading(true);
        } else {
            setIsFetching(true);
        }
        setError(null);

        try {
            const data = await getDailyAttendance(
                selectedChildId,
                currentDate.getFullYear(),
                currentDate.getMonth(),
                selectedSemesterId
            );
            setRecords(data.records);
            setChildName(data.childName);
            setChildClass(data.childClass);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat data presensi.";
            setError(message);
            setRecords([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
        // Exclude currentDate from dependencies if we only fetch when month actually changes
    }, [selectedChildId, currentDate.getFullYear(), currentDate.getMonth(), selectedSemesterId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    // Calculate stats
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

    const refetch = useCallback(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    return {
        records,
        stats,
        children,
        academicYears,
        selectedChildId,
        selectedYearId,
        selectedSemesterId,
        childName,
        childClass,
        currentDate,
        isLoading,
        isFetching,
        error,
        setSelectedChildId,
        setSelectedYearId,
        setSelectedSemesterId,
        prevMonth,
        nextMonth,
        canGoPrev,
        canGoNext,
        refetch,
    };
};
