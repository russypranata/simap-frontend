'use client';

import React, { useState, useMemo } from 'react';
import {
    Users,
    Search,
    GraduationCap,
    ArrowRight,
    School,
    UserCheck,
    FileX,
    Info,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

import { ClassRoom } from '../types/class';
import { UnenrolledStudent } from '../types/enrollment';
import {
    usePlacementData,
    useBulkEnroll,
    useAcademicYearsList,
} from '../hooks/useClassManagement';
import { PlacementSkeleton } from '../components/class';
import { ErrorState, EmptyState } from '@/features/shared/components';

// Pagination
const ITEMS_PER_PAGE = 10;

export const PlacementWorkflow: React.FC = () => {
    // ── Filter State ──────────────────────────────────────────────────────
    const [selectedYearId, setSelectedYearId] = useState<string>('');
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // ── Selection State ───────────────────────────────────────────────────
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

    // ── Data Fetching ─────────────────────────────────────────────────────
    const { data: academicYears = [], isLoading: isYearsLoading } = useAcademicYearsList();

    // Auto-select active year
    React.useEffect(() => {
        if (academicYears.length > 0 && !selectedYearId) {
            const activeYear = academicYears.find(y => y.isActive);
            setSelectedYearId(activeYear?.id ?? academicYears[0].id);
        }
    }, [academicYears, selectedYearId]);

    const { unenrolledStudents, classes, isLoading: isDataLoading, isError, refetch } = usePlacementData(selectedYearId);
    const bulkEnrollMutation = useBulkEnroll();

    const isLoading = isYearsLoading || isDataLoading;

    // ── Derived Data ──────────────────────────────────────────────────────
    const filteredStudents = useMemo(() =>
        unenrolledStudents.filter((s: UnenrolledStudent) => {
            const term = searchQuery.toLowerCase();
            return (
                s.name.toLowerCase().includes(term) ||
                s.admission_number.toLowerCase().includes(term)
            );
        }),
        [unenrolledStudents, searchQuery]
    );

    const paginatedStudents = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStudents.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredStudents, currentPage]);

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

    const targetClass = useMemo(
        () => classes.find((c: ClassRoom) => String(c.id) === selectedClassId),
        [classes, selectedClassId]
    );

    // Reset page when search changes
    React.useEffect(() => {
        setCurrentPage(1);
        setSelectedStudentIds([]);
    }, [searchQuery, selectedYearId]);

    // ── Handlers ──────────────────────────────────────────────────────────
    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedStudentIds(filteredStudents.map((s: UnenrolledStudent) => s.id));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const toggleSelectStudent = (id: number) => {
        setSelectedStudentIds(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleAssign = () => {
        if (!selectedClassId || selectedStudentIds.length === 0) return;
        bulkEnrollMutation.mutate(
            {
                class_id:    Number(selectedClassId),
                student_ids: selectedStudentIds,
            },
            {
                onSuccess: () => {
                    setSelectedStudentIds([]);
                    setSelectedClassId('');
                },
            }
        );
    };

    const isAssignDisabled =
        selectedStudentIds.length === 0 ||
        !selectedClassId ||
        bulkEnrollMutation.isPending;

    // ── Loading / Error States ────────────────────────────────────────────
    if (isLoading) return <PlacementSkeleton />;

    if (isError) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Penempatan </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Kelas</span>
                    </h1>
                </div>
                <ErrorState
                    error="Gagal memuat data. Periksa koneksi Anda dan coba lagi."
                    onRetry={refetch}
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
                                Penempatan{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Kelas
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Tempatkan siswa yang belum memiliki kelas ke rombongan belajar.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* ── LEFT PANEL: Bank Siswa ── */}
                <Card className="md:col-span-7 h-fit border-slate-200 shadow-sm">
                    <CardHeader className="pb-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Bank Siswa
                                    </CardTitle>
                                    <CardDescription>
                                        Siswa aktif yang belum memiliki kelas.
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium">
                                {unenrolledStudents.length} Data
                            </Badge>
                        </div>

                        {/* Search */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari Nama atau NIS..."
                                    className="pl-9 bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {unenrolledStudents.length === 0 ? (
                            <EmptyState
                                icon={UserCheck}
                                title="Semua siswa sudah memiliki kelas"
                                description="Tidak ada siswa yang perlu ditempatkan untuk tahun ajaran ini."
                                className="py-16"
                            />
                        ) : (
                            <>
                                <div className="border-t border-slate-200 overflow-hidden min-h-[400px] max-h-[550px] overflow-y-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                                            <TableRow className="hover:bg-slate-50 border-0">
                                                <TableHead className="w-[50px] pl-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                    <Checkbox
                                                        checked={
                                                            filteredStudents.length > 0 &&
                                                            selectedStudentIds.length === filteredStudents.length
                                                        }
                                                        onCheckedChange={toggleSelectAll}
                                                        disabled={filteredStudents.length === 0}
                                                    />
                                                </TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">Siswa</TableHead>
                                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">NIS</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedStudents.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <FileX className="h-8 w-8 text-slate-300" />
                                                            <p>Tidak ada siswa yang sesuai pencarian.</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                paginatedStudents.map((student: UnenrolledStudent) => (
                                                    <TableRow
                                                        key={student.id}
                                                        className={cn(
                                                            'cursor-pointer transition-colors border-b border-slate-100 hover:bg-slate-50/50',
                                                            selectedStudentIds.includes(student.id)
                                                                ? 'bg-blue-50/50 hover:bg-blue-50/70'
                                                                : ''
                                                        )}
                                                        onClick={() => toggleSelectStudent(student.id)}
                                                    >
                                                        <TableCell className="pl-4 py-3">
                                                            <Checkbox
                                                                checked={selectedStudentIds.includes(student.id)}
                                                                onCheckedChange={() => toggleSelectStudent(student.id)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-100 shrink-0">
                                                                    {student.name.substring(0, 2).toUpperCase()}
                                                                </div>
                                                                <span className={cn(
                                                                    'font-medium text-sm transition-colors',
                                                                    selectedStudentIds.includes(student.id)
                                                                        ? 'text-slate-900'
                                                                        : 'text-slate-700'
                                                                )}>
                                                                    {student.name}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-3 hidden sm:table-cell">
                                                            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                                                {student.admission_number}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-200">
                                        <p className="text-sm text-slate-500">
                                            Menampilkan{' '}
                                            <span className="font-medium text-slate-700">
                                                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)}
                                            </span>{' '}
                                            dari <span className="font-medium text-slate-700">{filteredStudents.length}</span> data
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft className="h-4 w-4 mr-1" />
                                                Sebelumnya
                                            </Button>
                                            <span className="text-sm text-slate-600 font-medium">
                                                {currentPage} / {totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                            >
                                                Berikutnya
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* ── RIGHT PANEL: Target Kelas ── */}
                <Card className="md:col-span-5 h-fit border-slate-200 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <School className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Target Kelas
                                </CardTitle>
                                <CardDescription>
                                    Pilih kelas tujuan penempatan siswa.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Tahun Ajaran */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Tahun Ajaran</label>
                            <Select value={selectedYearId} onValueChange={(val) => { setSelectedYearId(val); setSelectedClassId(''); }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih tahun ajaran..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map(year => (
                                        <SelectItem key={year.id} value={year.id}>
                                            {year.name} {year.isActive && '(Aktif)'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Kelas */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Kelas Tujuan</label>
                            <Select
                                value={selectedClassId}
                                onValueChange={setSelectedClassId}
                                disabled={!selectedYearId || classes.length === 0}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={
                                        !selectedYearId
                                            ? 'Pilih tahun ajaran dulu...'
                                            : classes.length === 0
                                                ? 'Tidak ada kelas tersedia'
                                                : 'Pilih kelas...'
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls: ClassRoom) => (
                                        <SelectItem key={cls.id} value={String(cls.id)}>
                                            {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Info kelas terpilih */}
                        {targetClass && (
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-blue-900 text-base">{targetClass.name}</span>
                                    <Badge variant="outline" className="text-blue-700 border-blue-300 bg-white">
                                        {targetClass.total_students} Siswa
                                    </Badge>
                                </div>
                                {targetClass.homeroom_teacher_name && (
                                    <p className="text-sm text-blue-700">
                                        Wali Kelas: <span className="font-medium">{targetClass.homeroom_teacher_name}</span>
                                    </p>
                                )}
                                {targetClass.academic_year_name && (
                                    <p className="text-xs text-blue-600">TA. {targetClass.academic_year_name}</p>
                                )}
                            </div>
                        )}

                        {/* Selection summary */}
                        {selectedStudentIds.length > 0 && (
                            <Alert className="bg-slate-50 border-slate-200">
                                <Info className="h-4 w-4 text-slate-500" />
                                <AlertDescription className="text-slate-700 text-sm">
                                    <span className="font-semibold">{selectedStudentIds.length} siswa</span> dipilih untuk ditempatkan.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Assign button */}
                        <Button
                            onClick={handleAssign}
                            disabled={isAssignDisabled}
                            className="w-full bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                        >
                            {bulkEnrollMutation.isPending ? (
                                'Memproses...'
                            ) : (
                                <>
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                    Tempatkan {selectedStudentIds.length > 0 ? `${selectedStudentIds.length} Siswa` : 'Siswa'}
                                </>
                            )}
                        </Button>

                        {!selectedClassId && selectedStudentIds.length > 0 && (
                            <p className="text-xs text-amber-600 text-center">
                                Pilih kelas tujuan terlebih dahulu.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
