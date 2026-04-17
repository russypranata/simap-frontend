'use client';

import React, { useState } from 'react';
import { Award, Search, RefreshCw, FilterX, FileX, GraduationCap } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

import { useAlumniList } from '../hooks/useAlumniList';
import { PaginationControls } from '@/features/shared/components/PaginationControls';

const AlumniSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-48" /></div>
        <Card><CardHeader className="pb-4 space-y-4">
            <div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-lg" /><div className="space-y-1"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-28" /></div></div>
            <Skeleton className="h-10 w-full" />
        </CardHeader><CardContent className="p-0"><div className="border-t">{[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
                <Skeleton className="h-9 w-9 rounded-full" /><div className="flex-1 space-y-1"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-28" /></div>
                <Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-4 w-24" />
            </div>
        ))}</div></CardContent></Card>
    </div>
);

export const AlumniList: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 400);

    const { alumni, meta, isLoading, isFetching, isError, setFilters } = useAlumniList();

    React.useEffect(() => {
        setFilters({ search: debouncedSearch || undefined, page: 1 });
    }, [debouncedSearch, setFilters]);

    if (isLoading) return <AlumniSkeleton />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Data </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Alumni</span>
                        </h1>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200"><Award className="h-5 w-5" /></div>
                    </div>
                    <p className="text-muted-foreground mt-1">Arsip data siswa yang telah lulus dari sekolah.</p>
                </div>
            </div>

            {isError && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">Gagal memuat data alumni.</div>}

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0"><GraduationCap className="h-5 w-5" /></div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Daftar Alumni</CardTitle>
                                <CardDescription>Siswa yang sudah tidak aktif di tahun ajaran berjalan</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">{meta?.total ?? alumni.length} Alumni</Badge>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari nama atau nomor pendaftaran..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="pl-9" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-6 py-4 font-medium text-sm">Nama & No. Pendaftaran</th>
                                    <th className="px-6 py-4 font-medium text-sm">Kelas Terakhir</th>
                                    <th className="px-6 py-4 font-medium text-sm">Tahun Ajaran</th>
                                    <th className="px-6 py-4 font-medium text-sm">Kontak</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumni.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                {searchInput ? <FilterX className="h-8 w-8 text-slate-300" /> : <FileX className="h-8 w-8 text-slate-300" />}
                                            </div>
                                            <p className="text-slate-500 font-medium">{searchInput ? 'Tidak ada hasil' : 'Belum ada data alumni'}</p>
                                            <p className="text-slate-400 text-sm mt-1">Alumni adalah siswa yang tidak lagi terdaftar di kelas aktif</p>
                                        </div>
                                    </td></tr>
                                ) : alumni.map((a) => {
                                    const initials = a.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
                                    return (
                                        <tr key={a.id} className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60">
                                            <td className="pl-4 pr-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-blue-200 shrink-0">
                                                        <AvatarImage src={a.avatar ?? undefined} />
                                                        <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-semibold">{initials}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{a.name}</p>
                                                        <p className="text-xs text-slate-500 font-mono mt-0.5">{a.admission_number}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {a.last_class_name
                                                    ? <Badge className="bg-blue-800 text-white text-xs font-medium">{a.last_class_name}</Badge>
                                                    : <span className="text-sm text-slate-400">—</span>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700">{a.graduation_year ?? '—'}</td>
                                            <td className="px-6 py-4 text-sm text-slate-700">{a.phone ?? '—'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {meta && meta.last_page > 1 && (
                        <PaginationControls currentPage={meta.current_page} totalPages={meta.last_page} totalItems={meta.total}
                            startIndex={(meta.current_page - 1) * meta.per_page + 1} endIndex={Math.min(meta.current_page * meta.per_page, meta.total)}
                            itemsPerPage={meta.per_page} itemLabel="alumni"
                            onPageChange={(page) => setFilters({ page })} onItemsPerPageChange={(perPage) => setFilters({ page: 1, per_page: perPage })} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
