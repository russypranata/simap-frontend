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
