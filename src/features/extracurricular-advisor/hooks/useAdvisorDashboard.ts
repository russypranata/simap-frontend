import { useQuery } from "@tanstack/react-query";
import { useAcademicYear } from "@/context/AcademicYearContext";
import {
    getDashboardStats,
    getUpcomingSchedule,
    getRegularSchedule,
    getRecentActivities,
    type AdvisorDashboardStats,
    type UpcomingScheduleItem,
    type RegularScheduleItem,
    type RecentActivityItem,
} from "../services/advisorDashboardService";
import { getProfile } from "../services/advisorProfileService";

const DEFAULT_STATS: AdvisorDashboardStats = {
    totalMembers: 0,
    lastAttendancePresent: 0,
    averageAttendance: 0,
    totalMeetings: 0,
    activeStudents: 0,
    needsAttention: 0,
};

export const useAdvisorDashboard = () => {
    const { academicYear } = useAcademicYear();
    const ay = academicYear.academicYear;

    const statsQuery = useQuery({
        queryKey: ["advisor-dashboard-stats", ay],
        queryFn: () => getDashboardStats({ academicYear: ay }),
        // tidak pakai placeholderData — biarkan isLoading bekerja natural
    });

    const scheduleQuery = useQuery({
        queryKey: ["advisor-dashboard-schedule"],
        queryFn: getUpcomingSchedule,
        staleTime: 10 * 60 * 1000,
    });

    const regularScheduleQuery = useQuery({
        queryKey: ["advisor-dashboard-regular-schedule"],
        queryFn: getRegularSchedule,
        staleTime: 0,
    });

    const activitiesQuery = useQuery({
        queryKey: ["advisor-dashboard-activities"],
        queryFn: getRecentActivities,
    });

    const profileQuery = useQuery({
        queryKey: ["advisor-profile"],
        queryFn: getProfile,
        staleTime: 30 * 60 * 1000,
    });

    // isLoading true hanya saat pertama kali fetch (tidak ada cache sama sekali)
    const isLoading =
        statsQuery.isLoading ||
        scheduleQuery.isLoading ||
        regularScheduleQuery.isLoading ||
        activitiesQuery.isLoading ||
        profileQuery.isLoading;

    return {
        stats: statsQuery.data ?? DEFAULT_STATS,
        upcomingSchedules: scheduleQuery.data ?? ([] as UpcomingScheduleItem[]),
        regularSchedules: regularScheduleQuery.data ?? ([] as RegularScheduleItem[]),
        recentActivities: activitiesQuery.data ?? ([] as RecentActivityItem[]),
        advisorName: profileQuery.data?.name ?? null, // null = belum ada data, bukan fallback string
        extracurricularName: profileQuery.data?.extracurricular ?? "",
        isLoading,
        refetch: () => {
            statsQuery.refetch();
            scheduleQuery.refetch();
            regularScheduleQuery.refetch();
            activitiesQuery.refetch();
            profileQuery.refetch();
        },
    };
};
