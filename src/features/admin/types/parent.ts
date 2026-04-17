// ============================================================
// Parent (Wali Murid) Types — sesuai backend API response
// ============================================================

export interface ParentChild {
    id: number;
    name: string | null;
    admission_number: string;
    relationship: string | null;
}

export interface AdminParent {
    id: number;
    user_id: number;
    name: string;
    email: string;
    username: string;
    avatar: string | null;
    phone: string | null;
    address: string | null;
    occupation: string | null;
    children: ParentChild[];
    created_at: string;
    updated_at: string;
}

export interface CreateParentRequest {
    name: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    address?: string;
    occupation?: string;
    student_profile_id?: number;
    relationship?: string;
}

export interface UpdateParentRequest {
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    phone?: string;
    address?: string;
    occupation?: string;
}

export interface ParentFilters {
    search?: string;
    page?: number;
    per_page?: number;
}
