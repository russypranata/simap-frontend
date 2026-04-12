import { apiClient } from '@/lib/api-client';
import { ClassSubject, CreateClassSubjectRequest, UpdateClassSubjectRequest } from '../types/classSubject';

export const classSubjectService = {
    getClassSubjects: (params?: { class_id?: string | number }): Promise<ClassSubject[]> => {
        const query = new URLSearchParams();
        if (params?.class_id) query.set('class_id', String(params.class_id));
        const qs = query.toString();
        return apiClient.get<ClassSubject[]>(`/admin/class-subjects${qs ? `?${qs}` : ''}`);
    },

    getClassSubjectById: (id: string | number): Promise<ClassSubject> =>
        apiClient.get<ClassSubject>(`/admin/class-subjects/${id}`),

    createClassSubject: (data: CreateClassSubjectRequest): Promise<ClassSubject> =>
        apiClient.post<ClassSubject>('/admin/class-subjects', data),

    updateClassSubject: (id: string | number, data: UpdateClassSubjectRequest): Promise<ClassSubject> =>
        apiClient.put<ClassSubject>(`/admin/class-subjects/${id}`, data),

    deleteClassSubject: (id: string | number): Promise<void> =>
        apiClient.delete(`/admin/class-subjects/${id}`),
};

export default classSubjectService;
