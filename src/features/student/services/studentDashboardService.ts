import { STUDENT_API_URL, getAuthHeaders, handleApiError } from './studentApiClient';

export interface DashboardStats {
    averageScore: number;
    attendanceRate: number;
    lateCount: number;
    prayerRate: number;
    achievementsCount: number;
    violationCount: number;
    ekstrakurikuler: number;
}

export interface TodayLesson {
    id: number;
    time: string;
    endTime: string;
    subject: string;
    teacher: string;
    room: string;
    isOngoing: boolean;
}

export interface MonthlyAttendanceSummary {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
    percentage: number;
}

export interface EkskulSummary {
    id: number;
    name: string;
    attendanceRate: number;
}

export interface StudentDashboardData {
    studentName: string;
    studentClass: string;
    stats: DashboardStats;
    todaySchedule: TodayLesson[];
    monthlyAttendance: MonthlyAttendanceSummary;
    ekskulSummary: EkskulSummary[];
    hasWarning: boolean;
}

const isOngoing = (start: string, end: string): boolean => {
    const now = new Date();
    const cur = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return cur >= start && cur <= end;
};

const trimTime = (t: string) => t?.length > 5 ? t.substring(0, 5) : (t ?? '');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeScheduleItem = (s: Record<string, any>): TodayLesson => {
    const start = trimTime(s.startTime ?? s.start_time ?? '');
    const end   = trimTime(s.endTime   ?? s.end_time   ?? '');
    return { id: s.id, time: start, endTime: end, subject: s.subject ?? '', teacher: s.teacher ?? '', room: s.room ?? '', isOngoing: isOngoing(start, end) };
};

export const getStudentDashboardData = async (): Promise<StudentDashboardData> => {
    const response = await fetch(`${STUDENT_API_URL}/dashboard`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    const d = result.data;
    const stats = d.stats ?? {};

    return {
        studentName:  d.studentName  ?? d.student_name  ?? '',
        studentClass: d.studentClass ?? d.student_class ?? '',
        stats: {
            averageScore:      stats.averageScore      ?? stats.average_score      ?? 0,
            attendanceRate:    stats.attendanceRate    ?? stats.attendance_rate    ?? 0,
            lateCount:         stats.lateCount         ?? stats.late_count         ?? 0,
            prayerRate:        stats.prayerRate        ?? stats.prayer_rate        ?? 0,
            achievementsCount: stats.achievementsCount ?? stats.achievement_count  ?? 0,
            violationCount:    stats.violationCount    ?? stats.violation_count    ?? 0,
            ekstrakurikuler:   stats.ekstrakurikuler   ?? 0,
        },
        todaySchedule: (d.todaySchedule ?? d.today_schedule ?? []).slice(0, 5).map(normalizeScheduleItem),
        monthlyAttendance: {
            hadir:      d.monthlyAttendance?.hadir      ?? 0,
            sakit:      d.monthlyAttendance?.sakit      ?? 0,
            izin:       d.monthlyAttendance?.izin       ?? 0,
            alpa:       d.monthlyAttendance?.alpa       ?? 0,
            percentage: d.monthlyAttendance?.percentage ?? 0,
        },
        ekskulSummary: (d.ekskulSummary ?? d.ekskul_summary ?? []).map((e: Record<string, unknown>) => ({
            id:             e.id as number,
            name:           (e.name ?? '') as string,
            attendanceRate: (e.attendanceRate ?? e.attendance_rate ?? 0) as number,
        })),
        hasWarning: d.hasWarning ?? d.has_warning ?? false,
    };
};
