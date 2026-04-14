"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Trophy, Users, Clock, MapPin, CheckCircle, Star, Award, User, Activity, ChevronRight, Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudentExtracurricular } from "../hooks/useStudentExtracurricular";
import type { ExtracurricularStatus } from "../services/studentExtracurricularService";
import { ErrorState, LoadingOverlay, PageHeader, FilterButton, ActiveFilterBadges, PaginationControls } from "@/features/shared/components";

const getStatusConfig = (status: ExtracurricularStatus) => ({
    hadir: { label: "Hadir", color: "bg-green-50 text-green-700 border-green-200" },
    izin:  { label: "Izin",  color: "bg-blue-50 text-blue-700 border-blue-200" },
    alpa:  { label: "Alpa",  color: "bg-red-50 text-red-700 border-red-200" },
}[status]);

const ExtracurricularSkeleton: React.FC = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
                <div className="flex items-center gap-3"><Skeleton className="h-10 w-72" /><Skeleton className="h-8 w-8 rounded-full" /></div>
                <Skeleton className="h-4 w-56" />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="px-5 py-4 pl-6 flex items-center gap-4">
                        <div className="relative flex-shrink-0"><Skeleton className="w-11 h-11 rounded-xl" /></div>
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-3 w-24" />
                            <div className="flex items-baseline gap-2"><Skeleton className="h-7 w-12" /><Skeleton className="h-4 w-16" /></div>
                            <Skeleton className="h-3 w-28" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div className="space-y-2"><Skeleton className="h-5 w-28" /><Skeleton className="h-4 w-20" /></div>
                            </div>
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3 mb-4">{Array.from({ length: 4 }).map((_, j) => <Skeleton key={j} className="h-5 w-full" />)}</div>
                        <div className="mb-4 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-2 w-full rounded-full" /></div>
                        <div className="pt-3 border-t space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div>
                    </CardContent>
                </Card>
            ))}
        </div>
        <Card className="border-blue-200 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2"><Skeleton className="h-5 w-36" /><Skeleton className="h-4 w-52" /></div>
                    </div>
                    <Skeleton className="h-9 w-[200px]" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-36" /></div>
                            </div>
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

export const StudentExtracurricular: React.FC = () => {
    const {
        extracurriculars, paginatedAttendance, stats, academicYears,
        selectedAcademicYear, filterActivity, uniqueActivitiesList,
        currentPage, totalPages, itemsPerPage, setItemsPerPage,
        filteredTotal, startIndexDisplay, endIndexDisplay,
        goToPage, triggerFetchingOverlay,
        isLoading, isFetching, error,
        handleAcademicYearChange, handleFilterChange, refetch,
    } = useStudentExtracurricular();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempAcademicYear, setTempAcademicYear] = useState<string>("all");

    if (error) return <ErrorState error={error} onRetry={refetch} />;
    if (isLoading) return <ExtracurricularSkeleton />;

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
                        <FilterButton activeCount={selectedAcademicYear !== "all" ? 1 : 0} />
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
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />Tahun Ajaran
                                </label>
                                <Select value={tempAcademicYear} onValueChange={setTempAcademicYear}>
                                    <SelectTrigger className="w-full bg-slate-50/50 border-slate-200"><SelectValue placeholder="Pilih Tahun" /></SelectTrigger>
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
                                <CheckCircle className="h-4 w-4" />Terapkan
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

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="px-5 py-4 pl-6 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 rounded-xl bg-blue-100/80 flex items-center justify-center ring-2 ring-blue-200/50 transition-transform duration-300 group-hover:scale-105">
                                <Trophy className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Ekskul Diikuti</p>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">{stats.totalEkskul}</p>
                                <p className="text-xs text-muted-foreground font-medium">kegiatan</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Total ekskul aktif</p>
                        </div>
                    </div>
                </div>
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="px-5 py-4 pl-6 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center ring-2 transition-transform duration-300 group-hover:scale-105",
                                stats.avgAttendance >= 90 ? "bg-green-100/80 ring-green-200/50" :
                                stats.avgAttendance >= 75 ? "bg-amber-100/80 ring-amber-200/50" : "bg-red-100/80 ring-red-200/50")}>
                                <CheckCircle className={cn("h-5 w-5",
                                    stats.avgAttendance >= 90 ? "text-green-600" :
                                    stats.avgAttendance >= 75 ? "text-amber-600" : "text-red-600")} />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Rata-rata Kehadiran</p>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">{stats.avgAttendance}%</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Tingkat partisipasi</p>
                        </div>
                    </div>
                </div>
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="px-5 py-4 pl-6 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center ring-2 ring-amber-200/50 transition-transform duration-300 group-hover:scale-105">
                                <Award className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Total Prestasi</p>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">{stats.totalAchievements}</p>
                                <p className="text-xs text-muted-foreground font-medium">penghargaan</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Dari semua ekskul</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ekskul Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {extracurriculars.map((ekskul) => (
                    <Card key={ekskul.id} className="group overflow-hidden transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg"><Trophy className="h-5 w-5 text-blue-800" /></div>
                                    <div>
                                        <CardTitle className="text-lg">{ekskul.name}</CardTitle>
                                        <CardDescription>
                                            {ekskul.category}
                                            {selectedAcademicYear === "all" && (
                                                <span className="ml-1.5 inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                                                    TA. {ekskul.academicYearId}
                                                </span>
                                            )}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Badge variant="outline" className={cn("text-[11px] px-2.5 py-0.5 font-medium tracking-wide shadow-sm",
                                    ekskul.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-700 border-slate-200")}>
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
                                    <span className={cn("font-bold tabular-nums",
                                        ekskul.attendanceRate >= 90 ? "text-green-600" :
                                        ekskul.attendanceRate >= 75 ? "text-amber-600" : "text-red-600")}>
                                        {ekskul.attendanceRate}%
                                    </span>
                                </div>
                                <Progress value={ekskul.attendanceRate} className={cn("h-2",
                                    ekskul.attendanceRate >= 90 ? "[&>div]:bg-green-600" :
                                    ekskul.attendanceRate >= 75 ? "[&>div]:bg-amber-600" : "[&>div]:bg-red-600")} />
                            </div>
                            <div className="flex-1">
                                {ekskul.achievements && ekskul.achievements.length > 0 && (
                                    <div className="pt-3 border-t">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium flex items-center gap-1"><Award className="h-4 w-4 text-amber-600" />Prestasi</p>
                                            {ekskul.achievements.length > 2 && (
                                                <Link href="/student/achievements" className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center">
                                                    Lihat Semua<ChevronRight className="h-3 w-3 ml-0.5" />
                                                </Link>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            {ekskul.achievements.slice(0, 2).map((achievement, index) => (
                                                <div key={index} className="flex items-start gap-2 text-sm">
                                                    <Star className="h-3.5 w-3.5 mt-0.5 text-amber-500 flex-shrink-0" />
                                                    <span className="text-muted-foreground leading-snug line-clamp-2">{achievement}</span>
                                                </div>
                                            ))}
                                            {ekskul.achievements.length > 2 && (
                                                <div className="text-[11px] text-muted-foreground pl-5 mt-1 italic">
                                                    + {ekskul.achievements.length - 2} prestasi lainnya
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-5 -mx-6 -mb-6 px-6 py-3 bg-slate-50/80 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                    <Users className="h-4 w-4 text-slate-400" />
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
                        <div className="flex items-center gap-2 mt-0.5 sm:mt-0">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold h-7 px-3 rounded-full text-[11px]">{filteredTotal} Kehadiran</Badge>
                            <Select value={filterActivity} onValueChange={handleFilterChange}>
                                <SelectTrigger className="w-full sm:w-[220px] h-9 bg-white hover:bg-slate-50 text-slate-700 shadow-sm border-slate-200 transition-colors">
                                    <Trophy className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                                    <div className="flex-1 text-left truncate"><SelectValue placeholder="Semua Ekstrakurikuler" /></div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Ekstrakurikuler</SelectItem>
                                    {uniqueActivitiesList.map(name => <SelectItem key={name} value={name.toLowerCase()}>{name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {paginatedAttendance.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                            <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4">
                                <Trophy className="h-8 w-8 text-slate-400" />
                            </div>
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
                                            <div className={cn("flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border transition-colors",
                                                record.status === "hadir" ? "bg-green-50/50 border-green-100 text-green-600" :
                                                record.status === "izin"  ? "bg-blue-50/50 border-blue-100 text-blue-600" :
                                                "bg-red-50/50 border-red-100 text-red-600")}>
                                                {record.status === "hadir" ? <CheckCircle className="h-4 w-4" /> :
                                                 record.status === "izin"  ? <Clock className="h-4 w-4" /> :
                                                 <Activity className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[15px] text-slate-800 leading-tight mb-1 group-hover:text-blue-700 transition-colors">{record.activity}</p>
                                                <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
                                                    <Calendar className="w-3.5 h-3.5 opacity-70" />
                                                    {new Date(record.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={cn("px-2.5 py-0.5 font-medium tracking-wide w-fit sm:w-auto", statusConfig.color)}>
                                            {statusConfig.label}
                                        </Badge>
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
