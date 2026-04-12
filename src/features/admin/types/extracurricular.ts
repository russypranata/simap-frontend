// ============================================================
// API Types (sesuai backend response)
// ============================================================

export interface RegularSchedule {
    id: number;
    day: string;
    time_start: string;
    time_end: string;
}

export interface Extracurricular {
    id: number;
    name: string;
    tutor_id: number;
    tutor_name?: string;
    nip?: string;
    join_date?: string;
    regular_schedules: RegularSchedule[];
    member_count: number;
    created_at: string;
    updated_at: string;
}

export interface ExtracurricularMember {
    id: number;
    student_profile_id: number;
    student_name?: string;
    academic_year_id: number;
    academic_year_name?: string;
    join_date?: string;
    status: string;
    inactive_date?: string;
    inactive_reason?: string;
}

export interface CreateExtracurricularRequest {
    name: string;
    tutor_id: number;
    nip?: string;
    join_date?: string;
}

export interface UpdateExtracurricularRequest {
    name?: string;
    tutor_id?: number;
    nip?: string;
    join_date?: string;
}

export interface AddMemberRequest {
    student_profile_id: number;
    academic_year_id: number;
    join_date?: string;
}

// ============================================================
// Legacy types (digunakan oleh mock data & attendance service)
// ============================================================

export type ExtracurricularCategory = 'Olahraga' | 'Seni' | 'Akademik' | 'Keagamaan' | 'Lainnya';

/** @deprecated Gunakan Extracurricular (API type) untuk data real */
export interface ExtracurricularLegacy {
    id: string;
    name: string;
    category: ExtracurricularCategory;
    mentorId: string;
    mentorName: string;
    day: string;
    time: string;
    location?: string;
    maxCapacity: number;
    currentCapacity: number;
    academicYearId: string;
    description?: string;
}

export interface ExtracurricularAttendanceRecap {
    extracurricularId: string;
    extracurricularName: string;
    category: ExtracurricularCategory;
    totalSessions: number;
    attendanceRate: number;
    lastActivity: string;
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
