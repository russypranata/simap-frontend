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
            {/* Tabs */}
            <Tabs defaultValue="today" className="space-y-6">
                {/* Pill Style Tabs */}
                <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1 gap-0.5">
                    <TabsTrigger
                        value="today"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
                    >
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        Hari Ini
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
                    >
                        <History className="h-3.5 w-3.5 mr-1.5" />
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
