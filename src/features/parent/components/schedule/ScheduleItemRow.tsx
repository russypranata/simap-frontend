"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/features/parent/services/parentScheduleService";

interface ScheduleItemRowProps {
    item: ScheduleItem;
    getSubjectColor: (subject: string) => string;
    isLessonHappeningNow: (item: ScheduleItem) => boolean;
    showDay?: boolean;
}

export const ScheduleItemRow: React.FC<ScheduleItemRowProps> = ({
    item,
    getSubjectColor,
    isLessonHappeningNow,
    showDay = false,
}) => {
    const isLive = isLessonHappeningNow(item);

    return (
        <tr
            className={cn(
                "border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors",
                isLive && "bg-green-50 hover:bg-green-100"
            )}
        >
            <td className="p-4 text-center align-middle">
                <Badge
                    variant="secondary"
                    className="font-bold bg-slate-100 text-slate-600 border-slate-200 px-2.5 py-1 text-xs"
                >
                    {item.lessonNumber}
                </Badge>
            </td>
            <td className="p-4 align-middle">
                <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-mono">{item.startTime} - {item.endTime}</span>
                </div>
            </td>
            {showDay && (
                <td className="p-4 align-middle">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-semibold">
                        {item.day}
                    </Badge>
                </td>
            )}
            <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={cn(
                            "font-semibold px-2.5 py-1 border shadow-sm transition-transform hover:scale-105 cursor-default",
                            getSubjectColor(item.subject).replace("border-300", "border-200")
                        )}
                    >
                        {item.subject}
                    </Badge>
                    {isLive && (
                        <Badge className="bg-green-600 text-white animate-pulse">
                            LIVE
                        </Badge>
                    )}
                </div>
            </td>
            <td className="p-4 align-middle">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 shrink-0">
                        <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.teacher}</span>
                </div>
            </td>
            <td className="p-4 align-middle">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 shrink-0">
                        <MapPin className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.room}</span>
                </div>
            </td>
        </tr>
    );
};
