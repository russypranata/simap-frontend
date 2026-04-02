"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronRight, ClipboardList, FileText, Thermometer } from "lucide-react";
import type { AttendanceSummary } from "./types";

interface AttendanceSectionProps {
    attendance: AttendanceSummary;
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({ attendance }) => (
    <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-100 rounded-xl">
                        <ClipboardList className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Ketidakhadiran</CardTitle>
                        <CardDescription className="text-sm text-slate-600">Rekap presensi harian semester ini</CardDescription>
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
            <div className="grid grid-cols-3 gap-3">
                {/* Sakit */}
                <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Thermometer className="h-4 w-4 text-amber-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Hari</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-600 tabular-nums leading-none">{attendance.sick}</p>
                    <p className="text-xs font-semibold text-amber-700 mt-1.5">Sakit</p>
                </div>

                {/* Izin */}
                <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Hari</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 tabular-nums leading-none">{attendance.permission}</p>
                    <p className="text-xs font-semibold text-blue-700 mt-1.5">Izin</p>
                </div>

                {/* Alpha */}
                <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Hari</span>
                    </div>
                    <p className="text-3xl font-bold text-red-600 tabular-nums leading-none">{attendance.alpha}</p>
                    <p className="text-xs font-semibold text-red-700 mt-1.5">Alpha</p>
                    {attendance.alpha > 0 && (
                        <div className="absolute top-2 right-2">
                            <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </CardContent>
    </Card>
);
