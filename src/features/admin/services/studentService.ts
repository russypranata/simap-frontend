import { apiClient } from '@/lib/api-client';
import { AdminUser } from '../types/user';
import { Enrollment, UnenrolledStudent } from '../types/enrollment';

export const studentService = {
    getStudents: (params?: { search?: string }): Promise<AdminUser[]> => {
        const query = new URLSearchParams({ role: 'student' });
        if (params?.search) query.set('search', params.search);
        return apiClient.get<AdminUser[]>(`/admin/users?${query.toString()}`);
    },

    getStudentsByClass: (classId: string | number): Promise<Enrollment[]> =>
        apiClient.get<Enrollment[]>(`/admin/enrollments?class_id=${classId}`),

    getUnenrolledStudents: (): Promise<UnenrolledStudent[]> =>
        apiClient.get<UnenrolledStudent[]>('/admin/students/unenrolled'),
};

export default studentService;
