'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
    ClipboardCheck, Search, TrendingUp, TrendingDown,
    Calendar, FileBarChart, Users, RefreshCw, FilterX, FileX,
    ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { apiClient, PaginatedResponse } from '@/lib/api-client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EkskulAttendanceRecord {
    id: number;
    date: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpa';
    studentName: string | null;
    studentNis: string | null;
    className: string | null;
    ekskulName: string;
    note: string | null;
}

// ─── Service ──────────────────────────────────────────────────────────────────

const fetchEkskulAttendance = (params: { search?: string; page?: number; per_page?: number }) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.page) qs.set('page', String(params.page));
    if (params.per_page) qs.set('per_page', String(params.per_page));
    return apiClient.getRaw<PaginatedResponse<EkskulAttendanceRecord>>(
        `/admin/attendance/extracurricular${qs.toString() ? `?${qs}` : ''}`
    );
};

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
    hadir: 'bg-green-100 text-green-800 border-green-200',
    sakit: 'bg-amber-100 text-amber-800 border-amber-200',
    izin:  'bg-blue-100 text-blue-800 border-blue-200',
    alpa:  'bg-red-100 text-red-800 border-red-200',
};

const STATUS_LABEL: Record<string, string> = {
    hadir: 'Hadir', sakit: 'Sakit', izin: 'Izin', alpa: 'Alpa',
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const AttendanceSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-4 w-52" />
        </div>
        <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Card>
            <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
            <CardContent className="p-0">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-24 ml-auto" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AttendanceRecapPage() {
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(searchInput, 400);

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: ['admin-ekskul-attendance', debouncedSearch, page],
        queryFn: () => fetchEkskulAttendance({ search: debouncedSearch || undefined, page, per_page: 20 }),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    });

    const records = data?.data ?? [];
    const meta = data?.meta;

    // Stats dari data yang ada
    const totalHadir = records.filter((r) => r.status === 'hadir').length;
    const totalRecords = records.length;
    const attendanceRate = totalRecords > 0 ? Math.round((totalHadir / totalRecords) * 100) : 0;

    if (isLoading) return <AttendanceSkeleton />;

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Rekap Presensi{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Ekstrakurikuler
                            </span>
                        </h1>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <ClipboardCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Monitoring kehadiran siswa di seluruh kegiatan ekstrakurikuler.
                    </p>
                </div>
            </div>

            {/* ── Error ── */}
            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                    Gagal memuat data presensi. Silakan coba lagi.
                </div>
            )}

            {/* ── Stats ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Total Record</p>
                            <p className="font-semibold text-slate-900 text-lg">{meta?.total ?? totalRecords}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700 shrink-0">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Hadir (halaman ini)</p>
                            <p className="font-semibold text-slate-900 text-lg">{totalHadir} <span className="text-sm text-slate-400">/ {totalRecords}</span></p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className={cn(
                            'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                            attendanceRate >= 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        )}>
                            <FileBarChart className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Tingkat Kehadiran</p>
                            <p className={cn('font-semibold text-lg', attendanceRate >= 80 ? 'text-green-700' : 'text-amber-700')}>
                                {attendanceRate}%
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Table ── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <ClipboardCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Riwayat Presensi
                                </CardTitle>
                                <CardDescription>
                                    Semua catatan kehadiran ekskul
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && (
                                <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />
                            )}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                                {meta?.total ?? records.length} Record
                            </Badge>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama siswa..."
                                value={searchInput}
                                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-6 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500">Siswa</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500">Ekskul</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500">Tanggal</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 text-center">Status</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    {searchInput
                                                        ? <FilterX className="h-8 w-8 text-slate-300" />
                                                        : <FileX className="h-8 w-8 text-slate-300" />
                                                    }
                                                </div>
                                                <p className="text-slate-500 font-medium">
                                                    {searchInput ? 'Tidak ada hasil' : 'Belum ada data presensi'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((record) => {
                                        const initials = (record.studentName ?? 'SS')
                                            .split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
                                        return (
                                            <tr key={record.id} className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60">
                                                <td className="pl-4 pr-6 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 border border-blue-200 shrink-0">
                                                            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-semibold">
                                                                {initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-semibold text-sm text-slate-900">{record.studentName ?? '—'}</p>
                                                            <p className="text-xs text-slate-400 mt-0.5">{record.className ?? '—'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <Badge className="bg-blue-800 text-white text-xs font-medium">
                                                        {record.ekskulName}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-3.5 text-sm text-slate-600">
                                                    {record.date
                                                        ? new Date(record.date).toLocaleDateString('id-ID', {
                                                            day: '2-digit', month: 'short', year: 'numeric',
                                                        })
                                                        : '—'}
                                                </td>
                                                <td className="px-6 py-3.5 text-center">
                                                    <Badge variant="outline" className={cn('text-xs font-medium', STATUS_STYLE[record.status] ?? '')}>
                                                        {STATUS_LABEL[record.status] ?? record.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-3.5 text-sm text-slate-500">
                                                    {record.note ?? '—'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                            <p className="text-sm text-slate-500">
                                Halaman {meta.current_page} dari {meta.last_page}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={meta.current_page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={meta.current_page >= meta.last_page}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Berikutnya
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
