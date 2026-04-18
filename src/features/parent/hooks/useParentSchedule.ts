import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChildSchedule, getParentChildren, isScheduleCurrentlyHappening, DAYS, getSubjectColor, type ScheduleItem, type ChildScheduleData } from "../services/parentScheduleService";
import type { AcademicYearItem } from "../services/parentApiClient";

export const useParentSchedule = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedYearId, setSelectedYearId] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"daily" | "weekly">("weekly");

    const childrenQuery = useQuery<ChildScheduleData[]>({
        queryKey: ["parent-children-schedule"],
        queryFn: async () => {
            const children = await getParentChildren();
            return children.map(c => ({
                childId: c.id,
                childName: c.name,
                childClass: c.class,
                schedule: [],
                enrolledYears: c.enrolledYears ?? [],
            }));
        },
        staleTime: 5 * 60 * 1000,
    });

    const children = useMemo(() => childrenQuery.data ?? [], [childrenQuery.data]);
    const effectiveChildId = selectedChildId || children[0]?.childId || "";

    // Academic years available for the selected child — derived from their enrollment history.
    // This ensures the filter only shows years the child actually attended, not all years in the system.
    const academicYears = useMemo((): AcademicYearItem[] => {
        const activeChild = children.find(c => c.childId === effectiveChildId);
        return (activeChild?.enrolledYears ?? []).map(y => ({
            id: y.id,
            name: y.name,
            isActive: y.isActive,
            startDate: "",
            endDate: "",
            semesters: [],
        }));
    }, [children, effectiveChildId]);

    // Default to the active year among enrolled years, or the first (most recent) one
    const effectiveYearId = useMemo(() => {
        if (selectedYearId && academicYears.some(y => y.id === selectedYearId)) {
            return selectedYearId;
        }
        return academicYears.find(y => y.isActive)?.id ?? academicYears[0]?.id ?? "";
    }, [selectedYearId, academicYears]);

    const scheduleQuery = useQuery({
        queryKey: ["parent-schedule", effectiveChildId, effectiveYearId],
        queryFn: () => getChildSchedule(effectiveChildId, effectiveYearId),
        enabled: !!effectiveChildId && !!effectiveYearId,
        staleTime: 0,            // always refetch for fresh data
    });

    const scheduleData = scheduleQuery.data;
    const schedule = useMemo(() => scheduleData?.schedule ?? [], [scheduleData]);

    // Resolve child info from children list (schedule API doesn't return name/class)
    const activeChild = children.find(c => c.childId === effectiveChildId);
    const childName = activeChild?.childName ?? "";
    const childClass = activeChild?.childClass ?? "";

    const currentDay = useMemo(() => {
        const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        return dayNames[new Date().getDay()];
    }, []);

    const todaySchedule = useMemo(() =>
        currentDay === "Minggu" ? [] : schedule.filter(s => s.day === currentDay),
        [schedule, currentDay]
    );

    const filteredSchedule = useMemo(() =>
        selectedDay === "all" ? schedule : schedule.filter(s => s.day === selectedDay),
        [schedule, selectedDay]
    );

    const stats = useMemo(() => {
        const lessons = schedule.filter(s => s.type === 'lesson');
        return {
            totalLessons: lessons.length,
            uniqueSubjects: new Set(lessons.map(s => s.subject)).size,
            todayLessons: todaySchedule.filter(s => s.type === 'lesson').length,
            currentLesson: todaySchedule.find(isScheduleCurrentlyHappening) ?? null,
        };
    }, [schedule, todaySchedule]);

    const isLessonHappeningNow = useCallback((item: ScheduleItem) => isScheduleCurrentlyHappening(item), []);
    const getScheduleByDay = useCallback((day: string) => schedule.filter(s => s.day === day), [schedule]);

    const error = childrenQuery.error instanceof Error
        ? childrenQuery.error.message
        : scheduleQuery.error instanceof Error
        ? scheduleQuery.error.message
        : null;

    // Reset selectedYearId when child changes so it defaults to active year of new child
    const handleSetSelectedChildId = (id: string) => {
        setSelectedChildId(id);
        setSelectedYearId("");
    };

    return {
        schedule: filteredSchedule, stats, children, academicYears,
        selectedChildId: effectiveChildId, selectedYearId: effectiveYearId,
        selectedDay, viewMode, childName, childClass,
        isLoading: childrenQuery.isLoading || (!!effectiveChildId && !!effectiveYearId && scheduleQuery.isLoading),
        isFetching: childrenQuery.isFetching || scheduleQuery.isFetching,
        // true hanya saat belum ada data untuk key ini (first fetch) — bukan background refetch
        // Ini memastikan skeleton tidak muncul saat switch ke anak yang sudah pernah di-cache
        isScheduleFetching: !!effectiveChildId && !!effectiveYearId && scheduleQuery.isLoading,
        isError: !!childrenQuery.error || !!scheduleQuery.error,
        errorMessage: error,
        currentDay, todaySchedule,
        days: DAYS, getSubjectColor,
        setSelectedChildId: handleSetSelectedChildId,
        setSelectedYearId: (id: string) => setSelectedYearId(id),
        setSelectedDay, setViewMode,
        refetch: () => { childrenQuery.refetch(); scheduleQuery.refetch(); },
        isLessonHappeningNow, getScheduleByDay,
    };
};
