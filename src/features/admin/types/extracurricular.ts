export type ExtracurricularCategory = 'Olahraga' | 'Seni' | 'Akademik' | 'Keagamaan' | 'Lainnya';

export interface Extracurricular {
    id: string;
    name: string;
    category: ExtracurricularCategory;
    mentorId: string; // Teacher ID
    mentorName: string;
    day: string;
    time: string;
    location?: string;
    maxCapacity: number;
    currentCapacity: number;
    academicYearId: string;
    description?: string;
}

export interface ExtracurricularMember {
    id: string;
    studentId: string;
    studentName: string;
    class: string;
    nis: string;
    joinDate: string;
}

export interface ExtracurricularAttendanceRecap {
    extracurricularId: string;
    extracurricularName: string;
    category: ExtracurricularCategory;
    totalSessions: number;
    attendanceRate: number; // percentage
    lastActivity: string; // ISO date
}

export interface ExtracurricularSession {
    id: string;
    extracurricularId: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
    attendanceCount: number;
    totalMembers: number;
    attendancePercentage: number;
    mentorName: string;
}

export interface SessionMemberAttendance {
    studentId: string;
    studentName: string;
    nis: string;
    class: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpa';
    note?: string;
}
