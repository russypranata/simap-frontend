'use client';

import React, { useState } from 'react';
import {
    ArrowLeftRight, Search, Settings, ArrowRightCircle, ArrowLeftCircle,
    Trash2, RefreshCw, FilterX, FileX, Loader2, CheckCircle, XCircle, Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { format } from 'date-fns';
import { id as indonesia } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { MutationType, MutationStatus } from '../types/mutation';
import { useMutationList } from '../hooks/useMutationList';
import { PaginationControls } from '@/features/shared/components/PaginationControls';

const STATUS_STYLE: Record<MutationStatus, string> = {
    pending:  'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
};
const STATUS_LABEL: Record<MutationStatus, string> = { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' };
const TYPE_LABEL: Record<MutationType, string> = { in: 'Masuk', out: 'Keluar' };

const createSchema = z.object({
    student_name:       z.string().min(3, 'Nama minimal 3 karakter'),
    admission_number:   z.string().optional(),
    type:               z.enum(['in', 'out'] as const),
    mutation_date:      z.string().min(1, 'Tanggal wajib diisi'),
    school_origin:      z.string().optional(),
    school_destination: z.string().optional(),
    reason:             z.string().optional(),
});
type CreateValues = z.infer<typeof createSchema>;

const MutationSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between"><div className="space-y-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-48" /></div><Skeleton className="h-10 w-44" /></div>
        <Card><CardHeader className="pb-4 space-y-4">
            <div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-lg" /><div className="space-y-1"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-28" /></div></div>
            <Skeleton className="h-10 w-full" />
        </CardHeader><CardContent className="p-0"><div className="border-t">{[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
                <div className="flex-1 space-y-1"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-28" /></div>
                <Skeleton className="h-6 w-16 rounded-full" /><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-8 w-8 rounded" />
            </div>
        ))}</div></CardContent></Card>
    </div>
);

export const MutationList: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const debouncedSearch = useDebounce(searchInput, 400);

    const { mutations, meta, isLoading, isFetching, isError, isDeleting, isCreating, setFilters, createMutation, deleteMutation, approveMutation, rejectMutation } = useMutationList();

    React.useEffect(() => {
        setFilters({
            search: debouncedSearch || undefined,
            type: typeFilter !== 'all' ? typeFilter as MutationType : undefined,
            status: statusFilter !== 'all' ? statusFilter as MutationStatus : undefined,
            page: 1,
        });
    }, [debouncedSearch, typeFilter, statusFilter, setFilters]);

    const form = useForm<CreateValues>({
        resolver: zodResolver(createSchema),
        defaultValues: { student_name: '', admission_number: '', type: 'in', mutation_date: '', school_origin: '', school_destination: '', reason: '' },
    });

    const onSubmit = async (values: CreateValues) => {
        const clean = (v: string | undefined) => v === '' ? undefined : v;
        await createMutation({ ...values, admission_number: clean(values.admission_number), school_origin: clean(values.school_origin), school_destination: clean(values.school_destination), reason: clean(values.reason) });
        setIsFormOpen(false);
        form.reset();
    };

    if (isLoading) return <MutationSkeleton />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Mutasi </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Siswa</span>
                        </h1>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200"><ArrowLeftRight className="h-5 w-5" /></div>
                    </div>
                    <p className="text-muted-foreground mt-1">Riwayat perpindahan siswa masuk dan keluar.</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="bg-blue-800 hover:bg-blue-900 text-white shadow-md">
                    <ArrowLeftRight className="h-4 w-4 mr-2" />Input Mutasi Baru
                </Button>
            </div>

            {isError && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">Gagal memuat data mutasi.</div>}

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0"><ArrowLeftRight className="h-5 w-5" /></div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Daftar Mutasi</CardTitle>
                                <CardDescription>Semua catatan mutasi siswa</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">{meta?.total ?? mutations.length} Mutasi</Badge>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari nama siswa atau nomor pendaftaran..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="pl-9" />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Jenis" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jenis</SelectItem>
                                <SelectItem value="in">Masuk</SelectItem>
                                <SelectItem value="out">Keluar</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="pending">Menunggu</SelectItem>
                                <SelectItem value="approved">Disetujui</SelectItem>
                                <SelectItem value="rejected">Ditolak</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Siswa</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Jenis</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Asal / Tujuan</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mutations.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            {searchInput || typeFilter !== 'all' || statusFilter !== 'all' ? <FilterX className="h-8 w-8 text-slate-300 mb-2" /> : <FileX className="h-8 w-8 text-slate-300 mb-2" />}
                                            <p className="text-sm text-slate-500">Belum ada data mutasi</p>
                                        </div>
                                    </td></tr>
                                ) : mutations.map((m) => (
                                    <tr key={m.id} className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60">
                                        <td className="pl-4 pr-6 py-4">
                                            <p className="font-medium text-slate-900">{m.student_name}</p>
                                            {m.admission_number && <p className="text-xs text-slate-500 font-mono mt-0.5">{m.admission_number}</p>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {m.type === 'in' ? <ArrowRightCircle className="h-4 w-4 text-green-600" /> : <ArrowLeftCircle className="h-4 w-4 text-red-600" />}
                                                <span className="text-sm text-slate-700">{TYPE_LABEL[m.type]}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">
                                            {m.type === 'in' ? (m.school_origin ? `Dari: ${m.school_origin}` : '—') : (m.school_destination ? `Ke: ${m.school_destination}` : '—')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">
                                            {m.mutation_date ? format(new Date(m.mutation_date), 'dd MMM yyyy', { locale: indonesia }) : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="outline" className={cn('text-xs font-medium', STATUS_STYLE[m.status])}>
                                                {STATUS_LABEL[m.status]}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100"><Settings className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44">
                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {m.status === 'pending' && (<>
                                                        <DropdownMenuItem onClick={() => approveMutation(m.id)} className="cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50">
                                                            <CheckCircle className="mr-2 h-4 w-4" />Setujui
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => rejectMutation({ id: m.id })} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                            <XCircle className="mr-2 h-4 w-4" />Tolak
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>)}
                                                    <DropdownMenuItem onClick={() => setDeleteId(m.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                                        <Trash2 className="mr-2 h-4 w-4" />Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {meta && meta.last_page > 1 && (
                        <PaginationControls currentPage={meta.current_page} totalPages={meta.last_page} totalItems={meta.total}
                            startIndex={(meta.current_page - 1) * meta.per_page + 1} endIndex={Math.min(meta.current_page * meta.per_page, meta.total)}
                            itemsPerPage={meta.per_page} itemLabel="mutasi"
                            onPageChange={(page) => setFilters({ page })} onItemsPerPageChange={(perPage) => setFilters({ page: 1, per_page: perPage })} />
                    )}
                </CardContent>
            </Card>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0"><ArrowLeftRight className="h-5 w-5" /></div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-slate-800">Input Mutasi Baru</DialogTitle>
                                <DialogDescription className="text-sm text-slate-500 mt-0.5">Catat perpindahan siswa masuk atau keluar.</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="student_name" render={({ field }) => (
                                    <FormItem className="col-span-2"><FormLabel>Nama Siswa <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input placeholder="Nama lengkap siswa" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="admission_number" render={({ field }) => (
                                    <FormItem><FormLabel>No. Pendaftaran</FormLabel>
                                        <FormControl><Input placeholder="ADM-XXXX" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="type" render={({ field }) => (
                                    <FormItem><FormLabel>Jenis Mutasi <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="in">Masuk</SelectItem><SelectItem value="out">Keluar</SelectItem></SelectContent>
                                        </Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="mutation_date" render={({ field }) => (
                                    <FormItem><FormLabel>Tanggal <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="school_origin" render={({ field }) => (
                                    <FormItem><FormLabel>Asal Sekolah</FormLabel>
                                        <FormControl><Input placeholder="Nama sekolah asal" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="school_destination" render={({ field }) => (
                                    <FormItem><FormLabel>Sekolah Tujuan</FormLabel>
                                        <FormControl><Input placeholder="Nama sekolah tujuan" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="reason" render={({ field }) => (
                                    <FormItem className="col-span-2"><FormLabel>Alasan</FormLabel>
                                        <FormControl><Textarea placeholder="Alasan mutasi..." className="resize-none h-16" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isCreating}><XCircle className="h-4 w-4 mr-2" />Batal</Button>
                                <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white min-w-[130px]" disabled={isCreating}>
                                    {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : <><Save className="mr-2 h-4 w-4" />Simpan Mutasi</>}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0"><Trash2 className="h-6 w-6 text-red-600" /></div>
                            <div><AlertDialogTitle className="text-lg">Hapus Data Mutasi?</AlertDialogTitle><AlertDialogDescription className="mt-1">Data akan dihapus permanen.</AlertDialogDescription></div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { if (deleteId) { deleteMutation(deleteId); setDeleteId(null); } }} className="bg-red-600 hover:bg-red-700 text-white" disabled={isDeleting}>
                            {isDeleting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menghapus...</> : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
