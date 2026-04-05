import { useQuery } from "@tanstack/react-query";
import { mutamayizinService } from "../services/mutamayizinService";

export const useMutamayizinDashboard = () => {
    const profileQuery = useQuery({
        queryKey: ["mutamayizin-profile"],
        queryFn: () => mutamayizinService.getProfileData(),
        staleTime: 30 * 60 * 1000,
    });

    const statsQuery = useQuery({
        queryKey: ["mutamayizin-dashboard-stats"],
        queryFn: () => mutamayizinService.getDashboardStats(),
    });

    const achievementsQuery = useQuery({
        queryKey: ["mutamayizin-recent-achievements"],
        queryFn: () => mutamayizinService.getRecentAchievements(),
        staleTime: 5 * 60 * 1000,
    });

    const ekskulQuery = useQuery({
        queryKey: ["mutamayizin-ekskul-summary"],
        queryFn: () => mutamayizinService.getEkskulSummary(),
        staleTime: 5 * 60 * 1000,
    });

    const isLoading =
        profileQuery.isLoading ||
        statsQuery.isLoading ||
        achievementsQuery.isLoading ||
        ekskulQuery.isLoading;

    return {
        userName: profileQuery.data?.name ?? null,
        stats: statsQuery.data ?? null,
        recentAchievements: achievementsQuery.data ?? [],
        ekskulSummary: ekskulQuery.data ?? [],
        isLoading,
    };
};
