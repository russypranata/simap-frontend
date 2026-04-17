'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { classService } from '../services/classService';
import { enrollmentService } from '../services/enrollmentService';
import { academicYearService } from '../services/academicYearService';
import type { BulkEnrollmentRequest } from '../types/enrollment';

// ─────────────────────────────────────────────
// Query Keys
// ─────────────────────────────────────────────

export const CLASS_MGMT_KEYS = {
    classes:      (yearId?: string | number) => ['admin-classes', yearId ?? 'all'] as const,
    teachers:     ()                          => ['admin-teachers'] as const,
    unenrolled:   ()                          => ['admin-unenrolled-students'] as const,
    academicYears: ()                         => ['admin-academic-years-list'] as const,
};

// ─────────────────────────────────────────────
// Academic Years (for dropdowns)
// ─────────────────────────────────────────────

export const useAcademicYearsList = () =>
    useQuery({
        queryKey: CLASS_MGMT_KEYS.academicYears(),
        queryFn:  () => academicYearService.getAcademicYears(),
        staleTime: 10 * 60 * 1000,
    });

// ─────────────────────────────────────────────
// Classes
// ─────────────────────────────────────────────

export const useClassList = (yearId?: string | number) =>
    useQuery({
        queryKey: CLASS_MGMT_KEYS.classes(yearId),
        queryFn:  () => classService.getClasses(yearId ? { academic_year_id: yearId } : undefined),
        staleTime: 0,
        enabled:  !!yearId,
    });

// Alias — same query, used in HomeroomList for clarity
export const useHomeroomList = (yearId?: string | number) =>
    useQuery({
        queryKey: CLASS_MGMT_KEYS.classes(yearId),
        queryFn:  () => classService.getClasses(yearId ? { academic_year_id: yearId } : undefined),
        staleTime: 0,
        enabled:  !!yearId,
    });

// ─────────────────────────────────────────────
// Teachers (for homeroom dropdown)
// ─────────────────────────────────────────────

export const useTeachers = () =>
    useQuery({
        queryKey: CLASS_MGMT_KEYS.teachers(),
        queryFn:  () => classService.getTeachers(),
        staleTime: 10 * 60 * 1000,
    });

// ─────────────────────────────────────────────
// Assign Homeroom Teacher
// ─────────────────────────────────────────────

export const useAssignHomeroom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            classId,
            teacherId,
        }: {
            classId: number;
            teacherId: number | null;
        }) =>
            classService.updateClass(classId, {
                homeroom_teacher_id: teacherId ?? undefined,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
            toast.success('Wali kelas berhasil diperbarui');
        },
        onError: () => {
            toast.error('Gagal memperbarui wali kelas');
        },
    });
};

// ─────────────────────────────────────────────
// Placement — Unenrolled Students + Classes
// ─────────────────────────────────────────────

export const usePlacementData = (yearId?: string | number) => {
    const unenrolledQuery = useQuery({
        queryKey: CLASS_MGMT_KEYS.unenrolled(),
        queryFn:  () => enrollmentService.getUnenrolledStudents(),
        staleTime: 0,
    });

    const classesQuery = useQuery({
        queryKey: CLASS_MGMT_KEYS.classes(yearId),
        queryFn:  () => classService.getClasses(yearId ? { academic_year_id: yearId } : undefined),
        staleTime: 0,
        enabled:  !!yearId,
    });

    return {
        unenrolledStudents: unenrolledQuery.data ?? [],
        classes:            classesQuery.data ?? [],
        isLoading:          unenrolledQuery.isLoading || classesQuery.isLoading,
        isError:            unenrolledQuery.isError || classesQuery.isError,
        refetch: () => {
            unenrolledQuery.refetch();
            classesQuery.refetch();
        },
    };
};

// ─────────────────────────────────────────────
// Bulk Enroll
// ─────────────────────────────────────────────

export const useBulkEnroll = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: BulkEnrollmentRequest) => enrollmentService.bulkEnroll(data),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: CLASS_MGMT_KEYS.unenrolled() });
            queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
            const enrolled = result.enrolled?.length ?? 0;
            const skipped  = result.skipped?.length ?? 0;
            toast.success(
                `${enrolled} siswa berhasil ditempatkan${skipped > 0 ? `, ${skipped} dilewati (sudah terdaftar)` : ''}`
            );
        },
        onError: () => {
            toast.error('Gagal menempatkan siswa ke kelas');
        },
    });
};
