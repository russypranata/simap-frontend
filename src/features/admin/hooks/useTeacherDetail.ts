import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { teacherService } from '../services/teacherService';
import { TEACHER_KEYS } from './useTeacherList';

export const useTeacherDetail = (id: number) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const query = useQuery({
        queryKey: TEACHER_KEYS.detail(id),
        queryFn: () => teacherService.getTeacherById(id),
        enabled: !!id && !isNaN(id),
        staleTime: 0,
        gcTime: 5 * 60 * 1000,
    });

    const deleteMutation = useMutation({
        mutationFn: () => teacherService.deleteTeacher(id),
        onSuccess: () => {
            toast.success('Data guru berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.all });
            router.push('/admin/users/teachers');
        },
        onError: () => {
            toast.error('Gagal menghapus data guru');
        },
    });

    return {
        teacher: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        deleteTeacher: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
};
