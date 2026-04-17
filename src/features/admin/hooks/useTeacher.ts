import { useQuery } from '@tanstack/react-query';
import { teacherService } from '../services/teacherService';
import { TEACHER_KEYS } from './useTeacherList';

/**
 * Hook untuk mengambil data satu guru berdasarkan ID.
 * Dipakai di halaman detail dan form edit.
 */
export const useTeacher = (id: number | null) => {
    const query = useQuery({
        queryKey: TEACHER_KEYS.detail(id ?? 0),
        queryFn: () => teacherService.getTeacherById(id!),
        enabled: id !== null && id > 0,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    return {
        teacher: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};
