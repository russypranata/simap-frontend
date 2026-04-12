import { apiClient } from '@/lib/api-client';
import { ParentStudentLink, CreateParentStudentRequest, UpdateParentStudentRequest } from '../types/parentStudent';

export const parentStudentService = {
    getLinks: (params?: { student_profile_id?: string | number; parent_profile_id?: string | number }): Promise<ParentStudentLink[]> => {
        const query = new URLSearchParams();
        if (params?.student_profile_id) query.set('student_profile_id', String(params.student_profile_id));
        if (params?.parent_profile_id) query.set('parent_profile_id', String(params.parent_profile_id));
        const qs = query.toString();
        return apiClient.get<ParentStudentLink[]>(`/admin/parent-student-links${qs ? `?${qs}` : ''}`);
    },

    createLink: (data: CreateParentStudentRequest): Promise<ParentStudentLink> =>
        apiClient.post<ParentStudentLink>('/admin/parent-student-links', data),

    updateLink: (id: string | number, data: UpdateParentStudentRequest): Promise<ParentStudentLink> =>
        apiClient.put<ParentStudentLink>(`/admin/parent-student-links/${id}`, data),

    deleteLink: (id: string | number): Promise<void> =>
        apiClient.delete(`/admin/parent-student-links/${id}`),
};

export default parentStudentService;
