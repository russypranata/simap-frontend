'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Schedule, TeachingJournal, AttendanceRecord } from '../../types/teacher';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Clock,
    BookOpen,
    Users,
    FileText,
    ClipboardCheck,
    MapPin,
    Timer,
    Check,
    Circle
} from 'lucide-react';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface DailyScheduleCalendarProps {
    schedules: Schedule[];
    journals?: TeachingJournal[];
    attendanceRecords?: AttendanceRecord[];
    onJournalClick?: (schedule: Schedule) => void;
    onAttendanceClick?: (schedule: Schedule) => void;
}

export const DailyScheduleCalendar: React.FC<DailyScheduleCalendarProps> = ({
    schedules,
    journals = [],
    attendanceRecords = [],
    onJournalClick,
    onAttendanceClick,
}) => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date());
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

    const getDayName = (date: Date) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[date.getDay()];
    };

    const getSchedulesForDay = (dayName: string) => {
        return schedules.filter((schedule) => schedule.day === dayName);
    };

    const navigateDay = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDate);
        if (direction === 'prev') {
            newDate.setDate(newDate.getDate() - 1);
        } else {
            newDate.setDate(newDate.getDate() + 1);
        }
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const dayName = getDayName(selectedDate);
    const daySchedules = getSchedulesForDay(dayName);
    const isToday = formatDate(selectedDate, 'yyyy-MM-dd') === formatDate(new Date(), 'yyyy-MM-dd');

    const hasJournalForDate = (schedule: Schedule) => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        return journals.some(j =>
            j.date === dateStr &&
            j.class === schedule.class &&
            j.subject === schedule.subject
        );
    };

    const hasAttendanceForDate = (schedule: Schedule) => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        return attendanceRecords.some(a =>
            a.date === dateStr &&
            a.class === schedule.class &&
            a.subject === schedule.subject
        );
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

    const getCurrentTimeStatus = (time: string) => {
        if (selectedDate < new Date(new Date().setHours(0, 0, 0, 0))) return 'completed';
        if (selectedDate > new Date(new Date().setHours(23, 59, 59, 999))) return 'upcoming';

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const [startTime, endTime] = time.split(' - ');

        if (currentTime >= startTime && currentTime <= endTime) return 'ongoing';
        else if (currentTime < startTime) return 'upcoming';
        else return 'completed';
    };

    // Group consecutive schedules with same subject and class
    const groupConsecutiveSchedules = (schedules: Schedule[]) => {
        const sorted = [...schedules].sort((a, b) => a.time.localeCompare(b.time));
        const grouped: Array<{ schedules: Schedule[], startTime: string, endTime: string, jpCount: number }> = [];

        let currentGroup: Schedule[] = [];

        sorted.forEach((schedule, index) => {
            if (currentGroup.length === 0) {
                currentGroup.push(schedule);
            } else {
                const lastSchedule = currentGroup[currentGroup.length - 1];
                const lastEndTime = lastSchedule.time.split(' - ')[1];
                const currentStartTime = schedule.time.split(' - ')[0];

                // Check if consecutive and same subject/class
                if (
                    lastEndTime === currentStartTime &&
                    lastSchedule.subject === schedule.subject &&
                    lastSchedule.class === schedule.class
                ) {
                    currentGroup.push(schedule);
                } else {
                    // Save current group and start new one
                    const firstSchedule = currentGroup[0];
                    const lastSchedule = currentGroup[currentGroup.length - 1];
                    grouped.push({
                        schedules: currentGroup,
                        startTime: firstSchedule.time.split(' - ')[0],
                        endTime: lastSchedule.time.split(' - ')[1],
                        jpCount: currentGroup.length
                    });
                    currentGroup = [schedule];
                }
            }

            // Handle last group
            if (index === sorted.length - 1) {
                const firstSchedule = currentGroup[0];
                const lastSchedule = currentGroup[currentGroup.length - 1];
                grouped.push({
                    schedules: currentGroup,
                    startTime: firstSchedule.time.split(' - ')[0],
                    endTime: lastSchedule.time.split(' - ')[1],
                    jpCount: currentGroup.length
                });
            }
        });

        return grouped;
    };

    const groupedSchedules = groupConsecutiveSchedules(daySchedules);

    return (
        <Card className="border-none shadow-none bg-transparent">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <CalendarIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {formatDate(selectedDate, 'EEEE, dd MMMM yyyy')}
                        </h2>
                        <p className="text-sm text-muted-foreground font-medium">
                            {groupedSchedules.length} Sesi Mengajar
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateDay('prev')}
                        className="h-8 w-8 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToToday}
                        disabled={isToday}
                        className={cn(
                            "h-8 px-4 text-xs font-semibold rounded-lg transition-all",
                            isToday ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:bg-white hover:shadow-sm"
                        )}
                    >
                        Hari Ini
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateDay('next')}
                        className="h-8 w-8 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <CardContent className="px-0">
                {groupedSchedules.length > 0 ? (
                    <div className="relative space-y-0">
                        {/* Clean Vertical Line - Adjusted Position */}
                        <div className="absolute left-[90px] top-2 bottom-6 w-[2px] bg-gray-100" />

                        {groupedSchedules.map((group, groupIndex) => {
                            const schedule = group.schedules[0]; // Use first schedule for display
                            const timeStatus = getCurrentTimeStatus(`${group.startTime} - ${group.endTime}`);
                            const hasJournal = hasJournalForDate(schedule);
                            const hasAttendance = hasAttendanceForDate(schedule);
                            const styles = getSubjectStyles(schedule.subject);
                            const isExpanded = expandedGroups.has(groupIndex);

                            return (
                                <div key={`group-${groupIndex}`} className="relative flex items-start gap-10 group pb-6 last:pb-0">
                                    {/* Time Column - Fixed Width & Aligned */}
                                    <div className="flex flex-col items-end w-[70px] flex-shrink-0 pt-1">
                                        <span className={cn(
                                            "text-base font-bold leading-none tracking-tight",
                                            timeStatus === 'ongoing' ? "text-primary" : "text-gray-900"
                                        )}>
                                            {group.startTime}
                                        </span>
                                        <span className="text-[11px] font-medium text-muted-foreground mt-1.5">
                                            {group.endTime}
                                        </span>
                                    </div>

                                    {/* Schedule Card */}
                                    <div className={cn(
                                        "flex-1 rounded-xl border transition-all duration-300 overflow-hidden",
                                        timeStatus === 'ongoing'
                                            ? "bg-white border-primary shadow-lg shadow-primary/5 ring-1 ring-primary/10"
                                            : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
                                    )}>
                                        {/* Card Accent Strip */}
                                        <div className={cn("h-1 w-full", styles.bg.replace('bg-', 'bg-gradient-to-r from-').replace('100', '500').concat(' to-transparent opacity-80'))} />

                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex gap-3 flex-1">
                                                    {/* Icon Box */}
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                                        styles.bg,
                                                        styles.icon
                                                    )}>
                                                        <BookOpen className="h-5 w-5" />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-base text-gray-900">
                                                                {schedule.subject}
                                                            </h3>
                                                            {timeStatus === 'ongoing' && (
                                                                <Badge className="bg-primary text-white hover:bg-primary/90 border-none px-1.5 py-0 h-4 text-[9px] uppercase tracking-wider font-bold">
                                                                    Live
                                                                </Badge>
                                                            )}
                                                            {group.jpCount > 1 && (
                                                                <Badge variant="outline" className="border-gray-300 text-gray-700 px-1.5 py-0 h-4 text-[9px] font-semibold">
                                                                    {group.jpCount} JP
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                                <Users className="h-3 w-3" />
                                                                <span className="font-medium text-gray-700">{schedule.class}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                                <Clock className="h-3 w-3" />
                                                                <span className="font-medium text-gray-700">{group.startTime} - {group.endTime}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Timer className="h-3 w-3" />
                                                                <span>{group.jpCount * 45} Menit</span>
                                                            </div>
                                                        </div>

                                                        {/* Collapsible Detail - Only show for grouped schedules */}
                                                        {group.jpCount > 1 && (
                                                            <div className="mt-3">
                                                                <button
                                                                    onClick={() => toggleGroupExpansion(groupIndex)}
                                                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                                                >
                                                                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                                                    <span className="font-medium">
                                                                        {isExpanded ? 'Sembunyikan' : 'Lihat'} Detail Per Jam
                                                                    </span>
                                                                </button>

                                                                {isExpanded && (
                                                                    <div className="mt-2 space-y-1.5 pl-5 border-l-2 border-gray-200">
                                                                        {group.schedules.map((sch, idx) => (
                                                                            <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                                                                                <span className="font-semibold text-gray-700">Jam {idx + 1}:</span>
                                                                                <span>{sch.time}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                                    <Button
                                                        variant={hasJournal ? "outline" : "default"}
                                                        size="sm"
                                                        className={cn(
                                                            "h-8 px-3 text-xs rounded-md font-medium transition-all w-full sm:w-auto",
                                                            hasJournal
                                                                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                                                                : timeStatus === 'completed'
                                                                    ? "bg-primary hover:bg-primary/90 text-white"
                                                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary hover:border-primary/30"
                                                        )}
                                                        onClick={() => onJournalClick ? onJournalClick(schedule) : router.push('/journal/new')}
                                                    >
                                                        <FileText className={cn("h-3.5 w-3.5 mr-1.5", hasJournal ? "text-green-600" : "currentColor")} />
                                                        {hasJournal ? "Jurnal Selesai" : "Isi Jurnal"}
                                                    </Button>

                                                    <Button
                                                        variant={hasAttendance ? "outline" : "default"}
                                                        size="sm"
                                                        className={cn(
                                                            "h-8 px-3 text-xs rounded-md font-medium transition-all w-full sm:w-auto",
                                                            hasAttendance
                                                                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                                                                : timeStatus === 'completed'
                                                                    ? "bg-primary hover:bg-primary/90 text-white"
                                                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary hover:border-primary/30"
                                                        )}
                                                        onClick={() => {
                                                            if (onAttendanceClick) {
                                                                onAttendanceClick(schedule);
                                                            } else {
                                                                router.push(`/teacher/attendance?class=${encodeURIComponent(schedule.class)}&subject=${encodeURIComponent(schedule.subject)}`);
                                                            }
                                                        }}
                                                    >
                                                        <ClipboardCheck className={cn("h-3.5 w-3.5 mr-1.5", hasAttendance ? "text-green-600" : "currentColor")} />
                                                        {hasAttendance ? "Presensi Selesai" : "Isi Presensi"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-white rounded-3xl border border-dashed border-gray-200 m-4">
                        <div className="h-24 w-24 rounded-full bg-gray-50 flex items-center justify-center ring-8 ring-gray-50/50">
                            <CalendarIcon className="h-10 w-10 text-gray-300" />
                        </div>
                        <div className="max-w-xs mx-auto">
                            <h3 className="text-xl font-bold text-gray-900">Hari Libur</h3>
                            <p className="text-muted-foreground mt-2 leading-relaxed">
                                Tidak ada jadwal mengajar pada <br />
                                <span className="font-medium text-gray-700">{formatDate(selectedDate, 'EEEE, dd MMMM yyyy')}</span>
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
