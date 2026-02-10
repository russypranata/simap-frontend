// Compact schedule types for efficient storage

export interface CompactClassSchedule {
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
    teacherId: string;
    teacherName: string;
    room: string;
}

export interface CompactTimeSlot {
    startTime: string;
    endTime: string;
    classes: CompactClassSchedule[];
}

export interface CompactDaySchedule {
    day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
    academicYear: string;
    semester: 'Ganjil' | 'Genap';
    slots: CompactTimeSlot[];
}
