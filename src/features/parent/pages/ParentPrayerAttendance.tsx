"use client";

import React from "react";
import {
    Calendar as CalendarIcon,
    Moon,
    CheckCircle,
    XCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useParentPrayerAttendance } from "../hooks/useParentPrayerAttendance";
import type { PrayerStatus, PrayerRecord } from "../services/parentPrayerAttendanceService";
import { ErrorState, LoadingOverlay, PageHeader, ChildSelector } from "@/features/shared/components";

const MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const getStatusConfig = (status: PrayerStatus) => {
    const configs = {
        hadir_tepat_waktu: { label: "Hadir", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle },
        masbuk:            { label: "Masbuk", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
        haid:              { label: "Haid", color: "bg-pink-100 text-pink-700 border-pink-200", icon: CheckCircle },
        tanpa_keterangan:  { label: "Tdk Hadir", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
        belum_dicatat:     { label: "Belum", color: "bg-slate-100 text-slate-400 border-slate-200", icon: Clock },
    };
    return configs[status];
};

const PRAYER_COLUMNS: { key: keyof PrayerRecord; label: string }[] = [
    { key: "subuh",    label: "Subuh" },
    { key: "dhuha",    label: "Dhuha" },
    { key: "dzuhur",   label: "Dzuhur" },
    { key: "ashar",    label: "Ashar" },
    { key: "maghrib",  label: "Maghrib" },
    { key: "isya",     label: "Isya" },
    { key: "tahajjud", label: "Tahajjud" },
];

const ParentPrayerAttendanceSkeleton = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-[220px]" />
        </div>
        <div className="flex justify-between items-center">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-8 w-64" />
        </div>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <div className="h-14 bg-slate-50 border-b border-slate-200" />
            {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-none border-b border-slate-100" />
            ))}
        </div>
    </div>
);



export const ParentPrayerAttendance: React.FC = () => {
    const {
        records,
        children,
        selectedChildId,
        selectedMonth,
        selectedYear,
        isLoading,
        isFetching,
        error,
        isCurrentMonth,
        setSelectedChildId,
        handlePrevMonth,
        handleNextMonth,
        handleCurrentMonth,
        refetch,
    } = useParentPrayerAttendance();

    if (isLoading) return <ParentPrayerAttendanceSkeleton />;
    if (error) return <ErrorState error={error} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Presensi"
                titleHighlight="Sholat"
                icon={Moon}
                description="Monitoring kehadiran sholat wajib berjamaah di masjid/asrama"
            >
                <ChildSelector children={children} selectedChildId={selectedChildId} onSelect={setSelectedChildId} />
            </PageHeader>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                {/* Navigasi Bulan */}
                <div className="flex items-center gap-1.5 bg-white rounded-lg border shadow-sm px-3 py-1.5">
                    <button
                        onClick={handlePrevMonth}
                        className="h-7 w-7 rounded-lg flex items-center justify-center bg-blue-800 text-white hover:bg-blue-900 transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div
                        className="flex items-center justify-center gap-2 min-w-[160px] cursor-pointer group"
                        onClick={handleCurrentMonth}
                        title="Kembali ke bulan ini"
                    >
                        <CalendarIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">
                            {MONTHS[selectedMonth]} {selectedYear}
                        </span>
                    </div>
                    <button
                        onClick={handleNextMonth}
                        disabled={isCurrentMonth}
                        className={cn(
                            "h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
                            !isCurrentMonth
                                ? "bg-blue-800 text-white hover:bg-blue-900"
                                : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        )}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-2 justify-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Hadir Tepat Waktu</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Masbuk</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 text-xs font-medium shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Haid</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-medium shadow-sm">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Tanpa Keterangan</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden relative bg-white shadow-sm">
                {isFetching && <LoadingOverlay />}

                {records.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4">
                            <Moon className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Catatan Presensi</h3>
                        <p className="text-sm text-slate-500 max-w-md mt-1">
                            Tidak ada riwayat sholat yang tercatat untuk periode yang dipilih.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider w-40 border-r border-slate-200">
                                        Hari / Tanggal
                                    </th>
                                    {PRAYER_COLUMNS.map((col, idx) => (
                                        <th
                                            key={col.key}
                                            className={cn(
                                                "text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider border-r border-slate-200",
                                                idx % 2 === 0 && "bg-slate-100/50"
                                            )}
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => (
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
                                        {PRAYER_COLUMNS.map(({ key }, idx) => {
                                            const status = record[key] as PrayerStatus;
                                            const config = getStatusConfig(status);
                                            const Icon = config.icon;

                                            if (status === "belum_dicatat") {
                                                return (
                                                    <td key={key} className={cn("p-2 border-r border-slate-200 align-middle", idx % 2 === 0 && "bg-slate-50/30")}>
                                                        <div className="flex justify-center flex-col items-center gap-1.5 opacity-40">
                                                            <div className="w-7 h-7 rounded-full bg-slate-100 border border-dashed border-slate-300" />
                                                            <span className="text-[10px] font-medium text-slate-400">Belum</span>
                                                        </div>
                                                    </td>
                                                );
                                            }

                                            return (
                                                <td key={key} className={cn("p-2 border-r border-slate-200 text-center align-middle", idx % 2 === 0 && "bg-slate-50/30")}>
                                                    <div className="flex flex-col items-center justify-center gap-1.5">
                                                        <div className={cn("p-1.5 rounded-full shadow-sm border", config.color)}>
                                                            <Icon className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-600">{config.label}</span>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
