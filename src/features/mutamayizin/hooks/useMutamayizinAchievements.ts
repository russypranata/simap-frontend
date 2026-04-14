import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement,
} from "../services/mutamayizinService";
import type {
    AchievementParams,
    PaginatedResponse,
    Achievement,
    CreateAchievementData,
    UpdateAchievementData,
} from "../services/mutamayizinService";

export const useMutamayizinAchievements = (params?: AchievementParams) => {
    const { data, isLoading, error, refetch } = useQuery<PaginatedResponse<Achievement>>({
        queryKey: ["mutamayizin-achievements", params],
        queryFn: () => getAchievements(params),
        staleTime: 2 * 60 * 1000,
    });

    return {
        achievements: data?.data ?? [],
        isLoading,
        error,
        meta: data?.meta ?? null,
        refetch,
    };
};

export const useCreateAchievement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateAchievementData) => createAchievement(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mutamayizin-achievements"] });
        },
    });
};

export const useUpdateAchievement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateAchievementData }) =>
            updateAchievement(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mutamayizin-achievements"] });
        },
    });
};

export const useDeleteAchievement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteAchievement(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mutamayizin-achievements"] });
        },
    });
};
