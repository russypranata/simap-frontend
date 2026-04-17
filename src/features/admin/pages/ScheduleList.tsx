'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Calendar,
    Search,
    Plus,
    Clock,
    User,
    Trash2,
    Edit,
    BookOpen,
    Grid3X3,
    List,
    CalendarPlus,
    GraduationCap,
    BarChart3,
    RefreshCw,
    X,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Types & Services
import { DayOfWeek, Schedule, DAY_MAP } from '../types/schedule';

// Components
import { ScheduleForm } from '../components/forms/ScheduleForm';
import { ScheduleFormValues } from '../schemas/scheduleSchema';
import { ScheduleListSkeleton } from '../components/schedule/ScheduleListSkeleton';
import { timeSlotService, TimeSlot } from '../services/timeSlotService';
import { StatCard, EmptyState } from '@/features/shared/components';
import { useScheduleList } from '../hooks/useScheduleList';
import { useBreadcrumbAction } from '@/context/BreadcrumbActionContext';

type ViewMode = 'timetable' | 'table';

export const ScheduleList: React.FC = () => {
    const { setAction, clearAction } = useBreadcrumbAction();

    const {
        schedules: data,
        isLoading,
        isFetching,
        isDeleting,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        deleteBulk,
    } = useScheduleList();

    // View Mode State
    const [viewMode, setViewMode] = useState<ViewMode>('timetable');

    // Filter State
    const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Senin');
    const [searchTerm, setSearchTerm] = useState('');

    // Selection State
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);

    // Time slots per day (dari API)
    const [dayTimeSlots, setDayTimeSlots] = useState<TimeSlot[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(true);

    const days: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // isFetching indicator di breadcrumb
    React.useEffect(() => {
        if (isFetching) {
            setAction(
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden sm:inline">Memperbarui...</span>
                </div>
            );
        } else {
            clearAction();
        }
        return () => clearAction();
    }, [isFetching, setAction, clearAction]);

    // Fetch time slots when day changes
    useEffect(() => {
        const dayKey = DAY_MAP[selectedDay];
        setIsLoadingSlots(true);
        timeSlotService.getByDay(dayKey).then(slots => {
            setDayTimeSlots(slots);
            setIsLoadingSlots(false);
        });
    }, [selectedDay]);

    // Filter Logic
    const filteredData = data.filter((item) => {
        const matchesDay = item.day === selectedDay;
        const matchesSearch = !searchTerm ||
            item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.teacherName ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDay && matchesSearch;
    });

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;
        setIsBulkDelete(true);
    };

    // CRUD Handlers
    const handleCreate = async (values: ScheduleFormValues) => {
        await createSchedule(values);
    };

    const handleUpdate = async (values: ScheduleFormValues) => {
        if (!editingId) return;
        await updateSchedule(editingId, values);
        setEditingId(null);
    };

    const handleDelete = async () => {
        if (!deleteId && !isBulkDelete) return;
        try {
            if (isBulkDelete) {
                await deleteBulk(selectedItems);
                setSelectedItems([]);
            } else if (deleteId) {
                await deleteSchedule(deleteId);
            }
        } finally {
            setDeleteId(null);
            setIsBulkDelete(false);
        }
    };

    const openEdit = (item: Schedule) => {
        setEditingId(item.id);
        setIsFormOpen(true);
    };

    // Stats
    const stats = useMemo(() => {
        const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
        const now = new Date();
        const todayName = dayNames[now.getDay() - 1] ?? '';
        const lessons = data.filter(d => d.type !== 'break' && d.type !== 'ceremony');
        return {
            totalLessons: lessons.length,
            uniqueSubjects: new Set(lessons.map(d => d.subjectName)).size,
            todayLessons: lessons.filter(d => d.day === todayName).length,
            todayName,
        };
    }, [data]);

    // Render Loading
    if (isLoading) {
        return <ScheduleListSkeleton />;
    }

    // Render Content
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Jadwal{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Pelajaran
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola jadwal mata pelajaran per kelas dan guru.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                        className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Buat Jadwal
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Total Jam Pelajaran"
                    value={stats.totalLessons}
                    unit="JP / minggu"
                    subtitle="Seluruh hari Senin–Jumat"
                    icon={BookOpen}
                    color="blue"
                />
                <StatCard
                    title="Mata Pelajaran"
                    value={stats.uniqueSubjects}
                    unit="mapel"
                    subtitle="Jumlah mapel unik"
                    icon={GraduationCap}
                    color="amber"
                />
                <StatCard
                    title="Hari Ini"
                    value={stats.todayLessons}
                    unit="JP"
                    subtitle={stats.todayName ? `Jadwal ${stats.todayName}` : 'Hari libur'}
                    icon={BarChart3}
                    color="emerald"
                />
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                <Clock className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    Daftar Jadwal
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-600">
                                    Pantau distribusi mata pelajaran di seluruh kelas.
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* View Mode Toggle */}
                            <TooltipProvider>
                                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant={viewMode === 'timetable' ? 'default' : 'ghost'}
                                                size="sm"
                                                className={cn(
                                                    "h-8 w-8 p-0",
                                                    viewMode === 'timetable' 
                                                        ? "bg-blue-800 hover:bg-blue-900 text-white" 
                                                        : "hover:bg-slate-100 text-slate-600"
                                                )}
                                                onClick={() => setViewMode('timetable')}
                                            >
                                                <Grid3X3 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Tampilan Roster</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant={viewMode === 'table' ? 'default' : 'ghost'}
                                                size="sm"
                                                className={cn(
                                                    "h-8 w-8 p-0",
                                                    viewMode === 'table' 
                                                        ? "bg-blue-800 hover:bg-blue-900 text-white" 
                                                        : "hover:bg-slate-100 text-slate-600"
                                                )}
                                                onClick={() => setViewMode('table')}
                                            >
                                                <List className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Tampilan Tabel</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </TooltipProvider>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                {filteredData.length} Data
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari mapel, kelas, atau guru..."
                                className="pl-9 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Tabs for Days */}
                    <Tabs value={selectedDay} onValueChange={(value) => setSelectedDay(value as DayOfWeek)} className="w-full">
                        <div className="px-6 pt-4">
                            <TabsList className="grid w-full grid-cols-5 h-9">
                                {days.slice(0, 5).map((day) => (
                                    <TabsTrigger key={day} value={day} className="text-xs uppercase tracking-wider data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                                        {day}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {days.slice(0, 5).map((day) => (
                            <TabsContent key={day} value={day} className="mt-0">
                                {(() => {
                                    const daySchedules = data.filter(item => item.day === day);
                                    
                                    // Apply search filter
                                    const filteredSchedules = daySchedules.filter(item =>
                                        !searchTerm ||
                                        item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        item.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
                                    );

                                    const lessonSlots = dayTimeSlots.filter((s: TimeSlot) => s.type === 'lesson');
                                    void lessonSlots; // used for reference only
                                    // Get all slots for timetable view (including breaks)
                                    const allSlots = dayTimeSlots;

                                    // ========== TIMETABLE VIEW ==========
                                    if (viewMode === 'timetable') {
                                        const uniqueClasses = Array.from(
                                            new Map(
                                                daySchedules
                                                    .filter(s => s.classId && s.className)
                                                    .map(s => [s.classId, { id: s.classId!, name: s.className }])
                                            ).values()
                                        ).sort((a, b) => a.name.localeCompare(b.name));

                                        if (uniqueClasses.length === 0) {
                                            return (
                                                <EmptyState
                                                    icon={searchTerm ? FilterX : Calendar}
                                                    title={searchTerm ? 'Tidak ada jadwal yang cocok' : `Belum ada jadwal untuk ${day}`}
                                                    description={searchTerm ? 'Coba ubah kata kunci pencarian.' : 'Klik "Buat Jadwal" untuk mulai menambahkan jadwal pelajaran.'}
                                                    className="py-16"
                                                >
                                                    {!searchTerm && (
                                                        <Button
                                                            className="mt-4 bg-blue-800 hover:bg-blue-900 text-white"
                                                            onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                                                        >
                                                            <CalendarPlus className="h-4 w-4 mr-2" />
                                                            Buat Jadwal
                                                        </Button>
                                                    )}
                                                </EmptyState>
                                            );
                                        }

                                        const colCount = uniqueClasses.length;
                                        const timeColWidth = 110;
                                        const cellMinWidth = 140;
                                        const gridStyle = {
                                            display: 'grid',
                                            gridTemplateColumns: `${timeColWidth}px repeat(${colCount}, minmax(${cellMinWidth}px, 1fr))`,
                                            gap: '8px',
                                        } as React.CSSProperties;

                                        const getSubjectFlatColor = (name: string): string => {
                                            const map: Record<string, string> = {
                                                Matematika: 'bg-blue-100 text-blue-800',
                                                Fisika: 'bg-yellow-100 text-yellow-800',
                                                Kimia: 'bg-purple-100 text-purple-800',
                                                Biologi: 'bg-emerald-100 text-emerald-800',
                                                'Bahasa Indonesia': 'bg-orange-100 text-orange-800',
                                                'Bahasa Inggris': 'bg-pink-100 text-pink-800',
                                                Sejarah: 'bg-amber-100 text-amber-800',
                                                PKn: 'bg-red-100 text-red-800',
                                                PJOK: 'bg-lime-100 text-lime-800',
                                                'Seni Budaya': 'bg-fuchsia-100 text-fuchsia-800',
                                                BK: 'bg-slate-100 text-slate-800',
                                                'Pendidikan Agama': 'bg-teal-100 text-teal-800',
                                                TIK: 'bg-indigo-100 text-indigo-800',
                                                Prakarya: 'bg-cyan-100 text-cyan-800',
                                            };
                                            if (map[name]) return map[name];
                                            const palette = [
                                                'bg-red-100 text-red-800', 'bg-yellow-100 text-yellow-800',
                                                'bg-cyan-100 text-cyan-800', 'bg-indigo-100 text-indigo-800',
                                                'bg-rose-100 text-rose-800', 'bg-teal-100 text-teal-800',
                                                'bg-violet-100 text-violet-800', 'bg-amber-100 text-amber-800',
                                                'bg-sky-100 text-sky-800', 'bg-lime-100 text-lime-800',
                                            ];
                                            let hash = 0;
                                            for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
                                            return palette[Math.abs(hash) % palette.length];
                                        };

                                        return (
                                            <div className="overflow-x-auto p-4">
                                                <div className="space-y-2" style={{ minWidth: `${timeColWidth + colCount * cellMinWidth + (colCount + 1) * 8}px` }}>

                                                    {/* Header */}
                                                    <div style={gridStyle}>
                                                        <div className="text-xs font-semibold p-2.5 bg-muted rounded-lg text-center text-muted-foreground uppercase tracking-wider">
                                                            Waktu
                                                        </div>
                                                        {uniqueClasses.map(cls => (
                                                            <div key={cls.id} className="text-xs font-semibold p-2.5 bg-muted rounded-lg text-center text-muted-foreground uppercase tracking-wider truncate">
                                                                {cls.name}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Skeleton rows saat time slots belum tersedia */}
                                                    {isLoadingSlots && Array.from({ length: 8 }).map((_, i) => (
                                                        <div key={i} style={gridStyle}>
                                                            <div className="h-[80px] rounded-lg bg-slate-200 animate-pulse" />
                                                            {uniqueClasses.map((cls) => (
                                                                (i + cls.id.charCodeAt(0)) % 3 === 0
                                                                    ? <div key={cls.id} className="h-[80px] rounded-lg bg-slate-200 animate-pulse" />
                                                                    : <div key={cls.id} className="h-[80px] rounded-lg border border-dashed border-slate-200 bg-muted/20" />
                                                            ))}
                                                        </div>
                                                    ))}

                                                    {/* Slot rows */}
                                                    {!isLoadingSlots && allSlots.map((slot: TimeSlot) => {
                                                        // Non-lesson row
                                                        if (slot.type !== 'lesson') {
                                                            const cfg = ({
                                                                break:    { cls: 'bg-amber-50/60 border-amber-200 text-amber-700', label: '☕ Istirahat' },
                                                                ishoma:   { cls: 'bg-green-50/60 border-green-200 text-green-700', label: '🍽️ Ishoma' },
                                                                ceremony: { cls: 'bg-blue-50/60 border-blue-200 text-blue-700', label: '🚩 Upacara' },
                                                            } as Record<string, { cls: string; label: string }>)[slot.type] ?? { cls: 'bg-slate-50 border-slate-200 text-slate-500', label: slot.label };

                                                            return (
                                                                <div key={slot.id} style={gridStyle}>
                                                                    <div className={cn('text-xs p-2 rounded-lg flex items-center justify-center font-medium whitespace-nowrap border', cfg.cls)}>
                                                                        {slot.startTime} - {slot.endTime}
                                                                    </div>
                                                                    <div
                                                                        className={cn('rounded-lg border flex items-center justify-center gap-2 py-2.5 text-xs font-medium', cfg.cls)}
                                                                        style={{ gridColumn: `2 / -1` }}
                                                                    >
                                                                        {slot.label || cfg.label}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        // Lesson row
                                                        return (
                                                            <div key={slot.id} style={gridStyle}>
                                                                {/* Kolom waktu */}
                                                                <div className="text-xs p-2 bg-muted rounded-lg flex flex-col items-center justify-center font-medium text-muted-foreground gap-1">
                                                                    <span className="text-[10px] text-slate-700">{slot.label}</span>
                                                                    <span className="text-slate-600 whitespace-nowrap">{slot.startTime} - {slot.endTime}</span>
                                                                </div>

                                                                {/* Per kelas */}
                                                                {uniqueClasses.map(cls => {
                                                                    const isPem = cls.name.includes('PEM');
                                                                    const schedules = filteredSchedules.filter(
                                                                        s => s.classId === cls.id &&
                                                                            s.startTime === slot.startTime &&
                                                                            s.endTime === slot.endTime
                                                                    );

                                                                    if (schedules.length === 0) {
                                                                        return (
                                                                            <button
                                                                                key={cls.id}
                                                                                type="button"
                                                                                onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                                                                                className="border border-dashed border-slate-200 rounded-lg bg-muted/20 min-h-[80px] flex items-center justify-center hover:border-blue-300 hover:bg-blue-50/30 transition-colors group"
                                                                            >
                                                                                <Plus className="h-4 w-4 text-slate-300 group-hover:text-blue-400" />
                                                                            </button>
                                                                        );
                                                                    }

                                                                    // Kelas PEM: tampilkan mapel pertama + badge "+N lainnya" dengan popover
                                                                    if (isPem && schedules.length > 1) {
                                                                        const firstColor = getSubjectFlatColor(schedules[0].subjectName);

                                                                        // 2+ mapel: card pertama + popover badge
                                                                        const first = schedules[0];
                                                                        const rest  = schedules.slice(1);
                                                                        return (
                                                                            <div key={cls.id} className="min-h-[80px] flex flex-col gap-1">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => openEdit(first)}
                                                                                    className={cn('p-2.5 rounded-lg transition-all w-full text-left hover:shadow-md flex-1', firstColor)}
                                                                                >
                                                                                    <div className="flex items-center gap-1">
                                                                                        <BookOpen className="h-3 w-3 flex-shrink-0 opacity-70" />
                                                                                        <span className="text-xs font-semibold truncate">{first.subjectName}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1 opacity-75 mt-1">
                                                                                        <User className="h-3 w-3 flex-shrink-0" />
                                                                                        <span className="text-xs truncate">{first.teacherName || '—'}</span>
                                                                                    </div>
                                                                                </button>
                                                                                <Popover>
                                                                                    <PopoverTrigger asChild>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="text-[10px] font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-md px-2 py-0.5 w-full text-center transition-colors border border-slate-200"
                                                                                        >
                                                                                            +{rest.length} lainnya
                                                                                        </button>
                                                                                    </PopoverTrigger>
                                                                                    <PopoverContent className="w-56 p-2 space-y-1.5" side="right">
                                                                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1 pb-1 border-b border-slate-100">Mapel lain di jam ini</p>
                                                                                        {rest.map(s => {
                                                                                            const c = getSubjectFlatColor(s.subjectName);
                                                                                            return (
                                                                                                <button
                                                                                                    key={s.id}
                                                                                                    type="button"
                                                                                                    onClick={() => openEdit(s)}
                                                                                                    className={cn('p-2 rounded-lg w-full text-left hover:shadow-sm transition-all', c)}
                                                                                                >
                                                                                                    <div className="flex items-center gap-1">
                                                                                                        <BookOpen className="h-3 w-3 flex-shrink-0 opacity-70" />
                                                                                                        <span className="text-xs font-semibold truncate">{s.subjectName}</span>
                                                                                                    </div>
                                                                                                    <div className="flex items-center gap-1 opacity-75 mt-0.5">
                                                                                                        <User className="h-3 w-3 flex-shrink-0" />
                                                                                                        <span className="text-xs truncate">{s.teacherName || '—'}</span>
                                                                                                    </div>
                                                                                                </button>
                                                                                            );
                                                                                        })}
                                                                                    </PopoverContent>
                                                                                </Popover>
                                                                            </div>
                                                                        );
                                                                    }

                                                                    // Kelas reguler: 1 mapel per slot
                                                                    const schedule = schedules[0];
                                                                    const colorCls = getSubjectFlatColor(schedule.subjectName);

                                                                    return (
                                                                        <button
                                                                            key={cls.id}
                                                                            type="button"
                                                                            onClick={() => openEdit(schedule)}
                                                                            className={cn(
                                                                                'p-2.5 rounded-lg transition-all min-h-[80px] w-full text-left hover:shadow-md',
                                                                                colorCls
                                                                            )}
                                                                        >
                                                                            <div className="space-y-1.5">
                                                                                <div className="flex items-center gap-1">
                                                                                    <BookOpen className="h-3 w-3 flex-shrink-0 opacity-70" />
                                                                                    <span className="text-xs font-semibold truncate">
                                                                                        {schedule.subjectName}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1 opacity-75">
                                                                                    <User className="h-3 w-3 flex-shrink-0" />
                                                                                    <span className="text-xs truncate">{schedule.teacherName || '—'}</span>
                                                                                </div>
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }

                                    // ========== TABLE VIEW ==========
                                    if (filteredSchedules.length === 0) {
                                        return (
                                            <EmptyState
                                                icon={searchTerm ? FilterX : Calendar}
                                                title={searchTerm ? 'Tidak ada jadwal yang cocok' : `Belum ada jadwal untuk ${day}`}
                                                description={searchTerm ? 'Coba ubah kata kunci pencarian.' : 'Klik "Buat Jadwal" untuk mulai menambahkan jadwal pelajaran.'}
                                                className="py-16"
                                            >
                                                {!searchTerm && (
                                                    <Button
                                                        className="mt-4 bg-blue-800 hover:bg-blue-900 text-white"
                                                        onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                                                    >
                                                        <CalendarPlus className="h-4 w-4 mr-2" />
                                                        Buat Jadwal
                                                    </Button>
                                                )}
                                            </EmptyState>
                                        );
                                    }

                                    // Sort schedules by time
                                    const sortedSchedules = [...filteredSchedules].sort((a, b) => 
                                        a.startTime.localeCompare(b.startTime)
                                    );

                                    // Group schedules by time slot
                                    const groupedByTime: { timeKey: string; startTime: string; endTime: string; schedules: typeof sortedSchedules }[] = [];
                                    sortedSchedules.forEach(schedule => {
                                        const timeKey = `${schedule.startTime}-${schedule.endTime}`;
                                        const existing = groupedByTime.find(g => g.timeKey === timeKey);
                                        if (existing) {
                                            existing.schedules.push(schedule);
                                        } else {
                                            groupedByTime.push({
                                                timeKey,
                                                startTime: schedule.startTime,
                                                endTime: schedule.endTime,
                                                schedules: [schedule]
                                            });
                                        }
                                    });

                                    return (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-left w-[100px]">Waktu</th>
                                                        <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-left">Mata Pelajaran</th>
                                                        <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-left w-[90px]">Kelas</th>
                                                        <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-left">Guru</th>
                                                        <th className="px-6 py-3 font-semibold text-xs uppercase tracking-wider text-center w-[80px]">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {groupedByTime.map((group, groupIndex) => (
                                                        group.schedules.map((schedule, scheduleIndex) => (
                                                            <tr 
                                                                key={schedule.id} 
                                                                className={cn(
                                                                    "hover:bg-slate-50/50 transition-colors group",
                                                                    scheduleIndex < group.schedules.length - 1 ? "border-b border-slate-50" : "",
                                                                    groupIndex < groupedByTime.length - 1 && scheduleIndex === group.schedules.length - 1 ? "border-b border-slate-200" : ""
                                                                )}
                                                            >
                                                                {scheduleIndex === 0 && (
                                                                    <td 
                                                                        className="py-3 px-4 align-middle bg-white border-r border-slate-200"
                                                                        rowSpan={group.schedules.length}
                                                                    >
                                                                        <div className="flex flex-col items-center gap-0.5">
                                                                            <span className="inline-flex items-center justify-center h-5 w-14 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                                                                                Jam {dayTimeSlots.filter((s: TimeSlot) => s.type === 'lesson').findIndex((s: TimeSlot) => s.startTime === group.startTime) + 1 || '?'}
                                                                            </span>
                                                                            <span className="text-xs font-bold text-slate-800 font-mono mt-1">
                                                                                {group.startTime}
                                                                            </span>
                                                                            <span className="text-xs font-mono">
                                                                                <span className="text-slate-400">s/d </span>
                                                                                <span className="font-bold text-slate-800">{group.endTime}</span>
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                )}
                                                                <td className="py-3 px-6">
                                                                    <div className="flex items-center gap-2">
                                                                        <BookOpen className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                                                        <span className="font-medium text-sm text-slate-900">
                                                                            {schedule.subjectName}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-6">
                                                                    <Badge className="bg-blue-800 text-white text-xs font-medium">
                                                                        {schedule.className}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-3 px-6">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <User className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                                                                        <span className="text-sm text-slate-700 truncate max-w-[150px]">
                                                                            {schedule.teacherName}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-6">
                                                                    <div className="flex items-center justify-center gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 w-7 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700 opacity-70 group-hover:opacity-100"
                                                                            onClick={() => openEdit(schedule)}
                                                                            title="Edit"
                                                                        >
                                                                            <Edit className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 opacity-70 group-hover:opacity-100"
                                                                            onClick={() => setDeleteId(schedule.id)}
                                                                            title="Hapus"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()}
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>

            {/* Bulk Action Bar */}
            {selectedItems.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-slate-800">
                        <div className="flex items-center gap-2 pr-6 border-r border-slate-700">
                            <span className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {selectedItems.length}
                            </span>
                            <span className="text-sm font-medium text-slate-300">Jadwal dipilih</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-white hover:bg-slate-800 h-9"
                                onClick={handleBulkDelete}
                            >
                                <Trash2 className="h-4 w-4 mr-2 text-red-400" />
                                Hapus Massal
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-white hover:bg-slate-800 h-9"
                                onClick={() => setSelectedItems([])}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Batal
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <ScheduleForm
                key={`${isFormOpen}-${editingId ?? 'new'}`}
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingId(null);
                }}
                initialData={editingId ? data.find(d => d.id === editingId) : null}
                existingSchedules={data}
                onSubmit={editingId ? handleUpdate : handleCreate}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog 
                open={!!deleteId || isBulkDelete} 
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteId(null);
                        setIsBulkDelete(false);
                    }
                }}
            >
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isBulkDelete ? `Hapus ${selectedItems.length} Jadwal?` : 'Hapus Jadwal?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data jadwal yang dihapus tidak dapat dikembalikan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};


