import { STUDENT_API_URL, getAuthHeaders, handleApiError } from './studentApiClient';

export interface SubjectGrade {
    id: number;
    subject: string;
    teacher: string;
    kkm: number;
    ki3Average: number | null;
    ki3Predicate: string | null;
    ki3Scores: number[];
    ki4Average: number | null;
    ki4Predicate: string | null;
    ki4Scores: number[];
    finalAverage: number | null;
    finalGrade: string | null;
}

export interface GradesResponse {
    grades: SubjectGrade[];
    rank: number;
    totalStudents: number;
}

export interface TrendItem {
    academicYear: string;
    semester: string;
    averageScore: number;
    rank: number;
    totalStudents: number;
}

export interface AttitudeData {
    spiritual: { score: string; predicate: string; description: string };
    social: { score: string; predicate: string; description: string };
}

export interface ReportCardNoteItem {
    category: string;
    note: string;
    icon: string;
}

export const getStudentGrades = async (semesterId?: string): Promise<GradesResponse> => {
    const params = new URLSearchParams();
    if (semesterId && semesterId !== 'all') params.append('semester_id', semesterId);

    const response = await fetch(`${STUDENT_API_URL}/grades?${params}`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    const raw = result.data ?? {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grades: SubjectGrade[] = (raw.grades ?? []).map((item: Record<string, any>): SubjectGrade => ({
        id:           item.id,
        subject:      item.subject      ?? '',
        teacher:      item.teacher      ?? '-',
        kkm:          item.kkm          ?? 75,
        ki3Average:   item.ki3Average   ?? item.ki3_average   ?? null,
        ki3Predicate: item.ki3Predicate ?? item.ki3_predicate ?? null,
        ki3Scores:    item.ki3Scores    ?? item.ki3_scores    ?? [],
        ki4Average:   item.ki4Average   ?? item.ki4_average   ?? null,
        ki4Predicate: item.ki4Predicate ?? item.ki4_predicate ?? null,
        ki4Scores:    item.ki4Scores    ?? item.ki4_scores    ?? [],
        finalAverage: item.finalAverage ?? item.final_average ?? null,
        finalGrade:   item.finalGrade   ?? item.final_grade   ?? null,
    }));

    return {
        grades,
        rank: raw.rank ?? 0,
        totalStudents: raw.totalStudents ?? raw.total_students ?? 0,
    };
};

export const getStudentGradeTrend = async (): Promise<TrendItem[]> => {
    const response = await fetch(`${STUDENT_API_URL}/grades/trend`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>): TrendItem => ({
        academicYear:  item.academicYear  ?? item.academic_year  ?? '',
        semester:      item.semester      ?? '',
        averageScore:  item.averageScore  ?? item.average_score  ?? 0,
        rank:          item.rank          ?? 0,
        totalStudents: item.totalStudents ?? item.total_students ?? 0,
    }));
};

export const getStudentAttitude = async (academicYearId?: string, semester?: string): Promise<AttitudeData> => {
    const params = new URLSearchParams();
    if (academicYearId) params.append('academic_year_id', academicYearId);
    if (semester) params.append('semester', semester);

    const response = await fetch(`${STUDENT_API_URL}/grades/attitude?${params}`, { headers: getAuthHeaders() });
    if (!response.ok) return {
        spiritual: { score: 'B', predicate: 'Baik', description: 'Siswa menunjukkan sikap spiritual yang baik.' },
        social:    { score: 'B', predicate: 'Baik', description: 'Siswa menunjukkan sikap sosial yang positif.' },
    };
    const result = await response.json();
    const d = result.data ?? {};
    return {
        spiritual: {
            score:       d.spiritual?.score       ?? 'B',
            predicate:   d.spiritual?.predicate   ?? 'Baik',
            description: d.spiritual?.description ?? '-',
        },
        social: {
            score:       d.social?.score       ?? 'B',
            predicate:   d.social?.predicate   ?? 'Baik',
            description: d.social?.description ?? '-',
        },
    };
};

export const getStudentReportCardNotes = async (academicYearId?: string, semester?: string): Promise<ReportCardNoteItem[]> => {
    const params = new URLSearchParams();
    if (academicYearId) params.append('academic_year_id', academicYearId);
    if (semester) params.append('semester', semester);

    const response = await fetch(`${STUDENT_API_URL}/grades/report-card-notes?${params}`, { headers: getAuthHeaders() });
    if (!response.ok) return [];
    const result = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>): ReportCardNoteItem => ({
        category: item.category ?? '',
        note:     item.note     ?? '',
        icon:     item.icon     ?? '📝',
    }));
};
