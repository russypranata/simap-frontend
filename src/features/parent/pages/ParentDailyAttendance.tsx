"use client";

import React, { useState, useMemo } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    CalendarCheck,
    FileText,
    Thermometer,
    HandHeart,
    X,
    Info,
    RefreshCw,
    RotateCcw,
    Check,
    CalendarOff,
    Filter,
    BookOpen,
    CircleDashed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useParentDailyAttendance } from "../hooks/useParentDailyAttendance";
import type { AttendanceStatus, DailyAttendanceRecord } from "../services/dailyAttendanceService";
import {
    ErrorState,
    LoadingOverlay,
    PageHeader,
    ChildSelector,
    FilterButton,
    ActiveFilterBadges,
} from "@/features/shared/components";

// Types
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

const ParentDailyAttendanceSkeleton = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-48" />
            </div>

            <Card className="border-blue-200">
                <CardHeader className="pb-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-40" />
                    </div>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                    <div className="mb-6 flex flex-wrap justify-center gap-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 w-32 rounded-xl" />
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};



// Empty State Component
const EmptyState = ({ monthLabel, onRetry }: { monthLabel: string; onRetry: () => void }) => (
    <Card className="border-slate-200 shadow-sm border-dashed bg-slate-50/30">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-white border border-dashed border-slate-200 flex items-center justify-center mb-4 transition-transform hover:scale-110 shadow-sm">
                <CalendarOff className="h-8 w-8 text-slate-400" />
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Data Presensi</h3>
                <p className="text-sm text-slate-500 max-w-md mb-6">
                    Belum ada data presensi untuk bulan {monthLabel}. Silakan coba bulan lainnya atau muat ulang.
                </p>
                <Button onClick={onRetry} variant="outline" className="gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm rounded-xl px-6 h-10 transition-all active:scale-95">
                    <RefreshCw className="h-4 w-4" />
                    Muat Ulang Data
                </Button>
            </div>
        </CardContent>
    </Card>
);

export const ParentDailyAttendance: React.FC = () => {
    const [selectedRecord, setSelectedRecord] = useState<SelectedRecord | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("semua");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempYearId, setTempYearId] = useState<string>("");
    const [tempSemesterId, setTempSemesterId] = useState<string>("");

    const {
        records,
        stats,
        children,
        academicYears,
        selectedChildId,
        selectedYearId,
        selectedSemesterId,
        childName,
        childClass,
        currentDate,
        isLoading,
        isFetching,
        error,
        setSelectedChildId,
        setSelectedYearId,
        setSelectedSemesterId,
        prevMonth,
        nextMonth,
        canGoPrev,
        canGoNext,
        refetch,
    } = useParentDailyAttendance();

    const handleRecordClick = (day: number, record: DailyAttendanceRecord) => {
        if (record.status === "sakit" || record.status === "izin") {
            setSelectedRecord({
                date: record.date,
                day,
                status: record.status,
                notes: record.notes,
                submittedBy: record.submittedBy,
                submittedAt: record.submittedAt,
            });
        }
    };

    const getStatusDetailConfig = (status: "sakit" | "izin") => {
        const configs = {
            sakit: {
                icon: Thermometer,
                title: "Detail Ketidakhadiran karena Sakit",
                color: "text-yellow-700",
                bgColor: "bg-yellow-100",
                borderColor: "border-yellow-300",
            },
            izin: {
                icon: HandHeart,
                title: "Detail Izin",
                color: "text-blue-700",
                bgColor: "bg-blue-100",
                borderColor: "border-blue-300",
            },
        } as const;
        return configs[status];
    };

    // Calendar render helpers
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const startOffset = firstDayOfMonth;

    const monthLabel = currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

    // Check if a cell should be dimmed based on filter
    const isCellDimmed = (status: AttendanceStatus): boolean => {
        if (filterStatus === "semua") return false;
        return status !== filterStatus;
    };



    // Filtered records count for filter badge
    const filteredCount = useMemo(() => {
        if (filterStatus === "semua") return records.length;
        return records.filter(r => r.status === filterStatus).length;
    }, [records, filterStatus]);

    if (isLoading) return <ParentDailyAttendanceSkeleton />;
    if (error) return <ErrorState error={error} onRetry={refetch} />;

    return (
        <div className="space-y-6">
                {/* Header */}
                <PageHeader
                    title="Presensi"
                    titleHighlight="Harian"
                    icon={CalendarCheck}
                    description="Status kehadiran resmi harian dari Wali Kelas"
                >
                    <Dialog open={isFilterOpen} onOpenChange={(open) => {
                        if (open) {
                            setTempYearId(selectedYearId);
                            setTempSemesterId(selectedSemesterId);
                        }
                        setIsFilterOpen(open);
                    }}>
                        <DialogTrigger asChild>
                            <FilterButton
                                activeCount={(selectedYearId !== academicYears[0]?.id ? 1 : 0) + (selectedSemesterId !== academicYears[0]?.semesters[0]?.id ? 1 : 0)}
                            />
                        </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                                <DialogHeader className="flex-row items-center gap-4">
                                    <div className="p-2.5 bg-blue-100 rounded-xl">
                                        <Filter className="h-5 w-5 text-blue-700" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-lg font-semibold text-slate-900">Filter Presensi</DialogTitle>
                                        <DialogDescription className="text-slate-500">
                                            Sesuaikan tahun ajaran dan semester
                                        </DialogDescription>
                                    </div>
                                </DialogHeader>
                                
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-slate-400" />
                                                Tahun Ajaran
                                            </label>
                                            <Select value={tempYearId} onValueChange={setTempYearId}>
                                                <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                                    <SelectValue placeholder="Tahun" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {academicYears.map(year => (
                                                        <SelectItem key={year.id} value={year.id}>
                                                            TA {year.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-slate-400" />
                                                Semester
                                            </label>
                                            <Select value={tempSemesterId} onValueChange={setTempSemesterId}>
                                                <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                                    <SelectValue placeholder="Semester" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {academicYears.find(y => y.id === tempYearId)?.semesters.map(sem => (
                                                        <SelectItem key={sem.id} value={sem.id}>
                                                            Semester {sem.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => {
                                            setTempYearId(academicYears[0]?.id);
                                            setTempSemesterId(academicYears[0]?.semesters[0]?.id);
                                        }}
                                        className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Reset Pilihan
                                    </Button>
                                    <Button 
                                        className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2"
                                        onClick={() => {
                                            setSelectedYearId(tempYearId);
                                            setSelectedSemesterId(tempSemesterId);
                                            setIsFilterOpen(false);
                                        }}
                                    >
                                        <Check className="h-4 w-4" />
                                        Terapkan
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Child Selector */}
                        <ChildSelector children={children} selectedChildId={selectedChildId} onSelect={setSelectedChildId} />
                    </PageHeader>

                {/* Active Global Filters */}
                <ActiveFilterBadges
                    badges={[
                        ...(selectedYearId !== academicYears[0]?.id ? [{
                            key: "year",
                            label: `TA ${academicYears.find(y => y.id === selectedYearId)?.name || selectedYearId}`,
                            icon: CalendarIcon,
                            onRemove: () => setSelectedYearId(academicYears[0]?.id),
                        }] : []),
                        ...(selectedSemesterId !== academicYears[0]?.semesters[0]?.id ? [{
                            key: "semester",
                            label: `Semester ${academicYears.find(y => y.id === selectedYearId)?.semesters.find(s => s.id === selectedSemesterId)?.name || "-"}`,
                            icon: BookOpen,
                            onRemove: () => setSelectedSemesterId(academicYears[0]?.semesters[0]?.id),
                        }] : []),
                    ]}
                    onClearAll={() => {
                        setSelectedYearId(academicYears[0]?.id);
                        setSelectedSemesterId(academicYears[0]?.semesters[0]?.id);
                    }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Calendar Card */}
                    <Card className="lg:col-span-3 border-blue-200 shadow-sm relative">
                        {isFetching && <LoadingOverlay />}

                        <CardHeader className="pb-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                {/* Left: Icon + Title + Description + Percentage */}
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-100 rounded-xl">
                                        <CalendarIcon className="h-5 w-5 text-blue-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-800">
                                            Kalender Kehadiran
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            <CardDescription className="text-sm text-slate-600">
                                                {childName ? `${childName} — Kelas ${childClass}` : "Lihat kehadiran anak Anda"}
                                            </CardDescription>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold border border-green-200">
                                                {stats.percentage}% Hadir Bulan Ini
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Right: Status Filter + Month Slider */}
                                <div className="flex items-center gap-2 mt-0.5 sm:mt-0">
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-full sm:w-[170px] h-9 bg-white hover:bg-slate-50 text-slate-700 shadow-sm border-slate-200 transition-colors">
                                            <Filter className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                                            <SelectValue placeholder="Semua Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="semua">Semua Status</SelectItem>
                                            <SelectItem value="hadir">Hadir</SelectItem>
                                            <SelectItem value="sakit">Sakit</SelectItem>
                                            <SelectItem value="izin">Izin</SelectItem>
                                            <SelectItem value="alpa">Alpa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-1.5 bg-white rounded-lg border shadow-sm px-2 py-1.5">
                                        <button
                                            onClick={prevMonth}
                                            disabled={!canGoPrev}
                                            className={cn(
                                                "h-7 w-7 p-0 rounded-lg font-medium text-sm transition-colors flex items-center justify-center",
                                                canGoPrev
                                                    ? "bg-blue-800 text-white hover:bg-blue-900"
                                                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                            )}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <span className="text-sm font-semibold min-w-[120px] text-center text-slate-900 tracking-tight flex-1 md:flex-none">
                                            {monthLabel}
                                        </span>
                                        <button
                                            onClick={nextMonth}
                                            disabled={!canGoNext}
                                            className={cn(
                                                "h-7 w-7 p-0 rounded-lg font-medium text-sm transition-colors flex items-center justify-center",
                                                canGoNext
                                                    ? "bg-blue-800 text-white hover:bg-blue-900"
                                                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                            )}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-2">
                            {/* Summary / Legend Section */}
                            <div className="mb-8">
                                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                                      {(["hadir", "sakit", "izin", "alpa", "belum_dicatat"] as const).map(status => {
                                          const config = getStatusConfig(status);
                                          const count = records.filter(r => r.status === status).length;
                                          return (
                                              <div
                                                  key={status}
                                                  className={cn(
                                                      "flex items-center gap-3 p-3 lg:px-5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/80 transition-all flex-1 min-w-[140px] md:flex-initial cursor-pointer",
                                                      filterStatus === status && "ring-2 ring-primary/30 border-primary/20 bg-primary/5"
                                                  )}
                                                  onClick={() => setFilterStatus(filterStatus === status ? "semua" : status)}
                                              >
                                                  <div className={cn("p-2 rounded-lg shrink-0", config.bg, config.text)}>
                                                      <config.icon className="h-4 w-4" />
                                                  </div>
                                                  <div className="flex flex-col min-w-0">
                                                      <span className="text-sm font-semibold text-slate-700 truncate">{config.label}</span>
                                                      <span className="text-xs font-medium text-slate-500">{count} Hari</span>
                                                  </div>
                                              </div>
                                          )
                                      })}
                                </div>
                            </div>

                            {records.length === 0 ? (
                                <EmptyState monthLabel={monthLabel} onRetry={refetch} />
                            ) : (
                                <>
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
                                            const status = record?.status || "belum_dicatat"; // Default to belum_dicatat if no record exists
                                            const config = getStatusConfig(status);
                                            const dimmed = isCellDimmed(status);
                                            
                                            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                                            return (
                                                <div
                                                    key={day}
                                                    className={cn(
                                                        "min-h-[85px] rounded-lg border p-2 flex flex-col justify-between transition-all cursor-default group relative overflow-hidden",
                                                        config.bg,
                                                        config.text,
                                                        config.hover,
                                                        status === "libur" ? "border-red-200" : "",
                                                        isToday ? "ring-2 ring-primary ring-offset-1 z-20 shadow-md" : "border-slate-100",
                                                        (status === "sakit" || status === "izin") && record?.notes ? "cursor-pointer hover:shadow-md" : "",
                                                        dimmed && "opacity-25 scale-[0.97]"
                                                    )}
                                                    onClick={() => record && (status === "sakit" || status === "izin") && handleRecordClick(day, record)}
                                                >
                                                    {isToday && (
                                                        <div className="absolute top-0 right-0 p-1">
                                                            <span className="relative flex h-2 w-2">
                                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* Background date watermark */}
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.08]">
                                                        <span className="text-[48px] font-bold select-none leading-none">{day}</span>
                                                    </div>
                                                    
                                                    {/* Top row: Date (L) and Icon (R) */}
                                                    <div className="flex justify-between items-start relative z-10">
                                                        <span className={cn(
                                                            "text-xs font-bold transition-colors",
                                                            status === "libur" ? "text-red-400" : "text-slate-600 group-hover:text-slate-900"
                                                        )}>{day}</span>
                                                        
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="p-0.5 rounded-md hover:bg-white/40 transition-colors cursor-help">
                                                                        <config.icon className={cn("h-3.5 w-3.5", config.text, "opacity-70")} />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent showArrow={false} className="p-0 border border-slate-200 shadow-xl rounded-xl overflow-hidden bg-white min-w-[150px]">
                                                                    <div className="flex flex-col text-center sm:text-left">
                                                                        {/* Header */}
                                                                        <div className={cn("px-3 py-1.5 border-b flex items-center justify-center", 
                                                                            status === "hadir" ? "bg-green-50/50 border-green-100" : 
                                                                            status === "sakit" ? "bg-yellow-50/50 border-yellow-100" : 
                                                                            status === "izin" ? "bg-blue-50/50 border-blue-100" : 
                                                                            status === "belum_dicatat" ? "bg-slate-50/50 border-slate-100" :
                                                                            "bg-red-50/50 border-red-100")}>
                                                                            <span className={cn("text-[10px] font-bold uppercase tracking-wider", 
                                                                                status === "hadir" ? "text-green-700" : 
                                                                                status === "sakit" ? "text-yellow-700" : 
                                                                                status === "izin" ? "text-blue-700" : 
                                                                                status === "belum_dicatat" ? "text-slate-500" :
                                                                                "text-red-700")}>
                                                                                {config.label}
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        {/* Body */}
                                                                        <div className="px-3 py-2.5">
                                                                            {status === "libur" ? (
                                                                                <p className="text-[11px] text-slate-600">{record?.notes || "Hari Libur"}</p>
                                                                            ) : status === "belum_dicatat" ? (
                                                                                <p className="text-[11px] text-slate-400 italic">Wali Kelas belum mencatat presensi</p>
                                                                            ) : status === "alpa" ? (
                                                                                <p className="text-[11px] text-slate-600 italic">Tanpa Keterangan</p>
                                                                            ) : status === "hadir" ? (
                                                                                <p className="text-[11px] text-slate-600 italic">Tercatat oleh Wali Kelas</p>
                                                                            ) : (
                                                                                <>
                                                                                    <p className="text-[11px] text-slate-600 italic">Tercatat oleh Wali Kelas</p>
                                                                                    <p className="text-[10px] text-primary/80 font-medium flex items-center justify-center sm:justify-start gap-1.5 mt-2">
                                                                                        <Info className="h-3 w-3" />
                                                                                        Klik untuk detail
                                                                                    </p>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                    
                                                    {/* Bottom row: Status Label */}
                                                    <div className="flex items-end justify-center relative z-10 mt-auto pt-1">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[9px] h-4.5 px-1.5 font-bold border-0 uppercase tracking-tighter whitespace-nowrap opacity-90",
                                                                status === "hadir" ? "bg-green-100/60 text-green-700" : 
                                                                status === "sakit" ? "bg-yellow-100/60 text-yellow-700" : 
                                                                status === "izin" ? "bg-blue-100/60 text-blue-700" :
                                                                status === "belum_dicatat" ? "bg-slate-100/60 text-slate-400" : 
                                                                status === "alpa" ? "bg-red-100/60 text-red-700" : 
                                                                "bg-transparent text-red-400"
                                                            )}
                                                        >
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
                </div>

                {/* Detail Dialog for Sakit/Izin */}
                <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            {selectedRecord && (
                                <>
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                                        getStatusDetailConfig(selectedRecord.status).bgColor,
                                        getStatusDetailConfig(selectedRecord.status).color
                                    )}>
                                        {React.createElement(getStatusDetailConfig(selectedRecord.status).icon, { className: "h-6 w-6" })}
                                    </div>
                                    <DialogTitle className={cn(
                                        "text-lg font-semibold",
                                        getStatusDetailConfig(selectedRecord.status).color
                                    )}>
                                        {getStatusDetailConfig(selectedRecord.status).title}
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-slate-500">
                                        Informasi detail ketidakhadiran siswa
                                    </DialogDescription>
                                </>
                            )}
                        </DialogHeader>
                        {selectedRecord && (
                            <div className="space-y-4 mt-2">
                                <div className={cn(
                                    "rounded-lg border p-4",
                                    getStatusDetailConfig(selectedRecord.status).borderColor,
                                    getStatusDetailConfig(selectedRecord.status).bgColor
                                )}>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                                {new Date(selectedRecord.date).toLocaleDateString("id-ID", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</p>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "mt-1.5 text-xs font-semibold",
                                                    selectedRecord.status === "sakit" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-blue-100 text-blue-700 border-blue-300"
                                                )}
                                            >
                                                {selectedRecord.status === "sakit" ? "Sakit" : "Izin"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Keterangan</p>
                                    <div className="flex items-start gap-3">
                                        {selectedRecord.status === "sakit" ? (
                                            <Thermometer className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                                        ) : (
                                            <FileText className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                        )}
                                        <p className="text-sm text-slate-700 font-medium">
                                            {selectedRecord.notes || "Tidak ada keterangan"}
                                        </p>
                                    </div>
                                </div>

                                {(selectedRecord.submittedBy || selectedRecord.submittedAt) && (
                                    <div className="rounded-lg border border-slate-200 p-3 bg-white">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Informasi Pengajuan</p>
                                        <div className="space-y-1.5 text-xs text-slate-600">
                                            {selectedRecord.submittedBy && (
                                                <p><span className="font-medium">Diajukan oleh:</span> {selectedRecord.submittedBy}</p>
                                            )}
                                            {selectedRecord.submittedAt && (
                                                <p><span className="font-medium">Tanggal pengajuan:</span> {new Date(selectedRecord.submittedAt).toLocaleString("id-ID")}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedRecord(null)}
                                        className="text-sm"
                                    >
                                        <X className="h-4 w-4 mr-1.5" />
                                        Tutup
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
    );
};
