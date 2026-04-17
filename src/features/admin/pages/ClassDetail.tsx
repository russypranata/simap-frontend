'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Edit,
    School,
    Users,
    Calendar,
    Search,
    GraduationCap,
    UserCheck,
    FileX,
    Loader2,
    UserX,
    BookOpen,
    Tag,
    ArrowRight,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

import { classService } from '../services/classService';
import { enrollmentService } from '../services/enrollmentService';
import { classSubjectService } from '../services/classSubjectService';
import { ErrorState, EmptyState, StatCard } from '@/features/shared/components';
import { Enrollment } from '../types/enrollment';
import { ClassSubject } from '../types/classSubject';

// ─── Query Keys ──────────────────────────────────────────────────────────────
const CLASS_DETAIL_KEYS = {
    class:         (id: string) => ['admin-class-detail', id] as const,
    enrollments:   (id: string) => ['admin-class-enrollments', id] as const,
    classSubjects: (id: string) => ['admin-class-subjects', id] as const,
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const ClassDetailSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="space-y-2">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Card className="border-slate-200 shadow-sm">
            <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
            <CardContent className="p-0">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24 ml-auto" />
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
interface ClassDetailProps {
    id: string;
}

export const ClassDetail: React.FC<ClassDetailProps> = ({ id }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [removeEnrollmentId, setRemoveEnrollmentId] = useState<number | null>(null);

    // ── Data Fetching ─────────────────────────────────────────────────────────
    const {
        data: classData,
        isLoading: isClassLoading,
        isError: isClassError,
        refetch: refetchClass,
    } = useQuery({
        queryKey: CLASS_DETAIL_KEYS.class(id),
        queryFn:  () => classService.getClassById(id),
        staleTime: 5 * 60 * 1000,
    });

    const isPeminatanGroup = (classData?.type ?? 'reguler') === 'peminatan_group';

    // Enrollments — hanya untuk kelas reguler
    const {
        data: enrollmentsData,
        isLoading: isEnrollmentsLoading,
        isError: isEnrollmentsError,
        refetch: refetchEnrollments,
    } = useQuery({
        queryKey: CLASS_DETAIL_KEYS.enrollments(id),
        queryFn:  () => enrollmentService.getEnrollments({ class_id: id }),
        staleTime: 2 * 60 * 1000,
        enabled: !isPeminatanGroup,
    });

    // Class Subjects — hanya untuk kelas peminatan_group
    const {
        data: classSubjectsData,
        isLoading: isSubjectsLoading,
        isError: isSubjectsError,
        refetch: refetchSubjects,
    } = useQuery({
        queryKey: CLASS_DETAIL_KEYS.classSubjects(id),
        queryFn:  () => classSubjectService.getClassSubjects({ class_id: id }),
        staleTime: 2 * 60 * 1000,
        enabled: isPeminatanGroup,
    });

    // ── Remove Enrollment Mutation ────────────────────────────────────────────
    const removeMutation = useMutation({
        mutationFn: (enrollmentId: number) => enrollmentService.deleteEnrollment(enrollmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CLASS_DETAIL_KEYS.enrollments(id) });
            queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
            toast.success('Siswa berhasil dikeluarkan dari kelas');
            setRemoveEnrollmentId(null);
        },
        onError: () => {
            toast.error('Gagal mengeluarkan siswa dari kelas');
        },
    });

    // ── Derived Data ──────────────────────────────────────────────────────────
    const enrollments: Enrollment[] = useMemo(() => {
        if (!enrollmentsData) return [];
        if (Array.isArray(enrollmentsData)) return enrollmentsData;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((enrollmentsData as any).data) return (enrollmentsData as any).data;
        return [];
    }, [enrollmentsData]);

    const classSubjects: ClassSubject[] = useMemo(() => {
        if (!classSubjectsData) return [];
        if (Array.isArray(classSubjectsData)) return classSubjectsData;
        return [];
    }, [classSubjectsData]);

    const filteredEnrollments = useMemo(() =>
        enrollments.filter(e =>
            (e.student_name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [enrollments, searchTerm]
    );

    const filteredSubjects = useMemo(() =>
        classSubjects.filter(s =>
            (s.subject_name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.teacher_name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [classSubjects, searchTerm]
    );

    // ── Loading / Error States ────────────────────────────────────────────────
    const isLoading = isClassLoading || (isPeminatanGroup ? isSubjectsLoading : isEnrollmentsLoading);
    if (isLoading) return <ClassDetailSkeleton />;

    if (isClassError || !classData) {
        return (
            <ErrorState
                error="Gagal memuat data kelas. Periksa koneksi Anda dan coba lagi."
                onRetry={() => { refetchClass(); }}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Detail{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                {classData.name}
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <School className="h-5 w-5" />
                        </div>
                        {/* Badge tipe kelas */}
                        <Badge
                            variant="outline"
                            className={isPeminatanGroup
                                ? 'bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium'
                                : 'bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium'
                            }
                        >
                            {isPeminatanGroup ? 'Peminatan' : 'Reguler'}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        {isPeminatanGroup
                            ? 'Wadah kelas peminatan — siswa enroll melalui mapel peminatan di bawah kelas ini'
                            : 'Kelola data rombongan belajar dan daftar siswa'}
                    </p>
                </div>
                <Button
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-sm transition-colors"
                    onClick={() => router.push(`/admin/class/${id}/edit`)}
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Kelas
                </Button>
            </div>

            {/* ── Info Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {isPeminatanGroup ? (
                    <>
                        <StatCard
                            title="Mapel Peminatan"
                            value={classSubjects.length}
                            icon={BookOpen}
                            color="amber"
                            size="sm"
                            subtitle="Terdaftar di grup ini"
                        />
                        <StatCard
                            title="Total Guru"
                            value={new Set(classSubjects.map(s => s.teacher_id)).size}
                            icon={UserCheck}
                            color="blue"
                            size="sm"
                            subtitle="Guru pengampu"
                        />
                        <StatCard
                            title="Tahun Ajaran"
                            value={classData.academic_year_name ? `TA. ${classData.academic_year_name}` : '—'}
                            icon={Calendar}
                            color="blue"
                            size="sm"
                            subtitle="Tahun ajaran aktif"
                        />
                    </>
                ) : (
                    <>
                        <StatCard
                            title="Wali Kelas"
                            value={classData.homeroom_teacher_name ?? 'Belum Ditentukan'}
                            icon={UserCheck}
                            color="blue"
                            size="sm"
                            subtitle={classData.homeroom_teacher_name ? 'Sudah ditugaskan' : 'Perlu ditugaskan'}
                        />
                        <StatCard
                            title="Jumlah Siswa"
                            value={classData.total_students}
                            icon={GraduationCap}
                            color="green"
                            size="sm"
                            subtitle="Terdaftar di kelas ini"
                        />
                        <StatCard
                            title="Tahun Ajaran"
                            value={classData.academic_year_name ? `TA. ${classData.academic_year_name}` : '—'}
                            icon={Calendar}
                            color="blue"
                            size="sm"
                            subtitle="Tahun ajaran aktif"
                        />
                    </>
                )}
            </div>

            {/* ── Content: berbeda untuk reguler vs peminatan_group ── */}
            {isPeminatanGroup ? (
                // ── Daftar Mapel Peminatan ──
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">Daftar Mapel Peminatan</CardTitle>
                                    <CardDescription className="text-sm text-slate-500">
                                        Total {classSubjects.length} mapel peminatan di grup ini
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="relative w-full sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari mapel atau guru..."
                                    className="pl-9 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isSubjectsError ? (
                            <div className="p-6">
                                <ErrorState error="Gagal memuat daftar mapel." onRetry={() => refetchSubjects()} />
                            </div>
                        ) : (
                            <div className="overflow-x-auto border-t border-slate-100">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle text-center w-[50px]">No</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle">Mata Pelajaran</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle">Guru Pengampu</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {filteredSubjects.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4">
                                                    <EmptyState
                                                        icon={FileX}
                                                        title={searchTerm ? 'Tidak ada mapel ditemukan' : 'Belum ada mapel peminatan'}
                                                        description={
                                                            searchTerm
                                                                ? `Tidak ada mapel dengan kata kunci "${searchTerm}".`
                                                                : 'Tambahkan mapel peminatan melalui halaman Jadwal Mapel.'
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredSubjects.map((cs: ClassSubject, index: number) => (
                                                <tr key={cs.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                                                    <td className="px-4 py-3 align-middle text-center text-slate-400 font-mono text-xs">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 align-middle">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
                                                                <Tag className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-800">
                                                                {cs.subject_name ?? `Mapel #${cs.subject_id}`}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 align-middle">
                                                        {cs.teacher_name ? (
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 text-xs font-bold">
                                                                    {cs.teacher_name.substring(0, 2).toUpperCase()}
                                                                </div>
                                                                <span className="text-sm text-slate-700">{cs.teacher_name}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 text-xs">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 align-middle text-center">
                                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                                                            Aktif
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                // ── Daftar Siswa (kelas reguler) ──
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">Daftar Siswa</CardTitle>
                                    <CardDescription className="text-sm text-slate-500">
                                        Total {enrollments.length} siswa terdaftar di kelas ini
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="relative w-full sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama siswa..."
                                    className="pl-9 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isEnrollmentsError ? (
                            <div className="p-6">
                                <ErrorState error="Gagal memuat daftar siswa." onRetry={() => refetchEnrollments()} />
                            </div>
                        ) : (
                            <div className="overflow-x-auto border-t border-slate-100">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle text-center w-[50px]">No</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle">Nama Siswa</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle text-center">Status</th>
                                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 align-middle text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {filteredEnrollments.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4">
                                                    <EmptyState
                                                        icon={FileX}
                                                        title={searchTerm ? 'Tidak ada siswa ditemukan' : 'Belum ada siswa di kelas ini'}
                                                        description={
                                                            searchTerm
                                                                ? `Tidak ada siswa dengan nama "${searchTerm}".`
                                                                : 'Gunakan halaman Penempatan Kelas untuk menambahkan siswa.'
                                                        }
                                                    />
                                                    {!searchTerm && (
                                                        <div className="flex justify-center mt-4">
                                                            <Button
                                                                size="sm"
                                                                className="bg-blue-800 hover:bg-blue-900 text-white"
                                                                onClick={() => router.push('/admin/class/placement')}
                                                            >
                                                                <ArrowRight className="h-4 w-4 mr-2" />
                                                                Ke Penempatan Kelas
                                                            </Button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredEnrollments.map((enrollment: Enrollment, index: number) => (
                                                <tr
                                                    key={enrollment.id}
                                                    className="hover:bg-slate-50/50 transition-colors group border-b border-slate-100"
                                                >
                                                    <td className="px-4 py-3 align-middle text-center text-slate-400 font-mono text-xs">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 align-middle">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 text-xs font-bold border border-blue-100">
                                                                {(enrollment.student_name ?? 'S').substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-800">
                                                                {enrollment.student_name ?? `Siswa #${enrollment.student_id}`}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 align-middle text-center">
                                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                                                            Aktif
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 align-middle text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                                                            onClick={() => setRemoveEnrollmentId(enrollment.id)}
                                                            title="Keluarkan dari kelas"
                                                        >
                                                            <UserX className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ── Remove Confirmation Dialog ── */}
            <AlertDialog
                open={removeEnrollmentId !== null}
                onOpenChange={(open) => !open && setRemoveEnrollmentId(null)}
            >
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Keluarkan Siswa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan mengeluarkan siswa dari rombongan belajar ini. Data siswa akan tetap ada di database sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={removeMutation.isPending}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                if (removeEnrollmentId !== null) {
                                    removeMutation.mutate(removeEnrollmentId);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={removeMutation.isPending}
                        >
                            {removeMutation.isPending ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Proses...</>
                            ) : (
                                'Ya, Keluarkan'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
