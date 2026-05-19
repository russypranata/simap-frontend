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
    params: { academicYear?: string; semester?: string } = {},
): Promise<AdvisorDashboardStats> => {
    const { academicYear, semester } = params;

    const queryParams = new URLSearchParams();
    if (academicYear) queryParams.append('academic_year', academicYear);
    if (semester && semester !== 'all')
        queryParams.append('semester', semester);

    const qs = queryParams.toString();
    const result = await apiClient.get<Record<string, number | string>>(
        `/extracurricular-advisor/dashboard/stats${qs ? `?${qs}` : ''}`,
    );

    // Handle null/undefined result from API
    if (!result) {
        return {
            totalMembers: 0,
            lastAttendancePresent: 0,
            averageAttendance: 0,
            totalMeetings: 0,
            activeStudents: 0,
            needsAttention: 0,
            activeAssignments: 0,
            averageAssessmentScore: 0,
        };
    }

    return {
        totalMembers: Number(
            result['total_members'] ?? result['totalMembers'] ?? 0,
        ),
        lastAttendancePresent: Number(
            result['last_attendance_present'] ??
                result['lastAttendancePresent'] ??
                0,
        ),
        averageAttendance: Number(
            result['average_attendance'] ?? result['averageAttendance'] ?? 0,
        ),
        totalMeetings: Number(
            result['total_meetings'] ?? result['totalMeetings'] ?? 0,
        ),
        activeStudents: Number(
            result['active_students'] ?? result['activeStudents'] ?? 0,
        ),
        needsAttention: Number(
            result['needs_attention'] ?? result['needsAttention'] ?? 0,
        ),
        activeAssignments: Number(
            result['active_assignments'] ?? result['activeAssignments'] ?? 0,
        ),
        averageAssessmentScore: Number(
            result['average_assessment_score'] ??
                result['averageAssessmentScore'] ??
                0,
        ),
    };
};

export const getRegularSchedule = async (): Promise<RegularScheduleItem[]> => {
    const result = await apiClient.get<RegularScheduleItem[]>(
        '/extracurricular-advisor/dashboard/regular-schedule',
    );
    return Array.isArray(result) ? result : [];
};

export const getUpcomingSchedule = async (): Promise<
    UpcomingScheduleItem[]
> => {
    const result = await apiClient.get<UpcomingScheduleItem[]>(
        '/extracurricular-advisor/dashboard/schedule',
    );
    return Array.isArray(result) ? result : [];
};

export const getRecentActivities = async (): Promise<RecentActivityItem[]> => {
    const result = await apiClient.get<RecentActivityItem[]>(
        '/extracurricular-advisor/dashboard/recent-activities',
    );
    return Array.isArray(result) ? result : [];
};

export const getActiveAcademicYear = async (): Promise<ActiveAcademicYear> => {
    const result = await apiClient.get<ActiveAcademicYear>(
        '/extracurricular-advisor/academic-year/active',
    );
    return result ?? { academicYear: '', semester: '', label: '' };
};
