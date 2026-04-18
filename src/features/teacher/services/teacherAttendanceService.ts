import { TEACHER_API_URL, getAuthHeaders, handleApiError } from './teacherApiClient';

export interface TeacherAttendanceRecord {
    id: string;
    studentId: string;
    studentName: string;
    class: string;
    classId: string;
    subject: string;
    date: string;
    status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan';
    notes: string | null;
    academicYear: string;
    semester: string;
}

export interface AttendanceSummaryItem {
    classSubjectId: string;
    class: string;
    subject: string;
    totalRecords: number;
    present: number;
    sick: number;
    permit: number;
    absent: number;
    attendanceRate: number;
}

export interface SaveAttendanceRecord {
    student_id: number;
    class_subject_id: number;
    date: string;
    status: 'hadir' | 'sakit' | 'izin' | 'tanpa-keterangan';
    notes?: string;
}

export const getTeacherAttendance = async (params?: {
    class_id?: string;
    date?: string;
    subject_id?: string;
}): Promise<TeacherAttendanceRecord[]> => {
    const query = new URLSearchParams();
    if (params?.class_id)   query.set('class_id',   params.class_id);
    if (params?.date)       query.set('date',        params.date);
    if (params?.subject_id) query.set('subject_id',  params.subject_id);

    const url = `${TEACHER_API_URL}/attendance${query.toString() ? '?' + query.toString() : ''}`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    return (result.data ?? []).map((a: Record<string, unknown>) => ({
        id:           String(a.id),
        studentId:    String(a.studentId   ?? a.student_id   ?? ''),
        studentName:  String(a.studentName ?? a.student_name ?? ''),
        class:        String(a.class       ?? ''),
        classId:      String(a.classId     ?? a.class_id     ?? ''),
        subject:      String(a.subject     ?? ''),
        date:         String(a.date        ?? ''),
        status:       a.status as TeacherAttendanceRecord['status'],
        notes:        (a.notes as string) ?? null,
        academicYear: String(a.academicYear ?? a.academic_year ?? '2025/2026'),
        semester:     String(a.semester    ?? 'Ganjil'),
    }));
};

export const saveTeacherAttendance = async (records: SaveAttendanceRecord[]): Promise<void> => {
    const response = await fetch(`${TEACHER_API_URL}/attendance`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ records }),
    });
    if (!response.ok) await handleApiError(response);
};

export const getAttendanceSummary = async (): Promise<AttendanceSummaryItem[]> => {
    const response = await fetch(`${TEACHER_API_URL}/attendance/summary`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data ?? [];
};
