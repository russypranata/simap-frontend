import { CalendarEvent } from '../types/calendar';

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
    {
        id: 'cal-001',
        title: 'Hari Raya Idul Fitri',
        description: 'Libur Nasional Hari Raya Idul Fitri 1445 H',
        startDate: '2024-04-10',
        endDate: '2024-04-11',
        type: 'holiday',
        isHoliday: true,
    },
    {
        id: 'cal-002',
        title: 'Ujian Tengah Semester (UTS)',
        description: 'Pelaksanaan UTS Semester Genap',
        startDate: '2024-03-04',
        endDate: '2024-03-09',
        type: 'exam',
        isHoliday: false,
    },
    {
        id: 'cal-003',
        title: 'Class Meeting',
        description: 'Lomba antar kelas pasca ujian',
        startDate: '2024-06-17',
        endDate: '2024-06-21',
        type: 'event',
        isHoliday: false,
    },
    {
        id: 'cal-004',
        title: 'Rapat Dewan Guru',
        description: 'Evaluasi Pembelajaran Semester Ganjil',
        startDate: '2024-01-02',
        endDate: '2024-01-02',
        type: 'meeting',
        isHoliday: false,
    },
];
