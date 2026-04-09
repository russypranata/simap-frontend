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
import { type AchievementRecord } from "../services/parentAchievementsService";
import {
    ErrorState,
    PageHeader,
    ChildSelector,
    FilterButton,
    ActiveFilterBadges,
    PaginationControls,
    StatCard,
} from "@/features/shared/components";

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

    const handleViewDetail = (achievement: AchievementRecord) => {
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
            <PageHeader
                title="Prestasi"
                titleHighlight="Anak"
                icon={Award}
                description="Daftar pencapaian dan prestasi anak yang telah diraih"
            >
                <Dialog open={isFilterOpen} onOpenChange={(open) => {
                    if (open) {
                        setTempAcademicYear(selectedAcademicYear);
                    }
                    setIsFilterOpen(open);
                }}>
                    <DialogTrigger asChild>
                        <FilterButton activeCount={selectedAcademicYear !== "all" ? 1 : 0} />
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
                    <ChildSelector childList={children} selectedChildId={selectedChildId} onSelect={setSelectedChildId} />
                </PageHeader>

            {/* Active Global Filters */}
            <ActiveFilterBadges
                badges={selectedAcademicYear !== "all" ? [{
                    key: "year",
                    label: `TA. ${selectedAcademicYear}`,
                    icon: Calendar,
                    onRemove: () => setSelectedAcademicYear("all"),
                }] : []}
            />

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Prestasi" value={totalAchievements} unit="pencapaian" subtitle="Sepanjang waktu" icon={Trophy} color="blue" />
                <StatCard title="Nasional+" value={nationalAchievements} unit="pencapaian" subtitle="Nasional & Internasional" icon={Star} color="red" />
                <StatCard title="Juara 1" value={firstPlaceCount} unit="pencapaian" subtitle="Pencapaian tertinggi" icon={TrendingUp} color="emerald" />
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
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredTotal}
                            startIndex={startIndexDisplay}
                            endIndex={Math.min(currentPage * itemsPerPage, filteredTotal)}
                            itemsPerPage={itemsPerPage}
                            itemLabel="prestasi"
                            onPageChange={goToPage}
                            onItemsPerPageChange={(val) => {
                                setItemsPerPage(val);
                                goToPage(1);
                            }}
                        />
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
