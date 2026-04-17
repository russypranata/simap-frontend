'use client';

import React, { useState, useMemo } from 'react';
import {
    UserCheck,
    Search,
    School,
    AlertCircle,
    FileX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { ClassRoom } from '../types/class';
import {
    useHomeroomList,
    useTeachers,
    useAssignHomeroom,
    useAcademicYearsList,
} from '../hooks/useClassManagement';
import { HomeroomListSkeleton, AssignHomeroomModal } from '../components/class';
import { StatCard, ErrorState, EmptyState } from '@/features/shared/components';
import { cn } from '@/lib/utils';

export const HomeroomList: React.FC = () => {
    // ── Filter State ──────────────────────────────────────────────────────
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    // ── Modal State ───────────────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassRoom | null>(null);

    // ── Data Fetching ─────────────────────────────────────────────────────
    const { data: academicYears = [], isLoading: isYearsLoading } = useAcademicYearsList();

    // Auto-select active year
    React.useEffect(() => {
        if (academicYears.length > 0 && !selectedYear) {
            const activeYear = academicYears.find(y => y.isActive);
            setSelectedYear(activeYear?.id ?? academicYears[0].id);
        }
    }, [academicYears, selectedYear]);

    const {
        data: classes = [],
        isLoading: isClassesLoading,
        isError,
        refetch,
    } = useHomeroomList(selectedYear);

    const { data: teachers = [] } = useTeachers();

    const assignMutation = useAssignHomeroom();

    const isLoading = isYearsLoading || isClassesLoading;

    // ── Stats ─────────────────────────────────────────────────────────────
    // Hanya kelas reguler yang relevan untuk wali kelas
    const regulerClasses = useMemo(() =>
        classes.filter(c => (c.type ?? 'reguler') === 'reguler'),
        [classes]
    );

    const stats = useMemo(() => ({
        total:           regulerClasses.length,
        withHomeroom:    regulerClasses.filter(c => !!c.homeroom_teacher_id).length,
        withoutHomeroom: regulerClasses.filter(c => !c.homeroom_teacher_id).length,
    }), [regulerClasses]);

    // ── Filter Logic ──────────────────────────────────────────────────────
    const filteredClasses = useMemo(() =>
        regulerClasses.filter(cls => {
            const term = searchTerm.toLowerCase();
            return (
                cls.name.toLowerCase().includes(term) ||
                (cls.homeroom_teacher_name ?? '').toLowerCase().includes(term)
            );
        }),
        [regulerClasses, searchTerm]
    );

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleOpenModal = (classRoom: ClassRoom) => {
        setSelectedClass(classRoom);
        setModalOpen(true);
    };

    const handleAssign = (classId: number, teacherId: number | null) => {
        assignMutation.mutate(
            { classId, teacherId },
            {
                onSuccess: () => setModalOpen(false),
            }
        );
    };

    // ── Loading State ─────────────────────────────────────────────────────
    if (isLoading) return <HomeroomListSkeleton />;

    // ── Error State ───────────────────────────────────────────────────────
    if (isError) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Wali </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Kelas</span>
                    </h1>
                </div>
                <ErrorState
                    error="Gagal memuat data wali kelas. Periksa koneksi Anda dan coba lagi."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Wali{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Kelas
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <UserCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Penugasan wali kelas untuk kelas reguler. Kelas peminatan tidak memerlukan wali kelas.
                    </p>
                </div>
            </div>

            {/* ── StatCards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Total Kelas"
                    value={stats.total}
                    icon={School}
                    color="blue"
                    subtitle="Semua kelas aktif"
                />
                <StatCard
                    title="Sudah Ada Wali"
                    value={stats.withHomeroom}
                    icon={UserCheck}
                    color="green"
                    subtitle="Wali kelas ditugaskan"
                />
                <StatCard
                    title="Belum Ada Wali"
                    value={stats.withoutHomeroom}
                    icon={AlertCircle}
                    color="amber"
                    subtitle="Perlu ditugaskan"
                />
            </div>

            {/* ── Table Card ── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Wali Kelas
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Total {filteredClasses.length} kelas ditampilkan
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Filter Tahun Ajaran */}
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="h-9 w-[180px]">
                                    <SelectValue placeholder="Tahun Ajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map(year => (
                                        <SelectItem key={year.id} value={year.id}>
                                            {year.name} {year.isActive && '(Aktif)'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Search */}
                            <div className="relative w-full sm:w-[220px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kelas atau guru..."
                                    className="pl-9 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto border-t border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle">Nama Kelas</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle">Tahun Ajaran</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle">Wali Kelas</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle text-center">Jumlah Siswa</th>
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredClasses.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4">
                                            <EmptyState
                                                icon={FileX}
                                                title={
                                                    searchTerm
                                                        ? 'Tidak ada kelas ditemukan'
                                                        : selectedYear
                                                            ? 'Belum ada kelas untuk tahun ajaran ini'
                                                            : 'Pilih tahun ajaran untuk melihat data'
                                                }
                                                description={
                                                    searchTerm
                                                        ? `Tidak ada kelas yang cocok dengan "${searchTerm}".`
                                                        : 'Pastikan data kelas sudah dibuat terlebih dahulu.'
                                                }
                                            />
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClasses.map((item: ClassRoom) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/50 transition-colors group border-b border-slate-100"
                                        >
                                            {/* Nama Kelas */}
                                            <td className="px-4 py-3 align-middle">
                                                <span className="text-sm font-semibold text-slate-800">
                                                    {item.name}
                                                </span>
                                            </td>

                                            {/* Tahun Ajaran */}
                                            <td className="px-4 py-3 align-middle">
                                                {item.academic_year_name ? (
                                                    <span className="text-sm text-slate-600">
                                                        TA. {item.academic_year_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">—</span>
                                                )}
                                            </td>

                                            {/* Wali Kelas */}
                                            <td className="px-4 py-3 align-middle">
                                                {item.homeroom_teacher_name ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0 border border-blue-100">
                                                            {item.homeroom_teacher_name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                                                            {item.homeroom_teacher_name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-red-600 bg-red-50 border-red-200 text-xs font-medium"
                                                    >
                                                        Belum Ditentukan
                                                    </Badge>
                                                )}
                                            </td>

                                            {/* Jumlah Siswa */}
                                            <td className="px-4 py-3 align-middle text-center">
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium">
                                                    {item.total_students} Siswa
                                                </Badge>
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-4 py-3 align-middle text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn(
                                                        'hover:bg-slate-100 transition-colors',
                                                        item.homeroom_teacher_id
                                                            ? 'text-slate-600'
                                                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                                                    )}
                                                    onClick={() => handleOpenModal(item)}
                                                >
                                                    <UserCheck className="h-4 w-4 mr-2" />
                                                    {item.homeroom_teacher_id ? 'Ubah' : 'Tugaskan'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ── Assign Homeroom Modal ── */}
            <AssignHomeroomModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                classRoom={selectedClass}
                teachers={teachers}
                onSubmit={handleAssign}
                isSubmitting={assignMutation.isPending}
            />
        </div>
    );
};
