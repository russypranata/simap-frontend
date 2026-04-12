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
    nip?: string;
    specialization?: string;
}

export interface StudentProfile {
    id: number;
    nisn?: string;
    admission_number?: string;
}

export interface ParentProfile {
    id: number;
    occupation?: string;
}

export interface TutorProfile {
    id: number;
    nip?: string;
}

export interface StaffProfile {
    id: number;
    nip?: string;
    position?: string;
}

export interface AdminUser {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    phone?: string;
    address?: string;
    dob?: string;
    birth_place?: string;
    roles: string[];
    teacher_profile?: TeacherProfile;
    student_profile?: StudentProfile;
    parent_profile?: ParentProfile;
    tutor_profile?: TutorProfile;
    staff_profile?: StaffProfile;
    created_at: string;
    updated_at: string;
}

export interface CreateUserRequest {
    name: string;
    username: string;
    email: string;
    password: string;
    roles: UserRole[];
    phone?: string;
    address?: string;
    dob?: string;
    birth_place?: string;
}

export interface UpdateUserRequest {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    roles?: UserRole[];
    phone?: string;
    address?: string;
    dob?: string;
    birth_place?: string;
}
