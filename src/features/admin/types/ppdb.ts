// ============================================================
// PPDB (Penerimaan Peserta Didik Baru) Types
// ============================================================

export type PPDBStatus = 'pending' | 'interview' | 'accepted' | 'rejected';

export interface PpdbRegistration {
    id: number;
    registration_number: string;
    name: string;
    nisn: string;
    gender: 'L' | 'P';
    dob: string;
    birth_place: string;
    religion: string | null;
    previous_school: string;
    average_grade: number | null;
    phone: string | null;
    address: string | null;
    parent_name: string;
    parent_phone: string;
    parent_occupation: string | null;
    status: PPDBStatus;
    academic_year_id: number | null;
    academic_year_name: string | null;
    notes: string | null;
    processed_by_name: string | null;
    processed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreatePpdbRequest {
    name: string;
    nisn: string;
    gender: 'L' | 'P';
    dob: string;
    birth_place: string;
    religion?: string;
    previous_school: string;
    average_grade?: number;
    phone?: string;
    address?: string;
    parent_name: string;
    parent_phone: string;
    parent_occupation?: string;
    academic_year_id?: number;
    notes?: string;
}

export interface UpdatePpdbRequest {
    name?: string;
    nisn?: string;
    gender?: 'L' | 'P';
    dob?: string;
    birth_place?: string;
    religion?: string;
    previous_school?: string;
    average_grade?: number;
    phone?: string;
    address?: string;
    parent_name?: string;
    parent_phone?: string;
    parent_occupation?: string;
    notes?: string;
}

export interface PpdbFilters {
    search?: string;
    status?: PPDBStatus;
    academic_year_id?: number;
    page?: number;
    per_page?: number;
}
