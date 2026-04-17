'use client';

import React, { useState, useCallback } from 'react';
import {
    Shield,
    Search,
    Settings,
    UserPlus,
    User,
    Trash2,
    Edit,
    KeyRound,
    RefreshCw,
    FilterX,
    FileX,
    Loader2,
    Eye,
    EyeOff,
    Copy,
    Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { useRouter } from 'next/navigation';

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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

import { AdminUser, UserRole } from '../types/user';
import { useUserManagement } from '../hooks/useUserManagement';
import { PaginationControls } from '@/features/shared/components/PaginationControls';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<UserRole, string> = {
    admin:                    'Administrator',
    subject_teacher:          'Guru Mapel',
    picket_teacher:           'Guru Piket',
    homeroom_teacher:         'Wali Kelas',
    student:                  'Siswa',
    parent:                   'Wali Murid',
    extracurricular_tutor:    'Tutor Ekskul',
    mutamayizin_coordinator:  'PJ Mutamayizin',
    headmaster:               'Kepala Sekolah',
};

const ROLE_BADGE: Record<UserRole, string> = {
    admin:                    'bg-red-700 text-white',
    subject_teacher:          'bg-blue-700 text-white',
    picket_teacher:           'bg-sky-600 text-white',
    homeroom_teacher:         'bg-indigo-600 text-white',
    student:                  'bg-emerald-600 text-white',
    parent:                   'bg-teal-600 text-white',
    extracurricular_tutor:    'bg-purple-600 text-white',
    mutamayizin_coordinator:  'bg-amber-600 text-white',
    headmaster:               'bg-slate-800 text-white',
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const UserManagementSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-9 w-72" />
                <Skeleton className="h-4 w-52" />
            </div>
            <Skeleton className="h-10 w-40" />
        </div>
        <Card>
            <CardHeader className="pb-4 space-y-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="flex gap-3 pt-2 border-t">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-44" />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="border-t">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-56" />
                            </div>
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-8 w-8 rounded" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
);

// ─── Reset Password Result Dialog ─────────────────────────────────────────────

interface ResetPasswordResultProps {
    open: boolean;
    onClose: () => void;
    userName: string;
    newPassword: string;
}

const ResetPasswordResult: React.FC<ResetPasswordResultProps> = ({
    open, onClose, userName, newPassword,
}) => {
    const [show, setShow] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(newPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <KeyRound className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                            <DialogTitle>Password Direset</DialogTitle>
                            <DialogDescription className="mt-0.5">
                                Password baru untuk <strong>{userName}</strong>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                    <code className="text-sm font-mono text-slate-800 flex-1">
                        {show ? newPassword : '•'.repeat(newPassword.length)}
                    </code>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setShow(!show)}
                        >
                            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={handleCopy}
                        >
                            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">
                    Catat password ini dan berikan kepada pengguna. Password tidak dapat dilihat lagi setelah dialog ini ditutup.
                </p>
                <Button onClick={onClose} className="w-full bg-blue-800 hover:bg-blue-900 text-white">
                    Tutup
                </Button>
            </DialogContent>
        </Dialog>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const UserManagement: React.FC = () => {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [resetResult, setResetResult] = useState<{ userName: string; newPassword: string } | null>(null);

    const debouncedSearch = useDebounce(searchInput, 400);

    const {
        users,
        meta,
        isLoading,
        isFetching,
        isError,
        isDeleting,
        isResettingPassword,
        setFilters,
        deleteUser,
        resetPassword,
    } = useUserManagement();

    // Sync filters
    React.useEffect(() => {
        setFilters({
            search: debouncedSearch || undefined,
            role: selectedRole !== 'all' ? (selectedRole as UserRole) : undefined,
            page: 1,
        });
    }, [debouncedSearch, selectedRole, setFilters]);

    const handleDeleteConfirm = () => {
        if (deleteId !== null) {
            deleteUser(deleteId);
            setDeleteId(null);
        }
    };

    const handleResetPassword = useCallback(async (user: AdminUser) => {
        try {
            const res = await resetPassword(user.id);
            setResetResult({ userName: user.name, newPassword: res.new_password });
        } catch {
            // error handled in hook
        }
    }, [resetPassword]);

    if (isLoading) return <UserManagementSkeleton />;

    return (
        <div className="space-y-6">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Hak{' '}
                            </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Akses
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            <Shield className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Kelola akun, role, dan hak akses pengguna sistem.
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/users/management/new')}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Tambah Pengguna
                </Button>
            </div>

            {/* ── Error State ── */}
            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
                    Gagal memuat data pengguna. Silakan coba lagi.
                </div>
            )}

            {/* ── Main Card ── */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    Daftar Pengguna Sistem
                                </CardTitle>
                                <CardDescription>
                                    Semua akun yang terdaftar di sistem
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isFetching && !isLoading && (
                                <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />
                            )}
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                                {meta?.total ?? users.length} Pengguna
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama, username, atau email..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-9 w-full"
                            />
                        </div>
                        {/* Role Filter */}
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Semua Akses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Akses Sistem</SelectItem>
                                <SelectItem value="admin">Administrator</SelectItem>
                                <SelectItem value="subject_teacher">Guru Mapel</SelectItem>
                                <SelectItem value="picket_teacher">Guru Piket</SelectItem>
                                <SelectItem value="homeroom_teacher">Wali Kelas</SelectItem>
                                <SelectItem value="student">Siswa</SelectItem>
                                <SelectItem value="parent">Wali Murid</SelectItem>
                                <SelectItem value="extracurricular_tutor">Tutor Ekskul</SelectItem>
                                <SelectItem value="mutamayizin_coordinator">PJ Mutamayizin</SelectItem>
                                <SelectItem value="headmaster">Kepala Sekolah</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="pl-4 pr-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Nama & Akun</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Akses Sistem</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Kontak</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Terdaftar</th>
                                    <th className="px-6 py-4 font-semibold text-xs text-slate-600 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                                {searchInput || selectedRole !== 'all' ? (
                                                    <FilterX className="h-8 w-8 text-slate-300 mb-2" />
                                                ) : (
                                                    <FileX className="h-8 w-8 text-slate-300 mb-2" />
                                                )}
                                                <p className="text-sm text-slate-500">Data tidak ditemukan</p>
                                                <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter pencarian Anda</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => {
                                        const role = user.roles[0] as UserRole | undefined;
                                        const initials = user.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .substring(0, 2);

                                        return (
                                            <tr
                                                key={user.id}
                                                className="group transition-colors border-b border-slate-50 hover:bg-slate-50/60"
                                            >
                                                {/* Nama & Akun */}
                                                <td className="pl-4 pr-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border border-blue-200 shrink-0">
                                                            <AvatarImage src={user.avatar ?? undefined} />
                                                            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-semibold">
                                                                {initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-slate-900 truncate">{user.name}</p>
                                                            <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">@{user.username}</p>
                                                            <p className="text-xs text-slate-400 mt-0.5 truncate">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Akses Sistem */}
                                                <td className="px-6 py-4">
                                                    {role ? (
                                                        <Badge className={cn('text-xs font-medium', ROLE_BADGE[role])}>
                                                            {ROLE_LABELS[role]}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">—</span>
                                                    )}
                                                </td>

                                                {/* Kontak */}
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-600">{user.phone ?? <span className="text-slate-400">—</span>}</p>
                                                </td>

                                                {/* Terdaftar */}
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-600">
                                                        {user.created_at
                                                            ? new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                                                            : '—'}
                                                    </p>
                                                </td>

                                                {/* Aksi */}
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
                                                        <DropdownMenuContent align="end" className="w-44">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => router.push(`/admin/users/management/${user.id}/edit`)}
                                                                className="cursor-pointer"
                                                            >
                                                                <Edit className="mr-2 h-4 w-4 text-blue-600" />
                                                                Edit Data
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleResetPassword(user)}
                                                                className="cursor-pointer"
                                                                disabled={isResettingPassword}
                                                            >
                                                                <KeyRound className="mr-2 h-4 w-4 text-amber-600" />
                                                                Reset Password
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => setDeleteId(user.id)}
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Hapus Akun
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
                            itemLabel="pengguna"
                            onPageChange={(page) => setFilters({ page })}
                            onItemsPerPageChange={(perPage) =>
                                setFilters({ page: 1, per_page: perPage })
                            }
                        />
                    )}
                </CardContent>
            </Card>

            {/* ── Delete Confirmation ── */}
            <AlertDialog
                open={deleteId !== null}
                onOpenChange={(open) => { if (!open) setDeleteId(null); }}
            >
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-4 mb-1">
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <AlertDialogTitle className="text-lg">Hapus Akun Pengguna?</AlertDialogTitle>
                                <AlertDialogDescription className="mt-1">
                                    Akun ini akan dihapus permanen dan tidak dapat dipulihkan.
                                </AlertDialogDescription>
                            </div>
                        </div>
                        <div className="ml-16 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-xs text-red-700 leading-relaxed">
                                ⚠️ Semua data terkait akun ini termasuk profil dan riwayat aktivitas juga akan ikut terhapus.
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

            {/* ── Reset Password Result ── */}
            {resetResult && (
                <ResetPasswordResult
                    open={!!resetResult}
                    onClose={() => setResetResult(null)}
                    userName={resetResult.userName}
                    newPassword={resetResult.newPassword}
                />
            )}
        </div>
    );
};
