// ============================================================
// Staff Types — sesuai backend API response
// ============================================================

export type StaffStatus = 'active' | 'inactive' | 'leave';

export type StaffEmploymentStatus = 'PNS' | 'PPPK' | 'GTY' | 'GTT' | 'HONORER';

export type StaffRole = 'mutamayizin_coordinator' | 'headmaster' | 'admin';

export type LastEducation = 'SMA' | 'D3' | 'S1' | 'S2' | 'S3';

// Shape dari backend API
export interface StaffProfileData {
    id: number;
    employee_id: string | null;
    nuptk: string | null;
    nik: string | null;
    department: string | null;
    job_title: string | null;
    employment_status: StaffEmploymentStatus | null;
    institution: string | null;
    sk_number: string | null;
    sk_date: string | null;
    status: StaffStatus;
    join_date: string | null;
    last_education: LastEducation | null;
    education_major: string | null;
    education_university: string | null;
    education_graduation_year: string | null;
}

// Shape utama dari API response
export interface Staff {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar: string | null;
    phone: string | null;
    address: string | null;
    dob: string | null;
    birth_place: string | null;
    roles: StaffRole[];
    staff_profile: StaffProfileData | null;
    created_at: string;
    updated_at: string;
}

// Payload untuk create
export interface CreateStaffPayload {
    // User fields
    name: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    address?: string;
    dob?: string;
    birth_place?: string;
    role: StaffRole;

    // Profile fields
    employee_id?: string;
    nuptk?: string;
    nik?: string;
    department?: string;
    job_title?: string;
    employment_status?: StaffEmploymentStatus;
    institution?: string;
    sk_number?: string;
    sk_date?: string;
    status?: StaffStatus;
    join_date?: string;
    last_education?: LastEducation;
    education_major?: string;
    education_university?: string;
    education_graduation_year?: string;
}

// Payload untuk update (semua optional)
export type UpdateStaffPayload = Partial<CreateStaffPayload>;

// Pagination meta
export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface StaffListResponse {
    success: boolean;
    message: string;
    data: Staff[];
    meta: PaginationMeta;
}

// Filter params
export interface StaffFilters {
    search?: string;
    status?: StaffStatus | 'all';
    page?: number;
    per_page?: number;
}
