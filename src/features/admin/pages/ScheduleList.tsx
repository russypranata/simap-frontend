'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Search,
    Plus,
    Clock,
    User,
    Trash2,
    FileX,
    FilterX,
    Edit,
    BookOpen,
    Grid3X3,
    List,
    Copy,
    ArrowRight,
    CalendarPlus,
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
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Types & Services
import { DayOfWeek, Schedule, DAY_MAP } from '../types/schedule';
import { Class } from '../types/class';
import { scheduleService } from '../services/scheduleService';
import { classService } from '../services/classService';

// Components
import { ScheduleForm } from '../components/forms/ScheduleForm';
import { ScheduleFormValues } from '../schemas/scheduleSchema';
import { ScheduleListSkeleton } from '../components/schedule/ScheduleListSkeleton';
import { timeSlotService } from '../services/timeSlotService';
import { Subject } from '../types/subject';
import { subjectService } from '../services/subjectService';
import { getSubjectColor } from '../utils/scheduleUtils';

type ViewMode = 'timetable' | 'table';

export const ScheduleList: React.FC = () => {
    // Data State
    const [data, setData] = useState<Schedule[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
    const [isDeleting, setIsDeleting] = useState(false);

    // Copy State
    const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [copySource, setCopySource] = useState<DayOfWeek>('Senin');
    const [copyTarget, setCopyTarget] = useState<DayOfWeek>('Selasa');

    // Time slots per day (dari API)
    const [dayTimeSlots, setDayTimeSlots] = useState<any[]>([]);

    const days: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // Fetch Data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const [schedulesData, classesData, subjectsData] = await Promise.all([
                    scheduleService.getSchedules(),
                    classService.getClasses(),
                    subjectService.getSubjects(),
                ]);

                setData(schedulesData);
                setSubjects(subjectsData);
                setClasses(classesData.filter((c: any) => c.type === 'REGULER').sort((a: any, b: any) => {
                    if (a.grade !== b.grade) return a.grade - b.grade;
                    return a.name.localeCompare(b.name);
                }));
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Gagal memuat data jadwal');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch time slots when day changes
    useEffect(() => {
        const dayKey = DAY_MAP[selectedDay];
        timeSlotService.getByDay(dayKey as any).then(slots => {
            setDayTimeSlots(slots);
        });
    }, [selectedDay]);

    // Filter Logic - now based on selected day tab
    const filteredData = data.filter((item) => {
        const matchesDay = item.day === selectedDay;
        const matchesSearch = !searchTerm ||
            item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.teacherName ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDay && matchesSearch;
    });

    // Selection Handlers
    const toggleSelectAll = () => {
        if (selectedItems.length === filteredData.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredData.map(s => s.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) return;
        setIsBulkDelete(true);
    };

    // CRUD Handlers
    const handleCreate = async (values: ScheduleFormValues) => {
        try {
            const newItem = await scheduleService.createSchedule({
                subject_id: values.subjectId,
                class_id: values.classId,
                teacher_id: values.teacherId || undefined,
                day_of_week: DAY_MAP[values.day],
                start_time: values.startTime,
                end_time: values.endTime,
                room: values.room || undefined,
            });
            setData(prev => [newItem, ...prev]);
            toast.success('Jadwal berhasil ditambahkan');
        } catch (error: any) {
            toast.error(error?.message ?? 'Gagal membuat jadwal');
        }
    };

    const handleUpdate = async (values: ScheduleFormValues) => {
        if (!editingId) return;
        try {
            const updatedItem = await scheduleService.updateSchedule(editingId, {
                subject_id: values.subjectId,
                class_id: values.classId,
                teacher_id: values.teacherId || undefined,
                day_of_week: DAY_MAP[values.day],
                start_time: values.startTime,
                end_time: values.endTime,
                room: values.room || undefined,
            });
            setData(prev => prev.map(item => item.id === editingId ? updatedItem : item));
            toast.success('Jadwal berhasil diperbarui');
            setEditingId(null);
        } catch (error: any) {
            toast.error(error?.message ?? 'Gagal memperbarui jadwal');
        }
    };

    const handleDelete = async () => {
        if (!deleteId && !isBulkDelete) return;

        try {
            setIsDeleting(true);
            if (isBulkDelete) {
                await Promise.all(selectedItems.map(id => scheduleService.deleteSchedule(id)));
                toast.success(`${selectedItems.length} jadwal berhasil dihapus`);
                setData(prev => prev.filter(item => !selectedItems.includes(item.id)));
                setSelectedItems([]);
            } else if (deleteId) {
                await scheduleService.deleteSchedule(deleteId);
                toast.success('Jadwal berhasil dihapus');
                setData(prev => prev.filter(item => item.id !== deleteId));
            }
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Gagal menghapus jadwal');
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
            setIsBulkDelete(false);
        }
    };

    const handleCopySchedule = async () => {
        if (copySource === copyTarget) {
            toast.error('Hari asal dan tujuan tidak boleh sama');
            return;
        }
        try {
            setIsCopying(true);
            const newSchedules = await scheduleService.copyDaySchedule(
                DAY_MAP[copySource],
                DAY_MAP[copyTarget]
            );
            setData(prev => [...newSchedules, ...prev]);
            toast.success(`Jadwal ${copySource} berhasil disalin ke ${copyTarget}`);
            setIsCopyDialogOpen(false);
        } catch (error: any) {
            toast.error(error?.message ?? 'Gagal menyalin jadwal');
        } finally {
            setIsCopying(false);
        }
    };

    const openEdit = (item: Schedule) => {
        setEditingId(item.id);
        setIsFormOpen(true);
    };

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
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola jadwal mata pelajaran per kelas dan guru.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsCopyDialogOpen(true)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        Salin Jadwal
                    </Button>
                    <Button
                        onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                        className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Buat Jadwal
                    </Button>
                </div>
            </div>

            {/* Content Card */}
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
                                    <TabsTrigger key={day} value={day} className="text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
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

                                    const lessonSlots = dayTimeSlots.filter((s: any) => s.type === 'lesson');
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
                                                <div className="py-12 flex flex-col items-center justify-center">
                                                    <div className="w-14 h-14 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-3">
                                                        <FileX className="h-6 w-6 text-slate-400" />
                                                    </div>
                                                    <p className="text-slate-500 font-medium text-sm">Belum ada jadwal untuk {day}</p>
                                                    <p className="text-slate-400 text-xs mt-1">Klik "Buat Jadwal" untuk menambahkan</p>
                                                </div>
                                            );
                                        }

                                        const colCount = uniqueClasses.length + 1;

                                        return (
                                            <div className="overflow-x-auto p-4">
                                                <div className="space-y-2" style={{ minWidth: `${colCount * 130}px` }}>
                                                    {/* Header row */}
                                                    <div className="grid gap-2" style={{ gridTemplateColumns: `100px repeat(${uniqueClasses.length}, 1fr)` }}>
                                                        <div className="text-xs font-semibold p-2.5 bg-muted rounded-lg text-center text-muted-foreground uppercase tracking-wider">
                                                            Waktu
                                                        </div>
                                                        {uniqueClasses.map(cls => (
                                                            <div key={cls.id} className="text-xs font-semibold p-2.5 bg-muted rounded-lg text-center text-muted-foreground uppercase tracking-wider truncate">
                                                                {cls.name}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Slot rows */}
                                                    {allSlots.map((slot: any) => {
                                                        // Non-lesson row (break/ishoma/ceremony) — span full
                                                        if (slot.type !== 'lesson') {
                                                            const cfg = {
                                                                break:    { bg: 'bg-amber-50/60 border-amber-200 text-amber-700', emoji: '☕' },
                                                                ishoma:   { bg: 'bg-green-50/60 border-green-200 text-green-700', emoji: '🍽️' },
                                                                ceremony: { bg: 'bg-blue-50/60 border-blue-200 text-blue-700', emoji: '🚩' },
                                                            }[slot.type as string] ?? { bg: 'bg-slate-50 border-slate-200 text-slate-500', emoji: '⏸' };

                                                            return (
                                                                <div key={slot.id} className="grid gap-2" style={{ gridTemplateColumns: `100px repeat(${uniqueClasses.length}, 1fr)` }}>
                                                                    <div className={cn("text-xs p-2 rounded-lg flex items-center justify-center font-medium border whitespace-nowrap", cfg.bg)}>
                                                                        {slot.startTime}
                                                                    </div>
                                                                    <div className={cn("rounded-lg border flex items-center justify-center gap-2 py-2 text-xs font-medium", cfg.bg)}
                                                                        style={{ gridColumn: `2 / span ${uniqueClasses.length}` }}>
                                                                        {cfg.emoji} {slot.label} • {slot.startTime} – {slot.endTime}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        // Lesson row
                                                        return (
                                                            <div key={slot.id} className="grid gap-2" style={{ gridTemplateColumns: `100px repeat(${uniqueClasses.length}, 1fr)` }}>
                                                                {/* Waktu */}
                                                                <div className="text-xs p-2 bg-muted rounded-lg flex flex-col items-center justify-center font-medium text-muted-foreground gap-0.5">
                                                                    <span className="text-[10px] text-slate-600 font-semibold">{slot.label}</span>
                                                                    <span className="text-slate-500 whitespace-nowrap">{slot.startTime}</span>
                                                                    <span className="text-slate-400 text-[10px]">– {slot.endTime}</span>
                                                                </div>

                                                                {/* Per kelas */}
                                                                {uniqueClasses.map(cls => {
                                                                    const schedule = filteredSchedules.find(
                                                                        s => s.classId === cls.id &&
                                                                            s.startTime === slot.startTime &&
                                                                            s.endTime === slot.endTime
                                                                    );

                                                                    if (!schedule) {
                                                                        return (
                                                                            <button
                                                                                key={cls.id}
                                                                                type="button"
                                                                                onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                                                                                className="border border-dashed border-muted rounded-lg bg-muted/20 min-h-[80px] flex items-center justify-center hover:border-blue-300 hover:bg-blue-50/30 transition-colors group"
                                                                            >
                                                                                <Plus className="h-4 w-4 text-slate-300 group-hover:text-blue-400" />
                                                                            </button>
                                                                        );
                                                                    }

                                                                    const colors = getSubjectColor(schedule.subjectName);

                                                                    return (
                                                                        <button
                                                                            key={cls.id}
                                                                            type="button"
                                                                            onClick={() => openEdit(schedule)}
                                                                            className={cn(
                                                                                "p-2.5 rounded-lg transition-all min-h-[80px] w-full text-left hover:shadow-md hover:scale-[1.01]",
                                                                                `bg-gradient-to-br ${colors.bg} border ${colors.border}`
                                                                            )}
                                                                        >
                                                                            <div className="space-y-1.5">
                                                                                <div className="flex items-start gap-1">
                                                                                    <BookOpen className={cn("h-3 w-3 mt-0.5 flex-shrink-0 opacity-70", colors.text)} />
                                                                                    <span className={cn("text-xs font-semibold line-clamp-2 leading-tight", colors.text)}>
                                                                                        {schedule.subjectName}
                                                                                    </span>
                                                                                </div>
                                                                                <div className={cn("flex items-center gap-1 opacity-75", colors.subtext)}>
                                                                                    <User className="h-3 w-3 flex-shrink-0" />
                                                                                    <span className="text-xs truncate">{schedule.teacherName || '—'}</span>
                                                                                </div>
                                                                                {schedule.room && (
                                                                                    <span className={cn("text-[10px] opacity-60", colors.subtext)}>{schedule.room}</span>
                                                                                )}
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
                                            <div className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                                        {searchTerm ? <FilterX className="h-6 w-6 text-slate-300" /> : <FileX className="h-6 w-6 text-slate-300" />}
                                                    </div>
                                                    <p className="text-slate-500 font-medium text-sm">
                                                        {searchTerm ? 'Tidak ada jadwal yang cocok' : `Belum ada jadwal untuk ${day}`}
                                                    </p>
                                                    <p className="text-slate-400 text-xs mt-1">
                                                        {searchTerm ? 'Coba ubah pencarian' : 'Klik "Buat Jadwal" untuk menambahkan'}
                                                    </p>
                                                </div>
                                            </div>
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
                                                                                Jam {dayTimeSlots.filter((s: any) => s.type === 'lesson').findIndex((s: any) => s.startTime === group.startTime) + 1 || '?'}
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
                                                                        <span className="font-medium text-sm text-slate-800">
                                                                            {schedule.subjectName}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-6">
                                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium px-2 py-0.5">
                                                                        {schedule.className}
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-3 px-6">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <User className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                                                                        <span className="text-sm text-slate-600 truncate max-w-[150px]">
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
                                Batal
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <ScheduleForm
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
            
            {/* Copy Schedule Dialog */}
            <Dialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Salin Jadwal Harian</DialogTitle>
                        <DialogDescription>
                            Salin semua jadwal dari satu hari ke hari lain. Jadwal yang sudah ada di hari tujuan tidak akan dihapus (ditambahkan).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4 items-center justify-items-center">
                            <div className="w-full space-y-2">
                                <span className="text-sm font-medium text-slate-700">Dari Hari</span>
                                <Select value={copySource} onValueChange={(v) => setCopySource(v as DayOfWeek)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {days.map(d => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <ArrowRight className="h-5 w-5 text-slate-400 mt-6" />

                            <div className="w-full space-y-2">
                                <span className="text-sm font-medium text-slate-700">Ke Hari</span>
                                <Select value={copyTarget} onValueChange={(v) => setCopyTarget(v as DayOfWeek)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {days.map(d => (
                                            <SelectItem key={d} value={d} disabled={d === copySource}>
                                                {d}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCopyDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button 
                            onClick={handleCopySchedule} 
                            disabled={isCopying || copySource === copyTarget}
                            className="bg-blue-800 hover:bg-blue-900 text-white"
                        >
                            {isCopying ? 'Menyalin...' : 'Salin Jadwal'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};


