export interface Class {
    id: string;
    name: string; // e.g., "X-A", "XI-IPA-1", "XI PEM AKH BIOLOGI"
    grade: number; // 10, 11, 12
    type: 'REGULER' | 'PEMINATAN';
    peminatanCategory?: 'IKH' | 'AKH'; // Ikhtishosh | Akhlak
    subjectId?: string; // Linked subject for Peminatan classes
    subjectName?: string; // Denormalized for display
    academicYearId: string;
    homeroomTeacherId?: string;
    homeroomTeacherName?: string; // Denormalized for display
    capacity: number;
    totalStudents: number;
    genderCategory: 'PUTRA' | 'PUTRI' | 'CAMPURAN';
    createdAt: string;
    updatedAt: string;
}

export interface CreateClassRequest {
    name: string;
    grade: number;
    type: 'REGULER' | 'PEMINATAN';
    peminatanCategory?: 'IKH' | 'AKH';
    subjectId?: string;
    academicYearId: string;
    homeroomTeacherId?: string;
    capacity: number;
    genderCategory: 'PUTRA' | 'PUTRI' | 'CAMPURAN';
}

export interface UpdateClassRequest {
    name?: string;
    grade?: number;
    type?: 'REGULER' | 'PEMINATAN';
    peminatanCategory?: 'IKH' | 'AKH';
    subjectId?: string;
    academicYearId?: string;
    homeroomTeacherId?: string;
    capacity?: number;
    genderCategory?: 'PUTRA' | 'PUTRI' | 'CAMPURAN';
}

export interface Teacher {
    id: string;
    name: string;
    nip: string;
}

export interface Student {
    id: string;
    name: string;
    nisn: string;
    status: 'ACTIVE' | 'INACTIVE';
}
