"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyPicketJournal from "@/features/teacher/pages/DailyPicketJournal";
import PicketStudentAttendance from "@/features/teacher/pages/PicketStudentAttendance";
import PicketPrayerAttendance from "@/features/teacher/pages/PicketPrayerAttendance";
import PicketExtracurricularAttendance from "@/features/teacher/pages/PicketExtracurricularAttendance";
import { formatDate, getDayName } from "@/features/shared/utils/dateFormatter";
import { Calendar, Users } from "lucide-react";

export default function PicketDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        Dashboard <span className="text-primary">Guru Piket</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Users className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tugas Pengawasan</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-muted-foreground text-sm">Tahun Ajaran 2025/2026</span>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-muted-foreground text-sm font-medium text-primary">Semester Ganjil</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-card p-1.5 pr-4 rounded-xl border shadow-sm">
                    <div className="p-2.5 bg-muted/50 rounded-lg">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Hari ini</p>
                        <p className="text-sm font-bold text-foreground">
                            {getDayName(new Date())}, {formatDate(new Date())}
                        </p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="journal" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="journal">Jurnal Piket</TabsTrigger>
                    <TabsTrigger value="attendance">Absen Siswa</TabsTrigger>
                    <TabsTrigger value="prayer">Absen Sholat</TabsTrigger>
                    <TabsTrigger value="extra">Absen Ekstrakurikuler</TabsTrigger>
                </TabsList>

                <TabsContent value="journal" className="space-y-4">
                    <DailyPicketJournal />
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                    <PicketStudentAttendance />
                </TabsContent>

                <TabsContent value="prayer" className="space-y-4">
                    <PicketPrayerAttendance />
                </TabsContent>

                <TabsContent value="extra" className="space-y-4">
                    <PicketExtracurricularAttendance />
                </TabsContent>
            </Tabs>
        </div>
    );
}
