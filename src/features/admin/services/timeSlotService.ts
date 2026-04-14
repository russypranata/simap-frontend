import { apiClient } from '@/lib/api-client';

export type TimeSlotType = 'lesson' | 'break' | 'ceremony' | 'ishoma';
export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeSlot {
    id: string;
    day: DayKey;
    label: string;
    startTime: string;   // HH:mm
    endTime: string;     // HH:mm
    order: number;
    type: TimeSlotType;
}

export interface TimeSlotPayload {
    label: string;
    start_time: string;
    end_time: string;
    order: number;
    type: TimeSlotType;
}

const transform = (s: any): TimeSlot => ({
    id: String(s.id),
    day: s.day,
    label: s.label,
    startTime: (s.start_time ?? '').slice(0, 5),
    endTime: (s.end_time ?? '').slice(0, 5),
    order: s.order,
    type: s.type,
});

export const timeSlotService = {
    getByDay: async (day: DayKey): Promise<TimeSlot[]> => {
        const data = await apiClient.get<any[]>(`/admin/time-slots?day=${day}`);
        return Array.isArray(data) ? data.map(transform) : [];
    },

    bulkUpdate: async (day: DayKey, slots: TimeSlotPayload[]): Promise<TimeSlot[]> => {
        const data = await apiClient.put<any[]>(`/admin/time-slots/${day}`, { slots });
        return Array.isArray(data) ? data.map(transform) : [];
    },
};
