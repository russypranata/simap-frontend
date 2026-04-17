import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parentService } from '../services/parentService';
import { CreateParentRequest, UpdateParentRequest, ParentFilters } from '../types/parent';

export const PARENT_KEYS = {
    all:    ['admin-parents'] as const,
    list:   (f: ParentFilters) => ['admin-parents', 'list', f] as const,
    detail: (id: number) => ['admin-parents', 'detail', id] as const,
};

export function useParentList() {
    const queryClient = useQueryClient();
    const [filters, setFiltersState] = useState<ParentFilters>({ page: 1, per_page: 15 });

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: PARENT_KEYS.list(filters),
        queryFn:  () => parentService.getParents(filters),
        staleTime: 0,
        placeholderData: (prev) => prev,
    });

    const setFilters = useCallback((f: Partial<ParentFilters>) =>
        setFiltersState((prev) => ({ ...prev, ...f })), []);

    const createMutation = useMutation({
        mutationFn: (d: CreateParentRequest) => parentService.createParent(d),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: PARENT_KEYS.all }); toast.success('Wali murid berhasil ditambahkan'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menambahkan wali murid'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateParentRequest }) => parentService.updateParent(id, data),
        onSuccess: (_, { id }) => { queryClient.invalidateQueries({ queryKey: PARENT_KEYS.all }); queryClient.invalidateQueries({ queryKey: PARENT_KEYS.detail(id) }); toast.success('Data wali murid berhasil diperbarui'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal memperbarui wali murid'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => parentService.deleteParent(id),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: PARENT_KEYS.all }); toast.success('Wali murid berhasil dihapus'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menghapus wali murid'),
    });

    return {
        parents: data?.data ?? [], meta: data?.meta,
        isLoading, isFetching, isError,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        filters, setFilters,
        createParent: createMutation.mutateAsync,
        updateParent: updateMutation.mutateAsync,
        deleteParent: deleteMutation.mutate,
    };
}

export function useParentDetail(id: number | null) {
    return useQuery({
        queryKey: PARENT_KEYS.detail(id!),
        queryFn:  () => parentService.getParentById(id!),
        enabled:  !!id,
        staleTime: 0,
    });
}
