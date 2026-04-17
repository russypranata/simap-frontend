'use client';

import React, { useState, startTransition } from 'react';
import {
    Award,
    Search,
    Filter,
    Calendar,
    RotateCcw,
    Check,
    ClipboardX,
    BookOpen,
    Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogTrigger, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import {
    PageHeader,
    FilterButton,
    EmptyState,
    ErrorState,
    PaginationControls,
} from '@/features/shared/components';
import { SkeletonTableRow } from '@/features/shared/components/SkeletonBlocks';
import { useEkskulAttendance } from '../hooks/useAdminAttendance';
import { classService } from '../services/classService';
import type { AttendanceFilters } from '../types/attendance';

const today = new Date().toISOString().split('T')[0];
const currentMonth = today.slice(0, 7);

const STATUS_COLORS: Record<string, string> = {
    present: 'text-green-700 bg-green-50 border-green-200',
    hadir:   'text-green-700 bg-green-50 border-green-200',
    absent:  'text-red-700 bg-red-50 border-red-200',
    alpa:    'text-red-700 bg-red-50 border-red-200',
    late:    'text-amber-700 bg-amber-50 border-amber-200',
    excused: 'text-blue-700 bg-blue-50 border-blue-200',
    izin:    'text-blue-700 bg-blue-50 border-blue-200',
    sakit:   'text-blue-700 bg-blue-50 border-blue-200',
};

const STATUS_LABELS: Record<string, string> = {
    present: 'Hadir',
    hadir:   'Hadir',
    absent:  'Alpha',
    alpa:    'Alpha',
    late:    'Terlambat',
    excused: 'Izin/Sakit',
    izin:    'Izin',
    sakit:   'Sakit',
};

const generateMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        months.push({ value, label });
    }
    return months;
};

const MONTH_OPTIONS = generateMonthOptions();

export const EkskulAttendanceRecap: React.FC = () => {
    const [filterMode, setFilterMode] = useState<'date' | 'month'>('month');
    const [filters, setFilters] = useState<AttendanceFilters>({
        page: 1,
        per_page: 15,
        date: currentMonth,
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempClassId, setTempClassId]   = useState<string>('all');
    const [tempStatus, setTempStatus]     = useState<string>('all');
    const [tempDate, setTempDate]         = useState<string>(today);
    const [tempMonth, setTempMonth]       = useState<string>(currentMonth);
    const [tempFilterMode, setTempFilterMode] = useState<'date' | 'month'>('month');

    const openFilter = () => {
        setTempClassId(filters.class_id ?? 'all');
        setTempStatus(filters.status ?? 'all');
        setTempDate(filterMode === 'date' ? (filters.date ?? today) : today);
        setTempMonth(filterMode === 'month' ? (filters.date ?? currentMonth) : currentMonth);
        setTempFilterMode(filterMode);
        setIsFilterOpen(true);
    };

    const applyFilter = () => {
        const newDate = tempFilterMode === 'date' ? tempDate : tempMonth;
        setFilterMode(tempFilterMode);
        setFilters({
            page: 1,
            per_page: filters.per_page,
            date: newDate,
            class_id: tempClassId !== 'all' ? tempClassId : undefined,
            status: tempStatus !== 'all' ? tempStatus : undefined,
        });
        setIsFilterOpen(false);
    };

    const resetTemp = () => {
        setTempClassId('all');
        setTempStatus('all');
        setTempDate(today);
        setTempMonth(currentMonth);
        setTempFilterMode('month');
    };

    const { data: classes = [] } = useQuery({
        queryKey: ['admin-classes-dropdown'],
        queryFn: () => classService.getClasses(),
        staleTime: 10 * 60 * 1000,
    });

    const { data: pageData, isLoading, isError, refetch, error } = useEkskulAttendance(filters);

    const items      = pageData?.data ?? [];
    const meta       = pageData?.meta;
    const totalItems = meta?.total ?? 0;

    const activeFilterCount =
        (filters.class_id ? 1 : 0) +
        (filters.status ? 1 : 0) +
        (filterMode === 'date' ? 1 : 0);

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '—';
        try {
            return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
                day: '2-digit', month: 'short', year: 'numeric',
            });
        } catch { return dateStr; }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Rekap Presensi"
                titleHighlight="Ekskul"
                icon={Award}
                description="Rekap kehadiran siswa pada kegiatan ekstrakurikuler"
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Cari nama siswa..."
                        value={filters.search ?? ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value || undefined, page: 1 }))}
                        className="pl-9 h-9 w-[220px] bg-white border-slate-200 shadow-sm"
                    />
                </div>

                <Dialog open={isFilterOpen} onOpenChange={(open) => { if (open) openFilter(); else setIsFilterOpen(false); }}>
                    <DialogTrigger asChild>
                        <FilterButton activeCount={activeFilterCount} />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px] rounded-2xl">
                        <DialogHeader className="flex-row items-center gap-4">
                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                <Filter className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-slate-900">Filter Presensi Ekskul</DialogTitle>
                                <DialogDescription className="text-slate-500">Sesuaikan periode, kelas, dan status</DialogDescription>
                            </div>
                        </DialogHeader>

                        <div className="grid gap-5 py-4">
                            {/* Periode */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    Periode
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                                        {(['date', 'month'] as const).map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => setTempFilterMode(mode)}
                                                className={cn(
                                                    'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                                                    tempFilterMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                                                )}
                                            >
                                                {mode === 'date' ? 'Harian' : 'Bulanan'}
                                            </button>
                                        ))}
                                    </div>
                                    {tempFilterMode === 'date' ? (
                                        <Input
                                            type="date"
                                            value={tempDate}
                                            onChange={(e) => setTempDate(e.target.value)}
                                            className="flex-1 h-9 bg-slate-50/50 border-slate-200 text-sm"
                                        />
                                    ) : (
                                        <Select value={tempMonth} onValueChange={setTempMonth}>
                                            <SelectTrigger className="flex-1 h-9 bg-slate-50/50 border-slate-200 text-sm">
                                                <SelectValue placeholder="Pilih Bulan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {MONTH_OPTIONS.map((m) => (
                                                    <SelectItem key={m.value} value={m.value} className="text-sm">{m.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>

                            {/* Kelas */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-slate-400" />
                                    Kelas
                                </label>
                                <Select value={tempClassId} onValueChange={setTempClassId}>
                                    <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 text-sm">
                                        <SelectValue placeholder="Semua Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all" className="text-sm">Semua Kelas</SelectItem>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={String(cls.id)} className="text-sm">{cls.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-slate-400" />
                                    Status Kehadiran
                                </label>
                                <Select value={tempStatus} onValueChange={setTempStatus}>
                                    <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 text-sm">
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all" className="text-sm">Semua Status</SelectItem>
                                        <SelectItem value="present" className="text-sm">Hadir</SelectItem>
                                        <SelectItem value="absent" className="text-sm">Alpha</SelectItem>
                                        <SelectItem value="excused" className="text-sm">Izin/Sakit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                            <Button variant="ghost" onClick={resetTemp} className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2">
                                <RotateCcw className="h-4 w-4" />
                                Reset
                            </Button>
                            <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2" onClick={applyFilter}>
                                <Check className="h-4 w-4" />
                                Terapkan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            {/* Active filter info */}
            {(filters.class_id || filters.status || filterMode === 'date') && (
                <div className="flex items-center gap-2 flex-wrap">
                    {filters.class_id && (
                        <Badge variant="outline" className="gap-1.5 text-xs bg-white">
                            <BookOpen className="h-3 w-3" />
                            {classes.find(c => String(c.id) === filters.class_id)?.name ?? `Kelas ${filters.class_id}`}
                            <button onClick={() => setFilters(prev => ({ ...prev, class_id: undefined, page: 1 }))} className="ml-1 hover:text-red-500">×</button>
                        </Badge>
                    )}
                    {filters.status && (
                        <Badge variant="outline" className="gap-1.5 text-xs bg-white">
                            {STATUS_LABELS[filters.status] ?? filters.status}
                            <button onClick={() => setFilters(prev => ({ ...prev, status: undefined, page: 1 }))} className="ml-1 hover:text-red-500">×</button>
                        </Badge>
                    )}
                    {filterMode === 'date' && (
                        <Badge variant="outline" className="gap-1.5 text-xs bg-white">
                            <Calendar className="h-3 w-3" />
                            {formatDate(filters.date)}
                            <button onClick={() => { setFilterMode('month'); setFilters(prev => ({ ...prev, date: currentMonth, page: 1 })); }} className="ml-1 hover:text-red-500">×</button>
                        </Badge>
                    )}
                    <button
                        onClick={() => { setFilterMode('month'); setFilters({ page: 1, per_page: filters.per_page, date: currentMonth }); }}
                        className="text-xs text-slate-400 hover:text-red-500 underline"
                    >
                        Reset semua
                    </button>
                </div>
            )}

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Award className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-gray-900">Rekap Presensi Ekskul</CardTitle>
                                <CardDescription>
                                    {filterMode === 'month'
                                        ? MONTH_OPTIONS.find(m => m.value === filters.date)?.label ?? filters.date
                                        : formatDate(filters.date)}
                                </CardDescription>
                            </div>
                        </div>
                        {totalItems > 0 && !isLoading && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                                {totalItems.toLocaleString('id-ID')} data
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {isError ? (
                        <div className="p-8">
                            <ErrorState
                                error={(error as Error)?.message || 'Gagal memuat data presensi ekskul.'}
                                onRetry={refetch}
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Nama Siswa</th>
                                        <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">NIS</th>
                                        <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Kelas</th>
                                        <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Ekskul</th>
                                        <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-4 py-4 text-center font-semibold text-xs text-slate-600 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Catatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        Array.from({ length: filters.per_page ?? 15 }).map((_, i) => (
                                            <SkeletonTableRow key={i} cols={7} />
                                        ))
                                    ) : items.length === 0 ? (
                                        <tr>
                                            <td colSpan={7}>
                                                <EmptyState
                                                    icon={ClipboardX}
                                                    title="Belum ada data"
                                                    description="Belum ada data presensi ekskul untuk periode ini."
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item) => (
                                            <tr key={item.id} className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60">
                                                <td className="px-4 py-4">
                                                    <span className="text-sm font-medium text-slate-800">{item.studentName ?? '—'}</span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-xs font-mono text-slate-400">{item.studentNis ?? '—'}</span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {item.className
                                                        ? <Badge variant="outline" className="text-xs font-medium text-slate-600 border-slate-200 bg-slate-50">{item.className}</Badge>
                                                        : <span className="text-slate-400 text-xs">—</span>}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <Award className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                                                        <span className="text-sm text-slate-700">{item.ekskulName ?? '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-sm text-slate-600">{formatDate(item.date)}</span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn('text-xs font-medium', STATUS_COLORS[item.status] ?? 'text-slate-600 bg-slate-50 border-slate-200')}
                                                    >
                                                        {STATUS_LABELS[item.status] ?? item.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-sm text-slate-500">{item.note ?? '—'}</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {meta && meta.last_page > 1 && (
                        <PaginationControls
                            currentPage={meta.current_page}
                            totalPages={meta.last_page}
                            totalItems={meta.total}
                            startIndex={((filters.page ?? 1) - 1) * (filters.per_page ?? 15) + 1}
                            endIndex={Math.min((filters.page ?? 1) * (filters.per_page ?? 15), meta.total)}
                            itemsPerPage={filters.per_page ?? 15}
                            itemLabel="data"
                            onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
                            onItemsPerPageChange={(per_page) => setFilters(prev => ({ ...prev, per_page, page: 1 }))}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
