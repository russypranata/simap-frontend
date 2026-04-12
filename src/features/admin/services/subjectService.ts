import { apiClient } from '@/lib/api-client';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../types/subject';

export const subjectService = {
    getSubjects: (): Promise<Subject[]> =>
        apiClient.get<Subject[]>('/admin/subjects'),

    getSubjectById: (id: string | number): Promise<Subject> =>
        apiClient.get<Subject>(`/admin/subjects/${id}`),

    createSubject: (data: CreateSubjectRequest): Promise<Subject> =>
        apiClient.post<Subject>('/admin/subjects', data),

    updateSubject: (id: string | number, data: UpdateSubjectRequest): Promise<Subject> =>
        apiClient.put<Subject>(`/admin/subjects/${id}`, data),

    deleteSubject: (id: string | number): Promise<void> =>
        apiClient.delete(`/admin/subjects/${id}`),
};

export default subjectService;
