import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentService } from '../services/studentService';
import {
    CreateStudentRequest,
    UpdateStudentRequest,
    StudentFilters,
} from '../types/student';

export const STUDENT_KEYS = {
    all:    ['admin-students'] as const,
    list:   (filters: StudentFilters) => ['admin-students', 'list', filters] as const,
    detail: (id: number) => ['admin-students', 'detail', id] as const,
};

// ─── List Hook ────────────────────────────────────────────────────────────────

export function useStudentList() {
    const queryClient = useQueryClient();

    const [filters, setFiltersState] = useState<StudentFilters>({
        page: 1,
        per_page: 15,
    });

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: STUDENT_KEYS.list(filters),
        queryFn:  () => studentService.getStudents(filters),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    });

    const setFilters = useCallback((newFilters: Partial<StudentFilters>) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }));
    }, []);

    // Create
    const createMutation = useMutation({
        mutationFn: (payload: CreateStudentRequest) => studentService.createStudent(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
            toast.success('Data siswa berhasil ditambahkan');
        },
        onError: (err: Error) => toast.error(err?.message ?? 'Gagal menambahkan siswa'),
    });

    // Update
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateStudentRequest }) =>
            studentService.updateStudent(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
            queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.detail(id) });
            toast.success('Data siswa berhasil diperbarui');
        },
        onError: (err: Error) => toast.error(err?.message ?? 'Gagal memperbarui siswa'),
    });

    // Delete
    const deleteMutation = useMutation({
        mutationFn: (id: number) => studentService.deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
            toast.success('Data siswa berhasil dihapus');
        },
        onError: (err: Error) => toast.error(err?.message ?? 'Gagal menghapus siswa'),
    });

    return {
        students:  data?.data ?? [],
        meta:      data?.meta,
        isLoading,
        isFetching,
        isError,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        filters,
        setFilters,
        createStudent: createMutation.mutateAsync,
        updateStudent: updateMutation.mutateAsync,
        deleteStudent: deleteMutation.mutate,
    };
}

// ─── Detail Hook ──────────────────────────────────────────────────────────────

export function useStudentDetail(id: number | null) {
    return useQuery({
        queryKey: STUDENT_KEYS.detail(id!),
        queryFn:  () => studentService.getStudentById(id!),
        enabled:  !!id,
        staleTime: 5 * 60 * 1000,
    });
}
