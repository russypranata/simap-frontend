"use client";

import React, { useMemo } from "react";
import { CalendarIcon, BookOpen, GraduationCap, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatCard, ErrorState, EmptyState } from "@/features/shared/components";
import {
    CurrentlyActiveLessonCard,
    WeeklyCalendarGrid,
} from "@/features/parent/components/schedule";
import type { ScheduleItem as ParentScheduleItem } from "@/features/parent/services/parentScheduleService";
import { useAcademicYear } from "@/context/AcademicYearContext";
import { useStudentSchedule } from "../hooks/useStudentSchedule";
import type { ScheduleItem } from "../services/studentScheduleService";

// Skeleton
const ScheduleSkeleton = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
                <div className="h-10 w-64 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-72 bg-slate-200 rounded animate-pulse" />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl bg-white shadow-sm p-5 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 bg-slate-200 rounded-xl animate-pulse" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                            <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
                </div>
            ))}
        </div>
        <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="space-y-2 flex-1">
                        <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-56 bg-slate-200 rounded animate-pulse" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-2 min-w-[640px]">
                    <div className="grid grid-cols-6 gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-9 bg-slate-200 rounded-lg animate-pulse" />
                        ))}
                    </div>
                    {Array.from({ length: 8 }).map((_, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-6 gap-2">
                            <div className="h-[80px] bg-slate-200 rounded-lg animate-pulse" />
                            {Array.from({ length: 5 }).map((_, colIndex) => (
                                <div key={colIndex} className="h-[80px] bg-slate-200/50 rounded-lg animate-pulse border border-dashed border-slate-200" />
                            ))}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

// Adapter: student ScheduleItem → parent ScheduleItem (same shape, just cast)
const toParentItem = (item: ScheduleItem): ParentScheduleItem => item as unknown as ParentScheduleItem;

export const StudentSchedule: React.FC = () => {
    const { academicYear } = useAcademicYear();
    const {
        schedule,
        todaySchedule,
        stats,
        currentDay,
        days,
        isLessonHappeningNow,
        getSubjectColor,
        isLoading,
        error,
        refetch,
    } = useStudentSchedule();

    const currentLesson = todaySchedule.find(isLessonHappeningNow) ?? null;

    const scheduleByDay = useMemo(() => {
        const grouped: Record<string, ParentScheduleItem[]> = {};
        days.forEach((day) => {
            grouped[day] = schedule.filter((item) => item.day === day).map(toParentItem);
        });
        return grouped;
    }, [schedule, days]);

    if (isLoading) return <ScheduleSkeleton />;
    if (error) return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Jadwal </span>
                    <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Pelajaran</span>
                </h1>
            </div>
            <ErrorState error={error} onRetry={refetch} />
        </div>
    );

    if (schedule.length === 0) return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Jadwal </span>
                    <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Pelajaran</span>
                </h1>
            </div>
            <EmptyState
                icon={() => <CalendarIcon className="h-8 w-8 text-slate-400" />}
                title="Tidak Ada Data Jadwal"
                description="Belum ada data jadwal pelajaran yang terdaftar."
            />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Jadwal </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Pelajaran</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <CalendarIcon className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">Jadwal pelajaran mingguan kamu · TA. {academicYear.academicYear}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Total Jam Pelajaran"
                    value={stats.totalLessons}
                    unit="JP / minggu"
                    subtitle="Seluruh hari Senin–Jumat"
                    icon={BookOpen}
                    color="blue"
                />
                <StatCard
                    title="Mata Pelajaran"
                    value={stats.uniqueSubjects}
                    unit="mapel"
                    subtitle="Jumlah mapel unik"
                    icon={GraduationCap}
                    color="amber"
                />
                <StatCard
                    title="Hari Ini"
                    value={stats.todayLessons}
                    unit="JP"
                    subtitle={currentDay !== "Minggu" ? `Jadwal ${currentDay}` : "Hari libur"}
                    icon={BarChart3}
                    color="emerald"
                />
            </div>

            {/* Currently Active Lesson */}
            {currentDay !== "Minggu" && currentLesson && (
                <CurrentlyActiveLessonCard
                    currentLesson={toParentItem(currentLesson)}
                    currentDay={currentDay}
                />
            )}

            {/* Weekly Calendar Grid */}
            <WeeklyCalendarGrid
                scheduleByDay={scheduleByDay}
                currentDay={currentDay}
                isLessonHappeningNow={(item) => isLessonHappeningNow(item as unknown as ScheduleItem)}
                getSubjectColor={getSubjectColor}
                childClass=""
            />
        </div>
    );
};
