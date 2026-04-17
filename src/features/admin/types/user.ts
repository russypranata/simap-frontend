// ============================================================
// User / Hak Akses Types — sesuai backend API response
// ============================================================

export type UserRole =
    | 'admin'
    | 'subject_teacher'
    | 'picket_teacher'
    | 'homeroom_teacher'
    | 'student'
    | 'parent'
    | 'extracurricular_tutor'
    | 'mutamayizin_coordinator'
    | 'headmaster';

export interface TeacherProfile {
    id: number;
    employee_id?: string | null;
    qualifications?: string | null;
}

export interface StudentProfile {
    id: number;
    admission_number?: string | null;
    religion?: string | null;
}

export interface ParentProfile {
    id: number;
    occupation?: string | null;
}

export interface TutorProfile {
    id: number;
    nip?: string | null;
    extracurricular?: string | null;
    join_date?: string | null;
}

export interface StaffProfile {
    id: number;
    department?: string | null;
    job_title?: string | null;
}

export interface AdminUser {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string | null;
    phone?: string | null;
    address?: string | null;
    dob?: string | null;
    birth_place?: string | null;
    roles: UserRole[];
    teacher_profile?: TeacherProfile | null;
    student_profile?: StudentProfile | null;
    parent_profile?: ParentProfile | null;
    tutor_profile?: TutorProfile | null;
    staff_profile?: StaffProfile | null;
    created_at: string;
    updated_at: string;
}

export interface CreateUserRequest {
    name: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    address?: string;
    dob?: string;
    birth_place?: string;
    // Teacher
    employee_id?: string;
    qualifications?: string;
    // Student
    admission_number?: string;
    religion?: string;
    // Parent
    occupation?: string;
    // Tutor
    nip?: string;
    extracurricular?: string;
    join_date?: string;
    // Staff
    department?: string;
    job_title?: string;
}

export interface UpdateUserRequest {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    phone?: string;
    address?: string;
    dob?: string;
    birth_place?: string;
    employee_id?: string;
    qualifications?: string;
    admission_number?: string;
    religion?: string;
    occupation?: string;
    nip?: string;
    extracurricular?: string;
    join_date?: string;
    department?: string;
    job_title?: string;
}

export interface UserPaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface UserListResponse {
    success: boolean;
    message: string;
    data: AdminUser[];
    meta: UserPaginationMeta;
}

export interface UserFilters {
    search?: string;
    role?: UserRole | 'all';
    page?: number;
    per_page?: number;
}

// Legacy types kept for backward compat
export type UserStatus = 'active' | 'inactive' | 'suspended';
export interface UserAccount {
    id: string;
    name: string;
    username: string;
    email: string;
    role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
    status: UserStatus;
    lastLogin: string;
    createdAt: string;
}
