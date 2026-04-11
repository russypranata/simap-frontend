import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getDashboardData,
    getParentChildren,
    type DashboardData,
    type DashboardChild,
} from "../services/parentDashboardService";

interface UseParentDashboardReturn {
    data: DashboardData | null;
    children: DashboardChild[];
    selectedChildId: string;
    setSelectedChildId: (id: string) => void;
    isLoading: boolean;
    isFetching: boolean;
    error: string | null;
    refetch: () => void;
}

export const useParentDashboard = (): UseParentDashboardReturn => {
    const queryClient = useQueryClient();
    const [selectedChildId, setSelectedChildId] = useState<string>("");

    // Fetch children list
    const childrenQuery = useQuery({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
        staleTime: 5 * 60 * 1000,
    });

    const children = childrenQuery.data ?? [];
    const effectiveChildId = selectedChildId || children[0]?.id || "";

    // Fetch dashboard data — staleTime: 0, gcTime default 5 menit (konsisten dengan halaman lain)
    const dashboardQuery = useQuery({
        queryKey: ["parent-dashboard", effectiveChildId],
        queryFn: () => getDashboardData(effectiveChildId),
        enabled: !!effectiveChildId,
        staleTime: 0,
    });

    const isLoading = childrenQuery.isLoading || (!!effectiveChildId && dashboardQuery.isLoading);
    const isFetching = childrenQuery.isFetching || dashboardQuery.isFetching;

    const error =
        childrenQuery.error instanceof Error
            ? childrenQuery.error.message
            : dashboardQuery.error instanceof Error
            ? dashboardQuery.error.message
            : null;

    const refetch = () => {
        queryClient.invalidateQueries({ queryKey: ["parent-dashboard", effectiveChildId] });
        queryClient.invalidateQueries({ queryKey: ["parent-children"] });
    };

    return {
        data: dashboardQuery.data ?? null,
        children,
        selectedChildId: effectiveChildId,
        setSelectedChildId,
        isLoading,
        isFetching,
        error,
        refetch,
    };
};
