import { apiClient, PaginatedResponse } from '@/lib/api-client';
import { Curriculum } from '../types/curriculum';
import { CurriculumFormValues } from '../schemas/curriculumSchema';

const buildQuery = (params?: { search?: string; status?: string; page?: number; per_page?: number }) => {
    const p = new URLSearchParams();
    if (params?.search)   p.set('search', params.search);
    if (params?.status)   p.set('status', params.status);
    if (params?.page)     p.set('page', String(params.page));
    if (params?.per_page) p.set('per_page', String(params.per_page));
    const qs = p.toString();
    return qs ? `?${qs}` : '';
};

// Map API response (snake_case) → frontend type (camelCase)
const transform = (d: Record<string, unknown>): Curriculum => ({
    id:               String(d.id),
    name:             d.name as string,
    code:             d.code as string,
    description:      (d.description as string) ?? '',
    academicYearId:   d.academic_year_id ? String(d.academic_year_id) : '',
    academicYearName: (d.academic_year_name as string) ?? '',
    status:           d.status as string,
    totalSubjects:    0, // not tracked in backend yet
    createdAt:        (d.created_at as string) ?? '',
    updatedAt:        (d.updated_at as string) ?? '',
});

export const curriculumService = {
    getAll: async (params?: Parameters<typeof buildQuery>[0]): Promise<PaginatedResponse<Curriculum>> => {
        const raw = await apiClient.getRaw<PaginatedResponse<Record<string, unknown>>>(`/admin/curricula${buildQuery(params)}`);
        return { ...raw, data: raw.data.map(transform) };
    },

    getById: async (id: string): Promise<Curriculum> => {
        const d = await apiClient.get<Record<string, unknown>>(`/admin/curricula/${id}`);
        return transform(d);
    },

    create: async (data: CurriculumFormValues): Promise<Curriculum> => {
        const d = await apiClient.post<Record<string, unknown>>('/admin/curricula', {
            name:             data.name,
            code:             data.code,
            description:      data.description || null,
            academic_year_id: data.academicYearId || null,
            status:           data.status,
        });
        return transform(d);
    },

    update: async (id: string, data: CurriculumFormValues): Promise<Curriculum> => {
        const d = await apiClient.put<Record<string, unknown>>(`/admin/curricula/${id}`, {
            name:             data.name,
            code:             data.code,
            description:      data.description || null,
            academic_year_id: data.academicYearId || null,
            status:           data.status,
        });
        return transform(d);
    },

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/admin/curricula/${id}`),
};
