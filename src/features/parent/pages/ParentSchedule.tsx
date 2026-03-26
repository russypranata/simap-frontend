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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calendar,
    Clock,
    MapPin,
    BookOpen,
    User,
    GraduationCap,
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

// Mock schedule data for student (Child)
const mockSchedule: ScheduleItem[] = [
    // Senin
    { id: 1, day: "Senin", startTime: "07:00", endTime: "07:45", subject: "Upacara", teacher: "-", room: "Lapangan", lessonNumber: 1 },
    { id: 2, day: "Senin", startTime: "07:45", endTime: "08:30", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 2 },
    { id: 3, day: "Senin", startTime: "08:30", endTime: "09:15", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 3 },
    { id: 4, day: "Senin", startTime: "09:30", endTime: "10:15", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 4 },
    { id: 5, day: "Senin", startTime: "10:15", endTime: "11:00", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 5 },
    { id: 6, day: "Senin", startTime: "11:00", endTime: "11:45", subject: "Bahasa Indonesia", teacher: "Bu Dewi", room: "XII IPA 1", lessonNumber: 6 },
    { id: 7, day: "Senin", startTime: "12:30", endTime: "13:15", subject: "Bahasa Indonesia", teacher: "Bu Dewi", room: "XII IPA 1", lessonNumber: 7 },
    { id: 8, day: "Senin", startTime: "13:15", endTime: "14:00", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 8 },

    // Selasa
    { id: 9, day: "Selasa", startTime: "07:00", endTime: "07:45", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia", lessonNumber: 1 },
    { id: 10, day: "Selasa", startTime: "07:45", endTime: "08:30", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia", lessonNumber: 2 },
    { id: 11, day: "Selasa", startTime: "08:30", endTime: "09:15", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi", lessonNumber: 3 },
    { id: 12, day: "Selasa", startTime: "09:30", endTime: "10:15", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi", lessonNumber: 4 },
    { id: 13, day: "Selasa", startTime: "10:15", endTime: "11:00", subject: "Sejarah", teacher: "Pak Hendra", room: "XII IPA 1", lessonNumber: 5 },
    { id: 14, day: "Selasa", startTime: "11:00", endTime: "11:45", subject: "Sejarah", teacher: "Pak Hendra", room: "XII IPA 1", lessonNumber: 6 },
    { id: 15, day: "Selasa", startTime: "12:30", endTime: "13:15", subject: "Pendidikan Agama", teacher: "Pak Usman", room: "XII IPA 1", lessonNumber: 7 },
    { id: 16, day: "Selasa", startTime: "13:15", endTime: "14:00", subject: "Pendidikan Agama", teacher: "Pak Usman", room: "XII IPA 1", lessonNumber: 8 },

    // Rabu
    { id: 17, day: "Rabu", startTime: "07:00", endTime: "07:45", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 1 },
    { id: 18, day: "Rabu", startTime: "07:45", endTime: "08:30", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 2 },
    { id: 19, day: "Rabu", startTime: "08:30", endTime: "09:15", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 3 },
    { id: 20, day: "Rabu", startTime: "09:30", endTime: "10:15", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 4 },
    { id: 21, day: "Rabu", startTime: "10:15", endTime: "11:00", subject: "Seni Budaya", teacher: "Bu Ratna", room: "R. Seni", lessonNumber: 5 },
    { id: 22, day: "Rabu", startTime: "11:00", endTime: "11:45", subject: "Seni Budaya", teacher: "Bu Ratna", room: "R. Seni", lessonNumber: 6 },
    { id: 23, day: "Rabu", startTime: "12:30", endTime: "13:15", subject: "PJOK", teacher: "Pak Dedi", room: "Lapangan", lessonNumber: 7 },
    { id: 24, day: "Rabu", startTime: "13:15", endTime: "14:00", subject: "PJOK", teacher: "Pak Dedi", room: "Lapangan", lessonNumber: 8 },

    // Kamis
    { id: 25, day: "Kamis", startTime: "07:00", endTime: "07:45", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 1 },
    { id: 26, day: "Kamis", startTime: "07:45", endTime: "08:30", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika", lessonNumber: 2 },
    { id: 27, day: "Kamis", startTime: "08:30", endTime: "09:15", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia", lessonNumber: 3 },
    { id: 28, day: "Kamis", startTime: "09:30", endTime: "10:15", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia", lessonNumber: 4 },
    { id: 29, day: "Kamis", startTime: "10:15", endTime: "11:00", subject: "PKn", teacher: "Bu Rina", room: "XII IPA 1", lessonNumber: 5 },
    { id: 30, day: "Kamis", startTime: "11:00", endTime: "11:45", subject: "PKn", teacher: "Bu Rina", room: "XII IPA 1", lessonNumber: 6 },
    { id: 31, day: "Kamis", startTime: "12:30", endTime: "13:15", subject: "Prakarya", teacher: "Pak Joko", room: "R. Prakarya", lessonNumber: 7 },
    { id: 32, day: "Kamis", startTime: "13:15", endTime: "14:00", subject: "Prakarya", teacher: "Pak Joko", room: "R. Prakarya", lessonNumber: 8 },

    // Jumat
    { id: 33, day: "Jumat", startTime: "07:00", endTime: "07:45", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi", lessonNumber: 1 },
    { id: 34, day: "Jumat", startTime: "07:45", endTime: "08:30", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi", lessonNumber: 2 },
    { id: 35, day: "Jumat", startTime: "08:30", endTime: "09:15", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1", lessonNumber: 3 },
    { id: 36, day: "Jumat", startTime: "09:30", endTime: "10:15", subject: "Bahasa Indonesia", teacher: "Bu Dewi", room: "XII IPA 1", lessonNumber: 4 },
    { id: 37, day: "Jumat", startTime: "10:15", endTime: "11:00", subject: "BK", teacher: "Bu Linda", room: "R. BK", lessonNumber: 5 },

    // Sabtu
    { id: 38, day: "Sabtu", startTime: "07:00", endTime: "07:45", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 1 },
    { id: 39, day: "Sabtu", startTime: "07:45", endTime: "08:30", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1", lessonNumber: 2 },
    { id: 40, day: "Sabtu", startTime: "08:30", endTime: "09:15", subject: "TIK", teacher: "Pak Fajar", room: "Lab Komputer", lessonNumber: 3 },
    { id: 41, day: "Sabtu", startTime: "09:30", endTime: "10:15", subject: "TIK", teacher: "Pak Fajar", room: "Lab Komputer", lessonNumber: 4 },
    { id: 42, day: "Sabtu", startTime: "10:15", endTime: "11:00", subject: "Muatan Lokal", teacher: "Bu Yuli", room: "XII IPA 1", lessonNumber: 5 },
];

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

// Subject colors for visual variety
const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
        "Matematika": "bg-blue-100 border-blue-300 text-blue-800",
        "Fisika": "bg-purple-100 border-purple-300 text-purple-800",
        "Kimia": "bg-green-100 border-green-300 text-green-800",
        "Biologi": "bg-emerald-100 border-emerald-300 text-emerald-800",
        "Bahasa Indonesia": "bg-amber-100 border-amber-300 text-amber-800",
        "Bahasa Inggris": "bg-rose-100 border-rose-300 text-rose-800",
        "Sejarah": "bg-orange-100 border-orange-300 text-orange-800",
        "Pendidikan Agama": "bg-cyan-100 border-cyan-300 text-cyan-800",
        "Seni Budaya": "bg-pink-100 border-pink-300 text-pink-800",
        "PJOK": "bg-lime-100 border-lime-300 text-lime-800",
        "PKn": "bg-indigo-100 border-indigo-300 text-indigo-800",
        "Prakarya": "bg-teal-100 border-teal-300 text-teal-800",
        "BK": "bg-sky-100 border-sky-300 text-sky-800",
        "TIK": "bg-violet-100 border-violet-300 text-violet-800",
        "Muatan Lokal": "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800",
        "Upacara": "bg-red-100 border-red-300 text-red-800",
    };
    return colors[subject] || "bg-gray-100 border-gray-300 text-gray-800";
};

export const ParentSchedule: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"daily" | "weekly">("weekly");

    // Get current day
    const today = new Date();
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const currentDay = dayNames[today.getDay()];

    // Filter schedule based on selected day
    const filteredSchedule = selectedDay === "all" ? mockSchedule : mockSchedule.filter((item) => item.day === selectedDay);

    // Get today's schedule
    const todaySchedule = mockSchedule.filter((item) => item.day === currentDay);

    // Group schedule by day
    const scheduleByDay = (() => {
        const grouped: Record<string, ScheduleItem[]> = {};
        DAYS.forEach((day) => {
            grouped[day] = mockSchedule.filter((item) => item.day === day);
        });
        return grouped;
    })();

    // Stats
    const totalLessons = mockSchedule.length;
    const uniqueSubjects = new Set(mockSchedule.map((s) => s.subject)).size;



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Jadwal </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Pelajaran Anak</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Jadwal pelajaran mingguan kelas XII IPA 1 (Ananda Budi Santoso)
                    </p>
                </div>
            </div>

            {/* Today's Schedule Highlight */}
            {currentDay !== "Minggu" && todaySchedule.length > 0 && (
                <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-100 rounded-xl">
                                    <Calendar className="h-5 w-5 text-blue-800" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Jadwal Anak Hari Ini - {currentDay}</CardTitle>
                                    <CardDescription>{todaySchedule.length} jam pelajaran</CardDescription>
                                </div>
                            </div>
                            <Badge className="bg-blue-800 text-white">
                                {today.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </Badge>
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
                                    <div className="flex items-center gap-1 mt-1">
                                        <User className="h-3 w-3 opacity-70" />
                                        <span className="text-xs opacity-80">{item.teacher}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* View Toggle & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === "weekly" ? "default" : "outline"}
                        onClick={() => setViewMode("weekly")}
                        className={cn(
                            "gap-2",
                            viewMode === "weekly" && "bg-blue-800 hover:bg-blue-900 text-white"
                        )}
                    >
                        <Calendar className="h-4 w-4" />
                        Mingguan
                    </Button>
                    <Button
                        variant={viewMode === "daily" ? "default" : "outline"}
                        onClick={() => setViewMode("daily")}
                        className={cn(
                            "gap-2",
                            viewMode === "daily" && "bg-blue-800 hover:bg-blue-900 text-white"
                        )}
                    >
                        <BookOpen className="h-4 w-4" />
                        Harian
                    </Button>
                </div>

                {viewMode === "daily" && (
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Pilih Hari" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Hari</SelectItem>
                            {DAYS.map((day) => (
                                <SelectItem key={day} value={day}>{day}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Weekly View */}
            {viewMode === "weekly" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {DAYS.map((day) => (
                        <Card
                            key={day}
                            className={cn(
                                "overflow-hidden transition-shadow hover:shadow-lg",
                                day === currentDay && "ring-2 ring-blue-500 border-blue-300"
                            )}
                        >
                            <CardHeader
                                className={cn(
                                    "py-3 border-b",
                                    day === currentDay
                                        ? "bg-blue-50 border-blue-200"
                                        : "bg-slate-50 border-slate-200"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "w-2.5 h-2.5 rounded-full flex-shrink-0",
                                                scheduleByDay[day].length === 0
                                                    ? "bg-gray-300"
                                                    : day === currentDay
                                                        ? "bg-blue-600"
                                                        : "bg-blue-400"
                                            )}
                                        />
                                        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                                            {day}
                                        </CardTitle>
                                    </div>
                                    {day === currentDay && (
                                        <Badge className="bg-blue-600 text-white text-xs font-medium px-2 py-0">
                                            Hari Ini
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-2">
                                <div className="space-y-1">
                                    {scheduleByDay[day].length === 0 ? (
                                        <div className="py-8 text-center">
                                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 mb-2">
                                                <BookOpen className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Tidak ada jadwal
                                            </p>
                                        </div>
                                    ) : (
                                        scheduleByDay[day].map((item) => (
                                            <div
                                                key={item.id}
                                                className="group p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                                            >
                                                <div className="flex items-start gap-2.5">
                                                    {/* Time column */}
                                                    <div className="flex flex-col items-center gap-1 min-w-[70px] pt-0.5">
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0 h-5"
                                                        >
                                                            {item.lessonNumber}
                                                        </Badge>
                                                        <div className="text-xs text-slate-600 font-medium whitespace-nowrap">
                                                            {item.startTime} - {item.endTime}
                                                        </div>
                                                    </div>
                                                    {/* Divider line */}
                                                    <div className="w-px self-stretch bg-slate-200 group-hover:bg-blue-200 transition-colors" />
                                                    {/* Content column */}
                                                    <div className="flex-1 min-w-0">
                                                        {/* Subject */}
                                                        <div className="mb-1.5">
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    "text-xs font-semibold px-2.5 py-1",
                                                                    getSubjectColor(item.subject)
                                                                )}
                                                            >
                                                                {item.subject}
                                                            </Badge>
                                                        </div>
                                                        {/* Teacher and room */}
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                                <User className="h-3 w-3 text-slate-400 flex-shrink-0" />
                                                                <span className="truncate">{item.teacher}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                                <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                                                                <span className="truncate">{item.room}</span>
                                                            </div>
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
            )}

            {/* Daily View */}
            {viewMode === "daily" && (
                <Card className="border-blue-200 shadow-sm overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2.5 bg-blue-100 rounded-xl">
                                    <BookOpen className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-slate-800">
                                        {selectedDay === "all" ? "Semua Jadwal" : `Jadwal Hari ${selectedDay}`}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-slate-600">
                                        {filteredSchedule.length} jam pelajaran terdaftar
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold h-7 px-3 rounded-full text-[11px]">
                                    {filteredSchedule.length} Jam Pelajaran
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-20">Jam</th>
                                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-44">Waktu</th>
                                        {selectedDay === "all" && (
                                            <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-32">Hari</th>
                                        )}
                                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">Mata Pelajaran</th>
                                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">Guru Pengampu</th>
                                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-40">Lokasi / Ruangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSchedule.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="p-4 text-center align-middle">
                                                <Badge
                                                    variant="secondary"
                                                    className="font-bold bg-slate-100 text-slate-600 border-slate-200 px-2.5 py-1 text-xs"
                                                >
                                                    {item.lessonNumber}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span className="font-mono">{item.startTime} - {item.endTime}</span>
                                                </div>
                                            </td>
                                            {selectedDay === "all" && (
                                                <td className="p-4 align-middle">
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-semibold">
                                                        {item.day}
                                                    </Badge>
                                                </td>
                                            )}
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "font-semibold px-2.5 py-1 border shadow-sm transition-transform hover:scale-105 cursor-default",
                                                            getSubjectColor(item.subject).replace("border-300", "border-200")
                                                        )}
                                                    >
                                                        {item.subject}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 shrink-0">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">{item.teacher}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 shrink-0">
                                                        <MapPin className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">{item.room}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Info */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                            <GraduationCap className="h-5 w-5 text-blue-800" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900">Informasi Jadwal</h3>
                            <ul className="mt-2 space-y-1 text-sm text-blue-800">
                                <li>• Total {totalLessons} jam pelajaran per minggu</li>
                                <li>• {uniqueSubjects} mata pelajaran berbeda</li>
                                <li>• Istirahat: 09:15-09:30 dan 11:45-12:30</li>
                                <li>• Jadwal dapat berubah sewaktu-waktu, silakan periksa pengumuman terbaru</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
