'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Award, Users, Search, Trash2,
    Calendar, Loader2, FilterX, FileX, Settings, ArrowLeft,
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
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

import {
    useExtracurricularDetail,
    useExtracurricularMembers,
} from '@/features/admin/hooks/useExtracurricular';
import { ExtracurricularMember } from '@/features/admin/types/extracurricular';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const MembersSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
        </div>
        <Card>
            <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
            <CardContent className="p-0">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-24 ml-auto" />
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExtracurricularMembersPage() {
    const params = useParams();
    const router = useRouter();
    const ekskulId = Number(params.id);

    const [searchInput, setSearchInput] = useState('');
    const [removeId, setRemoveId] = useState<number | null>(null);

    const debouncedSearch = useDebounce(searchInput, 300);

    const { data, isLoading, isError } = useExtracurricularDetail(ekskulId);
    const { removeMember, isRemoving } = useExtracurricularMembers(ekskulId);

    const ekskul = data?.extracurricular;
    const allMembers: ExtracurricularMember[] = data?.members ?? [];

    const activeMembers = allMembers.filter((m) => m.status === 'active');
    const filteredMembers = activeMembers.filter((m) =>
        !debouncedSearch ||
        (m.student_name ?? '').toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    if (isLoading) return <MembersSkeleton />;

    if (isError || !ekskul) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Award className="h-12 w-12 text-red-400" />
                <p className="text-slate-600 font-medium">Data ekstrakurikuler tidak ditemukan</p>
                <Button variant="outline" onClick={() => router.push('/admin/extracurricular')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar
                </Button>
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
                                Anggota{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                {ekskul.name}
                            </span>
                        </h1>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola keanggotaan siswa di ekstrakurikuler ini.
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/extracurricular')}
                    variant="outline"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar
                </Button>
            </div>

            {/* ── Info Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            <Award className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Tutor</p>
                            <p className="font-semibold text-slate-900 text-sm">{ekskul.tutor_name ?? '—'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Anggota Aktif</p>
                            <p className="font-semibold text-slate-900 text-sm">{activeMembers.length} siswa</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Jadwal</p>
                            <p className="font-semibold text-slate-900 text-sm">
                                {ekskul.regular_schedules.length > 0
                                    ? `${ekskul.regular_schedules[0].day}, ${ekskul.regular_schedules[0].time_start}`
                                    : 'Belum ada jadwal'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Members Table ── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Daftar Anggota</CardTitle>
                                <CardDescription>Semua anggota aktif ekstrakurikuler ini</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                            {activeMembers.length} Anggota
                        </Badge>
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama siswa..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
                        <Award className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700">
                            Penambahan anggota dilakukan oleh tutor ekskul. Admin hanya dapat melihat dan mengeluarkan anggota.
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-6 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500">Siswa</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500">Status</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500">Bergabung</th>
                                    <th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    {searchInput
                                                        ? <FilterX className="h-8 w-8 text-slate-300" />
                                                        : <FileX className="h-8 w-8 text-slate-300" />
                                                    }
                                                </div>
                                                <p className="text-slate-500 font-medium">
                                                    {searchInput ? 'Tidak ada hasil' : 'Belum ada anggota'}
                                                </p>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    {searchInput ? 'Coba ubah kata kunci' : 'Anggota ditambahkan oleh tutor ekskul'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMembers.map((member) => {
                                        const initials = (member.student_name ?? 'SS')
                                            .split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
                                        return (
                                            <tr key={member.id} className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60">
                                                <td className="pl-4 pr-6 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 border border-blue-200 shrink-0">
                                                            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-semibold">
                                                                {initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-semibold text-sm text-slate-900">{member.student_name ?? '—'}</p>
                                                            <p className="text-xs text-slate-400 mt-0.5">ID #{member.student_profile_id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <Badge className={cn(
                                                        'text-xs font-medium',
                                                        member.status === 'active'
                                                            ? 'bg-green-100 text-green-800 border-green-200'
                                                            : 'bg-slate-100 text-slate-600 border-slate-200'
                                                    )}>
                                                        {member.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-3.5 text-sm text-slate-600">
                                                    {member.join_date
                                                        ? new Date(member.join_date).toLocaleDateString('id-ID', {
                                                            day: '2-digit', month: 'short', year: 'numeric',
                                                        })
                                                        : '—'}
                                                </td>
                                                <td className="px-6 py-3.5 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                                                <Settings className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => setRemoveId(member.id)}
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Keluarkan
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ── Remove Confirmation ── */}
            <AlertDialog
                open={removeId !== null}
                onOpenChange={(open) => { if (!open) setRemoveId(null); }}
            >
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg">Keluarkan Anggota?</AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">
                                    Siswa ini akan dinonaktifkan dari keanggotaan ekskul.
                                </AlertDialogDescription>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel disabled={isRemoving}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => { if (removeId) { removeMember(removeId); setRemoveId(null); } }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isRemoving}
                        >
                            {isRemoving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Memproses...</> : 'Ya, Keluarkan'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
