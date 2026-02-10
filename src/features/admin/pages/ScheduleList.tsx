'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Search,
    Plus,
    Clock,
    User,
    MapPin,
    MoreHorizontal,
    Trash2,
    CalendarDays,
    FilterX,
    FileX,
    Settings,
    CalendarPlus,
    Edit,
    BookOpen,
    Grid3X3,
    List,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { DayOfWeek, Schedule } from '../types/schedule';
import { Class } from '../types/class';
import { scheduleService } from '../services/scheduleService';
import { classService } from '../services/classService';
import { academicYearService } from '../services/academicYearService';
import { AcademicYear } from '../types/academicYear';

// Components
import { ScheduleForm } from '../components/forms/ScheduleForm';
import { ScheduleFormValues } from '../schemas/scheduleSchema';
import { ScheduleListSkeleton } from '../components/schedule/ScheduleListSkeleton';
import { getLessonSlots, getSlotsByDay, MOCK_TIME_SLOTS, TimeSlot } from '../data/mockTimeSlots';
import { getScheduleGrid } from '../utils/scheduleHelpers';
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
    const [activeYear, setActiveYear] = useState<string | null>(null);
    const [activeSemester, setActiveSemester] = useState<string | null>(null);

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

    const days: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // Fetch Data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const [schedulesData, yearsData, classesData, subjectsData] = await Promise.all([
                    scheduleService.getSchedules(),
                    academicYearService.getAcademicYears(),
                    classService.getClasses(),
                    subjectService.getSubjects()
                ]);

                setData(schedulesData);
                setSubjects(subjectsData);
                // Filter only REGULER classes for timetable grid
                setClasses(classesData.filter(c => c.type === 'REGULER').sort((a, b) => {
                    // Sort by grade then by name
                    if (a.grade !== b.grade) return a.grade - b.grade;
                    return a.name.localeCompare(b.name);
                }));

                // Set Active Year Badge
                const activeData = yearsData.find((y: AcademicYear) => y.isActive);
                if (activeData) {
                    setActiveYear(activeData.name);
                    const activeSem = activeData.semesters.find((s: any) => s.isActive);
                    if (activeSem) {
                        setActiveSemester(activeSem.name);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Gagal memuat data jadwal');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Filter Logic - now based on selected day tab
    const filteredData = data.filter((item) => {
        const matchesDay = item.day === selectedDay;
        const matchesSearch =
            item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
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
            // Optimistic Update can be done here, but let's re-fetch or append
            const createPayload = { ...values }; 
            const newItem = await scheduleService.createSchedule(createPayload as any);
            setData(prev => [newItem, ...prev]);
            toast.success('Jadwal berhasil ditambahkan');
        } catch (error) {
            toast.error('Gagal membuat jadwal');
        }
    };

    const handleUpdate = async (values: ScheduleFormValues) => {
        if (!editingId) return;
        try {
            const updatedItem = await scheduleService.updateSchedule(editingId, values);
            setData(prev => prev.map(item => item.id === editingId ? updatedItem : item));
            toast.success('Jadwal berhasil diperbarui');
            setEditingId(null);
        } catch (error) {
            toast.error('Gagal memperbarui jadwal');
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

                    {/* Active Year Badge */}
                    {activeYear && (
                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                                <CalendarDays className="h-4 w-4" />
                                <span className="text-sm font-semibold">
                                    T.A. {activeYear}
                                </span>
                            </div>
                            {activeSemester && (
                                <>
                                    <div className="h-4 w-[1px] bg-border" />
                                    <span className="text-sm font-medium text-blue-800">
                                        Semester {activeSemester}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
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

            {/* Content Card */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Jadwal
                                </CardTitle>
                                <CardDescription>
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

                                    const lessonSlots = getLessonSlots();
                                    // Get all slots for timetable view (including breaks)
                                    const allSlots = getSlotsByDay(day);

                                    // ========== TIMETABLE VIEW ==========
                                    if (viewMode === 'timetable') {
                                        // Extract unique classes from schedule data for this day
                                        const uniqueClasses = Array.from(
                                            new Map(
                                                daySchedules
                                                    .filter(s => s.classId && s.className)
                                                    .map(s => [s.classId, { id: s.classId!, name: s.className }])
                                            ).values()
                                        ).sort((a, b) => a.name.localeCompare(b.name));

                                        if (uniqueClasses.length === 0) {
                                            return (
                                                <div className="py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                                            <FileX className="h-6 w-6 text-slate-300" />
                                                        </div>
                                                        <p className="text-slate-500 font-medium text-sm">Belum ada jadwal untuk {day}</p>
                                                        <p className="text-slate-400 text-xs mt-1">Klik "Buat Jadwal" untuk menambahkan</p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                                        <tr>
                                                            <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wider text-center w-[100px] border-r border-slate-200 sticky left-0 bg-slate-50 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Waktu</span>
                                                            </th>
                                                            {uniqueClasses.map((cls) => (
                                                                <th 
                                                                    key={cls.id} 
                                                                    className="px-3 py-3 text-xs text-center min-w-[120px] border-r border-slate-100"
                                                                >
                                                                    <span className="font-semibold text-slate-700">
                                                                        {cls.name}
                                                                    </span>
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {allSlots.map((slot, slotIdx) => {
                                                            // Subject color helper
                                                            const getSubjectColors = (schedule: Schedule) => {
                                                                const subject = subjects.find(s => s.id === schedule.subjectId);
                                                                const category = subject ? subject.category : undefined;
                                                                // Use subject name from schedule (which might be denormalized) or linked subject
                                                                const name = subject ? subject.name : schedule.subjectName;
                                                                return getSubjectColor(name, category);
                                                            };

                                                            // Render break/ishoma separator row
                                                            if (slot.type === 'break' || slot.type === 'ishoma') {
                                                                const isIshoma = slot.type === 'ishoma';
                                                                return (
                                                                    <tr key={slot.id} className={isIshoma ? "bg-green-50" : "bg-amber-50"}>
                                                                        <td 
                                                                            colSpan={uniqueClasses.length + 1}
                                                                            className="py-2 px-4 text-center"
                                                                        >
                                                                            <span className={cn(
                                                                                "text-xs font-medium",
                                                                                isIshoma ? "text-green-600" : "text-amber-600"
                                                                            )}>
                                                                                {isIshoma ? '🍽️' : '☕'} {slot.label} • {slot.startTime} - {slot.endTime}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }

                                                            // Skip ceremony for now (only show on Monday)
                                                            if (slot.type === 'ceremony') {
                                                                return null;
                                                            }

                                                            return (
                                                            <tr key={slot.label} className="hover:bg-slate-50/50">
                                                                {/* Time Cell - solid background to prevent see-through on scroll */}
                                                                <td className="px-2 py-3 text-center border-r border-slate-200 sticky left-0 z-20 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                                    <div className="flex flex-col items-center gap-0.5">
                                                                        <span className="inline-flex items-center justify-center h-5 w-14 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                                                                            {slot.label.replace('Jam ke-', 'Jam ')}
                                                                        </span>
                                                                        <span className="text-xs font-bold text-slate-800 font-mono mt-1">
                                                                            {slot.startTime}
                                                                        </span>
                                                                        <span className="text-xs font-mono">
                                                                            <span className="text-slate-400">s/d </span>
                                                                            <span className="font-bold text-slate-800">{slot.endTime}</span>
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                {/* Schedule Cells */}
                                                                {uniqueClasses.map((cls) => {
                                                                    const schedule = filteredSchedules.find(
                                                                        s => s.classId === cls.id &&
                                                                            s.startTime === slot.startTime &&
                                                                            s.endTime === slot.endTime
                                                                    );
                                                                    const colors = schedule ? getSubjectColors(schedule) : null;

                                                                    return (
                                                                        <td 
                                                                            key={cls.id} 
                                                                            className="px-2 py-2 text-center border-r border-slate-100 relative group bg-white"
                                                                        >
                                                                            {schedule ? (
                                                                                <div 
                                                                                    className={cn(
                                                                                        "p-3 rounded-md bg-gradient-to-br border hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden min-h-[56px]",
                                                                                        colors?.bg,
                                                                                        colors?.border
                                                                                    )}
                                                                                    onClick={() => openEdit(schedule)}
                                                                                >
                                                                                    {/* Background book icon */}
                                                                                    <BookOpen className={cn("absolute -right-1 -bottom-1 h-10 w-10 opacity-[0.04]", colors?.text)} />
                                                                                    <p className={cn("text-xs font-semibold truncate relative z-10", colors?.text)}>
                                                                                        {schedule.subjectName}
                                                                                    </p>
                                                                                    <p className={cn("text-[10px] truncate mt-1 relative z-10", colors?.subtext)}>
                                                                                        {schedule.teacherName}
                                                                                    </p>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="p-3 min-h-[56px] rounded-md border border-dashed border-slate-200 text-slate-300 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer group flex items-center justify-center"
                                                                                    onClick={() => {
                                                                                        setEditingId(null);
                                                                                        setIsFormOpen(true);
                                                                                    }}
                                                                                >
                                                                                    <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 text-blue-400" />
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
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
                                                                                Jam {lessonSlots.findIndex(s => s.startTime === group.startTime) + 1 || '?'}
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
        </div>
    );
};
