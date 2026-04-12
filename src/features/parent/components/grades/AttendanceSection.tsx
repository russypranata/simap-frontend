"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronRight, ClipboardList, FileText, Thermometer, UserCheck, CalendarDays } from "lucide-react";
import { StatCard } from "@/features/shared/components";
import type { AttendanceSummary } from "./types";

interface AttendanceSectionProps {
    attendance: AttendanceSummary;
    displaySemester?: string;
    academicYear?: string;
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({ attendance, displaySemester, academicYear }) => {
    const hadir = attendance.total - attendance.sick - attendance.permission - attendance.alpha;

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-100 rounded-xl">
                            <ClipboardList className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800">Kehadiran</CardTitle>
                            <CardDescription className="text-sm text-slate-600">
                                                {displaySemester && academicYear
                                                    ? `Informasi kehadiran TA. ${academicYear} Semester ${displaySemester}`
                                                    : "Rekap presensi harian semester ini"}
                                            </CardDescription>
                        </div>
                    </div>
                    <Link href="/parent/attendance/daily">
                        <Button variant="ghost" size="sm" className="gap-1 text-blue-700 hover:text-blue-800 hover:bg-blue-50 text-xs">
                            Lihat Detail
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <StatCard title="Total Pertemuan" value={attendance.total}            unit="hari" subtitle={`${attendance.attendanceRate}% kehadiran`} icon={CalendarDays} color="blue"    />
                    <StatCard title="Hadir"           value={hadir}                       unit="hari" subtitle="Hadir penuh"                               icon={UserCheck}   color="emerald" />
                    <StatCard title="Sakit"           value={attendance.sick}             unit="hari" subtitle="Dengan keterangan"                         icon={Thermometer} color="amber"   />
                    <StatCard title="Izin"            value={attendance.permission}       unit="hari" subtitle="Dengan keterangan"                         icon={FileText}    color="indigo"  />
                    <StatCard title="Alpha"           value={attendance.alpha}            unit="hari" subtitle="Tanpa keterangan"                          icon={AlertCircle} color="red"     />
                </div>
            </CardContent>
        </Card>
    );
};
