'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    GraduationCap, Search, Settings, UserPlus,
    Users, Trash2, Edit, Eye, RefreshCw,
    FilterX, FileX, Loader2, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

import { AdminStudent } from '../types/student';
import { useStudentList } from '../hooks/useStudentList';
import { PaginationControls } from '@/features/shared/components/PaginationControls';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const StudentListSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-40" />
        </div>
        <Card>
            <CardHeader className="pb-4 space-y-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent className="p-0">
                <div className="border-t">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-8 rounded" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const StudentList: React.FC = () => {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

    const debouncedSearch = useDebounce(searchInput, 400);

    const {
        students,
        meta,
        isLoading,
        isFetching,
        isError,
        isDeleting,
        setFilters,
        deleteStudent,
    } = useStudentList();

    React.useEffect(() => {
        setFilters({ search: debouncedSearch || undefined, page: 1 });
    }, [debouncedSearch, setFilters]);

    const toggleSelectAll = useCallback(() => {
        setSelectedItems((prev) =>
            prev.length === students.length ? [] : students.map((s) => s.id)
        );
    }, [students]);

    const toggleSelectItem = useCallback((id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (isBulkDeleteOpen) {
            selectedItems.forEach((id) => deleteStudent(id));
            setSelectedItems([]);
            setIsBulkDeleteOpen(false);
        } else if (deleteId !== null) {
            deleteStudent(deleteId);
            setDeleteId(null);
        }
    }, [isBulkDeleteOpen, selectedItems, deleteId, deleteStudent]);

    if (isLoading) return <StudentListSkeleton />;

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Data{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Siswa
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data induk siswa, kelas, dan informasi akademik.
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/users/students/new')}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tambah Siswa
                </Button>
            </div>

            {/* ── Error ── */}
            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                    Gagal memuat data siswa. Silakan coba lagi.
                </div>
            )}

            {/* ── Main Card ── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Siswa
                                </CardTitle>
                                <CardDescription>
                                    Semua siswa yang terdaftar di sistem
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && (
                                <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />
                            )}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                                {meta?.total ?? students.length} Siswa
                            </Badge>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau nomor pendaftaran..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-9 w-full"
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-0 py-4 w-[40px]">
                                        <Checkbox
                                            checked={students.length > 0 && selectedItems.length === students.length}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="pl-3 pr-6 py-4 font-medium text-sm">Nama & No. Pendaftaran</th>
                                    <th className="px-6 py-4 font-medium text-sm">Kelas</th>
                                    <th className="px-6 py-4 font-medium text-sm">Kontak</th>
                                    <th className="px-6 py-4 font-medium text-sm">Wali</th>
                                    <th className="px-6 py-4 font-medium text-sm text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    {searchInput
                                                        ? <FilterX className="h-8 w-8 text-slate-300" />
                                                        : <FileX className="h-8 w-8 text-slate-300" />
                                                    }
                                                </div>
                                                <p className="text-slate-500 font-medium">
                                                    {searchInput ? 'Tidak ada hasil yang cocok' : 'Belum ada data siswa'}
                                                </p>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    {searchInput ? 'Coba ubah kata kunci pencarian' : 'Klik "Tambah Siswa" untuk menambahkan'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student) => (
                                        <StudentRow
                                            key={student.id}
                                            student={student}
                                            isSelected={selectedItems.includes(student.id)}
                                            onToggleSelect={() => toggleSelectItem(student.id)}
                                            onView={() => router.push(`/admin/users/students/${student.id}`)}
                                            onEdit={() => router.push(`/admin/users/students/${student.id}/edit`)}
                                            onDelete={() => setDeleteId(student.id)}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {meta && meta.last_page > 1 && (
                        <PaginationControls
                            currentPage={meta.current_page}
                            totalPages={meta.last_page}
                            totalItems={meta.total}
                            startIndex={(meta.current_page - 1) * meta.per_page + 1}
                            endIndex={Math.min(meta.current_page * meta.per_page, meta.total)}
                            itemsPerPage={meta.per_page}
                            itemLabel="siswa"
                            onPageChange={(page) => setFilters({ page })}
                            onItemsPerPageChange={(perPage) => setFilters({ page: 1, per_page: perPage })}
                        />
                    )}
                </CardContent>
            </Card>

            {/* ── Bulk Action Bar ── */}
            {selectedItems.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-slate-800">
                        <div className="flex items-center gap-2 pr-6 border-r border-slate-700">
                            <span className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {selectedItems.length}
                            </span>
                            <span className="text-sm font-medium text-slate-300">Siswa dipilih</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800 h-9"
                                onClick={() => setIsBulkDeleteOpen(true)}>
                                <Trash2 className="h-4 w-4 mr-2 text-red-400" />
                                Hapus Massal
                            </Button>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800 h-9"
                                onClick={() => setSelectedItems([])}>
                                <X className="h-4 w-4 mr-2" />
                                Batal
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirmation ── */}
            <AlertDialog
                open={deleteId !== null || isBulkDeleteOpen}
                onOpenChange={(open) => { if (!open) { setDeleteId(null); setIsBulkDeleteOpen(false); } }}
            >
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg">
                                    {isBulkDeleteOpen ? `Hapus ${selectedItems.length} Siswa?` : 'Hapus Data Siswa?'}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">
                                    Data akan dihapus permanen dan tidak dapat dipulihkan.
                                </AlertDialogDescription>
                            </div>
                        </div>
                        <div className="ml-16 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-xs text-red-700 leading-relaxed">
                                ⚠️ Semua data terkait termasuk nilai, presensi, dan keanggotaan ekskul juga akan ikut terhapus.
                            </p>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menghapus...</>
                            ) : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

// ─── Row Component ────────────────────────────────────────────────────────────

interface StudentRowProps {
    student: AdminStudent;
    isSelected: boolean;
    onToggleSelect: () => void;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const StudentRow: React.FC<StudentRowProps> = ({
    student, isSelected, onToggleSelect, onView, onEdit, onDelete,
}) => {
    const initials = student.name
        .split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);

    const guardian = student.guardian_details;

    return (
        <tr className={cn(
            'group transition-colors border-b border-slate-50',
            isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/60'
        )}>
            <td className="pl-4 pr-0 py-4">
                <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
            </td>

            {/* Nama & No. Pendaftaran */}
            <td className="pl-3 pr-6 py-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-blue-200 shrink-0">
                        <AvatarImage src={student.avatar ?? undefined} />
                        <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{student.admission_number}</p>
                    </div>
                </div>
            </td>

            {/* Kelas */}
            <td className="px-6 py-4">
                {student.class_name ? (
                    <div>
                        <Badge className="bg-blue-800 text-white text-xs font-medium">
                            {student.class_name}
                        </Badge>
                        {student.academic_year_name && (
                            <p className="text-xs text-slate-400 mt-1">TA. {student.academic_year_name}</p>
                        )}
                    </div>
                ) : (
                    <span className="text-sm text-slate-400">—</span>
                )}
            </td>

            {/* Kontak */}
            <td className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-slate-700">{student.phone ?? '—'}</span>
                    {student.email && (
                        <span className="text-xs text-slate-400 truncate max-w-[160px]">{student.email}</span>
                    )}
                </div>
            </td>

            {/* Wali */}
            <td className="px-6 py-4">
                {guardian ? (
                    <div>
                        <p className="text-sm text-slate-700">{guardian.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{guardian.phone ?? '—'}</p>
                    </div>
                ) : (
                    <span className="text-sm text-slate-400">—</span>
                )}
            </td>

            {/* Aksi */}
            <td className="px-6 py-4 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onView} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 text-blue-600" />
                            Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4 text-amber-600" />
                            Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus Data
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
};
