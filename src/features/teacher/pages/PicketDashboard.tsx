"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PicketStudentAttendance from "@/features/teacher/pages/PicketStudentAttendance";
import PicketPrayerAttendance from "@/features/teacher/pages/PicketPrayerAttendance";
import { Users, Moon, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/features/shared/components";

export default function PicketDashboard() {
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
