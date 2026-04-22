import { apiClient } from '@/lib/api-client';

export interface SubmissionStats {
    total: number;
    submitted: number;
    graded: number;
}

export interface Assignment {
    id: number;
    title: string;
    description?: string | null;
    dueDate?: string | null;
    order: number;
    submissionStats: SubmissionStats;
}

export interface SubmissionMember {
    membershipId: number;
    studentProfileId: number;
    nis: string;
    name: string;
    class: string;
    submissionId?: number;
    score: number | null;
    status: 'belum' | 'dikumpulkan' | 'dinilai';
    note?: string | null;
    submittedAt?: string | null;
}

export interface AssignmentDetail {
    assignment: Pick<Assignment, 'id' | 'title' | 'description' | 'dueDate'>;
    submissions: SubmissionMember[];
}

export interface CreateAssignmentRequest {
    title: string;
    description?: string;
    due_date?: string;
    order?: number;
}

export interface SaveSubmissionItem {
    membership_id: number;
    score?: number | null;
    status: 'belum' | 'dikumpulkan' | 'dinilai';
    note?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeAssignment = (d: Record<string, any>): Assignment => ({
    id: d.id,
    title: d.title,
    description: d.description ?? null,
    dueDate: d.due_date ?? null,
    order: d.order ?? 0,
    submissionStats: {
        total: d.submission_stats?.total ?? 0,
        submitted: d.submission_stats?.submitted ?? 0,
        graded: d.submission_stats?.graded ?? 0,
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeSubmissionMember = (d: Record<string, any>): SubmissionMember => ({
    membershipId: d.membership_id,
    studentProfileId: d.student_profile_id,
    nis: d.nis ?? '',
    name: d.name ?? '',
    class: d.class ?? '-',
    submissionId: d.submission_id ?? undefined,
    score: d.score ?? null,
    status: d.status ?? 'belum',
    note: d.note ?? null,
    submittedAt: d.submitted_at ?? null,
});

export interface RecapMember {
    membershipId: number;
    studentProfileId: number;
    nis: string;
    name: string;
    class: string;
    scores: Record<number, { score: number | null; status: 'belum' | 'dikumpulkan' | 'dinilai' }>;
    average: number | null;
}

export interface AssignmentRecap {
    assignments: Array<{ id: number; title: string; order: number }>;
    members: RecapMember[];
}

export const advisorAssignmentService = {
    getAssignments: async (params?: { academic_year_id?: number }): Promise<Assignment[]> => {
        const qs = params?.academic_year_id ? `?academic_year_id=${params.academic_year_id}` : '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.get<any[]>(`/extracurricular-advisor/assignments${qs}`);
        return (res ?? []).map(normalizeAssignment);
    },

    createAssignment: async (data: CreateAssignmentRequest): Promise<Assignment> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.post<any>('/extracurricular-advisor/assignments', data);
        return normalizeAssignment(res);
    },

    updateAssignment: async (id: number, data: CreateAssignmentRequest): Promise<Assignment> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.put<any>(`/extracurricular-advisor/assignments/${id}`, data);
        return normalizeAssignment(res);
    },

    deleteAssignment: (id: number): Promise<void> =>
        apiClient.delete(`/extracurricular-advisor/assignments/${id}`),

    getSubmissions: async (assignmentId: number): Promise<AssignmentDetail> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.get<any>(`/extracurricular-advisor/assignments/${assignmentId}/submissions`);
        return {
            assignment: {
                id: res.assignment?.id,
                title: res.assignment?.title,
                description: res.assignment?.description ?? null,
                dueDate: res.assignment?.due_date ?? null,
            },
            submissions: (res.submissions ?? []).map(normalizeSubmissionMember),
        };
    },

    saveSubmissions: (assignmentId: number, submissions: SaveSubmissionItem[]): Promise<{ saved: number }> =>
        apiClient.post(`/extracurricular-advisor/assignments/${assignmentId}/submissions`, { submissions }),

    getRecap: async (): Promise<AssignmentRecap> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.get<any>('/extracurricular-advisor/assignments-recap');
        return {
            assignments: res.assignments ?? [],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            members: (res.members ?? []).map((m: Record<string, any>) => ({
                membershipId: m.membership_id,
                studentProfileId: m.student_profile_id,
                nis: m.nis ?? '',
                name: m.name ?? '',
                class: m.class ?? '-',
                scores: m.scores ?? {},
                average: m.average ?? null,
            })),
        };
    },
};
