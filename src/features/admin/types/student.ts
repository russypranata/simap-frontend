// ============================================================
// Student Types — sesuai backend API response (StudentResource)
// ============================================================

export interface GuardianDetails {
    name: string;
    phone: string | null;
    relation: string;
}

export interface StudentParent {
    id: number;
    name: string | null;
    phone: string | null;
    occupation: string | null;
    relationship: string | null;
}

export interface AdminStudent {
    id: number;
    user_id: number;
    // User fields
    name: string;
    email: string;
    username: string;
    avatar: string | null;
    phone: string | null;
    address: string | null;
    dob: string | null;
    birth_place: string | null;
    gender: 'L' | 'P' | null;
    // Student profile fields
    admission_number: string;
    nis: string | null;
    nisn: string | null;
    birth_date: string | null;
    valid_until: string | null;
    religion: string | null;
    guardian_details: GuardianDetails | null;
    // Class info
    class_id: number | null;
    class_name: string | null;
    academic_year_id: number | null;
    academic_year_name: string | null;
    // Relations
    extracurriculars: string[];
    parents: StudentParent[];
    created_at: string;
    updated_at: string;
}

export interface CreateStudentRequest {
    // User
    name: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    address?: string;
    dob?: string;
    birth_place?: string;
    gender?: 'L' | 'P';
    // Profile
    admission_number: string;
    religion?: string;
    guardian_name?: string;
    guardian_phone?: string;
    guardian_relation?: string;
}

export interface UpdateStudentRequest {
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    phone?: string;
    address?: string;
    dob?: string;
    birth_place?: string;
    gender?: 'L' | 'P';
    admission_number?: string;
    religion?: string;
    guardian_name?: string;
    guardian_phone?: string;
    guardian_relation?: string;
}

export interface StudentFilters {
    search?: string;
    class_id?: number;
    academic_year_id?: number;
    religion?: string;
    page?: number;
    per_page?: number;
}

// Legacy types — kept for backward compat with mock data pages
export type StudentGender = 'L' | 'P';
export type StudentStatus = 'active' | 'graduated' | 'transferred' | 'dropped_out';

export interface Student {
    id: string;
    nis: string;
    nisn: string;
    name: string;
    gender: StudentGender;
    placeOfBirth: string;
    dateOfBirth: string;
    classId?: string;
    className?: string;
    generation: string;
    status: StudentStatus;
    address: string;
    email?: string;
    phoneNumber?: string;
    parentName?: string;
    parentPhone?: string;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
}
