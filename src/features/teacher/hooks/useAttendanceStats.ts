/**
 * Hook untuk tab Statistik Presensi dengan React Query caching.
 *
 * Cache strategy:
 * - classSubjects: staleTime 10 menit, gcTime 30 menit (jarang berubah)
 * - allAttendance: staleTime 5 menit, gcTime 15 menit (bisa berubah saat guru input)
 * - studentCounts: staleTime 10 menit, gcTime 30 menit
 */
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTeacherAttendance } from '../services/teacherAttendanceService';
import { getTeacherClassSubjects } from '../services/teacherGradeService';
import { getAuthHeaders, TEACHER_API_URL } from '../services/teacherApiClient';

export interface AttendanceStatRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  classId: string;
  subject: string;
  date: string;
  status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan';
  academicYear: string;
  semester: string;
}

export interface ClassOption {
  id: string;
  name: string;
  studentCount: number;
}

export interface SubjectOption {
  id: string;
  name: string;
  classId: string;
  className: string;
}

// ─── Query Keys ────────────────────────────────────────────────────────────────
export const attendanceStatsKeys = {
  all:           ['teacher', 'attendance', 'all'] as const,
  classSubjects: ['teacher', 'attendance', 'classSubjects'] as const,
  classes:       ['teacher', 'attendance', 'classes'] as const,
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export const useAttendanceStats = () => {
  const queryClient = useQueryClient();

  // 1. Fetch all attendance records (no date filter)
  const {
    data: allRecords = [],
    isLoading: isLoadingRecords,
    isFetching: isFetchingRecords,
  } = useQuery({
    queryKey: attendanceStatsKeys.all,
    queryFn: async (): Promise<AttendanceStatRecord[]> => {
      const data = await getTeacherAttendance();
      return data.map(a => ({
        id:           a.id,
        studentId:    a.studentId,
        studentName:  a.studentName,
        class:        a.class,
        classId:      a.classId,
        subject:      a.subject,
        date:         a.date,
        status:       a.status,
        academicYear: a.academicYear ?? '2025/2026',
        semester:     a.semester ?? 'Ganjil',
      }));
    },
    staleTime: 5 * 60 * 1000,   // 5 menit — data presensi bisa berubah
    gcTime:    15 * 60 * 1000,  // 15 menit di cache setelah tidak dipakai
    refetchOnWindowFocus: false,
  });

  // 2. Fetch class subjects for dropdowns
  const {
    data: classSubjectsRaw = [],
    isLoading: isLoadingCS,
  } = useQuery({
    queryKey: attendanceStatsKeys.classSubjects,
    queryFn: () => getTeacherClassSubjects(),
    staleTime: 10 * 60 * 1000,  // 10 menit — jarang berubah
    gcTime:    30 * 60 * 1000,  // 30 menit
    refetchOnWindowFocus: false,
  });

  // 3. Fetch student counts per class
  const { data: apiClassesRaw = [] } = useQuery({
    queryKey: attendanceStatsKeys.classes,
    queryFn: async (): Promise<Array<{ id: string; studentCount: number }>> => {
      const response = await fetch(`${TEACHER_API_URL}/classes`, { headers: getAuthHeaders() });
      if (!response.ok) return [];
      const result = await response.json();
      return (result.data ?? []).map((c: { id: string | number; studentCount?: number }) => ({
        id: String(c.id),
        studentCount: c.studentCount ?? 0,
      }));
    },
    staleTime: 10 * 60 * 1000,
    gcTime:    30 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: classSubjectsRaw.length > 0, // only fetch after class subjects loaded
  });

  // ─── Derived data ────────────────────────────────────────────────────────────

  // Build unique classes list with student counts
  const classes: ClassOption[] = (() => {
    const classMap = new Map<string, ClassOption>();
    classSubjectsRaw.forEach(cs => {
      if (!classMap.has(cs.classId)) {
        const apiClass = apiClassesRaw.find(ac => ac.id === cs.classId);
        classMap.set(cs.classId, {
          id: cs.classId,
          name: cs.className,
          studentCount: apiClass?.studentCount ?? 0,
        });
      }
    });
    return Array.from(classMap.values());
  })();

  // Build subjects list
  const subjects: SubjectOption[] = classSubjectsRaw.map(cs => ({
    id: cs.subjectId,
    name: cs.subject,
    classId: cs.classId,
    className: cs.className,
  }));

  // Get unique subjects for a class (deduplicated by name)
  const getSubjectsForClass = useCallback((classId: string): SubjectOption[] => {
    const list = classId ? subjects.filter(s => s.classId === classId) : subjects;
    // Deduplicate by name
    const seen = new Set<string>();
    return list.filter(s => {
      if (seen.has(s.name)) return false;
      seen.add(s.name);
      return true;
    });
  }, [subjects]); // eslint-disable-line react-hooks/exhaustive-deps

  // Invalidate & refetch
  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: attendanceStatsKeys.all });
  }, [queryClient]);

  const isLoading = isLoadingRecords || isLoadingCS;
  const isFetching = isFetchingRecords;

  return {
    allRecords,
    classes,
    subjects,
    isLoading,
    isFetching,
    getSubjectsForClass,
    refresh,
  };
};
