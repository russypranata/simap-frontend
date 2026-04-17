import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mutationService } from '../services/mutationService';
import { CreateMutationRequest, MutationFilters } from '../types/mutation';

export const MUTATION_KEYS = {
    all:  ['admin-mutations'] as const,
    list: (f: MutationFilters) => ['admin-mutations', 'list', f] as const,
};

export function useMutationList() {
    const queryClient = useQueryClient();
    const [filters, setFiltersState] = useState<MutationFilters>({ page: 1, per_page: 15 });

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: MUTATION_KEYS.list(filters),
        queryFn:  () => mutationService.getMutations(filters),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    });

    const setFilters = useCallback((f: Partial<MutationFilters>) =>
        setFiltersState((prev) => ({ ...prev, ...f })), []);

    const inv = () => queryClient.invalidateQueries({ queryKey: MUTATION_KEYS.all });

    const createMutation = useMutation({
        mutationFn: (d: CreateMutationRequest) => mutationService.createMutation(d),
        onSuccess: () => { inv(); toast.success('Data mutasi berhasil ditambahkan'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menambahkan mutasi'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => mutationService.deleteMutation(id),
        onSuccess: () => { inv(); toast.success('Data mutasi berhasil dihapus'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menghapus mutasi'),
    });

    const approveMutation = useMutation({
        mutationFn: (id: number) => mutationService.approveMutation(id),
        onSuccess: () => { inv(); toast.success('Mutasi berhasil disetujui'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menyetujui mutasi'),
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, notes }: { id: number; notes?: string }) => mutationService.rejectMutation(id, notes),
        onSuccess: () => { inv(); toast.success('Mutasi ditolak'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menolak mutasi'),
    });

    return {
        mutations: data?.data ?? [], meta: data?.meta,
        isLoading, isFetching, isError,
        isCreating:  createMutation.isPending,
        isDeleting:  deleteMutation.isPending,
        isApproving: approveMutation.isPending,
        isRejecting: rejectMutation.isPending,
        filters, setFilters,
        createMutation:  createMutation.mutateAsync,
        deleteMutation:  deleteMutation.mutate,
        approveMutation: approveMutation.mutate,
        rejectMutation:  rejectMutation.mutate,
    };
}
