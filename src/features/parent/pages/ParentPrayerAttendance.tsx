"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar as CalendarIcon,
    Moon,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Types
type PrayerStatus = "berjamaah" | "munfarid" | "masbuk" | "tidak_hadir" | "haid" | "sakit" | "izin";
type PrayerTime = "Subuh" | "Dzuhur" | "Ashar" | "Maghrib" | "Isya";

interface PrayerRecord {
    id: number;
    date: string;
    day: string;
    subuh: PrayerStatus;
    dzuhur: PrayerStatus;
    ashar: PrayerStatus;
    maghrib: PrayerStatus;
    isya: PrayerStatus;
}

// Mock Data
const generateMockPrayerData = (): PrayerRecord[] => {
    const records: PrayerRecord[] = [];
    const today = new Date();
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayName = days[date.getDay()];
        const dateString = date.toISOString().split("T")[0];

        // Random status generator
        const getStatus = (): PrayerStatus => {
            const rand = Math.random();
            if (rand > 0.3) return "berjamaah";
            if (rand > 0.2) return "masbuk";
            if (rand > 0.1) return "munfarid";
            return "tidak_hadir";
        };

        records.push({
            id: i,
            date: dateString,
            day: dayName,
            subuh: getStatus(),
            dzuhur: getStatus(),
            ashar: getStatus(),
            maghrib: getStatus(),
            isya: getStatus(),
        });
    }
    return records;
};

const mockPrayerRecords = generateMockPrayerData();

// Helper functions
const getStatusConfig = (status: PrayerStatus) => {
    const configs = {
        berjamaah: { label: "Berjamaah", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Users, score: 5 },
        masbuk: { label: "Masbuk", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock, score: 4 },
        munfarid: { label: "Munfarid", color: "bg-amber-100 text-amber-700 border-amber-200", icon: User, score: 3 },
        tidak_hadir: { label: "Tidak Hadir", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, score: 0 },
        haid: { label: "Haid", color: "bg-pink-100 text-pink-700 border-pink-200", icon: CheckCircle, score: 0 }, // Score 0 but excused
        sakit: { label: "Sakit", color: "bg-gray-100 text-gray-700 border-gray-200", icon: CheckCircle, score: 0 },
        izin: { label: "Izin", color: "bg-gray-100 text-gray-700 border-gray-200", icon: CheckCircle, score: 0 },
    };
    return configs[status];
};

export const ParentPrayerAttendance: React.FC = () => {
    const [viewMode, setViewMode] = useState<"weekly">("weekly"); // Placeholder for future expansion
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

    const calculateDailyScore = (record: PrayerRecord) => {
        const statuses: PrayerStatus[] = [record.subuh, record.dzuhur, record.ashar, record.maghrib, record.isya];
        let score = 0;
        let maxScore = 0;

        statuses.forEach(status => {
            if (status !== "haid") { // Exclude Haid from calculation
                score += getStatusConfig(status).score;
                maxScore += 5;
            }
        });

        // Calculate percentage, default 100 if all excused (though unlikely for all 5)
        return maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Presensi </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Sholat</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Moon className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Monitoring kehadiran sholat wajib berjamaah di masjid/asrama
                    </p>
                </div>
            </div>

            {/* Summary / Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20 p-4 rounded-lg border">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentWeekOffset(prev => prev + 1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-md font-medium text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Minggu Ini</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setCurrentWeekOffset(prev => prev - 1)} disabled={currentWeekOffset <= 0}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span>Berjamaah</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span>Masbuk</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span>Munfarid</span>
                    </div>
                </div>
            </div>

            {/* Table View */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-medium text-sm w-32 border-r">Hari / Tanggal</th>
                                    <th className="text-center p-4 font-medium text-sm border-r bg-slate-50">Subuh</th>
                                    <th className="text-center p-4 font-medium text-sm border-r">Dzuhur</th>
                                    <th className="text-center p-4 font-medium text-sm border-r bg-slate-50">Ashar</th>
                                    <th className="text-center p-4 font-medium text-sm border-r">Maghrib</th>
                                    <th className="text-center p-4 font-medium text-sm border-r bg-slate-50">Isya</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Skor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {mockPrayerRecords.map((record) => {
                                    const dailyScore = calculateDailyScore(record);
                                    return (
                                        <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 border-r">
                                                <div className="font-medium text-sm">{record.day}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(record.date).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                                                </div>
                                            </td>
                                            {["subuh", "dzuhur", "ashar", "maghrib", "isya"].map((time, idx) => {
                                                const status = record[time as keyof PrayerRecord] as PrayerStatus;
                                                const config = getStatusConfig(status);
                                                const Icon = config.icon;
                                                return (
                                                    <td key={time} className={cn("p-2 border-r text-center align-middle", idx % 2 === 0 && "bg-slate-50/50")}>
                                                        <div className="flex flex-col items-center justify-center gap-1">
                                                            <div className={cn(
                                                                "p-1.5 rounded-full",
                                                                status === "berjamaah" ? "bg-emerald-100 text-emerald-700" :
                                                                status === "masbuk" ? "bg-blue-100 text-blue-700" :
                                                                status === "munfarid" ? "bg-amber-100 text-amber-700" :
                                                                status === "tidak_hadir" ? "bg-red-100 text-red-700" :
                                                                "bg-gray-100 text-gray-700"
                                                            )}>
                                                                <Icon className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-[10px] font-medium text-muted-foreground capitalize">
                                                                {config.label}
                                                            </span>
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                            <td className="p-4 text-center">
                                                <div className={cn(
                                                    "inline-flex items-center justify-center h-10 w-10 rounded-full text-xs font-bold border-2",
                                                    dailyScore >= 90 ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                                                    dailyScore >= 75 ? "border-blue-200 bg-blue-50 text-blue-700" :
                                                    "border-red-200 bg-red-50 text-red-700"
                                                )}>
                                                    {dailyScore}%
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Legend / Info */}
            <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-3 text-sm">Keterangan Status</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["berjamaah", "masbuk", "munfarid", "tidak_hadir"].map((status) => {
                            const config = getStatusConfig(status as PrayerStatus);
                            return (
                                <div key={status} className="flex items-center gap-2">
                                    <div className={cn("w-3 h-3 rounded-full", config.color.split(" ")[0])} />
                                    <span className="text-sm text-muted-foreground">{config.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
