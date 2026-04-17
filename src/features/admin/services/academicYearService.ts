import { apiClient } from '@/lib/api-client';
import {
    AcademicYear,
    Semester,
    CreateAcademicYearRequest,
    UpdateAcademicYearRequest,
} from '../types/academicYear';

// Transform backend snake_case → frontend camelCase
const transformSemester = (s: Record<string, unknown>): Semester => ({
    id: String(s.id),
    name: s.name as string,
    code: (s.code as string) ?? (s.name === 'Semester 1 (Ganjil)' ? '1' : '2'),
    startDate: s.start_date as string,
    endDate: s.end_date as string,
    isActive: (s.is_active as boolean) ?? false,
    createdAt: (s.created_at as string) ?? '',
    updatedAt: (s.updated_at as string) ?? '',
});

const transformYear = (y: Record<string, unknown>): AcademicYear => ({
    id: String(y.id),
    name: y.name as string,
    startDate: y.start_date as string,
    endDate: y.end_date as string,
    isActive: (y.is_active as boolean) ?? false,
    semesters: Array.isArray(y.semesters) ? (y.semesters as Record<string, unknown>[]).map(transformSemester) : [],
    createdAt: (y.created_at as string) ?? '',
    updatedAt: (y.updated_at as string) ?? '',
});

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
    const data = await apiClient.get<Record<string, unknown>[]>('/admin/academic-years');
    return Array.isArray(data) ? data.map(transformYear) : [];
};

export const getAcademicYearById = async (id: string): Promise<AcademicYear> => {
    const data = await apiClient.get<Record<string, unknown>>(`/admin/academic-years/${id}`);
    return transformYear(data);
};

export const createAcademicYear = async (data: CreateAcademicYearRequest): Promise<AcademicYear> => {
    const res = await apiClient.post<Record<string, unknown>>('/admin/academic-years', {
        name: data.name,
        start_date: data.startDate,
        end_date: data.endDate,
    });
    return transformYear(res);
};

export const updateAcademicYear = async (id: string, data: UpdateAcademicYearRequest): Promise<AcademicYear> => {
    const res = await apiClient.put<Record<string, unknown>>(`/admin/academic-years/${id}`, {
        name: data.name,
        start_date: data.startDate,
        end_date: data.endDate,
    });
    return transformYear(res);
};

export const deleteAcademicYear = (id: string): Promise<void> =>
    apiClient.delete(`/admin/academic-years/${id}`);

export const activateAcademicYear = async (id: string): Promise<AcademicYear> => {
    const res = await apiClient.post<Record<string, unknown>>(`/admin/academic-years/${id}/activate`, {});
    return transformYear(res);
};

export const activateSemester = async (yearId: string, semesterId: string): Promise<AcademicYear> => {
    const res = await apiClient.post<Record<string, unknown>>(`/admin/academic-years/${yearId}/semesters/${semesterId}/activate`, {});
    return transformYear(res);
};

export const updateSemester = async (yearId: string, semesterId: string, startDate: string, endDate: string): Promise<AcademicYear> => {
    const res = await apiClient.put<Record<string, unknown>>(`/admin/academic-years/${yearId}/semesters/${semesterId}`, {
        start_date: startDate,
        end_date: endDate,
    });
    return transformYear(res);
};

export const getActiveAcademicYear = async (): Promise<AcademicYear | null> => {
    try {
        const data = await apiClient.get<Record<string, unknown>>('/academic-years/active');
        return data ? transformYear(data) : null;
    } catch {
        return null;
    }
};

export const academicYearService = {
    getAcademicYears,
    getAcademicYearById,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
    activateAcademicYear,
    activateSemester,
    updateSemester,
    getActiveAcademicYear,
};

export default academicYearService;
