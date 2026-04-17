import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const DASHBOARD_KEYS = {
    all: ['admin-dashboard'] as const,
};

export function useAdminDashboard() {
    const { data, isLoading, isFetching, isError, refetch } = useQuery({
        queryKey: DASHBOARD_KEYS.all,
        queryFn:  () => dashboardService.getDashboard(),
        staleTime: 0,
        gcTime:    5 * 60 * 1000,
        retry: 1,
    });

    return {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    };
}
