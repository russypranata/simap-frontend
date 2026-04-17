// ============================================================
// Teacher Types — sesuai backend API response
// ============================================================

export type TeacherStatus = 'active' | 'inactive' | 'leave';

export type EmploymentStatus = 'PNS' | 'PPPK' | 'GTY' | 'GTT' | 'HONORER';

export type TeacherRole =
    | 'subject_teacher'
    | 'picket_teacher'
    | 'homeroom_teacher';

export type LastEducation = 'SMA' | 'D3' | 'S1' | 'S2' | 'S3';

/**
 * Semua jabatan kepegawaian dalam satu array.
 * Menggabungkan fungsi utama (subject_teacher, headmaster, dll)
 * dan jabatan struktural tambahan (vice_curriculum, coord_piket, dll).
 */
export type TeacherPosition =
    // Fungsi utama
    | 'subject_teacher'
    | 'homeroom_teacher'
    | 'picket_teacher'
    | 'headmaster'
    | 'admin_staff'
    // Jabatan struktural tambahan
    | 'vice_curriculum'
    | 'vice_student_affairs'
    | 'coord_piket_ikhwan'
    | 'coord_piket_akhwat'
    | 'admin_dapodik';

// Shape dari backend API
export interface TeacherProfileData {
    id: number;
    employee_id: string | null;
    nuptk: string | null;
    nik: string | null;
    qualifications: string | null;
    employment_status: EmploymentStatus | null;
    /** Semua jabatan — fungsi utama + struktural dalam satu array */
    positions: TeacherPosition[];
    /** Jabatan struktural tambahan */
    structural_positions: StructuralPosition[];
    /** Jenis PTK (Guru / Tendik) */
    ptk_type: string | null;
    institution: string | null;
    sk_number: string | null;
    sk_date: string | null;
    status: TeacherStatus;
    join_date: string | null;
    last_education: LastEducation | null;
    education_major: string | null;
    education_university: string | null;
    education_graduation_year: string | null;
}

export type StructuralPosition =
    | 'headmaster'
    | 'vice_curriculum'
    | 'vice_student_affairs'
    | 'coord_piket_ikhwan'
    | 'coord_piket_akhwat'
    | 'admin_dapodik';

// Shape utama dari API response
export interface Teacher {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar: string | null;
    phone: string | null;
    address: string | null;
    dob: string | null;
    birth_place: string | null;
    gender: 'L' | 'P' | null;
    roles: TeacherRole[];
    teacher_profile: TeacherProfileData | null;
    created_at: string;
    updated_at: string;
}

// Payload untuk create
export interface CreateTeacherPayload {
    // User fields
    name: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    address?: string;
    dob?: string;
    birth_place?: string;
    gender?: 'L' | 'P';
    role: TeacherRole;

    // Profile fields
    employee_id?: string;
    nuptk?: string;
    nik?: string;
    qualifications?: string;
    employment_status?: EmploymentStatus;
    positions?: TeacherPosition[];
    institution?: string;
    sk_number?: string;
    sk_date?: string;
    status?: TeacherStatus;
    join_date?: string;
    last_education?: LastEducation;
    education_major?: string;
    education_university?: string;
    education_graduation_year?: string;
}

// Payload untuk update (semua optional)
export type UpdateTeacherPayload = Partial<CreateTeacherPayload>;

// Pagination meta dari backend
export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface TeacherListResponse {
    success: boolean;
    message: string;
    data: Teacher[];
    meta: PaginationMeta;
}

// Filter params
export interface TeacherFilters {
    search?: string;
    status?: TeacherStatus | 'all';
    role?: TeacherRole | 'all';
    page?: number;
    per_page?: number;
}
