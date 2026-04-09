import { useQuery } from "@tanstack/react-query";
import { useAcademicYear } from "@/context/AcademicYearContext";
import { getProfile } from "../services/advisorProfileService";
import { getDashboardStats } from "../services/advisorDashboardService";

export const useAdvisorProfile = () => {
    const { academicYear } = useAcademicYear();
    const ay = academicYear.academicYear;

    const profileQuery = useQuery({
        queryKey: ["advisor-profile"],
        queryFn: getProfile,
    });

    const statsQuery = useQuery({
        queryKey: ["advisor-dashboard-stats", ay],
        queryFn: () => getDashboardStats({ academicYear: ay }),
    });

    const isLoading = profileQuery.isLoading || statsQuery.isLoading;
    const isFetching = profileQuery.isFetching || statsQuery.isFetching;
    const error = profileQuery.error instanceof Error ? profileQuery.error.message : null;

    return {
        profile: profileQuery.data ?? null,
        stats: statsQuery.data ?? null,
        isLoading,
        isFetching,
        error,
        refetch: () => {
            profileQuery.refetch();
            statsQuery.refetch();
        },
    };
};
