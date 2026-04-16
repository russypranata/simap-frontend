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

/** Bangun query string dari object filter, skip nilai kosong/undefined/'all' */
const buildQuery = (params: Record<string, unknown>): string => {
    const entries = Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== '' && v !== 'all'
    );
    if (entries.length === 0) return '';
    return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
};

/**
 * Fetch helper untuk endpoint paginated yang butuh full response (data + meta).
 * apiClient.get mengekstrak hanya data.data, sehingga meta tidak tersedia.
 */
const fetchPaginated = async <T>(path: string): Promise<AttendancePaginatedResponse<T>> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const response = await fetch(`${baseUrl}${path}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    const json = await response.json();

    if (!response.ok) {
        const err = new Error(json?.message || response.statusText) as Error & { code: number };
        err.code = response.status;
        throw err;
    }

    return json as AttendancePaginatedResponse<T>;
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
        return fetchPaginated<AdminDailyAttendance>(`/admin/attendance/daily${qs}`);
    },

    /** GET /admin/attendance/morning (paginated) */
    getMorning: (filters: AttendanceFilters): Promise<AttendancePaginatedResponse<AdminMorningAttendance>> => {
        const qs = buildQuery(filters as Record<string, unknown>);
        return fetchPaginated<AdminMorningAttendance>(`/admin/attendance/morning${qs}`);
    },

    /** GET /admin/attendance/prayer (paginated) */
    getPrayer: (filters: AttendanceFilters): Promise<AttendancePaginatedResponse<AdminPrayerAttendance>> => {
        const qs = buildQuery(filters as Record<string, unknown>);
        return fetchPaginated<AdminPrayerAttendance>(`/admin/attendance/prayer${qs}`);
    },

    /** GET /admin/attendance/extracurricular (paginated) */
    getExtracurricular: (filters: AttendanceFilters): Promise<AttendancePaginatedResponse<AdminEkskulAttendance>> => {
        const qs = buildQuery(filters as Record<string, unknown>);
        return fetchPaginated<AdminEkskulAttendance>(`/admin/attendance/extracurricular${qs}`);
    },
};

export default attendanceService;
