import { apiClient } from '@/lib/api-client';
import { Enrollment, CreateEnrollmentRequest, BulkEnrollmentRequest, UnenrolledStudent } from '../types/enrollment';

export const enrollmentService = {
    getEnrollments: (params?: { class_id?: string | number; academic_year_id?: string | number }): Promise<Enrollment[]> => {
        const query = new URLSearchParams();
        if (params?.class_id) query.set('class_id', String(params.class_id));
        if (params?.academic_year_id) query.set('academic_year_id', String(params.academic_year_id));
        const qs = query.toString();
        return apiClient.get<Enrollment[]>(`/admin/enrollments${qs ? `?${qs}` : ''}`);
    },

    createEnrollment: (data: CreateEnrollmentRequest): Promise<Enrollment> =>
        apiClient.post<Enrollment>('/admin/enrollments', data),

    bulkEnroll: (data: BulkEnrollmentRequest): Promise<{ enrolled: number[]; skipped: number[] }> =>
        apiClient.post('/admin/enrollments/bulk', data),

    deleteEnrollment: (id: string | number): Promise<void> =>
        apiClient.delete(`/admin/enrollments/${id}`),

    getUnenrolledStudents: (): Promise<UnenrolledStudent[]> =>
        apiClient.get<UnenrolledStudent[]>('/admin/students/unenrolled'),
};

export default enrollmentService;
