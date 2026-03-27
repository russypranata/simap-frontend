import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getChildSchedule,
    getParentChildren,
    getAcademicYears,
    isScheduleCurrentlyHappening,
    DAYS,
    getSubjectColor,
    type ScheduleItem,
    type ChildScheduleData,
    type AcademicYearData,
} from "../services/parentScheduleService";

interface ScheduleStats {
    totalLessons: number;
    uniqueSubjects: number;
    todayLessons: number;
    currentLesson: ScheduleItem | null;
}

interface UseParentScheduleReturn {
    // Data
    schedule: ScheduleItem[];
    stats: ScheduleStats;
    children: ChildScheduleData[];
    academicYears: AcademicYearData[];

    // Selected states
    selectedChildId: string;
    selectedYearId: string;
    selectedDay: string;
    viewMode: "daily" | "weekly";

    // UI states
    childName: string;
    childClass: string;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    errorMessage: string | null;
    currentDay: string;
    todaySchedule: ScheduleItem[];

    // Constants and utilities
    days: string[];
    getSubjectColor: (subject: string) => string;

    // Actions
    setSelectedChildId: (id: string) => void;
    setSelectedYearId: (id: string) => void;
    setSelectedDay: (day: string) => void;
    setViewMode: (mode: "daily" | "weekly") => void;
    refetch: () => void;

    // Helper functions
    isLessonHappeningNow: (item: ScheduleItem) => boolean;
    getScheduleByDay: (day: string) => ScheduleItem[];
}

export const useParentSchedule = (): UseParentScheduleReturn => {
    // Data states
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [children, setChildren] = useState<ChildScheduleData[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYearData[]>([]);

    // Selection states
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedYearId, setSelectedYearId] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"daily" | "weekly">("weekly");

    // UI states
    const [childName, setChildName] = useState<string>("");
    const [childClass, setChildClass] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Get current day
    const currentDay = useMemo(() => {
        const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        return dayNames[new Date().getDay()];
    }, []);

    // Initial fetch for children and academic years
    useEffect(() => {
        const init = async () => {
            try {
                const [childrenData, yearsData] = await Promise.all([
                    getParentChildren(),
                    getAcademicYears(),
                ]);

                setChildren(childrenData);
                setAcademicYears(yearsData);

                if (childrenData.length > 0) {
                    setSelectedChildId(childrenData[0].childId);
                }

                const activeYear = yearsData.find((y) =>
                    y.semesters.some((s) => s.isActive)
                ) || yearsData[0];

                if (activeYear) {
                    setSelectedYearId(activeYear.id);
                }
            } catch {
                setIsError(true);
                setErrorMessage("Gagal memuat data awal.");
                setIsLoading(false);
            }
        };
        init();
    }, []);

    // Fetch schedule data
    const fetchSchedule = useCallback(async () => {
        if (!selectedChildId) return;

        const isInitial = schedule.length === 0;
        if (isInitial) {
            setIsLoading(true);
        } else {
            setIsFetching(true);
        }
        setIsError(false);
        setErrorMessage(null);

        try {
            const data = await getChildSchedule(
                selectedChildId,
                selectedYearId
            );
            setSchedule(data.schedule);
            setChildName(data.childName);
            setChildClass(data.childClass);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Gagal memuat data jadwal.";
            setErrorMessage(message);
            setIsError(true);
            setSchedule([]);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChildId, selectedYearId]);

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    // Get today's schedule
    const todaySchedule = useMemo(() => {
        if (currentDay === "Minggu") return [];
        return schedule.filter((item) => item.day === currentDay);
    }, [schedule, currentDay]);

    // Filter schedule based on selected day
    const filteredSchedule = useMemo(() => {
        if (selectedDay === "all") return schedule;
        return schedule.filter((item) => item.day === selectedDay);
    }, [schedule, selectedDay]);

    // Get schedule by day helper
    const getScheduleByDay = useCallback(
        (day: string): ScheduleItem[] => {
            return schedule.filter((item) => item.day === day);
        },
        [schedule]
    );

    // Check if lesson is happening now
    const isLessonHappeningNow = useCallback((item: ScheduleItem): boolean => {
        return isScheduleCurrentlyHappening(item);
    }, []);

    // Get current lesson (real-time tracking)
    const currentLesson = useMemo(() => {
        return todaySchedule.find(isScheduleCurrentlyHappening) || null;
    }, [todaySchedule]);

    // Calculate stats
    const stats = useMemo((): ScheduleStats => {
        const totalLessons = schedule.length;
        const uniqueSubjects = new Set(schedule.map((s) => s.subject)).size;
        const todayLessons = todaySchedule.length;

        return {
            totalLessons,
            uniqueSubjects,
            todayLessons,
            currentLesson,
        };
    }, [schedule, todaySchedule, currentLesson]);

    // Refetch function
    const refetch = useCallback(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    return {
        // Data
        schedule: filteredSchedule,
        stats,
        children,
        academicYears,

        // Selected states
        selectedChildId,
        selectedYearId,
        selectedDay,
        viewMode,

        // UI states
        childName,
        childClass,
        isLoading,
        isFetching,
        isError,
        errorMessage,
        currentDay,
        todaySchedule,

        // Constants and utilities
        days: DAYS,
        getSubjectColor,

        // Actions
        setSelectedChildId,
        setSelectedYearId,
        setSelectedDay,
        setViewMode,
        refetch,

        // Helper functions
        isLessonHappeningNow,
        getScheduleByDay,
    };
};
