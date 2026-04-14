import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getProfile,
    updateProfile,
    updateAvatar,
    updatePassword,
} from "../services/mutamayizinService";
import type {
    MutamayizinProfileData,
    UpdateProfileData,
    UpdatePasswordData,
} from "../services/mutamayizinService";

export const useMutamayizinProfile = () => {
    const { data, isLoading, error, refetch } = useQuery<MutamayizinProfileData>({
        queryKey: ["mutamayizin-profile"],
        queryFn: () => getProfile(),
        staleTime: 30 * 60 * 1000,
    });

    return { data, isLoading, error, refetch };
};

export const useUpdateMutamayizinProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateProfileData) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mutamayizin-profile"] });
        },
    });
};

export const useUpdateMutamayizinAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => updateAvatar(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mutamayizin-profile"] });
        },
    });
};

export const useUpdateMutamayizinPassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdatePasswordData) => updatePassword(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mutamayizin-profile"] });
        },
    });
};
