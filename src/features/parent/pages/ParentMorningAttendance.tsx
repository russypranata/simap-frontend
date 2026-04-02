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
    FileText,
    RotateCcw,
    Check,
    MapPin,
    UserCheck,
    Filter,
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
import {
    ErrorState,
    LoadingOverlay,
    PageHeader,
    ChildSelector,
    FilterButton,
    ActiveFilterBadges,
    PaginationControls,
} from "@/features/shared/components";

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
            <PageHeader
                title="Keterlambatan"
                titleHighlight="Pagi"
                icon={Timer}
                description="Rekap informasi keterlambatan kedatangan siswa di sekolah"
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
                            activeCount={(selectedYearId !== "all" ? 1 : 0) + (selectedSemesterId !== "all" ? 1 : 0)}
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
                    <ChildSelector children={children} selectedChildId={selectedChildId} onSelect={setSelectedChildId} />
                </PageHeader>

            {/* Active Global Filters */}
            <ActiveFilterBadges
                badges={[
                    ...(selectedYearId !== "all" ? [{
                        key: "year",
                        label: `TA. ${academicYears.find(y => y.id === selectedYearId)?.name || selectedYearId}`,
                        icon: Calendar,
                        onRemove: () => setSelectedYearId("all"),
                    }] : []),
                    ...(selectedSemesterId !== "all" ? [{
                        key: "semester",
                        label: `Semester ${
                            selectedYearId !== "all"
                                ? academicYears.find(y => y.id === selectedYearId)?.semesters.find(s => s.id === selectedSemesterId)?.name
                                : selectedSemesterId === "1" ? "Ganjil" : "Genap"
                        }`,
                        icon: BookOpen,
                        onRemove: () => setSelectedSemesterId("all"),
                    }] : []),
                ]}
                onClearAll={() => {
                    setSelectedYearId("all");
                    setSelectedSemesterId("all");
                }}
            />

            {/* Late Records Table */}
            <Card className="overflow-hidden border-blue-200 relative shadow-sm">
                {isFetching && <LoadingOverlay />}
                
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
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalRecords}
                            startIndex={startIndexDisplay}
                            endIndex={endIndexDisplay}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={(val) => {
                                setItemsPerPage(val);
                                setCurrentPage(1);
                            }}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
