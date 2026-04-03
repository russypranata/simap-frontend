"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, History, Eye, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/shared/utils/dateFormatter";
import { EmptyState, PaginationControls } from "@/features/shared/components";
import { type AttendanceHistoryEntry } from "../../services/advisorAttendanceService";

interface AttendanceHistoryTabProps {
    isHistoryLoading: boolean;
    filteredHistory: AttendanceHistoryEntry[];
    paginatedHistory: AttendanceHistoryEntry[];
    historySearchTerm: string;
    historyDateRange: { from: string; to: string };
    activeDateFilter: "today" | "week" | "month" | null;
    historyPage: number;
    historyItemsPerPage: number;
    totalHistoryPages: number;
    activeTab: string;
    onSearchChange: (s: string) => void;
    onDateRangeChange: (r: { from: string; to: string }) => void;
    onActiveDateFilterChange: (f: "today" | "week" | "month" | null) => void;
    onPageChange: (p: number) => void;
    onItemsPerPageChange: (n: number) => void;
    onViewDetail: (id: number) => void;
    onSetToday: () => void;
    onSetThisWeek: () => void;
    onSetThisMonth: () => void;
}

export const AttendanceHistoryTab: React.FC<AttendanceHistoryTabProps> = ({
    isHistoryLoading,
    filteredHistory,
    paginatedHistory,
    historySearchTerm,
    historyDateRange,
    activeDateFilter,
    historyPage,
    historyItemsPerPage,
    totalHistoryPages,
    activeTab,
    onSearchChange,
    onDateRangeChange,
    onActiveDateFilterChange,
    onPageChange,
    onItemsPerPageChange,
    onViewDetail,
    onSetToday,
    onSetThisWeek,
    onSetThisMonth,
}) => {
    const hasActiveFilter = historyDateRange.from || historyDateRange.to || activeDateFilter;

    const handleReset = () => {
        onDateRangeChange({ from: "", to: "" });
        onSearchChange("");
        onActiveDateFilterChange(null);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <History className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Riwayat Presensi</CardTitle>
                            <CardDescription>Riwayat kegiatan dan presensi pada Tahun Ajaran aktif</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasActiveFilter && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-sm text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                onClick={handleReset}
                            >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reset
                            </Button>
                        )}
                        {isHistoryLoading ? (
                            <Skeleton className="h-6 w-24 rounded-full" />
                        ) : (
                            <Badge className="bg-blue-50 text-blue-800 border-blue-200">
                                {filteredHistory.length} Riwayat
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <div className="px-6 pb-2 pt-1">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9 h-9"
                            placeholder="Cari riwayat tanggal..."
                            value={historySearchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filter Cepat:</span>
                        <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
                            {([
                                { key: "today" as const, label: "Hari Ini", fn: onSetToday },
                                { key: "week" as const, label: "Minggu Ini", fn: onSetThisWeek },
                                { key: "month" as const, label: "Bulan Ini", fn: onSetThisMonth },
                            ]).map(({ key, label, fn }, i) => (
                                <React.Fragment key={key}>
                                    {i > 0 && <div className="w-px h-4 bg-border/50 mx-1" />}
                                    <button
                                        onClick={fn}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                                            activeDateFilter === key
                                                ? "bg-blue-800 text-white shadow-sm"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        )}
                                    >
                                        {label}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="pt-1">
                <div className="space-y-3">
                    {isHistoryLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg gap-4 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="h-9 w-24 rounded-lg" />
                            </div>
                        ))
                    ) : filteredHistory.length === 0 ? (
                        <EmptyState
                            icon={Calendar}
                            title="Tidak ada riwayat ditemukan"
                            description={
                                historyDateRange.from || historyDateRange.to
                                    ? "Tidak ada data pada rentang tanggal yang dipilih."
                                    : historySearchTerm
                                        ? `Tidak ada kegiatan dengan kata kunci "${historySearchTerm}".`
                                        : "Belum ada riwayat presensi yang tersimpan."
                            }
                        >
                            {(historyDateRange.from || historyDateRange.to || historySearchTerm) && (
                                <Button
                                    size="sm"
                                    className="mt-4 bg-blue-800 hover:bg-blue-900 text-white"
                                    onClick={handleReset}
                                >
                                    Reset Filter
                                </Button>
                            )}
                        </EmptyState>
                    ) : (
                        paginatedHistory.map((record) => (
                            <div
                                key={record.id}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50/50 transition-colors gap-4"
                            >
                                <div className="flex items-center gap-4 min-w-[200px]">
                                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-800">
                                        {formatDate(record.date, "dd MMMM yyyy")}
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 md:gap-8 flex-1 md:justify-center">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-700">Kehadiran Siswa</span>
                                            <Badge className={
                                                record.studentStats.percentage >= 90
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : record.studentStats.percentage >= 75
                                                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                        : "bg-red-100 text-red-700 border-red-200"
                                            }>
                                                {record.studentStats.percentage}%
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            <span className="font-medium text-green-600">{record.studentStats.present}</span>
                                            <span className="mx-0.5">/</span>
                                            <span>{record.studentStats.total}</span> Anggota Hadir
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-slate-700 block">Waktu</span>
                                        <Badge className="bg-blue-50 text-blue-800 border-blue-200 font-normal text-[10px] px-1.5 h-5 mt-0.5">
                                            {record.advisorStats.startTime} - {record.advisorStats.endTime}
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 hover:text-blue-900 rounded-lg gap-2"
                                    onClick={() => onViewDetail(record.id)}
                                >
                                    <Eye className="h-4 w-4" />
                                    Detail
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                <PaginationControls
                    currentPage={historyPage}
                    totalPages={totalHistoryPages}
                    totalItems={filteredHistory.length}
                    startIndex={filteredHistory.length === 0 ? 0 : (historyPage - 1) * historyItemsPerPage + 1}
                    endIndex={Math.min(historyPage * historyItemsPerPage, filteredHistory.length)}
                    itemsPerPage={historyItemsPerPage}
                    itemLabel="riwayat"
                    onPageChange={onPageChange}
                    onItemsPerPageChange={(val) => { onItemsPerPageChange(val); onPageChange(1); }}
                />
            </CardContent>
        </Card>
    );
};
