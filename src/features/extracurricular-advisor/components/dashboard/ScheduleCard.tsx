"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/features/shared/components";
import { type UpcomingScheduleItem } from "../../services/advisorDashboardService";

interface ScheduleCardProps {
    upcomingSchedules: UpcomingScheduleItem[];
    extracurricularName?: string;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ upcomingSchedules, extracurricularName }) => (
    <Card>
        <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Calendar className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-lg font-semibold">Jadwal Kegiatan</CardTitle>
                    <CardDescription>
                        {extracurricularName
                            ? `Jadwal rutin ekstrakurikuler ${extracurricularName}`
                            : "Jadwal kegiatan ekstrakurikuler"}
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="pt-0">
            <div className="relative ml-3">
                {upcomingSchedules.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="Belum ada jadwal"
                        description="Jadwal mendatang akan muncul di sini."
                        className="py-10"
                    />
                ) : (
                    <>
                        <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-blue-300" />
                        {upcomingSchedules.map((schedule, index) => (
                            <div key={schedule.id} className={`relative pl-6 ${index < upcomingSchedules.length - 1 ? "pb-3" : ""}`}>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-800 -ml-1" />
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 border border-blue-800/20">
                                    <div className="p-2.5 rounded-full bg-blue-100">
                                        <Calendar className="h-5 w-5 text-blue-800" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-blue-800 font-medium">
                                            {index === 0 ? "Pertemuan Berikutnya" : "Jadwal Mendatang"}
                                        </p>
                                        <p className="text-sm font-semibold text-blue-900">
                                            {schedule.day}, {schedule.date}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-blue-900">{schedule.time}</p>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </CardContent>
    </Card>
);
