import { STUDENT_API_URL, getAuthHeaders, handleApiError } from './studentApiClient';

export type ExtracurricularStatus = 'hadir' | 'izin' | 'alpa';

export interface Extracurricular {
    id: number;
    name: string;
    category: string;
    schedule: string;
    time: string;
    location: string;
    advisor: string;
    members: number;
    status: 'active' | 'inactive';
    attendanceRate: number;
    joinDate: string;
    academicYearId: string;
    achievements?: string[];
}

export interface ExtracurricularAttendance {
    id: number;
    date: string;
    activity: string;
    status: ExtracurricularStatus;
    academicYearId: string;
}

const statusMap: Record<string, ExtracurricularStatus> = { hadir: 'hadir', izin: 'izin', alpa: 'alpa' };

export const getStudentExtracurricularData = async (
    academicYearId?: string
): Promise<{ extracurriculars: Extracurricular[]; recentAttendance: ExtracurricularAttendance[] }> => {
    const params = new URLSearchParams();
    if (academicYearId && academicYearId !== 'all') params.append('academic_year_id', academicYearId);

    const response = await fetch(`${STUDENT_API_URL}/extracurricular?${params}`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    const d = result.data ?? {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extracurriculars: Extracurricular[] = (d.extracurriculars ?? []).map((item: Record<string, any>) => ({
        id:             item.id,
        name:           item.name           ?? 'Ekstrakurikuler',
        category:       item.category       ?? '-',
        schedule:       item.schedule       ?? '-',
        time:           item.time           ?? '-',
        location:       item.location       ?? '-',
        advisor:        item.advisor        ?? '-',
        members:        item.members        ?? 0,
        status:         item.status         ?? 'active',
        attendanceRate: item.attendanceRate ?? item.attendance_rate ?? 0,
        joinDate:       item.joinDate       ?? item.join_date       ?? '',
        academicYearId: item.academicYearId ?? item.academic_year_id ?? '',
        achievements:   item.achievements   ?? [],
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentAttendance: ExtracurricularAttendance[] = (d.recentAttendance ?? []).map((item: Record<string, any>, index: number) => ({
        id:             item.id ?? index,
        date:           item.date     ?? '',
        activity:       item.activity ?? 'Ekstrakurikuler',
        status:         statusMap[item.status] ?? 'hadir',
        academicYearId: item.academicYearId ?? item.academic_year_id ?? '',
    }));

    return { extracurriculars, recentAttendance };
};
