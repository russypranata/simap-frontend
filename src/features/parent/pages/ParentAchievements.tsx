"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Award,
    Calendar,
    Search,
    MapPin,
    Star,
    Filter,
    TrendingUp,
    Trophy,
    ChevronLeft,
    ChevronRight,
    Users,
    AlertTriangle,
    RefreshCw,
    Loader2,
    X,
    RotateCcw,
    Check,
    SlidersHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useParentAchievements } from "../hooks/useParentAchievements";

// Skeleton Loading Component - Mengikuti style original
const ParentAchievementsSkeleton: React.FC = () => {
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300">
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

            {/* List Card Skeleton */}
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="px-4 pb-4 pt-2">
                        <div className="flex flex-col md:flex-row gap-4">
                            <Skeleton className="h-11 flex-1 rounded-md" />
                            <Skeleton className="h-11 w-[180px] rounded-md" />
                            <Skeleton className="h-11 w-[180px] rounded-md" />
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <div key={rowIndex} className="border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start sm:items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-48" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-3 w-4" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2 sm:mt-0 ml-14 sm:ml-0">
                                    <Skeleton className="h-5 w-20 rounded-sm" />
                                    <Skeleton className="h-5 w-20 rounded-sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Prestasi </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anak</span>
                    </h1>
                    <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                        <Award className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </div>
        <Card className="border-red-200 shadow-sm mt-6">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-red-100 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Gagal Memuat Data</h3>
                <p className="text-sm text-slate-500 max-w-md mb-6">{error}</p>
                <Button onClick={onRetry} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Coba Lagi
                </Button>
            </CardContent>
        </Card>
    </div>
);

export const ParentAchievements: React.FC = () => {
    const {
        children,
        selectedChildId,
        setSelectedChildId,
        paginatedRecords,
        academicYears,
        stats,
        selectedLevel: levelFilter, setSelectedLevel: setLevelFilter,
        selectedAcademicYear, setSelectedAcademicYear,
        searchQuery, setSearchQuery,
        selectedAchievement, setSelectedAchievement,
        currentPage,
        totalPages,
        itemsPerPage,
        setItemsPerPage,
        filteredTotal,
        startIndexDisplay,
        goToPage,
        isLoading,
        error,
        refetch
    } = useParentAchievements();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempAcademicYear, setTempAcademicYear] = useState<string>("all");

    if (error) {
        return <ErrorState error={error} onRetry={refetch} />;
    }

    if (isLoading) {
        return <ParentAchievementsSkeleton />;
    }

    const { totalAchievements, nationalAchievements, firstPlaceCount } = stats;

    const handleViewDetail = (achievement: any) => {
        setSelectedAchievement(achievement);
    };

    const getLevelBadgeColor = (level: string) => {
        switch (level) {
            case "Internasional":
                return "bg-purple-100 text-purple-700 border-purple-300";
            case "Nasional":
                return "bg-red-100 text-red-700 border-red-300";
            case "Provinsi":
                return "bg-blue-100 text-blue-700 border-blue-300";
            case "Kabupaten":
                return "bg-emerald-100 text-emerald-700 border-emerald-300";
            default:
                return "bg-amber-100 text-amber-700 border-amber-300";
        }
    };

    const getRankBadgeColor = (rank: string) => {
        switch (rank) {
            case "Juara 1":
                return "bg-emerald-100 text-emerald-700 border-emerald-300";
            case "Juara 2":
                return "bg-sky-100 text-sky-700 border-sky-300";
            case "Juara 3":
                return "bg-orange-100 text-orange-700 border-orange-300";
            default:
                return "bg-zinc-100 text-zinc-600 border-zinc-300";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Prestasi </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anak</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Daftar pencapaian dan prestasi anak yang telah diraih
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 no-print w-full lg:w-auto mt-4 lg:mt-0 flex-wrap lg:flex-nowrap justify-end">
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
                                    <DialogTitle className="text-lg font-semibold text-slate-900">Filter Prestasi</DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        Sesuaikan tahun ajaran yang ditampilkan
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
                                        setSelectedAcademicYear(tempAcademicYear);
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
                            onClick={() => setSelectedAcademicYear("all")}
                            className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </Badge>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5 ml-1"
                        onClick={() => setSelectedAcademicYear("all")}
                    >
                        <RotateCcw className="h-3 w-3" />
                        Hapus Semua
                    </Button>
                </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Prestasi */}
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="px-5 py-4 pl-6 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 rounded-xl bg-blue-100/80 flex items-center justify-center ring-2 ring-blue-200/50 transition-transform duration-300 group-hover:scale-105">
                                <Trophy className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Total Prestasi</p>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">{totalAchievements}</p>
                                <p className="text-xs text-muted-foreground font-medium">pencapaian</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Sepanjang waktu</p>
                        </div>
                    </div>
                </div>

                {/* Nasional & Internasional */}
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="px-5 py-4 pl-6 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 rounded-xl bg-red-100/80 flex items-center justify-center ring-2 ring-red-200/50 transition-transform duration-300 group-hover:scale-105">
                                <Star className="h-5 w-5 text-red-600" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Nasional+</p>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">{nationalAchievements}</p>
                                <p className="text-xs text-muted-foreground font-medium">pencapaian</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Nasional & Internasional</p>
                        </div>
                    </div>
                </div>

                {/* Juara 1 */}
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="px-5 py-4 pl-6 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 rounded-xl bg-emerald-100/80 flex items-center justify-center ring-2 ring-emerald-200/50 transition-transform duration-300 group-hover:scale-105">
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Juara 1</p>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <p className="text-2xl font-bold text-slate-800 leading-none tabular-nums">{firstPlaceCount}</p>
                                <p className="text-xs text-muted-foreground font-medium">pencapaian</p>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Pencapaian tertinggi</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements List */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                <Award className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">Daftar Prestasi</CardTitle>
                                <CardDescription className="text-sm text-slate-600">Seluruh pencapaian yang telah diraih</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold h-7 px-3 rounded-full text-[11px]">
                                {filteredTotal} Prestasi
                            </Badge>

                            {/* Level Filter (local) */}
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-full sm:w-[200px] h-9 bg-white hover:bg-slate-50 text-slate-700 shadow-sm border-slate-200 transition-colors">
                                    <Trophy className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                                    <SelectValue placeholder="Semua Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tingkat</SelectItem>
                                    <SelectItem value="Sekolah">Sekolah</SelectItem>
                                    <SelectItem value="Kecamatan">Kecamatan</SelectItem>
                                    <SelectItem value="Kabupaten">Kabupaten</SelectItem>
                                    <SelectItem value="Provinsi">Provinsi</SelectItem>
                                    <SelectItem value="Nasional">Nasional</SelectItem>
                                    <SelectItem value="Internasional">Internasional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Search Bar & Active Local Filters */}
                    <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-slate-100 px-1">
                        {/* Search Bar Row (Always Full Width) */}
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Cari prestasi (nama, tingkat, atau tahun)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 w-full bg-slate-50 border-slate-200 focus:bg-white focus:ring-blue-500 rounded-lg transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Active Local Filter Chips Row (Below Search) */}
                        {levelFilter !== "all" && (
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                                    <SlidersHorizontal className="h-3 w-3" />
                                    <span>Filter Aktif:</span>
                                </div>

                                <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                                    <Trophy className="h-3.5 w-3.5" />
                                    {levelFilter}
                                    <button
                                        onClick={() => setLevelFilter("all")}
                                        className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </Badge>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5 ml-1"
                                    onClick={() => setLevelFilter("all")}
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Hapus Semua
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">

                    {/* Achievement Cards */}
                    <div className="p-4 space-y-3">
                        {paginatedRecords.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                                <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4 transition-transform hover:scale-110">
                                    <Search className="h-8 w-8 text-slate-400" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-slate-800">Tidak Ada Data</h3>
                                    <p className="text-sm text-slate-500 max-w-md">
                                        {searchQuery || levelFilter !== "all" || selectedAcademicYear !== "all"
                                            ? "Tidak ada prestasi yang cocok dengan pencarian atau filter Anda. Silakan coba sesuaikan kata kunci atau filter Anda."
                                            : "Belum ada data prestasi yang tercatat."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            paginatedRecords.map((achievement, index) => (
                                <div
                                    key={achievement.id}
                                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-sm transition-all duration-200 cursor-pointer"
                                    onClick={() => handleViewDetail(achievement)}
                                >
                                    <div className="flex items-start sm:items-center gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50/50 border border-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                                            {startIndexDisplay + index}
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="font-semibold text-[15px] text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">
                                                {achievement.competitionName}
                                            </h4>
                                            
                                            <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-slate-500 font-medium">
                                                <span>{achievement.eventName}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 opacity-70" />
                                                    {new Date(achievement.date).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 ml-14 sm:ml-0">
                                        <Badge variant="outline" className={cn("px-2.5 py-0.5 font-medium tracking-wide", getLevelBadgeColor(achievement.level))}>
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {achievement.level}
                                        </Badge>
                                        <Badge variant="outline" className={cn("px-2.5 py-0.5 font-medium tracking-wide", getRankBadgeColor(achievement.rank))}>
                                            <Star className="h-3 w-3 mr-1" />
                                            {achievement.rank}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer with Pagination */}
                    {filteredTotal > 0 && (
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 mt-6 pt-4 border-t border-slate-100">
                            {/* Left: Pagination Info */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground w-full lg:w-auto justify-center lg:justify-start">
                                <span>Menampilkan</span>
                                <span className="font-medium text-foreground">
                                    {startIndexDisplay}
                                </span>
                                <span>-</span>
                                <span className="font-medium text-foreground">
                                    {Math.min(currentPage * itemsPerPage, filteredTotal)}
                                </span>
                                <span>dari</span>
                                <span className="font-medium text-foreground">{filteredTotal}</span>
                                <span>prestasi</span>
                            </div>

                            {/* Right: Pagination Controls */}
                            <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-end">
                                {/* Items per page */}
                                <Select value={itemsPerPage.toString()} onValueChange={(val) => {
                                    setItemsPerPage(Number(val));
                                    goToPage(1);
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
                                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
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
                                                onClick={() => goToPage(pageNumber)}
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
                                                onClick={() => goToPage(totalPages)}
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
                                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
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

            {/* Detail Dialog */}
            <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Trophy className="h-6 w-6 text-blue-800" />
                            </div>
                            <DialogTitle className="text-xl font-bold">
                                {selectedAchievement?.competitionName}
                            </DialogTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedAchievement && (
                                <>
                                    <Badge variant="outline" className={getLevelBadgeColor(selectedAchievement.level)}>
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {selectedAchievement.level}
                                    </Badge>
                                    <Badge variant="outline" className={getRankBadgeColor(selectedAchievement.rank)}>
                                        <Star className="h-3 w-3 mr-1" />
                                        {selectedAchievement.rank}
                                    </Badge>
                                </>
                            )}
                        </div>
                    </DialogHeader>

                    {selectedAchievement && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Nama Event</p>
                                    <p className="text-sm font-medium">{selectedAchievement.eventName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Kategori</p>
                                    <p className="text-sm font-medium">{selectedAchievement.category}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Penyelenggara</p>
                                    <p className="text-sm font-medium">{selectedAchievement.organizer}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Tanggal</p>
                                    <p className="text-sm font-medium">
                                        {new Date(selectedAchievement.date).toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
