"use client";

import React from "react";
import { ScheduleDayCard } from "./ScheduleDayCard";
import type { ScheduleItem } from "@/features/parent/services/parentScheduleService";

interface WeeklyScheduleGridProps {
    days: string[];
    scheduleByDay: Record<string, ScheduleItem[]>;
    currentDay: string;
    isLessonHappeningNow: (item: ScheduleItem) => boolean;
    getSubjectColor: (subject: string) => string;
}

export const WeeklyScheduleGrid: React.FC<WeeklyScheduleGridProps> = ({
    days,
    scheduleByDay,
    currentDay,
    isLessonHappeningNow,
    getSubjectColor,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {days.map((day) => (
                <ScheduleDayCard
                    key={day}
                    day={day}
                    schedule={scheduleByDay[day]}
                    isCurrentDay={day === currentDay}
                    isLessonHappeningNow={isLessonHappeningNow}
                    getSubjectColor={getSubjectColor}
                />
            ))}
        </div>
    );
};
