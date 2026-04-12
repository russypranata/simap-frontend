import { apiClient } from '@/lib/api-client';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../types/subject';

const transform = (s: any): Subject => ({
    id: String(s.id),
    name: s.name,
    code: s.code,
    description: s.description ?? undefined,
    category: s.category ?? 'UMUM',
    type: s.type ?? 'WAJIB',
    gradeLevel: Array.isArray(s.grade_level) ? s.grade_level : [],
    teacherNames: Array.isArray(s.teacher_names) ? s.teacher_names : [],
    createdAt: s.created_at ?? '',
    updatedAt: s.updated_at ?? '',
});

export const subjectService = {
    getSubjects: async (): Promise<Subject[]> => {
        const data = await apiClient.get<any[]>('/admin/subjects');
        return Array.isArray(data) ? data.map(transform) : [];
    },

    getSubjectById: async (id: string | number): Promise<Subject> => {
        const data = await apiClient.get<any>(`/admin/subjects/${id}`);
        return transform(data);
    },

    createSubject: async (payload: CreateSubjectRequest): Promise<Subject> => {
        const data = await apiClient.post<any>('/admin/subjects', payload);
        return transform(data);
    },

    updateSubject: async (id: string | number, payload: UpdateSubjectRequest): Promise<Subject> => {
        const data = await apiClient.put<any>(`/admin/subjects/${id}`, payload);
        return transform(data);
    },

    deleteSubject: (id: string | number): Promise<void> =>
        apiClient.delete(`/admin/subjects/${id}`),
};

export default subjectService;
