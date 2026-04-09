import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChildSchedule, getParentChildren, isScheduleCurrentlyHappening, DAYS, getSubjectColor, type ScheduleItem, type ChildScheduleData } from "../services/parentScheduleService";
import { getAcademicYears, type AcademicYearItem } from "../services/parentApiClient";

export const useParentSchedule = () => {
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [selectedYearId, setSelectedYearId] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"daily" | "weekly">("weekly");

    const childrenQuery = useQuery<ChildScheduleData[]>({
        queryKey: ["parent-children-schedule"],
        queryFn: async () => {
            const children = await getParentChildren();
            return children.map(c => ({ childId: c.id, childName: c.name, childClass: c.class, schedule: [] }));
        },
        staleTime: 5 * 60 * 1000,
    });

    const academicYearsQuery = useQuery<AcademicYearItem[]>({
        queryKey: ["academic-years"],
        queryFn: getAcademicYears,
        staleTime: 10 * 60 * 1000,
    });

    const children = childrenQuery.data ?? [];
    const academicYears = academicYearsQuery.data ?? [];
    const effectiveChildId = selectedChildId || children[0]?.childId || "";

    const effectiveYearId = useMemo(() => {
        if (selectedYearId) return selectedYearId;
        return academicYears.find(y => y.isActive)?.id ?? academicYears[0]?.id ?? "";
    }, [selectedYearId, academicYears]);

    const scheduleQuery = useQuery({
        queryKey: ["parent-schedule", effectiveChildId, effectiveYearId],
        queryFn: () => getChildSchedule(effectiveChildId, effectiveYearId),
        enabled: !!effectiveChildId,
        staleTime: 5 * 60 * 1000,
    });

    const scheduleData = scheduleQuery.data;
    const schedule = scheduleData?.schedule ?? [];
    const childName = scheduleData?.childName ?? children.find(c => c.childId === effectiveChildId)?.childName ?? "";
    const childClass = scheduleData?.childClass ?? children.find(c => c.childId === effectiveChildId)?.childClass ?? "";

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

    const stats = useMemo(() => ({
        totalLessons: schedule.length,
        uniqueSubjects: new Set(schedule.map(s => s.subject)).size,
        todayLessons: todaySchedule.length,
        currentLesson: todaySchedule.find(isScheduleCurrentlyHappening) ?? null,
    }), [schedule, todaySchedule]);

    const isLessonHappeningNow = useCallback((item: ScheduleItem) => isScheduleCurrentlyHappening(item), []);
    const getScheduleByDay = useCallback((day: string) => schedule.filter(s => s.day === day), [schedule]);

    const error = childrenQuery.error instanceof Error
        ? childrenQuery.error.message
        : scheduleQuery.error instanceof Error
        ? scheduleQuery.error.message
        : null;

    return {
        schedule: filteredSchedule, stats, children, academicYears,
        selectedChildId: effectiveChildId, selectedYearId: effectiveYearId,
        selectedDay, viewMode, childName, childClass,
        isLoading: childrenQuery.isLoading || (!!effectiveChildId && scheduleQuery.isLoading),
        isFetching: childrenQuery.isFetching || scheduleQuery.isFetching,
        isError: !!scheduleQuery.error,
        errorMessage: error,
        currentDay, todaySchedule,
        days: DAYS, getSubjectColor,
        setSelectedChildId,
        setSelectedYearId: (id: string) => setSelectedYearId(id),
        setSelectedDay, setViewMode,
        refetch: () => scheduleQuery.refetch(),
        isLessonHappeningNow, getScheduleByDay,
    };
};
