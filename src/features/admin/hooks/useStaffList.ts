import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { staffService } from '../services/staffService';
import { StaffFilters, CreateStaffPayload, UpdateStaffPayload } from '../types/staff';

export const STAFF_KEYS = {
    all: ['admin-staff'] as const,
    list: (filters: StaffFilters) => ['admin-staff', 'list', filters] as const,
    detail: (id: number) => ['admin-staff', 'detail', id] as const,
};

export const useStaffList = (initialFilters?: StaffFilters) => {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<StaffFilters>(initialFilters ?? {});

    const query = useQuery({
        queryKey: STAFF_KEYS.list(filters),
        queryFn: () => staffService.getStaff(filters),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    const invalidate = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: STAFF_KEYS.all });
    }, [queryClient]);

    // Create
    const createMutation = useMutation({
        mutationFn: (data: CreateStaffPayload) => staffService.createStaff(data),
        onSuccess: () => {
            toast.success('Data staf berhasil ditambahkan');
            invalidate();
        },
        onError: (err: Error & { errors?: Record<string, string[]> }) => {
            const firstError = err.errors
                ? Object.values(err.errors)[0]?.[0]
                : err.message;
            toast.error(firstError ?? 'Gagal menambahkan data staf');
        },
    });

    // Update
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateStaffPayload }) =>
            staffService.updateStaff(id, data),
        onSuccess: () => {
            toast.success('Data staf berhasil diperbarui');
            invalidate();
        },
        onError: (err: Error & { errors?: Record<string, string[]> }) => {
            const firstError = err.errors
                ? Object.values(err.errors)[0]?.[0]
                : err.message;
            toast.error(firstError ?? 'Gagal memperbarui data staf');
        },
    });

    // Delete single
    const deleteMutation = useMutation({
        mutationFn: (id: number) => staffService.deleteStaff(id),
        onSuccess: () => {
            toast.success('Data staf berhasil dihapus');
            invalidate();
        },
        onError: () => toast.error('Gagal menghapus data staf'),
    });

    // Delete bulk
    const deleteBulk = async (ids: number[]) => {
        try {
            await Promise.all(ids.map((id) => staffService.deleteStaff(id)));
            toast.success(`${ids.length} data staf berhasil dihapus`);
            invalidate();
        } catch {
            toast.error('Gagal menghapus sebagian data staf');
            invalidate();
        }
    };

    return {
        // Data
        staff: query.data?.data ?? [],
        meta: query.data?.meta,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,

        // Filters
        filters,
        setFilters,

        // Mutations
        createStaff: createMutation.mutateAsync,
        updateStaff: updateMutation.mutateAsync,
        deleteStaff: deleteMutation.mutate,
        deleteBulk,

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
