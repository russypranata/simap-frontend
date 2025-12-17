"use client";

import React from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Clock, History } from "lucide-react";
import PicketPrayerAttendanceToday from "@/features/teacher/components/picket/PicketPrayerAttendanceToday";
import PrayerRecordHistory from "@/features/teacher/components/picket/PrayerRecordHistory";

export default function PicketPrayerAttendance() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        Presensi <span className="text-primary">Sholat</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Catat kehadiran siswa dalam pelaksanaan sholat berjamaah
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="today" className="space-y-6">
                {/* Pill Style Tabs */}
                <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1.5 gap-1">
                    <TabsTrigger
                        value="today"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                    >
                        <Clock className="h-4 w-4 mr-2" />
                        Hari Ini
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                    >
                        <History className="h-4 w-4 mr-2" />
                        Riwayat Lengkap
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="today">
                    <PicketPrayerAttendanceToday />
                </TabsContent>

                <TabsContent value="history">
                    <PrayerRecordHistory />
                </TabsContent>
            </Tabs>
        </div>
    );
}
