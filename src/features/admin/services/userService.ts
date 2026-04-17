import { apiClient, PaginatedResponse } from '@/lib/api-client';
import {
    AdminUser,
    CreateUserRequest,
    UpdateUserRequest,
    UserFilters,
} from '../types/user';

const buildQuery = (filters?: UserFilters): string => {
    const params = new URLSearchParams();
    if (filters?.role && filters.role !== 'all') params.set('role', filters.role);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.per_page) params.set('per_page', String(filters.per_page));
    const qs = params.toString();
    return qs ? `?${qs}` : '';
};

export const userService = {
    getUsers: (filters?: UserFilters): Promise<PaginatedResponse<AdminUser>> =>
        apiClient.getRaw<PaginatedResponse<AdminUser>>(`/admin/users${buildQuery(filters)}`),

    getUserById: (id: number): Promise<AdminUser> =>
        apiClient.get<AdminUser>(`/admin/users/${id}`),

    createUser: (data: CreateUserRequest): Promise<AdminUser> =>
        apiClient.post<AdminUser>('/admin/users', data),

    updateUser: (id: number, data: UpdateUserRequest): Promise<AdminUser> =>
        apiClient.put<AdminUser>(`/admin/users/${id}`, data),

    deleteUser: (id: number): Promise<void> =>
        apiClient.delete(`/admin/users/${id}`),

    resetPassword: (id: number): Promise<{ new_password: string }> =>
        apiClient.post<{ new_password: string }>(`/admin/users/${id}/reset-password`, {}),
};

export default userService;
