'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    ArrowLeft,
    CalendarCheck,
    Users,
    TrendingUp,
    Clock,
    BookOpen,
    Calendar,
    Filter,
} from 'lucide-react';
import { EmptyState } from '@/features/shared/components/EmptyState';
import { ErrorState } from '@/features/shared/components/ErrorState';
import { SkeletonTableRow } from '@/features/shared/components/SkeletonBlocks';
import { PaginationControls } from '@/features/shared/components/PaginationControls';
import {
    useMutamayizinAttendanceSessions,
    useMutamayizinAttendanceSession,
    useMutamayizinExtracurricularDetail,
} from '../hooks/useMutamayizinEkskul';
import { getAcademicYears } from '../services/mutamayizinService';
import type { AcademicYear, AttendanceSession } from '../services/mutamayizinService';

// ─── Status Badge ─────────────────────────────────────────────────────────────

const getStatusBadgeClass = (status: string): string => {
    const s = status.toLowerCase();
    if (s === 'hadir' || s === 'present') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'sakit' || s === 'sick') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s === 'izin' || s === 'permitted') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200'; // alpa / absent
};

const getStatusLabel = (status: string): string => {
    const s = status.toLowerCase();
    if (s === 'present') return 'Hadir';
    if (s === 'sick') return 'Sakit';
    if (s === 'permitted') return 'Izin';
    if (s === 'absent') return 'Alpa';
    return status;
};

// ─── Session Detail Modal ─────────────────────────────────────────────────────

interface SessionDetailModalProps {
    tutorId: number;
    sessionId: number | null;
    open: boolean;
    onClose: () => void;
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
    tutorId,
    sessionId,
    open,
    onClose,
}) => {
    const { data: detail, isLoading, error } = useMutamayizinAttendanceSession(
        tutorId,
        sessionId ?? 0
    );

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-900">
                        Detail Sesi Presensi
                    </DialogTitle>
                    <DialogDescription>
                        Informasi lengkap sesi dan daftar kehadiran siswa
                    </DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="space-y-3 py-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
                        ))}
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-600 py-4">
                        Gagal memuat detail sesi presensi.
                    </p>
                )}

                {detail && !isLoading && (
                    <div className="space-y-5">
                        {/* Info Sesi */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div>
                                <p className="text-xs text-muted-foreground">Tanggal</p>
                                <p className="font-semibold text-slate-900 text-sm">
                                    {formatDate(detail.date)}
                                </p>
                            </div>
                            {(detail.start_time || detail.end_time) && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Waktu</p>
                                    <p className="font-semibold text-slate-900 text-sm flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        {detail.start_time ?? '-'} – {detail.end_time ?? '-'}
                                    </p>
                                </div>
                            )}
                            {detail.topic && (
                                <div className="col-span-2">
                                    <p className="text-xs text-muted-foreground">Topik / Materi</p>
                                    <p className="font-semibold text-slate-900 text-sm flex items-center gap-1">
                                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                        {detail.topic}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-center">
                                <p className="text-2xl font-bold text-green-700">{detail.stats.present}</p>
                                <p className="text-xs text-green-600 mt-0.5">Hadir</p>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                                <p className="text-2xl font-bold text-slate-700">{detail.stats.total}</p>
                                <p className="text-xs text-slate-500 mt-0.5">Total Siswa</p>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-center">
                                <p className="text-2xl font-bold text-blue-700">{detail.stats.percentage}%</p>
                                <p className="text-xs text-blue-600 mt-0.5">Persentase</p>
                            </div>
                        </div>

                        {/* Daftar Siswa */}
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-800" />
                                Daftar Kehadiran Siswa
                            </h4>
                            {detail.records.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">
                                    Belum ada data kehadiran
                                </p>
                            ) : (
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="text-left p-3 font-medium">No</th>
                                                <th className="text-left p-3 font-medium">NIS</th>
                                                <th className="text-left p-3 font-medium">Nama Siswa</th>
                                                <th className="text-left p-3 font-medium">Kelas</th>
                                                <th className="text-center p-3 font-medium">Status</th>
                                                <th className="text-left p-3 font-medium">Catatan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detail.records.map((record, idx) => (
                                                <tr key={record.id} className="border-t hover:bg-muted/20">
                                                    <td className="p-3">{idx + 1}</td>
                                                    <td className="p-3 font-mono text-xs">{record.nis}</td>
                                                    <td className="p-3 font-medium">{record.name}</td>
                                                    <td className="p-3">{record.class}</td>
                                                    <td className="p-3 text-center">
                                                        <Badge
                                                            variant="outline"
                                                            className={getStatusBadgeClass(record.status)}
                                                        >
                                                            {getStatusLabel(record.status)}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-muted-foreground text-xs">
                                                        {record.note ?? '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const EkskulAttendance: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const tutorId = Number(params?.tutorId ?? 0);

    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>('all');
    const [selectedSemester, setSelectedSemester] = useState<string>('all');
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch academic years
    useEffect(() => {
        getAcademicYears()
            .then(setAcademicYears)
            .catch(() => {/* silently ignore */});
    }, []);

    // Fetch ekskul detail (name + tutor name)
    const { data: ekskulDetail } = useMutamayizinExtracurricularDetail(tutorId);

    // Build query params
    const queryParams = useMemo(() => {
        const p: { academic_year_id?: number | string; semester?: string; page?: number } = {
            page: currentPage,
        };
        if (selectedAcademicYearId !== 'all') p.academic_year_id = selectedAcademicYearId;
        if (selectedSemester !== 'all') p.semester = selectedSemester;
        return p;
    }, [selectedAcademicYearId, selectedSemester, currentPage]);

    const { data: sessionsData, isLoading, error, refetch } = useMutamayizinAttendanceSessions(
        tutorId,
        queryParams
    );

    const sessions: AttendanceSession[] = sessionsData?.data ?? [];
    const meta = sessionsData?.meta;
    const totalItems = meta?.total ?? 0;
    const totalPages = meta?.last_page ?? 1;

    const handleRowClick = (session: AttendanceSession) => {
        setSelectedSessionId(session.id);
        setIsModalOpen(true);
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

    const getAttendanceBadgeClass = (percentage: number) => {
        if (percentage >= 80) return 'bg-green-100 text-green-700 border-green-200';
        if (percentage >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-red-100 text-red-700 border-red-200';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/mutamayizin-coordinator/tutors')}
                            className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Button>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Riwayat{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Presensi
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <CalendarCheck className="h-5 w-5" />
                        </div>
                    </div>
                    {ekskulDetail && (
                        <p className="text-muted-foreground mt-1">
                            <span className="font-medium text-foreground">{ekskulDetail.name}</span>
                            {' · '}
                            {ekskulDetail.tutorName}
                        </p>
                    )}
                </div>
            </div>

            {/* Error State */}
            {error && (
                <ErrorState
                    error={(error as Error).message || 'Gagal memuat data presensi'}
                    onRetry={() => refetch()}
                />
            )}

            {/* Table Card */}
            {!error && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <CalendarCheck className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">
                                        Sesi Presensi
                                    </CardTitle>
                                    <CardDescription>
                                        Klik baris untuk melihat detail kehadiran siswa
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                {totalItems} Sesi
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Toolbar */}
                        <div className="px-4 pb-4 pt-2 border-b">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Select
                                    value={selectedAcademicYearId}
                                    onValueChange={(v) => {
                                        setSelectedAcademicYearId(v);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-[200px] h-9">
                                        <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                        <SelectValue placeholder="Tahun Ajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tahun Ajaran</SelectItem>
                                        {academicYears.map((ay) => (
                                            <SelectItem key={ay.id} value={String(ay.id)}>
                                                {ay.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={selectedSemester}
                                    onValueChange={(v) => {
                                        setSelectedSemester(v);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-[160px] h-9">
                                        <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                        <SelectValue placeholder="Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Semester</SelectItem>
                                        <SelectItem value="1">Ganjil</SelectItem>
                                        <SelectItem value="2">Genap</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                        <th className="text-left p-4 font-medium text-sm min-w-[160px]">Tanggal</th>
                                        <th className="text-left p-4 font-medium text-sm min-w-[200px]">Topik / Materi</th>
                                        <th className="text-center p-4 font-medium text-sm w-32">Hadir</th>
                                        <th className="text-center p-4 font-medium text-sm w-32">Total Siswa</th>
                                        <th className="text-center p-4 font-medium text-sm w-36">Persentase</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <SkeletonTableRow key={i} cols={6} />
                                        ))
                                    ) : sessions.length === 0 ? (
                                        <tr>
                                            <td colSpan={6}>
                                                <EmptyState
                                                    icon={CalendarCheck}
                                                    title="Tidak Ada Sesi Presensi"
                                                    description="Belum ada sesi presensi untuk filter yang dipilih."
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        sessions.map((session, index) => {
                                            const percentage =
                                                session.totalCount > 0
                                                    ? Math.round(
                                                          (session.presentCount / session.totalCount) * 100
                                                      )
                                                    : 0;
                                            const rowNum =
                                                ((currentPage - 1) * (meta?.per_page ?? 10)) + index + 1;
                                            return (
                                                <tr
                                                    key={session.id}
                                                    className="border-b hover:bg-blue-50/40 transition-colors cursor-pointer"
                                                    onClick={() => handleRowClick(session)}
                                                >
                                                    <td className="p-4 text-sm text-muted-foreground">
                                                        {rowNum}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                                            <span className="text-sm font-medium">
                                                                {formatDate(session.date)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm text-slate-600">
                                                        {session.topic ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <BookOpen className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                                                {session.topic}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground italic">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className="font-semibold text-green-700">
                                                            {session.presentCount}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className="font-semibold text-slate-700">
                                                            {session.totalCount}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <Badge
                                                            variant="outline"
                                                            className={getAttendanceBadgeClass(percentage)}
                                                        >
                                                            <TrendingUp className="h-3 w-3 mr-1" />
                                                            {percentage}%
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {!isLoading && totalItems > 0 && (
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                startIndex={((currentPage - 1) * (meta?.per_page ?? 10)) + 1}
                                endIndex={Math.min(currentPage * (meta?.per_page ?? 10), totalItems)}
                                itemsPerPage={meta?.per_page ?? 10}
                                itemLabel="sesi"
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={() => {/* server-side pagination */}}
                            />
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Session Detail Modal */}
            <SessionDetailModal
                tutorId={tutorId}
                sessionId={selectedSessionId}
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSessionId(null);
                }}
            />
        </div>
    );
};
