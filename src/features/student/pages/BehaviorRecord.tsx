"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, AlertTriangle, Clock, MapPin, User, FileText, ClipboardList, Building, Home, CheckCircle, RotateCcw, Check, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useStudentBehavior } from "../hooks/useStudentBehavior";
import {
    PageHeader, ErrorState, LoadingOverlay, StatCard, ActiveFilterBadges,
    FilterButton, PaginationControls, SkeletonPageHeader, SkeletonStatCard, SkeletonListItem,
} from "@/features/shared/components";

const BehaviorSkeleton: React.FC = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <SkeletonPageHeader />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        <Card>
            <CardContent className="p-4 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => <SkeletonListItem key={i} />)}
            </CardContent>
        </Card>
    </div>
);

export const StudentBehaviorRecord: React.FC = () => {
    const {
        filteredRecords, allFilteredCount, stats, academicYears,
        selectedAcademicYear, locationFilter,
        isLoading, isFetching, error,
        currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
        totalPages, showPagination,
        handleAcademicYearChange, handleLocationChange, refetch,
    } = useStudentBehavior();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempAcademicYear, setTempAcademicYear] = useState<string>("all");

    const startIndexDisplay = (currentPage - 1) * itemsPerPage + 1;
    const endIndexDisplay   = Math.min(currentPage * itemsPerPage, allFilteredCount);

    if (error) return <ErrorState error={error} onRetry={refetch} />;
    if (isLoading) return <BehaviorSkeleton />;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Catatan"
                titleHighlight="Perilaku"
                icon={ClipboardList}
                description="Catatan perilaku dan pelanggaran selama di sekolah dan asrama"
            >
                <Dialog open={isFilterOpen} onOpenChange={(open) => { if (open) setTempAcademicYear(selectedAcademicYear); setIsFilterOpen(open); }}>
                    <DialogTrigger asChild>
                        <FilterButton activeCount={selectedAcademicYear !== "all" ? 1 : 0} />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl">
                        <DialogHeader className="flex-row items-center gap-4">
                            <div className="p-2.5 bg-blue-100 rounded-xl"><Filter className="h-5 w-5 text-blue-700" /></div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-slate-900">Filter Perilaku</DialogTitle>
                                <DialogDescription className="text-slate-500">Sesuaikan tahun ajaran catatan perilaku</DialogDescription>
                            </div>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />Tahun Ajaran
                                </label>
                                <Select value={tempAcademicYear} onValueChange={setTempAcademicYear}>
                                    <SelectTrigger className="w-full bg-slate-50/50 border-slate-200"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tahun</SelectItem>
                                        {academicYears.map(year => <SelectItem key={year} value={year}>TA. {year}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                            <Button variant="ghost" onClick={() => setTempAcademicYear("all")} className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2">
                                <RotateCcw className="h-4 w-4" />Reset Pilihan
                            </Button>
                            <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2" onClick={() => { handleAcademicYearChange(tempAcademicYear); setIsFilterOpen(false); }}>
                                <Check className="h-4 w-4" />Terapkan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            <ActiveFilterBadges
                badges={selectedAcademicYear !== "all" ? [{
                    key: "year", label: `TA. ${selectedAcademicYear}`, icon: Calendar,
                    onRemove: () => handleAcademicYearChange("all"),
                }] : []}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Pelanggaran" value={stats.totalViolations} unit="catatan" subtitle="Sepanjang waktu" icon={AlertTriangle} color="red" />
                <StatCard title="Di Sekolah" value={stats.schoolViolations} unit="catatan" subtitle="Pelanggaran di sekolah" icon={Building} color="blue" />
                <StatCard title="Di Asrama" value={stats.dormViolations} unit="catatan" subtitle="Pelanggaran di asrama" icon={Home} color="amber" />
            </div>

            {/* Record List */}
            <Card className="relative">
                {isFetching && <LoadingOverlay />}
                <CardHeader className="pb-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-red-100 rounded-xl"><AlertTriangle className="h-5 w-5 text-red-700" /></div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Pelanggaran</CardTitle>
                                <CardDescription className="text-sm text-slate-600">Catatan pelanggaran yang pernah dilakukan</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 sm:mt-0">
                            <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold h-7 px-3 rounded-full text-[11px]">
                                {allFilteredCount || 0} Pelanggaran
                            </Badge>
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
                                <p className="text-sm text-slate-500 max-w-md">Tidak ada catatan pelanggaran untuk periode ini.</p>
                                <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 inline-block px-3 py-1 rounded-full border border-green-100">
                                    Pertahankan perilaku baikmu! 👏
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredRecords.map((record) => (
                                <div key={record.id} className={cn(
                                    "group relative rounded-xl border bg-card overflow-hidden shadow-sm",
                                    record.location === "sekolah" ? "border-blue-200/60" : "border-amber-200/60"
                                )}>
                                    <div className="px-4 py-4 space-y-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <Badge variant="outline" className={cn("text-xs font-semibold rounded-full px-2.5 py-0.5",
                                                    record.location === "sekolah" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
                                                    {record.location === "sekolah" ? <><Building className="h-3 w-3 mr-1" />Sekolah</> : <><Home className="h-3 w-3 mr-1" />Asrama</>}
                                                </Badge>
                                                {selectedAcademicYear === "all" && (
                                                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">TA. {record.academicYearId}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {new Date(record.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{record.time}</span>
                                            </div>
                                        </div>
                                        <h4 className="font-semibold text-[15px] text-foreground leading-snug">{record.problem}</h4>
                                        <div className={cn("rounded-lg px-3.5 py-2.5",
                                            record.location === "sekolah" ? "bg-blue-50/60" : "bg-amber-50/60")}>
                                            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Tindak Lanjut</span>
                                            <p className="text-sm text-foreground/80 leading-relaxed">{record.followUp}</p>
                                        </div>
                                        <div className="flex items-center gap-2 pt-1">
                                            <div className={cn("flex items-center justify-center w-6 h-6 rounded-full",
                                                record.location === "sekolah" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")}>
                                                <User className="h-3 w-3" />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                Dilaporkan oleh <span className="font-semibold text-foreground">
                                                    {record.reporterGender === "L" ? "Pak" : "Bu"} {record.reporterName}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {showPagination && (
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={allFilteredCount}
                            startIndex={startIndexDisplay}
                            endIndex={endIndexDisplay}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg"><FileText className="h-5 w-5 text-blue-800" /></div>
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
