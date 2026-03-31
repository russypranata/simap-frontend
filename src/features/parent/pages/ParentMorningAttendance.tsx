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
    Timer,
    AlertCircle,
    FileText,
    Eye,
    Users,
    RefreshCw,
    AlertTriangle,
    Loader2,
    Filter,
    RotateCcw,
    Check,
    ChevronLeft,
    ChevronRight,
    X,
    MapPin,
    UserCheck,
    SlidersHorizontal,
    BookOpen,
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useParentMorningAttendance } from "../hooks/useParentMorningAttendance";
import type { LateRecord } from "../services/parentMorningAttendanceService";

const ParentMorningAttendanceSkeleton = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-10 w-full sm:w-[220px]" />
                    <Skeleton className="h-10 w-full sm:w-[170px]" />
                    <Skeleton className="h-10 w-full sm:w-[160px]" />
                </div>
            </div>

            <Card className="border-blue-200">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-32 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-4 space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Keterlambatan </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Pagi</span>
                    </h1>
                    <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <Timer className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </div>
        <Card className="border-red-200 shadow-sm">
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

export const ParentMorningAttendance: React.FC = () => {
    const {
        records,
        children,
        academicYears,
        selectedChildId,
        selectedYearId,
        selectedSemesterId,
        isLoading,
        isFetching,
        error,
        setSelectedChildId,
        setSelectedYearId,
        setSelectedSemesterId,
        refetch,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        showPagination,
        totalRecords,
    } = useParentMorningAttendance();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempYearId, setTempYearId] = useState<string>("all");
    const [tempSemesterId, setTempSemesterId] = useState<string>("all");

    const startIndexDisplay = (currentPage - 1) * itemsPerPage + 1;
    const endIndexDisplay = Math.min(currentPage * itemsPerPage, totalRecords);

    // Helper to get formatted date
    const getFormattedDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    // Helper to remove "Pak"/"Bu" prefix from name
    const getCleanName = (name: string) => {
        if (!name) return "-";
        return name.replace(/^(Pak|Bu)\s+/i, "").trim();
    };

    if (isLoading) return <ParentMorningAttendanceSkeleton />;
    if (error) return <ErrorState error={error} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Keterlambatan </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Pagi</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Timer className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Rekap informasi keterlambatan kedatangan siswa di sekolah
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 no-print w-full lg:w-auto mt-4 lg:mt-0 flex-wrap lg:flex-nowrap justify-end">
                    <Dialog open={isFilterOpen} onOpenChange={(open) => {
                        if (open) {
                            setTempYearId(selectedYearId);
                            setTempSemesterId(selectedSemesterId);
                        }
                        setIsFilterOpen(open);
                    }}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-9 gap-2 bg-white text-slate-700 border-slate-200 shadow-sm font-medium">
                                <Filter className="h-4 w-4 text-slate-500" />
                                <span className="hidden sm:inline">Filter</span>
                                {(selectedYearId !== "all" || selectedSemesterId !== "all") && (
                                    <Badge className="ml-0.5 h-5 w-5 min-w-[20px] px-0 bg-blue-800 text-white text-[10px] flex items-center justify-center border-0 rounded-full">
                                        {(selectedYearId !== "all" ? 1 : 0) + (selectedSemesterId !== "all" ? 1 : 0)}
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
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            Tahun Ajaran
                                        </label>
                                        <Select value={tempYearId} onValueChange={setTempYearId}>
                                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                                <SelectValue placeholder="Tahun" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua Tahun</SelectItem>
                                                {academicYears.map(year => (
                                                    <SelectItem key={year.id} value={year.id}>TA. {year.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <Filter className="h-4 w-4 text-slate-400" />
                                            Semester
                                        </label>
                                        <Select value={tempSemesterId} onValueChange={setTempSemesterId}>
                                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                                <SelectValue placeholder="Semester" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua Smt</SelectItem>
                                                {tempYearId !== "all" 
                                                    ? academicYears.find(y => y.id === tempYearId)?.semesters.map(sem => (
                                                        <SelectItem key={sem.id} value={sem.id}>
                                                            Semester {sem.name}
                                                        </SelectItem>
                                                    ))
                                                    : [1, 2].map(sem => (
                                                        <SelectItem key={String(sem)} value={String(sem)}>
                                                            Semester {sem === 1 ? "Ganjil" : "Genap"}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => {
                                        setTempYearId("all");
                                        setTempSemesterId("all");
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
            {(selectedYearId !== "all" || selectedSemesterId !== "all") && (
                <div className="flex flex-wrap items-center gap-2 px-1 no-print">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                        <SlidersHorizontal className="h-3 w-3" />
                        <span>Filter Aktif:</span>
                    </div>
                    
                    {selectedYearId !== "all" && (
                        <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            TA. {academicYears.find(y => y.id === selectedYearId)?.name || selectedYearId}
                            <button
                                onClick={() => setSelectedYearId("all")}
                                className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}

                    {selectedSemesterId !== "all" && (
                        <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                            <BookOpen className="h-3.5 w-3.5" />
                            Semester {
                                selectedYearId !== "all"
                                    ? academicYears.find(y => y.id === selectedYearId)?.semesters.find(s => s.id === selectedSemesterId)?.name
                                    : selectedSemesterId === "1" ? "Ganjil" : "Genap"
                            }
                            <button
                                onClick={() => setSelectedSemesterId("all")}
                                className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </Badge>
                    )}

                    {/* Show "Hapus Semua" only if more than 1 filter is active */}
                    {(selectedYearId !== "all" ? 1 : 0) + (selectedSemesterId !== "all" ? 1 : 0) > 1 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5 ml-1"
                            onClick={() => {
                                setSelectedYearId("all");
                                setSelectedSemesterId("all");
                            }}
                        >
                            <RotateCcw className="h-3 w-3" />
                            Hapus Semua
                        </Button>
                    )}
                </div>
            )}

            {/* Late Records Table */}
            <Card className="overflow-hidden border-blue-200 relative shadow-sm">
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
                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                <Clock className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Keterlambatan</CardTitle>
                                <CardDescription className="text-sm text-slate-600">
                                    Daftar catatan keterlambatan siswa dari gerbang
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 sm:mt-0">
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-semibold h-7 px-3 rounded-full text-[11px]">
                                {totalRecords} Keterlambatan
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {records.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                            <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4 transition-transform hover:scale-110">
                                <Clock className="h-8 w-8 text-slate-400" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Catatan Keterlambatan</h3>
                                <p className="text-sm text-slate-500 max-w-md">
                                    Siswa ini tidak memiliki catatan keterlambatan di rentang waktu yang dipilih.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[180px]">Hari / Tanggal</th>
                                        <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[120px]">Waktu</th>
                                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[150px]">Lokasi</th>
                                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle">Keterangan / Alasan</th>
                                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[180px]">Dicatat Oleh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((record) => (
                                        <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                                                        <Calendar className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm text-slate-800">{record.day}</span>
                                                        <span className="text-[11px] text-slate-500 font-medium mt-0.5">{getFormattedDate(record.date)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center align-middle">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100 shadow-sm">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span className="font-mono">{record.time}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold bg-slate-100/50 px-2 py-1 rounded-lg border border-slate-200/50 w-fit">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    {record.location || "-"}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-start gap-2 text-sm text-slate-600 font-medium leading-relaxed">
                                                    <FileText className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                                    <span>{record.notes || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                    <UserCheck className="h-4 w-4 text-slate-400" />
                                                    {getCleanName(record.recordedBy || "-")}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                                <span className="font-medium text-foreground">{totalRecords}</span>
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
        </div>
    );
};
