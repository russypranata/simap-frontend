"use client";

import React, { useState } from "react";
import { CheckCircle, Clock, AlertCircle, XCircle, BookOpen, Filter, Calendar, RotateCcw, Check, Tag, BookText } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParentSubjectAttendance } from "../hooks/useParentSubjectAttendance";
import type { SubjectType, SubjectStatus } from "../services/parentSubjectAttendanceService";
import {
    ErrorState,
    LoadingOverlay,
    PageHeader,
    ChildSelector,
    FilterButton,
    ActiveFilterBadges,
    PaginationControls,
    StatCard,
} from "@/features/shared/components";

const getSubjectTypeConfig = (type: SubjectType) => {
    const configs = {
        wajib: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", label: "Wajib" },
        peminatan: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", label: "Peminatan" },
    };
    return configs[type];
};

const getStatusConfig = (status: SubjectStatus) => {
    const configs = {
        hadir: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, label: "Hadir" },
        izin: { bg: "bg-blue-100", text: "text-blue-700", icon: Clock, label: "Izin" },
        sakit: { bg: "bg-yellow-100", text: "text-yellow-700", icon: AlertCircle, label: "Sakit" },
        alpa: { bg: "bg-red-100", text: "text-red-700", icon: XCircle, label: "Alpa" },
    };
    return configs[status];
};



// Skeleton Loading Component
const ParentSubjectAttendanceSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>

            {/* Summary Stats Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="px-5 py-4 pl-6 flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                                <Skeleton className="w-11 h-11 rounded-xl" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-2">
                                <Skeleton className="h-3 w-24" />
                                <div className="flex items-baseline gap-2">
                                    <Skeleton className="h-7 w-12" />
                                    <Skeleton className="h-4 w-10" />
                                </div>
                                <Skeleton className="h-3 w-28" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Card Skeleton */}
            <Card className="border-blue-200 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Skeleton className="h-10 w-[180px]" />
                            <Skeleton className="h-10 w-[180px]" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left p-4 w-[180px] whitespace-nowrap align-middle">
                                        <Skeleton className="h-3 w-24" />
                                    </th>
                                    <th className="text-left p-4 w-[200px] align-middle">
                                        <Skeleton className="h-3 w-32" />
                                    </th>
                                    <th className="text-left p-4 w-[180px] align-middle">
                                        <Skeleton className="h-3 w-28" />
                                    </th>
                                    <th className="text-center p-4 w-[110px] align-middle">
                                        <div className="flex justify-center">
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </th>
                                    <th className="text-center p-4 w-[120px] align-middle">
                                        <div className="flex justify-center">
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </th>
                                    <th className="text-left p-4 min-w-[260px] align-middle">
                                        <Skeleton className="h-3 w-40" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 5 }).map((_, rowIndex) => (
                                    <tr key={rowIndex} className="border-b border-slate-100">
                                        <td className="p-3 align-middle">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-9 w-9 rounded-lg" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-16" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 align-middle">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </td>
                                        <td className="p-3 align-middle">
                                            <Skeleton className="h-4 w-24" />
                                        </td>
                                        <td className="p-3 align-middle text-center">
                                            <Skeleton className="h-6 w-16 rounded-lg" />
                                        </td>
                                        <td className="p-3 text-center align-middle">
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </td>
                                        <td className="p-3 align-middle">
                                            <Skeleton className="h-4 w-40" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};



export const ParentSubjectAttendance: React.FC = () => {
    const {
        children,
        selectedChildId,
        setSelectedChildId,
        paginatedRecords,
        subjects,
        academicYears,
        stats,
        selectedStatus, setSelectedStatus,
        selectedSubject, setSelectedSubject,
        selectedAcademicYear, setSelectedAcademicYear,
        selectedSemester, setSelectedSemester,
        currentPage,
        totalPages,
        itemsPerPage,
        setItemsPerPage,
        filteredTotal,
        startIndexDisplay,
        endIndexDisplay,
        goToPage,
        triggerFetchingOverlay,
        isLoading,
        isFetching,
        error,
        refetch
    } = useParentSubjectAttendance();

    // Temporary states for the Filter Modal
    const [tempSubject, setTempSubject] = useState("all");
    const [tempAcademicYear, setTempAcademicYear] = useState<string>("all");
    const [tempSemester, setTempSemester] = useState<string>("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    if (error) {
        return <ErrorState error={error} onRetry={refetch} />;
    }

    if (isLoading) {
        return <ParentSubjectAttendanceSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Presensi"
                titleHighlight="Mata Pelajaran"
                icon={BookOpen}
                description="Rekap kehadiran KBM di kelas"
            >
                <Dialog open={isFilterOpen} onOpenChange={(open) => {
                    if (open) {
                        setTempAcademicYear(selectedAcademicYear);
                        setTempSemester(selectedSemester);
                        setTempSubject(selectedSubject);
                    }
                    setIsFilterOpen(open);
                }}>
                    <DialogTrigger asChild>
                        <FilterButton
                            activeCount={(selectedAcademicYear !== "all" ? 1 : 0) + (selectedSemester !== "all" ? 1 : 0) + (selectedSubject !== "all" ? 1 : 0)}
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
                                        Sesuaikan tahun, semester, dan mata pelajaran
                                    </DialogDescription>
                                </div>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            Tahun Ajaran
                                        </label>
                                        <Select value={tempAcademicYear} onValueChange={setTempAcademicYear}>
                                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                                <SelectValue placeholder="Tahun" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua Tahun</SelectItem>
                                                {academicYears.map(year => (
                                                    <SelectItem key={year} value={year}>TA. {year}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <Filter className="h-4 w-4 text-slate-400" />
                                            Semester
                                        </label>
                                        <Select value={tempSemester} onValueChange={setTempSemester}>
                                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                                <SelectValue placeholder="Semester" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua</SelectItem>
                                                <SelectItem value="1">Ganjil</SelectItem>
                                                <SelectItem value="2">Genap</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-slate-400" />
                                        Mata Pelajaran
                                    </label>
                                    <Select value={tempSubject} onValueChange={setTempSubject}>
                                        <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                            <SelectValue placeholder="Pilih Mapel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                                            {subjects.map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => {
                                        setTempAcademicYear("all");
                                        setTempSemester("all");
                                        setTempSubject("all");
                                    }}
                                    className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Reset Pilihan
                                </Button>
                                <Button 
                                    className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2"
                                    onClick={() => {
                                        setSelectedAcademicYear(tempAcademicYear);
                                        setSelectedSemester(tempSemester);
                                        setSelectedSubject(tempSubject);
                                        setIsFilterOpen(false);
                                        triggerFetchingOverlay();
                                    }}
                                >
                                    <Check className="h-4 w-4" />
                                    Terapkan
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Child Selector */}
                    <ChildSelector childList={children} selectedChildId={selectedChildId} onSelect={setSelectedChildId} />
                </PageHeader>

            {/* Active Global Filters */}
            <ActiveFilterBadges
                badges={[
                    ...(selectedAcademicYear !== "all" ? [{
                        key: "year",
                        label: `TA. ${selectedAcademicYear}`,
                        icon: Calendar,
                        onRemove: () => { setSelectedAcademicYear("all"); triggerFetchingOverlay(); },
                    }] : []),
                    ...(selectedSemester !== "all" ? [{
                        key: "semester",
                        label: `Semester ${selectedSemester === "1" ? "Ganjil" : "Genap"}`,
                        icon: BookOpen,
                        onRemove: () => { setSelectedSemester("all"); triggerFetchingOverlay(); },
                    }] : []),
                    ...(selectedSubject !== "all" ? [{
                        key: "subject",
                        label: selectedSubject,
                        icon: BookText,
                        onRemove: () => { setSelectedSubject("all"); triggerFetchingOverlay(); },
                    }] : []),
                ]}
                onClearAll={() => {
                    setSelectedAcademicYear("all");
                    setSelectedSemester("all");
                    setSelectedSubject("all");
                    triggerFetchingOverlay();
                }}
            />

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Hadir"
                    value={stats.hadir.value}
                    unit={stats.hadir.percentage >= 100 ? undefined : `${stats.hadir.percentage.toFixed(1)}%`}
                    subtitle="Kehadiran sempurna"
                    icon={CheckCircle}
                    color="green"
                />
                <StatCard
                    title="Izin"
                    value={stats.izin.value}
                    unit={stats.izin.percentage >= 100 ? undefined : `${stats.izin.percentage.toFixed(1)}%`}
                    subtitle="Dengan keterangan"
                    icon={Clock}
                    color="blue"
                />
                <StatCard
                    title="Sakit"
                    value={stats.sakit.value}
                    unit={stats.sakit.percentage >= 100 ? undefined : `${stats.sakit.percentage.toFixed(1)}%`}
                    subtitle="Surat sakit"
                    icon={AlertCircle}
                    color="amber"
                />
                <StatCard
                    title="Alpa"
                    value={stats.alpa.value}
                    unit={stats.alpa.percentage >= 100 ? undefined : `${stats.alpa.percentage.toFixed(1)}%`}
                    subtitle="Tanpa keterangan"
                    icon={XCircle}
                    color="red"
                />
            </div>

            {/* Attendance History */}
            <Card className="border-blue-200 shadow-sm relative overflow-hidden">
                {isFetching && <LoadingOverlay />}
                <CardHeader className="pb-1">
                    {/* Row 1: Title & Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                <BookOpen className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Riwayat KBM</CardTitle>
                                <CardDescription className="text-sm text-slate-600">Detail kehadiran per jam pelajaran</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 sm:mt-0">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold h-7 px-3 rounded-full text-[11px]">
                                {filteredTotal} Kehadiran
                            </Badge>

                            {/* Status Select Filter */}
                            <Select value={selectedStatus} onValueChange={(val) => { setSelectedStatus(val); triggerFetchingOverlay(); }}>
                                <SelectTrigger className="w-full sm:w-[170px] h-9 bg-white hover:bg-slate-50 text-slate-700 shadow-sm border-slate-200 transition-colors">
                                    <Filter className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="hadir">Hadir</SelectItem>
                                    <SelectItem value="izin">Izin</SelectItem>
                                    <SelectItem value="sakit">Sakit</SelectItem>
                                    <SelectItem value="alpa">Alpa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[180px] whitespace-nowrap">Hari / Tanggal</th>
                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[200px]">Mata Pelajaran</th>
                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[180px]">Guru</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[110px]">Waktu</th>
                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[120px]">Status</th>
                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle min-w-[260px]">Bab / Topik & Catatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 px-4 text-center">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4 transition-transform hover:scale-110">
                                                    <BookOpen className="h-8 w-8 text-slate-400" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Data</h3>
                                                    <p className="text-sm text-slate-500 max-w-md">
                                                        Belum ada data kehadiran mata pelajaran untuk filter yang dipilih. Silakan coba sesuaikan filter Anda.
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedRecords.map((record) => {
                                        const statusConfig = getStatusConfig(record.status);
                                        const StatusIcon = statusConfig.icon;
                                        const subjectTypeConfig = getSubjectTypeConfig(record.subjectType);
                                        const SubjectTypeIcon = subjectTypeConfig.bg.includes("blue") ? Tag : subjectTypeConfig.bg.includes("yellow") ? BookText : Tag;
                                        
                                        return (
                                            <tr key={record.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 align-top">
                                                    <div className="flex items-start gap-3 mt-1">
                                                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0 border border-blue-100">
                                                            <Calendar className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-slate-800 font-medium leading-tight">
                                                                {record.day}
                                                            </span>
                                                            <span className="text-xs text-slate-500 font-medium mt-0.5">
                                                                {new Date(record.date).toLocaleDateString("id-ID", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className="flex flex-col gap-1.5 mt-1">
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                            <span className="text-sm text-slate-800 font-medium leading-tight">{record.subject}</span>
                                                        </div>
                                                        <div>
                                                            <Badge variant="outline" className={cn(
                                                                "gap-1.5 px-2 py-0.5 text-[10px] font-medium transition-colors cursor-default select-none",
                                                                subjectTypeConfig.bg,
                                                                subjectTypeConfig.text,
                                                                subjectTypeConfig.border
                                                            )}>
                                                                <SubjectTypeIcon className="h-3 w-3" />
                                                                <span>{
                                                                    record.subjectType === "wajib" 
                                                                        ? record.class.replace("Kelas ", "")
                                                                        : `${record.class.replace("Kelas ", "").split(" ")[0]} PEM ${record.class.endsWith("A") ? "IKH" : "AKH"}`
                                                                }</span>
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className="mt-1 flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 flex-shrink-0" />
                                                        <span className="text-sm text-slate-600 leading-tight">{record.teacher}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top text-center">
                                                    <div className="flex flex-col items-center gap-1 mt-1">
                                                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Jam ke-{record.lessonHour}</span>
                                                        <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            <span className="font-mono">{record.time}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top text-center">
                                                    <div className="mt-1">
                                                        <Badge variant="outline" className={cn(
                                                            "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border",
                                                            record.status === "hadir" ? "bg-green-50 text-green-700 border-green-200" :
                                                            record.status === "sakit" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                                            record.status === "izin" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                            "bg-red-50 text-red-700 border-red-200"
                                                        )}>
                                                            <StatusIcon className="h-3.5 w-3.5" />
                                                            {statusConfig.label}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className="flex flex-col gap-2 mt-1">
                                                        {/* Topic */}
                                                        <div className="flex items-start gap-1.5">
                                                            <BookText className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Topik:</span>
                                                                <p className="text-sm text-slate-700">{record.topic || "Topik tidak dicatat"}</p>
                                                            </div>
                                                        </div>
                                                        {/* Notes (if exists) */}
                                                        {record.notes && (
                                                            <div className="flex items-start gap-1.5 pt-1.5 border-t border-slate-100">
                                                                <AlertCircle className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                                <div>
                                                                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Catatan:</span>
                                                                    <p className="text-sm text-blue-700">{record.notes}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Footer with Pagination */}
                    {filteredTotal > 0 && (
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredTotal}
                            startIndex={startIndexDisplay}
                            endIndex={endIndexDisplay}
                            itemsPerPage={itemsPerPage}
                            onPageChange={goToPage}
                            onItemsPerPageChange={(val) => {
                                setItemsPerPage(val);
                                goToPage(1);
                            }}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
