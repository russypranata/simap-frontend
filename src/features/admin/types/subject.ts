export interface Subject {
    id: number;
    name: string;
    code: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateSubjectRequest {
    name: string;
    code: string;
    description?: string;
}

export interface UpdateSubjectRequest {
    name?: string;
    code?: string;
    description?: string;
}

// Legacy types — dipertahankan untuk backward compatibility dengan halaman yang sudah ada

/** @deprecated */
export type SubjectCategory = 'UMUM' | 'AGAMA' | 'KEJURUAN' | 'EKSKUL';

/** @deprecated */
export interface TeacherRef {
    id: string;
    name: string;
    nip?: string;
    specialization?: string;
}
