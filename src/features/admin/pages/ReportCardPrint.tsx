'use client';

import React, { useState } from 'react';
import {
    Printer,
    Search,
    RefreshCw,
    FilterX,
    FileX,
    Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { useReportCardSummary } from '../hooks/useAdminAssessment';
import { useAcademicYearList } from '../hooks/useAcademicYearList';
import { ReportCardSummaryItem } from '../types/assessment';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<ReportCardSummaryItem['status'], string> = {
    ready:      'text-green-600 bg-green-50 border-green-200',
    processing: 'text-amber-600 bg-amber-50 border-amber-200',
    pending:    'text-slate-500 bg-slate-100 border-slate-200',
};

const STATUS_LABEL: Record<ReportCardSummaryItem['status'], string> = {
    ready:      'Siap Cetak',
    processing: 'Proses Nilai',
    pending:    'Belum Ada Nilai',
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const PageSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-52" />
        </div>
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full mt-4" />
            </CardHeader>
            <CardContent className="p-0">
                <div className="border-t divide-y divide-slate-50">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-6 py-4">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-2 w-24 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-8 w-28 rounded-lg" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const ReportCardPrint: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const [academicYearFilter, setAcademicYearFilter] = useState<string>('active');

    // Academic years untuk filter dropdown
    const { academicYears, isLoading: isYearsLoading } = useAcademicYearList();

    // Resolve academic year ID — 'active' = tahun aktif
    const activeYear = academicYears.find((y) => y.isActive);
    const selectedYearId = academicYearFilter === 'active'
        ? (activeYear?.id ? Number(activeYear.id) : undefined)
        : (academicYearFilter !== '' ? Number(academicYearFilter) : undefined);

    const { data: items = [], isLoading, isFetching, isError, refetch } = useReportCardSummary({
        academic_year_id: selectedYearId,
    });

    // Client-side search filter
    const filtered = items.filter((item) => {
        if (!searchInput.trim()) return true;
        const q = searchInput.toLowerCase();
        return (
            item.class_name.toLowerCase().includes(q) ||
            item.homeroom_teacher.toLowerCase().includes(q)
        );
    });

    const handlePrint = (item: ReportCardSummaryItem) => {
        if (item.status === 'pending') {
            toast.warning('Nilai belum lengkap. Lengkapi nilai terlebih dahulu.');
            return;
        }
        // TODO: Integrate with PDF generation endpoint when backend ready
        toast.info(`Menyiapkan rapor untuk ${item.class_name}...`);
    };

    if (isLoading || isYearsLoading) return <PageSkeleton />;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Cetak{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Rapor
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Printer className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Generate dan cetak laporan hasil belajar siswa (Rapor).
                    </p>
                </div>
            </div>

            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between">
                    <span>Gagal memuat data rapor.</span>
                    <Button size="sm" variant="ghost" onClick={() => refetch()} className="text-red-700 hover:text-red-900">
                        Coba Lagi
                    </Button>
                </div>
            )}

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                                <Printer className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Daftar Kelas</CardTitle>
                                <CardDescription>Pilih kelas untuk mencetak rapor siswa</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                                {filtered.length} Kelas
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari kelas atau wali kelas..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-9 w-full"
                            />
                        </div>
                        <Select
                            value={academicYearFilter}
                            onValueChange={setAcademicYearFilter}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Tahun Ajaran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Tahun Aktif</SelectItem>
                                {academicYears.map((y) => (
                                    <SelectItem key={y.id} value={String(y.id)}>
                                        {y.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto border-t border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Kelas</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Wali Kelas</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Tahun Ajaran</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Kelengkapan Nilai</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                                {searchInput ? (
                                                    <FilterX className="h-8 w-8 text-slate-300 mb-2" />
                                                ) : (
                                                    <FileX className="h-8 w-8 text-slate-300 mb-2" />
                                                )}
                                                <p className="text-sm text-slate-500">
                                                    {searchInput ? 'Tidak ada hasil' : 'Belum ada kelas untuk tahun ajaran ini'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {searchInput ? 'Coba sesuaikan pencarian' : 'Pilih tahun ajaran lain atau tambah kelas terlebih dahulu'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((item) => {
                                        const pct = item.total_students > 0
                                            ? Math.round((item.students_with_complete_grades / item.total_students) * 100)
                                            : 0;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="group border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                                            >
                                                {/* Kelas */}
                                                <td className="px-6 py-4">
                                                    <div className="h-12 w-12 font-bold text-slate-800 bg-slate-100 flex items-center justify-center rounded-lg border border-slate-200 group-hover:border-blue-200 transition-colors text-sm">
                                                        {item.class_name}
                                                    </div>
                                                </td>
                                                {/* Wali Kelas */}
                                                <td className="px-6 py-4 text-slate-600">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                                                            {item.homeroom_teacher.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="truncate max-w-[140px]">{item.homeroom_teacher}</span>
                                                    </div>
                                                </td>
                                                {/* Tahun Ajaran */}
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="bg-white font-normal text-slate-600">
                                                        {item.academic_year ?? '—'}
                                                    </Badge>
                                                </td>
                                                {/* Progress nilai */}
                                                <td className="px-6 py-4 min-w-[200px]">
                                                    <div className="flex justify-between text-xs mb-1.5">
                                                        <span className="text-slate-500">
                                                            {item.students_with_complete_grades}/{item.total_students} Siswa Lengkap
                                                        </span>
                                                        <span className="font-bold text-slate-700">{pct}%</span>
                                                    </div>
                                                    <Progress value={pct} className="h-2 bg-slate-100" />
                                                </td>
                                                {/* Status */}
                                                <td className="px-6 py-4 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn('text-[10px] font-semibold tracking-wider uppercase', STATUS_STYLE[item.status])}
                                                    >
                                                        {STATUS_LABEL[item.status]}
                                                    </Badge>
                                                </td>
                                                {/* Aksi */}
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        disabled={item.status === 'pending'}
                                                        onClick={() => handlePrint(item)}
                                                        className={cn(
                                                            'shadow-sm font-medium',
                                                            item.status === 'pending'
                                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                                : 'bg-blue-800 hover:bg-blue-900 text-white'
                                                        )}
                                                    >
                                                        <Download className="h-3 w-3 mr-2" />
                                                        {item.status === 'ready' ? 'Unduh PDF' : 'Belum Siap'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
