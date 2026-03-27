"use client";

import React, { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
    ScheduleHeader,
    ScheduleFilterDialog,
    ActiveFilterBadges,
    CurrentlyActiveLessonCard,
    WeeklyCalendarGrid,
} from "../components/schedule";
import { useParentSchedule } from "../hooks/useParentSchedule";
import type { ScheduleItem } from "../services/parentScheduleService";

// Inline simple components to avoid extra files
const ParentScheduleSkeleton = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
                <div className="h-10 w-72 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-56 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
                <div className="h-9 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-9 w-52 bg-slate-200 rounded animate-pulse" />
            </div>
        </div>

        {/* Filter Card */}
        <div className="border border-slate-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-10 bg-slate-200 rounded animate-pulse" />
                <div className="h-10 bg-slate-200 rounded animate-pulse" />
                <div className="h-10 bg-slate-200 rounded animate-pulse" />
            </div>
        </div>

        {/* Weekly Calendar Grid Skeleton */}
        <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="space-y-2 flex-1">
                        <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="w-[120px] p-4">
                                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                                </th>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <th key={i} className="p-4">
                                        <div className="h-4 w-12 bg-slate-200 rounded animate-pulse mx-auto" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {Array.from({ length: 8 }).map((_, rowIndex) => (
                                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-slate-50/50" : "bg-white"}>
                                    <td className="p-3 border-t border-slate-200">
                                        <div className="h-4 w-12 bg-slate-200 rounded animate-pulse" />
                                    </td>
                                    {Array.from({ length: 6 }).map((_, colIndex) => (
                                        <td key={colIndex} className="p-2 border-t border-l border-slate-200">
                                            <div className="h-[80px] bg-slate-200/50 rounded-lg animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

        {/* Info Card */}
        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-slate-200 rounded-xl animate-pulse" />
                <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
                    <div className="space-y-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="space-y-6">
        <ScheduleHeader childName="" childClass="" />
        <div className="border-red-200 shadow-sm rounded-lg border bg-white p-8 text-center">
            <div className="p-4 bg-red-100 rounded-full mb-4 inline-block">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Gagal Memuat Data</h3>
            <p className="text-sm text-slate-500 max-w-md mb-6">{error}</p>
            <Button onClick={onRetry} variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Coba Lagi
            </Button>
        </div>
    </div>
);

const EmptyState = ({ onRetry }: { onRetry: () => void }) => (
    <div className="border-slate-200 shadow-sm border-dashed bg-slate-50/30 rounded-lg border p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-white border border-dashed border-slate-200 flex items-center justify-center mb-4 transition-transform hover:scale-110 shadow-sm mx-auto">
            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Data Jadwal</h3>
        <p className="text-sm text-slate-500 max-w-md mb-6">
            Belum ada data jadwal pelajaran yang terdaftar. Silakan muat ulang atau hubungi administrator.
        </p>
        <Button onClick={onRetry} variant="outline" className="gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm rounded-xl px-6 h-10 transition-all active:scale-95">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Muat Ulang Data
        </Button>
    </div>
);

const ScheduleInfoCard = ({ stats, currentDay }: { stats: { totalLessons: number; uniqueSubjects: number; todayLessons: number }; currentDay: string }) => (
    <div className="bg-blue-50 border-blue-200 rounded-lg border p-4">
        <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
                <svg className="h-5 w-5 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
            </div>
            <div>
                <h3 className="font-semibold text-blue-900">Informasi Jadwal</h3>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                    <li>• Total {stats.totalLessons} jam pelajaran per minggu</li>
                    <li>• {stats.uniqueSubjects} mata pelajaran berbeda</li>
                    {currentDay !== "Minggu" && (
                        <li>• Hari ini: {stats.todayLessons} jam pelajaran</li>
                    )}
                    <li>• Istirahat: 09:15-09:30 dan 11:45-12:30</li>
                    <li>• Jadwal dapat berubah sewaktu-waktu, silakan periksa pengumuman terbaru</li>
                </ul>
            </div>
        </div>
    </div>
);

export const ParentSchedule: React.FC = () => {
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
    if (schedule.length === 0) {
        return (
            <div className="space-y-6">
                <ScheduleHeader childName={childName} childClass={childClass} />
                <EmptyState onRetry={refetch} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Filter and Child Selector */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <ScheduleHeader childName={childName} childClass={childClass} />

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
                selectedYearId={selectedYearId}
                academicYears={academicYears}
                activeYear={activeYear}
                onClearYear={() => setSelectedYearId(academicYears[0]?.id)}
            />

            {/* Currently Active Lesson */}
            {currentDay !== "Minggu" && currentLesson && (
                <CurrentlyActiveLessonCard currentLesson={currentLesson} currentDay={currentDay} />
            )}

            {/* Weekly Calendar Grid - Simplified View */}
            <WeeklyCalendarGrid
                scheduleByDay={scheduleByDay}
                currentDay={currentDay}
                isLessonHappeningNow={isLessonHappeningNow}
                getSubjectColor={getSubjectColor}
                childClass={childClass}
            />

            {/* Info Card */}
            <ScheduleInfoCard stats={stats} currentDay={currentDay} />
        </div>
    );
};
