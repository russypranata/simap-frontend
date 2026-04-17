'use client';

import React, { useState } from 'react';
import {
    BookOpen, Search, FileText, Trash2, Edit,
    FilterX, FileX, RefreshCw, Loader2,
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
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import { Curriculum, CurriculumStatus } from '../types/curriculum';
import { useCurriculumList } from '../hooks/useCurriculumList';
import { CurriculumForm } from '../components/forms/CurriculumForm';
import { CurriculumFormValues } from '../schemas/curriculumSchema';

const STATUS_STYLE: Record<CurriculumStatus, string> = {
    active:   'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    draft:    'bg-amber-100 text-amber-700 border-amber-200',
};
const STATUS_LABEL: Record<CurriculumStatus, string> = {
    active: 'Aktif', inactive: 'Tidak Aktif', draft: 'Draft',
};

const CurriculumSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="space-y-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-48" /></div>
            <Skeleton className="h-10 w-44" />
        </div>
        <Card><CardHeader className="pb-4 space-y-4">
            <div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-lg" /><div className="space-y-1"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-28" /></div></div>
            <Skeleton className="h-10 w-full" />
        </CardHeader><CardContent className="p-0"><div className="border-t">{[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
                <div className="flex-1 space-y-1"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-24" /></div>
                <Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-16 rounded-full" /><Skeleton className="h-8 w-8 rounded" />
            </div>
        ))}</div></CardContent></Card>
    </div>
);

export const CurriculumList: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Curriculum | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const debouncedSearch = useDebounce(searchInput, 400);

    const {
        curricula, isLoading, isFetching, isError,
        isCreating, isUpdating, isDeleting,
        setFilters, createCurriculum, updateCurriculum, deleteCurriculum,
    } = useCurriculumList();

    React.useEffect(() => {
        setFilters({
            search: debouncedSearch || undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            page: 1,
        });
    }, [debouncedSearch, statusFilter, setFilters]);

    const handleSubmit = async (values: CurriculumFormValues) => {
        if (editingItem) {
            await updateCurriculum({ id: editingItem.id, data: values });
        } else {
            await createCurriculum(values);
        }
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const openEdit = (item: Curriculum) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const openCreate = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    if (isLoading) return <CurriculumSkeleton />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Data </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Kurikulum</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <BookOpen className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">Kelola struktur kurikulum (K13/Merdeka) yang berlaku.</p>
                </div>
                <Button onClick={openCreate} className="bg-blue-800 hover:bg-blue-900 text-white shadow-md">
                    <FileText className="h-4 w-4 mr-2" />Tambah Kurikulum
                </Button>
            </div>

            {isError && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">Gagal memuat data kurikulum.</div>}

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Daftar Kurikulum</CardTitle>
                                <CardDescription>Semua kurikulum yang terdaftar di sistem</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">{curricula.length} Kurikulum</Badge>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari nama atau kode kurikulum..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="pl-9" />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-6 py-4 font-medium text-sm">Nama Kurikulum</th>
                                    <th className="px-6 py-4 font-medium text-sm">Tahun Ajaran</th>
                                    <th className="px-6 py-4 font-medium text-sm text-center">Status</th>
                                    <th className="px-6 py-4 font-medium text-sm text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {curricula.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                {searchInput || statusFilter !== 'all' ? <FilterX className="h-8 w-8 text-slate-300" /> : <FileX className="h-8 w-8 text-slate-300" />}
                                            </div>
                                            <p className="text-slate-500 font-medium">{searchInput || statusFilter !== 'all' ? 'Tidak ada hasil' : 'Belum ada kurikulum'}</p>
                                        </div>
                                    </td></tr>
                                ) : curricula.map((item) => (
                                    <tr key={item.id} className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60">
                                        <td className="pl-4 pr-6 py-4">
                                            <p className="font-medium text-slate-900">{item.name}</p>
                                            <p className="text-xs text-slate-500 font-mono mt-0.5">{item.code}</p>
                                            {item.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{item.description}</p>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{item.academicYearName || '—'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="outline" className={cn('text-xs font-medium', STATUS_STYLE[item.status])}>
                                                {STATUS_LABEL[item.status]}
                                            </Badge>
                                        </td>
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
                                                    <DropdownMenuItem onClick={() => openEdit(item)} className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4 text-amber-600" />Edit Struktur
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setDeleteId(item.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
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
                </CardContent>
            </Card>

            <CurriculumForm
                open={isFormOpen}
                onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingItem(null); }}
                initialData={editingItem}
                onSubmit={handleSubmit}
                isSubmitting={isCreating || isUpdating}
            />

            <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0"><Trash2 className="h-6 w-6 text-red-600" /></div>
                            <div>
                                <AlertDialogTitle className="text-lg">Hapus Kurikulum?</AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">Data kurikulum akan dihapus permanen.</AlertDialogDescription>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => { if (deleteId) { deleteCurriculum(deleteId); setDeleteId(null); } }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menghapus...</> : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
