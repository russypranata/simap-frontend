'use client';

import React, { useMemo } from 'react';
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
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
} from '@/components/ui/card';
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
} from "@/components/ui/alert-dialog";
import { EventType } from '../types/calendar';
import { CalendarEventForm } from '../components/forms/CalendarEventForm';
import { cn } from '@/lib/utils';
import { CalendarSkeleton } from '../components/calendar';
import { useAcademicCalendar } from '../hooks/useAcademicCalendar';
import {
    getDaysInMonth,
    getFirstDayOfMonth,
    formatLocalDate,
    formatDisplayDate
} from '@/lib/dateUtils';

const typeColors: Record<EventType, string> = {
    holiday: 'bg-red-50 text-red-700 border-red-200',
    exam: 'bg-amber-50 text-amber-700 border-amber-200',
    event: 'bg-blue-50 text-blue-700 border-blue-200',
    meeting: 'bg-blue-50 text-blue-700 border-blue-200', // Unified
};

const typeLabels: Record<EventType, string> = {
    holiday: 'Libur',
    exam: 'Ujian',
    event: 'Kegiatan',
    meeting: 'Rapat',
};

const typeDotColors: Record<EventType, string> = {
    holiday: 'bg-red-500',
    exam: 'bg-amber-500',
    event: 'bg-blue-500',
    meeting: 'bg-blue-500', // Unified
};

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export const AcademicCalendar: React.FC = () => {
    const {
        // Data
        events,
        // eventMap, // Not directly used here, we use getEventsForDate wrapper
        isLoading,
        isSaving,
        
        // Navigation
        currentMonth,
        currentYear,
        prevMonth,
        nextMonth,
        goToToday,
        today,

        // Selection
        selectedDate,
        selectedEventDetail,
        setSelectedEventDetail,
        
        // Modals
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

        // Actions
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

    // Get events for selected date (for modal)
    // Check if a date string is a Sunday
    const isDateSunday = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.getDay() === 0;
    };

    // Optimization: We use getEventsForDate which uses the Map
    const selectedDateEvents = useMemo(() => {
        if (!selectedDate) return [];
        const items = getEventsForDate(selectedDate);
        // Sort: Holidays first, then by title
        return [...items].sort((a, b) => {
            const aIsHoliday = a.type === 'holiday' || a.isHoliday;
            const bIsHoliday = b.type === 'holiday' || b.isHoliday;
            
            if (aIsHoliday && !bIsHoliday) return -1;
            if (!aIsHoliday && bIsHoliday) return 1;
            return a.title.localeCompare(b.title);
        });
    }, [selectedDate, getEventsForDate]);

    // Calculate badge label dynamically
    const badgeLabel = useMemo(() => {
        if (!selectedDateEvents.length) return '0 Agenda';
        
        const holidayCount = selectedDateEvents.filter(e => e.type === 'holiday' || e.isHoliday).length;
        const eventCount = selectedDateEvents.length - holidayCount;
        const isSunday = selectedDate ? isDateSunday(selectedDate) : false;

        if ((holidayCount > 0 || isSunday) && eventCount > 0) {
            return `${eventCount} Agenda`; // Only show agenda count, ignore holiday in text
        } else if (holidayCount > 0 || isSunday) {
            return null; // Hide badge if only holiday (manual or Sunday)
        } else {
            return `${eventCount} Agenda`;
        }
    }, [selectedDateEvents]);

    const badgeVariant = useMemo(() => {
        if (!selectedDateEvents.length) return 'bg-slate-100 text-slate-600 border-slate-200';
        
        const hasHoliday = selectedDateEvents.some(e => e.type === 'holiday' || e.isHoliday);
        const hasEvent = selectedDateEvents.some(e => e.type !== 'holiday' && !e.isHoliday);
        const isSunday = selectedDate ? isDateSunday(selectedDate) : false;

        // If mixed (holiday & event), we still show blue as it counts agendas
        if ((hasHoliday || isSunday) && !hasEvent) return 'bg-red-50 text-red-700 border-red-200';
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }, [selectedDateEvents]);

    // Generate calendar grid
    const calendarDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const days: { date: number; dateStr: string; isCurrentMonth: boolean; isToday: boolean }[] = [];

        // Previous month days
        const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
        for (let i = firstDay - 1; i >= 0; i--) {
            const date = prevMonthDays - i;
            const prevMonthVal = currentMonth === 0 ? 11 : currentMonth - 1;
            const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            const dateStr = formatLocalDate(new Date(prevYear, prevMonthVal, date));
            
            days.push({
                date,
                dateStr,
                isCurrentMonth: false,
                isToday: false,
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = formatLocalDate(new Date(currentYear, currentMonth, i));
            const isToday = i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            days.push({
                date: i,
                dateStr,
                isCurrentMonth: true,
                isToday,
            });
        }

        // Next month days to fill the grid
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            const nextMonthVal = currentMonth === 11 ? 0 : currentMonth + 1;
            const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
            const dateStr = formatLocalDate(new Date(nextYear, nextMonthVal, i));
            days.push({
                date: i,
                dateStr,
                isCurrentMonth: false,
                isToday: false,
            });
        }

        return days;
    }, [currentYear, currentMonth, today]);

    if (isLoading) {
        return <CalendarSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Kalender{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Akademik
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola agenda kegiatan dan hari libur akademik.
                    </p>

                    {/* Active Year Badge */}
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <CalendarDays className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                                T.A. 2025/2026
                            </span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-sm font-medium text-blue-800">
                            Semester Genap
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsSyncConfirmOpen(true)}
                        disabled={isSyncing}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-sm transition-all"
                    >
                        <RefreshCw className={cn("h-4 w-4 mr-2", isSyncing && "animate-spin")} />
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
                            <h2 className="text-lg font-semibold text-slate-800">
                                {MONTH_NAMES[currentMonth]} {currentYear}
                            </h2>
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
                        <div 
                            key={day} 
                            className={cn(
                                "text-center text-sm font-semibold py-2",
                                idx === 6 ? "text-red-500" : "text-slate-600"
                            )}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 p-2 bg-slate-50/50 rounded-xl">
                    {calendarDays.map((day, idx) => {
                        const dayEvents = getEventsForDate(day.dateStr);
                        const isSelected = selectedDate === day.dateStr;
                        const isSunday = idx % 7 === 6;

                        return (
                            <button
                                key={idx}
                                onClick={() => openDateDetail(day.dateStr)}
                                className={cn(
                                    "h-[120px] p-2 text-left rounded-xl transition-all duration-200 border flex flex-col cursor-pointer group",
                                    !day.isCurrentMonth && "bg-slate-50 border-slate-100 opacity-60",
                                    day.isCurrentMonth && !isSelected && "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5",
                                    isSelected && "bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-200",
                                )}
                            >
                                {/* Header: Icon & Date Number */}
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className={cn(
                                        "p-1 rounded-md transition-all duration-300",
                                        day.isToday ? "text-white/20" : "text-slate-200/50 group-hover:text-blue-500/20"
                                    )}>
                                        <CalendarIcon className="h-4 w-4" />
                                    </div>
                                    <span className={cn(
                                        "inline-flex items-center justify-center h-6 w-6 text-sm font-medium rounded-full transition-all",
                                        !day.isCurrentMonth && "text-slate-400",
                                        day.isCurrentMonth && !day.isToday && (isSunday || dayEvents.some(e => e.type === 'holiday' || e.isHoliday) ? "text-red-500 font-bold" : "text-slate-700"),
                                        day.isToday && (isSunday || dayEvents.some(e => e.type === 'holiday' || e.isHoliday) ? "bg-red-500 text-white" : "bg-blue-800 text-white shadow-sm")
                                    )}>
                                        {day.date}
                                    </span>
                                </div>
                                {/* Event Bars */}
                                <div className="space-y-1 flex-1 overflow-hidden">
                                    {dayEvents.slice(0, 2).map((event, i) => (
                                        <div
                                            key={`${event.id}-${i}`}
                                            className={cn(
                                                "text-xs font-medium px-2 py-1 rounded-md truncate border",
                                                typeColors[event.type]
                                            )}
                                            title={event.title}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <div className="text-[10px] text-slate-400 px-1 font-medium">
                                            +{dayEvents.length - 2} lainnya
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Card>

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
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        Informasi agenda dan kegiatan akademik.
                                    </p>
                                </div>
                            </div>
                            {badgeLabel && (
                                <Badge className={cn("text-xs py-0.5 font-normal border hover:brightness-95", badgeVariant)}>
                                    {badgeLabel}
                                </Badge>
                            )}
                        </div>
                    </DialogHeader>
                    <div className="max-h-[350px] overflow-y-auto pt-2">
                        {/* Holiday Banner Notice */}
                        {(selectedDateEvents.some(e => e.type === 'holiday' || e.isHoliday) || (selectedDate && isDateSunday(selectedDate))) && (
                            <div className="mb-4 mx-1 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                                <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                                    <Info className="h-4 w-4" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold text-red-800">Hari Libur</h5>
                                </div>
                            </div>
                        )}

                        {selectedDateEvents.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                Tidak ada agenda atau hari libur pada tanggal ini
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {selectedDateEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="p-3 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer"
                                        onClick={() => setSelectedEventDetail(event)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium text-slate-800 text-sm truncate">
                                                        {event.title}
                                                    </h4>
                                                    <Badge className={cn("text-[10px] font-medium px-1.5 py-0 h-5 shrink-0 border", typeColors[event.type])}>
                                                        {typeLabels[event.type]}
                                                    </Badge>
                                                </div>
                                                {event.description && (
                                                    <p className="text-xs text-slate-500 line-clamp-1">
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 shrink-0"
                                                onClick={(e) => {
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
                        <Button 
                            className="w-full bg-blue-800 hover:bg-blue-900 text-white"
                            onClick={() => selectedDate && openAddModal(selectedDate, 'event')}
                        >
                            <CalendarPlus className="h-4 w-4 mr-2" />
                            Tambah Kegiatan
                        </Button>
                        <Button 
                            variant="outline"
                            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => selectedDate && openAddModal(selectedDate, 'holiday')}
                        >
                            <CalendarPlus className="h-4 w-4 mr-2" />
                            Set Hari Libur
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Event Detail Modal */}
            <Dialog open={!!selectedEventDetail} onOpenChange={(open) => !open && setSelectedEventDetail(null)}>
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
                                    <Badge className={cn("text-[10px] font-medium px-1.5 py-0 h-5 border shrink-0", selectedEventDetail && typeColors[selectedEventDetail.type])}>
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
                            <h4 className="text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                                Deskripsi
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {selectedEventDetail.description}
                            </p>
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

            <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open) => setDeleteConfirmation(prev => ({ ...prev, isOpen: open }))}>
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

            <CalendarEventForm
                open={isFormOpen}
                isLoading={isSaving}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) {
                        setEditingId(null);
                        setIntendedType('event');
                    }
                }}
                initialData={editingId ? events.find(e => e.id === editingId) : (selectedDate ? { 
                    title: '', 
                    description: '', 
                    startDate: selectedDate, 
                    endDate: selectedDate, 
                    type: intendedType, 
                    isHoliday: intendedType === 'holiday', 
                    id: '' 
                } : null)}
                onSubmit={editingId ? handleUpdate : handleCreate}
            />
            {/* Sync Confirmation Dialog */}
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
                        <AlertDialogCancel className="flex items-center gap-2">
                            <X className="h-4 w-4" />
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleSyncHolidays}
                            className="bg-blue-800 hover:bg-blue-900 text-white flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Sinkronkan Sekarang
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
