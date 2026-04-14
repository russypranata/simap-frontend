import { apiClient } from '@/lib/api-client';
import {
    Schedule,
    CreateScheduleRequest,
    UpdateScheduleRequest,
    DayOfWeekEn,
    DAY_MAP_REVERSE,
} from '../types/schedule';

const toHHMM = (t: string) => t?.slice(0, 5) ?? '';

const transform = (s: any): Schedule => ({
    id: String(s.id),
    classSubjectId: String(s.class_subject_id ?? ''),
    subjectId: String(s.subject_id ?? ''),
    classId: String(s.class_id ?? ''),
    teacherId: String(s.teacher_id ?? ''),
    subjectName: s.subject_name ?? '',
    className: s.class_name ?? '',
    teacherName: s.teacher_name ?? '',
    type: s.type ?? 'lesson',
    label: s.label ?? undefined,
    dayOfWeek: s.day_of_week as DayOfWeekEn,
    day: DAY_MAP_REVERSE[s.day_of_week as DayOfWeekEn] ?? 'Senin',
    startTime: toHHMM(s.start_time),
    endTime: toHHMM(s.end_time),
    room: s.room ?? undefined,
    createdAt: s.created_at ?? '',
    updatedAt: s.updated_at ?? '',
});

export const scheduleService = {
    getSchedules: async (params?: { class_id?: string; day_of_week?: DayOfWeekEn }): Promise<Schedule[]> => {
        const qs = new URLSearchParams();
        if (params?.class_id) qs.set('class_id', params.class_id);
        if (params?.day_of_week) qs.set('day_of_week', params.day_of_week);
        const data = await apiClient.get<any[]>(`/admin/schedules${qs.toString() ? `?${qs}` : ''}`);
        return Array.isArray(data) ? data.map(transform) : [];
    },

    getScheduleById: async (id: string): Promise<Schedule> => {
        const data = await apiClient.get<any>(`/admin/schedules/${id}`);
        return transform(data);
    },

    createSchedule: async (payload: CreateScheduleRequest): Promise<Schedule> => {
        const data = await apiClient.post<any>('/admin/schedules', payload);
        return transform(data);
    },

    updateSchedule: async (id: string, payload: UpdateScheduleRequest): Promise<Schedule> => {
        const data = await apiClient.put<any>(`/admin/schedules/${id}`, payload);
        return transform(data);
    },

    deleteSchedule: (id: string): Promise<void> =>
        apiClient.delete(`/admin/schedules/${id}`),

    copyDaySchedule: async (sourceDay: string, targetDay: string): Promise<Schedule[]> => {
        const data = await apiClient.post<any[]>('/admin/schedules/copy-day', {
            source_day: sourceDay,
            target_day: targetDay,
        });
        return Array.isArray(data) ? data.map(transform) : [];
    },
};

export default scheduleService;
