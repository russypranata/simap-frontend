"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScheduleItem } from "@/features/parent/services/parentScheduleService";
import { ScheduleItemRow } from "./ScheduleItemRow";

interface DailyScheduleTableProps {
    selectedDay: string;
    filteredSchedule: ScheduleItem[];
    isLessonHappeningNow: (item: ScheduleItem) => boolean;
    getSubjectColor: (subject: string) => string;
}

export const DailyScheduleTable: React.FC<DailyScheduleTableProps> = ({
    selectedDay,
    filteredSchedule,
    isLessonHappeningNow,
    getSubjectColor,
}) => {
    return (
        <Card className="border-blue-200 shadow-sm overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                            <BookOpen className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800">
                                {selectedDay === "all" ? "Semua Jadwal" : `Jadwal Hari ${selectedDay}`}
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-600">
                                {filteredSchedule.length} jam pelajaran terdaftar
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold h-7 px-3 rounded-full text-[11px]">
                            {filteredSchedule.length} Jam Pelajaran
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-20">Jam</th>
                                <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-44">Waktu</th>
                                {selectedDay === "all" && (
                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-32">Hari</th>
                                )}
                                <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">Mata Pelajaran</th>
                                <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">Guru Pengampu</th>
                                <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-40">Lokasi / Ruangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedule.map((item) => (
                                <ScheduleItemRow
                                    key={item.id}
                                    item={item}
                                    getSubjectColor={getSubjectColor}
                                    isLessonHappeningNow={isLessonHappeningNow}
                                    showDay={selectedDay === "all"}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};
