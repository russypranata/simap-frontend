'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    Settings,
    Edit,
    Trash2,
    Eye,
    BookOpen,
    FileX,
    FilterX,
    Users,
    RefreshCw,
    BookMarked,
    GraduationCap,
    Layers,
    BookOpenCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Checkbox } from '@/components/ui/checkbox';
import { StatCard } from '@/features/shared/components';
import { SubjectListSkeleton } from '../components/subject';
import { useSubjectList } from '../hooks/useSubjectList';
import { useBreadcrumbAction } from '@/context/BreadcrumbActionContext';
import { SubjectCategory } from '../types/subject';

const formatCategory = (cat: SubjectCategory) => {
    const mapping: Record<SubjectCategory, string> = {
        UMUM: 'Umum',
        AGAMA: 'Agama',
        KEJURUAN: 'Kejuruan',
        EKSKUL: 'Muatan Lokal',
    };
    return mapping[cat] || cat;
};

export const SubjectList: React.FC = () => {
    const router = useRouter();
    const { setAction, clearAction } = useBreadcrumbAction();

    const { subjects, isLoading, isFetching, isDeleting, deleteSubject, deleteBulk } = useSubjectList();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);

    React.useEffect(() => {
        if (isFetching) {
            setAction(
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden sm:inline">Memperbarui...</span>
                </div>
            );
        } else {
            clearAction();
        }
        return () => clearAction();
    }, [isFetching, setAction, clearAction]);

    const filteredSubjects = useMemo(() =>
        subjects.filter(s => {
            const matchSearch =
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;
            const matchType = selectedType === 'all' || s.type === selectedType;
            const matchGrade = selectedGrade === 'all' || (s.gradeLevel && s.gradeLevel.includes(selectedGrade));
            return matchSearch && matchCategory && matchType && matchGrade;
        }),
        [subjects, searchTerm, selectedCategory, selectedType, selectedGrade]
    );

    // Pagination
    const PAGE_SIZE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Reset ke halaman 1 saat filter berubah
    React.useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory, selectedType, selectedGrade]);

    const totalPages = Math.ceil(filteredSubjects.length / PAGE_SIZE);
    const paginatedSubjects = useMemo(() =>
        filteredSubjects.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [filteredSubjects, currentPage]
    );

    const stats = useMemo(() => ({
        total: subjects.length,
        wajib: subjects.filter(s => s.type === 'WAJIB').length,
        peminatan: subjects.filter(s => s.type === 'PEMINATAN').length,
    }), [subjects]);

    const toggleSelectAll = () => {
        setSelectedItems(
            selectedItems.length === filteredSubjects.length
                ? []
                : filteredSubjects.map(s => s.id)
        );
    };

    const toggleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        if (isBulkDelete) {
            await deleteBulk(selectedItems);
            setSelectedItems([]);
            setIsBulkDelete(false);
        } else if (deleteId) {
            await deleteSubject(deleteId);
            setSelectedItems(prev => prev.filter(id => id !== deleteId));
            setDeleteId(null);
        }
    };

    if (isLoading) return <SubjectListSkeleton />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Daftar{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Mata Pelajaran
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <BookOpen className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola kurikulum dan pembagian guru pengampu
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/subject/new')}
                    className="bg-blue-800 hover:bg-blue-900 text-white"
                >
                    <BookOpenCheck className="h-4 w-4 mr-2" />
                    Tambah Mapel
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Mata Pelajaran"
                    value={stats.total}
                    subtitle="Terdaftar dalam sistem"
                    icon={BookMarked}
                    color="blue"
                />
                <StatCard
                    title="Mapel Wajib"
                    value={stats.wajib}
                    subtitle="Mata pelajaran wajib"
                    icon={GraduationCap}
                    color="emerald"
                />
                <StatCard
                    title="Mapel Peminatan"
                    value={stats.peminatan}
                    subtitle="Mata pelajaran peminatan"
                    icon={Layers}
                    color="indigo"
                />
            </div>

            {/* Table Card */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                <BookOpen className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    Data Mata Pelajaran
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-600">
                                    Semua mata pelajaran yang terdaftar dalam sistem
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {filteredSubjects.length} Data
                        </Badge>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau kode..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 w-full"
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tipe</SelectItem>
                                    <SelectItem value="WAJIB">Wajib</SelectItem>
                                    <SelectItem value="PEMINATAN">Peminatan</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    <SelectItem value="10">Kelas 10</SelectItem>
                                    <SelectItem value="11">Kelas 11</SelectItem>
                                    <SelectItem value="12">Kelas 12</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    <SelectItem value="UMUM">Umum</SelectItem>
                                    <SelectItem value="AGAMA">Agama</SelectItem>
                                    <SelectItem value="KEJURUAN">Kejuruan</SelectItem>
                                    <SelectItem value="EKSKUL">Muatan Lokal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="pl-4 pr-0 py-4 w-[40px]">
                                        <Checkbox
                                            checked={filteredSubjects.length > 0 && selectedItems.length === filteredSubjects.length}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="text-left pl-3 pr-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Mata Pelajaran</th>
                                    <th className="text-center px-4 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Tipe</th>
                                    <th className="text-left px-4 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Tingkat</th>
                                    <th className="text-center px-4 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Kategori</th>
                                    <th className="text-left px-4 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Pengampu</th>
                                    <th className="text-center px-4 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12">
                                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="w-14 h-14 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center">
                                                    {searchTerm || selectedCategory !== 'all' || selectedType !== 'all' || selectedGrade !== 'all'
                                                        ? <FilterX className="h-7 w-7 text-slate-400" />
                                                        : <FileX className="h-7 w-7 text-slate-400" />
                                                    }
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">
                                                        {searchTerm || selectedCategory !== 'all' || selectedType !== 'all' || selectedGrade !== 'all'
                                                            ? 'Tidak ada hasil yang cocok'
                                                            : 'Belum ada mata pelajaran'}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        {searchTerm || selectedCategory !== 'all' || selectedType !== 'all' || selectedGrade !== 'all'
                                                            ? 'Coba ubah filter pencarian'
                                                            : 'Klik tombol "Tambah Mapel" untuk menambahkan'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedSubjects.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={cn(
                                                "border-b border-slate-100 transition-colors",
                                                selectedItems.includes(item.id)
                                                    ? "bg-blue-50/50"
                                                    : "hover:bg-slate-50/50"
                                            )}
                                        >
                                            <td className="pl-4 pr-0 py-4">
                                                <Checkbox
                                                    checked={selectedItems.includes(item.id)}
                                                    onCheckedChange={() => toggleSelectItem(item.id)}
                                                />
                                            </td>
                                            <td className="pl-3 pr-6 py-4">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">KODE:</span>
                                                        <span className="text-xs text-slate-500 font-mono">{item.code}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[11px] px-2.5 py-0.5 font-medium",
                                                        item.type === 'WAJIB'
                                                            ? "bg-blue-50 text-blue-800 border-blue-200"
                                                            : "bg-amber-50 text-amber-600 border-amber-200"
                                                    )}
                                                >
                                                    {item.type === 'WAJIB' ? 'Wajib' : 'Peminatan'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {item.gradeLevel && item.gradeLevel.length > 0 ? (
                                                        item.gradeLevel.sort().map(level => (
                                                            <span
                                                                key={level}
                                                                className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200"
                                                            >
                                                                Kelas {level}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-400">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="text-sm font-medium text-slate-600">
                                                    {formatCategory(item.category)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {item.teacherNames && item.teacherNames.length > 0 ? (
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                                            <Users className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-800">
                                                            {item.teacherNames.join(', ')}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-dashed border-slate-200">
                                                            <Users className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-sm italic">Belum diset</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-colors"
                                                        onClick={() => router.push(`/admin/subject/${item.id}`)}
                                                        title="Detail"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-colors"
                                                        onClick={() => router.push(`/admin/subject/${item.id}/edit`)}
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"
                                                        onClick={() => setDeleteId(item.id)}
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-xs text-slate-500">
                                Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredSubjects.length)} dari {filteredSubjects.length} data
                            </p>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    ‹ Prev
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, i) =>
                                        p === '...' ? (
                                            <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-400">…</span>
                                        ) : (
                                            <Button
                                                key={p}
                                                variant={currentPage === p ? 'default' : 'outline'}
                                                size="sm"
                                                className={cn("h-7 w-7 p-0 text-xs", currentPage === p && "bg-blue-800 hover:bg-blue-900")}
                                                onClick={() => setCurrentPage(p as number)}
                                            >
                                                {p}
                                            </Button>
                                        )
                                    )
                                }
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next ›
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bulk Action Bar */}
            {selectedItems.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-slate-800">
                        <div className="flex items-center gap-2 pr-6 border-r border-slate-700">
                            <span className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {selectedItems.length}
                            </span>
                            <span className="text-sm font-medium text-slate-300">Mapel dipilih</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-slate-800 h-9"
                                onClick={() => setIsBulkDelete(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2 text-red-400" />
                                Hapus Massal
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-slate-800 h-9"
                                onClick={() => setSelectedItems([])}
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deleteId || isBulkDelete}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteId(null);
                        setIsBulkDelete(false);
                    }
                }}
            >
                <AlertDialogContent className="max-w-[400px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isBulkDelete
                                ? `Hapus ${selectedItems.length} Mata Pelajaran?`
                                : 'Hapus Mata Pelajaran?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Seluruh data terkait{' '}
                            {isBulkDelete ? 'mata pelajaran terpilih' : 'mata pelajaran ini'} akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => { e.preventDefault(); handleDelete(); }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
