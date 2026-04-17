import { apiClient } from '@/lib/api-client';
import type {
    AttendanceSummary,
    AdminDailyAttendance,
    AdminMorningAttendance,
    AdminPrayerAttendance,
    AdminEkskulAttendance,
    AttendanceFilters,
} from '../types/attendance';

export interface AttendancePaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

/** Build query string, skip empty/undefined/'all' values */
const buildQuery = (params: Record<string, unknown>): string => {
    const entries = Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== '' && v !== 'all'
    );
    if (entries.length === 0) return '';
    return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
};

export const attendanceService = {
    /** GET /admin/attendance/summary */
    getSummary: (date?: string, academicYearId?: string): Promise<AttendanceSummary> => {
        const qs = buildQuery({ date, academic_year_id: academicYearId });
        return apiClient.get<AttendanceSummary>(`/admin/attendance/summary${qs}`);
    },

    /** GET /admin/attendance/daily (paginated) */
    getDaily: (filters: AttendanceFilters): Promise<AttendancePaginatedResponse<AdminDailyAttendance>> => {
        const qs = buildQuery(filters as Record<string, unknown>);
        return apiClient.getRaw<AttendancePaginatedResponse<AdminDailyAttendance>>(`/admin/attendance/daily${qs}`);
    },

    /** GET /admin/attendance/morning (paginated) */
    getMorning: (filters: AttendanceFilters): Promise<AttendancePaginatedResponse<AdminMorningAttendance>> => {
        const qs = buildQuery(filters as Record<string, unknown>);
        return apiClient.getRaw<AttendancePaginatedResponse<AdminMorningAttendance>>(`/admin/attendance/morning${qs}`);
    },

    /** GET /admin/attendance/prayer (paginated) */
    getPrayer: (filters: AttendanceFilters): Promise<AttendancePaginatedResponse<AdminPrayerAttendance>> => {
        const qs = buildQuery(filters as Record<string, unknown>);
        return apiClient.getRaw<AttendancePaginatedResponse<AdminPrayerAttendance>>(`/admin/attendance/prayer${qs}`);
    },

    /** GET /admin/attendance/extracurricular (paginated) */
    getExtracurricular: (filters: AttendanceFilters): Promise<AttendancePaginatedResponse<AdminEkskulAttendance>> => {
        const qs = buildQuery(filters as Record<string, unknown>);
        return apiClient.getRaw<AttendancePaginatedResponse<AdminEkskulAttendance>>(`/admin/attendance/extracurricular${qs}`);
    },
};

export default attendanceService;
