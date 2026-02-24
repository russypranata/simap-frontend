export interface TimeSlot {
    id: string;
    label: string;
    startTime: string;
    endTime: string;
    order: number;
    type: 'lesson' | 'break' | 'ceremony' | 'ishoma';
    day?: string; // Optional, for special slots like Monday ceremony
}

export const MOCK_MONDAY_SLOTS: TimeSlot[] = [
    { id: 'mon-ceremony', label: 'Upacara', startTime: '07:10', endTime: '07:50', order: 0, type: 'ceremony', day: 'Senin' },
    { id: 'mon-1', label: 'Jam ke-1', startTime: '07:50', endTime: '08:30', order: 1, type: 'lesson', day: 'Senin' },
    { id: 'mon-2', label: 'Jam ke-2', startTime: '08:30', endTime: '09:10', order: 2, type: 'lesson', day: 'Senin' },
    { id: 'mon-3', label: 'Jam ke-3', startTime: '09:10', endTime: '09:50', order: 3, type: 'lesson', day: 'Senin' },
    { id: 'mon-break-1', label: 'Istirahat', startTime: '09:50', endTime: '10:15', order: 4, type: 'break', day: 'Senin' },
    { id: 'mon-4', label: 'Jam ke-4', startTime: '10:15', endTime: '10:55', order: 5, type: 'lesson', day: 'Senin' },
    { id: 'mon-5', label: 'Jam ke-5', startTime: '10:55', endTime: '11:35', order: 6, type: 'lesson', day: 'Senin' },
    { id: 'mon-ishoma', label: 'Ishoma', startTime: '11:35', endTime: '13:00', order: 7, type: 'ishoma', day: 'Senin' },
    { id: 'mon-6', label: 'Jam ke-6', startTime: '13:00', endTime: '13:40', order: 8, type: 'lesson', day: 'Senin' },
    { id: 'mon-7', label: 'Jam ke-7', startTime: '13:40', endTime: '14:20', order: 9, type: 'lesson', day: 'Senin' },
    { id: 'mon-8', label: 'Jam ke-8', startTime: '14:20', endTime: '15:00', order: 10, type: 'lesson', day: 'Senin' },
];

export const MOCK_TUESDAY_SLOTS: TimeSlot[] = [
    { id: 'tue-0', label: 'Pembiasaan (Apel/Literasi)', startTime: '07:10', endTime: '07:20', order: 0, type: 'ceremony' },
    { id: 'tue-1', label: 'Jam ke-1', startTime: '07:20', endTime: '08:00', order: 1, type: 'lesson' },
    { id: 'tue-2', label: 'Jam ke-2', startTime: '08:00', endTime: '08:40', order: 2, type: 'lesson' },
    { id: 'tue-3', label: 'Jam ke-3', startTime: '08:40', endTime: '09:20', order: 3, type: 'lesson' },
    { id: 'tue-4', label: 'Jam ke-4', startTime: '09:20', endTime: '10:00', order: 4, type: 'lesson' },
    { id: 'tue-break', label: 'Istirahat', startTime: '10:00', endTime: '10:20', order: 5, type: 'break' },
    { id: 'tue-5', label: 'Jam ke-5', startTime: '10:20', endTime: '11:00', order: 6, type: 'lesson' },
    { id: 'tue-6', label: 'Jam ke-6', startTime: '11:00', endTime: '11:40', order: 7, type: 'lesson' },
    { id: 'tue-ishoma', label: 'Ishoma', startTime: '11:40', endTime: '13:00', order: 8, type: 'ishoma' },
    { id: 'tue-7', label: 'Jam ke-7', startTime: '13:00', endTime: '13:40', order: 9, type: 'lesson' },
    { id: 'tue-8', label: 'Jam ke-8', startTime: '13:40', endTime: '14:20', order: 10, type: 'lesson' },
    { id: 'tue-9', label: 'Jam ke-9', startTime: '14:20', endTime: '15:00', order: 11, type: 'lesson' },
];

export const MOCK_WEDNESDAY_SLOTS: TimeSlot[] = [
    { id: 'wed-1', label: 'Jam ke-1', startTime: '07:10', endTime: '07:35', order: 1, type: 'lesson', day: 'Rabu' },
    { id: 'wed-2', label: 'Jam ke-2', startTime: '07:35', endTime: '08:15', order: 2, type: 'lesson', day: 'Rabu' },
    { id: 'wed-3', label: 'Jam ke-3', startTime: '08:15', endTime: '08:55', order: 3, type: 'lesson', day: 'Rabu' },
    { id: 'wed-break', label: 'Istirahat (Jam ke-4)', startTime: '08:55', endTime: '09:15', order: 4, type: 'break', day: 'Rabu' }, // Users says Jam 4 is Break
    { id: 'wed-5', label: 'Jam ke-5', startTime: '09:15', endTime: '09:55', order: 5, type: 'lesson', day: 'Rabu' },
    { id: 'wed-6', label: 'Jam ke-6', startTime: '09:55', endTime: '10:35', order: 6, type: 'lesson', day: 'Rabu' },
    { id: 'wed-7', label: 'Jam ke-7', startTime: '10:35', endTime: '11:15', order: 7, type: 'lesson', day: 'Rabu' },
    { id: 'wed-8', label: 'Jam ke-8', startTime: '11:15', endTime: '11:55', order: 8, type: 'lesson', day: 'Rabu' },
    { id: 'wed-ishoma', label: 'Ishoma', startTime: '11:55', endTime: '13:00', order: 9, type: 'ishoma', day: 'Rabu' },
    { id: 'wed-9', label: 'Jam ke-9', startTime: '13:00', endTime: '13:40', order: 10, type: 'lesson', day: 'Rabu' },
    { id: 'wed-10', label: 'Jam ke-10', startTime: '13:40', endTime: '14:20', order: 11, type: 'lesson', day: 'Rabu' },
    { id: 'wed-11', label: 'Jam ke-11', startTime: '14:20', endTime: '15:00', order: 12, type: 'lesson', day: 'Rabu' },
];

// Generate Thursday slots based on Tuesday but with unique IDs
export const MOCK_THURSDAY_SLOTS: TimeSlot[] = MOCK_TUESDAY_SLOTS.map(slot => ({
    ...slot,
    id: slot.id.replace('tue', 'thu'),
    day: 'Kamis'
}));

export const MOCK_SATURDAY_SLOTS: TimeSlot[] = MOCK_TUESDAY_SLOTS.map(slot => ({
    ...slot,
    id: slot.id.replace('tue', 'sat'),
    day: 'Sabtu'
}));

export const MOCK_TIME_SLOTS = MOCK_MONDAY_SLOTS; // Default fallback

export const MOCK_FRIDAY_SLOTS: TimeSlot[] = [
    { id: 'fri-1', label: 'Jam ke-1', startTime: '07:30', endTime: '08:05', order: 1, type: 'lesson', day: 'Jumat' }, // 35 mins
    { id: 'fri-2', label: 'Jam ke-2', startTime: '08:05', endTime: '08:40', order: 2, type: 'lesson', day: 'Jumat' },
    { id: 'fri-3', label: 'Jam ke-3', startTime: '08:40', endTime: '09:15', order: 3, type: 'lesson', day: 'Jumat' },
    { id: 'fri-break', label: 'Istirahat', startTime: '09:15', endTime: '09:30', order: 4, type: 'break', day: 'Jumat' },
    { id: 'fri-4', label: 'Jam ke-4', startTime: '09:30', endTime: '10:05', order: 5, type: 'lesson', day: 'Jumat' },
    { id: 'fri-5', label: 'Jam ke-5', startTime: '10:05', endTime: '10:40', order: 6, type: 'lesson', day: 'Jumat' },
    { id: 'fri-6', label: 'Jam ke-6', startTime: '10:40', endTime: '11:15', order: 7, type: 'lesson', day: 'Jumat' },
    // Pulang sebelum Jumatan
];

// Helper to get lesson slots only
export const getLessonSlots = (): TimeSlot[] => {
    return MOCK_TIME_SLOTS.filter(slot => slot.type === 'lesson');
};

// Helper to get slots by day
export const getSlotsByDay = (day: string): TimeSlot[] => {
    return MOCK_TIME_SLOTS.filter(slot => 
        !slot.day || slot.day === day
    );
};

// Helper to get slot by time
export const getSlotByTime = (startTime: string, endTime: string): TimeSlot | undefined => {
    return MOCK_TIME_SLOTS.find(
        slot => slot.startTime === startTime && slot.endTime === endTime
    );
};
