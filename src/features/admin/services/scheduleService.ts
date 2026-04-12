import { apiClient } from '@/lib/api-client';
import { Schedule, CreateScheduleRequest, UpdateScheduleRequest } from '../types/schedule';

export const scheduleService = {
    getSchedules: (params?: { class_id?: string | number; day_of_week?: string }): Promise<Schedule[]> => {
        const query = new URLSearchParams();
        if (params?.class_id) query.set('class_id', String(params.class_id));
        if (params?.day_of_week) query.set('day_of_week', params.day_of_week);
        const qs = query.toString();
        return apiClient.get<Schedule[]>(`/admin/schedules${qs ? `?${qs}` : ''}`);
    },

    getScheduleById: (id: string | number): Promise<Schedule> =>
        apiClient.get<Schedule>(`/admin/schedules/${id}`),

    createSchedule: (data: CreateScheduleRequest): Promise<Schedule> =>
        apiClient.post<Schedule>('/admin/schedules', data),

    updateSchedule: (id: string | number, data: UpdateScheduleRequest): Promise<Schedule> =>
        apiClient.put<Schedule>(`/admin/schedules/${id}`, data),

    deleteSchedule: (id: string | number): Promise<void> =>
        apiClient.delete(`/admin/schedules/${id}`),
};

export default scheduleService;
