'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentSchedule, isScheduleCurrentlyHappening, getSubjectColor, DAYS, type ScheduleItem } from '../services/studentScheduleService';

export const useStudentSchedule = () => {
    const query = useQuery<ScheduleItem[]>({
        queryKey: ['student-schedule'],
        queryFn: getStudentSchedule,
        staleTime: 5 * 60 * 1000,
    });

    const schedule = query.data ?? [];

    const currentDay = useMemo(() => {
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return dayNames[new Date().getDay()];
    }, []);

    const todaySchedule = useMemo(() =>
        currentDay === 'Minggu' ? [] : schedule.filter(s => s.day === currentDay),
        [schedule, currentDay]
    );

    const stats = useMemo(() => {
        const lessons = schedule.filter(s => s.type === 'lesson');
        return {
            totalLessons:    lessons.length,
            uniqueSubjects:  new Set(lessons.map(s => s.subject)).size,
            todayLessons:    todaySchedule.filter(s => s.type === 'lesson').length,
            currentLesson:   todaySchedule.find(isScheduleCurrentlyHappening) ?? null,
        };
    }, [schedule, todaySchedule]);

    return {
        schedule,
        todaySchedule,
        stats,
        currentDay,
        days: DAYS,
        getSubjectColor,
        isLessonHappeningNow: isScheduleCurrentlyHappening,
        isLoading:  query.isLoading,
        isFetching: query.isFetching,
        error:      query.error instanceof Error ? query.error.message : null,
        refetch:    query.refetch,
    };
};
