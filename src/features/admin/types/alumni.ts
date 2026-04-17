// ============================================================
// Alumni Types
// ============================================================

export interface AdminAlumni {
    id: number;
    user_id: number;
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
    address: string | null;
    admission_number: string;
    religion: string | null;
    last_class_name: string | null;
    graduation_year: string | null;
    created_at: string;
    updated_at: string;
}

export interface AlumniFilters {
    search?: string;
    graduation_year?: string;
    page?: number;
    per_page?: number;
}
