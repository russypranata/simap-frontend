'use client';

import React, { useState, useEffect, startTransition } from 'react';
import {
    FileBarChart,
    Search,
    ClipboardX,
    BookOpen,
    Sun,
    Moon,
    Dumbbell,
    Filter,
    Calendar,
    RotateCcw,
    Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';

import {
    PageHeader,
    FilterButton,
    ActiveFilterBadges,
    EmptyState,
    ErrorState,
    PaginationControls,
} from '@/features/shared/components';
import { SkeletonTableRow } from '@/features/shared/components/SkeletonBlocks';

import {
    useDailyAttendance,
    useMorningAttendance,
    usePrayerAttendance,
    useEkskulAttendance,
} from '../hooks/useAdminAttendance';
import { classService } from '../services/classService';
import type { AttendanceTab, AttendanceFilters } from '../types/attendance';

const today = new Date().toISOString().split('T')[0];
const currentMonth = today.slice(0, 7);

const TABS: { key: AttendanceTab; label: string; icon: React.ElementType; description: string }[] = [
    { key: 'daily',           label: 'Mata Pelajaran',    icon: BookOpen, description: 'Presensi per sesi mata pelajaran' },
    { key: 'morning',         label: 'Keterlambatan Pagi', icon: Sun,      description: 'Siswa yang terlambat masuk' },
    { key: 'prayer',          label: 'Sholat Berjamaah',  icon: Moon,     description: 'Presensi sholat wajib' },
    { key: 'extracurricular', label: 'Ekstrakurikuler',   icon: Dumbbell, description: 'Presensi kegiatan ekskul' },
];

const STATUS_COLORS: Record<string, string> = {
    present:      'text-green-700 bg-green-50 border-green-200',
    excused:      'text-blue-700 bg-blue-50 border-blue-200',
    absent:       'text-red-700 bg-red-50 border-red-200',
    late:         'text-amber-700 bg-amber-50 border-amber-200',
    hadir:        'text-green-700 bg-green-50 border-green-200',
    alpa:         'text-red-700 bg-red-50 border-red-200',
    hadir_sholat: 'text-green-700 bg-green-50 border-green-200',
    tidak_hadir:  'text-red-700 bg-red-50 border-red-200',
};

const STATUS_LABELS: Record<string, string> = {
    present:      'Hadir',
    excused:      'Izin/Sakit',
    absent:       'Alpha',
    late:         'Terlambat',
    hadir:        'Hadir',
    alpa:         'Alpha',
    hadir_sholat: 'Hadir',
    tidak_hadir:  'Tidak Hadir',
};

const PRAYER_TIMES = [
    { value: 'subuh',   label: 'Subuh' },
    { value: 'dzuhur',  label: 'Dzuhur' },
    { value: 'ashar',   label: 'Ashar' },
    { value: 'maghrib', label: 'Maghrib' },
    { value: 'isya',    label: 'Isya' },
];

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

const formatDate = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

export const AttendanceReport: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AttendanceTab>('daily');
    const [filterMode, setFilterMode] = useState<'date' | 'month'>('date');
    const [filters, setFilters] = useState<AttendanceFilters>({ page: 1, per_page: 10, date: today });

    // Modal filter state (temp = belum diterapkan)
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tempClassId, setTempClassId]       = useState<string>('all');
    const [tempStatus, setTempStatus]         = useState<string>('all');
    const [tempPrayerTime, setTempPrayerTime] = useState<string>('all');
    const [tempDate, setTempDate]             = useState<string>(today);
    const [tempMonth, setTempMonth]           = useState<string>(currentMonth);
    const [tempFilterMode, setTempFilterMode] = useState<'date' | 'month'>('date');

    const openFilter = () => {
        setTempClassId(filters.class_id ?? 'all');
        setTempStatus(filters.status ?? 'all');
        setTempPrayerTime(filters.prayer_time ?? 'all');
        setTempDate(filters.date ?? today);
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
            prayer_time: tempPrayerTime !== 'all' ? tempPrayerTime : undefined,
        });
        setIsFilterOpen(false);
    };

    const resetTemp = () => {
        setTempClassId('all');
        setTempStatus('all');
        setTempPrayerTime('all');
        setTempDate(today);
        setTempMonth(currentMonth);
        setTempFilterMode('date');
    };

    const updatePage = (page: number) => setFilters(prev => ({ ...prev, page }));
    const updatePerPage = (per_page: number) => setFilters(prev => ({ ...prev, per_page, page: 1 }));

    // Reset filter saat ganti tab
    useEffect(() => {
        startTransition(() => {
            setFilters({ page: 1, per_page: 10, date: today });
            setFilterMode('date');
            setTempClassId('all');
            setTempStatus('all');
            setTempPrayerTime('all');
        });
    }, [activeTab]);

    const { data: classes = [] } = useQuery({
        queryKey: ['admin-classes-dropdown'],
        queryFn: () => classService.getClasses(),
        staleTime: 10 * 60 * 1000,
    });

    const dailyQuery   = useDailyAttendance(activeTab === 'daily'           ? filters : { page: 1, per_page: 1 });
    const morningQuery = useMorningAttendance(activeTab === 'morning'        ? filters : { page: 1, per_page: 1 });
    const prayerQuery  = usePrayerAttendance(activeTab === 'prayer'          ? filters : { page: 1, per_page: 1 });
    const ekskulQuery  = useEkskulAttendance(activeTab === 'extracurricular' ? filters : { page: 1, per_page: 1 });

    const activeQuery = { daily: dailyQuery, morning: morningQuery, prayer: prayerQuery, extracurricular: ekskulQuery }[activeTab];
    const { data: pageData, isLoading, isError, refetch, error } = activeQuery;

    const items      = pageData?.data ?? [];
    const meta       = pageData?.meta;
    const totalItems = meta?.total ?? 0;
    const totalPages = meta?.last_page ?? 1;
    const startIndex = totalItems === 0 ? 0 : ((filters.page ?? 1) - 1) * (filters.per_page ?? 10) + 1;
    const endIndex   = Math.min((filters.page ?? 1) * (filters.per_page ?? 10), totalItems);

    const activeTabInfo = TABS.find(t => t.key === activeTab)!;
    const ActiveIcon = activeTabInfo.icon;

    // Hitung active filter count untuk badge
    const activeFilterCount =
        (filters.class_id ? 1 : 0) +
        (filters.status ? 1 : 0) +
        (filters.prayer_time ? 1 : 0) +
        (filterMode === 'month' ? 1 : 0);

    // Active filter badges
    const activeBadges = [
        ...(filters.class_id ? [{
            key: 'class',
            label: classes.find(c => String(c.id) === filters.class_id)?.name ?? `Kelas ${filters.class_id}`,
            icon: BookOpen,
            onRemove: () => setFilters(prev => ({ ...prev, class_id: undefined, page: 1 })),
        }] : []),
        ...(filters.status ? [{
            key: 'status',
            label: STATUS_LABELS[filters.status] ?? filters.status,
            icon: Filter,
            onRemove: () => setFilters(prev => ({ ...prev, status: undefined, page: 1 })),
        }] : []),
        ...(filters.prayer_time ? [{
            key: 'prayer_time',
            label: PRAYER_TIMES.find(p => p.value === filters.prayer_time)?.label ?? filters.prayer_time,
            icon: Moon,
            onRemove: () => setFilters(prev => ({ ...prev, prayer_time: undefined, page: 1 })),
        }] : []),
        ...(filterMode === 'month' ? [{
            key: 'period',
            label: MONTH_OPTIONS.find(m => m.value === filters.date)?.label ?? filters.date ?? '',
            icon: Calendar,
            onRemove: () => {
                setFilterMode('date');
                setFilters(prev => ({ ...prev, date: today, page: 1 }));
            },
        }] : []),
    ];

    return (
        <div className="space-y-6">
            {/* ── Page Header ── */}
            <PageHeader
                title="Laporan"
                titleHighlight="Presensi"
                icon={FileBarChart}
                description="Arsip dan rekap data presensi siswa"
            >
                {/* Search inline */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Cari nama siswa..."
                        value={filters.search ?? ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value || undefined, page: 1 }))}
                        className="pl-9 h-9 w-[220px] bg-white border-slate-200 shadow-sm"
                    />
                </div>

                {/* Filter Button + Modal */}
                <Dialog open={isFilterOpen} onOpenChange={(open) => { if (open) openFilter(); else setIsFilterOpen(false); }}>
                    <DialogTrigger asChild>
                        <FilterButton activeCount={activeFilterCount} />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[440px] rounded-2xl">
                        <DialogHeader className="flex-row items-center gap-4">
                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                <Filter className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-slate-900">Filter Presensi</DialogTitle>
                                <DialogDescription className="text-slate-500">
                                    Sesuaikan periode, kelas, dan status
                                </DialogDescription>
                            </div>
                        </DialogHeader>

                        <div className="grid gap-5 py-4">
                            {/* Periode */}
                            {activeTab !== 'extracurricular' && (
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
                            )}

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

                            {/* Status (daily) */}
                            {activeTab === 'daily' && (
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
                                            <SelectItem value="late" className="text-sm">Terlambat</SelectItem>
                                            <SelectItem value="excused" className="text-sm">Izin/Sakit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Status + Waktu Sholat (prayer) */}
                            {activeTab === 'prayer' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <Filter className="h-4 w-4 text-slate-400" />
                                            Status
                                        </label>
                                        <Select value={tempStatus} onValueChange={setTempStatus}>
                                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 text-sm">
                                                <SelectValue placeholder="Semua" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all" className="text-sm">Semua</SelectItem>
                                                <SelectItem value="hadir" className="text-sm">Hadir</SelectItem>
                                                <SelectItem value="alpa" className="text-sm">Alpha</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <Moon className="h-4 w-4 text-slate-400" />
                                            Waktu Sholat
                                        </label>
                                        <Select value={tempPrayerTime} onValueChange={setTempPrayerTime}>
                                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 text-sm">
                                                <SelectValue placeholder="Semua" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all" className="text-sm">Semua</SelectItem>
                                                {PRAYER_TIMES.map((pt) => (
                                                    <SelectItem key={pt.value} value={pt.value} className="text-sm">{pt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                            <Button
                                variant="ghost"
                                onClick={resetTemp}
                                className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Reset Pilihan
                            </Button>
                            <Button
                                className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2"
                                onClick={applyFilter}
                            >
                                <Check className="h-4 w-4" />
                                Terapkan
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            {/* ── Active Filter Badges ── */}
            <ActiveFilterBadges
                badges={activeBadges}
                onClearAll={() => {
                    setFilterMode('date');
                    setFilters({ page: 1, per_page: filters.per_page, date: today });
                }}
            />

            {/* ── Tab Navigation ── */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit flex-wrap">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                                isActive
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            )}
                        >
                            <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-blue-700' : '')} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── Main Card ── */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ActiveIcon className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-gray-900">{activeTabInfo.label}</CardTitle>
                                <CardDescription>{activeTabInfo.description}</CardDescription>
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
                                error={(error as Error)?.message || 'Gagal memuat data presensi.'}
                                onRetry={refetch}
                            />
                        </div>
                    ) : (
                        <div className="border-t border-slate-200 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Nama Siswa</th>
                                        <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">NIS</th>
                                        <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Kelas</th>
                                        {activeTab === 'daily' && (
                                            <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Mata Pelajaran</th>
                                        )}
                                        {activeTab === 'morning' && (<>
                                            <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Waktu</th>
                                            <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Lokasi</th>
                                            <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Dicatat Oleh</th>
                                        </>)}
                                        {activeTab === 'prayer' && (<>
                                            <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Waktu Sholat</th>
                                            <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Lokasi</th>
                                        </>)}
                                        {activeTab === 'extracurricular' && (
                                            <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Ekskul</th>
                                        )}
                                        <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Tanggal</th>
                                        {activeTab !== 'morning' && (
                                            <th className="px-4 py-4 text-center font-semibold text-xs text-slate-600 uppercase tracking-wider">Status</th>
                                        )}
                                        <th className="px-4 py-4 text-left font-semibold text-xs text-slate-600 uppercase tracking-wider">Catatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        Array.from({ length: filters.per_page ?? 10 }).map((_, i) => (
                                            <SkeletonTableRow key={i} cols={activeTab === 'morning' ? 8 : 7} />
                                        ))
                                    ) : items.length === 0 ? (
                                        <tr>
                                            <td colSpan={10}>
                                                <EmptyState
                                                    icon={ClipboardX}
                                                    title="Belum ada data"
                                                    description={`Belum ada data ${activeTabInfo.label.toLowerCase()} untuk periode ini.`}
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item) => (
                                            <tr key={item.id} className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60">
                                                <td className="px-4 py-4">
                                                    <span className="font-medium text-slate-900">{item.studentName ?? '—'}</span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-xs font-mono text-slate-500">{item.studentNis ?? '—'}</span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {item.className
                                                        ? <Badge className="bg-blue-800 text-white text-xs font-medium">{item.className}</Badge>
                                                        : <span className="text-sm text-slate-400">—</span>}
                                                </td>
                                                {activeTab === 'daily' && (
                                                    <td className="px-4 py-3 text-sm text-slate-700">
                                                        {'subjectName' in item ? (item.subjectName ?? '—') : '—'}
                                                    </td>
                                                )}
                                                {activeTab === 'morning' && (<>
                                                    <td className="px-4 py-4">
                                                        <span className="text-xs font-mono text-slate-500">{'time' in item ? (item.time ?? '—') : '—'}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">{'location' in item ? (item.location ?? '—') : '—'}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">{'recordedBy' in item ? (item.recordedBy ?? '—') : '—'}</td>
                                                </>)}
                                                {activeTab === 'prayer' && (<>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm text-slate-700 capitalize">{'prayerTime' in item ? (item.prayerTime ?? '—') : '—'}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">{'location' in item ? (item.location ?? '—') : '—'}</td>
                                                </>)}
                                                {activeTab === 'extracurricular' && (
                                                    <td className="px-4 py-3 text-sm text-slate-700">{'ekskulName' in item ? item.ekskulName : '—'}</td>
                                                )}
                                                <td className="px-4 py-4">
                                                    <span className="text-xs text-slate-500 whitespace-nowrap">
                                                        {item.date ? formatDate(item.date) : '—'}
                                                    </span>
                                                </td>
                                                {activeTab !== 'morning' && (
                                                    <td className="px-4 py-3 text-center">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                'text-xs font-medium',
                                                                STATUS_COLORS[item.status] ?? 'text-slate-600 bg-slate-50 border-slate-200'
                                                            )}
                                                        >
                                                            {STATUS_LABELS[item.status] ?? item.status}
                                                        </Badge>
                                                    </td>
                                                )}
                                                <td className="px-4 py-3 max-w-[180px]">
                                                    <span className="text-xs text-slate-400 truncate block">
                                                        {('notes' in item ? item.notes : null) ?? ('note' in item ? item.note : null) ?? '—'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {!isLoading && totalItems > 0 && (
                                <div className="border-t border-slate-100">
                                    <PaginationControls
                                        currentPage={filters.page ?? 1}
                                        totalPages={totalPages}
                                        totalItems={totalItems}
                                        startIndex={startIndex}
                                        endIndex={endIndex}
                                        itemsPerPage={filters.per_page ?? 10}
                                        itemLabel="data"
                                        onPageChange={updatePage}
                                        onItemsPerPageChange={updatePerPage}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
