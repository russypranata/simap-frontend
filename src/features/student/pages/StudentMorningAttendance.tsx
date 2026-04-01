"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Timer, AlertTriangle, FileText, RefreshCw, Loader2, Filter, RotateCcw, Check, ChevronLeft, ChevronRight, MapPin, UserCheck, BookOpen, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudentMorningAttendance } from "../hooks/useStudentMorningAttendance";

const Skeleton_ = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-64" />
        <Card className="border-blue-200">
            <CardHeader><Skeleton className="h-10 w-10 rounded-xl" /></CardHeader>
            <CardContent className="p-0">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-none border-b border-slate-100" />)}
            </CardContent>
        </Card>
    </div>
);

export const StudentMorningAttendance: React.FC = () => {
    const {
        records, totalRecords, academicYears, selectedYearId, selectedSemesterId,
        isLoading, isFetching, error,
        setSelectedYearId, setSelectedSemesterId,
        currentPage, setCurrentPage, itemsPerPage, setItemsPerPage, totalPages, showPagination,
        refetch,
    } = useStudentMorningAttendance();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempYearId, setTempYearId] = useState<string>("all");
    const [tempSemesterId, setTempSemesterId] = useState<string>("all");

    const startIndexDisplay = (currentPage - 1) * itemsPerPage + 1;
    const endIndexDisplay = Math.min(currentPage * itemsPerPage, totalRecords);

    const getCleanName = (name: string) => name.replace(/^(Pak|Bu)\s+/i, "").trim();

    if (isLoading) return <Skeleton_ />;
    if (error) return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Keterlambatan </span>
                    <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Pagi</span>
                </h1>
            </div>
            <Card className="border-red-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 bg-red-100 rounded-full mb-4"><AlertTriangle className="h-8 w-8 text-red-600" /></div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Gagal Memuat Data</h3>
                    <p className="text-sm text-slate-500 max-w-md mb-6">{error}</p>
                    <Button onClick={refetch} variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50">
                        <RefreshCw className="h-4 w-4" /> Coba Lagi
                    </Button>
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
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Keterlambatan </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Pagi</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Timer className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">Rekap catatan keterlambatan kedatangan kamu di sekolah</p>
                </div>

                <Dialog open={isFilterOpen} onOpenChange={(open) => {
                    if (open) { setTempYearId(selectedYearId); setTempSemesterId(selectedSemesterId); }
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
                            <div className="p-2.5 bg-blue-100 rounded-xl"><Filter className="h-5 w-5 text-blue-700" /></div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-slate-900">Filter Presensi</DialogTitle>
                                <DialogDescription className="text-slate-500">Sesuaikan tahun ajaran dan semester</DialogDescription>
                            </div>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" />Tahun Ajaran</label>
                                    <Select value={tempYearId} onValueChange={setTempYearId}>
                                        <SelectTrigger className="w-full bg-slate-50/50 border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Tahun</SelectItem>
                                            {academicYears.map(y => <SelectItem key={y.id} value={y.id}>TA. {y.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Filter className="h-4 w-4 text-slate-400" />Semester</label>
                                    <Select value={tempSemesterId} onValueChange={setTempSemesterId}>
                                        <SelectTrigger className="w-full bg-slate-50/50 border-slate-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Smt</SelectItem>
                                            {tempYearId !== "all"
                                                ? academicYears.find(y => y.id === tempYearId)?.semesters.map(s => <SelectItem key={s.id} value={s.id}>Semester {s.name}</SelectItem>)
                                                : [{ id: "1", name: "Ganjil" }, { id: "2", name: "Genap" }].map(s => <SelectItem key={s.id} value={s.id}>Semester {s.name}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                            <Button variant="ghost" onClick={() => { setTempYearId("all"); setTempSemesterId("all"); }} className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2">
                                <RotateCcw className="h-4 w-4" /> Reset Pilihan
                            </Button>
                            <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2" onClick={() => { setSelectedYearId(tempYearId); setSelectedSemesterId(tempSemesterId); setIsFilterOpen(false); }}>
                                <Check className="h-4 w-4" /> Terapkan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 rounded-xl"><Clock className="h-5 w-5 text-blue-700" /></div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Keterlambatan</CardTitle>
                                <CardDescription className="text-sm text-slate-600">Daftar catatan keterlambatan dari gerbang</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-semibold h-7 px-3 rounded-full text-[11px]">
                            {totalRecords} Keterlambatan
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {records.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                            <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4">
                                <Clock className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Catatan Keterlambatan</h3>
                            <p className="text-sm text-slate-500 max-w-md">Kamu tidak memiliki catatan keterlambatan di rentang waktu yang dipilih.</p>
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
                                    {records.map(record => (
                                        <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                                                        <Calendar className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm text-slate-800">{record.day}</span>
                                                        <span className="text-[11px] text-slate-500 font-medium mt-0.5">{new Date(record.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
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

                    {showPagination && (
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 mt-6 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Menampilkan</span>
                                <span className="font-medium text-foreground">{startIndexDisplay}</span>
                                <span>-</span>
                                <span className="font-medium text-foreground">{endIndexDisplay}</span>
                                <span>dari</span>
                                <span className="font-medium text-foreground">{totalRecords}</span>
                                <span>entri</span>
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
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                                        <button key={p} onClick={() => setCurrentPage(p)} className={cn("w-8 h-8 rounded-lg font-medium text-sm flex items-center justify-center", currentPage === p ? "bg-blue-800 text-white" : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100")}>
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
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
