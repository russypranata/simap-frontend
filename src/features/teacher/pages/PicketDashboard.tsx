"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PicketStudentAttendance from "@/features/teacher/pages/PicketStudentAttendance";
import PicketPrayerAttendance from "@/features/teacher/pages/PicketPrayerAttendance";
import { Users, Moon, Calendar, ClipboardCheck } from "lucide-react";

export default function PicketDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Dashboard <span className="text-primary">Guru Piket</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <ClipboardCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Pantau dan kelola pencatatan keterlambatan dan kehadiran sholat siswa harian.
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-muted-foreground text-sm font-medium text-primary">Semester Ganjil</span>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-2 md:justify-end">
                    {/* Additional header actions can go here */}
                </div>
            </div>

            <Tabs defaultValue="attendance" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50 rounded-xl mb-6">
                    <TabsTrigger
                        value="attendance"
                        className="rounded-lg py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-2"
                    >
                        <Users className="h-4 w-4" />
                        Keterlambatan Pagi
                    </TabsTrigger>
                    <TabsTrigger
                        value="prayer"
                        className="rounded-lg py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-2"
                    >
                        <Moon className="h-4 w-4" />
                        Presensi Sholat
                    </TabsTrigger>

                </TabsList>

                <TabsContent value="attendance" className="space-y-4">
                    <PicketStudentAttendance />
                </TabsContent>

                <TabsContent value="prayer" className="space-y-4">
                    <PicketPrayerAttendance />
                </TabsContent>


            </Tabs>
        </div>
    );
}
