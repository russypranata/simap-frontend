import { apiClient, PaginatedResponse } from '@/lib/api-client';
import {
    AdminStudent,
    CreateStudentRequest,
    UpdateStudentRequest,
    StudentFilters,
} from '../types/student';
import { Enrollment, UnenrolledStudent } from '../types/enrollment';

export interface PromotionItem {
    student_id: number;
    action: 'PROMOTE' | 'STAY' | 'GRADUATE';
    target_class_id?: number;
}

export interface PromotionRequest {
    source_academic_year_id: number;
    target_academic_year_id: number;
    promotions: PromotionItem[];
}

export interface PromotionResult {
    promoted:  number;
    stayed:    number;
    graduated: number;
    skipped:   number;
}

const buildQuery = (filters?: StudentFilters): string => {
    const params = new URLSearchParams();
    if (filters?.search)           params.set('search', filters.search);
    if (filters?.class_id)         params.set('class_id', String(filters.class_id));
    if (filters?.academic_year_id) params.set('academic_year_id', String(filters.academic_year_id));
    if (filters?.religion)         params.set('religion', filters.religion);
    if (filters?.page)             params.set('page', String(filters.page));
    if (filters?.per_page)         params.set('per_page', String(filters.per_page));
    const qs = params.toString();
    return qs ? `?${qs}` : '';
};

export const studentService = {
    // ── Dedicated student endpoints ──────────────────────────────────────────
    getStudents: (filters?: StudentFilters): Promise<PaginatedResponse<AdminStudent>> =>
        apiClient.getRaw<PaginatedResponse<AdminStudent>>(`/admin/students${buildQuery(filters)}`),

    getStudentById: (id: number): Promise<AdminStudent> =>
        apiClient.get<AdminStudent>(`/admin/students/${id}`),

    createStudent: (data: CreateStudentRequest): Promise<AdminStudent> =>
        apiClient.post<AdminStudent>('/admin/students', data),

    updateStudent: (id: number, data: UpdateStudentRequest): Promise<AdminStudent> =>
        apiClient.put<AdminStudent>(`/admin/students/${id}`, data),

    deleteStudent: (id: number): Promise<void> =>
        apiClient.delete(`/admin/students/${id}`),

    // ── Enrollment helpers ───────────────────────────────────────────────────
    getStudentsByClass: (classId: string | number): Promise<Enrollment[]> =>
        apiClient.get<Enrollment[]>(`/admin/enrollments?class_id=${classId}`),

    getUnenrolledStudents: (): Promise<UnenrolledStudent[]> =>
        apiClient.get<UnenrolledStudent[]>('/admin/students/unenrolled'),

    // ── Promotion ────────────────────────────────────────────────────────────
    promoteStudents: (payload: PromotionRequest): Promise<PromotionResult> =>
        apiClient.post<PromotionResult>('/admin/promotions', payload),
};

export default studentService;
