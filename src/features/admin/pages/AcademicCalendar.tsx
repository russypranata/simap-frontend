'use client';

import React, { useMemo, useState } from 'react';
import {
    CalendarDays,
    CalendarPlus,
    Calendar as CalendarIcon,
    Info,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Edit,
    RefreshCw,
    AlertCircle,
    Umbrella,
    ClipboardList,
    Megaphone,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { EventType } from '../types/calendar';
import { CalendarEventForm } from '../components/forms/CalendarEventForm';
import { cn } from '@/lib/utils';
import { CalendarSkeleton } from '../components/calendar';
import { useAcademicCalendar } from '../hooks/useAcademicCalendar';
import { useAcademicYear } from '@/context/AcademicYearContext';
import {
    getDaysInMonth,
    getFirstDayOfMonth,
    formatLocalDate,
    formatDisplayDate,
} from '@/lib/dateUtils';

const typeColors: Record<EventType, string> = {
    holiday: 'bg-red-50 text-red-700 border-red-200',
    exam: 'bg-amber-50 text-amber-700 border-amber-200',
    event: 'bg-blue-50 text-blue-700 border-blue-200',
    meeting: 'bg-purple-50 text-purple-700 border-purple-200',
};

const typeLabels: Record<EventType, string> = {
    holiday: 'Libur',
    exam: 'Ujian',
    event: 'Kegiatan',
    meeting: 'Rapat',
};

const typeIcons: Record<EventType, React.ElementType> = {
    holiday: Umbrella,
    exam: ClipboardList,
    event: Megaphone,
    meeting: Users,
};

const ALL_TYPES: EventType[] = ['holiday', 'exam', 'event', 'meeting'];

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export const AcademicCalendar: React.FC = () => {
    const { academicYear: activeYear } = useAcademicYear();

    // Active type filters — all enabled by default
    const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set(ALL_TYPES));

    const toggleFilter = (type: EventType) => {
        setActiveFilters(prev => {
            const next = new Set(prev);
            if (next.has(type)) {
                // Keep at least one filter active
                if (next.size > 1) next.delete(type);
            } else {
                next.add(type);
            }
            return next;
        });
    };

    const {
        events,
        isLoading,
        isError,
        refetch,
        isSaving,
        currentMonth,
        currentYear,
        prevMonth,
        nextMonth,
        goToToday,
        today,
        selectedDate,
        selectedEventDetail,
        setSelectedEventDetail,
        isFormOpen,
        setIsFormOpen,
        isDateModalOpen,
        setIsDateModalOpen,
        editingId,
        setEditingId,
        intendedType,
        setIntendedType,
        deleteConfirmation,
        setDeleteConfirmation,
        getEventsForDate,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleSyncHolidays,
        isSyncing,
        isSyncConfirmOpen,
        setIsSyncConfirmOpen,
        openAddModal,
        openEditModal,
        openDateDetail,
    } = useAcademicCalendar();

    const isDateSunday = (dateStr: string) => new Date(dateStr).getDay() === 0;

    // Filtered events for a date
    const getFilteredEventsForDate = (dateStr: string) => {
        return getEventsForDate(dateStr).filter(e => activeFilters.has(e.type));
    };

    const selectedDateEvents = useMemo(() => {
        if (!selectedDate) return [];
        return [...getEventsForDate(selectedDate)].sort((a, b) => {
            const aH = a.type === 'holiday' || a.isHoliday;
            const bH = b.type === 'holiday' || b.isHoliday;
            if (aH && !bH) return -1;
            if (!aH && bH) return 1;
            return a.title.localeCompare(b.title);
        });
    }, [selectedDate, getEventsForDate]);

    const badgeLabel = useMemo(() => {
        if (!selectedDateEvents.length) return '0 Agenda';
        const holidayCount = selectedDateEvents.filter(e => e.type === 'holiday' || e.isHoliday).length;
        const eventCount = selectedDateEvents.length - holidayCount;
        const isSunday = selectedDate ? isDateSunday(selectedDate) : false;
        if ((holidayCount > 0 || isSunday) && eventCount > 0) return `${eventCount} Agenda`;
        if (holidayCount > 0 || isSunday) return null;
        return `${eventCount} Agenda`;
    }, [selectedDateEvents, selectedDate]);

    const badgeVariant = useMemo(() => {
        if (!selectedDateEvents.length) return 'bg-slate-100 text-slate-600 border-slate-200';
        const hasHoliday = selectedDateEvents.some(e => e.type === 'holiday' || e.isHoliday);
        const hasEvent = selectedDateEvents.some(e => e.type !== 'holiday' && !e.isHoliday);
        const isSunday = selectedDate ? isDateSunday(selectedDate) : false;
        if ((hasHoliday || isSunday) && !hasEvent) return 'bg-red-50 text-red-700 border-red-200';
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }, [selectedDateEvents, selectedDate]);

    const calendarDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const days: { date: number; dateStr: string; isCurrentMonth: boolean; isToday: boolean }[] = [];

        const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
        for (let i = firstDay - 1; i >= 0; i--) {
            const date = prevMonthDays - i;
            const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
            const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
            days.push({ date, dateStr: formatLocalDate(new Date(prevY, prevM, date)), isCurrentMonth: false, isToday: false });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = formatLocalDate(new Date(currentYear, currentMonth, i));
            const isToday = i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            days.push({ date: i, dateStr, isCurrentMonth: true, isToday });
        }

        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
            const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
            days.push({ date: i, dateStr: formatLocalDate(new Date(nextY, nextM, i)), isCurrentMonth: false, isToday: false });
        }

        return days;
    }, [currentYear, currentMonth, today]);

    if (isLoading) return <CalendarSkeleton />;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="p-4 bg-red-50 rounded-full">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <div className="text-center">
                    <h3 className="font-semibold text-lg text-slate-800">Gagal memuat kalender</h3>
                    <p className="text-sm text-slate-500 mt-1">Terjadi kesalahan saat mengambil data kalender akademik.</p>
                </div>
                <Button onClick={() => refetch()} className="bg-blue-800 hover:bg-blue-900 text-white">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Coba Lagi
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Kalender{' '}</span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Akademik</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola agenda kegiatan dan hari libur akademik T.A. {activeYear.academicYear} — Semester {activeYear.label}.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsSyncConfirmOpen(true)}
                        disabled={isSyncing}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-sm transition-all"
                    >
                        <RefreshCw className={cn('h-4 w-4 mr-2', isSyncing && 'animate-spin')} />
                        {isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Libur'}
                    </Button>
                    <Button
                        onClick={() => openAddModal(undefined, 'event')}
                        className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Tambah Kegiatan
                    </Button>
                </div>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-500 font-medium">Filter:</span>
                {ALL_TYPES.map(type => {
                    const Icon = typeIcons[type];
                    return (
                        <button
                            key={type}
                            onClick={() => toggleFilter(type)}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                                activeFilters.has(type)
                                    ? typeColors[type]
                                    : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                            )}
                        >
                            <Icon className="h-3 w-3" />
                            {typeLabels[type]}
                        </button>
                    );
                })}
            </div>

            {/* Calendar */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                {/* Calendar Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <Button size="icon" className="h-8 w-8 bg-blue-800 hover:bg-blue-900 text-white" onClick={prevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2 min-w-[180px] justify-center">
                            <CalendarIcon className="h-5 w-5 text-blue-800" />
                            <h2 className="text-lg font-semibold text-slate-800">{MONTH_NAMES[currentMonth]} {currentYear}</h2>
                        </div>
                        <Button size="icon" className="h-8 w-8 bg-blue-800 hover:bg-blue-900 text-white" onClick={nextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={goToToday} className="bg-blue-800 text-white hover:bg-blue-900 text-sm">
                            Hari Ini
                        </Button>
                    </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {DAY_NAMES.map((day, idx) => (
                        <div key={day} className={cn('text-center text-sm font-semibold py-2', idx === 6 ? 'text-red-500' : 'text-slate-600')}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 p-2 bg-slate-50/50 rounded-xl">
                    {calendarDays.map((day, idx) => {
                        const dayEvents = getFilteredEventsForDate(day.dateStr);
                        const allDayEvents = getEventsForDate(day.dateStr);
                        const isSelected = selectedDate === day.dateStr;
                        const isSunday = idx % 7 === 6;
                        const isHolidayDay = isSunday || allDayEvents.some(e => e.type === 'holiday' || e.isHoliday);

                        return (
                            <button
                                key={idx}
                                onClick={() => openDateDetail(day.dateStr)}
                                className={cn(
                                    'h-[120px] p-2 text-left rounded-xl transition-all duration-200 border flex flex-col cursor-pointer group relative overflow-hidden',
                                    !day.isCurrentMonth && 'bg-slate-50 border-slate-100 opacity-60',
                                    day.isCurrentMonth && !isSelected && 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5',
                                    isSelected && 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-200',
                                )}
                            >
                                {/* Background icon samar saat kosong */}
                                {dayEvents.length === 0 && day.isCurrentMonth && (
                                    <CalendarIcon className="absolute bottom-1 right-1 h-10 w-10 text-slate-100 pointer-events-none" />
                                )}
                                <div className="flex items-center justify-end mb-1">
                                    <span className={cn(
                                        'inline-flex items-center justify-center h-6 w-6 text-sm font-medium rounded-full transition-all',
                                        !day.isCurrentMonth && 'text-slate-400',
                                        day.isCurrentMonth && !day.isToday && (isHolidayDay ? 'text-red-500 font-bold' : 'text-slate-700'),
                                        day.isToday && (isHolidayDay ? 'bg-red-500 text-white' : 'bg-blue-800 text-white shadow-sm')
                                    )}>
                                        {day.date}
                                    </span>
                                </div>
                                {/* Badge Libur — posisi absolute bawah tengah */}
                                {isHolidayDay && day.isCurrentMonth && (
                                    <span className="absolute bottom-1.5 left-0 right-0 flex justify-center pointer-events-none">
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-100 text-red-600 border border-red-200 leading-none">
                                            Libur
                                        </span>
                                    </span>
                                )}
                                <div className="space-y-1 flex-1 overflow-hidden">
                                    {dayEvents.slice(0, 2).map((event, i) => (
                                        <div
                                            key={`${event.id}-${i}`}
                                            className={cn('text-xs font-medium px-2 py-1 rounded-md truncate border', typeColors[event.type])}
                                            title={event.title}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <div className="text-[10px] text-slate-400 px-1 font-medium">+{dayEvents.length - 2} lainnya</div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 px-1">
                <span className="text-xs text-slate-500 font-medium">Keterangan:</span>
                {ALL_TYPES.map(type => {
                    const Icon = typeIcons[type];
                    return (
                        <div key={type} className="flex items-center gap-1.5">
                            <span className={cn('inline-flex items-center justify-center h-4 w-4 rounded-sm border', typeColors[type])}>
                                <Icon className="h-2.5 w-2.5" />
                            </span>
                            <span className="text-xs text-slate-600">{typeLabels[type]}</span>
                        </div>
                    );
                })}
                <div className="flex items-center gap-1.5">
                    <span className="h-4 w-4 rounded-sm bg-red-50 border border-red-200 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-red-400">M</span>
                    </span>
                    <span className="text-xs text-slate-600">Hari Minggu</span>
                </div>
            </div>

            {/* Date Events Modal */}
            <Dialog open={isDateModalOpen} onOpenChange={setIsDateModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader className="pb-2 mt-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-base font-semibold">
                                        {selectedDate && formatDisplayDate(selectedDate)}
                                    </DialogTitle>
                                    <p className="text-sm text-muted-foreground mt-0.5">Informasi agenda dan kegiatan akademik.</p>
                                </div>
                            </div>
                            {badgeLabel && (
                                <Badge className={cn('text-xs py-0.5 font-normal border hover:brightness-95', badgeVariant)}>
                                    {badgeLabel}
                                </Badge>
                            )}
                        </div>
                    </DialogHeader>
                    <div className="max-h-[350px] overflow-y-auto pt-2">
                        {(selectedDateEvents.some(e => e.type === 'holiday' || e.isHoliday) || (selectedDate && isDateSunday(selectedDate))) && (
                            <div className="mb-4 mx-1 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                                <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                                    <Info className="h-4 w-4" />
                                </div>
                                <h5 className="text-sm font-semibold text-red-800">Hari Libur</h5>
                            </div>
                        )}
                        {selectedDateEvents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                                <div className="p-3 bg-slate-100 rounded-full">
                                    <CalendarIcon className="h-6 w-6 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Tidak ada agenda</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Belum ada kegiatan atau hari libur pada tanggal ini</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {selectedDateEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className="p-3 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer"
                                        onClick={() => setSelectedEventDetail(event)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium text-slate-800 text-sm truncate">{event.title}</h4>
                                                    <Badge className={cn('text-[10px] font-medium px-1.5 py-0 h-5 shrink-0 border', typeColors[event.type])}>
                                                        {typeLabels[event.type]}
                                                    </Badge>
                                                </div>
                                                {event.description && (
                                                    <p className="text-xs text-slate-500 line-clamp-1">{event.description}</p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 shrink-0"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setDeleteConfirmation({ isOpen: true, id: event.id });
                                                }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="pt-4 border-t border-slate-100 mt-4 grid grid-cols-2 gap-3">
                        <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white" onClick={() => selectedDate && openAddModal(selectedDate, 'event')}>
                            <CalendarPlus className="h-4 w-4 mr-2" />
                            Tambah Kegiatan
                        </Button>
                        <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => selectedDate && openAddModal(selectedDate, 'holiday')}>
                            <CalendarPlus className="h-4 w-4 mr-2" />
                            Set Hari Libur
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Event Detail Modal */}
            <Dialog open={!!selectedEventDetail} onOpenChange={open => !open && setSelectedEventDetail(null)}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader className="pb-2">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg shrink-0 mt-0.5">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0 pr-8">
                                <DialogTitle className="text-base font-semibold break-words leading-relaxed">
                                    {selectedEventDetail?.title}
                                </DialogTitle>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Badge className={cn('text-[10px] font-medium px-1.5 py-0 h-5 border shrink-0', selectedEventDetail && typeColors[selectedEventDetail.type])}>
                                        {selectedEventDetail && typeLabels[selectedEventDetail.type]}
                                    </Badge>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <CalendarIcon className="h-3.5 w-3.5" />
                                        <span>
                                            {selectedEventDetail && (
                                                selectedEventDetail.startDate !== selectedEventDetail.endDate
                                                    ? `${formatDisplayDate(selectedEventDetail.startDate)} - ${formatDisplayDate(selectedEventDetail.endDate)}`
                                                    : formatDisplayDate(selectedEventDetail.startDate)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                    {selectedEventDetail?.description && (
                        <div className="mt-5 pl-4 border-l-2 border-slate-200">
                            <h4 className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">Deskripsi</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{selectedEventDetail.description}</p>
                        </div>
                    )}
                    <div className="flex gap-2 pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 flex-1"
                            onClick={() => selectedEventDetail && openEditModal(selectedEventDetail)}
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                            onClick={() => selectedEventDetail && setDeleteConfirmation({ isOpen: true, id: selectedEventDetail.id })}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Hapus
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={open => setDeleteConfirmation(prev => ({ ...prev, isOpen: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Agenda ini akan dihapus permanen dari kalender akademik. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Event Form */}
            <CalendarEventForm
                open={isFormOpen}
                isLoading={isSaving}
                onOpenChange={open => {
                    setIsFormOpen(open);
                    if (!open) {
                        setEditingId(null);
                        setIntendedType('event');
                    }
                }}
                initialData={
                    editingId
                        ? events.find(e => e.id === editingId)
                        : selectedDate
                        ? { title: '', description: '', startDate: selectedDate, endDate: selectedDate, type: intendedType, isHoliday: intendedType === 'holiday', id: '', academicYearId: null }
                        : null
                }
                onSubmit={editingId ? handleUpdate : handleCreate}
            />

            {/* Sync Confirmation */}
            <AlertDialog open={isSyncConfirmOpen} onOpenChange={setIsSyncConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sinkronisasi Hari Libur Nasional?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Sistem akan otomatis menambahkan daftar libur nasional Indonesia ke dalam kalender Anda.
                            Data lama yang Anda input secara manual tidak akan terhapus atau berubah.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSyncing}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSyncHolidays}
                            disabled={isSyncing}
                            className="bg-blue-800 hover:bg-blue-900 text-white"
                        >
                            {isSyncing ? (
                                <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Menyinkronkan...</>
                            ) : (
                                <><RefreshCw className="h-4 w-4 mr-2" />Ya, Sinkronisasi</>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
