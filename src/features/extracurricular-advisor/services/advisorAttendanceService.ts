// Attendance Service for Extracurricular Advisor

import { apiClient } from '@/lib/api-client';

// ==================== TYPES ====================

export interface AttendanceHistoryEntry {
    id: number;
    date: string;
    topic?: string;
    studentStats: {
        present: number;
        total: number;
        percentage: number;
    };
    advisorStats: {
        tutorName: string;
        startTime: string;
        endTime: string;
        duration: string;
        status: string;
    };
}

export interface AttendanceStudent {
    id: number;
    nis: string;
    name: string;
    class: string;
    status: string;
    note?: string;
}

export interface AttendanceDetail extends AttendanceHistoryEntry {
    students: AttendanceStudent[];
}

export interface CreateAttendanceRequest {
    date: string;
    start_time: string;
    end_time: string;
    topic?: string;
    students: {
        student_id: number;
        status: string;
        note?: string;
    }[];
}

// ==================== NORMALIZERS ====================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeHistoryEntry = (d: Record<string, any>): AttendanceHistoryEntry => ({
    id: d.id,
    date: d.date,
    topic: d.topic ?? undefined,
    studentStats: {
        present: d.student_stats?.present ?? d.studentStats?.present ?? 0,
        total: d.student_stats?.total ?? d.studentStats?.total ?? 0,
        percentage: d.student_stats?.percentage ?? d.studentStats?.percentage ?? 0,
    },
    advisorStats: {
        tutorName: d.advisor_stats?.tutor_name ?? d.advisor_stats?.tutorName ?? d.advisorStats?.tutorName ?? "",
        startTime: d.advisor_stats?.start_time ?? d.advisor_stats?.startTime ?? d.advisorStats?.startTime ?? "",
        endTime: d.advisor_stats?.end_time ?? d.advisor_stats?.endTime ?? d.advisorStats?.endTime ?? "",
        duration: d.advisor_stats?.duration ?? d.advisorStats?.duration ?? "",
        status: d.advisor_stats?.status ?? d.advisorStats?.status ?? "",
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeMember = (d: Record<string, any>): AttendanceStudent => ({
    id: d.id,
    nis: d.nis,
    name: d.name,
    class: d.class ?? d.class_name ?? d.kelas ?? "",
    status: d.status,
    note: d.note,
});

// ==================== SERVICE FUNCTIONS ====================

export const getAttendanceHistory = async (
    startDate?: string,
    endDate?: string
): Promise<AttendanceHistoryEntry[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await apiClient.get<any>(`/extracurricular-advisor/attendance?${params}`);
    return (result.data ?? []).map(normalizeHistoryEntry);
};

export const getAttendanceDetail = async (id: number): Promise<AttendanceDetail> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await apiClient.get<any>(`/extracurricular-advisor/attendance/${id}`);
    const d = result.data;
    return {
        ...normalizeHistoryEntry(d),
        topic: d.topic,
        students: (d.students ?? []).map(normalizeMember),
    };
};

export const submitAttendance = async (data: CreateAttendanceRequest) => {
    return apiClient.post('/extracurricular-advisor/attendance', data);
};
