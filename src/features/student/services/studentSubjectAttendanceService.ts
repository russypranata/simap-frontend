import { STUDENT_API_URL, getAuthHeaders, handleApiError } from './studentApiClient';

export type SubjectType = 'wajib' | 'peminatan';
export type SubjectStatus = 'hadir' | 'izin' | 'sakit' | 'alpa';

export interface SubjectAttendanceRecord {
    id: number;
    date: string;
    day: string;
    subject: string;
    subjectType: SubjectType;
    teacher: string;
    status: SubjectStatus;
    time: string;
    topic?: string;
    notes?: string;
    academicYearId: string;
    semester: number;
}

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const statusMap: Record<string, SubjectStatus> = {
    present: 'hadir', absent: 'alpa', late: 'izin', excused: 'sakit',
    hadir: 'hadir', sakit: 'sakit', izin: 'izin', alpa: 'alpa',
};

export const getStudentSubjectAttendance = async (): Promise<SubjectAttendanceRecord[]> => {
    const response = await fetch(`${STUDENT_API_URL}/attendance/subject`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>, index: number): SubjectAttendanceRecord => ({
        id:            item.id ?? index,
        date:          item.date    ?? '',
        day:           DAYS_ID[new Date(item.date).getDay()] ?? '',
        subject:       item.subject ?? '',
        subjectType:   'wajib',
        teacher:       item.teacher ?? '',
        status:        statusMap[item.status] ?? 'hadir',
        time:          '',
        topic:         item.topic   ?? undefined,
        notes:         item.notes   ?? undefined,
        academicYearId: item.academicYear ?? '',
        semester:      item.semester ?? 1,
    }));
};
