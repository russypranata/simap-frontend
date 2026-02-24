export type EventType = 'holiday' | 'exam' | 'event' | 'meeting';

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    type: EventType;
    isHoliday: boolean;
}
