"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/features/parent/services/parentScheduleService";

interface ScheduleDayCardProps {
    day: string;
    schedule: ScheduleItem[];
    isCurrentDay: boolean;
    isLessonHappeningNow: (item: ScheduleItem) => boolean;
    getSubjectColor: (subject: string) => string;
}

export const ScheduleDayCard: React.FC<ScheduleDayCardProps> = ({
    day,
    schedule,
    isCurrentDay,
    isLessonHappeningNow,
    getSubjectColor,
}) => {
    return (
        <Card
            className={cn(
                "overflow-hidden transition-shadow hover:shadow-lg",
                isCurrentDay && "ring-2 ring-blue-500 border-blue-300"
            )}
        >
            <CardHeader
                className={cn(
                    "py-3 border-b",
                    isCurrentDay
                        ? "bg-blue-50 border-blue-200"
                        : "bg-slate-50 border-slate-200"
                )}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                "w-2.5 h-2.5 rounded-full flex-shrink-0",
                                schedule.length === 0
                                    ? "bg-gray-300"
                                    : isCurrentDay
                                        ? "bg-blue-600"
                                        : "bg-blue-400"
                            )}
                        />
                        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                            {day}
                        </CardTitle>
                    </div>
                    {isCurrentDay && (
                        <Badge className="bg-blue-600 text-white text-xs font-medium px-2 py-0">
                            Hari Ini
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-2">
                <div className="space-y-1">
                    {schedule.length === 0 ? (
                        <div className="py-8 text-center">
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 mb-2">
                                <BookOpen className="h-4 w-4 text-slate-400" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Tidak ada jadwal
                            </p>
                        </div>
                    ) : (
                        schedule.map((item) => (
                            <div
                                key={item.id}
                                className={cn(
                                    "group p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all",
                                    isLessonHappeningNow(item) && "border-green-400 bg-green-50 ring-1 ring-green-400"
                                )}
                            >
                                <div className="flex items-start gap-2.5">
                                    <div className="flex flex-col items-center gap-1 min-w-[70px] pt-0.5">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0 h-5"
                                        >
                                            {item.lessonNumber}
                                        </Badge>
                                        <div className="text-xs text-slate-600 font-medium whitespace-nowrap">
                                            {item.startTime} - {item.endTime}
                                        </div>
                                    </div>
                                    <div className="w-px self-stretch bg-slate-200 group-hover:bg-blue-200 transition-colors" />
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-1.5">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs font-semibold px-2.5 py-1",
                                                    getSubjectColor(item.subject)
                                                )}
                                            >
                                                {item.subject}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <User className="h-3 w-3 text-slate-400 flex-shrink-0" />
                                                <span className="truncate">{item.teacher}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                                                <span className="truncate">{item.room}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
