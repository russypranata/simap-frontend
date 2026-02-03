'use client';

import React from 'react';
import {
    ClipboardCheck,
    Users,
    UserX,
    Clock,
    UserCheck,
    Calendar,
    ArrowRight,
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
import { Progress } from '@/components/ui/progress';
import { MOCK_ATTENDANCE_STATS, MOCK_RECENT_ATTENDANCE } from '../data/mockAttendanceData';
import { AttendanceStatus } from '../types/attendance';

const statusColors: Record<AttendanceStatus, string> = {
    present: 'text-green-600 bg-green-50 border-green-200',
    sick: 'text-blue-600 bg-blue-50 border-blue-200',
    permission: 'text-purple-600 bg-purple-50 border-purple-200',
    alpha: 'text-red-600 bg-red-50 border-red-200',
    late: 'text-amber-600 bg-amber-50 border-amber-200',
};

const statusLabels: Record<AttendanceStatus, string> = {
    present: 'Hadir',
    sick: 'Sakit',
    permission: 'Izin',
    alpha: 'Alpha',
    late: 'Terlambat',
};

export const AttendanceDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Dashboard{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Presensi
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <ClipboardCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Rekapitulasi kehadiran siswa hari ini, {new Date(MOCK_ATTENDANCE_STATS.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.
                    </p>
                </div>
                <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Lihat Laporan Bulanan
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Siswa</p>
                            <h3 className="text-2xl font-bold text-slate-900">{MOCK_ATTENDANCE_STATS.totalStudents}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <UserCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Hadir</p>
                            <h3 className="text-2xl font-bold text-slate-900">{MOCK_ATTENDANCE_STATS.present}</h3>
                            <span className="text-xs text-green-600 font-medium">{MOCK_ATTENDANCE_STATS.attendanceRate}% Kehadiran</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <UserX className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Alpha / Absen</p>
                            <h3 className="text-2xl font-bold text-slate-900">{MOCK_ATTENDANCE_STATS.alpha}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Terlambat</p>
                            <h3 className="text-2xl font-bold text-slate-900">{MOCK_ATTENDANCE_STATS.late}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Breakdown & Recent Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle>Ringkasan Ketidakhadiran</CardTitle>
                            <CardDescription>Breakdown data absen hari ini</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Sakit</span>
                                    <span className="font-medium">{MOCK_ATTENDANCE_STATS.sick} Siswa</span>
                                </div>
                                <Progress value={(MOCK_ATTENDANCE_STATS.sick / MOCK_ATTENDANCE_STATS.totalStudents) * 100 * 5} className="h-2 bg-slate-100" indicatorClassName="bg-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Izin</span>
                                    <span className="font-medium">{MOCK_ATTENDANCE_STATS.permission} Siswa</span>
                                </div>
                                <Progress value={(MOCK_ATTENDANCE_STATS.permission / MOCK_ATTENDANCE_STATS.totalStudents) * 100 * 5} className="h-2 bg-slate-100" indicatorClassName="bg-purple-500" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Alpha</span>
                                    <span className="font-medium">{MOCK_ATTENDANCE_STATS.alpha} Siswa</span>
                                </div>
                                <Progress value={(MOCK_ATTENDANCE_STATS.alpha / MOCK_ATTENDANCE_STATS.totalStudents) * 100 * 5} className="h-2 bg-slate-100" indicatorClassName="bg-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Log Presensi Terbaru</CardTitle>
                                <CardDescription>Data masuk real-time hari ini</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                Lihat Semua <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {MOCK_RECENT_ATTENDANCE.map((log) => (
                                    <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-xs border border-slate-200">
                                                {log.studentName.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{log.studentName}</p>
                                                <p className="text-xs text-slate-500">{log.className} • {log.time !== '-' ? log.time : 'Tidak Absen'}</p>
                                                {log.notes && <p className="text-xs text-slate-400 italic mt-0.5">{log.notes}</p>}
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`uppercase text-[10px] tracking-wider font-semibold ${statusColors[log.status]}`}
                                        >
                                            {statusLabels[log.status]}
                                        </Badge>
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
