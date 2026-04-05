"use client";

import React, { useState } from "react";
import { Calendar, Clock, Repeat, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/features/shared/components";
import { type UpcomingScheduleItem, type RegularScheduleItem } from "../../services/advisorDashboardService";

interface ScheduleCardProps {
    upcomingSchedules: UpcomingScheduleItem[];
    regularSchedules: RegularScheduleItem[];
    extracurricularName?: string;
}

const ScheduleItem: React.FC<{ schedule: RegularScheduleItem | UpcomingScheduleItem; showDate?: boolean }> = ({
    schedule,
    showDate = false,
}) => (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-50 border border-blue-800/20">
        <div className="p-2 rounded-full bg-blue-100 flex-shrink-0">
            {showDate
                ? <Calendar className="h-4 w-4 text-blue-800" />
                : <Repeat className="h-4 w-4 text-blue-800" />
            }
        </div>
        <div className="flex-1">
            <p className="text-xs text-blue-800 font-medium">
                {showDate ? "Pertemuan Berikutnya" : "Jadwal Rutin"}
            </p>
            <p className="text-sm font-semibold text-blue-900">
                {"date" in schedule ? `${schedule.day}, ${schedule.date}` : schedule.day}
            </p>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-blue-900">
            <Clock className="h-3.5 w-3.5" />
            {schedule.time}
        </div>
    </div>
);

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
    upcomingSchedules,
    regularSchedules,
    extracurricularName,
}) => {
    const [open, setOpen] = useState(false);
    const firstRegular = regularSchedules[0];
    const hasMore = regularSchedules.length > 1;

    return (
        <>
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
                                    ? `Jadwal ekstrakurikuler ${extracurricularName}`
                                    : "Jadwal kegiatan ekstrakurikuler"}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-5">
                    {/* Jadwal Rutin */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Repeat className="h-4 w-4 text-blue-700" />
                                <span className="text-sm font-semibold text-blue-800">Jadwal Rutin</span>
                            </div>
                            {hasMore && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-50"
                                    onClick={() => setOpen(true)}
                                >
                                    +{regularSchedules.length - 1} lainnya
                                    <ChevronRight className="h-3 w-3 ml-0.5" />
                                </Button>
                            )}
                        </div>
                        {regularSchedules.length === 0 ? (
                            <EmptyState
                                icon={Repeat}
                                title="Belum ada jadwal rutin"
                                description="Jadwal rutin akan muncul di sini."
                                className="py-2"
                            />
                        ) : (
                            <ScheduleItem schedule={firstRegular} />
                        )}
                    </div>

                    {/* Jadwal Mendatang */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-blue-700" />
                            <span className="text-sm font-semibold text-blue-800">Jadwal Mendatang</span>
                        </div>
                        {upcomingSchedules.length === 0 ? (
                            <EmptyState
                                icon={Calendar}
                                title="Belum ada jadwal mendatang"
                                description="Jadwal mendatang akan muncul di sini."
                                className="py-2"
                            />
                        ) : (
                            <ScheduleItem schedule={upcomingSchedules[0]} showDate />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modal semua jadwal rutin */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-left">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Repeat className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <DialogTitle>Jadwal Rutin</DialogTitle>
                                <DialogDescription>Semua jadwal rutin ekstrakurikuler</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-2 pt-2">
                        {regularSchedules.map((schedule) => (
                            <ScheduleItem key={schedule.id} schedule={schedule} />
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
