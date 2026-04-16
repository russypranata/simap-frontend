'use client';

import React, { useRef, useState } from 'react';
import {
    ClipboardCheck,
    Users,
    UserX,
    Clock,
    UserCheck,
    FileText,
    ArrowRight,
    Sun,
    Moon,
    BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { StatCard } from '@/features/shared/components/StatCard';
import { ErrorState } from '@/features/shared/components/ErrorState';
import { SkeletonStatCard } from '@/features/shared/components/SkeletonBlocks';
import { useAttendanceSummary, useDailyAttendance } from '../hooks/useAdminAttendance';
import { useAcademicYear } from '@/context/AcademicYearContext';

const statusColors: Record<string, string> = {
    present:  'text-green-600 bg-green-50 border-green-200',
    excused:  'text-blue-600 bg-blue-50 border-blue-200',
    absent:   'text-red-600 bg-red-50 border-red-200',
    late:     'text-amber-600 bg-amber-50 border-amber-200',
};

const statusLabels: Record<string, string> = {
    present: 'Hadir',
    excused: 'Izin/Sakit',
    absent:  'Alpha',
    late:    'Terlambat',
};

export const AttendanceDashboard: React.FC = () => {
    const todayRef = useRef(new Date().toISOString().split('T')[0]);
    const [selectedDate, setSelectedDate] = useState(todayRef.current);
    const { academicYear: activeYear } = useAcademicYear();

    const {
        data: summary,
        isLoading: summaryLoading,
        isError: summaryError,
        refetch: refetchSummary,
        error: summaryErrorObj,
    } = useAttendanceSummary(selectedDate);

    const {
        data: recentData,
        isLoading: recentLoading,
    } = useDailyAttendance({ date: selectedDate, per_page: 5, page: 1 });

    const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="space-y-6">
            {/* Page Header — konsisten dengan halaman lain (inline, bukan PageHeader component) */}
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
                        Rekapitulasi kehadiran siswa T.A. {activeYear.academicYear} — {formattedDate}
                    </p>
                </div>
                {/* Filter tanggal */}
                <div className="flex items-center gap-2">
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-[160px] h-9"
                    />
                </div>
            </div>

            {summaryError ? (
                <ErrorState
                    error={(summaryErrorObj as Error)?.message || 'Gagal memuat data presensi.'}
                    onRetry={refetchSummary}
                />
            ) : (
                <>
                    {/* ── Presensi Mata Pelajaran ── */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Presensi Mata Pelajaran</span>
                            {!summaryLoading && summary && (
                                <Badge variant="outline" className="text-xs text-slate-500 border-slate-200">
                                    {summary.mapelTotal} siswa tercatat
                                </Badge>
                            )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {summaryLoading ? (
                                Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
                            ) : (
                                <>
                                    <StatCard
                                        title="Hadir"
                                        value={summary?.present ?? 0}
                                        subtitle={`${summary?.attendanceRate ?? 0}% dari ${summary?.totalStudents ?? 0} siswa`}
                                        icon={UserCheck}
                                        color="green"
                                    />
                                    <StatCard
                                        title="Alpha"
                                        value={summary?.absent ?? 0}
                                        icon={UserX}
                                        color="red"
                                    />
                                    <StatCard
                                        title="Terlambat"
                                        value={summary?.late ?? 0}
                                        icon={Clock}
                                        color="amber"
                                    />
                                    <StatCard
                                        title="Izin / Sakit"
                                        value={summary?.excused ?? 0}
                                        icon={FileText}
                                        color="purple"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Presensi Pagi & Sholat ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Presensi Pagi */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                                        <Sun className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">Keterlambatan Pagi</CardTitle>
                                        <CardDescription className="text-xs">Siswa yang tercatat terlambat masuk</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {summaryLoading ? (
                                    <div className="h-12 bg-slate-100 rounded animate-pulse" />
                                ) : (
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-bold text-slate-900 tabular-nums">
                                            {summary?.morningPresent ?? 0}
                                        </span>
                                        <span className="text-sm text-slate-500 mb-1">siswa tercatat</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Presensi Sholat */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                        <Moon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">Presensi Sholat</CardTitle>
                                        <CardDescription className="text-xs">Kehadiran sholat berjamaah hari ini</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {summaryLoading ? (
                                    <div className="h-12 bg-slate-100 rounded animate-pulse" />
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-end gap-3">
                                            <span className="text-4xl font-bold text-slate-900 tabular-nums">
                                                {summary?.prayerPresent ?? 0}
                                            </span>
                                            <span className="text-sm text-slate-500 mb-1">
                                                dari {summary?.prayerTotal ?? 0} sesi
                                            </span>
                                        </div>
                                        {(summary?.prayerTotal ?? 0) > 0 && (
                                            <Progress
                                                value={((summary?.prayerPresent ?? 0) / (summary?.prayerTotal ?? 1)) * 100}
                                                className="h-1.5 bg-slate-100"
                                            />
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Breakdown + Log Terbaru ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Ringkasan Ketidakhadiran Mapel */}
                        <div className="lg:col-span-1">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Ringkasan Ketidakhadiran</CardTitle>
                                    <CardDescription>Breakdown presensi mapel hari ini</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {summaryLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                                                        <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded animate-pulse" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            {[
                                                { label: 'Alpha', value: summary?.absent ?? 0, color: 'bg-red-500' },
                                                { label: 'Terlambat', value: summary?.late ?? 0, color: 'bg-amber-500' },
                                                { label: 'Izin/Sakit', value: summary?.excused ?? 0, color: 'bg-blue-500' },
                                            ].map(({ label, value, color }) => (
                                                <div key={label} className="space-y-1.5">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-600">{label}</span>
                                                        <span className="font-medium text-slate-800">{value} Siswa</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${color}`}
                                                            style={{
                                                                width: `${(summary?.totalStudents ?? 0) > 0
                                                                    ? Math.min((value / (summary?.totalStudents ?? 1)) * 100, 100)
                                                                    : 0}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Log Presensi Mapel Terbaru */}
                        <div className="lg:col-span-2">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between pb-3">
                                    <div>
                                        <CardTitle className="text-base">Log Presensi Mapel Terbaru</CardTitle>
                                        <CardDescription>Data presensi mata pelajaran hari ini</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 text-xs" asChild>
                                        <Link href="/admin/attendance/report">
                                            Lihat Semua <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                        </Link>
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {recentLoading ? (
                                        <div className="divide-y divide-slate-100">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={i} className="p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse" />
                                                        <div className="space-y-1.5">
                                                            <div className="h-3.5 w-28 bg-slate-100 rounded animate-pulse" />
                                                            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                                                        </div>
                                                    </div>
                                                    <div className="h-5 w-14 bg-slate-100 rounded animate-pulse" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : recentData?.data && recentData.data.length > 0 ? (
                                        <div className="divide-y divide-slate-100">
                                            {recentData.data.map((log) => (
                                                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-xs border border-slate-200 flex-shrink-0">
                                                            {(log.studentName ?? '??').substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900 text-sm">{log.studentName ?? '-'}</p>
                                                            <p className="text-xs text-slate-500">
                                                                {log.className ?? '-'}
                                                                {log.subjectName ? ` • ${log.subjectName}` : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className={`uppercase text-[10px] tracking-wider font-semibold ${statusColors[log.status] ?? 'text-slate-600 bg-slate-50 border-slate-200'}`}
                                                    >
                                                        {statusLabels[log.status] ?? log.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-center border-t border-slate-100">
                                            <ClipboardCheck className="h-7 w-7 text-slate-300 mb-2" />
                                            <p className="text-slate-500 text-sm">Belum ada data presensi untuk tanggal ini.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
