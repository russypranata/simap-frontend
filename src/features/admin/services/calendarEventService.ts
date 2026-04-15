import { apiClient } from '@/lib/api-client';
import { CalendarEvent, EventType } from '../types/calendar';
import { CalendarEventFormValues } from '../schemas/calendarSchema';

// Transform backend camelCase response → CalendarEvent
const transformEvent = (e: any): CalendarEvent => ({
    id: String(e.id),
    academicYearId: e.academicYearId ? String(e.academicYearId) : null,
    title: e.title,
    description: e.description ?? '',
    startDate: e.startDate,
    endDate: e.endDate,
    type: e.type as EventType,
    isHoliday: e.isHoliday ?? false,
    createdAt: e.createdAt ?? '',
    updatedAt: e.updatedAt ?? '',
});

export const getCalendarEvents = async (params?: { month?: string }): Promise<CalendarEvent[]> => {
    const query = params?.month ? `?month=${encodeURIComponent(params.month)}` : '';
    const data = await apiClient.get<any>(`/admin/calendar-events${query}`);
    // Backend returns array directly (via resource collection)
    const list = Array.isArray(data) ? data : [];
    return list.map(transformEvent);
};

export const getCalendarEventById = async (id: string): Promise<CalendarEvent> => {
    const data = await apiClient.get<any>(`/admin/calendar-events/${id}`);
    return transformEvent(data);
};

export const createCalendarEvent = async (values: CalendarEventFormValues): Promise<CalendarEvent> => {
    const res = await apiClient.post<any>('/admin/calendar-events', {
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
    const res = await apiClient.put<any>(`/admin/calendar-events/${id}`, {
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
    const res = await apiClient.post<any>('/admin/calendar-events/sync-holidays', { year });
    return { added: res?.added ?? 0 };
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
