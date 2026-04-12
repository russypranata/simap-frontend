import { apiClient } from '@/lib/api-client';
import { AdminUser, CreateUserRequest, UpdateUserRequest, UserRole } from '../types/user';

export const userService = {
    getUsers: (params?: { role?: UserRole; search?: string }): Promise<AdminUser[]> => {
        const query = new URLSearchParams();
        if (params?.role) query.set('role', params.role);
        if (params?.search) query.set('search', params.search);
        const qs = query.toString();
        return apiClient.get<AdminUser[]>(`/admin/users${qs ? `?${qs}` : ''}`);
    },

    getUserById: (id: string | number): Promise<AdminUser> =>
        apiClient.get<AdminUser>(`/admin/users/${id}`),

    createUser: (data: CreateUserRequest): Promise<AdminUser> =>
        apiClient.post<AdminUser>('/admin/users', data),

    updateUser: (id: string | number, data: UpdateUserRequest): Promise<AdminUser> =>
        apiClient.put<AdminUser>(`/admin/users/${id}`, data),

    deleteUser: (id: string | number): Promise<void> =>
        apiClient.delete(`/admin/users/${id}`),
};

export default userService;
