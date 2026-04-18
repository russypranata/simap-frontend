/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, XCircle, Users, Timer, ChevronDown, ChevronUp, ClipboardCheck } from 'lucide-react';
import { Schedule, AttendanceRecord } from '../../types/teacher';
import { formatDate, getDayName } from '@/features/shared/utils/dateFormatter';
import { cn } from '@/lib/utils';

interface DailySummaryProps {
    schedule: Schedule[];
    attendanceRecords: AttendanceRecord[];
    selectedDate: string;
    onFillFilter?: (classId: string, subject: string, lessonHour: string) => void;
    classes: any[];
}

export const DailySummary: React.FC<DailySummaryProps> = ({
    schedule,
    attendanceRecords,
    selectedDate,
    onFillFilter,
    classes,
}) => {
    // Get day name from selected date
    const date = new Date(selectedDate);
    const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });
    const formattedDate = formatDate(date);

    // Filter schedule for today — computed directly (no useMemo to avoid react-compiler issues)
    const todaySchedule = schedule
        .filter((s) => s.day === dayName)
        .sort((a, b) => a.time.localeCompare(b.time));

    // State for expanded groups
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

    const toggleGroupExpansion = (groupIndex: number) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupIndex)) {
            newExpanded.delete(groupIndex);
        } else {
            newExpanded.add(groupIndex);
        }
        setExpandedGroups(newExpanded);
    };

    // Group consecutive schedules by subject and class
    const groupedSchedule = useMemo(() => {
        if (todaySchedule.length === 0) return [];

        const groups: Array<{
            startTime: string;
            endTime: string;
            class: string;
            subject: string;
            room: string;
            lessonHours: string[];
            hasAttendance: boolean;
        }> = [];

        let currentGroup: Schedule[] = [];

        const getLessonNumber = (time: string): number => {
            const startTime = time.split(' - ')[0];
            const timeMap: Record<string, number> = {
                '07:00': 1, '07:45': 2, '08:30': 3, '09:15': 4,
                '10:15': 5, '11:00': 6, '11:45': 7,
                '13:00': 8, '13:45': 9
            };
            return timeMap[startTime] || 0;
        };

        todaySchedule.forEach((current, index) => {
            if (currentGroup.length === 0) {
                currentGroup.push(current);
            } else {
                const lastInGroup = currentGroup[currentGroup.length - 1];
                const lastEndTime = lastInGroup.time.split(' - ')[1];
                const currentStartTime = current.time.split(' - ')[0];

                if (
                    lastEndTime === currentStartTime &&
                    current.class === lastInGroup.class &&
                    current.subject === lastInGroup.subject
                ) {
                    currentGroup.push(current);
                } else {
                    // Process current group
                    const first = currentGroup[0];
                    const last = currentGroup[currentGroup.length - 1];
                    const lessonHours = currentGroup.map(s => getLessonNumber(s.time).toString());

                    // Check if attendance exists for this schedule
                    const hasAttendance = attendanceRecords.some(
                        (record) =>
                            record.date === selectedDate &&
                            record.class === first.class &&
                            record.subject === first.subject &&
                            lessonHours.includes(record.lessonHour.split('-')[0])
                    );

                    groups.push({
                        startTime: first.time.split(' - ')[0],
                        endTime: last.time.split(' - ')[1],
                        class: first.class,
                        subject: first.subject,
                        room: first.room,
                        lessonHours,
                        hasAttendance,
                    });

                    currentGroup = [current];
                }
            }

            // Process last group
            if (index === todaySchedule.length - 1 && currentGroup.length > 0) {
                const first = currentGroup[0];
                const last = currentGroup[currentGroup.length - 1];
                const lessonHours = currentGroup.map(s => getLessonNumber(s.time).toString());

                const hasAttendance = attendanceRecords.some(
                    (record) =>
                        record.date === selectedDate &&
                        record.class === first.class &&
                        record.subject === first.subject &&
                        lessonHours.includes(record.lessonHour.split('-')[0])
                );

                groups.push({
                    startTime: first.time.split(' - ')[0],
                    endTime: last.time.split(' - ')[1],
                    class: first.class,
                    subject: first.subject,
                    room: first.room,
                    lessonHours,
                    hasAttendance,
                });
            }
        });

        return groups;
    }, [todaySchedule, attendanceRecords, selectedDate]);

    // Check if current time is within schedule
    const getCurrentStatus = (startTime: string, endTime: string) => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        // Only show ongoing if it's today
        const isToday = selectedDate === new Date().toISOString().split('T')[0];

        if (isToday && currentTime >= startTime && currentTime <= endTime) {
            return 'ongoing';
        } else if (isToday && currentTime > endTime) {
            return 'past';
        }
        return 'upcoming';
    };

    const getSubjectStyles = (subject: string) => {
        const styles: Record<string, { bg: string, text: string, border: string, icon: string }> = {
            'Matematika': { bg: 'bg-blue-100', text: 'text-blue-900', border: 'border-blue-500', icon: 'text-blue-600' },
            'Fisika': { bg: 'bg-yellow-100', text: 'text-yellow-900', border: 'border-yellow-500', icon: 'text-yellow-600' },
            'Kimia': { bg: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-500', icon: 'text-purple-600' },
            'Biologi': { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-500', icon: 'text-emerald-600' },
            'Bahasa Indonesia': { bg: 'bg-orange-100', text: 'text-orange-900', border: 'border-orange-500', icon: 'text-orange-600' },
            'Bahasa Inggris': { bg: 'bg-pink-100', text: 'text-pink-900', border: 'border-pink-500', icon: 'text-pink-600' },
        };

        if (styles[subject]) return styles[subject];
        return { bg: 'bg-slate-100', text: 'text-slate-900', border: 'border-slate-500', icon: 'text-slate-600' };
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            Ringkasan Harian
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            {getDayName(date)}, {formattedDate}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {groupedSchedule.length === 0 ? (
                    <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                        <p className="text-sm text-muted-foreground">
                            Tidak ada jadwal mengajar untuk hari ini
                        </p>
                    </div>
                ) : (
                    <div className="relative space-y-0">
                        {/* Clean Vertical Line */}
                        <div className="absolute left-[90px] top-2 bottom-6 w-[2px] bg-gray-100" />

                        {groupedSchedule.map((item, index) => {
                            const status = getCurrentStatus(item.startTime, item.endTime);
                            const lessonRange =
                                item.lessonHours.length === 1
                                    ? `Jam ke-${item.lessonHours[0]}`
                                    : `Jam ke-${item.lessonHours[0]}-${item.lessonHours[item.lessonHours.length - 1]}`;

                            return (
                                <div key={index} className="relative flex items-start gap-10 group pb-6 last:pb-0">
                                    {/* Time Column - Fixed Width & Aligned */}
                                    <div className="flex flex-col items-end w-[70px] flex-shrink-0 pt-1">
                                        <span className={`text-base font-bold leading-none tracking-tight ${status === 'ongoing' ? 'text-primary' : 'text-gray-900'
                                            }`}>
                                            {item.startTime}
                                        </span>
                                        <span className="text-[11px] font-medium text-muted-foreground mt-1.5">
                                            {item.endTime}
                                        </span>
                                    </div>

                                    {/* Schedule Card */}
                                    <div className={`flex-1 rounded-xl transition-all duration-300 overflow-hidden ${status === 'ongoing'
                                        ? 'bg-white shadow-lg shadow-primary/5 ring-1 ring-primary/10'
                                        : 'bg-white shadow-sm hover:shadow-md'
                                        }`}>
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex gap-3 flex-1">
                                                    {/* Icon Box */}
                                                    {/* Icon Box */}
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                                        getSubjectStyles(item.subject).bg,
                                                        getSubjectStyles(item.subject).icon
                                                    )}>
                                                        <Clock className="h-5 w-5" />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-base text-gray-900">
                                                                {item.subject}
                                                            </h3>
                                                            {status === 'ongoing' && (
                                                                <Badge className="bg-primary text-white hover:bg-primary/90 border-none px-1.5 py-0 h-4 text-[9px] uppercase tracking-wider font-bold">
                                                                    Live
                                                                </Badge>
                                                            )}

                                                            {item.lessonHours.length > 1 && (
                                                                <Badge variant="outline" className="border-gray-300 text-gray-700 px-1.5 py-0 h-4 text-[9px] font-semibold">
                                                                    {item.lessonHours.length} JP
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                                <Users className="h-3 w-3" />
                                                                <span className="font-medium text-gray-700">{item.class}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                                <Clock className="h-3 w-3" />
                                                                <span className="font-medium text-gray-700">{item.startTime} - {item.endTime}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Timer className="h-3 w-3" />
                                                                <span>{item.lessonHours.length * 45} Menit</span>
                                                            </div>
                                                        </div>

                                                        {/* Collapsible Detail - Only show for grouped schedules */}
                                                        {item.lessonHours.length > 1 && (
                                                            <div className="mt-3">
                                                                <button
                                                                    onClick={() => toggleGroupExpansion(index)}
                                                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                                                >
                                                                    {expandedGroups.has(index) ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                                                    <span className="font-medium">
                                                                        {expandedGroups.has(index) ? 'Sembunyikan' : 'Lihat'} Detail Per Jam
                                                                    </span>
                                                                </button>

                                                                {expandedGroups.has(index) && (
                                                                    <div className="mt-2 space-y-1.5 pl-5 border-l-2 border-gray-200">
                                                                        {item.lessonHours.map((lessonHour, idx) => {
                                                                            // Calculate time for each lesson hour
                                                                            const timeMap: Record<string, string> = {
                                                                                '1': '07:00 - 07:45',
                                                                                '2': '07:45 - 08:30',
                                                                                '3': '08:30 - 09:15',
                                                                                '4': '09:15 - 10:00',
                                                                                '5': '10:15 - 11:00',
                                                                                '6': '11:00 - 11:45',
                                                                                '7': '11:45 - 12:30',
                                                                                '8': '13:00 - 13:45',
                                                                                '9': '13:45 - 14:30'
                                                                            };
                                                                            return (
                                                                                <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                                                                                    <span className="font-semibold text-gray-700">Jam {idx + 1}:</span>
                                                                                    <span>{timeMap[lessonHour] || 'N/A'}</span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                                    {item.hasAttendance ? (
                                                        <>
                                                            <Badge className="bg-green-600 text-white hover:bg-green-700 border-none px-2.5 py-0.5 h-6 text-xs font-semibold">
                                                                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                                                Sudah Diisi
                                                            </Badge>
                                                            {onFillFilter && (
                                                                <Button
                                                                    size="sm"
                                                                    className="h-8 px-3 text-xs rounded-md font-medium transition-all w-full sm:w-auto min-w-[120px] bg-primary hover:bg-primary/90 text-white"
                                                                    onClick={() => {
                                                                        const classId = classes.find(c => c.name === item.class)?.id || '';
                                                                        const lessonHourStr = lessonRange + ` (${item.startTime}-${item.endTime})`;
                                                                        onFillFilter(classId, item.subject, lessonHourStr);
                                                                    }}
                                                                >
                                                                    <ClipboardCheck className="h-3.5 w-3.5 mr-1.5 text-white" />
                                                                    Cek Presensi
                                                                </Button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Badge className="bg-red-600 text-white hover:bg-red-700 border-none px-2.5 py-0.5 h-6 text-xs font-semibold">
                                                                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                                                Belum Diisi
                                                            </Badge>
                                                            {onFillFilter && (
                                                                <Button
                                                                    size="sm"
                                                                    className="h-8 px-3 text-xs rounded-md font-medium transition-all w-full sm:w-auto min-w-[120px] bg-primary hover:bg-primary/90 text-white"
                                                                    onClick={() => {
                                                                        const classId = classes.find(c => c.name === item.class)?.id || '';
                                                                        const lessonHourStr = lessonRange + ` (${item.startTime}-${item.endTime})`;
                                                                        onFillFilter(classId, item.subject, lessonHourStr);
                                                                    }}
                                                                >
                                                                    <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
                                                                    Isi Presensi
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
