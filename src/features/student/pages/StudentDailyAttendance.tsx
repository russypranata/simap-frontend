"use client";

import React, { useState } from "react";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock,
    AlertCircle, CalendarCheck, FileText, Thermometer, HandHeart, X, Info,
    RefreshCw, RotateCcw, Check, CalendarOff, Filter, CircleDashed, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentDailyAttendance } from "../hooks/useStudentDailyAttendance";
import type { AttendanceStatus } from "../services/studentAttendanceService";
import { ErrorState, LoadingOverlay, PageHeader } from "@/features/shared/components";

interface SelectedRecord {
    date: string;
    day: number;
    status: "sakit" | "izin";
    notes?: string;
    submittedBy?: string;
    submittedAt?: string;
}

const getStatusConfig = (status: AttendanceStatus) => {
    const configs = {
        hadir: { bg: "bg-green-100", text: "text-green-700", hover: "hover:bg-green-200", icon: CheckCircle, label: "Hadir" },
        sakit: { bg: "bg-yellow-100", text: "text-yellow-700", hover: "hover:bg-yellow-200", icon: AlertCircle, label: "Sakit" },
        izin: { bg: "bg-blue-100", text: "text-blue-700", hover: "hover:bg-blue-200", icon: Clock, label: "Izin" },
        alpa: { bg: "bg-red-100", text: "text-red-700", hover: "hover:bg-red-200", icon: XCircle, label: "Alpa" },
        libur: { bg: "bg-red-50", text: "text-red-400", hover: "hover:bg-red-100", icon: CalendarIcon, label: "Libur" },
        belum_dicatat: { bg: "bg-slate-50", text: "text-slate-400", hover: "hover:bg-slate-100", icon: CircleDashed, label: "Belum Dicatat" },
    };
    return configs[status];
};

const Skeleton_ = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-48" />
        </div>
        <Card className="border-blue-200">
            <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-40" />
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-2">
                <div className="mb-6 flex flex-wrap justify-center gap-3">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-32 rounded-xl" />)}
                </div>
                <div className="grid grid-cols-7 gap-3">
                    {Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
                </div>
            </CardContent>
        </Card>
    </div>
);

export const StudentDailyAttendance: React.FC = () => {
    const [selectedRecord, setSelectedRecord] = useState<SelectedRecord | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("semua");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempYearId, setTempYearId] = useState<string>("");
    const [tempSemesterId, setTempSemesterId] = useState<string>("");

    const {
        records, stats, academicYears, selectedYearId, selectedSemesterId, currentDate,
        isLoading, isFetching, error,
        setSelectedYearId, setSelectedSemesterId,
        prevMonth, nextMonth, canGoPrev, canGoNext, refetch,
    } = useStudentDailyAttendance();

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthLabel = currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

    const isCellDimmed = (status: AttendanceStatus) => filterStatus !== "semua" && status !== filterStatus;

    if (isLoading) return <Skeleton_ />;
    if (error) return (
        <div className="space-y-6">
            <PageHeader title="Presensi" titleHighlight="Harian" icon={CalendarCheck} />
            <ErrorState error={error} onRetry={refetch} />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Presensi"
                titleHighlight="Harian"
                icon={CalendarCheck}
                description="Status kehadiran resmi harian dari Wali Kelas"
            >
                <div className="flex items-center gap-3">
                    <Dialog open={isFilterOpen} onOpenChange={(open) => {
                        if (open) { setTempYearId(selectedYearId); setTempSemesterId(selectedSemesterId); }
                        setIsFilterOpen(open);
                    }}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-9 gap-2 bg-white text-slate-700 border-slate-200 shadow-sm font-medium">
                                <Filter className="h-4 w-4 text-slate-500" />
                                <span className="hidden sm:inline">Filter</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-2xl">
                            <DialogHeader className="flex-row items-center gap-4">
                                <div className="p-2.5 bg-blue-100 rounded-xl"><Filter className="h-5 w-5 text-blue-700" /></div>
                                <div>
                                    <DialogTitle className="text-lg font-semibold text-slate-900">Filter Presensi</DialogTitle>
                                    <DialogDescription className="text-slate-500">Sesuaikan tahun ajaran dan semester</DialogDescription>
                                </div>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-slate-400" /> Tahun Ajaran
                                        </label>
                                        <Select value={tempYearId} onValueChange={setTempYearId}>
                                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {academicYears.map(y => <SelectItem key={y.id} value={y.id}>TA {y.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-slate-400" /> Semester
                                        </label>
                                        <Select value={tempSemesterId} onValueChange={setTempSemesterId}>
                                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {academicYears.find(y => y.id === tempYearId)?.semesters.map(s => (
                                                    <SelectItem key={s.id} value={s.id}>Semester {s.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                                <Button variant="ghost" onClick={() => { setTempYearId(academicYears[0]?.id); setTempSemesterId(academicYears[0]?.semesters[0]?.id); }} className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2">
                                    <RotateCcw className="h-4 w-4" /> Reset
                                </Button>
                                <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2" onClick={() => { setSelectedYearId(tempYearId); setSelectedSemesterId(tempSemesterId); setIsFilterOpen(false); }}>
                                    <Check className="h-4 w-4" /> Terapkan
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </PageHeader>

            <Card className="lg:col-span-3 border-blue-200 shadow-sm relative">
                {isFetching && <LoadingOverlay />}
                <CardHeader className="pb-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 rounded-xl"><CalendarIcon className="h-5 w-5 text-blue-700" /></div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Kalender Kehadiran</CardTitle>
                                <div className="flex items-center gap-2">
                                    <CardDescription className="text-sm text-slate-600">Kehadiran harian kamu</CardDescription>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold border border-green-200">
                                        {stats.percentage}% Hadir Bulan Ini
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full sm:w-[170px] h-9 bg-white shadow-sm border-slate-200">
                                    <Filter className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Status</SelectItem>
                                    <SelectItem value="hadir">Hadir</SelectItem>
                                    <SelectItem value="sakit">Sakit</SelectItem>
                                    <SelectItem value="izin">Izin</SelectItem>
                                    <SelectItem value="alpa">Alpa</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1.5 bg-white rounded-lg border shadow-sm px-2 py-1.5">
                                <button onClick={prevMonth} disabled={!canGoPrev} className={cn("h-7 w-7 rounded-lg flex items-center justify-center transition-colors", canGoPrev ? "bg-blue-800 text-white hover:bg-blue-900" : "bg-slate-100 text-slate-300 cursor-not-allowed")}>
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <span className="text-sm font-semibold min-w-[120px] text-center text-slate-900">{monthLabel}</span>
                                <button onClick={nextMonth} disabled={!canGoNext} className={cn("h-7 w-7 rounded-lg flex items-center justify-center transition-colors", canGoNext ? "bg-blue-800 text-white hover:bg-blue-900" : "bg-slate-100 text-slate-300 cursor-not-allowed")}>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                    <div className="mb-8">
                        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                            {(["hadir", "sakit", "izin", "alpa", "belum_dicatat"] as const).map(status => {
                                const config = getStatusConfig(status);
                                const count = records.filter(r => r.status === status).length;
                                return (
                                    <div key={status} className={cn("flex items-center gap-3 p-3 lg:px-5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/80 transition-all flex-1 min-w-[140px] md:flex-initial cursor-pointer", filterStatus === status && "ring-2 ring-primary/30 border-primary/20 bg-primary/5")} onClick={() => setFilterStatus(filterStatus === status ? "semua" : status)}>
                                        <div className={cn("p-2 rounded-lg shrink-0", config.bg, config.text)}><config.icon className="h-4 w-4" /></div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold text-slate-700 truncate">{config.label}</span>
                                            <span className="text-xs font-medium text-slate-500">{count} Hari</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {records.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                            <div className="w-16 h-16 rounded-full bg-white border border-dashed border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                                <CalendarOff className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Data Presensi</h3>
                            <p className="text-sm text-slate-500 max-w-md mb-6">Belum ada data presensi untuk bulan {monthLabel}.</p>
                            <Button onClick={refetch} variant="outline" className="gap-2">
                                <RefreshCw className="h-4 w-4" /> Muat Ulang
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-7 mb-4 text-center">
                                {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day, i) => (
                                    <div key={day} className={cn("text-sm font-semibold uppercase tracking-wider py-2", i === 0 || i === 6 ? "text-red-500" : "text-muted-foreground")}>{day}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-3">
                                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="min-h-[80px]" />)}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                    const record = records.find(r => r.date === dateStr);
                                    const status = record?.status || "belum_dicatat";
                                    const config = getStatusConfig(status);
                                    const dimmed = isCellDimmed(status);
                                    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                                    return (
                                        <div key={day} className={cn("min-h-[85px] rounded-lg border p-2 flex flex-col justify-between transition-all cursor-default group relative overflow-hidden", config.bg, config.text, config.hover, status === "libur" ? "border-red-200" : "", isToday ? "ring-2 ring-primary ring-offset-1 z-20 shadow-md" : "border-slate-100", (status === "sakit" || status === "izin") && record?.notes ? "cursor-pointer hover:shadow-md" : "", dimmed && "opacity-25 scale-[0.97]")}
                                            onClick={() => record && (status === "sakit" || status === "izin") && setSelectedRecord({ date: record.date, day, status, notes: record.notes, submittedBy: record.submittedBy, submittedAt: record.submittedAt })}>
                                            {isToday && (
                                                <div className="absolute top-0 right-0 p-1">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.08]">
                                                <span className="text-[48px] font-bold select-none leading-none">{day}</span>
                                            </div>
                                            <div className="flex justify-between items-start relative z-10">
                                                <span className={cn("text-xs font-bold", status === "libur" ? "text-red-400" : "text-slate-600 group-hover:text-slate-900")}>{day}</span>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="p-0.5 rounded-md hover:bg-white/40 transition-colors cursor-help">
                                                                <config.icon className={cn("h-3.5 w-3.5", config.text, "opacity-70")} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent showArrow={false} className="p-0 border border-slate-200 shadow-xl rounded-xl overflow-hidden bg-white min-w-[150px]">
                                                            <div className={cn("px-3 py-1.5 border-b flex items-center justify-center", status === "hadir" ? "bg-green-50/50 border-green-100" : status === "sakit" ? "bg-yellow-50/50 border-yellow-100" : status === "izin" ? "bg-blue-50/50 border-blue-100" : status === "belum_dicatat" ? "bg-slate-50/50 border-slate-100" : "bg-red-50/50 border-red-100")}>
                                                                <span className={cn("text-[10px] font-bold uppercase tracking-wider", status === "hadir" ? "text-green-700" : status === "sakit" ? "text-yellow-700" : status === "izin" ? "text-blue-700" : status === "belum_dicatat" ? "text-slate-500" : "text-red-700")}>{config.label}</span>
                                                            </div>
                                                            <div className="px-3 py-2.5">
                                                                {status === "libur" ? <p className="text-[11px] text-slate-600">{record?.notes || "Hari Libur"}</p> :
                                                                 status === "belum_dicatat" ? <p className="text-[11px] text-slate-400 italic">Wali Kelas belum mencatat</p> :
                                                                 status === "alpa" ? <p className="text-[11px] text-slate-600 italic">Tanpa Keterangan</p> :
                                                                 status === "hadir" ? <p className="text-[11px] text-slate-600 italic">Tercatat oleh Wali Kelas</p> : (
                                                                    <>
                                                                        <p className="text-[11px] text-slate-600 italic">Tercatat oleh Wali Kelas</p>
                                                                        <p className="text-[10px] text-primary/80 font-medium flex items-center gap-1.5 mt-2"><Info className="h-3 w-3" />Klik untuk detail</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="flex items-end justify-center relative z-10 mt-auto pt-1">
                                                <Badge variant="outline" className={cn("text-[9px] h-4.5 px-1.5 font-bold border-0 uppercase tracking-tighter whitespace-nowrap opacity-90", status === "hadir" ? "bg-green-100/60 text-green-700" : status === "sakit" ? "bg-yellow-100/60 text-yellow-700" : status === "izin" ? "bg-blue-100/60 text-blue-700" : status === "belum_dicatat" ? "bg-slate-100/60 text-slate-400" : status === "alpa" ? "bg-red-100/60 text-red-700" : "bg-transparent text-red-400")}>
                                                    {config.label}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        {selectedRecord && (
                            <>
                                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-2", selectedRecord.status === "sakit" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600")}>
                                    {selectedRecord.status === "sakit" ? <Thermometer className="h-6 w-6" /> : <HandHeart className="h-6 w-6" />}
                                </div>
                                <DialogTitle className={cn("text-lg font-semibold", selectedRecord.status === "sakit" ? "text-yellow-700" : "text-blue-700")}>
                                    {selectedRecord.status === "sakit" ? "Detail Ketidakhadiran karena Sakit" : "Detail Izin"}
                                </DialogTitle>
                                <DialogDescription>Informasi detail ketidakhadiran</DialogDescription>
                            </>
                        )}
                    </DialogHeader>
                    {selectedRecord && (
                        <div className="space-y-4 mt-2">
                            <div className={cn("rounded-lg border p-4", selectedRecord.status === "sakit" ? "border-yellow-300 bg-yellow-100" : "border-blue-300 bg-blue-100")}>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-0.5">{new Date(selectedRecord.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</p>
                                        <Badge variant="outline" className={cn("mt-1.5 text-xs font-semibold", selectedRecord.status === "sakit" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-blue-100 text-blue-700 border-blue-300")}>
                                            {selectedRecord.status === "sakit" ? "Sakit" : "Izin"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Keterangan</p>
                                <div className="flex items-start gap-3">
                                    {selectedRecord.status === "sakit" ? <Thermometer className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" /> : <FileText className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />}
                                    <p className="text-sm text-slate-700 font-medium">{selectedRecord.notes || "Tidak ada keterangan"}</p>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button variant="outline" onClick={() => setSelectedRecord(null)} className="text-sm">
                                    <X className="h-4 w-4 mr-1.5" /> Tutup
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
