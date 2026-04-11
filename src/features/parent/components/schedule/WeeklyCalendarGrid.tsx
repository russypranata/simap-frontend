"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, User, Calendar, Coffee, Flag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/features/parent/services/parentScheduleService";
import { getLessonPeriod } from "@/features/parent/services/parentScheduleService";
import { ScheduleDetailDialog } from "./ScheduleDetailDialog";

interface WeeklyCalendarGridProps {
    scheduleByDay: Record<string, ScheduleItem[]>;
    currentDay: string;
    isLessonHappeningNow: (item: ScheduleItem) => boolean;
    getSubjectColor: (subject: string) => string;
    childClass?: string;
}

const WEEKDAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const getSubjectStyle = (subject: string): string => {
    const predefined: Record<string, string> = {
        "Matematika": "bg-blue-100 text-blue-800",
        "Fisika": "bg-yellow-100 text-yellow-800",
        "Kimia": "bg-purple-100 text-purple-800",
        "Biologi": "bg-emerald-100 text-emerald-800",
        "Bahasa Indonesia": "bg-orange-100 text-orange-800",
        "Bahasa Inggris": "bg-pink-100 text-pink-800",
        "Sejarah": "bg-amber-100 text-amber-800",
        "PKn": "bg-red-100 text-red-800",
        "PJOK": "bg-lime-100 text-lime-800",
        "Seni Budaya": "bg-fuchsia-100 text-fuchsia-800",
        "BK": "bg-slate-100 text-slate-800",
        "Pendidikan Agama": "bg-teal-100 text-teal-800",
        "TIK": "bg-indigo-100 text-indigo-800",
        "Prakarya": "bg-cyan-100 text-cyan-800",
    };
    if (predefined[subject]) return predefined[subject];
    const palette = [
        "bg-red-100 text-red-800", "bg-yellow-100 text-yellow-800",
        "bg-cyan-100 text-cyan-800", "bg-indigo-100 text-indigo-800",
        "bg-rose-100 text-rose-800", "bg-teal-100 text-teal-800",
        "bg-violet-100 text-violet-800", "bg-amber-100 text-amber-800",
        "bg-sky-100 text-sky-800", "bg-lime-100 text-lime-800",
    ];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
};

const getRingColor = (subject: string): string => {
    const rings: Record<string, string> = {
        "Matematika": "ring-blue-400", "Fisika": "ring-yellow-400",
        "Kimia": "ring-purple-400", "Biologi": "ring-emerald-400",
        "Bahasa Indonesia": "ring-orange-400", "Bahasa Inggris": "ring-pink-400",
    };
    return rings[subject] ?? "ring-slate-400";
};

const NON_LESSON_CONFIG = {
    break:    { icon: Coffee, bg: "bg-amber-50/60",  border: "border-amber-200",  text: "text-amber-700",  defaultLabel: "☕ Istirahat" },
    ceremony: { icon: Flag,   bg: "bg-blue-50/60",   border: "border-blue-200",   text: "text-blue-700",   defaultLabel: "🚩 Upacara" },
    free:     { icon: Clock,  bg: "bg-slate-50/60",  border: "border-slate-200",  text: "text-slate-500",  defaultLabel: "Jam Bebas" },
};

export const WeeklyCalendarGrid: React.FC<WeeklyCalendarGridProps> = ({
    scheduleByDay,
    currentDay,
    isLessonHappeningNow,
    getSubjectColor: _getSubjectColor,
    childClass,
}) => {
    const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const allTimeSlots = React.useMemo(() => {
        const timeSlots = new Set<string>();
        WEEKDAYS.forEach((day) => {
            (scheduleByDay[day] ?? []).forEach((item) => {
                timeSlots.add(`${item.startTime}-${item.endTime}`);
            });
        });
        return Array.from(timeSlots).sort((a, b) => a.split("-")[0].localeCompare(b.split("-")[0]));
    }, [scheduleByDay]);

    const getScheduleForDayAndTime = (day: string, timeSlot: string) => {
        const [startTime, endTime] = timeSlot.split("-");
        return scheduleByDay[day]?.find(
            (item) => item.startTime === startTime && item.endTime === endTime
        );
    };

    const getNonLessonType = (timeSlot: string): ScheduleItem | null => {
        for (const day of WEEKDAYS) {
            const item = getScheduleForDayAndTime(day, timeSlot);
            if (item && item.type !== 'lesson') return item;
        }
        return null;
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 rounded-xl">
                        <Calendar className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Jadwal Pelajaran Mingguan</CardTitle>
                        <CardDescription className="text-sm text-slate-600">
                            Lihat jadwal pelajaran anak Anda untuk minggu ini (Senin - Jumat)
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="overflow-x-auto">
                    <div className="min-w-[640px] space-y-2">
                        {/* Header */}
                        <div className="grid grid-cols-6 gap-2">
                            <div className="text-xs font-semibold p-2.5 bg-muted rounded-lg text-center text-muted-foreground uppercase tracking-wider">
                                Waktu
                            </div>
                            {WEEKDAYS.map((day) => {
                                const isToday = day === currentDay;
                                return (
                                    <div
                                        key={day}
                                        className={cn(
                                            "text-xs font-semibold p-2.5 rounded-lg text-center uppercase tracking-wider",
                                            isToday ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        {isToday && <Calendar className="h-3 w-3 inline mr-1 mb-0.5" />}
                                        {day}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Rows */}
                        {allTimeSlots.length === 0 ? (
                            <div className="py-16 flex flex-col items-center justify-center text-muted-foreground">
                                <BookOpen className="h-10 w-10 text-slate-200 mb-3" />
                                <p className="text-sm">Tidak ada jadwal pelajaran</p>
                            </div>
                        ) : (
                            allTimeSlots.map((timeSlot) => {
                                const [start, end] = timeSlot.split("-");
                                const nonLesson = getNonLessonType(timeSlot);
                                const period = getLessonPeriod(start);

                                // Non-lesson row
                                if (nonLesson && nonLesson.type !== 'lesson') {
                                    const cfg = NON_LESSON_CONFIG[nonLesson.type as keyof typeof NON_LESSON_CONFIG];
                                    const Icon = cfg.icon;
                                    return (
                                        <div key={timeSlot} className="grid grid-cols-6 gap-2">
                                            <div className={cn(
                                                "text-xs p-2 rounded-lg flex items-center justify-center font-medium whitespace-nowrap border",
                                                cfg.bg, cfg.border, cfg.text
                                            )}>
                                                {start} - {end}
                                            </div>
                                            <div className={cn(
                                                "col-span-5 rounded-lg border flex items-center justify-center gap-2 py-2 text-xs font-medium",
                                                cfg.bg, cfg.border, cfg.text
                                            )}>
                                                <Icon className="h-3.5 w-3.5" />
                                                {nonLesson.label || cfg.defaultLabel}
                                            </div>
                                        </div>
                                    );
                                }

                                // Lesson row
                                return (
                                    <div key={timeSlot} className="grid grid-cols-6 gap-2">
                                        {/* Kolom waktu + nomor jam */}
                                        <div className="text-xs p-2 bg-muted rounded-lg flex flex-col items-center justify-center font-medium text-muted-foreground gap-1">
                                            {period && (
                                                <span className="text-[10px] text-slate-700">
                                                    Jam ke-{period}
                                                </span>
                                            )}
                                            <span className="text-slate-600 whitespace-nowrap">{start} - {end}</span>
                                        </div>

                                        {/* Kolom per hari */}
                                        {WEEKDAYS.map((day) => {
                                            const item = getScheduleForDayAndTime(day, timeSlot);
                                            const ongoing = item ? isLessonHappeningNow(item) : false;

                                            if (!item) {
                                                return (
                                                    <div
                                                        key={`${day}-${timeSlot}`}
                                                        className="border border-dashed border-muted rounded-lg bg-muted/20 min-h-[80px] flex items-center justify-center"
                                                    >
                                                        <BookOpen className="h-8 w-8 text-slate-200" />
                                                    </div>
                                                );
                                            }

                                            const style = getSubjectStyle(item.subject);
                                            const ring = getRingColor(item.subject);

                                            return (
                                                <button
                                                    key={`${day}-${timeSlot}`}
                                                    type="button"
                                                    onClick={() => { setSelectedItem(item); setIsDialogOpen(true); }}
                                                    className={cn(
                                                        "p-2.5 rounded-lg transition-all min-h-[80px] w-full text-left hover:shadow-md",
                                                        style,
                                                        ongoing && `ring-2 ${ring} ring-offset-1 scale-[1.02] shadow-md`
                                                    )}
                                                >
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-start gap-1">
                                                            <BookOpen className="h-3 w-3 mt-0.5 flex-shrink-0 opacity-70" />
                                                            <span className="text-xs font-semibold line-clamp-2 leading-tight">
                                                                {item.subject}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-75">
                                                            <User className="h-3 w-3 flex-shrink-0" />
                                                            <span className="text-xs truncate">{item.teacher}</span>
                                                        </div>
                                                        {ongoing && (
                                                            <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-white/40 px-1.5 py-0.5 rounded-full">
                                                                Sedang berlangsung
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </CardContent>
            <ScheduleDetailDialog
                item={selectedItem}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                childClass={childClass}
            />
        </Card>
    );
};
