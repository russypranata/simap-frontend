import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { curriculumService } from '../services/curriculumService';
import { CurriculumFormValues } from '../schemas/curriculumSchema';

const KEYS = {
    all:  ['admin-curricula'] as const,
    list: (f: object) => ['admin-curricula', 'list', f] as const,
};

export function useCurriculumList() {
    const queryClient = useQueryClient();
    const [filters, setFiltersState] = useState<{ search?: string; status?: string; page?: number }>({});

    const setFilters = useCallback((f: typeof filters) =>
        setFiltersState((prev) => ({ ...prev, ...f })), []);

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey:  KEYS.list(filters),
        queryFn:   () => curriculumService.getAll(filters),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    });

    const createMutation = useMutation({
        mutationFn: (d: CurriculumFormValues) => curriculumService.create(d),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: KEYS.all }); toast.success('Kurikulum berhasil ditambahkan'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menambahkan kurikulum'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: CurriculumFormValues }) => curriculumService.update(id, data),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: KEYS.all }); toast.success('Kurikulum berhasil diperbarui'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal memperbarui kurikulum'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => curriculumService.delete(id),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: KEYS.all }); toast.success('Kurikulum berhasil dihapus'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menghapus kurikulum'),
    });

    return {
        curricula:   data?.data ?? [],
        meta:        data?.meta,
        isLoading,
        isFetching,
        isError,
        filters,
        setFilters,
        createCurriculum:  createMutation.mutateAsync,
        updateCurriculum:  updateMutation.mutateAsync,
        deleteCurriculum:  deleteMutation.mutate,
        isCreating:  createMutation.isPending,
        isUpdating:  updateMutation.isPending,
        isDeleting:  deleteMutation.isPending,
    };
}
