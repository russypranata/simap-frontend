'use client';

import React from 'react';
import {
    CalendarDays,
    Plus,
    Calendar as CalendarIcon,
    MoreHorizontal,
    Clock,
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
import { EventType } from '../types/calendar';

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
    // Sort events by date
    const sortedEvents = [...MOCK_CALENDAR_EVENTS].sort((a, b) =>
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
                <Button className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all">
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
                            <div className="divide-y divide-slate-100">
                                {sortedEvents.map((event) => (
                                    <div key={event.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between group">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center justify-center bg-slate-100 rounded-lg w-16 h-16 shrink-0 border border-slate-200">
                                                <span className="text-xs font-semibold text-slate-500 uppercase">
                                                    {new Date(event.startDate).toLocaleDateString('id-ID', { month: 'short' })}
                                                </span>
                                                <span className="text-2xl font-bold text-slate-800">
                                                    {new Date(event.startDate).getDate()}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900">{event.title}</h4>
                                                <p className="text-sm text-slate-500 mt-0.5">{event.description}</p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
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
                                                className={`uppercase text-[10px] tracking-wider font-semibold ${typeColors[event.type]}`}
                                            >
                                                {typeLabels[event.type]}
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
