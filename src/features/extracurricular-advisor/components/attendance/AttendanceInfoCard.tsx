"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Users, AlertCircle, XCircle } from "lucide-react";
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
}

export const AttendanceInfoCard: React.FC<AttendanceInfoCardProps> = ({ detail, stats }) => (
    <Card className="overflow-hidden p-0 gap-0">
        <div className="bg-blue-800 p-4 rounded-t-lg relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-white/10 transform rotate-12">
                <Calendar className="w-32 h-32" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
                        <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white">{detail.topic || "Kegiatan Rutin"}</h3>
                        <p className="text-blue-100 text-sm">Ekstrakurikuler Pramuka</p>
                    </div>
                </div>
                <Badge className="bg-green-500 text-white border-0 gap-1 px-2.5 py-1 text-xs font-medium w-fit">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Presensi Lengkap
                </Badge>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-b">
            {[
                { icon: Calendar, color: "blue", label: "Tanggal", value: formatDate(detail.date, "dd MMMM yyyy") },
                { icon: Clock, color: "purple", label: "Waktu", value: `${detail.advisorStats.startTime} - ${detail.advisorStats.endTime} WIB` },
                { icon: Users, color: "green", label: "Tutor", value: detail.advisorStats.tutorName },
                {
                    icon: CheckCircle,
                    color: stats.percentage >= 90 ? "green" : stats.percentage >= 75 ? "amber" : "red",
                    label: "Kehadiran",
                    value: `${stats.present}/${stats.total} (${stats.percentage}%)`,
                },
            ].map(({ icon: Icon, color, label, value }) => (
                <div key={label} className="px-3 py-4 flex items-center gap-3">
                    <div className={`p-1.5 bg-${color}-50 rounded-lg`}>
                        <Icon className={`h-4 w-4 text-${color}-600`} />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className={`text-sm font-semibold text-${color}-700`}>{value}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-5 divide-x">
            {[
                { icon: Users, color: "blue", label: "Total", value: stats.total },
                { icon: CheckCircle, color: "green", label: "Hadir", value: stats.present },
                { icon: AlertCircle, color: "yellow", label: "Sakit", value: stats.sick },
                { icon: Clock, color: "sky", label: "Izin", value: stats.permit },
                { icon: XCircle, color: "red", label: "Alpa", value: stats.absent },
            ].map(({ icon: Icon, color, label, value }) => (
                <div key={label} className="p-3 text-center">
                    <div className={`inline-flex p-2 bg-${color}-100 rounded-full mb-1.5`}>
                        <Icon className={`h-4 w-4 text-${color}-600`} />
                    </div>
                    <p className={`text-xl font-bold text-${color}-600`}>{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                </div>
            ))}
        </div>
    </Card>
);
