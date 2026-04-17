import { apiClient } from '@/lib/api-client';
import {
    Schedule,
    CreateScheduleRequest,
    UpdateScheduleRequest,
    DayOfWeekEn,
    DAY_MAP_REVERSE,
} from '../types/schedule';

const toHHMM = (t: string) => t?.slice(0, 5) ?? '';

const transform = (s: Record<string, unknown>): Schedule => ({
    id: String(s.id),
    classSubjectId: String(s.class_subject_id ?? ''),
    subjectId: String(s.subject_id ?? ''),
    classId: String(s.class_id ?? ''),
    teacherId: String(s.teacher_id ?? ''),
    subjectName: (s.subject_name as string) ?? '',
    className: (s.class_name as string) ?? '',
    teacherName: (s.teacher_name as string) ?? '',
    type: (s.type as string) ?? 'lesson',
    label: (s.label as string) ?? undefined,
    dayOfWeek: s.day_of_week as DayOfWeekEn,
    day: DAY_MAP_REVERSE[s.day_of_week as DayOfWeekEn] ?? 'Senin',
    startTime: toHHMM(s.start_time as string),
    endTime: toHHMM(s.end_time as string),
    room: (s.room as string) ?? undefined,
    createdAt: (s.created_at as string) ?? '',
    updatedAt: (s.updated_at as string) ?? '',
});

export const scheduleService = {
    getSchedules: async (params?: { class_id?: string; day_of_week?: DayOfWeekEn }): Promise<Schedule[]> => {
        const qs = new URLSearchParams();
        if (params?.class_id) qs.set('class_id', params.class_id);
        if (params?.day_of_week) qs.set('day_of_week', params.day_of_week);
        const data = await apiClient.get<Record<string, unknown>[]>(`/admin/schedules${qs.toString() ? `?${qs}` : ''}`);
        return Array.isArray(data) ? data.map(transform) : [];
    },

    getScheduleById: async (id: string): Promise<Schedule> => {
        const data = await apiClient.get<Record<string, unknown>>(`/admin/schedules/${id}`);
        return transform(data);
    },

    createSchedule: async (payload: CreateScheduleRequest): Promise<Schedule> => {
        const data = await apiClient.post<Record<string, unknown>>('/admin/schedules', payload);
        return transform(data);
    },

    updateSchedule: async (id: string, payload: UpdateScheduleRequest): Promise<Schedule> => {
        const data = await apiClient.put<Record<string, unknown>>(`/admin/schedules/${id}`, payload);
        return transform(data);
    },

    deleteSchedule: (id: string): Promise<void> =>
        apiClient.delete(`/admin/schedules/${id}`),

    copyDaySchedule: async (sourceDay: string, targetDay: string): Promise<Schedule[]> => {
        const data = await apiClient.post<Record<string, unknown>[]>('/admin/schedules/copy-day', {
            source_day: sourceDay,
            target_day: targetDay,
        });
        return Array.isArray(data) ? data.map(transform) : [];
    },
};

export default scheduleService;
