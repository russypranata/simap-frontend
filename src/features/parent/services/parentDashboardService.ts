import { PARENT_API_URL, getAuthHeaders, handleApiError } from "./parentApiClient";

export interface DashboardChild {
    id: string;
    name: string;
    class: string;
    nis: string;
}

export interface DashboardStats {
    averageScore: number;
    attendanceRate: number;
    lateCount: number;
    prayerRate: number;
    achievementsCount: number;
    violationCount: number;
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

export interface TopSubject {
    subject: string;
    score: number;
    grade: string;
}

export interface MonthlyAttendanceSummary {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
    totalSchoolDays: number;
    percentage: number;
}

export interface EkskulSummary {
    id: number;
    name: string;
    attendanceRate: number;
}

export interface DashboardData {
    parentName: string;
    child: DashboardChild;
    stats: DashboardStats;
    todaySchedule: TodayLesson[];
    topSubjects: TopSubject[];
    bottomSubjects: TopSubject[];
    monthlyAttendance: MonthlyAttendanceSummary;
    ekskulSummary: EkskulSummary[];
    hasWarning: boolean;
}

const isOngoing = (startTime: string, endTime: string): boolean => {
    const now = new Date();
    const cur = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return cur >= startTime && cur <= endTime;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeChild = (c: Record<string, any>): DashboardChild => ({
    id: String(c.id),
    name: c.name ?? "",
    class: c.class ?? "",
    nis: c.nis ?? c.admission_number ?? "",
});

export const getDashboardData = async (childId: string): Promise<DashboardData> => {
    const response = await fetch(`${PARENT_API_URL}/dashboard?childId=${childId}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    const d = result.data;

    const todaySchedule: TodayLesson[] = (d.todaySchedule ?? []).slice(0, 5).map((s: Record<string, unknown>) => {
        const rawStart = (s.startTime ?? s.start_time ?? "") as string;
        const rawEnd = (s.endTime ?? s.end_time ?? "") as string;
        // Trim seconds: "07:00:00" → "07:00"
        const trimTime = (t: string) => t.length > 5 ? t.substring(0, 5) : t;
        return {
            id: s.id as number,
            time: trimTime(rawStart),
            endTime: trimTime(rawEnd),
            subject: (s.subject ?? "") as string,
            teacher: (s.teacher ?? "") as string,
            room: (s.room ?? "") as string,
            isOngoing: isOngoing(trimTime(rawStart), trimTime(rawEnd)),
        };
    });

    const stats = d.stats ?? {};

    return {
        parentName: d.parentName ?? d.parent_name ?? "",
        child: normalizeChild(d.child ?? {}),
        stats: {
            averageScore: stats.averageScore ?? stats.average_score ?? 0,
            attendanceRate: stats.attendanceRate ?? stats.attendance_rate ?? 0,
            lateCount: stats.lateCount ?? stats.late_count ?? 0,
            prayerRate: stats.prayerRate ?? stats.prayer_rate ?? 0,
            achievementsCount: stats.achievementsCount ?? stats.achievement_count ?? 0,
            violationCount: stats.violationCount ?? stats.violation_count ?? 0,
        },
        todaySchedule,
        topSubjects: (d.topSubjects ?? d.top_subjects ?? []).map((s: Record<string, unknown>) => ({
            subject: (s.subject ?? "") as string,
            score: (s.score ?? 0) as number,
            grade: (s.grade ?? "") as string,
        })),
        bottomSubjects: (d.bottomSubjects ?? d.bottom_subjects ?? []).map((s: Record<string, unknown>) => ({
            subject: (s.subject ?? "") as string,
            score: (s.score ?? 0) as number,
            grade: (s.grade ?? "") as string,
        })),
        monthlyAttendance: {
            hadir: d.monthlyAttendance?.hadir ?? 0,
            sakit: d.monthlyAttendance?.sakit ?? 0,
            izin: d.monthlyAttendance?.izin ?? 0,
            alpa: d.monthlyAttendance?.alpa ?? 0,
            totalSchoolDays: d.monthlyAttendance?.totalSchoolDays ?? d.monthlyAttendance?.total_school_days ?? 0,
            percentage: d.monthlyAttendance?.percentage ?? 0,
        },
        ekskulSummary: (d.ekskulSummary ?? d.ekskul_summary ?? []).map((e: Record<string, unknown>) => ({
            id: e.id as number,
            name: (e.name ?? "") as string,
            attendanceRate: (e.attendanceRate ?? e.attendance_rate ?? 0) as number,
        })),
        hasWarning: d.hasWarning ?? d.has_warning ?? false,
    };
};

export const getParentChildren = async (): Promise<DashboardChild[]> => {
    const response = await fetch(`${PARENT_API_URL}/children`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return (result.data ?? []).map(normalizeChild);
};
