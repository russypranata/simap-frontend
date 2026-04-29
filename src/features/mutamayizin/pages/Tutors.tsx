'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Users,
    Search,
    Filter,
    Eye,
    Briefcase,
    Calendar,
    TrendingUp,
    UserCheck,
    Activity,
    CalendarCheck,
    Clock,
    Plus,
    Trash2,
} from 'lucide-react';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { EmptyState } from '@/features/shared/components/EmptyState';
import { ErrorState } from '@/features/shared/components/ErrorState';
import { SkeletonTableRow } from '@/features/shared/components/SkeletonBlocks';
import { PaginationControls } from '@/features/shared/components/PaginationControls';
import {
    useMutamayizinExtracurriculars,
    useMutamayizinExtracurricularDetail,
} from '../hooks/useMutamayizinEkskul';
import {
    getAcademicYears,
    getEkskulSchedules,
    createEkskulSchedule,
    deleteEkskulSchedule,
} from '../services/mutamayizinService';
import type {
    AcademicYear,
    ExtracurricularItem,
    RegularScheduleItem,
} from '../services/mutamayizinService';

// ─── Detail Modal ────────────────────────────────────────────────────────────

interface DetailModalProps {
    tutorId: number | null;
    open: boolean;
    onClose: () => void;
    onViewAttendance?: (tutorId: number) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
    tutorId,
    open,
    onClose,
    onViewAttendance,
}) => {
    const {
        data: detail,
        isLoading,
        error,
    } = useMutamayizinExtracurricularDetail(tutorId ?? 0);

    const [schedules, setSchedules] = useState<RegularScheduleItem[]>([]);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
    const [showAddSchedule, setShowAddSchedule] = useState(false);
    const [newSchedule, setNewSchedule] = useState({ day: '', time_start: '', time_end: '' });
    const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);

    useEffect(() => {
        if (!open || !tutorId) return;
        setIsLoadingSchedules(true);
        getEkskulSchedules(tutorId)
            .then(setSchedules)
            .catch(() => setSchedules([]))
            .finally(() => setIsLoadingSchedules(false));
    }, [open, tutorId]);

    // Reset form saat modal ditutup
    useEffect(() => {
        if (!open) {
            setShowAddSchedule(false);
            setNewSchedule({ day: '', time_start: '', time_end: '' });
        }
    }, [open]);

    const handleAddSchedule = async () => {
        if (!tutorId || !newSchedule.day || !newSchedule.time_start || !newSchedule.time_end) return;
        setIsSubmittingSchedule(true);
        try {
            const created = await createEkskulSchedule(tutorId, newSchedule);
            setSchedules((prev) => [...prev, created]);
            setNewSchedule({ day: '', time_start: '', time_end: '' });
            setShowAddSchedule(false);
        } catch {
            // silently ignore; user can retry
        } finally {
            setIsSubmittingSchedule(false);
        }
    };

    const handleDeleteSchedule = async (scheduleId: number) => {
        if (!tutorId) return;
        // Optimistic update
        setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
        try {
            await deleteEkskulSchedule(tutorId, scheduleId);
        } catch {
            // Rollback on failure — refetch
            getEkskulSchedules(tutorId)
                .then(setSchedules)
                .catch(() => {});
        }
    };

    const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-900">
                        Detail Ekskul
                    </DialogTitle>
                    <DialogDescription>
                        Informasi lengkap ekskul beserta daftar anggota aktif
                    </DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="space-y-3 py-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-10 bg-slate-100 rounded animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-600 py-4">
                        Gagal memuat detail ekskul.
                    </p>
                )}

                {detail && !isLoading && (
                    <div className="space-y-5">
                        {/* Info Ekskul */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Nama Ekskul
                                </p>
                                <p className="font-semibold text-slate-900">
                                    {detail.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Nama Tutor
                                </p>
                                <p className="font-semibold text-slate-900">
                                    {detail.tutorName}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Jumlah Anggota
                                </p>
                                <p className="font-semibold text-slate-900">
                                    {detail.memberCount} siswa
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Kehadiran Rata-rata
                                </p>
                                <p className="font-semibold text-slate-900">
                                    {detail.attendanceRate}%
                                </p>
                            </div>
                        </div>

                        {/* Daftar Anggota */}
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <Users className="h-4 w-4 text-blue-800" />
                                Daftar Anggota Aktif
                            </h4>
                            {detail.members.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">
                                    Belum ada anggota aktif
                                </p>
                            ) : (
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="text-left p-3 font-medium">
                                                    No
                                                </th>
                                                <th className="text-left p-3 font-medium">
                                                    NIS
                                                </th>
                                                <th className="text-left p-3 font-medium">
                                                    Nama Siswa
                                                </th>
                                                <th className="text-left p-3 font-medium">
                                                    Kelas
                                                </th>
                                                <th className="text-center p-3 font-medium">
                                                    Kehadiran
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detail.members.map(
                                                (member, idx) => (
                                                    <tr
                                                        key={member.id}
                                                        className="border-t hover:bg-muted/20"
                                                    >
                                                        <td className="p-3">
                                                            {idx + 1}
                                                        </td>
                                                        <td className="p-3 font-mono text-xs">
                                                            {member.nis}
                                                        </td>
                                                        <td className="p-3 font-medium">
                                                            {member.name}
                                                        </td>
                                                        <td className="p-3">
                                                            {member.class}
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <Badge
                                                                className={
                                                                    member.attendanceRate >=
                                                                    75
                                                                        ? 'bg-green-100 text-green-700 border-green-200'
                                                                        : 'bg-red-100 text-red-700 border-red-200'
                                                                }
                                                            >
                                                                {
                                                                    member.attendanceRate
                                                                }
                                                                %
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Jadwal Reguler */}
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-800" />
                                Jadwal Reguler
                            </h4>

                            {isLoadingSchedules ? (
                                <div className="space-y-2">
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-9 bg-slate-100 rounded animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : schedules.length === 0 && !showAddSchedule ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Belum ada jadwal reguler
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {schedules.map((s) => (
                                        <div
                                            key={s.id}
                                            className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                                    {s.day}
                                                </Badge>
                                                <span className="text-sm text-slate-700">
                                                    {s.time_start} – {s.time_end}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteSchedule(s.id)}
                                                className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Form tambah jadwal */}
                            {showAddSchedule ? (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                                    <div className="grid grid-cols-3 gap-2">
                                        <select
                                            value={newSchedule.day}
                                            onChange={(e) =>
                                                setNewSchedule((prev) => ({ ...prev, day: e.target.value }))
                                            }
                                            className="col-span-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                        >
                                            <option value="">Pilih Hari</option>
                                            {DAYS.map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="time"
                                            value={newSchedule.time_start}
                                            onChange={(e) =>
                                                setNewSchedule((prev) => ({ ...prev, time_start: e.target.value }))
                                            }
                                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                        />
                                        <input
                                            type="time"
                                            value={newSchedule.time_end}
                                            onChange={(e) =>
                                                setNewSchedule((prev) => ({ ...prev, time_end: e.target.value }))
                                            }
                                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setShowAddSchedule(false);
                                                setNewSchedule({ day: '', time_start: '', time_end: '' });
                                            }}
                                            className="h-8"
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleAddSchedule}
                                            disabled={
                                                isSubmittingSchedule ||
                                                !newSchedule.day ||
                                                !newSchedule.time_start ||
                                                !newSchedule.time_end
                                            }
                                            className="h-8 bg-blue-800 hover:bg-blue-900 text-white"
                                        >
                                            {isSubmittingSchedule ? 'Menyimpan...' : 'Tambah'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAddSchedule(true)}
                                    className="mt-3 h-8 gap-1.5 text-blue-800 border-blue-200 hover:bg-blue-50"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Tambah Jadwal
                                </Button>
                            )}
                        </div>

                        {/* Tombol Lihat Presensi */}
                        {onViewAttendance && tutorId && (
                            <div className="flex justify-end pt-2 border-t">
                                <Button
                                    onClick={() => onViewAttendance(tutorId)}
                                    className="bg-blue-800 hover:bg-blue-900 text-white gap-2"
                                >
                                    <CalendarCheck className="h-4 w-4" />
                                    Lihat Presensi
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const MutamayizinTutors: React.FC = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAcademicYearId, setSelectedAcademicYearId] =
        useState<string>('all');
    const [selectedSemester, setSelectedSemester] = useState<string>('all');
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [selectedTutorId, setSelectedTutorId] = useState<number | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch academic years for filter
    useEffect(() => {
        getAcademicYears()
            .then(setAcademicYears)
            .catch(() => {
                /* silently ignore */
            });
    }, []);

    const params = useMemo(() => {
        const p: { academic_year_id?: number | string; semester?: string } = {};
        if (selectedAcademicYearId !== 'all')
            p.academic_year_id = selectedAcademicYearId;
        if (selectedSemester !== 'all')
            p.semester = selectedSemester;
        return p;
    }, [selectedAcademicYearId, selectedSemester]);

    const {
        data: extracurriculars,
        isLoading,
        error,
        refetch,
    } = useMutamayizinExtracurriculars(params);

    // Client-side filter by search
    const filtered = useMemo(() => {
        if (!extracurriculars) return [];
        const q = searchQuery.toLowerCase();
        if (!q) return extracurriculars;
        return extracurriculars.filter(
            (item) =>
                item.tutorName.toLowerCase().includes(q) ||
                item.name.toLowerCase().includes(q) ||
                item.tutorNip.toLowerCase().includes(q),
        );
    }, [extracurriculars, searchQuery]);

    // Reset page on filter/search change (skip first render)
    const isFirstRenderRef = React.useRef(true);
    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [searchQuery, selectedAcademicYearId, selectedSemester, itemsPerPage]);

    // Client-side pagination
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    // Stats
    const totalTutors = extracurriculars?.length ?? 0;
    const avgAttendance =
        extracurriculars && extracurriculars.length > 0
            ? Math.round(
                  extracurriculars.reduce(
                      (sum, e) => sum + e.attendanceRate,
                      0,
                  ) / extracurriculars.length,
              )
            : 0;
    const totalMembers =
        extracurriculars?.reduce((sum, e) => sum + e.memberCount, 0) ?? 0;

    const handleViewDetail = (item: ExtracurricularItem) => {
        setSelectedTutorId(item.id);
        setIsDetailOpen(true);
    };

    const getAttendanceBadgeClass = (rate: number) => {
        if (rate >= 80) return 'bg-green-100 text-green-700 border-green-200';
        if (rate >= 60)
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-red-100 text-red-700 border-red-200';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-linear-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Data{' '}
                            </span>
                            <span className="bg-linear-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Tutor Ekskul
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Monitoring data tutor dan ekskul yang terdaftar
                    </p>
                </div>
            </div>

            {/* Stats Card */}
            <Card className="overflow-hidden p-0">
                <div className="bg-blue-800 p-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-40 h-40 border-20 border-white rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 right-1/3 w-20 h-20 border-8 border-white rounded-full translate-y-1/2" />
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Statistik Tutor Ekskul
                            </h2>
                            <p className="text-blue-100 text-sm">
                                Ringkasan data tenaga pengajar ekskul
                            </p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-blue-100 rounded-full mb-1.5">
                                <Users className="h-4 w-4 text-blue-800" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                {totalTutors}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">
                                Total Ekskul
                            </p>
                        </div>
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-green-100 rounded-full mb-1.5">
                                <UserCheck className="h-4 w-4 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                                {totalMembers}
                            </p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">
                                Total Anggota
                            </p>
                        </div>
                        <div className="p-2.5 text-center">
                            <div className="inline-flex p-2 bg-purple-100 rounded-full mb-1.5">
                                <Activity className="h-4 w-4 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-600">
                                {avgAttendance}%
                            </p>
                            <p className="text-xs font-medium text-muted-foreground mt-0.5">
                                Rata-rata Kehadiran
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Error State */}
            {error && (
                <ErrorState
                    error={
                        (error as Error).message || 'Gagal memuat data ekskul'
                    }
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
                                    <Briefcase className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold">
                                        Daftar Tutor Ekskul
                                    </CardTitle>
                                    <CardDescription>
                                        Data lengkap tutor beserta ekskul yang
                                        diampu
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                {totalItems} Tutor
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Toolbar */}
                        <div className="px-4 pb-4 pt-2 border-b">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama tutor, ekskul, atau NIP..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-10 h-11"
                                    />
                                </div>
                                <Select
                                    value={selectedAcademicYearId}
                                    onValueChange={setSelectedAcademicYearId}
                                >
                                    <SelectTrigger className="w-[200px] h-11">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Tahun Ajaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Tahun Ajaran
                                        </SelectItem>
                                        {academicYears.map((ay) => (
                                            <SelectItem
                                                key={ay.id}
                                                value={String(ay.id)}
                                            >
                                                {ay.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedSemester}
                                    onValueChange={setSelectedSemester}
                                >
                                    <SelectTrigger className="w-[160px] h-11">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Semester
                                        </SelectItem>
                                        <SelectItem value="1">
                                            Ganjil
                                        </SelectItem>
                                        <SelectItem value="2">
                                            Genap
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-sm w-12">
                                            No
                                        </th>
                                        <th className="text-left p-4 font-medium text-sm min-w-48">
                                            Nama Tutor
                                        </th>
                                        <th className="text-left p-4 font-medium text-sm min-w-36">
                                            Nama Ekskul
                                        </th>
                                        <th className="text-center p-4 font-medium text-sm w-36">
                                            Jumlah Anggota
                                        </th>
                                        <th className="text-center p-4 font-medium text-sm w-44">
                                            Kehadiran Rata-rata
                                        </th>
                                        <th className="text-left p-4 font-medium text-sm w-40">
                                            Tanggal Bergabung
                                        </th>
                                        <th className="text-center p-4 font-medium text-sm w-28">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <SkeletonTableRow
                                                    key={i}
                                                    cols={7}
                                                />
                                            ),
                                        )
                                    ) : paginated.length === 0 ? (
                                        <tr>
                                            <td colSpan={7}>
                                                <EmptyState
                                                    icon={Briefcase}
                                                    title="Tidak Ada Data Ekskul"
                                                    description={
                                                        searchQuery
                                                            ? `Tidak ada ekskul yang cocok dengan pencarian "${searchQuery}"`
                                                            : 'Belum ada data tutor ekskul yang tersedia.'
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        paginated.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className="border-b hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="p-4 text-sm">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">
                                                            {item.tutorName}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground font-mono">
                                                            {item.tutorNip}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className="bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100">
                                                        {item.name}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="font-semibold text-slate-800">
                                                        {item.memberCount}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground ml-1">
                                                        siswa
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Badge
                                                        className={getAttendanceBadgeClass(
                                                            item.attendanceRate,
                                                        )}
                                                    >
                                                        <TrendingUp className="h-3 w-3 mr-1" />
                                                        {item.attendanceRate}%
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {formatDate(
                                                            item.joinDate,
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleViewDetail(
                                                                item,
                                                            )
                                                        }
                                                        className="h-8 px-3 bg-blue-100 hover:bg-blue-200 text-blue-800 hover:text-blue-900 border-blue-200 gap-1.5"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Lihat Detail
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
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
                                startIndex={startIndex + 1}
                                endIndex={Math.min(
                                    startIndex + itemsPerPage,
                                    totalItems,
                                )}
                                itemsPerPage={itemsPerPage}
                                itemLabel="tutor"
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Detail Modal */}
            <DetailModal
                tutorId={selectedTutorId}
                open={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedTutorId(null);
                }}
                onViewAttendance={(tutorId) => {
                    setIsDetailOpen(false);
                    setSelectedTutorId(null);
                    router.push(`/mutamayizin-coordinator/tutors/${tutorId}/attendance`);
                }}
            />
        </div>
    );
};
