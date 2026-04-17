import { apiClient, PaginatedResponse } from '@/lib/api-client';
import {
    Teacher,
    TeacherFilters,
    CreateTeacherPayload,
    UpdateTeacherPayload,
} from '../types/teacher';

// Dropdown type untuk keperluan select (tetap dipakai di class management)
export interface TeacherDropdown {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

const buildQuery = (filters?: TeacherFilters): string => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters?.role && filters.role !== 'all') params.set('role', filters.role);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.per_page) params.set('per_page', String(filters.per_page));
    const qs = params.toString();
    return qs ? `?${qs}` : '';
};

export const teacherService = {
    /**
     * GET /admin/teachers-list — list guru dengan pagination & filter
     */
    getTeachers: (filters?: TeacherFilters): Promise<PaginatedResponse<Teacher>> =>
        apiClient.getRaw<PaginatedResponse<Teacher>>(`/admin/teachers-list${buildQuery(filters)}`),

    /**
     * GET /admin/teachers-list/{id} — detail guru
     */
    getTeacherById: (id: number): Promise<Teacher> =>
        apiClient.get<Teacher>(`/admin/teachers-list/${id}`),

    /**
     * POST /admin/teachers-list — tambah guru baru
     */
    createTeacher: (data: CreateTeacherPayload): Promise<Teacher> =>
        apiClient.post<Teacher>('/admin/teachers-list', data),

    /**
     * PUT /admin/teachers-list/{id} — update data guru
     */
    updateTeacher: (id: number, data: UpdateTeacherPayload): Promise<Teacher> =>
        apiClient.put<Teacher>(`/admin/teachers-list/${id}`, data),

    /**
     * DELETE /admin/teachers-list/{id} — hapus guru
     */
    deleteTeacher: (id: number): Promise<void> =>
        apiClient.delete(`/admin/teachers-list/${id}`),

    /**
     * GET /admin/teachers — dropdown list (untuk class management, dll)
     */
    getTeachersDropdown: (): Promise<TeacherDropdown[]> =>
        apiClient.get<TeacherDropdown[]>('/admin/teachers'),
};

export default teacherService;
