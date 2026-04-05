import { useQuery } from "@tanstack/react-query";
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
        placeholderData: DEFAULT_STATS,
    });

    const scheduleQuery = useQuery({
        queryKey: ["advisor-dashboard-schedule"],
        queryFn: getUpcomingSchedule,
        staleTime: 10 * 60 * 1000, // jadwal jarang berubah, cache 10 menit
    });

    const activitiesQuery = useQuery({
        queryKey: ["advisor-dashboard-activities"],
        queryFn: getRecentActivities,
    });

    const profileQuery = useQuery({
        queryKey: ["advisor-profile"],
        queryFn: getProfile,
        staleTime: 30 * 60 * 1000, // profil sangat jarang berubah, cache 30 menit
    });

    const isLoading =
        scheduleQuery.isLoading ||
        activitiesQuery.isLoading ||
        profileQuery.isLoading;

    return {
        stats: statsQuery.data ?? DEFAULT_STATS,
        upcomingSchedules: scheduleQuery.data ?? ([] as UpcomingScheduleItem[]),
        recentActivities: activitiesQuery.data ?? ([] as RecentActivityItem[]),
        advisorName: profileQuery.data?.name ?? "Tutor Ekskul",
        extracurricularName: profileQuery.data?.extracurricular ?? "",
        isLoading,
        isStatsLoading: statsQuery.isLoading,
        refetch: () => {
            statsQuery.refetch();
            scheduleQuery.refetch();
            activitiesQuery.refetch();
            profileQuery.refetch();
        },
    };
};
