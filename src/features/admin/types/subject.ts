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
