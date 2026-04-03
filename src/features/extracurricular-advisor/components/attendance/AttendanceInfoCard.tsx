"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Users, AlertCircle, XCircle, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { type AttendanceDetail } from "../../services/advisorAttendanceService";

interface AttendanceStats {
    total: number;
    present: number;
    sick: number;
    permit: number;
    absent: number;
    percentage: number;
}

interface AttendanceInfoCardProps {
    detail: AttendanceDetail;
    stats: AttendanceStats;
    extracurricularName?: string;
}

const INFO_ITEMS = (detail: AttendanceDetail, stats: AttendanceStats) => [
    { icon: Calendar, bgClass: "bg-blue-50", textClass: "text-blue-600", valueClass: "text-blue-700", label: "Tanggal", value: formatDate(detail.date, "dd MMMM yyyy") },
    { icon: Clock, bgClass: "bg-purple-50", textClass: "text-purple-600", valueClass: "text-purple-700", label: "Waktu", value: `${detail.advisorStats.startTime} - ${detail.advisorStats.endTime} WIB` },
    { icon: Users, bgClass: "bg-green-50", textClass: "text-green-600", valueClass: "text-green-700", label: "Tutor", value: detail.advisorStats.tutorName },
    {
        icon: CheckCircle,
        bgClass: stats.percentage >= 90 ? "bg-green-50" : stats.percentage >= 75 ? "bg-amber-50" : "bg-red-50",
        textClass: stats.percentage >= 90 ? "text-green-600" : stats.percentage >= 75 ? "text-amber-600" : "text-red-600",
        valueClass: stats.percentage >= 90 ? "text-green-700" : stats.percentage >= 75 ? "text-amber-700" : "text-red-700",
        label: "Kehadiran",
        value: `${stats.present}/${stats.total} (${stats.percentage}%)`,
    },
];

const STAT_ITEMS = (stats: AttendanceStats) => [
    { icon: Users, bgClass: "bg-blue-100", textClass: "text-blue-600", label: "Total", value: stats.total },
    { icon: CheckCircle, bgClass: "bg-green-100", textClass: "text-green-600", label: "Hadir", value: stats.present },
    { icon: AlertCircle, bgClass: "bg-yellow-100", textClass: "text-yellow-600", label: "Sakit", value: stats.sick },
    { icon: Clock, bgClass: "bg-sky-100", textClass: "text-sky-600", label: "Izin", value: stats.permit },
    { icon: XCircle, bgClass: "bg-red-100", textClass: "text-red-600", label: "Alpa", value: stats.absent },
];

export const AttendanceInfoCard: React.FC<AttendanceInfoCardProps> = ({ detail, stats, extracurricularName }) => (
    <Card className="overflow-hidden p-0 gap-0">
        {/* Header */}
        <div className="bg-blue-800 p-4 rounded-t-lg relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-white/10 transform rotate-12">
                <ClipboardList className="w-32 h-32" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
                        <ClipboardList className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white">Informasi Presensi</h3>
                        {extracurricularName && (
                            <p className="text-blue-100 text-sm">Ekstrakurikuler {extracurricularName}</p>
                        )}
                    </div>
                </div>
                <Badge className="bg-green-500 text-white border-0 gap-1 px-2.5 py-1 text-xs font-medium w-fit">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Presensi Lengkap
                </Badge>
            </div>
        </div>

        {/* Info row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-b">
            {INFO_ITEMS(detail, stats).map(({ icon: Icon, bgClass, textClass, valueClass, label, value }) => (
                <div key={label} className="px-3 py-4 flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-lg", bgClass)}>
                        <Icon className={cn("h-4 w-4", textClass)} />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className={cn("text-sm font-semibold", valueClass)}>{value}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 divide-x">
            {STAT_ITEMS(stats).map(({ icon: Icon, bgClass, textClass, label, value }) => (
                <div key={label} className="p-3 text-center">
                    <div className={cn("inline-flex p-2 rounded-full mb-1.5", bgClass)}>
                        <Icon className={cn("h-4 w-4", textClass)} />
                    </div>
                    <p className={cn("text-xl font-bold", textClass)}>{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                </div>
            ))}
        </div>
    </Card>
);
