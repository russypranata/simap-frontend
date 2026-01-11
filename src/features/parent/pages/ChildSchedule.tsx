"use client";

import React, { useState, useMemo } from "react";
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
    Calendar,
    Clock,
    MapPin,
    BookOpen,
    User,
    GraduationCap,
    Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface ScheduleItem {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    room: string;
    lessonNumber: number;
}

// Mock child info
const mockChildInfo = {
    name: "Ahmad Fauzan Ramadhan",
    nis: "0012345678",
    class: "XII IPA 1",
};

// Mock schedule data
const mockSchedule: ScheduleItem[] = [
    { id: 1, day: "Senin", startTime: "07:00", endTime: "07:45", subject: "Upacara", teacher: "-", room: "Lapangan", lessonNumber: 1 },
    { id: 2, day: "Senin", startTime: "07:45", endTime: "08:30", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 2 },
    { id: 3, day: "Senin", startTime: "08:30", endTime: "09:15", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 3 },
    { id: 4, day: "Senin", startTime: "09:30", endTime: "10:15", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 4 },
    { id: 5, day: "Senin", startTime: "10:15", endTime: "11:00", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 5 },
    { id: 6, day: "Selasa", startTime: "07:00", endTime: "07:45", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia", lessonNumber: 1 },
    { id: 7, day: "Selasa", startTime: "07:45", endTime: "08:30", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia", lessonNumber: 2 },
    { id: 8, day: "Selasa", startTime: "08:30", endTime: "09:15", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi", lessonNumber: 3 },
    { id: 9, day: "Rabu", startTime: "07:00", endTime: "07:45", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 1 },
    { id: 10, day: "Rabu", startTime: "07:45", endTime: "08:30", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 2 },
    { id: 11, day: "Rabu", startTime: "08:30", endTime: "09:15", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 3 },
    { id: 12, day: "Kamis", startTime: "07:00", endTime: "07:45", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 1 },
    { id: 13, day: "Kamis", startTime: "07:45", endTime: "08:30", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 2 },
    { id: 14, day: "Kamis", startTime: "08:30", endTime: "09:15", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia", lessonNumber: 3 },
    { id: 15, day: "Jumat", startTime: "07:00", endTime: "07:45", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi", lessonNumber: 1 },
    { id: 16, day: "Jumat", startTime: "07:45", endTime: "08:30", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi", lessonNumber: 2 },
    { id: 17, day: "Sabtu", startTime: "07:00", endTime: "07:45", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 1 },
    { id: 18, day: "Sabtu", startTime: "07:45", endTime: "08:30", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 2 },
];

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

// Subject colors
const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
        "Matematika": "bg-blue-100 border-blue-300 text-blue-800",
        "Fisika": "bg-purple-100 border-purple-300 text-purple-800",
        "Kimia": "bg-green-100 border-green-300 text-green-800",
        "Biologi": "bg-emerald-100 border-emerald-300 text-emerald-800",
        "Bahasa Indonesia": "bg-amber-100 border-amber-300 text-amber-800",
        "Bahasa Inggris": "bg-rose-100 border-rose-300 text-rose-800",
        "Upacara": "bg-red-100 border-red-300 text-red-800",
    };
    return colors[subject] || "bg-gray-100 border-gray-300 text-gray-800";
};

export const ChildSchedule: React.FC = () => {
    // Get current day
    const today = new Date();
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const currentDay = dayNames[today.getDay()];

    // Group schedule by day
    const scheduleByDay = useMemo(() => {
        const grouped: Record<string, ScheduleItem[]> = {};
        DAYS.forEach((day) => {
            grouped[day] = mockSchedule.filter((item) => item.day === day);
        });
        return grouped;
    }, []);

    // Today's schedule
    const todaySchedule = useMemo(() => {
        return mockSchedule.filter((item) => item.day === currentDay);
    }, [currentDay]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Jadwal </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anak</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Jadwal pelajaran mingguan anak Anda
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-sm font-medium text-blue-800">Semester Ganjil</span>
                    </div>
                </div>
                <Button variant="outline" onClick={handlePrint} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Cetak
                </Button>
            </div>

            {/* Child Info */}
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                            {mockChildInfo.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                            <h3 className="font-semibold">{mockChildInfo.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>NIS: {mockChildInfo.nis}</span>
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                    {mockChildInfo.class}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Today's Schedule Highlight */}
            {currentDay !== "Minggu" && todaySchedule.length > 0 && (
                <Card className="border-green-200 bg-gradient-to-r from-green-50 to-white">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-green-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Jadwal Hari Ini - {currentDay}</CardTitle>
                                <CardDescription>{todaySchedule.length} jam pelajaran</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {todaySchedule.map((item) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "flex-shrink-0 p-3 rounded-lg border-2",
                                        getSubjectColor(item.subject)
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span className="text-xs font-medium">{item.startTime} - {item.endTime}</span>
                                    </div>
                                    <p className="font-semibold text-sm">{item.subject}</p>
                                    <p className="text-xs opacity-80">{item.teacher}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Weekly Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DAYS.map((day) => (
                    <Card key={day} className={cn(
                        "overflow-hidden",
                        day === currentDay && "ring-2 ring-blue-500"
                    )}>
                        <CardHeader className="py-3 bg-muted/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold">{day}</CardTitle>
                                {day === currentDay && (
                                    <Badge className="bg-blue-800 text-white text-xs">Hari Ini</Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {scheduleByDay[day].length === 0 ? (
                                    <div className="p-4 text-center text-muted-foreground text-sm">
                                        Tidak ada jadwal
                                    </div>
                                ) : (
                                    scheduleByDay[day].map((item) => (
                                        <div key={item.id} className="p-3 hover:bg-muted/30 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className="text-xs text-muted-foreground font-medium min-w-[60px]">
                                                    {item.startTime}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn("text-xs font-medium px-2 py-0.5", getSubjectColor(item.subject))}
                                                    >
                                                        {item.subject}
                                                    </Badge>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            {item.teacher}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Info */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-blue-800" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900">Informasi</h3>
                            <p className="text-sm text-blue-800 mt-1">
                                Jadwal dapat berubah sewaktu-waktu. Silakan pantau pengumuman terbaru dari sekolah.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
