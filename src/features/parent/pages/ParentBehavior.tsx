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
import { Skeleton } from "@/components/ui/skeleton";
import {
    Calendar,
    AlertTriangle,
    Clock,
    MapPin,
    User,
    FileText,
    ClipboardList,
    Building,
    Home,
    AlertCircle,
    CheckCircle,
    Users,
    Loader2,
    RefreshCw,
    RotateCcw,
    Check,
    ChevronLeft,
    ChevronRight,
    Filter,
    SlidersHorizontal,
    X
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useParentBehavior } from "../hooks/useParentBehavior";

// Skeleton Loading Component
const ParentBehaviorSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-72" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-56" />
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="px-5 py-4 pl-6 flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                                <Skeleton className="w-11 h-11 rounded-xl" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-2">
                                <Skeleton className="h-3 w-24" />
                                <div className="flex items-baseline gap-2">
                                    <Skeleton className="h-7 w-12" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-3 w-28" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* List Skeleton */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-56" />
                            </div>
                        </div>
                        <Skeleton className="h-9 w-[130px]" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-full max-w-md" />
                                <Skeleton className="h-16 w-full rounded-lg" />
                                <Skeleton className="h-4 w-48 mt-2" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Error State Component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Catatan </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Perilaku Anak</span>
                    </h1>
                    <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <ClipboardList className="h-5 w-5" />
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

export const ParentBehavior: React.FC = () => {
    const {
        children,
        selectedChildId,
        setSelectedChildId,
        filteredRecords,
        stats,
        academicYears,
        selectedAcademicYear,
        handleAcademicYearChange,
        locationFilter,
        handleLocationChange,
        isLoading,
        isFetching,
        error,
        refetch,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        showPagination,
        allFilteredCount,
    } = useParentBehavior();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempAcademicYear, setTempAcademicYear] = useState<string>("all");

    const startIndexDisplay = (currentPage - 1) * itemsPerPage + 1;
    const endIndexDisplay = Math.min(currentPage * itemsPerPage, allFilteredCount);

    if (error) {
        return <ErrorState error={error} onRetry={refetch} />;
    }

    if (isLoading) {
        return <ParentBehaviorSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Catatan </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Perilaku Anak</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Catatan perilaku dan pelanggaran anak selama di sekolah dan asrama
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 no-print w-full lg:w-auto mt-4 lg:mt-0 flex-wrap lg:flex-nowrap justify-end">
                    {/* Filter Modal */}
                    <Dialog open={isFilterOpen} onOpenChange={(open) => {
                        if (open) {
                            setTempAcademicYear(selectedAcademicYear);
                        }
                        setIsFilterOpen(open);
                    }}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-9 gap-2 bg-white text-slate-700 border-slate-200 shadow-sm font-medium">
                                <Filter className="h-4 w-4 text-slate-500" />
                                <span className="hidden sm:inline">Filter</span>
                                {selectedAcademicYear !== "all" && (
                                    <Badge className="ml-0.5 h-5 w-5 min-w-[20px] px-0 bg-blue-800 text-white text-[10px] flex items-center justify-center border-0 rounded-full">
                                        1
                                    </Badge>
                                )}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-2xl">
                            <DialogHeader className="flex-row items-center gap-4">
                                <div className="p-2.5 bg-blue-100 rounded-xl">
                                    <Filter className="h-5 w-5 text-blue-700" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-semibold text-slate-900">Filter Perilaku</DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        Sesuaikan tahun ajaran catatan perilaku
                                    </DialogDescription>
                                </div>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        Tahun Ajaran
                                    </label>
                                    <Select value={tempAcademicYear} onValueChange={setTempAcademicYear}>
                                        <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                            <SelectValue placeholder="Pilih Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Tahun</SelectItem>
                                            {academicYears.map(year => (
                                                <SelectItem key={year} value={year}>TA. {year}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setTempAcademicYear("all")}
                                    className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Reset Pilihan
                                </Button>
                                <Button 
                                    className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2"
                                    onClick={() => {
                                        handleAcademicYearChange(tempAcademicYear);
                                        setIsFilterOpen(false);
                                    }}
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Terapkan
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Child Selector */}
                    {children.length > 1 && (
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
                    )}
                </div>
            </div>

            {/* Active Global Filters */}
            {selectedAcademicYear !== "all" && (
                <div className="flex flex-wrap items-center gap-2 px-1 no-print">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                        <SlidersHorizontal className="h-3 w-3" />
                        <span>Filter Aktif:</span>
                    </div>
                    
                    <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        TA. {selectedAcademicYear}
                        <button
                            onClick={() => handleAcademicYearChange("all")}
                            className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </Badge>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5 ml-1"
                        onClick={() => handleAcademicYearChange("all")}
                    >
                        <RotateCcw className="h-3 w-3" />
                        Hapus Semua
                    </Button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Pelanggaran */}
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="px-5 py-4 pl-6 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 rounded-xl bg-red-100/80 flex items-center justify-center ring-2 ring-red-200/50 transition-transform duration-300 group-hover:scale-105">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Total Pelanggaran</p>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">{stats.totalViolations}</p>
                                <p className="text-xs text-muted-foreground font-medium">catatan</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Sepanjang waktu</p>
                        </div>
                    </div>
                </div>

                {/* Di Sekolah */}
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="px-5 py-4 pl-6 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 rounded-xl bg-blue-100/80 flex items-center justify-center ring-2 ring-blue-200/50 transition-transform duration-300 group-hover:scale-105">
                                <Building className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Di Sekolah</p>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">{stats.schoolViolations}</p>
                                <p className="text-xs text-muted-foreground font-medium">catatan</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Pelanggaran di sekolah</p>
                        </div>
                    </div>
                </div>

                {/* Di Asrama */}
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="px-5 py-4 pl-6 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center ring-2 ring-amber-200/50 transition-transform duration-300 group-hover:scale-105">
                                <Home className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Di Asrama</p>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">{stats.dormViolations}</p>
                                <p className="text-xs text-muted-foreground font-medium">catatan</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Pelanggaran di asrama</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Record List */}
            <Card className="relative">
                {/* Fetching overlay */}
                {isFetching && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-30 flex items-center justify-center rounded-xl">
                        <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-lg rounded-xl px-5 py-3">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <span className="text-sm font-medium text-slate-600">Memuat data...</span>
                        </div>
                    </div>
                )}
                <CardHeader className="pb-1">
                    {/* Row 1: Title & Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-red-100 rounded-xl">
                                <AlertTriangle className="h-5 w-5 text-red-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Pelanggaran</CardTitle>
                                <CardDescription className="text-sm text-slate-600">Catatan pelanggaran yang pernah dilakukan anak</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 sm:mt-0">
                            <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold h-7 px-3 rounded-full text-[11px]">
                                {allFilteredCount || 0} Pelanggaran
                            </Badge>

                            {/* Location Filter */}
                            <Select value={locationFilter} onValueChange={handleLocationChange}>
                                <SelectTrigger className="w-full sm:w-[190px] h-9 bg-white hover:bg-slate-50 text-slate-700 shadow-sm border-slate-200 transition-colors">
                                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                                    <SelectValue placeholder="Semua Lokasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Lokasi</SelectItem>
                                    <SelectItem value="sekolah">Sekolah</SelectItem>
                                    <SelectItem value="asrama">Asrama</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                </CardHeader>

                <CardContent>
                    {filteredRecords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                            <div className="w-16 h-16 rounded-full bg-green-50 border border-dashed border-green-200 flex items-center justify-center mb-4 transition-transform hover:scale-110">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Pelanggaran</h3>
                                <p className="text-sm text-slate-500 max-w-md">
                                    Luar biasa! Tidak ada catatan pelanggaran untuk periode ini. Pertahankan perilaku baik siswa.
                                </p>
                                <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 inline-block px-3 py-1 rounded-full border border-green-100 animate-pulse">
                                    Anak Anda berkelakuan baik 👏
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className={cn(
                                        "group relative rounded-xl border bg-card overflow-hidden shadow-sm",
                                        record.location === "sekolah"
                                            ? "border-blue-200/60"
                                            : "border-amber-200/60"
                                    )}
                                >
                                    <div className="px-4 py-4 space-y-3">
                                        {/* Header Row: Badge + Date/Time */}
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs font-semibold rounded-full px-2.5 py-0.5",
                                                        record.location === "sekolah"
                                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                                    )}
                                                >
                                                    {record.location === "sekolah" ? (
                                                        <><Building className="h-3 w-3 mr-1" /> Sekolah</>
                                                    ) : (
                                                        <><Home className="h-3 w-3 mr-1" /> Asrama</>
                                                    )}
                                                </Badge>
                                                {selectedAcademicYear === "all" && (
                                                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                        TA. {record.academicYearId}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {new Date(record.date).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {record.time}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Problem Title */}
                                        <h4 className="font-semibold text-[15px] text-foreground leading-snug">
                                            {record.problem}
                                        </h4>

                                        {/* Follow Up - Styled Box */}
                                        <div className={cn(
                                            "rounded-lg px-3.5 py-2.5",
                                            record.location === "sekolah"
                                                ? "bg-blue-50/60"
                                                : "bg-amber-50/60"
                                        )}>
                                            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                                                Tindak Lanjut
                                            </span>
                                            <p className="text-sm text-foreground/80 leading-relaxed">
                                                {record.followUp}
                                            </p>
                                        </div>

                                        {/* Reporter - Clean Footer */}
                                        <div className="flex items-center gap-2 pt-1">
                                            <div className={cn(
                                                "flex items-center justify-center w-6 h-6 rounded-full",
                                                record.location === "sekolah"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-amber-100 text-amber-700"
                                            )}>
                                                <User className="h-3 w-3" />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                Dilaporkan oleh{" "}
                                                <span className="font-semibold text-foreground">
                                                    {record.reporterGender === "L" ? "Pak" : "Bu"} {record.reporterName}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer with Pagination */}
                    {showPagination && (
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 mt-6 pt-4 border-t border-slate-100">
                            {/* Left: Pagination Info */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground w-full lg:w-auto justify-center lg:justify-start">
                                <span>Menampilkan</span>
                                <span className="font-medium text-foreground">
                                    {startIndexDisplay}
                                </span>
                                <span>-</span>
                                <span className="font-medium text-foreground">
                                    {endIndexDisplay}
                                </span>
                                <span>dari</span>
                                <span className="font-medium text-foreground">{allFilteredCount}</span>
                                <span>entri</span>
                            </div>

                            {/* Right: Pagination Controls */}
                            <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
                                {/* Items per page */}
                                <Select value={itemsPerPage.toString()} onValueChange={(val) => {
                                    setItemsPerPage(Number(val));
                                    setCurrentPage(1);
                                }}>
                                    <SelectTrigger className="w-[100px] h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 / hal</SelectItem>
                                        <SelectItem value="10">10 / hal</SelectItem>
                                        <SelectItem value="20">20 / hal</SelectItem>
                                        <SelectItem value="50">50 / hal</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Page info */}
                                <span className="text-sm text-muted-foreground">
                                    Hal {currentPage}/{totalPages}
                                </span>

                                {/* Previous button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                {/* Page number buttons */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNumber = i + 1;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className={cn(
                                                    "w-8 h-8 p-0 rounded-lg font-medium text-sm transition-colors flex items-center justify-center",
                                                    currentPage === pageNumber
                                                        ? "bg-blue-800 text-white"
                                                        : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
                                                )}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                    {totalPages > 5 && (
                                        <>
                                            <span className="text-sm text-muted-foreground px-1">...</span>
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className={cn(
                                                    "w-8 h-8 p-0 rounded-lg font-medium text-sm transition-colors flex items-center justify-center border border-slate-300 bg-white text-slate-600 hover:bg-slate-100",
                                                    currentPage === totalPages && "bg-blue-800 text-white"
                                                )}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Next button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8 p-0 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-800" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900">Informasi</h3>
                            <p className="text-sm text-blue-800 mt-1">
                                Catatan pelanggaran ini dilaporkan oleh guru/pembina yang melihat kejadian.
                                Jika memiliki pertanyaan atau sanggahan, silakan hubungi wali kelas atau bagian kesiswaan.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
