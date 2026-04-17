import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { extracurricularService } from '../services/extracurricularService';
import {
    CreateExtracurricularRequest,
    UpdateExtracurricularRequest,
    AddMemberRequest,
    ExtracurricularFilters,
    TransferTutorRequest,
} from '../types/extracurricular';

export const EKSKUL_KEYS = {
    all:     ['admin-extracurriculars'] as const,
    list:    (filters: ExtracurricularFilters) => ['admin-extracurriculars', 'list', filters] as const,
    detail:  (id: number) => ['admin-extracurriculars', 'detail', id] as const,
    tutors:  ['admin-extracurriculars', 'tutors'] as const,
};

// ─── List Hook ────────────────────────────────────────────────────────────────

export function useExtracurricularList() {
    const queryClient = useQueryClient();

    const [filters, setFiltersState] = useState<ExtracurricularFilters>({
        page: 1,
        per_page: 15,
    });

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: EKSKUL_KEYS.list(filters),
        queryFn:  () => extracurricularService.getAll(filters),
        staleTime: 0,
        placeholderData: (prev) => prev,
    });

    const setFilters = useCallback((newFilters: Partial<ExtracurricularFilters>) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }));
    }, []);

    // Create
    const createMutation = useMutation({
        mutationFn: (payload: CreateExtracurricularRequest) =>
            extracurricularService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EKSKUL_KEYS.all });
            toast.success('Ekstrakurikuler berhasil ditambahkan');
        },
        onError: (err: Error) => toast.error(err?.message ?? 'Gagal menambahkan ekskul'),
    });

    // Update
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateExtracurricularRequest }) =>
            extracurricularService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EKSKUL_KEYS.all });
            toast.success('Ekstrakurikuler berhasil diperbarui');
        },
        onError: (err: Error) => toast.error(err?.message ?? 'Gagal memperbarui ekskul'),
    });

    // Delete
    const deleteMutation = useMutation({
        mutationFn: (id: number) => extracurricularService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EKSKUL_KEYS.all });
            toast.success('Ekstrakurikuler berhasil dihapus');
        },
        onError: (err: Error) => toast.error(err?.message ?? 'Gagal menghapus ekskul'),
    });

    // Transfer Tutor
    const transferTutorMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: TransferTutorRequest }) =>
            extracurricularService.transferTutor(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EKSKUL_KEYS.all });
            queryClient.invalidateQueries({ queryKey: EKSKUL_KEYS.tutors });
            toast.success('Tutor berhasil diganti');
        },
        onError: (err: Error) => toast.error(err?.message ?? 'Gagal mengganti tutor'),
    });

    return {
        extracurriculars: data?.data ?? [],
        meta:             data?.meta,
        isLoading,
        isFetching,
        isError,
        isCreating:  createMutation.isPending,
        isUpdating:  updateMutation.isPending,
        isDeleting:  deleteMutation.isPending,
        isTransferring: transferTutorMutation.isPending,
        filters,
        setFilters,
        createExtracurricular: createMutation.mutateAsync,
        updateExtracurricular: updateMutation.mutateAsync,
        deleteExtracurricular: deleteMutation.mutate,
        transferTutor:         transferTutorMutation.mutateAsync,
    };
}

// ─── Detail Hook ──────────────────────────────────────────────────────────────

export function useExtracurricularDetail(id: number | null) {
    return useQuery({
        queryKey: EKSKUL_KEYS.detail(id!),
        queryFn:  () => extracurricularService.getById(id!),
        enabled:  !!id,
        staleTime: 0,
    });
}

// ─── Tutors Dropdown Hook ─────────────────────────────────────────────────────

export function useTutorOptions() {
    return useQuery({
        queryKey: EKSKUL_KEYS.tutors,
        queryFn:  () => extracurricularService.getTutors(),
        staleTime: 10 * 60 * 1000,
    });
}

// ─── Members Hook ─────────────────────────────────────────────────────────────

export function useExtracurricularMembers(ekskulId: number | null) {
    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: (data: AddMemberRequest) =>
            extracurricularService.addMember(ekskulId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EKSKUL_KEYS.detail(ekskulId!) });
            queryClient.invalidateQueries({ queryKey: EKSKUL_KEYS.all });
            toast.success('Anggota berhasil ditambahkan');
        },
        onError: (err: Error) => toast.error(err?.message ?? 'Gagal menambahkan anggota'),
    });

    const removeMutation = useMutation({
        mutationFn: (membershipId: number) =>
            extracurricularService.removeMember(ekskulId!, membershipId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EKSKUL_KEYS.detail(ekskulId!) });
            queryClient.invalidateQueries({ queryKey: EKSKUL_KEYS.all });
            toast.success('Anggota berhasil dikeluarkan');
        },
        onError: (err: Error) => toast.error(err?.message ?? 'Gagal mengeluarkan anggota'),
    });

    return {
        addMember:    addMutation.mutateAsync,
        removeMember: removeMutation.mutate,
        isAdding:     addMutation.isPending,
        isRemoving:   removeMutation.isPending,
    };
}
