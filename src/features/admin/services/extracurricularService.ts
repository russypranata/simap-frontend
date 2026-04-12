import { apiClient } from '@/lib/api-client';
import {
    Extracurricular,
    ExtracurricularMember,
    CreateExtracurricularRequest,
    UpdateExtracurricularRequest,
    AddMemberRequest,
} from '../types/extracurricular';

export const extracurricularService = {
    getAll: (): Promise<Extracurricular[]> =>
        apiClient.get<Extracurricular[]>('/admin/extracurriculars'),

    getById: (id: string | number): Promise<{ extracurricular: Extracurricular; members: ExtracurricularMember[] }> =>
        apiClient.get(`/admin/extracurriculars/${id}`),

    create: (data: CreateExtracurricularRequest): Promise<Extracurricular> =>
        apiClient.post<Extracurricular>('/admin/extracurriculars', {
            tutor_user_id: data.tutor_id,
            name: data.name,
            nip: data.nip,
            join_date: data.join_date,
        }),

    update: (id: string | number, data: UpdateExtracurricularRequest): Promise<Extracurricular> =>
        apiClient.put<Extracurricular>(`/admin/extracurriculars/${id}`, data),

    delete: (id: string | number): Promise<void> =>
        apiClient.delete(`/admin/extracurriculars/${id}`),

    addMember: (id: string | number, data: AddMemberRequest): Promise<ExtracurricularMember> =>
        apiClient.post<ExtracurricularMember>(`/admin/extracurriculars/${id}/members`, data),

    removeMember: (id: string | number, membershipId: string | number): Promise<void> =>
        apiClient.delete(`/admin/extracurriculars/${id}/members/${membershipId}`),

    getTutors: (): Promise<{ id: number; name: string; extracurricular: string }[]> =>
        apiClient.get('/admin/tutors'),
};

export default extracurricularService;
