"use client";

import React from "react";
import { Calendar } from "lucide-react";

interface ScheduleHeaderProps {
    childName: string;
    childClass: string;
    activeYearName?: string;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ childName, childClass, activeYearName }) => {
    return (
        <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Jadwal </span>
                    <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Pelajaran Anak</span>
                </h1>
                <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                    <Calendar className="h-5 w-5" />
                </div>
            </div>
            <p className="text-muted-foreground mt-1">
                Jadwal pelajaran mingguan Ananda {childName} {childClass && `(${childClass})`}
            </p>
        </div>
    );
};
