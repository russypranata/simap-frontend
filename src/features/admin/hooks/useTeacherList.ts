import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { teacherService } from '../services/teacherService';
import { TeacherFilters, CreateTeacherPayload, UpdateTeacherPayload } from '../types/teacher';

export const TEACHER_KEYS = {
    all: ['admin-teachers'] as const,
    list: (filters: TeacherFilters) => ['admin-teachers', 'list', filters] as const,
    detail: (id: number) => ['admin-teachers', 'detail', id] as const,
};

export const useTeacherList = (initialFilters?: TeacherFilters) => {
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<TeacherFilters>(initialFilters ?? {});

    const query = useQuery({
        queryKey: TEACHER_KEYS.list(filters),
        queryFn: () => teacherService.getTeachers(filters),
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
    });

    const invalidate = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.all });
    }, [queryClient]);

    // Create
    const createMutation = useMutation({
        mutationFn: (data: CreateTeacherPayload) => teacherService.createTeacher(data),
        onSuccess: () => {
            toast.success('Data guru berhasil ditambahkan');
            invalidate();
        },
        onError: (err: Error & { errors?: Record<string, string[]> }) => {
            const firstError = err.errors
                ? Object.values(err.errors)[0]?.[0]
                : err.message;
            toast.error(firstError ?? 'Gagal menambahkan data guru');
        },
    });

    // Update
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTeacherPayload }) =>
            teacherService.updateTeacher(id, data),
        onSuccess: () => {
            toast.success('Data guru berhasil diperbarui');
            invalidate();
        },
        onError: (err: Error & { errors?: Record<string, string[]> }) => {
            const firstError = err.errors
                ? Object.values(err.errors)[0]?.[0]
                : err.message;
            toast.error(firstError ?? 'Gagal memperbarui data guru');
        },
    });

    // Delete single
    const deleteMutation = useMutation({
        mutationFn: (id: number) => teacherService.deleteTeacher(id),
        onSuccess: () => {
            toast.success('Data guru berhasil dihapus');
            invalidate();
        },
        onError: () => toast.error('Gagal menghapus data guru'),
    });

    // Delete bulk
    const deleteBulk = async (ids: number[]) => {
        try {
            await Promise.all(ids.map((id) => teacherService.deleteTeacher(id)));
            toast.success(`${ids.length} data guru berhasil dihapus`);
            invalidate();
        } catch {
            toast.error('Gagal menghapus sebagian data guru');
            invalidate();
        }
    };

    return {
        // Data
        teachers: query.data?.data ?? [],
        meta: query.data?.meta,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,

        // Filters
        filters,
        setFilters,

        // Mutations
        createTeacher: createMutation.mutateAsync,
        updateTeacher: updateMutation.mutateAsync,
        deleteTeacher: deleteMutation.mutate,
        deleteBulk,

        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
