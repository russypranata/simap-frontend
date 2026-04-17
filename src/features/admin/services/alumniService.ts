import { apiClient, PaginatedResponse } from '@/lib/api-client';
import { AdminAlumni, AlumniFilters } from '../types/alumni';

const buildQuery = (f?: AlumniFilters) => {
    const p = new URLSearchParams();
    if (f?.search)          p.set('search', f.search);
    if (f?.graduation_year) p.set('graduation_year', f.graduation_year);
    if (f?.page)            p.set('page', String(f.page));
    if (f?.per_page)        p.set('per_page', String(f.per_page));
    const qs = p.toString();
    return qs ? `?${qs}` : '';
};

export const alumniService = {
    getAlumni:   (f?: AlumniFilters): Promise<PaginatedResponse<AdminAlumni>> =>
        apiClient.getRaw<PaginatedResponse<AdminAlumni>>(`/admin/alumni${buildQuery(f)}`),
    getAlumniById:(id: number): Promise<AdminAlumni> =>
        apiClient.get<AdminAlumni>(`/admin/alumni/${id}`),
};
