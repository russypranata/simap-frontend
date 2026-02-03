'use client';

// Subject Types
export type SubjectCategory = 'UMUM' | 'AGAMA' | 'KEJURUAN' | 'EKSKUL';

export interface Subject {
    id: string;
    code: string;
    name: string;
    category: SubjectCategory;
    type: 'WAJIB' | 'PEMINATAN';
    forGender: 'PUTRA' | 'PUTRI' | 'CAMPURAN';
    hoursPerWeek?: number; // Deprecated, moved to gradeSpecificJp
    gradeSpecificJp?: Record<string, number>; // e.g. { "10": 4, "11": 6 }
    gradeLevel?: string[]; // e.g., ["10", "11"]
    description?: string;
    teacherIds: string[];
    teacherNames?: string[]; // For display purposes
    teachers?: TeacherRef[]; // Full teacher details
    createdAt: string;
    updatedAt: string;
}

export interface CreateSubjectRequest {
    code: string;
    name: string;
    category: SubjectCategory;
    type: 'WAJIB' | 'PEMINATAN';
    forGender: 'PUTRA' | 'PUTRI' | 'CAMPURAN';
    hoursPerWeek?: number; // Optional/Deprecated
    gradeSpecificJp?: Record<string, number>;
    gradeLevel?: string[];
    description?: string;
    teacherIds?: string[];
}

export interface UpdateSubjectRequest {
    code?: string;
    name?: string;
    category?: SubjectCategory;
    type?: 'WAJIB' | 'PEMINATAN';
    forGender?: 'PUTRA' | 'PUTRI' | 'CAMPURAN';
    hoursPerWeek?: number;
    gradeSpecificJp?: Record<string, number>;
    gradeLevel?: string[];
    description?: string;
    teacherIds?: string[];
}

// Teacher reference for assignment
export interface TeacherRef {
    id: string;
    name: string;
    nip?: string;
    specialization?: string;
}
