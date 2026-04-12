import { apiClient } from '@/lib/api-client';
import { AdminUser } from '../types/user';
import { TeacherDropdown } from '../types/class';

export const teacherService = {
    getTeachers: (): Promise<TeacherDropdown[]> =>
        apiClient.get<TeacherDropdown[]>('/admin/teachers'),

    getTeacherById: (id: string | number): Promise<AdminUser> =>
        apiClient.get<AdminUser>(`/admin/users/${id}`),
};

export default teacherService;
