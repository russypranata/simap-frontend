"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Timer, FileText, Filter, RotateCcw, Check, MapPin, UserCheck } from "lucide-react";
import { useStudentMorningAttendance } from "../hooks/useStudentMorningAttendance";
import { ErrorState, LoadingOverlay, PageHeader, PaginationControls } from "@/features/shared/components";

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
            <PageHeader title="Keterlambatan" titleHighlight="Pagi" icon={Timer} />
            <ErrorState error={error} onRetry={refetch} />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Keterlambatan"
                titleHighlight="Pagi"
                icon={Timer}
                description="Rekap catatan keterlambatan kedatangan kamu di sekolah"
            >
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
            </PageHeader>

            <Card className="overflow-hidden border-blue-200 relative shadow-sm">
                {isFetching && <LoadingOverlay />}
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
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalRecords}
                            startIndex={startIndexDisplay}
                            endIndex={endIndexDisplay}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                            itemsPerPageOptions={[5, 10, 20]}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
