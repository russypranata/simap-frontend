import { apiClient, PaginatedResponse } from '@/lib/api-client';
import {
    AdminClassSubjectProgress,
    AdminAssessment,
    AssessmentGradeDetail,
    CreateAssessmentPayload,
    ReportCardSummaryItem,
} from '../types/assessment';

const buildQuery = (params: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== '' && v !== null) p.set(k, String(v));
    }
    const qs = p.toString();
    return qs ? `?${qs}` : '';
};

export const adminAssessmentService = {
    // ── Daftar class-subject dengan progress nilai ──────────────────────────
    getClassSubjects: async (params?: {
        academic_year_id?: number;
        class_id?: number;
        search?: string;
        page?: number;
        per_page?: number;
    }): Promise<PaginatedResponse<AdminClassSubjectProgress>> => {
        return apiClient.getRaw<PaginatedResponse<AdminClassSubjectProgress>>(
            `/admin/assessments/class-subjects${buildQuery(params ?? {})}`
        );
    },

    // ── Daftar assessment komponen per class-subject ─────────────────────────
    getAssessments: async (
        classSubjectId: number
    ): Promise<AdminAssessment[]> => {
        return apiClient.get<AdminAssessment[]>(
            `/admin/assessments?class_subject_id=${classSubjectId}`
        );
    },

    // ── Buat assessment baru ────────────────────────────────────────────────
    createAssessment: async (
        payload: CreateAssessmentPayload
    ): Promise<AdminAssessment> => {
        return apiClient.post<AdminAssessment>('/admin/assessments', payload);
    },

    // ── Hapus assessment ────────────────────────────────────────────────────
    deleteAssessment: async (id: number): Promise<void> => {
        return apiClient.delete(`/admin/assessments/${id}`);
    },

    // ── Ambil nilai per siswa untuk satu assessment ──────────────────────────
    getGrades: async (assessmentId: number): Promise<AssessmentGradeDetail> => {
        return apiClient.get<AssessmentGradeDetail>(
            `/admin/assessments/${assessmentId}/grades`
        );
    },

    // ── Simpan nilai (bulk upsert) ───────────────────────────────────────────
    saveGrades: async (
        assessmentId: number,
        grades: Array<{ student_id: number; score: number | null }>
    ): Promise<void> => {
        return apiClient.post(`/admin/assessments/${assessmentId}/grades`, {
            grades,
        });
    },

    // ── Ringkasan rapor per kelas ────────────────────────────────────────────
    getReportCardSummary: async (params?: {
        academic_year_id?: number;
        semester_id?: number;
    }): Promise<ReportCardSummaryItem[]> => {
        return apiClient.get<ReportCardSummaryItem[]>(
            `/admin/assessments/report-card-summary${buildQuery(params ?? {})}`
        );
    },
};
