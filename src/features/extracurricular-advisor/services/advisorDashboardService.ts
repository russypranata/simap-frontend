// Dashboard Service for Extracurricular Advisor

import { apiClient } from '@/lib/api-client';

// ==================== TYPES ====================

export interface AdvisorDashboardStats {
    totalMembers: number;
    lastAttendancePresent: number;
    averageAttendance: number;
    totalMeetings: number;
    activeStudents: number;
    needsAttention: number;
    activeAssignments: number;
    averageAssessmentScore: number;
}

export interface RegularScheduleItem {
    id: number;
    day: string;
    time: string;
}

export interface UpcomingScheduleItem {
    id: number;
    day: string;
    date: string;
    time: string;
}

export interface RecentActivityItem {
    id: number;
    day: string;
    date: string;
    time: string;
    attendance: number;
}

export interface ActiveAcademicYear {
    academicYear: string;
    semester: string;
    label: string;
}

// ==================== SERVICE FUNCTIONS ====================

export const getDashboardStats = async (
    params: { academicYear?: string; semester?: string } = {}
): Promise<AdvisorDashboardStats> => {
    const { academicYear, semester } = params;

    const queryParams = new URLSearchParams();
    if (academicYear) queryParams.append("academic_year", academicYear);
    if (semester && semester !== "all") queryParams.append("semester", semester);

    const qs = queryParams.toString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await apiClient.get<any>(`/extracurricular-advisor/dashboard/stats${qs ? `?${qs}` : ''}`);

    // Normalize snake_case from Laravel to camelCase
    const d = result.data;
    return {
        totalMembers: d.total_members ?? d.totalMembers ?? 0,
        lastAttendancePresent: d.last_attendance_present ?? d.lastAttendancePresent ?? 0,
        averageAttendance: d.average_attendance ?? d.averageAttendance ?? 0,
        totalMeetings: d.total_meetings ?? d.totalMeetings ?? 0,
        activeStudents: d.active_students ?? d.activeStudents ?? 0,
        needsAttention: d.needs_attention ?? d.needsAttention ?? 0,
        activeAssignments: d.active_assignments ?? d.activeAssignments ?? 0,
        averageAssessmentScore: d.average_assessment_score ?? d.averageAssessmentScore ?? 0,
    };
};

export const getRegularSchedule = async (): Promise<RegularScheduleItem[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await apiClient.get<any>('/extracurricular-advisor/dashboard/regular-schedule');
    return result.data;
};

export const getUpcomingSchedule = async (): Promise<UpcomingScheduleItem[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await apiClient.get<any>('/extracurricular-advisor/dashboard/schedule');
    return result.data;
};

export const getRecentActivities = async (): Promise<RecentActivityItem[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await apiClient.get<any>('/extracurricular-advisor/dashboard/recent-activities');
    return result.data;
};

export const getActiveAcademicYear = async (): Promise<ActiveAcademicYear> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await apiClient.get<any>('/extracurricular-advisor/academic-year/active');
    return result.data;
};
