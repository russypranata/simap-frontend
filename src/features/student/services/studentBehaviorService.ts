import { STUDENT_API_URL, getAuthHeaders, handleApiError } from './studentApiClient';

export interface ViolationRecord {
    id: number;
    date: string;
    time: string;
    location: 'sekolah' | 'asrama';
    problem: string;
    followUp: string;
    reporterName: string;
    reporterGender: 'L' | 'P';
    academicYearId: string;
}

export const getStudentBehaviorData = async (academicYearId?: string): Promise<{ records: ViolationRecord[] }> => {
    const params = new URLSearchParams();
    if (academicYearId && academicYearId !== 'all') params.append('academic_year_id', academicYearId);

    const response = await fetch(`${STUDENT_API_URL}/behavior?${params}`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: ViolationRecord[] = (result.data ?? []).map((item: Record<string, any>) => ({
        id:             item.id,
        date:           item.date     ?? '',
        time:           item.time     ?? '',
        location:       item.location ?? 'sekolah',
        problem:        item.problem  ?? '',
        followUp:       item.followUp ?? item.follow_up ?? '',
        reporterName:   item.reportedBy ?? item.reported_by ?? '',
        reporterGender: 'L' as const,
        academicYearId: item.academicYear?.name ?? academicYearId ?? '',
    }));

    return { records };
};
