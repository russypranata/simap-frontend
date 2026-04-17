import { apiClient, PaginatedResponse } from '@/lib/api-client';
import { AdminParent, CreateParentRequest, UpdateParentRequest, ParentFilters } from '../types/parent';

const buildQuery = (f?: ParentFilters) => {
    const p = new URLSearchParams();
    if (f?.search)    p.set('search', f.search);
    if (f?.page)      p.set('page', String(f.page));
    if (f?.per_page)  p.set('per_page', String(f.per_page));
    const qs = p.toString();
    return qs ? `?${qs}` : '';
};

export const parentService = {
    getParents:   (f?: ParentFilters): Promise<PaginatedResponse<AdminParent>> =>
        apiClient.getRaw<PaginatedResponse<AdminParent>>(`/admin/parents${buildQuery(f)}`),
    getParentById:(id: number): Promise<AdminParent> =>
        apiClient.get<AdminParent>(`/admin/parents/${id}`),
    createParent: (data: CreateParentRequest): Promise<AdminParent> =>
        apiClient.post<AdminParent>('/admin/parents', data),
    updateParent: (id: number, data: UpdateParentRequest): Promise<AdminParent> =>
        apiClient.put<AdminParent>(`/admin/parents/${id}`, data),
    deleteParent: (id: number): Promise<void> =>
        apiClient.delete(`/admin/parents/${id}`),
    linkStudent:  (id: number, studentProfileId: number, relationship?: string): Promise<AdminParent> =>
        apiClient.post<AdminParent>(`/admin/parents/${id}/link-student`, { student_profile_id: studentProfileId, relationship }),
    unlinkStudent:(id: number, studentProfileId: number): Promise<void> =>
        apiClient.delete(`/admin/parents/${id}/unlink-student/${studentProfileId}`),
};
