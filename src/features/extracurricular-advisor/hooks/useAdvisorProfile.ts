import { useState, useEffect, useCallback } from "react";
import { useAcademicYear } from "@/context/AcademicYearContext";
import { getProfile, type AdvisorProfileData } from "../services/advisorProfileService";
import { getDashboardStats, type AdvisorDashboardStats } from "../services/advisorDashboardService";

interface UseAdvisorProfileReturn {
    profile: AdvisorProfileData | null;
    stats: AdvisorDashboardStats | null;
    isLoading: boolean;
    refetch: () => void;
}

export const useAdvisorProfile = (): UseAdvisorProfileReturn => {
    const { academicYear } = useAcademicYear();
    const [profile, setProfile] = useState<AdvisorProfileData | null>(null);
    const [stats, setStats] = useState<AdvisorDashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [profileData, statsData] = await Promise.all([
                getProfile(),
                getDashboardStats({ academicYear: academicYear.academicYear }),
            ]);
            setProfile(profileData);
            setStats(statsData);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setIsLoading(false);
        }
    }, [academicYear.academicYear, academicYear.semester]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { profile, stats, isLoading, refetch: fetchData };
};
