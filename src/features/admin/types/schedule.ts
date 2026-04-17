export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
export type DayOfWeekEn = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export const DAY_MAP: Record<DayOfWeek, DayOfWeekEn> = {
    Senin:  'monday',
    Selasa: 'tuesday',
    Rabu:   'wednesday',
    Kamis:  'thursday',
    Jumat:  'friday',
    Sabtu:  'saturday',
};

export const DAY_MAP_REVERSE: Record<DayOfWeekEn, DayOfWeek> = {
    monday:    'Senin',
    tuesday:   'Selasa',
    wednesday: 'Rabu',
    thursday:  'Kamis',
    friday:    'Jumat',
    saturday:  'Sabtu',
};

export interface Schedule {
    id: string;
    classSubjectId: string;
    subjectId: string;
    classId: string;
    teacherId: string;
    subjectName: string;
    className: string;
    teacherName: string;
    type: string;
    label?: string;
    day: DayOfWeek;           // mapped from day_of_week (Indonesian)
    dayOfWeek: DayOfWeekEn;   // raw from backend
    startTime: string;        // HH:mm
    endTime: string;          // HH:mm
    room?: string;
    createdAt: string;
    updatedAt: string;
    // Extended fields used by compact schedule transformer
    academicYear?: string;
    semester?: string | number;
}

export interface CreateScheduleRequest {
    subject_id: string;
    class_id: string;
    teacher_id?: string;
    day_of_week: DayOfWeekEn;
    start_time: string;
    end_time: string;
    room?: string;
}

export interface UpdateScheduleRequest {
    subject_id?: string;
    class_id?: string;
    teacher_id?: string;
    day_of_week?: DayOfWeekEn;
    start_time?: string;
    end_time?: string;
    room?: string;
}
