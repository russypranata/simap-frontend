'use client';

import React, { useState, useCallback } from 'react';
import {
    Briefcase,
    Search,
    UserPlus,
    MoreVertical,
    Mail,
    Phone,
    UserCog,
    Trash2,
    Edit,
    FilterX,
    FileX,
    RefreshCw,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Staff, StaffStatus, StaffRole } from '../types/staff';
import { CreateStaffPayload, UpdateStaffPayload } from '../types/staff';
import { useStaffList } from '../hooks/useStaffList';
import { StaffFormDialog } from '../components/forms/StaffFormDialog';
import { PaginationControls } from '@/features/shared/components/PaginationControls';

const ROLE_LABELS: Record<StaffRole, string> = {
    mutamayizin_coordinator: 'Koord. Mutamayizin',
    headmaster: 'Kepala Sekolah',
    admin: 'Administrator',
};

// Semua badge jabatan pakai warna yang sama
const BADGE_CLASS = 'bg-blue-800 text-white text-xs';
// Badge akses sistem — sama
const ROLE_BADGE_CLASS = 'bg-blue-800 text-white text-xs';

const STATUS_COLORS: Record<StaffStatus, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-red-100 text-red-700 border-red-200',
    leave: 'bg-amber-100 text-amber-700 border-amber-200',
};

const STATUS_LABELS: Record<StaffStatus, string> = {
    active: 'Aktif',
    inactive: 'Tidak Aktif',
    leave: 'Cuti',
};

export const StaffList: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const debouncedSearch = useDebounce(searchInput, 400);

    const {
        staff,
        meta,
        isLoading,
        isFetching,
        isError,
        setFilters,
        createStaff,
        updateStaff,
        deleteStaff,
        isCreating,
        isUpdating,
        isDeleting,
    } = useStaffList();

    // Sync filters
    React.useEffect(() => {
        setFilters({
            search: debouncedSearch || undefined,
            status: selectedStatus !== 'all' ? (selectedStatus as StaffStatus) : undefined,
        });
    }, [debouncedSearch, selectedStatus, setFilters]);

    const handleOpenCreate = useCallback(() => {
        setEditingStaff(null);
        setIsFormOpen(true);
    }, []);

    const handleOpenEdit = useCallback((item: Staff) => {
        setEditingStaff(item);
        setIsFormOpen(true);
    }, []);

    const handleFormSubmit = async (data: CreateStaffPayload | UpdateStaffPayload) => {
        if (editingStaff) {
            await updateStaff({ id: editingStaff.id, data: data as UpdateStaffPayload });
        } else {
            await createStaff(data as CreateStaffPayload);
        }
        setIsFormOpen(false);
        setEditingStaff(null);
    };

    const handleDeleteConfirm = () => {
        if (deleteId !== null) {
            deleteStaff(deleteId);
            setDeleteId(null);
        }
    };

    const getStaffStatus = (item: Staff): StaffStatus =>
        item.staff_profile?.status ?? 'active';

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
                                Tendik & Staf
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola data tenaga kependidikan dan staf administrasi.
                    </p>
                </div>
                <Button
                    onClick={handleOpenCreate}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tambah Staf
                </Button>
            </div>

            {/* Error State */}
            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                    Gagal memuat data staf. Silakan coba lagi.
                </div>
            )}

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <UserCog className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Tendik & Staf
                                </CardTitle>
                                <CardDescription>
                                    {meta ? `Total ${meta.total} staf terdaftar` : 'Memuat data...'}
                                </CardDescription>
                            </div>
                        </div>
                        {isFetching && !isLoading && (
                            <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama atau NIP..."
                                className="pl-9 w-full"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                <SelectItem value="leave">Cuti</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto border-t border-slate-200">
                        {isLoading ? (
                            <div className="divide-y divide-slate-100">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 px-6 py-4">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse shrink-0" />
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-4 w-40 bg-slate-100 rounded animate-pulse" />
                                            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                                        </div>
                                        <div className="h-6 w-20 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-6 w-16 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-8 w-8 bg-slate-100 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                                            Nama & NIP
                                        </th>
                                        <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                                            Jabatan Kepegawaian
                                        </th>
                                        <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                                            Akses Sistem
                                        </th>
                                        <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                                            Kontak
                                        </th>
                                        <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-center">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {staff.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                                    {searchInput ? (
                                                        <FilterX className="h-8 w-8 text-slate-300 mb-2" />
                                                    ) : (
                                                        <FileX className="h-8 w-8 text-slate-300 mb-2" />
                                                    )}
                                                    <p className="text-sm text-slate-500">Data tidak ditemukan</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        staff.map((item) => {
                                            const status = getStaffStatus(item);
                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-slate-50/60 transition-colors group"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-9 w-9 border border-slate-200">
                                                                <AvatarImage src={item.avatar ?? undefined} />
                                                                <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-medium">
                                                                    {item.name.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium text-slate-900">
                                                                    {item.name}
                                                                </div>
                                                                <div className="text-xs text-slate-500 font-mono mt-0.5 bg-slate-100 w-fit px-1 rounded">
                                                                    {item.staff_profile?.employee_id ?? '-'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {/* Jabatan Kepegawaian: job_title + department */}
                                                        <div className="flex flex-col gap-1">
                                                            {item.staff_profile?.job_title && (
                                                                <Badge className={BADGE_CLASS}>
                                                                    {item.staff_profile.job_title}
                                                                </Badge>
                                                            )}
                                                            {item.staff_profile?.department && (
                                                                <span className="text-xs text-slate-500 mt-0.5">
                                                                    {item.staff_profile.department}
                                                                </span>
                                                            )}
                                                            {!item.staff_profile?.job_title && !item.staff_profile?.department && (
                                                                <span className="text-xs text-slate-400">—</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {/* Akses Sistem: role di aplikasi */}
                                                        <div className="flex flex-wrap gap-1">
                                                            {item.roles.length > 0 ? (
                                                                item.roles.map((role) => (
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
                                                        <div className="flex flex-col gap-1 text-slate-600">
                                                            <div className="flex items-center gap-1.5">
                                                                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                                                <span className="text-sm">{item.email}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                                                <span className="text-sm">{item.phone ?? '-'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                'text-xs font-medium',
                                                                STATUS_COLORS[status]
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
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={() => handleOpenEdit(item)}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4 text-amber-600" />
                                                                    Edit Data
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                                    onClick={() => setDeleteId(item.id)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Hapus
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
                        )}
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
                            itemLabel="staf"
                            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
                            onItemsPerPageChange={(perPage) =>
                                setFilters((f) => ({ ...f, page: 1, per_page: perPage }))
                            }
                        />
                    )}
                </CardContent>
            </Card>

            {/* Form Dialog */}
            <StaffFormDialog
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingStaff(null);
                }}
                initialData={editingStaff}
                onSubmit={handleFormSubmit}
                isSubmitting={isCreating || isUpdating}
            />

            {/* Delete Confirmation */}
            <AlertDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data Staf?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data staf ini akan dihapus permanen
                            dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
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
