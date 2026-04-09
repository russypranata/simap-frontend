import { useQuery } from "@tanstack/react-query";
import { getParentProfile } from "../services/parentProfileService";

export const useParentProfile = () => {
    const profileQuery = useQuery({
        queryKey: ["parent-profile"],
        queryFn: getParentProfile,
        staleTime: 5 * 60 * 1000,
    });

    return {
        profile: profileQuery.data ?? null,
        isLoading: profileQuery.isLoading,
        isFetching: profileQuery.isFetching,
        error: profileQuery.error instanceof Error ? profileQuery.error.message : null,
        refetch: profileQuery.refetch,
    };
};
