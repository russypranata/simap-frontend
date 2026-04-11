import { STUDENT_API_URL, getAuthHeaders, handleApiError } from './studentApiClient';
import { getAcademicYears, type AcademicYearItem } from '@/features/parent/services/parentApiClient';

export interface LateRecord {
    id: number;
    date: string;
    day: string;
    time: string;
    notes?: string;
    location?: string;
    recordedBy?: string;
    academicYearId: string;
}

export type AcademicYear = AcademicYearItem & { semesters: { id: string; name: string; isActive: boolean; startDate: string; endDate: string }[] };

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const getStudentMorningTardiness = async (academicYearId?: string): Promise<LateRecord[]> => {
    const params = new URLSearchParams();
    if (academicYearId && academicYearId !== 'all') params.append('academic_year_id', academicYearId);

    const response = await fetch(`${STUDENT_API_URL}/attendance/morning?${params}`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>): LateRecord => ({
        id:            item.id,
        date:          item.date,
        day:           DAYS_ID[new Date(item.date).getDay()] ?? '',
        time:          item.time ?? '',
        notes:         item.notes ?? undefined,
        location:      item.location ?? undefined,
        recordedBy:    item.recordedBy ?? item.recorded_by ?? undefined,
        academicYearId: item.academicYear?.name ?? academicYearId ?? '',
    }));
};

export const getStudentAcademicYears = getAcademicYears;
