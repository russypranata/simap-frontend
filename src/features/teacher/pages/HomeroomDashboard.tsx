"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeroomOverview } from "@/features/teacher/components/homeroom/HomeroomOverview";
import { HomeroomStudents } from "@/features/teacher/components/homeroom/HomeroomStudents";
import { HomeroomAttendance } from "@/features/teacher/components/homeroom/HomeroomAttendance";
import { EReport } from "@/features/teacher/components/homeroom/HomeroomEReport";
import { HomeroomGrades } from "@/features/teacher/components/homeroom/HomeroomGrades";
import { GraduationCap, Users, ClipboardCheck, Award, Calendar, FileText } from "lucide-react";
import { PageHeader } from "@/features/shared/components";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const HomeroomDashboard = () => {
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Page header skeleton */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                </div>
                {/* Tabs skeleton */}
                <div className="flex gap-0.5 p-1 bg-muted/50 rounded-full w-fit flex-wrap">
                    {[72, 80, 68, 56, 68, 72].map((w, i) => (
                        <Skeleton key={i} className="h-8 rounded-full" style={{ width: w }} />
                    ))}
                </div>
                {/* Overview tab skeleton - 4 stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-xl bg-white shadow-sm border border-slate-100 animate-pulse">
                            <div className="px-5 py-4 flex items-center gap-4">
                                <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-7 w-12" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Content cards skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 rounded-lg" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-5 w-36" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {Array.from({ length: 4 }).map((_, j) => (
                                        <div key={j} className="flex items-center gap-3 p-3 rounded-lg border border-muted">
                                            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                                            <div className="flex-1 space-y-1">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

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
