'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users, Search, Settings, UserPlus, Trash2, Edit,
    RefreshCw, FilterX, FileX, Loader2,
} from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Skeleton } from '@/components/ui/skeleton';

import { useParentList } from '../hooks/useParentList';
import { PaginationControls } from '@/features/shared/components/PaginationControls';

const ParentListSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="space-y-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-48" /></div>
            <Skeleton className="h-10 w-44" />
        </div>
        <Card>
            <CardHeader className="pb-4 space-y-4">
                <div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-lg" /><div className="space-y-1"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-28" /></div></div>
                <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent className="p-0">
                <div className="border-t">{[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 space-y-1"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-28" /></div>
                        <Skeleton className="h-4 w-32" /><Skeleton className="h-8 w-8 rounded" />
                    </div>
                ))}</div>
            </CardContent>
        </Card>
    </div>
);

export const ParentList: React.FC = () => {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const debouncedSearch = useDebounce(searchInput, 400);

    const { parents, meta, isLoading, isFetching, isError, isDeleting, setFilters, deleteParent } = useParentList();

    React.useEffect(() => {
        setFilters({ search: debouncedSearch || undefined, page: 1 });
    }, [debouncedSearch, setFilters]);

    const handleDeleteConfirm = useCallback(() => {
        if (deleteId !== null) { deleteParent(deleteId); setDeleteId(null); }
    }, [deleteId, deleteParent]);

    if (isLoading) return <ParentListSkeleton />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Data </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Wali Murid</span>
                        </h1>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200"><Users className="h-5 w-5" /></div>
                    </div>
                    <p className="text-muted-foreground mt-1">Kelola akun dan data orang tua / wali murid.</p>
                </div>
                <Button onClick={() => router.push('/admin/users/parents/new')} className="bg-blue-800 hover:bg-blue-900 text-white shadow-md">
                    <UserPlus className="h-4 w-4 mr-2" />Tambah Wali Murid
                </Button>
            </div>

            {isError && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">Gagal memuat data wali murid.</div>}

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0"><Users className="h-5 w-5" /></div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Daftar Wali Murid</CardTitle>
                                <CardDescription>Semua wali murid yang terdaftar di sistem</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">{meta?.total ?? parents.length} Wali</Badge>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari nama wali atau nama siswa..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="pl-9" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Nama Wali</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Siswa (Anak)</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Kontak</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Pekerjaan</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parents.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            {searchInput ? <FilterX className="h-8 w-8 text-slate-300 mb-2" /> : <FileX className="h-8 w-8 text-slate-300 mb-2" />}
                                            <p className="text-sm text-slate-500">{searchInput ? 'Tidak ada hasil' : 'Belum ada data wali murid'}</p>
                                        </div>
                                    </td></tr>
                                ) : parents.map((parent) => {
                                    const initials = parent.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
                                    return (
                                        <tr key={parent.id} className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60">
                                            <td className="pl-4 pr-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-blue-200 shrink-0">
                                                        <AvatarImage src={parent.avatar ?? undefined} />
                                                        <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-semibold">{initials}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{parent.name}</p>
                                                        <p className="text-xs text-slate-500 font-mono mt-0.5">@{parent.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {parent.children.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {parent.children.slice(0, 2).map((c) => (
                                                            <div key={c.id}>
                                                                <span className="text-sm text-slate-700">{c.name}</span>
                                                                <span className="text-xs text-slate-400 font-mono ml-1.5">{c.admission_number}</span>
                                                            </div>
                                                        ))}
                                                        {parent.children.length > 2 && <p className="text-xs text-slate-400">+{parent.children.length - 2} lainnya</p>}
                                                    </div>
                                                ) : <span className="text-sm text-slate-400">—</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm text-slate-700">{parent.phone ?? '—'}</span>
                                                    {parent.email && <span className="text-xs text-slate-400 truncate max-w-[180px]">{parent.email}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700">{parent.occupation ?? '—'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100"><Settings className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => router.push(`/admin/users/parents/${parent.id}/edit`)} className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4 text-amber-600" />Edit Data
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => setDeleteId(parent.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                                            <Trash2 className="mr-2 h-4 w-4" />Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {meta && meta.last_page > 1 && (
                        <PaginationControls currentPage={meta.current_page} totalPages={meta.last_page} totalItems={meta.total}
                            startIndex={(meta.current_page - 1) * meta.per_page + 1} endIndex={Math.min(meta.current_page * meta.per_page, meta.total)}
                            itemsPerPage={meta.per_page} itemLabel="wali murid"
                            onPageChange={(page) => setFilters({ page })} onItemsPerPageChange={(perPage) => setFilters({ page: 1, per_page: perPage })} />
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0"><Trash2 className="h-6 w-6 text-red-600" /></div>
                            <div>
                                <AlertDialogTitle className="text-lg">Hapus Wali Murid?</AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">Data akan dihapus permanen.</AlertDialogDescription>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white" disabled={isDeleting}>
                            {isDeleting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menghapus...</> : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
