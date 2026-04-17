import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ppdbService } from '../services/ppdbService';
import { CreatePpdbRequest, PpdbFilters, PPDBStatus } from '../types/ppdb';

export const PPDB_KEYS = {
    all:  ['admin-ppdb'] as const,
    list: (f: PpdbFilters) => ['admin-ppdb', 'list', f] as const,
};

export function usePpdbList() {
    const queryClient = useQueryClient();
    const [filters, setFiltersState] = useState<PpdbFilters>({ page: 1, per_page: 15 });

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: PPDB_KEYS.list(filters),
        queryFn:  () => ppdbService.getRegistrations(filters),
        staleTime: 0,
        placeholderData: (prev) => prev,
    });

    const setFilters = useCallback((f: Partial<PpdbFilters>) =>
        setFiltersState((prev) => ({ ...prev, ...f })), []);

    const inv = () => queryClient.invalidateQueries({ queryKey: PPDB_KEYS.all });

    const createMutation = useMutation({
        mutationFn: (d: CreatePpdbRequest) => ppdbService.createRegistration(d),
        onSuccess: () => { inv(); toast.success('Pendaftaran PPDB berhasil ditambahkan'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menambahkan pendaftaran'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => ppdbService.deleteRegistration(id),
        onSuccess: () => { inv(); toast.success('Data PPDB berhasil dihapus'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menghapus data PPDB'),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status, notes }: { id: number; status: PPDBStatus; notes?: string }) =>
            ppdbService.updateStatus(id, status, notes),
        onSuccess: () => { inv(); toast.success('Status PPDB berhasil diperbarui'); },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal memperbarui status'),
    });

    return {
        registrations: data?.data ?? [], meta: data?.meta,
        isLoading, isFetching, isError,
        isCreating:       createMutation.isPending,
        isDeleting:       deleteMutation.isPending,
        isUpdatingStatus: updateStatusMutation.isPending,
        filters, setFilters,
        createRegistration: createMutation.mutateAsync,
        deleteRegistration: deleteMutation.mutate,
        updateStatus:       updateStatusMutation.mutate,
    };
}
