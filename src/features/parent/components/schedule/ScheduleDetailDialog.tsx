"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Clock, User, Calendar, BookOpen, Users } from "lucide-react";
import type { ScheduleItem } from "@/features/parent/services/parentScheduleService";
import { getLessonPeriod } from "@/features/parent/services/parentScheduleService";

interface ScheduleDetailDialogProps {
    item: ScheduleItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    childClass?: string;
}

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
    <div className="p-3 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Icon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs font-medium">{label}</span>
        </div>
        <p className="text-sm font-semibold text-slate-800 pl-[22px]">{value}</p>
    </div>
);

export const ScheduleDetailDialog: React.FC<ScheduleDetailDialogProps> = ({
    item,
    open,
    onOpenChange,
    childClass,
}) => {
    if (!item) return null;

    const period = getLessonPeriod(item.startTime);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl flex-shrink-0">
                            <BookOpen className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold text-slate-800">
                                {item.subject}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-500">
                                Detail Jadwal Pelajaran
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    {childClass && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                                <Users className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="text-xs font-medium">Kelas</span>
                            </div>
                            <p className="text-sm font-bold text-blue-900 pl-[22px]">{childClass}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <InfoRow icon={Clock} label="Waktu" value={`${item.startTime} - ${item.endTime}`} />
                        <InfoRow icon={Calendar} label="Hari" value={item.day} />
                    </div>

                    <InfoRow icon={User} label="Guru Pengampu" value={item.teacher || "-"} />

                    <div className="grid grid-cols-2 gap-3">
                        <InfoRow icon={BookOpen} label="Jam Pelajaran" value={period ? `Jam ke-${period}` : "-"} />
                        <InfoRow icon={BookOpen} label="Ruang" value={item.room || "-"} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
