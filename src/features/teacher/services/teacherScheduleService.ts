import { TEACHER_API_URL, getAuthHeaders, handleApiError } from './teacherApiClient';

export interface TeacherScheduleItem {
    id: string;
    day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
    startTime: string;
    endTime: string;
    time: string;   // "HH:MM - HH:MM"
    subject: string;
    class: string;
    classId: string;
    classSubjectId: string;
    room: string;
    teacher: string;
}

export const getTeacherSchedule = async (day?: string): Promise<TeacherScheduleItem[]> => {
    const params = day ? `?day=${encodeURIComponent(day)}` : '';
    const response = await fetch(`${TEACHER_API_URL}/schedule${params}`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return (result.data ?? []).map((s: Record<string, unknown>) => ({
        id:             String(s.id),
        day:            s.day            ?? '',
        startTime:      s.startTime      ?? s.start_time ?? '',
        endTime:        s.endTime        ?? s.end_time   ?? '',
        time:           s.time           ?? `${s.startTime ?? s.start_time} - ${s.endTime ?? s.end_time}`,
        subject:        s.subject        ?? '',
        class:          s.class          ?? '',
        classId:        String(s.classId ?? s.class_id ?? ''),
        classSubjectId: String(s.classSubjectId ?? s.class_subject_id ?? ''),
        room:           s.room           ?? '-',
        teacher:        s.teacher        ?? '',
    }));
};
