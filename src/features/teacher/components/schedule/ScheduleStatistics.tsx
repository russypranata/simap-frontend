'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Schedule } from '../../types/teacher';
import { Calendar, TrendingUp, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ScheduleStatisticsProps {
    schedules: Schedule[];
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];

export const ScheduleStatistics: React.FC<ScheduleStatisticsProps> = ({ schedules }) => {
    // Calculate statistics
    const getDailyDistribution = () => {
        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
        return days.map((day) => ({
            name: day,
            jumlah: schedules.filter((s) => s.day === day).length,
        }));
    };

    const getSubjectDistribution = () => {
        const subjectMap = new Map<string, number>();
        schedules.forEach((schedule) => {
            const count = subjectMap.get(schedule.subject) || 0;
            subjectMap.set(schedule.subject, count + 1);
        });

        return Array.from(subjectMap.entries()).map(([name, value]) => ({
            name,
            value,
        }));
    };

    const getClassDistribution = () => {
        const classMap = new Map<string, number>();
        schedules.forEach((schedule) => {
            const count = classMap.get(schedule.class) || 0;
            classMap.set(schedule.class, count + 1);
        });

        return Array.from(classMap.entries())
            .map(([name, jumlah]) => ({ name, jumlah }))
            .sort((a, b) => b.jumlah - a.jumlah);
    };

    const getTotalHours = () => {
        // Assuming each session is 45 minutes (0.75 hours)
        return schedules.length * 0.75;
    };

    const dailyData = getDailyDistribution();
    const subjectData = getSubjectDistribution();
    const classData = getClassDistribution();

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Sesi Mengajar</p>
                                <p className="text-3xl font-bold mt-2">{schedules.length}</p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-50">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Jam Mengajar</p>
                                <p className="text-3xl font-bold mt-2">{getTotalHours().toFixed(1)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-50">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Mata Pelajaran</p>
                                <p className="text-3xl font-bold mt-2">{subjectData.length}</p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-50">
                                <BookOpen className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily Distribution Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Distribusi Jadwal per Hari</CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="jumlah" fill="#3b82f6" name="Jumlah Sesi" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi Mata Pelajaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={subjectData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {subjectData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Class Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Distribusi per Kelas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={classData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={80} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="jumlah" fill="#10b981" name="Jumlah Sesi" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
