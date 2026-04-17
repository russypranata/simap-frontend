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

const transform = (s: Record<string, unknown>): TimeSlot => ({
    id: String(s.id),
    day: s.day as DayKey,
    label: s.label as string,
    startTime: ((s.start_time as string) ?? '').slice(0, 5),
    endTime: ((s.end_time as string) ?? '').slice(0, 5),
    order: s.order as number,
    type: s.type as TimeSlotType,
});

export const timeSlotService = {
    getByDay: async (day: DayKey): Promise<TimeSlot[]> => {
        const data = await apiClient.get<Record<string, unknown>[]>(`/admin/time-slots?day=${day}`);
        return Array.isArray(data) ? data.map(transform) : [];
    },

    bulkUpdate: async (day: DayKey, slots: TimeSlotPayload[]): Promise<TimeSlot[]> => {
        const data = await apiClient.put<Record<string, unknown>[]>(`/admin/time-slots/${day}`, { slots });
        return Array.isArray(data) ? data.map(transform) : [];
    },
};
