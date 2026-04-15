"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeroomOverview } from "@/features/teacher/components/homeroom/HomeroomOverview";
import { HomeroomStudents } from "@/features/teacher/components/homeroom/HomeroomStudents";
import { HomeroomAttendance } from "@/features/teacher/components/homeroom/HomeroomAttendance";
import { EReport } from "@/features/teacher/components/homeroom/HomeroomEReport";
import { HomeroomGrades } from "@/features/teacher/components/homeroom/HomeroomGrades";
import { GraduationCap, Users, ClipboardCheck, Award, Calendar, FileText } from "lucide-react";
import { PageHeader } from "@/features/shared/components";

export const HomeroomDashboard = () => {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                titleHighlight="Wali Kelas"
                icon={GraduationCap}
                description="Pantau dan kelola data siswa, presensi, nilai, dan E-Rapor kelas Anda"
            />

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1 gap-0.5">
                    <TabsTrigger value="overview" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                        Ringkasan
                    </TabsTrigger>
                    <TabsTrigger value="students" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <Users className="h-3.5 w-3.5 mr-1.5" />
                        Data Siswa
                    </TabsTrigger>
                    <TabsTrigger value="attendance" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
                        Presensi
                    </TabsTrigger>
                    <TabsTrigger value="grades" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <Award className="h-3.5 w-3.5 mr-1.5" />
                        Nilai
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        Jadwal
                    </TabsTrigger>
                    <TabsTrigger value="ereport" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        E-Rapor
                    </TabsTrigger>
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
                    <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-gray-50/50">
                        <div className="text-center">
                            <p className="text-muted-foreground font-medium">Jadwal Pelajaran Kelas XII A</p>
                            <p className="text-sm text-muted-foreground mt-1">Fitur ini akan segera tersedia</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="ereport" className="space-y-4">
                    <EReport />
                </TabsContent>
            </Tabs>
        </div>
    );
};
