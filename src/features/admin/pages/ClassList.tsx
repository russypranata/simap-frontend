'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    FolderPlus,
    Search,
    Edit,
    Trash2,
    Eye,
    School,
    Users,
    UserCheck,
    FileX,
    BookOpen,
    X,
} from 'lucide-react';import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

import { ClassRoom } from '../types/class';
import { classService } from '../services/classService';
import { useClassList, useAcademicYearsList, useTeachers, useAssignHomeroom } from '../hooks/useClassManagement';
import { ClassListSkeleton, AssignHomeroomModal } from '../components/class';
import { StatCard, ErrorState, EmptyState } from '@/features/shared/components';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ── Helpers ───────────────────────────────────────────────────────────────────
const CLASS_TYPE_LABEL: Record<string, string> = {
    reguler:          'Reguler',
    peminatan_group:  'Peminatan',
};

const CLASS_TYPE_STYLE: Record<string, string> = {
    reguler:         'bg-blue-50 text-blue-700 border-blue-200',
    peminatan_group: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const ClassList: React.FC = () => {
    const router = useRouter();

    // ── Filters ──────────────────────────────────────────────────────────
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    // ── Selection State ───────────────────────────────────────────────────
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    // ── Delete Dialog State ───────────────────────────────────────────────
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // ── Assign Homeroom State ─────────────────────────────────────────────
    const [homeroomModalOpen, setHomeroomModalOpen] = useState(false);
    const [selectedClassForHomeroom, setSelectedClassForHomeroom] = useState<ClassRoom | null>(null);

    // ── Data Fetching ─────────────────────────────────────────────────────
    const { data: academicYears = [], isLoading: isYearsLoading } = useAcademicYearsList();

    // Auto-select active year once years are loaded
    React.useEffect(() => {
        if (academicYears.length > 0 && !selectedYear) {
            const activeYear = academicYears.find(y => y.isActive);
            setSelectedYear(activeYear?.id ?? academicYears[0].id);
        }
    }, [academicYears, selectedYear]);

    const {
        data: classes = [],
        isLoading: isClassesLoading,
        isError,
        refetch,
    } = useClassList(selectedYear);

    const { data: teachers = [] } = useTeachers();
    const assignMutation = useAssignHomeroom();

    const isLoading = isYearsLoading || isClassesLoading;

    // ── Stats ─────────────────────────────────────────────────────────────
    const stats = useMemo(() => ({
        totalClasses:    classes.length,
        totalReguler:    classes.filter(c => (c.type ?? 'reguler') === 'reguler').length,
        totalPeminatan:  classes.filter(c => c.type === 'peminatan_group').length,
        withoutHomeroom: classes.filter(c => (c.type ?? 'reguler') === 'reguler' && !c.homeroom_teacher_id).length,
    }), [classes]);

    // ── Filter Logic ──────────────────────────────────────────────────────
    const filteredClasses = useMemo(() =>
        classes.filter((cls) => {
            const term = searchTerm.toLowerCase();
            const matchSearch = (
                cls.name.toLowerCase().includes(term) ||
                (cls.homeroom_teacher_name ?? '').toLowerCase().includes(term)
            );
            const matchType = typeFilter === 'all' || (cls.type ?? 'reguler') === typeFilter;
            return matchSearch && matchType;
        }),
        [classes, searchTerm, typeFilter]
    );

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteId && !isBulkDelete) return;

        try {
            setIsDeleting(true);
            if (isBulkDelete) {
                await Promise.all(selectedItems.map(id => classService.deleteClass(id)));
                toast.success(`${selectedItems.length} kelas berhasil dihapus`);
                setSelectedItems([]);
                refetch();
            } else if (deleteId !== null) {
                await classService.deleteClass(deleteId);
                toast.success('Kelas berhasil dihapus');
                setSelectedItems(prev => prev.filter(id => id !== deleteId));
                refetch();
            }
        } catch {
            toast.error('Gagal menghapus data');
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
            setIsBulkDelete(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredClasses.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredClasses.map(c => c.id));
        }
    };

    const toggleSelectItem = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleOpenHomeroomModal = (item: ClassRoom) => {
        setSelectedClassForHomeroom(item);
        setHomeroomModalOpen(true);
    };

    const handleAssignHomeroom = (classId: number, teacherId: number | null) => {
        assignMutation.mutate(
            { classId, teacherId },
            { onSuccess: () => setHomeroomModalOpen(false) }
        );
    };

    // ── Loading State ─────────────────────────────────────────────────────
    if (isLoading) {
        return <ClassListSkeleton />;
    }

    // ── Error State ───────────────────────────────────────────────────────
    if (isError) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                            Daftar{' '}
                        </span>
                        <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                            Kelas
                        </span>
                    </h1>
                </div>
                <ErrorState
                    error="Gagal memuat data kelas. Periksa koneksi Anda dan coba lagi."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Daftar{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Kelas
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <School className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data rombongan belajar dan wali kelas
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/class/new')}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <FolderPlus className="mr-2 h-4 w-4" /> Tambah Kelas
                </Button>
            </div>

            {/* ── StatCards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard
                    title="Total Kelas"
                    value={stats.totalClasses}
                    icon={School}
                    color="blue"
                    subtitle="Semua kelas aktif"
                />
                <StatCard
                    title="Kelas Reguler"
                    value={stats.totalReguler}
                    icon={Users}
                    color="green"
                    subtitle="Kelas inti"
                />
                <StatCard
                    title="Kelas Peminatan"
                    value={stats.totalPeminatan}
                    icon={BookOpen}
                    color="amber"
                    subtitle="Wadah peminatan"
                />
                <StatCard
                    title="Tanpa Wali Kelas"
                    value={stats.withoutHomeroom}
                    icon={UserCheck}
                    color="amber"
                    subtitle="Kelas reguler"
                />
            </div>

            {/* ── Table Card ── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <School className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Data Kelas</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Total {filteredClasses.length} kelas ditampilkan
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Filter Tipe */}
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="h-9 w-[150px]">
                                    <SelectValue placeholder="Semua Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tipe</SelectItem>
                                    <SelectItem value="reguler">Reguler</SelectItem>
                                    <SelectItem value="peminatan_group">Peminatan</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Filter Tahun Ajaran */}
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="h-9 w-[180px]">
                                    <SelectValue placeholder="Tahun Ajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map((year) => (
                                        <SelectItem key={year.id} value={year.id}>
                                            {year.name} {year.isActive && '(Aktif)'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Search */}
                            <div className="relative w-full sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari kelas atau wali kelas..."
                                    className="pl-9 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-4 w-[50px] text-center">
                                        <Checkbox
                                            checked={
                                                filteredClasses.length > 0 &&
                                                selectedItems.length === filteredClasses.length
                                            }
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-4 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Nama Kelas</th>
                                    <th className="px-4 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Tipe</th>
                                    <th className="px-4 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Tahun Ajaran</th>
                                    <th className="px-4 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Wali Kelas</th>
                                    <th className="px-4 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-center">Anggota</th>
                                    <th className="px-4 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredClasses.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4">
                                            <EmptyState
                                                icon={FileX}
                                                title={
                                                    searchTerm
                                                        ? 'Tidak ada kelas ditemukan'
                                                        : selectedYear
                                                            ? 'Belum ada kelas untuk tahun ajaran ini'
                                                            : 'Pilih tahun ajaran untuk melihat data kelas'
                                                }
                                                description={
                                                    searchTerm
                                                        ? `Tidak dapat menemukan kelas dengan kata kunci "${searchTerm}".`
                                                        : selectedYear
                                                            ? 'Belum ada data kelas yang ditambahkan. Silakan buat kelas baru.'
                                                            : 'Gunakan dropdown di atas untuk memilih tahun ajaran.'
                                                }
                                            />
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClasses.map((item: ClassRoom) => (
                                        <tr
                                            key={item.id}
                                            className={cn(
                                                'group transition-colors border-b border-slate-100',
                                                selectedItems.includes(item.id)
                                                    ? 'bg-blue-50/50'
                                                    : 'hover:bg-slate-50/50'
                                            )}
                                        >
                                            <td className="px-4 py-3 align-middle text-center">
                                                <Checkbox
                                                    checked={selectedItems.includes(item.id)}
                                                    onCheckedChange={() => toggleSelectItem(item.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 align-middle">
                                                <span className="text-sm font-medium text-slate-900">{item.name}</span>
                                            </td>
                                            <td className="px-4 py-3 align-middle">
                                                <Badge
                                                    variant="outline"
                                                    className={cn('text-xs font-medium', CLASS_TYPE_STYLE[item.type ?? 'reguler'])}
                                                >
                                                    {CLASS_TYPE_LABEL[item.type ?? 'reguler']}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 align-middle">
                                                {item.academic_year_name ? (
                                                    <span className="text-sm text-slate-700">
                                                        TA. {item.academic_year_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 align-middle">
                                                {item.homeroom_teacher_name ? (
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 text-xs font-bold">
                                                            {item.homeroom_teacher_name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                                                                {item.homeroom_teacher_name}
                                                            </span>
                                                            {(item.type ?? 'reguler') === 'reguler' && (
                                                                <button
                                                                    onClick={() => handleOpenHomeroomModal(item)}
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-600"
                                                                    title="Ubah wali kelas"
                                                                >
                                                                    <UserCheck className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (item.type ?? 'reguler') === 'peminatan_group' ? (
                                                    <span className="text-xs text-slate-400 italic">Tidak berlaku</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleOpenHomeroomModal(item)}
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-0.5 hover:bg-red-100 transition-colors whitespace-nowrap"
                                                    >
                                                        <UserCheck className="h-3 w-3 shrink-0" />
                                                        Belum Ditentukan
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 align-middle text-center">
                                                {(item.type ?? 'reguler') === 'peminatan_group' ? (
                                                    <button
                                                        onClick={() => router.push(`/admin/class/${item.id}`)}
                                                        className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-0.5 hover:bg-amber-100 transition-colors whitespace-nowrap"
                                                    >
                                                        <BookOpen className="h-3 w-3 shrink-0" />
                                                        Lihat Mapel
                                                    </button>
                                                ) : (
                                                    <Badge className="bg-blue-800 text-white text-xs font-medium">
                                                        {item.total_students} Siswa
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 align-middle text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                                        onClick={() => router.push(`/admin/class/${item.id}`)}
                                                        title="Detail"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                                                        onClick={() => router.push(`/admin/class/${item.id}/edit`)}
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                                                        onClick={() => setDeleteId(item.id)}
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
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
                            <span className="text-sm font-medium text-slate-300">Kelas dipilih</span>
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
                                <X className="h-4 w-4 mr-2" />
                                Batal
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirmation Dialog ── */}
            <AlertDialog
                open={deleteId !== null || isBulkDelete}
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
                            {isBulkDelete ? `Hapus ${selectedItems.length} Kelas?` : 'Hapus Data Kelas?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Seluruh data terkait{' '}
                            {isBulkDelete ? 'kelas-kelas terpilih' : 'kelas ini'} akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* ── Assign Homeroom Modal ── */}
            <AssignHomeroomModal
                open={homeroomModalOpen}
                onOpenChange={setHomeroomModalOpen}
                classRoom={selectedClassForHomeroom}
                teachers={teachers}
                onSubmit={handleAssignHomeroom}
                isSubmitting={assignMutation.isPending}
            />
        </div>
    );
};
