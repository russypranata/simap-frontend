import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '../services/userService';
import { AdminUser, CreateUserRequest, UpdateUserRequest, UserFilters } from '../types/user';

export const USER_KEYS = {
    all: ['admin-users'] as const,
    list: (filters: UserFilters) => ['admin-users', 'list', filters] as const,
    detail: (id: number) => ['admin-users', 'detail', id] as const,
};

export function useUserManagement() {
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        per_page: 15,
    });

    // ── List ──────────────────────────────────────────────────────────────────
    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useQuery({
        queryKey: USER_KEYS.list(filters),
        queryFn: () => userService.getUsers(filters),
        // Ikuti global default (5 menit) — data user tidak berubah terlalu sering
        staleTime: 5 * 60 * 1000,
        // gcTime ikuti global default (10 menit)
        placeholderData: (prev) => prev,
    });

    const users: AdminUser[] = data?.data ?? [];
    const meta = data?.meta;

    // ── Create ────────────────────────────────────────────────────────────────
    const createMutation = useMutation({
        mutationFn: (payload: CreateUserRequest) => userService.createUser(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
            toast.success('Pengguna berhasil ditambahkan');
        },
        onError: (err: Error) => {
            const msg = err?.message ?? 'Gagal menambahkan pengguna';
            toast.error(msg);
        },
    });

    // ── Update ────────────────────────────────────────────────────────────────
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
            userService.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
            toast.success('Data pengguna berhasil diperbarui');
        },
        onError: (err: Error) => {
            const msg = err?.message ?? 'Gagal memperbarui pengguna';
            toast.error(msg);
        },
    });

    // ── Delete ────────────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: (id: number) => userService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
            toast.success('Pengguna berhasil dihapus');
        },
        onError: (err: Error) => {
            const msg = err?.message ?? 'Gagal menghapus pengguna';
            toast.error(msg);
        },
    });

    // ── Reset Password ────────────────────────────────────────────────────────
    const resetPasswordMutation = useMutation({
        mutationFn: (id: number) => userService.resetPassword(id),
        onError: (err: Error) => {
            const msg = err?.message ?? 'Gagal mereset password';
            toast.error(msg);
        },
    });

    // ── Helpers ───────────────────────────────────────────────────────────────
    const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);

    return {
        // Data
        users,
        meta,
        // States
        isLoading,
        isFetching,
        isError,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isResettingPassword: resetPasswordMutation.isPending,
        // Filters
        filters,
        setFilters: updateFilters,
        // Actions
        createUser: createMutation.mutateAsync,
        updateUser: updateMutation.mutateAsync,
        deleteUser: deleteMutation.mutate,
        resetPassword: resetPasswordMutation.mutateAsync,
    };
}
