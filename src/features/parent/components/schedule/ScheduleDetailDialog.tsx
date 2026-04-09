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

interface ScheduleDetailDialogProps {
    item: ScheduleItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    childClass?: string;
}

export const ScheduleDetailDialog: React.FC<ScheduleDetailDialogProps> = ({
    item,
    open,
    onOpenChange,
    childClass,
}) => {
    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                            <BookOpen className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold text-slate-800">
                                {item.subject}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-600">
                                Detail Jadwal Pelajaran
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Class Info */}
                    {childClass && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-700 mb-1">
                                <Users className="h-4 w-4" />
                                <span className="text-xs font-medium">Kelas</span>
                            </div>
                            <p className="text-sm font-bold text-blue-900">
                                {childClass}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                                <Clock className="h-4 w-4" />
                                <span className="text-xs font-medium">Waktu</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-800">
                                {item.startTime} - {item.endTime}
                            </p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-600 mb-1">
                                <Calendar className="h-4 w-4" />
                                <span className="text-xs font-medium">Hari</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-800">
                                {item.day}
                            </p>
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <User className="h-4 w-4" />
                            <span className="text-xs font-medium">Guru Pengampu</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                            {item.teacher}
                        </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <BookOpen className="h-4 w-4" />
                            <span className="text-xs font-medium">Jam Pelajaran</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                            Jam ke-{item.lessonNumber}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
