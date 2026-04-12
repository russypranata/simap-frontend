export interface ClassRoom {
    id: number;
    name: string;
    academic_year_id: number;
    academic_year_name?: string;
    homeroom_teacher_id?: number;
    homeroom_teacher_name?: string;
    total_students: number;
    created_at: string;
    updated_at: string;
}

export interface CreateClassRoomRequest {
    name: string;
    academic_year_id: number;
    homeroom_teacher_id?: number;
}

export interface UpdateClassRoomRequest {
    name?: string;
    academic_year_id?: number;
    homeroom_teacher_id?: number;
}

export interface TeacherDropdown {
    id: number;
    name: string;
}

/** @deprecated Use ClassRoom instead */
export interface Class {
    id: string;
    name: string;
    grade: number;
    type: 'REGULER' | 'PEMINATAN';
    peminatanCategory?: 'IKH' | 'AKH';
    subjectId?: string;
    subjectName?: string;
    academicYearId: string;
    homeroomTeacherId?: string;
    homeroomTeacherName?: string;
    capacity: number;
    totalStudents: number;
    genderCategory: 'PUTRA' | 'PUTRI' | 'CAMPURAN';
    createdAt: string;
    updatedAt: string;
}

/** @deprecated */
export interface Teacher {
    id: string;
    name: string;
    nip: string;
}

/** @deprecated */
export interface Student {
    id: string;
    name: string;
    nisn: string;
    status: 'ACTIVE' | 'INACTIVE';
}
