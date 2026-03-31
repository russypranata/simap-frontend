import { mockParentProfile } from "../data/mockParentData";
import { mockGradesChild1 } from "../data/mockParentGradesData";
import { mockScheduleChild1 } from "../data/mockParentScheduleData";

// ==================== TYPES ====================

export interface DashboardChild {
    id: string;
    name: string;
    class: string;
    nis: string;
}

export interface DashboardStats {
    averageScore: number;
    rank: number;
    totalStudents: number;
    attendanceRate: number;
    lateCount: number;
    prayerRate: number;
    achievementsCount: number;
    violationCount: number;
}

export interface TodayLesson {
    id: number;
    time: string;
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

// ==================== MOCK HELPERS ====================

const getCurrentDay = (): string => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[new Date().getDay()];
};

const getCurrentTime = (): string => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

const isOngoing = (startTime: string, endTime: string): boolean => {
    const now = getCurrentTime();
    return now >= startTime && now <= endTime;
};

// ==================== SERVICE ====================

/**
 * Fetch dashboard summary data for a specific child.
 * GET /api/parent/dashboard?childId={childId}
 */
export const getDashboardData = async (childId: string): Promise<DashboardData> => {
    await new Promise(resolve => setTimeout(resolve, 700));

    const child = mockParentProfile.children.find(c => c.id === childId);
    if (!child) throw new Error("Data anak tidak ditemukan.");

    // Get latest completed semester grades
    const gradesData = mockGradesChild1;
    const latestSemester = gradesData.semesters.find(s => s.academicYear === "2024/2025" && s.semester === "Genap")
        ?? gradesData.semesters[0];

    const allSubjects = latestSemester?.grades ?? [];
    const sorted = [...allSubjects].sort((a, b) => b.averageScore - a.averageScore);
    const topSubjects = sorted.slice(0, 3).map(g => ({ subject: g.subject, score: g.averageScore, grade: g.grade }));
    const bottomSubjects = sorted.slice(-3).reverse().map(g => ({ subject: g.subject, score: g.averageScore, grade: g.grade }));

    // Today's schedule
    const today = getCurrentDay();
    const todayItems = mockScheduleChild1
        .filter(s => s.day === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .slice(0, 5)
        .map(s => ({
            id: s.id,
            time: s.startTime,
            subject: s.subject,
            teacher: s.teacher,
            room: s.room,
            isOngoing: isOngoing(s.startTime, s.endTime),
        }));

    const stats: DashboardStats = {
        averageScore: latestSemester?.averageScore ?? 0,
        rank: latestSemester?.rank ?? 0,
        totalStudents: latestSemester?.totalStudents ?? 0,
        attendanceRate: 96,
        lateCount: 2,
        prayerRate: 90,
        achievementsCount: 3,
        violationCount: 0,
    };

    const monthlyAttendance: MonthlyAttendanceSummary = {
        hadir: 19, sakit: 1, izin: 1, alpa: 0,
        totalSchoolDays: 21,
        percentage: Math.round((19 / 21) * 100),
    };

    const ekskulSummary: EkskulSummary[] = [
        { id: 1, name: "Pramuka", attendanceRate: 92 },
        { id: 2, name: "Basket", attendanceRate: 88 },
    ];

    return {
        parentName: mockParentProfile.name,
        child,
        stats,
        todaySchedule: todayItems,
        topSubjects,
        bottomSubjects,
        monthlyAttendance,
        ekskulSummary,
        hasWarning: stats.violationCount >= 3 || stats.averageScore < 75,
    };
};

export const getParentChildren = async (): Promise<DashboardChild[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockParentProfile.children;
};
