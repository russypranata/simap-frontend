import { TEACHER_API_URL, getAuthHeaders, handleApiError } from './teacherApiClient';

export interface TeacherClassSubject {
    id: string;
    name: string;
    subjectId: string;
}

export interface TeacherClass {
    id: string;
    name: string;
    academicYear: string | null;
    homeroomTeacher: string;
    studentCount: number;
    subjects: TeacherClassSubject[];
}

export interface TeacherStudent {
    id: string;
    nis: string;
    name: string;
    gender: string;
    birthDate: string | null;
    address: string;
    phone: string;
}

export const getTeacherClasses = async (): Promise<TeacherClass[]> => {
    const response = await fetch(`${TEACHER_API_URL}/classes`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data ?? [];
};

export const getClassStudents = async (classId: string): Promise<TeacherStudent[]> => {
    const response = await fetch(`${TEACHER_API_URL}/classes/${classId}/students`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data ?? [];
};
