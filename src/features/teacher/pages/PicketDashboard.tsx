"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PicketStudentAttendance from "@/features/teacher/pages/PicketStudentAttendance";
import PicketPrayerAttendance from "@/features/teacher/pages/PicketPrayerAttendance";
import { Users, Moon, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/features/shared/components";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function PicketDashboard() {
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-56" />
                        <Skeleton className="h-4 w-80" />
                    </div>
                </div>
                <div className="flex gap-1 p-1 bg-muted/50 rounded-full w-fit">
                    <Skeleton className="h-8 w-40 rounded-full" />
                    <Skeleton className="h-8 w-36 rounded-full" />
                </div>
                <Card className="animate-pulse">
                    <CardContent className="p-4 space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-muted">
                                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-8 w-24 rounded-lg" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                titleHighlight="Guru Piket"
                icon={ClipboardCheck}
                description="Pantau dan kelola pencatatan keterlambatan dan kehadiran sholat siswa harian."
            />

            <Tabs defaultValue="attendance" className="space-y-4">
                <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1 gap-0.5">
                    <TabsTrigger
                        value="attendance"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
                    >
                        <Users className="h-3.5 w-3.5 mr-1.5" />
                        Keterlambatan Pagi
                    </TabsTrigger>
                    <TabsTrigger
                        value="prayer"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
                    >
                        <Moon className="h-3.5 w-3.5 mr-1.5" />
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
