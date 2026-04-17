'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    UserPlus,
    Search,
    Edit,
    Trash2,
    Eye,
    School,
    Users,
    FilterX,
    FileX,
    Settings,
    RefreshCw,
    Loader2,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

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
import { Checkbox } from '@/components/ui/checkbox';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Teacher, TeacherStatus, TeacherPosition, TeacherRole } from '../types/teacher';
import { useTeacherList } from '../hooks/useTeacherList';
import { TeacherListSkeleton } from '../components/teacher/TeacherListSkeleton';
import { PaginationControls } from '@/features/shared/components/PaginationControls';

const POSITION_LABELS: Record<TeacherPosition, string> = {
    subject_teacher:       'Guru Mapel',
    homeroom_teacher:      'Wali Kelas',
    picket_teacher:        'Guru Piket',
    headmaster:            'Kepala Sekolah',
    admin_staff:           'Tenaga Administrasi',
    vice_curriculum:       'Waka Kurikulum',
    vice_student_affairs:  'Waka Kesiswaan',
    coord_piket_ikhwan:    'Koord. Piket Ikhwan',
    coord_piket_akhwat:    'Koord. Piket Akhwat',
    admin_dapodik:         'TU & OPS Dapodik',
};

// Semua badge jabatan pakai warna yang sama (biru-800)
const BADGE_CLASS = 'bg-blue-800 text-white text-xs';
// Badge akses sistem — sama tapi lebih ringan
const ROLE_BADGE_CLASS = 'bg-blue-800 text-white text-xs';

// Label untuk role sistem (akses aplikasi)
const ROLE_LABELS: Record<TeacherRole, string> = {
    subject_teacher:  'Guru Mapel',
    picket_teacher:   'Guru Piket',
    homeroom_teacher: 'Wali Kelas',
};

const STATUS_STYLES: Record<TeacherStatus, string> = {
    active: 'bg-green-50 text-green-700 border-green-200',
    inactive: 'bg-red-50 text-red-700 border-red-200',
    leave: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const STATUS_LABELS: Record<TeacherStatus, string> = {
    active: 'Aktif',
    inactive: 'Nonaktif',
    leave: 'Cuti',
};

export const TeacherList: React.FC = () => {
    const router = useRouter();

    const [searchInput, setSearchInput] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

    const debouncedSearch = useDebounce(searchInput, 400);

    const {
        teachers,
        meta,
        isLoading,
        isFetching,
        isError,
        setFilters,
        deleteTeacher,
        deleteBulk,
        isDeleting,
    } = useTeacherList();

    // Sync filters ke hook saat debounced value berubah
    React.useEffect(() => {
        setFilters({
            search: debouncedSearch || undefined,
            role: selectedRole !== 'all' ? (selectedRole as TeacherRole) : undefined,
            status: selectedStatus !== 'all' ? (selectedStatus as TeacherStatus) : undefined,
        });
    }, [debouncedSearch, selectedRole, selectedStatus, setFilters]);

    const toggleSelectAll = useCallback(() => {
        if (selectedItems.length === teachers.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(teachers.map((t) => t.id));
        }
    }, [selectedItems.length, teachers]);

    const toggleSelectItem = useCallback((id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }, []);

    const handleDeleteConfirm = async () => {
        if (isBulkDeleteOpen) {
            await deleteBulk(selectedItems);
            setSelectedItems([]);
            setIsBulkDeleteOpen(false);
        } else if (deleteId !== null) {
            deleteTeacher(deleteId);
            setDeleteId(null);
        }
    };

    const getTeacherStatus = (teacher: Teacher): TeacherStatus =>
        teacher.teacher_profile?.status ?? 'active';

    const getPositions = (teacher: Teacher): TeacherPosition[] =>
        teacher.teacher_profile?.positions ?? [];

    if (isLoading) return <TeacherListSkeleton />;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Data{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Pendidik dan Tenaga Kependidikan
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <School className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data pendidik dan tenaga kependidikan (PTK) sekolah.
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/users/teachers/new')}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tambah PTK
                </Button>
            </div>

            {/* Error State */}
            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                    Gagal memuat data guru. Silakan coba lagi.
                </div>
            )}

            {/* Main Content */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar PTK
                                </CardTitle>
                                <CardDescription>
                                    {meta ? `Total ${meta.total} PTK terdaftar` : 'Memuat data...'}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && (
                                <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />
                            )}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                                {meta?.total ?? teachers.length} PTK
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama, NIP, atau NUPTK..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-9 w-full"
                            />
                        </div>

                        {/* Role Filter */}
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Peran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Peran</SelectItem>
                                <SelectItem value="subject_teacher">Guru Mapel</SelectItem>
                                <SelectItem value="picket_teacher">Guru Piket</SelectItem>
                                <SelectItem value="homeroom_teacher">Wali Kelas</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Nonaktif</SelectItem>
                                <SelectItem value="leave">Cuti</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-0 py-4 font-medium text-sm w-[40px]">
                                        <Checkbox
                                            checked={
                                                teachers.length > 0 &&
                                                selectedItems.length === teachers.length
                                            }
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="pl-3 pr-6 py-4 font-medium text-sm">Nama & NIP</th>
                                    <th className="px-6 py-4 font-medium text-sm">Jabatan Kepegawaian</th>
                                    <th className="px-6 py-4 font-medium text-sm">Akses Sistem</th>
                                    <th className="px-6 py-4 font-medium text-sm">Kontak</th>
                                    <th className="px-6 py-4 font-medium text-sm text-center">Status</th>
                                    <th className="px-6 py-4 font-medium text-sm text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                                    {searchInput || selectedRole !== 'all' ? (
                                                        <FilterX className="h-8 w-8 text-slate-300" />
                                                    ) : (
                                                        <FileX className="h-8 w-8 text-slate-300" />
                                                    )}
                                                </div>
                                                <p className="text-slate-500 font-medium">
                                                    Data tidak ditemukan
                                                </p>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    Coba sesuaikan filter pencarian Anda
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    teachers.map((teacher) => {
                                        const status = getTeacherStatus(teacher);
                                        const positions = getPositions(teacher);

                                        return (
                                            <tr
                                                key={teacher.id}
                                                className={cn(
                                                    'group transition-colors border-b border-slate-50',
                                                    selectedItems.includes(teacher.id)
                                                        ? 'bg-blue-50/50'
                                                        : 'hover:bg-slate-50/60'
                                                )}
                                            >
                                                <td className="pl-4 pr-0 py-4">
                                                    <Checkbox
                                                        checked={selectedItems.includes(teacher.id)}
                                                        onCheckedChange={() =>
                                                            toggleSelectItem(teacher.id)
                                                        }
                                                    />
                                                </td>
                                                <td className="pl-3 pr-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border border-blue-200">
                                                            <AvatarImage src={teacher.avatar ?? undefined} />
                                                            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-medium">
                                                                {teacher.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-slate-900">
                                                                {teacher.name}
                                                            </p>
                                                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                                                                NIP:{' '}
                                                                {teacher.teacher_profile?.employee_id ?? '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {/* Jabatan Kepegawaian: semua dari positions array */}
                                                    <div className="flex flex-wrap gap-1">
                                                        {positions.length > 0 ? (
                                                            positions.map((pos) => (
                                                                <Badge key={pos} className={BADGE_CLASS}>
                                                                    {POSITION_LABELS[pos] ?? pos}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-slate-400">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {/* Akses Sistem: role di aplikasi */}
                                                    <div className="flex flex-wrap gap-1">
                                                        {teacher.roles.length > 0 ? (
                                                            teacher.roles.map((role) => (
                                                                <Badge
                                                                    key={role}
                                                                    className={ROLE_BADGE_CLASS}
                                                                >
                                                                    {ROLE_LABELS[role] ?? role}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-slate-400">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm text-slate-600">
                                                            {teacher.email}
                                                        </span>
                                                        <span className="text-sm text-slate-500">
                                                            {teacher.phone ?? '-'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            'text-xs font-medium',
                                                            STATUS_STYLES[status]
                                                        )}
                                                    >
                                                        {STATUS_LABELS[status]}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                                                            >
                                                                <Settings className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.push(
                                                                        `/admin/users/teachers/${teacher.id}`
                                                                    )
                                                                }
                                                                className="cursor-pointer"
                                                            >
                                                                <Eye className="mr-2 h-4 w-4 text-blue-600" />
                                                                Lihat Detail
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.push(
                                                                        `/admin/users/teachers/${teacher.id}/edit`
                                                                    )
                                                                }
                                                                className="cursor-pointer"
                                                            >
                                                                <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                                                Edit Data
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => setDeleteId(teacher.id)}
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus Data
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

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <PaginationControls
                            currentPage={meta.current_page}
                            totalPages={meta.last_page}
                            totalItems={meta.total}
                            startIndex={(meta.current_page - 1) * meta.per_page + 1}
                            endIndex={Math.min(meta.current_page * meta.per_page, meta.total)}
                            itemsPerPage={meta.per_page}
                            itemLabel="guru"
                            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
                            onItemsPerPageChange={(perPage) =>
                                setFilters((f) => ({ ...f, page: 1, per_page: perPage }))
                            }
                        />
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
                            <span className="text-sm font-medium text-slate-300">Data dipilih</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-slate-800 h-9"
                                onClick={() => setIsBulkDeleteOpen(true)}
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

            {/* Delete Confirmation */}
            <AlertDialog
                open={deleteId !== null || isBulkDeleteOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteId(null);
                        setIsBulkDeleteOpen(false);
                    }
                }}
            >
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg">
                                    {isBulkDeleteOpen ? 'Hapus Data Massal?' : 'Hapus Data PTK?'}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">
                                    {isBulkDeleteOpen
                                        ? `${selectedItems.length} data PTK yang dipilih`
                                        : 'Data PTK ini'}{' '}
                                    akan dihapus permanen dan tidak dapat dipulihkan.
                                </AlertDialogDescription>
                            </div>
                        </div>
                        <div className="ml-16 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-xs text-red-700 leading-relaxed">
                                ⚠️ Semua data terkait termasuk riwayat kepegawaian dan penugasan mengajar juga akan ikut terhapus.
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
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                'Ya, Hapus Sekarang'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
