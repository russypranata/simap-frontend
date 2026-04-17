export type SubjectCategory = 'UMUM' | 'AGAMA' | 'KEJURUAN' | 'EKSKUL';
export type SubjectType = 'WAJIB' | 'PEMINATAN';

export interface Subject {
    id: string;
    name: string;
    code: string;
    description?: string;
    category: SubjectCategory;
    type: SubjectType;
    gradeLevel: string[];      // mapped from grade_level
    teacherNames: string[];    // mapped from teacher_names
    createdAt: string;
    updatedAt: string;
    // Extended fields returned by getById
    teachers?: Array<{ id: string; name: string; nip?: string; specialization?: string }>;
    gradeSpecificJp?: Record<string, number>;
}

export interface CreateSubjectRequest {
    name: string;
    code: string;
    description?: string;
    category?: SubjectCategory;
    type?: SubjectType;
    grade_level?: string[];
}

export interface UpdateSubjectRequest {
    name?: string;
    code?: string;
    description?: string;
    category?: SubjectCategory;
    type?: SubjectType;
    grade_level?: string[];
}
