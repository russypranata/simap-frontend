import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../services/mutamayizinService";
import type { MutamayizinDashboardData } from "../services/mutamayizinService";

export const useMutamayizinDashboard = () => {
    const { data, isLoading, error, refetch } = useQuery<MutamayizinDashboardData>({
        queryKey: ["mutamayizin-dashboard"],
        queryFn: () => getDashboard(),
        staleTime: 5 * 60 * 1000,
    });

    return {
        data,
        stats: data?.stats ?? null,
        recentAchievements: data?.recentAchievements ?? [],
        ekskulSummary: data?.ekskulSummary ?? [],
        isLoading,
        error,
        refetch,
    };
};
