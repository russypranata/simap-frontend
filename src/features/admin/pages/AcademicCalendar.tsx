'use client';

import React, { useState } from 'react';
import {
    CalendarDays,
    Plus,
    Calendar as CalendarIcon,
    MoreHorizontal,
    Clock,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_CALENDAR_EVENTS } from '../data/mockCalendarData';
import { CalendarEvent, EventType } from '../types/calendar';
import { CalendarEventForm } from '../components/forms/CalendarEventForm';
import { CalendarEventFormValues } from '../schemas/calendarSchema';
import { toast } from 'sonner';

const typeColors: Record<EventType, string> = {
    holiday: 'bg-red-100 text-red-700 border-red-200',
    exam: 'bg-amber-100 text-amber-700 border-amber-200',
    event: 'bg-blue-100 text-blue-700 border-blue-200',
    meeting: 'bg-purple-100 text-purple-700 border-purple-200',
};

const typeLabels: Record<EventType, string> = {
    holiday: 'Libur',
    exam: 'Ujian',
    event: 'Kegiatan',
    meeting: 'Rapat',
};

export const AcademicCalendar: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleCreate = (values: CalendarEventFormValues) => {
        const newItem: CalendarEvent = {
            id: `cal-${Date.now()}`,
            ...values,
        };
        setEvents([...events, newItem]);
        toast.success('Kegiatan berhasil ditambahkan');
    };

    const handleUpdate = (values: CalendarEventFormValues) => {
        if (!editingId) return;
        setEvents(prev => prev.map(item => item.id === editingId ? { ...item, ...values } : item));
        toast.success('Kegiatan berhasil diperbarui');
        setEditingId(null);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Hapus kegiatan ini?')) {
            setEvents(prev => prev.filter(item => item.id !== id));
            toast.success('Kegiatan dihapus');
        }
    };

    const openEdit = (item: CalendarEvent) => {
        setEditingId(item.id);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
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
                        Daftar agenda kegiatan dan hari libur akademik.
                    </p>
                </div>
                <Button
                    onClick={() => { setEditingId(null); setIsFormOpen(true); }}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Kegiatan
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Widget Placeholder (Left Column) */}
                <div className="lg:col-span-1 space-y-6">
                     <Card className="border-slate-200 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle>Kalender</CardTitle>
                            <CardDescription>Februari 2026</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                <span className="text-muted-foreground text-sm">Interactive Calendar Widget</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Event List (Right Column) */}
                <div className="lg:col-span-2">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                    <CalendarIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Agenda Mendatang
                                    </CardTitle>
                                    <CardDescription>
                                        Daftar kegiatan dalam waktu dekat
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100 border-t border-slate-100">
                                {sortedEvents.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center justify-center">
                                        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                            <CalendarIcon className="h-6 w-6 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 text-sm">Belum ada agenda</p>
                                    </div>
                                ) : (
                                    sortedEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="p-4 hover:bg-slate-50/60 transition-colors flex items-start justify-between group cursor-pointer"
                                            onClick={() => openEdit(event)}
                                        >
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center justify-center bg-white rounded-lg w-14 h-14 shrink-0 border border-slate-200 shadow-sm group-hover:border-blue-200 transition-colors">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                                        {new Date(event.startDate).toLocaleDateString('id-ID', { month: 'short' })}
                                                    </span>
                                                    <span className="text-xl font-bold text-slate-800 -mt-1">
                                                        {new Date(event.startDate).getDate()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">{event.title}</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{event.description}</p>
                                                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-medium">
                                                        <Clock className="h-3 w-3" />
                                                        <span>
                                                            {formatDate(event.startDate)}
                                                            {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className={`uppercase text-[10px] tracking-wider font-bold px-2 py-0.5 h-5 ${typeColors[event.type]}`}
                                                >
                                                    {typeLabels[event.type]}
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-600"
                                                    onClick={(e) => handleDelete(event.id, e)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <CalendarEventForm
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingId(null);
                }}
                initialData={editingId ? events.find(e => e.id === editingId) : null}
                onSubmit={editingId ? handleUpdate : handleCreate}
            />
        </div>
    );
};
