import { apiClient } from '@/lib/api-client';

export interface AssessmentScore {
    id?: number;
    score: number;
    note?: string | null;
}

export interface AssessmentMember {
    membershipId: number;
    studentProfileId: number;
    nis: string;
    name: string;
    class: string;
    scores: Record<string, AssessmentScore>;
}

export interface AssessmentsResponse {
    aspects: string[];
    members: AssessmentMember[];
}

export interface SaveAssessmentItem {
    membership_id: number;
    aspect: string;
    score: number;
    note?: string | null;
}

export interface SaveAssessmentsRequest {
    academic_year_id?: number;
    assessments: SaveAssessmentItem[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeMember = (d: Record<string, any>): AssessmentMember => ({
    membershipId: d.membership_id,
    studentProfileId: d.student_profile_id,
    nis: d.nis ?? '',
    name: d.name ?? '',
    class: d.class ?? '-',
    scores: d.scores ?? {},
});

export const advisorAssessmentService = {
    getAssessments: async (params?: { academic_year_id?: number }): Promise<AssessmentsResponse> => {
        const qs = params?.academic_year_id ? `?academic_year_id=${params.academic_year_id}` : '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.get<any>(`/extracurricular-advisor/assessments${qs}`);
        return {
            aspects: res.aspects ?? [],
            members: (res.members ?? []).map(normalizeMember),
        };
    },

    saveAssessments: (data: SaveAssessmentsRequest): Promise<{ saved: number }> =>
        apiClient.post('/extracurricular-advisor/assessments', data),

    getMemberAssessment: async (membershipId: number): Promise<AssessmentMember> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.get<any>(`/extracurricular-advisor/assessments/${membershipId}`);
        return normalizeMember(res);
    },
};
