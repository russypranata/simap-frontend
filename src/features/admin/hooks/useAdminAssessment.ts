import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminAssessmentService } from '../services/adminAssessmentService';
import { CreateAssessmentPayload } from '../types/assessment';

// ─── Query Keys ───────────────────────────────────────────────────────────────
const KEYS = {
    classSubjects: (f: object) => ['admin-assessment-class-subjects', f] as const,
    assessments:   (csId: number) => ['admin-assessments', csId] as const,
    grades:        (aId: number)  => ['admin-assessment-grades', aId] as const,
    reportCard:    (f: object)    => ['admin-report-card-summary', f] as const,
};

// ─── Hook: Daftar Class-Subject + Progress Nilai ──────────────────────────────
export function useAssessmentClassSubjects(filters?: {
    academic_year_id?: number;
    class_id?: number;
    search?: string;
    page?: number;
    per_page?: number;
}) {
    return useQuery({
        queryKey:  KEYS.classSubjects(filters ?? {}),
        queryFn:   () => adminAssessmentService.getClassSubjects(filters),
        staleTime: 0,
        placeholderData: (prev) => prev,
    });
}

// ─── Hook: Daftar Komponen Penilaian (per class-subject) ─────────────────────
export function useAssessments(classSubjectId: number | null) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey:  KEYS.assessments(classSubjectId ?? 0),
        queryFn:   () => adminAssessmentService.getAssessments(classSubjectId!),
        enabled:   !!classSubjectId,
        staleTime: 0,
    });

    const createMutation = useMutation({
        mutationFn: (payload: CreateAssessmentPayload) =>
            adminAssessmentService.createAssessment(payload),
        onSuccess: () => {
            if (classSubjectId) {
                queryClient.invalidateQueries({ queryKey: KEYS.assessments(classSubjectId) });
                queryClient.invalidateQueries({ queryKey: ['admin-assessment-class-subjects'] });
            }
            toast.success('Komponen penilaian berhasil ditambahkan');
        },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menambahkan komponen penilaian'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => adminAssessmentService.deleteAssessment(id),
        onSuccess: () => {
            if (classSubjectId) {
                queryClient.invalidateQueries({ queryKey: KEYS.assessments(classSubjectId) });
            }
            toast.success('Komponen penilaian berhasil dihapus');
        },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menghapus komponen penilaian'),
    });

    return {
        assessments:     query.data ?? [],
        isLoading:       query.isLoading,
        isError:         query.isError,
        createAssessment: createMutation.mutateAsync,
        deleteAssessment: deleteMutation.mutate,
        isCreating:      createMutation.isPending,
        isDeleting:      deleteMutation.isPending,
    };
}

// ─── Hook: Input Nilai per Siswa ─────────────────────────────────────────────
export function useAssessmentGrades(assessmentId: number | null) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey:  KEYS.grades(assessmentId ?? 0),
        queryFn:   () => adminAssessmentService.getGrades(assessmentId!),
        enabled:   !!assessmentId,
        staleTime: 0,
    });

    const saveMutation = useMutation({
        mutationFn: (grades: Array<{ student_id: number; score: number | null }>) =>
            adminAssessmentService.saveGrades(assessmentId!, grades),
        onSuccess: () => {
            if (assessmentId) {
                queryClient.invalidateQueries({ queryKey: KEYS.grades(assessmentId) });
                queryClient.invalidateQueries({ queryKey: ['admin-assessment-class-subjects'] });
            }
            toast.success('Nilai berhasil disimpan');
        },
        onError: (e: Error) => toast.error(e?.message ?? 'Gagal menyimpan nilai'),
    });

    return {
        detail:     query.data ?? null,
        assessment: query.data?.assessment ?? null,
        grades:     query.data?.grades ?? [],
        isLoading:  query.isLoading,
        isError:    query.isError,
        saveGrades: saveMutation.mutateAsync,
        isSaving:   saveMutation.isPending,
    };
}

// ─── Hook: Report Card Summary ────────────────────────────────────────────────
export function useReportCardSummary(filters?: {
    academic_year_id?: number;
    semester_id?: number;
}) {
    return useQuery({
        queryKey:  KEYS.reportCard(filters ?? {}),
        queryFn:   () => adminAssessmentService.getReportCardSummary(filters),
        staleTime: 0,
        placeholderData: (prev) => prev,
    });
}
