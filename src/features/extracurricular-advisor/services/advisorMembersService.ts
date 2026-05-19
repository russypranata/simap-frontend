// Members Service for Extracurricular Advisor

import { apiClient } from '@/lib/api-client';

// ==================== TYPES ====================

export interface AdvisorMember {
    id: number;
    nis: string;
    name: string;
    class: string;
    joinDate: string;
    attendance: number;
    status: 'Aktif' | 'Nonaktif';
    inactiveDate?: string;
    inactiveReason?: string;
}

export interface MembersListResponse {
    data: AdvisorMember[];
    meta: { currentPage: number; totalPages: number; totalItems: number };
}

export interface GetMembersParams {
    academicYear?: string;
    class?: string;
    search?: string;
    page?: number;
    limit?: number;
    semester?: string;
    status?: string;
}

export interface AddMemberRequest {
    nis: string;
    join_date: string;
}

// ==================== NORMALIZATION ====================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeMember = (d: Record<string, any>): AdvisorMember => ({
    id: d.id,
    nis: d.nis,
    name: d.name,
    class: d.class ?? d.class_name ?? d.kelas ?? '',
    joinDate: d.join_date ?? d.joinDate ?? '',
    attendance: d.attendance ?? d.attendance_percentage ?? 0,
    status: d.status,
    inactiveDate: d.inactive_date ?? d.inactiveDate,
    inactiveReason: d.inactive_reason ?? d.inactiveReason,
});

// ==================== SERVICE FUNCTIONS ====================

export const getMembers = async (
    params: GetMembersParams = {},
): Promise<MembersListResponse> => {
    const {
        academicYear = '2025/2026',
        class: classFilter,
        search,
        page = 1,
        limit = 10,
        semester,
        status = 'Aktif',
    } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        academic_year: academicYear,
        ...(semester && semester !== 'all' && { semester }),
        ...(search && { search }),
        ...(classFilter && classFilter !== 'all' && { class: classFilter }),
        ...(status && status !== 'all' && { status }),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await apiClient.get<any>(
        `/extracurricular-advisor/members?${queryParams.toString()}`,
    );

    // apiClient.get unwraps data.data, so result is the array. Meta is in response._meta or we extract from headers.
    const items = Array.isArray(result) ? result : (result.data ?? []);
    const rawMeta = (result as any)._meta ?? (result as any).meta ?? {};
    return {
        data: (items as any[]).map(normalizeMember),
        meta: {
            currentPage: rawMeta.current_page ?? rawMeta.currentPage ?? page,
            totalPages: rawMeta.last_page ?? rawMeta.totalPages ?? 1,
            totalItems: rawMeta.total ?? rawMeta.totalItems ?? items.length,
        },
    };
};

export const getMemberDetail = async (id: number): Promise<AdvisorMember> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await apiClient.get<any>(
        `/extracurricular-advisor/members/${id}`,
    );
    return normalizeMember(result as Record<string, any>);
};

export const addMember = async (memberData: AddMemberRequest) => {
    return apiClient.post('/extracurricular-advisor/members', memberData);
};

export const deleteMember = async (memberId: number) => {
    return apiClient.delete(`/extracurricular-advisor/members/${memberId}`);
};
