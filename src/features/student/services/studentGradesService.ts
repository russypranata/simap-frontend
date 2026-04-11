import { STUDENT_API_URL, getAuthHeaders, handleApiError } from './studentApiClient';

export interface SubjectGrade {
    id: number;
    subject: string;
    teacher: string;
    kkm: number;
    ki3Average: number | null;
    ki3Predicate: string | null;
    ki4Average: number | null;
    ki4Predicate: string | null;
    finalAverage: number | null;
    finalGrade: string | null;
}

export const getStudentGrades = async (academicYearId?: string): Promise<SubjectGrade[]> => {
    const params = new URLSearchParams();
    if (academicYearId && academicYearId !== 'all') params.append('academic_year_id', academicYearId);

    const response = await fetch(`${STUDENT_API_URL}/grades?${params}`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>): SubjectGrade => ({
        id:           item.id,
        subject:      item.subject      ?? '',
        teacher:      item.teacher      ?? '-',
        kkm:          item.kkm          ?? 75,
        ki3Average:   item.ki3Average   ?? item.ki3_average   ?? null,
        ki3Predicate: item.ki3Predicate ?? item.ki3_predicate ?? null,
        ki4Average:   item.ki4Average   ?? item.ki4_average   ?? null,
        ki4Predicate: item.ki4Predicate ?? item.ki4_predicate ?? null,
        finalAverage: item.finalAverage ?? item.final_average ?? null,
        finalGrade:   item.finalGrade   ?? item.final_grade   ?? null,
    }));
};
