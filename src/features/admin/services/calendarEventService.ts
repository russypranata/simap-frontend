import { apiClient } from '@/lib/api-client';
import { CalendarEvent, EventType } from '../types/calendar';
import { CalendarEventFormValues } from '../schemas/calendarSchema';

// Transform backend camelCase response → CalendarEvent
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
    const data = await apiClient.get<unknown>(`/admin/calendar-events${query}`);
    // Backend returns array directly (via resource collection)
    const list = Array.isArray(data) ? data : [];
    return list.map(transformEvent);
};

export const getCalendarEventById = async (id: string): Promise<CalendarEvent> => {
    const data = await apiClient.get<Record<string, unknown>>(`/admin/calendar-events/${id}`);
    return transformEvent(data);
};

export const createCalendarEvent = async (values: CalendarEventFormValues): Promise<CalendarEvent> => {
    const res = await apiClient.post<Record<string, unknown>>('/admin/calendar-events', {
        title: values.title,
        description: values.description ?? '',
        start_date: values.startDate,
        end_date: values.endDate,
        type: values.type,
        is_holiday: values.isHoliday,
    });
    return transformEvent(res);
};

export const updateCalendarEvent = async (id: string, values: CalendarEventFormValues): Promise<CalendarEvent> => {
    const res = await apiClient.put<Record<string, unknown>>(`/admin/calendar-events/${id}`, {
        title: values.title,
        description: values.description ?? '',
        start_date: values.startDate,
        end_date: values.endDate,
        type: values.type,
        is_holiday: values.isHoliday,
    });
    return transformEvent(res);
};

export const deleteCalendarEvent = async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/calendar-events/${id}`);
};

export const syncHolidays = async (year: number): Promise<{ added: number }> => {
    const res = await apiClient.post<Record<string, unknown>>('/admin/calendar-events/sync-holidays', { year });
    return { added: (res?.added as number) ?? 0 };
};

export const calendarEventService = {
    getCalendarEvents,
    getCalendarEventById,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    syncHolidays,
};

export default calendarEventService;
