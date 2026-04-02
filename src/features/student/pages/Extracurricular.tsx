"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Trophy, Clock, MapPin, CheckCircle, Star, Award, User, Activity, Filter, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudentExtracurricular } from "../hooks/useStudentExtracurricular";
import type { ExtracurricularStatus } from "../services/studentExtracurricularService";
import { ErrorState, LoadingOverlay, PageHeader, PaginationControls, ActiveFilterBadges } from "@/features/shared/components";
import type { FilterBadge } from "@/features/shared/components";

const getStatusConfig = (status: ExtracurricularStatus) => ({
    hadir: { label: "Hadir", color: "bg-green-50 text-green-700 border-green-200" },
    izin: { label: "Izin", color: "bg-blue-50 text-blue-700 border-blue-200" },
    alpa: { label: "Alpa", color: "bg-red-50 text-red-700 border-red-200" },
}[status]);

export const StudentExtracurricular: React.FC = () => {
    const {
        extracurriculars, paginatedAttendance, stats, academicYears,
        selectedAcademicYear, filterActivity, uniqueActivitiesList,
        currentPage, totalPages, itemsPerPage, setItemsPerPage,
        filteredTotal, startIndexDisplay, endIndexDisplay,
        goToPage, goToPrevPage, triggerFetchingOverlay,
        isLoading, isFetching, error,
        handleAcademicYearChange, handleFilterChange, refetch,
    } = useStudentExtracurricular();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempAcademicYear, setTempAcademicYear] = useState<string>("all");

    if (isLoading) return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Skeleton className="h-10 w-72" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}</div>
        </div>
    );

    if (error) return (
        <div className="space-y-6">
            <PageHeader title="Kegiatan" titleHighlight="Ekstrakurikuler" icon={Trophy} />
            <ErrorState error={error} onRetry={refetch} />
        </div>
    );

    const filterBadges: FilterBadge[] = selectedAcademicYear !== "all" ? [
        {
            key: "academicYear",
            label: `TA. ${selectedAcademicYear}`,
            icon: Calendar,
            onRemove: () => handleAcademicYearChange("all"),
        },
    ] : [];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Kegiatan"
                titleHighlight="Ekstrakurikuler"
                icon={Trophy}
                description="Lihat kegiatan ekstrakurikuler yang kamu ikuti dan riwayat keaktifannya"
            >
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
                                <DialogTitle className="text-lg font-semibold text-slate-900">Filter Kegiatan</DialogTitle>
                                <DialogDescription className="text-slate-500">Sesuaikan tahun ajaran kegiatan</DialogDescription>
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
            </PageHeader>

            <ActiveFilterBadges badges={filterBadges} />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Ekskul Diikuti", value: stats.totalEkskul, sub: "Total ekskul aktif", icon: Trophy, color: "blue" },
                    { label: "Rata-rata Kehadiran", value: `${stats.avgAttendance}%`, sub: "Tingkat partisipasi", icon: CheckCircle, color: stats.avgAttendance >= 90 ? "green" : stats.avgAttendance >= 75 ? "amber" : "red" },
                    { label: "Total Prestasi", value: stats.totalAchievements, sub: "Dari semua ekskul", icon: Award, color: "amber" },
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

            {/* Ekskul Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {extracurriculars.map(ekskul => (
                    <Card key={ekskul.id} className="group overflow-hidden transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg"><Trophy className="h-5 w-5 text-blue-800" /></div>
                                    <div>
                                        <CardTitle className="text-lg">{ekskul.name}</CardTitle>
                                        <CardDescription>
                                            {ekskul.category}
                                            {selectedAcademicYear === "all" && <span className="ml-1.5 inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">TA. {ekskul.academicYearId}</span>}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Badge variant="outline" className={cn("text-[11px] px-2.5 py-0.5 font-medium shadow-sm", ekskul.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-700 border-slate-200")}>
                                    {ekskul.status === "active" ? "Aktif" : "Tidak Aktif"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1">
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {[{ icon: Calendar, text: ekskul.schedule }, { icon: Clock, text: ekskul.time }, { icon: MapPin, text: ekskul.location }, { icon: User, text: ekskul.advisor }].map(({ icon: Icon, text }, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm"><Icon className="h-4 w-4 text-muted-foreground" /><span>{text}</span></div>
                                ))}
                            </div>
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Tingkat Kehadiran</span>
                                    <span className={cn("font-bold tabular-nums", ekskul.attendanceRate >= 90 ? "text-green-600" : ekskul.attendanceRate >= 75 ? "text-amber-600" : "text-red-600")}>{ekskul.attendanceRate}%</span>
                                </div>
                                <Progress value={ekskul.attendanceRate} className={cn("h-2", ekskul.attendanceRate >= 90 ? "[&>div]:bg-green-600" : ekskul.attendanceRate >= 75 ? "[&>div]:bg-amber-600" : "[&>div]:bg-red-600")} />
                            </div>
                            {ekskul.achievements && ekskul.achievements.length > 0 && (
                                <div className="pt-3 border-t flex-1">
                                    <p className="text-sm font-medium mb-2 flex items-center gap-1"><Award className="h-4 w-4 text-amber-600" />Prestasi</p>
                                    <div className="space-y-1.5">
                                        {ekskul.achievements.slice(0, 2).map((a, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm"><Star className="h-3.5 w-3.5 mt-0.5 text-amber-500 flex-shrink-0" /><span className="text-muted-foreground leading-snug line-clamp-2">{a}</span></div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between mt-5 -mx-6 -mb-6 px-6 py-3 bg-slate-50/80 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                    <Trophy className="h-4 w-4 text-slate-400" />
                                    <span><span className="tabular-nums font-semibold text-slate-800">{ekskul.members}</span> anggota</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Sejak {new Date(ekskul.joinDate).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Attendance History */}
            <Card className="relative overflow-hidden shadow-sm border-blue-200">
                {isFetching && <LoadingOverlay />}
                <CardHeader className="pb-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 rounded-xl"><Activity className="h-5 w-5 text-blue-800" /></div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Kehadiran</CardTitle>
                                <CardDescription className="text-sm text-slate-600">Kehadiran seluruh kegiatan ekstrakurikuler</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold h-7 px-3 rounded-full text-[11px]">{filteredTotal} Kehadiran</Badge>
                            <Select value={filterActivity} onValueChange={handleFilterChange}>
                                <SelectTrigger className="w-full sm:w-[220px] h-9 bg-white shadow-sm border-slate-200">
                                    <Trophy className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                                    <SelectValue placeholder="Semua Ekstrakurikuler" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Ekstrakurikuler</SelectItem>
                                    {uniqueActivitiesList.map(n => <SelectItem key={n} value={n.toLowerCase()}>{n}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {paginatedAttendance.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                            <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4"><Trophy className="h-8 w-8 text-slate-400" /></div>
                            <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Riwayat</h3>
                            <p className="text-sm text-slate-500 max-w-md">Belum ada data riwayat kehadiran untuk filter yang dipilih.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {paginatedAttendance.map(record => {
                                const statusConfig = getStatusConfig(record.status);
                                return (
                                    <div key={record.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border transition-colors", record.status === "hadir" ? "bg-green-50/50 border-green-100 text-green-600" : record.status === "izin" ? "bg-blue-50/50 border-blue-100 text-blue-600" : "bg-red-50/50 border-red-100 text-red-600")}>
                                                {record.status === "hadir" ? <CheckCircle className="h-4 w-4" /> : record.status === "izin" ? <Clock className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[15px] text-slate-800 leading-tight mb-1 group-hover:text-blue-700 transition-colors">{record.activity}</p>
                                                <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
                                                    <Calendar className="w-3.5 h-3.5 opacity-70" />
                                                    {new Date(record.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn("px-2.5 py-0.5 font-medium tracking-wide w-fit sm:w-auto", statusConfig.color)}>{statusConfig.label}</Badge>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {filteredTotal > 0 && (
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredTotal}
                            startIndex={startIndexDisplay}
                            endIndex={endIndexDisplay}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(p) => { goToPage(p); triggerFetchingOverlay(); }}
                            onItemsPerPageChange={(val) => { setItemsPerPage(val); goToPage(1); }}
                            itemsPerPageOptions={[5, 10, 25]}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
