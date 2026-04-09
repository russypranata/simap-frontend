import { useState, useEffect, useCallback } from "react";
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
    const [data, setData] = useState<DashboardData | null>(null);
    const [children, setChildren] = useState<DashboardChild[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial load — fetch children list
    useEffect(() => {
        const init = async () => {
            try {
                const childrenData = await getParentChildren();
                setChildren(childrenData);
                if (childrenData.length > 0) {
                    setSelectedChildId(childrenData[0].id);
                }
            } catch {
                setError("Gagal memuat data profil.");
                setIsLoading(false);
            }
        };
        init();
    }, []);

    // Fetch dashboard data when child changes
    const fetchData = useCallback(async () => {
        if (!selectedChildId) return;

        const isInitial = !data;
        if (isInitial) {
            setIsLoading(true);
        } else {
            setIsFetching(true);
        }
        setError(null);

        try {
            const result = await getDashboardData(selectedChildId);
            setData(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Gagal memuat data dashboard.";
            setError(message);
        } finally {
            setIsLoading(false);
            setIsFetching(false);
        }
    }, [selectedChildId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (selectedChildId) fetchData();
    }, [fetchData, selectedChildId]);

    return {
        data,
        children,
        selectedChildId,
        setSelectedChildId,
        isLoading,
        isFetching,
        error,
        refetch: fetchData,
    };
};
