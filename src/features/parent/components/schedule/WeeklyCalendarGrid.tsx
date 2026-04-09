"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Calendar, Eye, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/features/parent/services/parentScheduleService";
import { ScheduleDetailDialog } from "./ScheduleDetailDialog";

interface WeeklyCalendarGridProps {
    scheduleByDay: Record<string, ScheduleItem[]>;
    currentDay: string;
    isLessonHappeningNow: (item: ScheduleItem) => boolean;
    getSubjectColor: (subject: string) => string;
    childClass?: string;
}

const WEEKDAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export const WeeklyCalendarGrid: React.FC<WeeklyCalendarGridProps> = ({
    scheduleByDay,
    currentDay,
    isLessonHappeningNow,
    getSubjectColor,
    childClass,
}) => {
    const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Get all unique time slots across all days
    const allTimeSlots = React.useMemo(() => {
        const timeSlots = new Set<string>();
        WEEKDAYS.forEach((day) => {
            scheduleByDay[day]?.forEach((item) => {
                timeSlots.add(`${item.startTime}-${item.endTime}`);
            });
        });
        return Array.from(timeSlots).sort((a, b) => {
            const [aStart] = a.split("-");
            const [bStart] = b.split("-");
            return aStart.localeCompare(bStart);
        });
    }, [scheduleByDay]);

    const getScheduleForDayAndTime = (day: string, timeSlot: string) => {
        const [startTime, endTime] = timeSlot.split("-");
        return scheduleByDay[day]?.find(
            (item) => item.startTime === startTime && item.endTime === endTime
        );
    };

    const handleItemClick = (item: ScheduleItem) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
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
                            Lihat jadwal pelajaran anak Anda untuk minggu ini (Senin - Sabtu)
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-[80px] border-l border-slate-200">
                                    Waktu
                                </th>
                                {WEEKDAYS.map((day) => {
                                    const isCurrentDay = day === currentDay;
                                    return (
                                        <th
                                            key={day}
                                            className={cn(
                                                "p-4 text-center text-xs font-medium uppercase tracking-wider border-l border-slate-200",
                                                isCurrentDay ? "text-primary" : "text-slate-600"
                                            )}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                {isCurrentDay && (
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                )}
                                                <span className="font-medium">{day}</span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {allTimeSlots.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <BookOpen className="h-12 w-12 text-slate-300 mb-3" />
                                            <p className="text-sm">Tidak ada jadwal pelajaran</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                allTimeSlots.map((timeSlot, index) => {
                                    const isNow = WEEKDAYS.some((day) => {
                                        const item = getScheduleForDayAndTime(day, timeSlot);
                                        return item && isLessonHappeningNow(item);
                                    });

                                    return (
                                        <tr
                                            key={timeSlot}
                                            className={cn(
                                                index % 2 === 0 ? "bg-slate-50/50" : "bg-white",
                                                isNow && "bg-green-50"
                                            )}
                                        >
                                            <td className="p-3 border-t border-slate-200">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                                                        <span>{timeSlot.split("-")[0]}</span>
                                                    </div>
                                                    <Minus className="h-3 w-3 text-slate-400" />
                                                    <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                                                        <span>{timeSlot.split("-")[1]}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            {WEEKDAYS.map((day) => {
                                                const item = getScheduleForDayAndTime(day, timeSlot);
                                                const isCurrentDay = day === currentDay;

                                                return (
                                                    <td
                                                        key={`${day}-${timeSlot}`}
                                                        className={cn(
                                                            "p-2 border-t border-l border-slate-200 align-top",
                                                            isCurrentDay && "bg-blue-50/30"
                                                        )}
                                                    >
                                                        {item ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleItemClick(item)}
                                                                className={cn(
                                                                    "w-full p-2.5 rounded-lg border transition-all min-h-[80px] cursor-pointer",
                                                                    isLessonHappeningNow(item)
                                                                        ? "border-green-400 bg-green-50 ring-1 ring-green-400"
                                                                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                                                                )}
                                                            >
                                                                <div className="space-y-2">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={cn(
                                                                            "text-xs font-semibold px-2 py-0.5 w-full justify-center max-w-full truncate",
                                                                            getSubjectColor(item.subject)
                                                                        )}
                                                                        title={item.subject}
                                                                    >
                                                                        <span className="truncate">{item.subject}</span>
                                                                    </Badge>
                                                                    <div className="flex items-center gap-1 text-xs text-slate-600">
                                                                        <User className="h-3 w-3 text-slate-400 flex-shrink-0" />
                                                                        <span className="truncate" title={item.teacher}>{item.teacher}</span>
                                                                    </div>
                                                                    <div className="flex items-center justify-center gap-1 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Eye className="h-3 w-3" />
                                                                        <span>Lihat detail</span>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ) : (
                                                            <div className="h-[80px] flex items-center justify-center">
                                                                <BookOpen className="h-8 w-8 text-slate-200 opacity-50" />
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
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
