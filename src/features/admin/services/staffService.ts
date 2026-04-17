import { apiClient, PaginatedResponse } from '@/lib/api-client';
import {
    Staff,
    StaffFilters,
    CreateStaffPayload,
    UpdateStaffPayload,
} from '../types/staff';

const buildQuery = (filters?: StaffFilters): string => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.per_page) params.set('per_page', String(filters.per_page));
    const qs = params.toString();
    return qs ? `?${qs}` : '';
};

export const staffService = {
    /**
     * GET /admin/staff-list — list staf dengan pagination & filter
     */
    getStaff: (filters?: StaffFilters): Promise<PaginatedResponse<Staff>> =>
        apiClient.getRaw<PaginatedResponse<Staff>>(`/admin/staff-list${buildQuery(filters)}`),

    /**
     * GET /admin/staff-list/{id} — detail staf
     */
    getStaffById: (id: number): Promise<Staff> =>
        apiClient.get<Staff>(`/admin/staff-list/${id}`),

    /**
     * POST /admin/staff-list — tambah staf baru
     */
    createStaff: (data: CreateStaffPayload): Promise<Staff> =>
        apiClient.post<Staff>('/admin/staff-list', data),

    /**
     * PUT /admin/staff-list/{id} — update data staf
     */
    updateStaff: (id: number, data: UpdateStaffPayload): Promise<Staff> =>
        apiClient.put<Staff>(`/admin/staff-list/${id}`, data),

    /**
     * DELETE /admin/staff-list/{id} — hapus staf
     */
    deleteStaff: (id: number): Promise<void> =>
        apiClient.delete(`/admin/staff-list/${id}`),
};

export default staffService;
