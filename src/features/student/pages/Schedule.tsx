"use client";

import React from "react";
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
    Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudentSchedule } from "../hooks/useStudentSchedule";

export const StudentSchedule: React.FC = () => {
    const {
        selectedDay,
        setSelectedDay,
        viewMode,
        setViewMode,
        today,
        currentDay,
        filteredSchedule,
        todaySchedule,
        scheduleByDay,
        totalLessons,
        uniqueSubjects,
        getSubjectColor,
        DAYS,
    } = useStudentSchedule();

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
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Pelajaran</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Jadwal pelajaran mingguan kelas XII IPA 1
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
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="gap-2"
                    >
                        <Printer className="h-4 w-4" />
                        Cetak
                    </Button>
                </div>
            </div>

            {/* Today's Schedule Highlight */}
            {currentDay !== "Minggu" && todaySchedule.length > 0 && (
                <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Calendar className="h-5 w-5 text-blue-800" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Jadwal Hari Ini - {currentDay}</CardTitle>
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
                            viewMode === "weekly" && "bg-blue-800 hover:bg-blue-900 text-white"
                        )}
                    >
                        Mingguan
                    </Button>
                    <Button
                        variant={viewMode === "daily" ? "default" : "outline"}
                        onClick={() => setViewMode("daily")}
                        className={cn(
                            viewMode === "daily" && "bg-blue-800 hover:bg-blue-900 text-white"
                        )}
                    >
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
                                            <div
                                                key={item.id}
                                                className="p-3 hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="text-xs text-muted-foreground font-medium min-w-[70px]">
                                                        {item.startTime}
                                                        <br />
                                                        <span className="text-muted-foreground/60">{item.endTime}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    "text-xs font-medium px-2 py-0.5",
                                                                    getSubjectColor(item.subject)
                                                                )}
                                                            >
                                                                {item.subject}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <User className="h-3 w-3" />
                                                                {item.teacher}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {item.room}
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
            )}

            {/* Daily View */}
            {viewMode === "daily" && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">
                                    {selectedDay === "all" ? "Semua Jadwal" : `Jadwal Hari ${selectedDay}`}
                                </CardTitle>
                                <CardDescription>
                                    {filteredSchedule.length} jam pelajaran
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-sm w-24">Jam Ke</th>
                                        <th className="text-left p-4 font-medium text-sm w-32">Waktu</th>
                                        {selectedDay === "all" && (
                                            <th className="text-left p-4 font-medium text-sm w-28">Hari</th>
                                        )}
                                        <th className="text-left p-4 font-medium text-sm">Mata Pelajaran</th>
                                        <th className="text-left p-4 font-medium text-sm">Guru</th>
                                        <th className="text-left p-4 font-medium text-sm w-32">Ruangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSchedule.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <Badge variant="outline" className="bg-muted">
                                                    {item.lessonNumber}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {item.startTime} - {item.endTime}
                                                </div>
                                            </td>
                                            {selectedDay === "all" && (
                                                <td className="p-4 text-sm font-medium">{item.day}</td>
                                            )}
                                            <td className="p-4">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "font-medium",
                                                        getSubjectColor(item.subject)
                                                    )}
                                                >
                                                    {item.subject}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {item.teacher}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {item.room}
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
                        <div className="p-2 bg-blue-100 rounded-lg">
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
