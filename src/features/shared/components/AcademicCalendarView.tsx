'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    CalendarDays,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Info,
    AlertCircle,
    RefreshCw,
    Umbrella,
    ClipboardList,
    Megaphone,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
    getDaysInMonth,
    getFirstDayOfMonth,
    formatLocalDate,
    formatDisplayDate,
    parseLocalDate,
} from '@/lib/dateUtils';
import { sharedCalendarEventService, CalendarEvent, EventType } from '../services/calendarEventService';
import { useAcademicYear } from '@/context/AcademicYearContext';

// ─── Constants ───────────────────────────────────────────────────────────────

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

// ─── Skeleton ────────────────────────────────────────────────────────────────

const CalendarViewSkeleton: React.FC = () => (
    <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-56" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
                <Skeleton className="h-4 w-72" />
            </div>
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-10" />
            {[80, 72, 80, 72].map((w, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" style={{ width: w }} />
            ))}
        </div>

        {/* Calendar Card Skeleton */}
        <Card className="border-slate-200 overflow-hidden">
            {/* Calendar Nav Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex items-center gap-2 min-w-[180px] justify-center">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex justify-center py-2">
                        <Skeleton className="h-4 w-6" />
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 p-2">
                {Array.from({ length: 42 }).map((_, i) => (
                    <div key={i} className="h-[120px] p-2 rounded-xl border border-slate-100 bg-white flex flex-col">
                        <div className="flex items-center justify-end mb-1.5">
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                        {i % 4 === 0 && <Skeleton className="h-5 w-full rounded-md mt-1" />}
                        {i % 7 === 2 && (
                            <>
                                <Skeleton className="h-5 w-full rounded-md mt-1" />
                                <Skeleton className="h-5 w-4/5 rounded-md mt-1" />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </Card>

        {/* Legend Skeleton */}
        <div className="flex items-center gap-4 px-1">
            <Skeleton className="h-3 w-16" />
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-1.5">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-3 w-12" />
                </div>
            ))}
        </div>
    </div>
);

// ─── Props ───────────────────────────────────────────────────────────────────

interface AcademicCalendarViewProps {
    /** Deskripsi di bawah judul */
    description?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isDateSunday = (dateStr: string) => new Date(dateStr).getDay() === 0;

// ─── Component ───────────────────────────────────────────────────────────────

export const AcademicCalendarView: React.FC<AcademicCalendarViewProps> = ({
    description,
}) => {
    const { academicYear: activeYear } = useAcademicYear();
    const today = useMemo(() => new Date(), []);

    const [currentMonth, setCurrentMonth] = useState(() => today.getMonth());
    const [currentYear, setCurrentYear] = useState(() => today.getFullYear());
    const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set(ALL_TYPES));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [selectedEventDetail, setSelectedEventDetail] = useState<CalendarEvent | null>(null);

    const monthParam = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

    // ── Data Fetching ──────────────────────────────────────────────────────────
    const { data: events = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['shared-calendar-events', currentYear, currentMonth],
        queryFn: () => sharedCalendarEventService.getCalendarEvents({ month: monthParam }),
        staleTime: 5 * 60 * 1000, // 5 menit
    });

    // ── Event Map ──────────────────────────────────────────────────────────────
    const eventMap = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        events.forEach(event => {
            const startDate = parseLocalDate(event.startDate);
            const endDate = parseLocalDate(event.endDate);
            const current = new Date(startDate);
            while (current <= endDate) {
                const dateKey = formatLocalDate(current);
                if (!map.has(dateKey)) map.set(dateKey, []);
                map.get(dateKey)?.push(event);
                current.setDate(current.getDate() + 1);
            }
        });
        return map;
    }, [events]);

    const getEventsForDate = useCallback(
        (dateStr: string) => eventMap.get(dateStr) || [],
        [eventMap]
    );

    const getFilteredEventsForDate = useCallback(
        (dateStr: string) => getEventsForDate(dateStr).filter(e => activeFilters.has(e.type)),
        [getEventsForDate, activeFilters]
    );

    // ── Calendar Days ──────────────────────────────────────────────────────────
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

    // ── Navigation ─────────────────────────────────────────────────────────────
    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };
    const goToToday = () => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setSelectedDate(null);
    };

    // ── Filter Toggle ──────────────────────────────────────────────────────────
    const toggleFilter = (type: EventType) => {
        setActiveFilters(prev => {
            const next = new Set(prev);
            if (next.has(type)) { if (next.size > 1) next.delete(type); }
            else next.add(type);
            return next;
        });
    };

    // ── Selected Date Events ───────────────────────────────────────────────────
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

    // ── Render ─────────────────────────────────────────────────────────────────
    if (isLoading) return <CalendarViewSkeleton />;

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
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Kalender{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Akademik
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        {description ?? `Lihat agenda kegiatan dan hari libur akademik T.A. ${activeYear.academicYear} — Semester ${activeYear.label}.`}
                    </p>
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
                                onClick={() => {
                                    setSelectedDate(day.dateStr);
                                    setIsDateModalOpen(true);
                                }}
                                className={cn(
                                    'h-[120px] p-2 text-left rounded-xl transition-all duration-200 border flex flex-col cursor-pointer group relative overflow-hidden',
                                    !day.isCurrentMonth && 'bg-slate-50 border-slate-100 opacity-60',
                                    day.isCurrentMonth && !isSelected && 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5',
                                    isSelected && 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-200',
                                )}
                            >
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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AcademicCalendarView;
