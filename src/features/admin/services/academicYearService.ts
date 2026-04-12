import { apiClient } from '@/lib/api-client';
import {
    AcademicYear,
    Semester,
    CreateAcademicYearRequest,
    UpdateAcademicYearRequest,
} from '../types/academicYear';

// Transform backend snake_case → frontend camelCase
const transformSemester = (s: any): Semester => ({
    id: String(s.id),
    name: s.name,
    code: s.code ?? (s.name === 'Semester 1 (Ganjil)' ? '1' : '2'),
    startDate: s.start_date,
    endDate: s.end_date,
    isActive: s.is_active ?? false,
    createdAt: s.created_at ?? '',
    updatedAt: s.updated_at ?? '',
});

const transformYear = (y: any): AcademicYear => ({
    id: String(y.id),
    name: y.name,
    startDate: y.start_date,
    endDate: y.end_date,
    isActive: y.is_active ?? false,
    semesters: Array.isArray(y.semesters) ? y.semesters.map(transformSemester) : [],
    createdAt: y.created_at ?? '',
    updatedAt: y.updated_at ?? '',
});

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
    const data = await apiClient.get<any[]>('/admin/academic-years');
    return Array.isArray(data) ? data.map(transformYear) : [];
};

export const getAcademicYearById = async (id: string): Promise<AcademicYear> => {
    const data = await apiClient.get<any>(`/admin/academic-years/${id}`);
    return transformYear(data);
};

export const createAcademicYear = async (data: CreateAcademicYearRequest): Promise<AcademicYear> => {
    const res = await apiClient.post<any>('/admin/academic-years', {
        name: data.name,
        start_date: data.startDate,
        end_date: data.endDate,
    });
    return transformYear(res);
};

export const updateAcademicYear = async (id: string, data: UpdateAcademicYearRequest): Promise<AcademicYear> => {
    const res = await apiClient.put<any>(`/admin/academic-years/${id}`, {
        name: data.name,
        start_date: data.startDate,
        end_date: data.endDate,
    });
    return transformYear(res);
};

export const deleteAcademicYear = (id: string): Promise<void> =>
    apiClient.delete(`/admin/academic-years/${id}`);

export const activateAcademicYear = async (id: string): Promise<AcademicYear> => {
    const res = await apiClient.post<any>(`/admin/academic-years/${id}/activate`, {});
    return transformYear(res);
};

export const activateSemester = async (yearId: string, semesterId: string): Promise<AcademicYear> => {
    const res = await apiClient.post<any>(`/admin/academic-years/${yearId}/semesters/${semesterId}/activate`, {});
    return transformYear(res);
};

export const updateSemester = async (yearId: string, semesterId: string, startDate: string, endDate: string): Promise<AcademicYear> => {
    const res = await apiClient.put<any>(`/admin/academic-years/${yearId}/semesters/${semesterId}`, {
        start_date: startDate,
        end_date: endDate,
    });
    return transformYear(res);
};

export const getActiveAcademicYear = async (): Promise<AcademicYear | null> => {
    try {
        const data = await apiClient.get<any>('/academic-years/active');
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
