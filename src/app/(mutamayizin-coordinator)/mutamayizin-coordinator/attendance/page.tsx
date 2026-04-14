"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CalendarCheck,
    Users,
    TrendingUp,
    Award,
    Search,
    ArrowRight,
    Calendar,
} from "lucide-react";
import { useMutamayizinExtracurriculars } from "@/features/mutamayizin/hooks/useMutamayizinEkskul";
import { EmptyState } from "@/features/shared/components/EmptyState";
import { ErrorState } from "@/features/shared/components/ErrorState";
import { useQuery } from "@tanstack/react-query";
import { getAcademicYears } from "@/features/mutamayizin/services/mutamayizinService";
import type { ExtracurricularItem } from "@/features/mutamayizin/services/mutamayizinService";

const SkeletonEkskulCard = () => (
    <Card>
        <CardContent className="p-0">
            <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                </div>
                <Skeleton className="h-12 rounded-lg" />
            </div>
        </CardContent>
    </Card>
);

const getAttendanceBadgeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-700 border-green-200";
    if (percentage >= 75) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
};

export default function AttendanceDashboard() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [academicYearFilter, setAcademicYearFilter] = useState<string>("");

    // Fetch academic years for filter
    const { data: academicYears } = useQuery({
        queryKey: ["mutamayizin-academic-years"],
        queryFn: getAcademicYears,
        staleTime: 10 * 60 * 1000,
    });

    // Set default to active year once loaded
    const activeYear = academicYears?.find((y) => y.isActive);
    const selectedYearId = academicYearFilter || (activeYear ? String(activeYear.id) : "");
    const selectedYearName = academicYears?.find((y) => String(y.id) === selectedYearId)?.name ?? "";

    const { data: ekskuls, isLoading, error, refetch } = useMutamayizinExtracurriculars(
        selectedYearId ? { academic_year_id: selectedYearId } : undefined
    );

    const filteredEkskul = (ekskuls ?? []).filter((ekskul: ExtracurricularItem) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            ekskul.name.toLowerCase().includes(q) ||
            ekskul.tutorName.toLowerCase().includes(q)
        );
    });

    // Stats from filtered data
    const totalEkskul = filteredEkskul.length;
    const totalMembers = filteredEkskul.reduce((sum, e) => sum + e.memberCount, 0);
    const avgAttendance =
        totalEkskul > 0
            ? Math.round(
                  filteredEkskul.reduce((sum, e) => sum + e.attendanceRate, 0) / totalEkskul
              )
            : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Presensi </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Ekstrakurikuler</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <CalendarCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Monitor dan kelola data presensi semua kegiatan ekstrakurikuler
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <Card className="overflow-hidden p-0">
                <div className="bg-blue-800 p-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-[20px] border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-[8px] border-white rounded-full translate-y-1/2" />
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Statistik Presensi</h2>
                            <p className="text-blue-100 text-sm">
                                Ringkasan performa kehadiran{selectedYearName ? ` TA ${selectedYearName}` : ""}
                            </p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                                <Award className="h-4 w-4 text-blue-800" />
                            </div>
                            <p className="text-2xl font-bold">{totalEkskul}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Ekstrakurikuler</p>
                        </div>
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-green-100 rounded-full mb-1.5">
                                <Users className="h-4 w-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold">{totalMembers}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Anggota</p>
                        </div>
                        <div className="p-2.5 text-center col-span-2 sm:col-span-1">
                            <div className="inline-flex p-2 bg-green-100 rounded-full mb-1.5">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">{avgAttendance}%</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Rata-rata Kehadiran</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ekstrakurikuler List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <CalendarCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Rekap Presensi Ekstrakurikuler</CardTitle>
                                <CardDescription>
                                    Daftar kehadiran per ekstrakurikuler{selectedYearName ? ` TA ${selectedYearName}` : ""}. Pilih untuk detail.
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {filteredEkskul.length} Ekstrakurikuler
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="px-4 pb-4 pt-4 border-b">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="relative w-full lg:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama ekskul atau tutor..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Select
                                    value={selectedYearId}
                                    onValueChange={(val) => setAcademicYearFilter(val)}
                                >
                                    <SelectTrigger className="w-full sm:w-[160px] h-9">
                                        <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                        <SelectValue placeholder="Tahun Ajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(academicYears ?? []).map((y) => (
                                            <SelectItem key={y.id} value={String(y.id)}>
                                                {y.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {error ? (
                            <ErrorState
                                error={(error as Error).message || "Gagal memuat data ekskul"}
                                onRetry={() => refetch()}
                            />
                        ) : isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <SkeletonEkskulCard key={i} />
                                ))}
                            </div>
                        ) : filteredEkskul.length === 0 ? (
                            <EmptyState
                                icon={Search}
                                title="Tidak Ada Data"
                                description="Tidak ada ekstrakurikuler yang cocok dengan pencarian atau filter yang dipilih"
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredEkskul.map((ekskul) => (
                                    <Card
                                        key={ekskul.id}
                                        className="transition-colors cursor-pointer group hover:bg-muted/30"
                                        onClick={() =>
                                            router.push(
                                                `/mutamayizin-coordinator/attendance/${ekskul.id}${selectedYearId ? `?academic_year_id=${selectedYearId}` : ""}`
                                            )
                                        }
                                    >
                                        <CardContent className="p-0">
                                            {/* Header */}
                                            <div className="p-4 border-b">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                        <Award className="h-5 w-5 text-blue-800" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-base group-hover:text-blue-800 transition-colors truncate">
                                                            {ekskul.name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground truncate">
                                                            {ekskul.tutorName}
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-800 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="p-4">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="p-3 rounded-lg bg-muted/30">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Users className="h-4 w-4 text-blue-600" />
                                                            <span className="text-xs text-muted-foreground">Anggota</span>
                                                        </div>
                                                        <p className="text-lg font-bold text-blue-800">{ekskul.memberCount}</p>
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-muted/30">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <CalendarCheck className="h-4 w-4 text-purple-600" />
                                                            <span className="text-xs text-muted-foreground">Aktivitas Terakhir</span>
                                                        </div>
                                                        <p className="text-sm font-semibold">
                                                            {ekskul.lastActivity
                                                                ? new Date(ekskul.lastActivity).toLocaleDateString("id-ID", {
                                                                      day: "2-digit",
                                                                      month: "short",
                                                                  })
                                                                : "-"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Attendance Rate */}
                                                <div className="mt-3 p-3 rounded-lg bg-muted/30">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                                            <span className="text-sm text-muted-foreground">Rata-rata Kehadiran</span>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={getAttendanceBadgeColor(ekskul.attendanceRate)}
                                                        >
                                                            {ekskul.attendanceRate}%
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {!isLoading && !error && filteredEkskul.length > 0 && (
                        <div className="p-4 text-sm text-muted-foreground flex items-center gap-1 border-t">
                            <span>Menampilkan</span>
                            <span className="font-medium text-foreground">{filteredEkskul.length}</span>
                            <span>ekstrakurikuler</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
