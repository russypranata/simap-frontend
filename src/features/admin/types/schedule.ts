export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface Schedule {
    id: string;
    day: DayOfWeek;
    startTime: string; // "07:00"
    endTime: string;   // "08:20"
    subjectName: string;
    className: string;
    teacherName: string;
    room: string;
    academicYear: string;
    semester: string;
    
    // Relations (IDs)
    subjectId?: string;
    classId?: string;
    teacherId?: string;
}
