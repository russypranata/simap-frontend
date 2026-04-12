import { apiClient, PaginatedResponse } from '@/lib/api-client';
import { ClassRoom, CreateClassRoomRequest, UpdateClassRoomRequest, TeacherDropdown } from '../types/class';

export const classService = {
    getClasses: (params?: { academic_year_id?: string | number }): Promise<ClassRoom[]> =>
        apiClient.get<ClassRoom[]>(`/admin/classes${params?.academic_year_id ? `?academic_year_id=${params.academic_year_id}` : ''}`),

    getClassById: (id: string | number): Promise<ClassRoom> =>
        apiClient.get<ClassRoom>(`/admin/classes/${id}`),

    getTeachers: (): Promise<TeacherDropdown[]> =>
        apiClient.get<TeacherDropdown[]>('/admin/teachers'),

    createClass: (data: CreateClassRoomRequest): Promise<ClassRoom> =>
        apiClient.post<ClassRoom>('/admin/classes', data),

    updateClass: (id: string | number, data: UpdateClassRoomRequest): Promise<ClassRoom> =>
        apiClient.put<ClassRoom>(`/admin/classes/${id}`, data),

    deleteClass: (id: string | number): Promise<void> =>
        apiClient.delete(`/admin/classes/${id}`),
};

export default classService;
