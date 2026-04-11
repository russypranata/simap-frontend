import { useQuery } from '@tanstack/react-query';
import { getStudentDashboardData, type StudentDashboardData } from '../services/studentDashboardService';

export const useStudentDashboard = () => {
    const query = useQuery<StudentDashboardData>({
        queryKey: ['student-dashboard'],
        queryFn: getStudentDashboardData,
        staleTime: 2 * 60 * 1000,
    });

    return {
        data:      query.data ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error:     query.error instanceof Error ? query.error.message : null,
        refetch:   query.refetch,
    };
};
