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
