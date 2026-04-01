"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, AlertTriangle, Clock, MapPin, User, FileText, ClipboardList, Building, Home, AlertCircle, CheckCircle, Loader2, RefreshCw, RotateCcw, Check, ChevronLeft, ChevronRight, Filter, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudentBehavior } from "../hooks/useStudentBehavior";

const Skeleton_ = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <Card><CardHeader><Skeleton className="h-10 w-10 rounded-lg" /></CardHeader><CardContent><div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div></CardContent></Card>
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
    const endIndexDisplay = Math.min(currentPage * itemsPerPage, allFilteredCount);

    if (isLoading) return <Skeleton_ />;
    if (error) return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Catatan </span>
                    <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Perilaku</span>
                </h1>
            </div>
            <Card className="border-red-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 bg-red-100 rounded-full mb-4"><AlertTriangle className="h-8 w-8 text-red-600" /></div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Gagal Memuat Data</h3>
                    <p className="text-sm text-slate-500 max-w-md mb-6">{error}</p>
                    <Button onClick={refetch} variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50"><RefreshCw className="h-4 w-4" />Coba Lagi</Button>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Catatan </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Perilaku</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20"><ClipboardList className="h-5 w-5" /></div>
                    </div>
                    <p className="text-muted-foreground mt-1">Catatan pelanggaran selama di sekolah dan asrama</p>
                </div>

                <Dialog open={isFilterOpen} onOpenChange={(open) => { if (open) setTempAcademicYear(selectedAcademicYear); setIsFilterOpen(open); }}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="h-9 gap-2 bg-white text-slate-700 border-slate-200 shadow-sm font-medium">
                            <Filter className="h-4 w-4 text-slate-500" />
                            <span className="hidden sm:inline">Filter</span>
                            {selectedAcademicYear !== "all" && <Badge className="ml-0.5 h-5 w-5 min-w-[20px] px-0 bg-blue-800 text-white text-[10px] flex items-center justify-center border-0 rounded-full">1</Badge>}
                        </Button>
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
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" />Tahun Ajaran</label>
                                <Select value={tempAcademicYear} onValueChange={setTempAcademicYear}>
                                    <SelectTrigger className="w-full bg-slate-50/50 border-slate-200"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tahun</SelectItem>
                                        {academicYears.map(y => <SelectItem key={y} value={y}>TA. {y}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                            <Button variant="ghost" onClick={() => setTempAcademicYear("all")} className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2"><RotateCcw className="h-4 w-4" />Reset Pilihan</Button>
                            <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2" onClick={() => { handleAcademicYearChange(tempAcademicYear); setIsFilterOpen(false); }}><Check className="h-4 w-4" />Terapkan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {selectedAcademicYear !== "all" && (
                <div className="flex flex-wrap items-center gap-2 px-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1"><SlidersHorizontal className="h-3 w-3" /><span>Filter Aktif:</span></div>
                    <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                        <Calendar className="h-3.5 w-3.5" />TA. {selectedAcademicYear}
                        <button onClick={() => handleAcademicYearChange("all")} className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1"><X className="h-3.5 w-3.5" /></button>
                    </Badge>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Pelanggaran", value: stats.totalViolations, sub: "Sepanjang waktu", icon: AlertTriangle, color: "red" },
                    { label: "Di Sekolah", value: stats.schoolViolations, sub: "Pelanggaran di sekolah", icon: Building, color: "blue" },
                    { label: "Di Asrama", value: stats.dormViolations, sub: "Pelanggaran di asrama", icon: Home, color: "amber" },
                ].map(({ label, value, sub, icon: Icon, color }) => (
                    <div key={label} className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                        <div className="px-5 py-4 pl-6 flex items-center gap-4">
                            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center ring-2 transition-transform duration-300 group-hover:scale-105", `bg-${color}-100/80 ring-${color}-200/50`)}>
                                <Icon className={cn("h-5 w-5", `text-${color}-600`)} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
                                <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums mt-0.5">{value}</p>
                                <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Record List */}
            <Card className="relative">
                {isFetching && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-30 flex items-center justify-center rounded-xl">
                        <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-lg rounded-xl px-5 py-3">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <span className="text-sm font-medium text-slate-600">Memuat data...</span>
                        </div>
                    </div>
                )}
                <CardHeader className="pb-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-red-100 rounded-xl"><AlertTriangle className="h-5 w-5 text-red-700" /></div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Pelanggaran</CardTitle>
                                <CardDescription className="text-sm text-slate-600">Catatan pelanggaran yang pernah dilakukan</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold h-7 px-3 rounded-full text-[11px]">{allFilteredCount} Pelanggaran</Badge>
                            <Select value={locationFilter} onValueChange={handleLocationChange}>
                                <SelectTrigger className="w-full sm:w-[190px] h-9 bg-white shadow-sm border-slate-200">
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
                            <div className="w-16 h-16 rounded-full bg-green-50 border border-dashed border-green-200 flex items-center justify-center mb-4">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Pelanggaran</h3>
                            <p className="text-sm text-slate-500 max-w-md">Tidak ada catatan pelanggaran untuk periode ini.</p>
                            <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 inline-block px-3 py-1 rounded-full border border-green-100">Pertahankan perilaku baikmu! 👏</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredRecords.map(record => (
                                <div key={record.id} className={cn("group relative rounded-xl border bg-card overflow-hidden shadow-sm", record.location === "sekolah" ? "border-blue-200/60" : "border-amber-200/60")}>
                                    <div className="px-4 py-4 space-y-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <Badge variant="outline" className={cn("text-xs font-semibold rounded-full px-2.5 py-0.5", record.location === "sekolah" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
                                                    {record.location === "sekolah" ? <><Building className="h-3 w-3 mr-1" />Sekolah</> : <><Home className="h-3 w-3 mr-1" />Asrama</>}
                                                </Badge>
                                                {selectedAcademicYear === "all" && <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">TA. {record.academicYearId}</span>}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{new Date(record.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{record.time}</span>
                                            </div>
                                        </div>
                                        <h4 className="font-semibold text-[15px] text-foreground leading-snug">{record.problem}</h4>
                                        <div className={cn("rounded-lg px-3.5 py-2.5", record.location === "sekolah" ? "bg-blue-50/60" : "bg-amber-50/60")}>
                                            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Tindak Lanjut</span>
                                            <p className="text-sm text-foreground/80 leading-relaxed">{record.followUp}</p>
                                        </div>
                                        <div className="flex items-center gap-2 pt-1">
                                            <div className={cn("flex items-center justify-center w-6 h-6 rounded-full", record.location === "sekolah" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")}>
                                                <User className="h-3 w-3" />
                                            </div>
                                            <span className="text-xs text-muted-foreground">Dilaporkan oleh <span className="font-semibold text-foreground">{record.reporterGender === "L" ? "Pak" : "Bu"} {record.reporterName}</span></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {showPagination && (
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 mt-6 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Menampilkan</span><span className="font-medium text-foreground">{startIndexDisplay}</span><span>-</span><span className="font-medium text-foreground">{endIndexDisplay}</span><span>dari</span><span className="font-medium text-foreground">{allFilteredCount}</span><span>entri</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Select value={itemsPerPage.toString()} onValueChange={val => { setItemsPerPage(Number(val)); setCurrentPage(1); }}>
                                    <SelectTrigger className="w-[100px] h-8"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 / hal</SelectItem>
                                        <SelectItem value="10">10 / hal</SelectItem>
                                        <SelectItem value="20">20 / hal</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span className="text-sm text-muted-foreground">Hal {currentPage}/{totalPages}</span>
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"><ChevronLeft className="h-4 w-4" /></button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                                        <button key={p} onClick={() => setCurrentPage(p)} className={cn("w-8 h-8 rounded-lg font-medium text-sm flex items-center justify-center", currentPage === p ? "bg-blue-800 text-white" : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100")}>{p}</button>
                                    ))}
                                </div>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"><ChevronRight className="h-4 w-4" /></button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg"><FileText className="h-5 w-5 text-blue-800" /></div>
                        <div>
                            <h3 className="font-semibold text-blue-900">Informasi</h3>
                            <p className="text-sm text-blue-800 mt-1">Catatan pelanggaran ini dilaporkan oleh guru/pembina yang melihat kejadian. Jika memiliki pertanyaan atau sanggahan, silakan hubungi wali kelas atau bagian kesiswaan.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
