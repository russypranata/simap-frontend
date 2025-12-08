import React, { useState } from "react";
import {
    Sun,
    BookOpen,
    Moon,
    Trophy
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MorningAttendance } from "./MorningAttendance";
import { SubjectAttendance } from "./SubjectAttendance";
import { PrayerAttendance } from "./PrayerAttendance";
import { ExtracurricularAttendance } from "./ExtracurricularAttendance";

export const DailyAttendance = () => {
    const [activeTab, setActiveTab] = useState("pagi");

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Rekapitulasi Presensi Siswa</h2>
                <p className="text-muted-foreground">
                    Pantau dan kelola rekap kehadiran siswa, sholat, dan ekstrakurikuler dalam satu tampilan terpadu.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-muted/50 rounded-xl mb-6">
                    <TabsTrigger
                        value="pagi"
                        className="rounded-lg py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-2"
                    >
                        <Sun className="h-4 w-4" />
                        Presensi Pagi
                    </TabsTrigger>
                    <TabsTrigger
                        value="mapel"
                        className="rounded-lg py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-2"
                    >
                        <BookOpen className="h-4 w-4" />
                        Presensi Mapel
                    </TabsTrigger>
                    <TabsTrigger
                        value="sholat"
                        className="rounded-lg py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-2"
                    >
                        <Moon className="h-4 w-4" />
                        Presensi Sholat
                    </TabsTrigger>
                    <TabsTrigger
                        value="ekskul"
                        className="rounded-lg py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-2"
                    >
                        <Trophy className="h-4 w-4" />
                        Presensi Ekskul
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pagi" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <MorningAttendance />
                </TabsContent>

                <TabsContent value="mapel" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <SubjectAttendance />
                </TabsContent>

                <TabsContent value="sholat" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <PrayerAttendance />
                </TabsContent>

                <TabsContent value="ekskul" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                    <ExtracurricularAttendance />
                </TabsContent>
            </Tabs>
        </div>
    );
};
