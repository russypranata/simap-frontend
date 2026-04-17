import { apiClient, PaginatedResponse } from '@/lib/api-client';
import { StudentMutation, CreateMutationRequest, UpdateMutationRequest, MutationFilters } from '../types/mutation';

const buildQuery = (f?: MutationFilters) => {
    const p = new URLSearchParams();
    if (f?.search)   p.set('search', f.search);
    if (f?.type)     p.set('type', f.type);
    if (f?.status)   p.set('status', f.status);
    if (f?.page)     p.set('page', String(f.page));
    if (f?.per_page) p.set('per_page', String(f.per_page));
    const qs = p.toString();
    return qs ? `?${qs}` : '';
};

export const mutationService = {
    getMutations:   (f?: MutationFilters): Promise<PaginatedResponse<StudentMutation>> =>
        apiClient.getRaw<PaginatedResponse<StudentMutation>>(`/admin/mutations${buildQuery(f)}`),
    getMutationById:(id: number): Promise<StudentMutation> =>
        apiClient.get<StudentMutation>(`/admin/mutations/${id}`),
    createMutation: (data: CreateMutationRequest): Promise<StudentMutation> =>
        apiClient.post<StudentMutation>('/admin/mutations', data),
    updateMutation: (id: number, data: UpdateMutationRequest): Promise<StudentMutation> =>
        apiClient.put<StudentMutation>(`/admin/mutations/${id}`, data),
    deleteMutation: (id: number): Promise<void> =>
        apiClient.delete(`/admin/mutations/${id}`),
    approveMutation:(id: number): Promise<StudentMutation> =>
        apiClient.post<StudentMutation>(`/admin/mutations/${id}/approve`, {}),
    rejectMutation: (id: number, notes?: string): Promise<StudentMutation> =>
        apiClient.post<StudentMutation>(`/admin/mutations/${id}/reject`, { notes }),
};
