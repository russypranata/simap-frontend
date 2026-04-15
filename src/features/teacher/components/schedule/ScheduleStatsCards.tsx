'use client';

import React from 'react';
import { Calendar, Clock, BookOpen, TrendingUp } from 'lucide-react';
import { StatCard } from '@/features/shared/components';

interface ScheduleStats {
    totalHours: number;
    todaySchedule: number;
    weeklySchedule: number;
    totalSubjects: number;
}

interface ScheduleStatsCardsProps {
    stats: ScheduleStats;
}

export const ScheduleStatsCards: React.FC<ScheduleStatsCardsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Total Jam Mengajar" value={stats.totalHours} subtitle="Jam per minggu" icon={Clock} color="blue" />
            <StatCard title="Jadwal Hari Ini" value={stats.todaySchedule} subtitle="Sesi hari ini" icon={Calendar} color="green" />
            <StatCard title="Jadwal Minggu Ini" value={stats.weeklySchedule} subtitle="Total sesi seminggu" icon={TrendingUp} color="purple" />
            <StatCard title="Mata Pelajaran" value={stats.totalSubjects} subtitle="Mapel yang diajar" icon={BookOpen} color="amber" />
        </div>
    );
};
