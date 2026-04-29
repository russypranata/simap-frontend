import { apiClient } from '@/lib/api-client';

export type EventType = 'holiday' | 'exam' | 'event' | 'meeting';

export interface CalendarEvent {
    id: string;
    academicYearId: string | null;
    title: string;
    description?: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    type: EventType;
    isHoliday: boolean;
    createdAt?: string;
    updatedAt?: string;
}

const transformEvent = (e: Record<string, unknown>): CalendarEvent => ({
    id: String(e.id),
    academicYearId: e.academicYearId ? String(e.academicYearId) : null,
    title: e.title as string,
    description: (e.description as string) ?? '',
    startDate: e.startDate as string,
    endDate: e.endDate as string,
    type: e.type as EventType,
    isHoliday: (e.isHoliday as boolean) ?? false,
    createdAt: (e.createdAt as string) ?? '',
    updatedAt: (e.updatedAt as string) ?? '',
});

export const getCalendarEvents = async (params?: { month?: string }): Promise<CalendarEvent[]> => {
    const query = params?.month ? `?month=${encodeURIComponent(params.month)}` : '';
    const data = await apiClient.get<unknown>(`/calendar-events${query}`);
    const list = Array.isArray(data) ? data : [];
    return list.map(transformEvent);
};

export const sharedCalendarEventService = {
    getCalendarEvents,
};

export default sharedCalendarEventService;
