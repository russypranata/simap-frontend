"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Calendar, Star, BarChart3 } from "lucide-react";
import { type AdvisorDashboardStats } from "../../services/advisorDashboardService";

interface ProfileStatsCardProps {
    stats: AdvisorDashboardStats | null;
}

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({ stats }) => (
    <Card className="gap-0">
        <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-lg">Informasi Ekstrakurikuler</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5 font-normal">
                        Ringkasan data anggota dan kegiatan ekstrakurikuler
                    </p>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: Users, color: "blue", label: "Total Anggota", value: `${stats?.totalMembers ?? 0}` },
                    { icon: Activity, color: "green", label: "Hadir Terakhir", value: `${stats?.lastAttendancePresent ?? 0}` },
                    { icon: Calendar, color: "yellow", label: "Total Pertemuan", value: `${stats?.totalMeetings ?? 0}` },
                    { icon: Star, color: "purple", label: "Rata-rata Kehadiran", value: `${stats?.averageAttendance ?? 0}%` },
                ].map(({ icon: Icon, color, label, value }) => (
                    <div key={label} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <div className={`p-2 rounded-full bg-${color}-100`}>
                            <Icon className={`h-5 w-5 text-${color}-${color === "blue" ? "800" : "600"}`} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{label}</p>
                            <p className={`text-lg font-semibold text-${color}-${color === "blue" ? "800" : "600"}`}>{value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);
