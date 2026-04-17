import { apiClient, PaginatedResponse } from '@/lib/api-client';
import { PpdbRegistration, CreatePpdbRequest, UpdatePpdbRequest, PpdbFilters, PPDBStatus } from '../types/ppdb';

const buildQuery = (f?: PpdbFilters) => {
    const p = new URLSearchParams();
    if (f?.search)           p.set('search', f.search);
    if (f?.status)           p.set('status', f.status);
    if (f?.academic_year_id) p.set('academic_year_id', String(f.academic_year_id));
    if (f?.page)             p.set('page', String(f.page));
    if (f?.per_page)         p.set('per_page', String(f.per_page));
    const qs = p.toString();
    return qs ? `?${qs}` : '';
};

export const ppdbService = {
    getRegistrations:   (f?: PpdbFilters): Promise<PaginatedResponse<PpdbRegistration>> =>
        apiClient.getRaw<PaginatedResponse<PpdbRegistration>>(`/admin/ppdb${buildQuery(f)}`),
    getRegistrationById:(id: number): Promise<PpdbRegistration> =>
        apiClient.get<PpdbRegistration>(`/admin/ppdb/${id}`),
    createRegistration: (data: CreatePpdbRequest): Promise<PpdbRegistration> =>
        apiClient.post<PpdbRegistration>('/admin/ppdb', data),
    updateRegistration: (id: number, data: UpdatePpdbRequest): Promise<PpdbRegistration> =>
        apiClient.put<PpdbRegistration>(`/admin/ppdb/${id}`, data),
    deleteRegistration: (id: number): Promise<void> =>
        apiClient.delete(`/admin/ppdb/${id}`),
    updateStatus:       (id: number, status: PPDBStatus, notes?: string): Promise<PpdbRegistration> =>
        apiClient.post<PpdbRegistration>(`/admin/ppdb/${id}/status`, { status, notes }),
};
