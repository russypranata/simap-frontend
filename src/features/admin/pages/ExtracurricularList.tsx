'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Award, Search, Settings, Users,
    Calendar, Trash2, Edit, RefreshCw,
    FilterX, FileX, Loader2, FolderPlus,
} from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

import { Extracurricular } from '../types/extracurricular';
import { useExtracurricularList } from '../hooks/useExtracurricular';
import { PaginationControls } from '@/features/shared/components/PaginationControls';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const ExtracurricularListSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-9 w-72" />
                <Skeleton className="h-4 w-52" />
            </div>
            <Skeleton className="h-10 w-44" />
        </div>
        <Card>
            <CardHeader className="pb-4 space-y-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent className="p-0">
                <div className="border-t">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
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

export const ExtracurricularList: React.FC = () => {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const debouncedSearch = useDebounce(searchInput, 400);

    const {
        extracurriculars,
        meta,
        isLoading,
        isFetching,
        isError,
        isDeleting,
        setFilters,
        deleteExtracurricular,
    } = useExtracurricularList();

    React.useEffect(() => {
        setFilters({
            search: debouncedSearch || undefined,
            page: 1,
        });
    }, [debouncedSearch, setFilters]);

    const handleDeleteConfirm = useCallback(() => {
        if (deleteId !== null) {
            deleteExtracurricular(deleteId);
            setDeleteId(null);
        }
    }, [deleteId, deleteExtracurricular]);

    if (isLoading) return <ExtracurricularListSkeleton />;

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Manajemen{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Ekstrakurikuler
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Award className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola kegiatan ekstrakurikuler, tutor, dan keanggotaan siswa.
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/extracurricular/new')}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Tambah Ekskul
                </Button>
            </div>

            {/* ── Error ── */}
            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                    Gagal memuat data ekstrakurikuler. Silakan coba lagi.
                </div>
            )}

            {/* ── Main Card ── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Ekstrakurikuler
                                </CardTitle>
                                <CardDescription>
                                    Semua kegiatan ekstrakurikuler yang terdaftar
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && (
                                <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />
                            )}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                                {meta?.total ?? extracurriculars.length} Ekskul
                            </Badge>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama ekskul atau tutor..."
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
                                    <th className="pl-4 pr-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Ekstrakurikuler</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Tutor</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Jadwal</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-center">Anggota</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {extracurriculars.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                                {searchInput
                                                    ? <FilterX className="h-8 w-8 text-slate-300 mb-2" />
                                                    : <FileX className="h-8 w-8 text-slate-300 mb-2" />
                                                }
                                                <p className="text-sm text-slate-500">
                                                    {searchInput ? 'Tidak ada hasil yang cocok' : 'Belum ada data ekstrakurikuler'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {searchInput ? 'Coba ubah kata kunci pencarian' : 'Klik "Tambah Ekskul" untuk menambahkan'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    extracurriculars.map((item) => (
                                        <EkskulRow
                                            key={item.id}
                                            item={item}
                                            onEdit={() => router.push(`/admin/extracurricular/${item.id}/edit`)}
                                            onMembers={() => router.push(`/admin/extracurricular/${item.id}/members`)}
                                            onDelete={() => setDeleteId(item.id)}
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
                            itemLabel="ekskul"
                            onPageChange={(page) => setFilters({ page })}
                            onItemsPerPageChange={(perPage) => setFilters({ page: 1, per_page: perPage })}
                        />
                    )}
                </CardContent>
            </Card>

            {/* ── Delete Confirmation ── */}
            <AlertDialog
                open={deleteId !== null}
                onOpenChange={(open) => { if (!open) setDeleteId(null); }}
            >
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg">Hapus Ekstrakurikuler?</AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">
                                    Data ekskul ini akan dihapus permanen beserta semua keanggotaan aktif.
                                </AlertDialogDescription>
                            </div>
                        </div>
                        <div className="ml-16 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-xs text-red-700 leading-relaxed">
                                ⚠️ Semua anggota aktif akan dinonaktifkan dan data tidak dapat dipulihkan.
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

interface EkskulRowProps {
    item: Extracurricular;
    onEdit: () => void;
    onMembers: () => void;
    onDelete: () => void;
}

const EkskulRow: React.FC<EkskulRowProps> = ({ item, onEdit, onMembers, onDelete }) => {
    const initials = (item.tutor_name ?? 'TT')
        .split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);

    const schedules = item.regular_schedules ?? [];
    const activeCount = item.active_member_count ?? 0;

    return (
        <tr className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60">
            {/* Nama Ekskul */}
            <td className="pl-4 pr-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                        <Award className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="font-medium text-sm text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">ID #{item.id}</p>
                    </div>
                </div>
            </td>

            {/* Tutor */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7 border border-blue-200">
                        <AvatarFallback className="bg-blue-100 text-blue-800 text-[10px] font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-slate-800">{item.tutor_name ?? '—'}</p>
                        {item.nip && <p className="text-xs text-slate-400 font-mono">{item.nip}</p>}
                    </div>
                </div>
            </td>

            {/* Jadwal */}
            <td className="px-6 py-4">
                {schedules.length > 0 ? (
                    <div className="space-y-1">
                        {schedules.slice(0, 2).map((s) => (
                            <div key={s.id} className="flex items-center gap-1.5 text-xs text-slate-600">
                                <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="font-medium">{s.day}</span>
                                <span className="text-slate-400">{s.time_start}–{s.time_end}</span>
                            </div>
                        ))}
                        {schedules.length > 2 && (
                            <p className="text-xs text-slate-400">+{schedules.length - 2} jadwal lain</p>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-slate-400">Belum ada jadwal</span>
                )}
            </td>

            {/* Anggota */}
            <td className="px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm font-semibold text-slate-800">{activeCount}</span>
                    <span className="text-xs text-slate-400">anggota aktif</span>
                </div>
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
                        <DropdownMenuItem onClick={onMembers} className="cursor-pointer">
                            <Users className="mr-2 h-4 w-4 text-blue-600" />
                            Kelola Anggota
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4 text-amber-600" />
                            Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={onDelete}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
};
