"use client";

import React from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    RefreshCw,
    AlertTriangle,
    Inbox,
    Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useParentPrayerAttendance } from "../hooks/useParentPrayerAttendance";
import type { PrayerStatus, PrayerRecord } from "../services/parentPrayerAttendanceService";

// Helper functions (same as original, no change to score logic)
const getStatusConfig = (status: PrayerStatus) => {
    const configs = {
        berjamaah: { label: "Berjamaah", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Users, score: 5 },
        masbuk: { label: "Masbuk", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock, score: 4 },
        munfarid: { label: "Munfarid", color: "bg-amber-100 text-amber-700 border-amber-200", icon: User, score: 3 },
        tidak_hadir: { label: "Tidak Hadir", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, score: 0 },
        haid: { label: "Haid", color: "bg-pink-100 text-pink-700 border-pink-200", icon: CheckCircle, score: 0 }, 
        sakit: { label: "Sakit", color: "bg-gray-100 text-gray-700 border-gray-200", icon: CheckCircle, score: 0 },
        izin: { label: "Izin", color: "bg-gray-100 text-gray-700 border-gray-200", icon: CheckCircle, score: 0 },
        belum_dicatat: { label: "Belum", color: "bg-slate-100 text-slate-500 border-slate-200", icon: Clock, score: 0 },
    };
    return configs[status];
};

const calculateDailyScore = (record: PrayerRecord) => {
    const statuses: PrayerStatus[] = [record.subuh, record.dzuhur, record.ashar, record.maghrib, record.isya];
    let score = 0;
    let maxScore = 0;

    statuses.forEach(status => {
        if (status !== "haid" && status !== "sakit" && status !== "izin" && status !== "belum_dicatat") { 
            score += getStatusConfig(status).score;
            maxScore += 5;
        }
    });

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
};

// --- Skeletons and Empty States ---

const ParentPrayerAttendanceSkeleton = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-[260px]" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20 p-4 rounded-lg border">
                <Skeleton className="h-10 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <div className="h-14 bg-slate-50 border-b border-slate-200" />
                <div className="p-0 space-y-0">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-none border-b border-slate-100" />
                    ))}
                </div>
            </div>
        </div>
    );
};

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="space-y-6">
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
            </div>
        </div>
        <Card className="border-red-200 shadow-sm mt-6">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-red-100 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Gagal Memuat Data</h3>
                <p className="text-sm text-slate-500 max-w-md mb-6">{error}</p>
                <Button onClick={onRetry} variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50">
                    <RefreshCw className="h-4 w-4" />
                    Coba Lagi
                </Button>
            </CardContent>
        </Card>
    </div>
);

export const ParentPrayerAttendance: React.FC = () => {
    const {
        records,
        children,
        selectedChildId,
        weekOffset,
        isLoading,
        isFetching,
        error,
        setSelectedChildId,
        handleNextWeek,
        handlePrevWeek,
        handleTodayWeek,
        refetch,
    } = useParentPrayerAttendance();

    if (isLoading) return <ParentPrayerAttendanceSkeleton />;
    if (error) return <ErrorState error={error} onRetry={refetch} />;

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

                {/* Filter Anak */}
                {children.length > 1 && (
                    <div className="no-print">
                        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                            <SelectTrigger className="w-full sm:w-[220px] h-9 bg-white shadow-sm border-slate-200">
                                <Users className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                                <div className="flex-1 text-left truncate">
                                    <SelectValue placeholder="Pilih Anak" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {children.map(child => (
                                    <SelectItem key={child.id} value={child.id}>
                                        {child.name} — {child.class}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Summary / Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-1.5 bg-white rounded-lg border shadow-sm px-3 py-1.5">
                    <button
                        onClick={handlePrevWeek}
                        className="h-7 w-7 p-0 rounded-lg font-medium text-sm transition-colors flex items-center justify-center bg-blue-800 text-white hover:bg-blue-900"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div 
                        className="flex items-center justify-center gap-2 min-w-[150px] cursor-pointer group"
                        onClick={handleTodayWeek}
                        title="Kembali ke minggu ini"
                    >
                        <CalendarIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">
                            {weekOffset === 0 ? "Minggu Ini" : 
                             weekOffset === -1 ? "Minggu Lalu" : 
                             weekOffset > 0 ? `${weekOffset} Minggu ke Depan` : 
                             `${Math.abs(weekOffset)} Minggu Lalu`}
                        </span>
                    </div>
                    <button
                        onClick={handleNextWeek}
                        disabled={weekOffset >= 0}
                        className={cn(
                            "h-7 w-7 p-0 rounded-lg font-medium text-sm transition-colors flex items-center justify-center",
                            weekOffset < 0 
                                ? "bg-blue-800 text-white hover:bg-blue-900" 
                                : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        )}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium shadow-sm">
                        <Users className="w-3.5 h-3.5" />
                        <span>Berjamaah</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Masbuk</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium shadow-sm">
                        <User className="w-3.5 h-3.5" />
                        <span>Munfarid</span>
                    </div>
                </div>
            </div>

            {/* Table View */}
            <div className="rounded-xl border border-slate-200 overflow-hidden relative bg-white shadow-sm">
                {isFetching && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-30 flex items-center justify-center rounded-xl">
                        <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-lg rounded-xl px-5 py-3">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <span className="text-sm font-medium text-slate-600">Memuat data minggu...</span>
                        </div>
                    </div>
                )}
                
                {records.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4 transition-transform hover:scale-110">
                            <Moon className="h-8 w-8 text-slate-400" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Catatan Presensi</h3>
                            <p className="text-sm text-slate-500 max-w-md">
                                Tidak ada riwayat sholat yang tercatat untuk minggu yang direquest. Silakan pilih minggu lainnya.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider w-40 border-r border-slate-200">Hari / Tanggal</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider border-r border-slate-200 bg-slate-100/50">Subuh</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider border-r border-slate-200">Dzuhur</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider border-r border-slate-200 bg-slate-100/50">Ashar</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider border-r border-slate-200">Maghrib</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider border-r border-slate-200 bg-slate-100/50">Isya</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider w-24">Skor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => {
                                    const dailyScore = calculateDailyScore(record);
                                    return (
                                        <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 border-r border-slate-200 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex-shrink-0 border border-blue-200/50">
                                                        <CalendarIcon className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm text-slate-800">{record.day}</span>
                                                        <span className="text-xs text-slate-500 font-medium mt-0.5">
                                                            {new Date(record.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            {["subuh", "dzuhur", "ashar", "maghrib", "isya"].map((time, idx) => {
                                                const status = record[time as keyof PrayerRecord] as PrayerStatus;
                                                const config = getStatusConfig(status);
                                                const Icon = config.icon;
                                                
                                                // Renders empty cell for unrecorded future dates to keep it clean
                                                if (status === "belum_dicatat") {
                                                    return (
                                                        <td key={time} className={cn("p-2 border-r border-slate-200 align-middle", idx % 2 === 0 && "bg-slate-50/30")}>
                                                            <div className="flex justify-center flex-col items-center gap-1.5 opacity-50">
                                                                <div className="w-7 h-7 rounded-full bg-slate-100 border border-dashed border-slate-300"></div>
                                                                <span className="text-[10px] font-medium text-slate-400">Belum</span>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                
                                                return (
                                                    <td key={time} className={cn("p-2 border-r border-slate-200 text-center align-middle", idx % 2 === 0 && "bg-slate-50/30")}>
                                                        <div className="flex flex-col items-center justify-center gap-1.5">
                                                            <div className={cn(
                                                                "p-1.5 rounded-full shadow-sm border",
                                                                config.color
                                                            )}>
                                                                <Icon className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-600 capitalize">
                                                                {config.label}
                                                            </span>
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                            <td className="p-4 text-center align-middle">
                                                {record.subuh === "belum_dicatat" && record.isya === "belum_dicatat" ? (
                                                    <span className="text-xs font-semibold text-slate-400 border border-slate-200 px-2 py-1 rounded-md bg-slate-50">-</span>
                                                ) : (
                                                    <div className={cn(
                                                        "inline-flex items-center justify-center h-10 w-10 rounded-full text-xs font-bold border-2 shadow-sm",
                                                        dailyScore >= 90 ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                                                        dailyScore >= 75 ? "border-blue-200 bg-blue-50 text-blue-700" :
                                                        "border-red-200 bg-red-50 text-red-700"
                                                    )}>
                                                        {dailyScore}%
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
