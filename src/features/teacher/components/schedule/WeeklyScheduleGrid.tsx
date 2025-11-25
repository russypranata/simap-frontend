'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Schedule } from '../../types/teacher';
import {
    Clock,
    BookOpen,
    Users,
    Circle,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

interface WeeklyScheduleGridProps {
    schedules: Schedule[];
}

const TIME_SLOTS = [
    '07:00 - 07:45',
    '07:45 - 08:30',
    '08:30 - 09:15',
    '09:15 - 10:00',
    '10:00 - 10:15', // Break
    '10:15 - 11:00',
    '11:00 - 11:45',
    '11:45 - 12:30',
    '12:30 - 13:00', // Break
    '13:00 - 13:45',
    '13:45 - 14:30',
    '14:30 - 15:15',
];

const WEEK_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export const WeeklyScheduleGrid: React.FC<WeeklyScheduleGridProps> = ({
    schedules,
}) => {
    const getScheduleForSlot = (day: string, timeSlot: string) => {
        return schedules.find(
            (schedule) => schedule.day === day && schedule.time === timeSlot
        );
    };

    // Generate consistent color for any subject dynamically
    const getSubjectColor = (subject: string) => {
        // Predefined colors for common subjects (avoiding green/blue for status clarity)
        const predefinedColors: Record<string, string> = {
            'Matematika': 'bg-blue-100 text-blue-800',              // Blue (Biru)
            'Fisika': 'bg-yellow-100 text-yellow-800',              // Yellow (Kuning)
            'Kimia': 'bg-purple-100 text-purple-800',
            'Biologi': 'bg-emerald-100 text-emerald-800',
            'Bahasa Indonesia': 'bg-orange-100 text-orange-800',
            'Bahasa Inggris': 'bg-pink-100 text-pink-800',
        };

        // Return predefined color if exists
        if (predefinedColors[subject]) {
            return predefinedColors[subject];
        }

        // Auto-generate color for new subjects
        // Create a hash from subject name for consistency
        let hash = 0;
        for (let i = 0; i < subject.length; i++) {
            hash = subject.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Available color combinations (pastel colors for readability)
        const colorPalette = [
            'bg-red-100 text-red-800',
            'bg-yellow-100 text-yellow-800',
            'bg-cyan-100 text-cyan-800',
            'bg-indigo-100 text-indigo-800',
            'bg-rose-100 text-rose-800',
            'bg-teal-100 text-teal-800',
            'bg-violet-100 text-violet-800',
            'bg-amber-100 text-amber-800',
            'bg-lime-100 text-lime-800',
            'bg-sky-100 text-sky-800',
            'bg-fuchsia-100 text-fuchsia-800',
            'bg-slate-100 text-slate-800',
        ];

        // Select color based on hash (consistent for same subject)
        const colorIndex = Math.abs(hash) % colorPalette.length;
        return colorPalette[colorIndex];
    };

    const isBreakTime = (timeSlot: string) => {
        return timeSlot === '10:00 - 10:15' || timeSlot === '12:30 - 13:00';
    };

    const getCurrentTimeStatus = (time: string) => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const [startTime, endTime] = time.split(' - ');

        if (currentTime >= startTime && currentTime <= endTime) {
            return 'ongoing';
        } else if (currentTime < startTime) {
            return 'upcoming';
        } else {
            return 'completed';
        }
    };

    // Get ring color based on subject for ongoing highlight
    const getSubjectRingColor = (subject: string) => {
        const ringColors: Record<string, string> = {
            'Matematika': 'ring-blue-500',
            'Fisika': 'ring-yellow-500',
            'Kimia': 'ring-purple-500',
            'Biologi': 'ring-emerald-500',
            'Bahasa Indonesia': 'ring-orange-500',
            'Bahasa Inggris': 'ring-pink-500',
        };
        return ringColors[subject] || 'ring-slate-500';
    };

    const getTodayDay = () => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[new Date().getDay()];
    };

    const today = getTodayDay();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Jadwal Mengajar Mingguan</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Header */}
                        <div className="grid grid-cols-6 gap-2 mb-2">
                            <div className="font-semibold text-sm p-2 bg-muted rounded-lg text-center">
                                Waktu
                            </div>
                            {WEEK_DAYS.map((day) => (
                                <div
                                    key={day}
                                    className={`font-semibold text-sm p-2 rounded-lg text-center ${day === today
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                        }`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Time Slots */}
                        <div className="space-y-2">
                            {TIME_SLOTS.map((timeSlot) => {
                                if (isBreakTime(timeSlot)) {
                                    return (
                                        <div key={timeSlot} className="grid grid-cols-6 gap-2">
                                            <div className="text-xs p-2 bg-muted/50 border border-muted rounded-lg flex items-center justify-center font-medium text-muted-foreground">
                                                {timeSlot}
                                            </div>
                                            <div className="col-span-5 bg-gradient-to-r from-muted/30 to-muted/50 border border-muted rounded-lg flex items-center justify-center text-sm font-medium text-muted-foreground">
                                                <span className="opacity-60">☕</span>
                                                <span className="ml-2">Istirahat</span>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={timeSlot} className="grid grid-cols-6 gap-2">
                                        <div className="text-xs p-2 bg-muted rounded-lg flex items-center justify-center font-medium">
                                            {timeSlot}
                                        </div>
                                        {WEEK_DAYS.map((day) => {
                                            const schedule = getScheduleForSlot(day, timeSlot);
                                            const isToday = day === today;
                                            // PENTING: Status waktu HANYA untuk jadwal hari ini
                                            const timeStatus = (isToday && schedule) ? getCurrentTimeStatus(timeSlot) : null;

                                            if (!schedule) {
                                                return (
                                                    <div
                                                        key={`${day}-${timeSlot}`}
                                                        className="p-2 border border-dashed border-muted rounded-lg bg-muted/20"
                                                    />
                                                );
                                            }

                                            return (
                                                <div
                                                    key={`${day}-${timeSlot}`}
                                                    className={`p-3 rounded-lg transition-all hover:shadow-md ${getSubjectColor(schedule.subject)} ${timeStatus === 'ongoing'
                                                            ? `ring-2 ${getSubjectRingColor(schedule.subject)} ring-offset-1 scale-[1.02]`
                                                            : ''
                                                        }`}
                                                >
                                                    <div className="space-y-2">
                                                        {/* Subject */}
                                                        <div className="flex items-start space-x-1 text-foreground">
                                                            <BookOpen className="h-3 w-3 mt-0.5 flex-shrink-0 opacity-70" />
                                                            <span className="text-xs font-semibold line-clamp-2">
                                                                {schedule.subject}
                                                            </span>
                                                        </div>

                                                        {/* Class */}
                                                        <div className="flex items-center space-x-1 text-muted-foreground">
                                                            <Users className="h-3 w-3 flex-shrink-0 opacity-70" />
                                                            <span className="text-xs font-medium">
                                                                {schedule.class}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};
