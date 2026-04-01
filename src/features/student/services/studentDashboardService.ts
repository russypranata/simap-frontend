export interface DashboardStats {
    averageScore: number;
    rank: number;
    attendanceRate: number;
    lateCount: number;
    prayerRate: number;
    achievementsCount: number;
    violationCount: number;
    ekstrakurikuler: number;
    unreadAnnouncements: number;
}

export interface TodayLesson {
    id: number;
    time: string;
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

const getCurrentDay = () => ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][new Date().getDay()];
const getCurrentTime = () => { const n = new Date(); return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`; };
const isOngoing = (start: string, end: string) => { const now = getCurrentTime(); return now >= start && now <= end; };

const mockSchedule = [
    { id: 1, day: "Senin", startTime: "07:45", endTime: "08:30", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1" },
    { id: 2, day: "Senin", startTime: "08:30", endTime: "09:15", subject: "Matematika", teacher: "Pak Ahmad", room: "XII IPA 1" },
    { id: 3, day: "Selasa", startTime: "07:00", endTime: "08:30", subject: "Kimia", teacher: "Pak Rudi", room: "Lab Kimia" },
    { id: 4, day: "Rabu", startTime: "07:00", endTime: "08:30", subject: "Bahasa Inggris", teacher: "Pak Budi", room: "XII IPA 1" },
    { id: 5, day: "Kamis", startTime: "07:00", endTime: "08:30", subject: "Fisika", teacher: "Bu Sari", room: "Lab Fisika" },
    { id: 6, day: "Jumat", startTime: "07:00", endTime: "08:30", subject: "Biologi", teacher: "Bu Ani", room: "Lab Biologi" },
    { id: 7, day: "Sabtu", startTime: "07:00", endTime: "08:30", subject: "TIK", teacher: "Pak Fajar", room: "Lab Komputer" },
];

export const getStudentDashboardData = async (): Promise<StudentDashboardData> => {
    await new Promise(resolve => setTimeout(resolve, 700));

    const today = getCurrentDay();
    const todaySchedule = mockSchedule
        .filter(s => s.day === today)
        .slice(0, 3)
        .map(s => ({ id: s.id, time: s.startTime, subject: s.subject, teacher: s.teacher, room: s.room, isOngoing: isOngoing(s.startTime, s.endTime) }));

    const stats: DashboardStats = {
        averageScore: 85.2, rank: 5, attendanceRate: 96, lateCount: 2,
        prayerRate: 90, achievementsCount: 3, violationCount: 0,
        ekstrakurikuler: 2, unreadAnnouncements: 2,
    };

    return {
        studentName: "Ahmad Rizki Maulana",
        studentClass: "XII IPA 1",
        stats,
        todaySchedule,
        monthlyAttendance: { hadir: 19, sakit: 1, izin: 1, alpa: 0, percentage: Math.round((19 / 21) * 100) },
        ekskulSummary: [{ id: 1, name: "Pramuka", attendanceRate: 92 }, { id: 2, name: "Basket", attendanceRate: 88 }],
        hasWarning: stats.violationCount >= 3 || stats.averageScore < 70,
    };
};
