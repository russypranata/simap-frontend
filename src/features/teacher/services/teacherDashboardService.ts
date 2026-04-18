import { TEACHER_API_URL, getAuthHeaders, handleApiError } from './teacherApiClient';

export interface TeacherDashboardStats {
    totalClasses: number;
    totalStudents: number;
    totalSubjects: number;
    todaySchedule: number;
    attendanceToday: {
        present: number;
        absent: number;
        total: number;
    };
}

export interface TodayLesson {
    id: number;
    startTime: string;
    endTime: string;
    subject: string;
    class: string;
    room: string;
}

export interface TeacherDashboardData {
    teacherName: string;
    isHomeroomTeacher: boolean;
    homeroomClass: string | null;
    stats: TeacherDashboardStats;
    todaySchedule: TodayLesson[];
}

export const getTeacherDashboard = async (): Promise<TeacherDashboardData> => {
    const response = await fetch(`${TEACHER_API_URL}/dashboard`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    const d = result.data;

    return {
        teacherName:       d.teacherName ?? d.teacher_name ?? '',
        isHomeroomTeacher: d.isHomeroomTeacher ?? d.is_homeroom_teacher ?? false,
        homeroomClass:     d.homeroomClass ?? d.homeroom_class ?? null,
        stats: {
            totalClasses:   d.stats?.totalClasses   ?? d.stats?.total_classes   ?? 0,
            totalStudents:  d.stats?.totalStudents  ?? d.stats?.total_students  ?? 0,
            totalSubjects:  d.stats?.totalSubjects  ?? d.stats?.total_subjects  ?? 0,
            todaySchedule:  d.stats?.todaySchedule  ?? d.stats?.today_schedule  ?? 0,
            attendanceToday: {
                present: d.stats?.attendanceToday?.present ?? 0,
                absent:  d.stats?.attendanceToday?.absent  ?? 0,
                total:   d.stats?.attendanceToday?.total   ?? 0,
            },
        },
        todaySchedule: (d.todaySchedule ?? d.today_schedule ?? []).map((s: Record<string, unknown>) => ({
            id:        s.id,
            startTime: s.startTime ?? s.start_time ?? '',
            endTime:   s.endTime   ?? s.end_time   ?? '',
            subject:   s.subject   ?? '',
            class:     s.class     ?? '',
            room:      s.room      ?? '-',
        })),
    };
};
