"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeroomOverview } from "@/features/teacher/components/homeroom/HomeroomOverview";
import { HomeroomStudents } from "@/features/teacher/components/homeroom/HomeroomStudents";
import { HomeroomAttendance } from "@/features/teacher/components/homeroom/HomeroomAttendance";
import { HomeroomGrades } from "@/features/teacher/components/homeroom/HomeroomGrades";
import { GraduationCap } from "lucide-react";

export const HomeroomDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        Dashboard <span className="text-primary">Wali Kelas</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <GraduationCap className="h-4 w-4" />
                            <span className="text-sm font-semibold">Kelas XII A</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-muted-foreground text-sm">Tahun Ajaran 2025/2026</span>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-muted-foreground text-sm font-medium text-primary">Semester Ganjil</span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                    <TabsTrigger value="students">Data Siswa</TabsTrigger>
                    <TabsTrigger value="attendance">Presensi</TabsTrigger>
                    <TabsTrigger value="grades">Nilai</TabsTrigger>
                    <TabsTrigger value="schedule">Jadwal</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <HomeroomOverview />
                </TabsContent>

                <TabsContent value="students" className="space-y-4">
                    <HomeroomStudents />
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                    <HomeroomAttendance />
                </TabsContent>

                <TabsContent value="grades" className="space-y-4">
                    <HomeroomGrades />
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                    <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">
                            Fitur Jadwal Kelas akan segera hadir
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
