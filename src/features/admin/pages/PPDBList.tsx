'use client';

import React, { useState } from 'react';
import {
    UserPlus, Search, Settings, Trash2, RefreshCw,
    FilterX, FileX, Loader2, CheckCircle, XCircle, MessageSquare,
    ArrowRight, GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { PPDBStatus } from '../types/ppdb';
import { usePpdbList } from '../hooks/usePpdbList';
import { PaginationControls } from '@/features/shared/components/PaginationControls';
import { useRouter } from 'next/navigation';

const STATUS_STYLE: Record<PPDBStatus, string> = {
    pending:   'bg-slate-100 text-slate-700 border-slate-200',
    interview: 'bg-blue-100 text-blue-800 border-blue-200',
    accepted:  'bg-green-100 text-green-800 border-green-200',
    rejected:  'bg-red-100 text-red-800 border-red-200',
};
const STATUS_LABEL: Record<PPDBStatus, string> = {
    pending: 'Menunggu', interview: 'Wawancara', accepted: 'Diterima', rejected: 'Ditolak',
};

const createSchema = z.object({
    name:               z.string().min(3, 'Nama minimal 3 karakter'),
    nisn:               z.string().length(10, 'NISN harus 10 digit'),
    gender:             z.enum(['L', 'P'] as const),
    dob:                z.string().min(1, 'Tanggal lahir wajib diisi'),
    birth_place:        z.string().min(1, 'Tempat lahir wajib diisi'),
    religion:           z.string().optional(),
    previous_school:    z.string().min(1, 'Asal sekolah wajib diisi'),
    average_grade:      z.string().optional(),
    phone:              z.string().optional(),
    parent_name:        z.string().min(3, 'Nama wali wajib diisi'),
    parent_phone:       z.string().min(10, 'No. HP wali wajib diisi'),
    parent_occupation:  z.string().optional(),
});
type CreateValues = z.infer<typeof createSchema>;

const PpdbSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between"><div className="space-y-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-48" /></div><Skeleton className="h-10 w-44" /></div>
        <Card><CardHeader className="pb-4 space-y-4">
            <div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-lg" /><div className="space-y-1"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-28" /></div></div>
            <Skeleton className="h-10 w-full" />
        </CardHeader><CardContent className="p-0"><div className="border-t">{[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
                <div className="flex-1 space-y-1"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-28" /></div>
                <Skeleton className="h-4 w-32" /><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-8 w-8 rounded" />
            </div>
        ))}</div></CardContent></Card>
    </div>
);

export const PPDBList: React.FC = () => {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const debouncedSearch = useDebounce(searchInput, 400);

    const { registrations, meta, isLoading, isFetching, isError, isDeleting, isCreating, setFilters, createRegistration, deleteRegistration, updateStatus } = usePpdbList();

    React.useEffect(() => {
        setFilters({ search: debouncedSearch || undefined, status: statusFilter !== 'all' ? statusFilter as PPDBStatus : undefined, page: 1 });
    }, [debouncedSearch, statusFilter, setFilters]);

    const form = useForm<CreateValues>({
        resolver: zodResolver(createSchema),
        defaultValues: { name: '', nisn: '', gender: 'L', dob: '', birth_place: '', religion: '', previous_school: '', average_grade: '', phone: '', parent_name: '', parent_phone: '', parent_occupation: '' },
    });

    const onSubmit = async (values: CreateValues) => {
        const clean = (v: string | undefined) => v === '' ? undefined : v;
        await createRegistration({
            ...values,
            religion: clean(values.religion),
            average_grade: values.average_grade ? Number(values.average_grade) : undefined,
            phone: clean(values.phone),
            parent_occupation: clean(values.parent_occupation),
        });
        setIsFormOpen(false);
        form.reset();
    };

    if (isLoading) return <PpdbSkeleton />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">PPDB / </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Calon Siswa</span>
                        </h1>
                        <div className="p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200"><UserPlus className="h-5 w-5" /></div>
                    </div>
                    <p className="text-muted-foreground mt-1">Kelola pendaftaran siswa baru (PPDB).</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="bg-blue-800 hover:bg-blue-900 text-white shadow-md">
                    <UserPlus className="h-4 w-4 mr-2" />Tambah Pendaftar
                </Button>
            </div>

            {isError && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">Gagal memuat data PPDB.</div>}

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0"><UserPlus className="h-5 w-5" /></div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Daftar Calon Siswa</CardTitle>
                                <CardDescription>Semua pendaftar PPDB</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">{meta?.total ?? registrations.length} Pendaftar</Badge>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari nama, NISN, atau No. Registrasi..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="pl-9" />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="pending">Menunggu</SelectItem>
                                <SelectItem value="interview">Wawancara</SelectItem>
                                <SelectItem value="accepted">Diterima</SelectItem>
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
                                    <th className="pl-4 pr-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Nama & No. Reg</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Asal Sekolah</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Nilai</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Wali</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            {searchInput || statusFilter !== 'all' ? <FilterX className="h-8 w-8 text-slate-300 mb-2" /> : <FileX className="h-8 w-8 text-slate-300 mb-2" />}
                                            <p className="text-sm text-slate-500">Belum ada data pendaftar</p>
                                        </div>
                                    </td></tr>
                                ) : registrations.map((r) => (
                                    <tr key={r.id} className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60">
                                        <td className="pl-4 pr-6 py-4">
                                            <p className="font-medium text-slate-900">{r.name}</p>
                                            <p className="text-xs text-slate-500 font-mono mt-0.5">{r.registration_number}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">NISN: {r.nisn}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700">{r.previous_school}</td>
                                        <td className="px-6 py-4">
                                            {r.average_grade != null
                                                ? <Badge className="bg-blue-800 text-white text-xs font-medium">{r.average_grade}</Badge>
                                                : <span className="text-sm text-slate-400">—</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-700">{r.parent_name}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{r.parent_phone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="outline" className={cn('text-xs font-medium', STATUS_STYLE[r.status])}>
                                                {STATUS_LABEL[r.status]}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100"><Settings className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52">
                                                    <DropdownMenuLabel>Ubah Status</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {r.status !== 'interview' && (
                                                        <DropdownMenuItem onClick={() => updateStatus({ id: r.id, status: 'interview' })} className="cursor-pointer">
                                                            <MessageSquare className="mr-2 h-4 w-4 text-blue-600" />Jadwalkan Wawancara
                                                        </DropdownMenuItem>
                                                    )}
                                                    {r.status !== 'accepted' && (
                                                        <DropdownMenuItem onClick={() => updateStatus({ id: r.id, status: 'accepted' })} className="cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50">
                                                            <CheckCircle className="mr-2 h-4 w-4" />Terima
                                                        </DropdownMenuItem>
                                                    )}
                                                    {r.status !== 'rejected' && (
                                                        <DropdownMenuItem onClick={() => updateStatus({ id: r.id, status: 'rejected' })} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                                            <XCircle className="mr-2 h-4 w-4" />Tolak
                                                        </DropdownMenuItem>
                                                    )}
                                                    {r.status === 'accepted' && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => router.push(`/admin/users/students/new?from_ppdb=${r.id}&name=${encodeURIComponent(r.name)}&nisn=${encodeURIComponent(r.nisn)}&dob=${encodeURIComponent(r.dob)}&birth_place=${encodeURIComponent(r.birth_place)}&gender=${r.gender}&previous_school=${encodeURIComponent(r.previous_school)}&parent_name=${encodeURIComponent(r.parent_name)}&parent_phone=${encodeURIComponent(r.parent_phone)}`)}
                                                                className="cursor-pointer text-blue-700 focus:text-blue-700 focus:bg-blue-50"
                                                            >
                                                                <GraduationCap className="mr-2 h-4 w-4" />
                                                                Daftarkan sebagai Siswa
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setDeleteId(r.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
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
                            itemsPerPage={meta.per_page} itemLabel="pendaftar"
                            onPageChange={(page) => setFilters({ page })} onItemsPerPageChange={(perPage) => setFilters({ page: 1, per_page: perPage })} />
                    )}
                </CardContent>
            </Card>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0"><UserPlus className="h-5 w-5" /></div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-slate-800">Tambah Pendaftar PPDB</DialogTitle>
                                <DialogDescription className="text-sm text-slate-500 mt-0.5">Isi data calon siswa baru.</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem className="col-span-2"><FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input placeholder="Nama sesuai ijazah" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="nisn" render={({ field }) => (
                                    <FormItem><FormLabel>NISN <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input placeholder="10 digit NISN" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem><FormLabel>Jenis Kelamin <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="L">Laki-laki</SelectItem><SelectItem value="P">Perempuan</SelectItem></SelectContent>
                                        </Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="birth_place" render={({ field }) => (
                                    <FormItem><FormLabel>Tempat Lahir <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input placeholder="Kota lahir" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="dob" render={({ field }) => (
                                    <FormItem><FormLabel>Tanggal Lahir <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="previous_school" render={({ field }) => (
                                    <FormItem><FormLabel>Asal Sekolah <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input placeholder="Nama sekolah asal" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="average_grade" render={({ field }) => (
                                    <FormItem><FormLabel>Nilai Rata-rata</FormLabel>
                                        <FormControl><Input type="number" placeholder="0-100" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="parent_name" render={({ field }) => (
                                    <FormItem><FormLabel>Nama Wali <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input placeholder="Nama orang tua/wali" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="parent_phone" render={({ field }) => (
                                    <FormItem><FormLabel>No. HP Wali <span className="text-red-500">*</span></FormLabel>
                                        <FormControl><Input placeholder="08xxxxxxxxxx" autoComplete="off" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isCreating}><XCircle className="h-4 w-4 mr-2" />Batal</Button>
                                <Button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white min-w-[140px]" disabled={isCreating}>
                                    {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : <><UserPlus className="mr-2 h-4 w-4" />Tambah Pendaftar</>}
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
                            <div><AlertDialogTitle className="text-lg">Hapus Data PPDB?</AlertDialogTitle><AlertDialogDescription className="mt-1">Data pendaftar akan dihapus permanen.</AlertDialogDescription></div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { if (deleteId) { deleteRegistration(deleteId); setDeleteId(null); } }} className="bg-red-600 hover:bg-red-700 text-white" disabled={isDeleting}>
                            {isDeleting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menghapus...</> : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
