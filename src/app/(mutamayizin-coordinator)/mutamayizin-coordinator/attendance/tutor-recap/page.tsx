"use client";

import React, { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FileSpreadsheet,
    Calendar,
    Search,
    TrendingUp,
    Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutamayizinTutorAttendance } from "@/features/mutamayizin/hooks/useMutamayizinEkskul";
import { EmptyState } from "@/features/shared/components/EmptyState";
import { ErrorState } from "@/features/shared/components/ErrorState";
import { SkeletonTableRow } from "@/features/shared/components/SkeletonBlocks";
import { PaginationControls } from "@/features/shared/components/PaginationControls";
import { useQuery } from "@tanstack/react-query";
import { getAcademicYears } from "@/features/mutamayizin/services/mutamayizinService";
import type { TutorAttendanceItem } from "@/features/mutamayizin/services/mutamayizinService";

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

export default function TutorRecapPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [academicYearFilter, setAcademicYearFilter] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch academic years
    const { data: academicYears } = useQuery({
        queryKey: ["mutamayizin-academic-years"],
        queryFn: getAcademicYears,
        staleTime: 10 * 60 * 1000,
    });

    const activeYear = academicYears?.find((y) => y.isActive);
    const selectedYearId = academicYearFilter || (activeYear ? String(activeYear.id) : "");
    const selectedYearName = academicYears?.find((y) => String(y.id) === selectedYearId)?.name ?? "";

    const { data: tutorAttendance, isLoading, error, refetch } = useMutamayizinTutorAttendance(
        selectedYearId ? { academic_year_id: selectedYearId } : undefined
    );

    // Client-side search filter
    const filteredData = useMemo(() => {
        const list: TutorAttendanceItem[] = tutorAttendance ?? [];
        if (!searchQuery) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(
            (item) =>
                item.tutorName.toLowerCase().includes(q) ||
                item.ekskulName.toLowerCase().includes(q)
        );
    }, [tutorAttendance, searchQuery]);

    // Pagination
    const totalItems = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Stats
    const totalTutors = new Set((tutorAttendance ?? []).map((t) => t.tutorId)).size;
    const totalSessions = (tutorAttendance ?? []).reduce((sum, t) => sum + t.sessionCount, 0);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Rekap </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Presensi Tutor</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <FileSpreadsheet className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Rekap kehadiran dan sesi mengajar tutor ekstrakurikuler
                    </p>
                </div>
            </div>

            {/* Stats Card */}
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
                            <h2 className="text-xl font-bold text-white">Statistik Presensi Tutor</h2>
                            <p className="text-blue-100 text-sm">
                                Ringkasan performa presensi tutor{selectedYearName ? ` TA ${selectedYearName}` : ""}
                            </p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x">
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                                <FileSpreadsheet className="h-4 w-4 text-blue-800" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{totalSessions}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Total Sesi</p>
                        </div>
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-green-100 rounded-full mb-1.5">
                                <Users className="h-4 w-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{totalTutors}</p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">Tutor Aktif</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table Card */}
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileSpreadsheet className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Daftar Rekap Tutor</CardTitle>
                                <CardDescription>
                                    Rekap sesi mengajar tutor{selectedYearName ? ` TA ${selectedYearName}` : ""}
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {totalItems} Data
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="px-4 pb-4 pt-4 border-b">
                        <div className="flex flex-col sm:flex-row gap-3 justify-between">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari tutor atau ekskul..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-9 h-9"
                                />
                            </div>
                            <Select
                                value={selectedYearId}
                                onValueChange={(val) => {
                                    setAcademicYearFilter(val);
                                    setCurrentPage(1);
                                }}
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

                    {/* Table */}
                    {error ? (
                        <div className="p-4">
                            <ErrorState
                                error={(error as Error).message || "Gagal memuat data rekap tutor"}
                                onRetry={() => refetch()}
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-center p-4 font-medium text-sm w-12">No</th>
                                        <th className="text-left p-4 font-medium text-sm min-w-[180px]">Nama Tutor</th>
                                        <th className="text-left p-4 font-medium text-sm min-w-[160px]">Nama Ekskul</th>
                                        <th className="text-center p-4 font-medium text-sm w-32">Jumlah Sesi</th>
                                        <th className="text-left p-4 font-medium text-sm min-w-[160px]">Sesi Terakhir</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <SkeletonTableRow key={i} cols={5} />
                                        ))
                                    ) : paginatedData.length === 0 ? (
                                        <tr>
                                            <td colSpan={5}>
                                                <EmptyState
                                                    icon={FileSpreadsheet}
                                                    title="Tidak Ada Data"
                                                    description="Belum ada rekap presensi tutor untuk filter yang dipilih"
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedData.map((item, index) => (
                                            <tr
                                                key={item.tutorId}
                                                className="border-b border-slate-100 hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="p-4 text-center text-sm text-muted-foreground">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-medium text-sm">{item.tutorName}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm">{item.ekskulName}</span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                                        {item.sessionCount} sesi
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {formatDate(item.lastSession)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && !error && totalItems > 0 && (
                        <PaginationControls
                            currentPage={safePage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            startIndex={startIndex + 1}
                            endIndex={endIndex}
                            itemsPerPage={itemsPerPage}
                            itemLabel="tutor"
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
