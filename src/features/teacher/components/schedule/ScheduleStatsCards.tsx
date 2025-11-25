'use client';
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, BookOpen, TrendingUp } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Jam Mengajar */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Jam Mengajar</CardTitle>
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalHours}</div>
                    <p className="text-xs text-muted-foreground">
                        Jam mengajar per minggu
                    </p>
                </CardContent>
            </Card>

            {/* Jadwal Hari Ini */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.todaySchedule}</div>
                    <p className="text-xs text-muted-foreground">
                        Sesi mengajar hari ini
                    </p>
                </CardContent>
            </Card>

            {/* Jadwal Minggu Ini */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Jadwal Minggu Ini</CardTitle>
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats.weeklySchedule}</div>
                    <p className="text-xs text-muted-foreground">
                        Total sesi dalam seminggu
                    </p>
                </CardContent>
            </Card>

            {/* Mata Pelajaran */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mata Pelajaran</CardTitle>
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <BookOpen className="h-4 w-4 text-orange-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.totalSubjects}</div>
                    <p className="text-xs text-muted-foreground">
                        Mata pelajaran yang diajar
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
