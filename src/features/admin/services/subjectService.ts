import { apiClient } from '@/lib/api-client';
import { Subject, SubjectCategory, SubjectType, CreateSubjectRequest, UpdateSubjectRequest } from '../types/subject';

const transform = (s: Record<string, unknown>): Subject => ({
    id: String(s.id),
    name: s.name as string,
    code: s.code as string,
    description: (s.description as string) ?? undefined,
    category: (s.category as SubjectCategory) ?? 'UMUM',
    type: (s.type as SubjectType) ?? 'WAJIB',
    gradeLevel: Array.isArray(s.grade_level) ? s.grade_level as string[] : [],
    teacherNames: Array.isArray(s.teacher_names) ? s.teacher_names as string[] : [],
    createdAt: (s.created_at as string) ?? '',
    updatedAt: (s.updated_at as string) ?? '',
});

export interface TeacherOption {
    id: string;
    name: string;
}

export const subjectService = {
    getSubjects: async (): Promise<Subject[]> => {
        const data = await apiClient.get<Record<string, unknown>[]>('/admin/subjects');
        return Array.isArray(data) ? data.map(transform) : [];
    },

    getSubjectById: async (id: string | number): Promise<Subject> => {
        const data = await apiClient.get<Record<string, unknown>>(`/admin/subjects/${id}`);
        return transform(data);
    },

    getTeachers: async (): Promise<TeacherOption[]> => {
        const data = await apiClient.get<Record<string, unknown>[]>('/admin/teachers');
        return Array.isArray(data)
            ? data.map(t => ({ id: String(t.id), name: t.name as string }))
            : [];
    },

    createSubject: async (payload: CreateSubjectRequest): Promise<Subject> => {
        const data = await apiClient.post<Record<string, unknown>>('/admin/subjects', {
            ...payload,
            grade_level: payload.grade_level ?? [],
        });
        return transform(data);
    },

    updateSubject: async (id: string | number, payload: UpdateSubjectRequest): Promise<Subject> => {
        const data = await apiClient.put<Record<string, unknown>>(`/admin/subjects/${id}`, {
            ...payload,
            ...(payload.grade_level !== undefined && { grade_level: payload.grade_level }),
        });
        return transform(data);
    },

    deleteSubject: (id: string | number): Promise<void> =>
        apiClient.delete(`/admin/subjects/${id}`),
};

export default subjectService;
