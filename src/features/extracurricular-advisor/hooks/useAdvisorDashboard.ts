import { useState, useEffect, useCallback } from "react";
import { useAcademicYear } from "@/context/AcademicYearContext";
import {
    getDashboardStats,
    getUpcomingSchedule,
    getRecentActivities,
    type AdvisorDashboardStats,
    type UpcomingScheduleItem,
    type RecentActivityItem,
} from "../services/advisorDashboardService";
import { getProfile } from "../services/advisorProfileService";

interface UseAdvisorDashboardReturn {
    stats: AdvisorDashboardStats;
    upcomingSchedules: UpcomingScheduleItem[];
    recentActivities: RecentActivityItem[];
    advisorName: string;
    isLoading: boolean;
    refetch: () => void;
}

const DEFAULT_STATS: AdvisorDashboardStats = {
    totalMembers: 0,
    lastAttendancePresent: 0,
    averageAttendance: 0,
    totalMeetings: 0,
    activeStudents: 0,
    needsAttention: 0,
};

export const useAdvisorDashboard = (): UseAdvisorDashboardReturn => {
    const { academicYear } = useAcademicYear();

    const [stats, setStats] = useState<AdvisorDashboardStats>(DEFAULT_STATS);
    const [upcomingSchedules, setUpcomingSchedules] = useState<UpcomingScheduleItem[]>([]);
    const [recentActivities, setRecentActivities] = useState<RecentActivityItem[]>([]);
    const [advisorName, setAdvisorName] = useState("Tutor Ekskul");
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [statsData, scheduleData, activitiesData, profileData] = await Promise.all([
                getDashboardStats({ academicYear: academicYear.academicYear }),
                getUpcomingSchedule(),
                getRecentActivities(),
                getProfile(),
            ]);
            setStats(statsData);
            setUpcomingSchedules(scheduleData);
            setRecentActivities(activitiesData);
            setAdvisorName(profileData.name);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [academicYear.academicYear, academicYear.semester]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        stats,
        upcomingSchedules,
        recentActivities,
        advisorName,
        isLoading,
        refetch: fetchData,
    };
};
