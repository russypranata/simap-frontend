"use client";

import React, { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Users, BookOpen, BarChart3, GraduationCap, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
    ScheduleHeader,
    ScheduleFilterDialog,
    CurrentlyActiveLessonCard,
    WeeklyCalendarGrid,
} from "../components/schedule";
import { ActiveFilterBadges, StatCard } from "@/features/shared/components";
import { useBreadcrumbAction } from "@/context/BreadcrumbActionContext";
import { useParentSchedule } from "../hooks/useParentSchedule";
import type { ScheduleItem } from "../services/parentScheduleService";
import { ErrorState, EmptyState } from "@/features/shared/components";

const ParentScheduleSkeleton = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
                <div className="h-10 w-64 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-72 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="flex gap-2 justify-end">
                <div className="h-9 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-9 w-44 bg-slate-200 rounded animate-pulse" />
            </div>
        </div>

        {/* Filter badge */}
        <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-32 bg-slate-200 rounded-lg animate-pulse" />
        </div>

        {/* Stat cards */}
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

        {/* Weekly Calendar Grid Skeleton */}
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
                    {Array.from({ length: 10 }).map((_, rowIndex) => (
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

const ScheduleInfoCard = ({ stats, currentDay }: { stats: { totalLessons: number; uniqueSubjects: number; todayLessons: number }; currentDay: string }) => (
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
);

export const ParentSchedule: React.FC = () => {
    const { setAction, clearAction } = useBreadcrumbAction();
    const {
        schedule,
        stats,
        children,
        academicYears,
        selectedChildId,
        selectedYearId,
        childName,
        childClass,
        isLoading,
        isScheduleFetching,
        isFetching,
        isError,
        errorMessage,
        currentDay,
        todaySchedule,
        days,
        getSubjectColor,
        setSelectedChildId,
        setSelectedYearId,
        refetch,
        isLessonHappeningNow,
    } = useParentSchedule();

    // Inject "Memperbarui..." ke breadcrumb area kanan atas
    React.useEffect(() => {
        if (isFetching && !isScheduleFetching) {
            setAction(
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden sm:inline">Memperbarui...</span>
                </div>
            );
        } else {
            clearAction();
        }
        return () => clearAction();
    }, [isFetching, isScheduleFetching, setAction, clearAction]);

    const currentLesson = todaySchedule.find(isLessonHappeningNow) || null;

    const scheduleByDay = useMemo(() => {
        const grouped: Record<string, ScheduleItem[]> = {};
        days.forEach((day) => {
            grouped[day] = schedule.filter((item) => item.day === day);
        });
        return grouped;
    }, [schedule, days]);

    const activeYear = academicYears.find((y) => y.id === selectedYearId);

    const handleApplyFilter = (yearId: string) => {
        setSelectedYearId(yearId);
    };

    if (isLoading) return <ParentScheduleSkeleton />;
    if (isError) return <ErrorState error={errorMessage || "Terjadi kesalahan"} onRetry={refetch} />;

    // Jangan render EmptyState saat children sudah ada tapi schedule belum di-fetch
    const isScheduleReady = !!selectedChildId && !!selectedYearId;
    if (isScheduleReady && schedule.length === 0) {
        return (
            <div className="space-y-6">
                <ScheduleHeader childName={childName} childClass={childClass} activeYearName={activeYear?.name} />
                <EmptyState
                    icon={() => (
                        <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                    title="Tidak Ada Data Jadwal"
                    description="Belum ada data jadwal pelajaran yang terdaftar. Silakan muat ulang atau hubungi administrator."
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Filter and Child Selector */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <ScheduleHeader childName={childName} childClass={childClass} activeYearName={activeYear?.name} />

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 no-print w-full lg:w-auto mt-4 lg:mt-0 flex-wrap lg:flex-nowrap justify-end">
                    <ScheduleFilterDialog
                        academicYears={academicYears}
                        activeYear={activeYear}
                        selectedYearId={selectedYearId}
                        onApply={handleApplyFilter}
                    />

                    {children.length > 1 && (
                        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                            <SelectTrigger className="w-full sm:w-[220px] h-9 bg-white shadow-sm border-slate-200">
                                <Users className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                                <div className="flex-1 text-left truncate">
                                    <SelectValue placeholder="Pilih Anak" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {children.map(child => (
                                    <SelectItem key={child.childId} value={child.childId}>
                                        {child.childName} — {child.childClass}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            {/* Active Filter Badges */}
            <ActiveFilterBadges
                badges={selectedYearId ? [{
                    key: "year",
                    label: `TA ${activeYear?.name || selectedYearId}`,
                    icon: CalendarIcon,
                    removable: false,
                    onRemove: () => {},
                }] : []}
            />

            {/* Stats Cards */}
            {isScheduleFetching ? (
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
            ) : (
                <ScheduleInfoCard stats={stats} currentDay={currentDay} />
            )}

            {/* Currently Active Lesson */}
            {currentDay !== "Minggu" && currentLesson && (
                <CurrentlyActiveLessonCard currentLesson={currentLesson} currentDay={currentDay} />
            )}

            {/* Weekly Calendar Grid */}
            {isScheduleFetching ? (
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
                            {Array.from({ length: 10 }).map((_, rowIndex) => (
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
            ) : (
                <WeeklyCalendarGrid
                    scheduleByDay={scheduleByDay}
                    currentDay={currentDay}
                    isLessonHappeningNow={isLessonHappeningNow}
                    getSubjectColor={getSubjectColor}
                    childClass={childClass}
                />
            )}
        </div>
    );
};
