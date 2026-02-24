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
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type AttendanceStatus = "hadir" | "sakit" | "izin" | "alpa" | "libur";

interface DailyAttendanceRecord {
    date: string; // YYYY-MM-DD
    status: AttendanceStatus;
    notes?: string;
}

// Mock Data Generator
const generateMockData = (year: number, month: number): DailyAttendanceRecord[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const records: DailyAttendanceRecord[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dayOfWeek = date.getDay();
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

        if (dayOfWeek === 0) { // Sunday
            records.push({ date: dateStr, status: "libur", notes: "Hari Minggu" });
        } else if (i % 10 === 0) {
            records.push({ date: dateStr, status: "sakit", notes: "Demam" });
        } else if (i % 7 === 0) {
            records.push({ date: dateStr, status: "izin", notes: "Acara Keluarga" });
        } else {
            records.push({ date: dateStr, status: "hadir" });
        }
    }
    return records;
};

const getStatusConfig = (status: AttendanceStatus) => {
    const configs = {
        hadir: { bg: "bg-green-100", text: "text-green-700", hover: "hover:bg-green-200", icon: CheckCircle, label: "Hadir" },
        sakit: { bg: "bg-purple-100", text: "text-purple-700", hover: "hover:bg-purple-200", icon: AlertCircle, label: "Sakit" },
        izin: { bg: "bg-blue-100", text: "text-blue-700", hover: "hover:bg-blue-200", icon: Clock, label: "Izin" },
        alpa: { bg: "bg-red-100", text: "text-red-700", hover: "hover:bg-red-200", icon: XCircle, label: "Alpa" },
        libur: { bg: "bg-gray-100", text: "text-gray-500", hover: "hover:bg-gray-200", icon: CalendarIcon, label: "Libur" },
    };
    return configs[status];
};

export const ParentDailyAttendance: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const records = useMemo(() => {
        return generateMockData(currentDate.getFullYear(), currentDate.getMonth());
    }, [currentDate]);

    // Calendar navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Calendar render helpers
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 is Sunday
    
    // Adjust start day to Monday (1) if desired, but standard JS Date uses 0 for Sunday
    const startOffset = firstDayOfMonth; 

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Presensi </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Harian</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <CalendarCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Status kehadiran resmi harian dari Wali Kelas
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Calendar Card */}
                <Card className="lg:col-span-2 border-blue-200 shadow-sm">
                    <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-blue-900">
                                Kalender Kehadiran
                            </CardTitle>
                            <div className="flex items-center gap-2 bg-white rounded-lg border p-1 shadow-sm">
                                <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-bold min-w-[120px] text-center">
                                    {currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                                </span>
                                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* Day Names Header */}
                        <div className="grid grid-cols-7 mb-4 text-center">
                            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day, i) => (
                                <div key={day} className={cn(
                                    "text-sm font-semibold uppercase tracking-wider py-2",
                                    i === 0 || i === 6 ? "text-red-500" : "text-muted-foreground"
                                )}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-3">
                            {/* Empty cells for offset */}
                            {Array.from({ length: startOffset }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[80px]" />
                            ))}

                            {/* Date cells */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const record = records.find(r => r.date === dateStr);
                                const status = record?.status || "hadir"; // Default to hadir if missing logic
                                const config = getStatusConfig(status);

                                return (
                                    <div 
                                        key={day} 
                                        className={cn(
                                            "min-h-[80px] rounded-lg border p-2 flex flex-col justify-between transition-all hover:shadow-md cursor-default group",
                                            config.bg,
                                            config.text,
                                            config.hover,
                                            status === "libur" ? "bg-slate-50 border-slate-200" : ""
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={cn(
                                                "text-sm font-semibold",
                                                status === "libur" ? "text-slate-400" : "text-gray-700"
                                            )}>{day}</span>
                                            {status !== "libur" && status !== "hadir" && (
                                                <config.icon className="h-4 w-4 opacity-70" />
                                            )}
                                        </div>
                                        
                                        <div className="text-center">
                                             {status !== "hadir" && status !== "libur" ? (
                                                <Badge variant="outline" className="bg-white/50 text-[10px] h-5 px-1 border-0">
                                                    {config.label}
                                                </Badge>
                                             ) : null}
                                             {status === "libur" && (
                                                 <span className="text-[10px] text-slate-400">Libur</span>
                                             )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Summary / Legend Card */}
                <div className="space-y-6">
                    <Card>
                         <CardHeader>
                            <CardTitle className="text-base">Keterangan Status</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-3">
                             {(["hadir", "sakit", "izin", "alpa", "libur"] as const).map(status => {
                                 const config = getStatusConfig(status);
                                 const count = records.filter(r => r.status === status).length;
                                 return (
                                     <div key={status} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                                         <div className="flex items-center gap-3">
                                             <div className={cn("p-1.5 rounded-full", config.bg, config.text)}>
                                                 <config.icon className="h-4 w-4" />
                                             </div>
                                             <span className="text-sm font-medium capitalize">{config.label}</span>
                                         </div>
                                         <span className="font-bold text-sm">{count} Hari</span>
                                     </div>
                                 )
                             })}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">Catatan Bulan Ini</h3>
                            <div className="space-y-2">
                                {records.filter(r => r.notes).slice(0, 3).map((record, idx) => (
                                    <div key={idx} className="bg-white/60 p-2 rounded text-sm border border-blue-100">
                                         <span className="font-medium text-blue-800 mr-2">
                                            {new Date(record.date).getDate()} {currentDate.toLocaleDateString("id-ID", { month: "short" })}:
                                         </span>
                                         <span className="text-gray-600">{record.notes}</span>
                                    </div>
                                ))}
                                {records.filter(r => r.notes).length === 0 && (
                                    <p className="text-sm text-blue-700 italic">Tidak ada catatan khusus bulan ini.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
