// ============================================================
// Extracurricular Types — sesuai backend API response
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
    tutor_name: string | null;
    nip: string | null;
    join_date: string | null;
    regular_schedules: RegularSchedule[];
    member_count: number;
    active_member_count: number;
    created_at: string;
    updated_at: string;
    // Extended fields used by legacy ExtracurricularForm component
    mentorName?: string | null;
    category?: string | null;
    day?: string | null;
    time?: string | null;
    location?: string | null;
    currentCapacity?: number;
    mentorId?: string | null;
    maxCapacity?: number;
    description?: string | null;
}

export interface ExtracurricularMember {
    id: number;
    student_profile_id: number;
    student_name: string | null;
    academic_year_id: number;
    academic_year_name: string | null;
    join_date: string | null;
    status: 'active' | 'inactive';
    inactive_date: string | null;
    inactive_reason: string | null;
}

export interface TutorOption {
    id: number;
    name: string;
    extracurricular: string | null;
    tutor_profile_id: number | null;
}

export interface CreateExtracurricularRequest {
    tutor_user_id: number;
    name: string;
    nip?: string;
    join_date?: string;
}

export interface UpdateExtracurricularRequest {
    name?: string;
    nip?: string;
    join_date?: string;
}

export interface AddMemberRequest {
    student_profile_id: number;
    academic_year_id: number;
    join_date?: string;
}

export interface TransferTutorRequest {
    new_tutor_user_id: number;
    reason?: string;
}

export interface ExtracurricularFilters {
    search?: string;
    page?: number;
    per_page?: number;
}

// Used by the attendance detail page
export interface ExtracurricularSession {
    id: number;
    date: string;
    topic: string;
    startTime: string;
    endTime: string;
    attendanceCount: number;
    totalMembers: number;
    attendancePercentage: number;
}

export interface SessionMemberAttendance {
    studentId: number;
    studentName: string;
    nis: string;
    class: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpa';
    note: string | null;
}
