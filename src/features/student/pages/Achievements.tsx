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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useStudentAchievements } from "../hooks/useStudentAchievements";
import type { Achievement } from "../services/studentAchievementsService";
import { PaginationControls } from "@/features/shared/components";

export const StudentAchievements: React.FC = () => {
    const {
        searchQuery,
        setSearchQuery,
        levelFilter,
        setLevelFilter,
        currentPage,
        setCurrentPage,
        filteredAchievements,
        paginatedAchievements,
        totalPages,
        totalAchievements,
        nationalAchievements,
        firstPlaceCount,
        ITEMS_PER_PAGE,
    } = useStudentAchievements();

    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    const handleViewDetail = (achievement: Achievement) => {
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
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Saya</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Daftar pencapaian dan prestasi yang telah diraih
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-sm font-medium text-blue-800">
                            Semester Ganjil
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Card with Decorative Header */}
            <Card className="overflow-hidden p-0">
                {/* Decorative Header Section */}
                <div className="bg-blue-800 p-4 relative overflow-hidden">
                    {/* Decorative Geometric Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Statistik Prestasi</h2>
                            <p className="text-blue-100 text-sm">Pencapaian sepanjang waktu</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Teacher Style Layout */}
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                        {/* Total Prestasi */}
                        <div className="pt-3 pb-4 px-5 relative">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pr-10">Total Prestasi</p>
                            <div className="absolute top-3 right-5 p-2.5 rounded-lg bg-blue-50">
                                <Trophy className="h-5 w-5 text-blue-800" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mt-2">{totalAchievements}</div>
                            <p className="text-xs text-muted-foreground mt-1">Sepanjang waktu</p>
                        </div>

                        {/* Nasional & Internasional */}
                        <div className="pt-3 pb-4 px-5 relative">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pr-10">Nasional+</p>
                            <div className="absolute top-3 right-5 p-2.5 rounded-lg bg-red-50">
                                <Star className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mt-2">{nationalAchievements}</div>
                            <p className="text-xs text-muted-foreground mt-1">Tingkat Nasional & Internasional</p>
                        </div>

                        {/* Juara 1 */}
                        <div className="pt-3 pb-4 px-5 relative">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pr-10">Juara 1</p>
                            <div className="absolute top-3 right-5 p-2.5 rounded-lg bg-emerald-50">
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="text-2xl font-bold text-emerald-600 mt-2">{firstPlaceCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Pencapaian tertinggi</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Achievements List */}
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Award className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Daftar Prestasi</CardTitle>
                                <CardDescription>Seluruh pencapaian yang telah diraih</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {filteredAchievements.length} Prestasi
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="px-4 pb-4 pt-2">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Cari berdasarkan nama lomba atau event..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-11"
                                />
                            </div>
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-[180px] h-11">
                                    <Filter className="h-5 w-5 mr-2" />
                                    <SelectValue placeholder="Tingkat" />
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

                    {/* Achievement Cards */}
                    <div className="p-4 space-y-3">
                        {filteredAchievements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                                <div className="rounded-full bg-muted p-6">
                                    <Search className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Tidak Ada Data</h3>
                                    <p className="text-sm text-muted-foreground max-w-md">
                                        {searchQuery
                                            ? `Tidak ada prestasi yang cocok dengan pencarian "${searchQuery}"`
                                            : "Belum ada data prestasi."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            paginatedAchievements.map((achievement, index) => (
                                <div
                                    key={achievement.id}
                                    className="group p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                                    onClick={() => handleViewDetail(achievement)}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Number Badge */}
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-800 mt-0.5">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            {/* Header: Badges + Date */}
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${getRankBadgeColor(achievement.rank)}`}
                                                    >
                                                        <Star className="h-3 w-3 mr-1" />
                                                        {achievement.rank}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${getLevelBadgeColor(achievement.level)}`}
                                                    >
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {achievement.level}
                                                    </Badge>
                                                </div>
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(achievement.date).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                            </div>

                                            {/* Competition Name */}
                                            <h4 className="text-sm font-medium text-foreground leading-snug">
                                                {achievement.competitionName}
                                            </h4>

                                            {/* Event & Category */}
                                            <p className="text-xs text-muted-foreground">
                                                {achievement.eventName} • {achievement.category}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer with Pagination */}
                    {filteredAchievements.length > 0 && (
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredAchievements.length}
                            startIndex={(currentPage - 1) * ITEMS_PER_PAGE + 1}
                            endIndex={Math.min(currentPage * ITEMS_PER_PAGE, filteredAchievements.length)}
                            itemsPerPage={ITEMS_PER_PAGE}
                            itemLabel="prestasi"
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={() => {}}
                            itemsPerPageOptions={[5]}
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
