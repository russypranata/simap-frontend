// ============================================================
// Mutation (Mutasi Siswa) Types
// ============================================================

export type MutationType = 'in' | 'out';
export type MutationStatus = 'pending' | 'approved' | 'rejected';

export interface StudentMutation {
    id: number;
    student_profile_id: number | null;
    student_name: string;
    admission_number: string | null;
    type: MutationType;
    mutation_date: string;
    school_origin: string | null;
    school_destination: string | null;
    reason: string | null;
    status: MutationStatus;
    notes: string | null;
    processed_by_name: string | null;
    processed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateMutationRequest {
    student_profile_id?: number;
    student_name: string;
    admission_number?: string;
    type: MutationType;
    mutation_date: string;
    school_origin?: string;
    school_destination?: string;
    reason?: string;
    notes?: string;
}

export interface UpdateMutationRequest {
    student_name?: string;
    admission_number?: string;
    type?: MutationType;
    mutation_date?: string;
    school_origin?: string;
    school_destination?: string;
    reason?: string;
    notes?: string;
}

export interface MutationFilters {
    search?: string;
    type?: MutationType;
    status?: MutationStatus;
    page?: number;
    per_page?: number;
}
