import { apiClient, PaginatedResponse } from '@/lib/api-client';
import {
    Extracurricular,
    ExtracurricularMember,
    CreateExtracurricularRequest,
    UpdateExtracurricularRequest,
    AddMemberRequest,
    ExtracurricularFilters,
    TutorOption,
    TransferTutorRequest,
} from '../types/extracurricular';

const buildQuery = (filters?: ExtracurricularFilters): string => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.per_page) params.set('per_page', String(filters.per_page));
    const qs = params.toString();
    return qs ? `?${qs}` : '';
};

export const extracurricularService = {
    // List dengan pagination
    getAll: (filters?: ExtracurricularFilters): Promise<PaginatedResponse<Extracurricular>> =>
        apiClient.getRaw<PaginatedResponse<Extracurricular>>(`/admin/extracurriculars${buildQuery(filters)}`),

    // Detail + members
    getById: (id: number): Promise<{ extracurricular: Extracurricular; members: ExtracurricularMember[] }> =>
        apiClient.get(`/admin/extracurriculars/${id}`),

    // CRUD
    create: (data: CreateExtracurricularRequest): Promise<Extracurricular> =>
        apiClient.post<Extracurricular>('/admin/extracurriculars', data),

    update: (id: number, data: UpdateExtracurricularRequest): Promise<Extracurricular> =>
        apiClient.put<Extracurricular>(`/admin/extracurriculars/${id}`, data),

    delete: (id: number): Promise<void> =>
        apiClient.delete(`/admin/extracurriculars/${id}`),

    // Members
    addMember: (id: number, data: AddMemberRequest): Promise<ExtracurricularMember> =>
        apiClient.post<ExtracurricularMember>(`/admin/extracurriculars/${id}/members`, data),

    removeMember: (id: number, membershipId: number): Promise<void> =>
        apiClient.delete(`/admin/extracurriculars/${id}/members/${membershipId}`),

    // Tutors dropdown
    getTutors: (): Promise<TutorOption[]> =>
        apiClient.get<TutorOption[]>('/admin/tutors'),

    // Transfer tutor
    transferTutor: (id: number, data: TransferTutorRequest): Promise<Extracurricular> =>
        apiClient.post<Extracurricular>(`/admin/extracurriculars/${id}/transfer-tutor`, data),
};

export default extracurricularService;
