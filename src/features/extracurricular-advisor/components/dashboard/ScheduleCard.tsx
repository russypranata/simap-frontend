"use client";

import React from "react";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type UpcomingScheduleItem } from "../../services/advisorDashboardService";

interface ScheduleCardProps {
    upcomingSchedules: UpcomingScheduleItem[];
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ upcomingSchedules }) => (
    <Card>
        <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Calendar className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-lg font-semibold">Jadwal Kegiatan</CardTitle>
                    <CardDescription>Jadwal rutin ekstrakurikuler Pramuka</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="pt-0">
            <div className="relative ml-3">
                <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-blue-300" />
                <div className="relative pl-6 pb-3">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-800 -ml-1" />
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 border border-blue-800/20">
                        <div className="p-2.5 rounded-full bg-blue-100">
                            <Clock className="h-5 w-5 text-blue-800" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-blue-800 font-medium">Jadwal Rutin</p>
                            <p className="text-sm font-semibold text-blue-900">Jumat, 14:00 - 16:00</p>
                        </div>
                    </div>
                </div>
                {upcomingSchedules.length > 0 && (
                    <div className="relative pl-6">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-800 -ml-1" />
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 border border-blue-800/20">
                            <div className="p-2.5 rounded-full bg-blue-100">
                                <Calendar className="h-5 w-5 text-blue-800" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-blue-800 font-medium">Pertemuan Berikutnya</p>
                                <p className="text-sm font-semibold text-blue-900">
                                    {upcomingSchedules[0].day}, {upcomingSchedules[0].date}
                                </p>
                            </div>
                            <p className="text-sm font-medium text-blue-900">{upcomingSchedules[0].time}</p>
                        </div>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
);
