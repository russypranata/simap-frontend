"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/features/parent/services/parentScheduleService";

interface TodayScheduleCardProps {
    todaySchedule: ScheduleItem[];
    currentDay: string;
    getSubjectColor: (subject: string) => string;
}

export const TodayScheduleCard: React.FC<TodayScheduleCardProps> = ({
    todaySchedule,
    currentDay,
    getSubjectColor,
}) => {
    return (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                            <Calendar className="h-5 w-5 text-blue-800" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Jadwal Anak Hari Ini - {currentDay}</CardTitle>
                            <CardDescription>{todaySchedule.length} jam pelajaran</CardDescription>
                        </div>
                    </div>
                    <Badge className="bg-blue-800 text-white">
                        {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {todaySchedule.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "flex-shrink-0 p-3 rounded-lg border-2",
                                getSubjectColor(item.subject)
                            )}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">{item.startTime} - {item.endTime}</span>
                            </div>
                            <p className="font-semibold text-sm">{item.subject}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <User className="h-3 w-3 opacity-70" />
                                <span className="text-xs opacity-80">{item.teacher}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
