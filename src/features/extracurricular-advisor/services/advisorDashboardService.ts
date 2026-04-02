// Dashboard Service for Extracurricular Advisor

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const ADVISOR_API_URL = `${API_BASE_URL}/extracurricular-advisor`;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const SIMULATED_DELAY_MS = 1000;

const getAuthHeaders = (): HeadersInit => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
    };
};

const handleApiError = async (response: Response): Promise<never> => {
    const errorData = await response.json();
    const error = new Error(errorData.message) as Error & { code: number; errors?: Record<string, string[]> };
    error.code = errorData.code;
    error.errors = errorData.errors;
    throw error;
};

// ==================== TYPES ====================

export interface AdvisorDashboardStats {
    totalMembers: number;
    lastAttendancePresent: number;
    averageAttendance: number;
    totalMeetings: number;
    activeStudents: number;
    needsAttention: number;
}

export interface UpcomingScheduleItem {
    id: number;
    day: string;
    date: string;
    time: string;
}

export interface RecentActivityItem {
    id: number;
    day: string;
    date: string;
    time: string;
    attendance: number;
}

// ==================== MOCK DATA ====================

const MOCK_MEMBERS_BASE = [
    { attendance: 92 }, { attendance: 88 }, { attendance: 95 }, { attendance: 78 },
    { attendance: 85 }, { attendance: 45 }, { attendance: 90 }, { attendance: 82 },
    { attendance: 88 }, { attendance: 91 }, { attendance: 87 }, { attendance: 93 },
    { attendance: 76 }, { attendance: 89 }, { attendance: 95 },
];

const MOCK_MEMBERS_24_25 = [
    { attendance: 98 }, { attendance: 95 }, { attendance: 92 }, { attendance: 88 },
    { attendance: 85 }, { attendance: 78 },
];

const MOCK_MEMBERS_23_24 = [
    { attendance: 100 }, { attendance: 91 }, { attendance: 95 },
];

// ==================== SERVICE FUNCTIONS ====================

export const getDashboardStats = async (
    params: { academicYear?: string; semester?: string } = {}
): Promise<AdvisorDashboardStats> => {
    const { academicYear, semester } = params;

    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

        let targetMembers = [...MOCK_MEMBERS_BASE];
        if (academicYear === "2024/2025") targetMembers = [...MOCK_MEMBERS_24_25];
        else if (academicYear === "2023/2024") targetMembers = [...MOCK_MEMBERS_23_24];

        if (semester === "2") {
            targetMembers = targetMembers.map((m) => ({ attendance: Math.max(0, m.attendance - 5) }));
        } else if (semester === "all") {
            targetMembers = targetMembers.map((m) => ({ attendance: Math.round(Math.max(0, m.attendance - 2.5)) }));
        }

        const totalMembers = targetMembers.length;
        const avgAttendance = Math.round(
            targetMembers.reduce((acc, m) => acc + m.attendance, 0) / (totalMembers || 1)
        );
        const activeStudents = targetMembers.filter((m) => m.attendance >= 90).length;
        const needsAttention = targetMembers.filter((m) => m.attendance < 75).length;

        return {
            totalMembers,
            lastAttendancePresent: Math.round(totalMembers * 0.9),
            averageAttendance: avgAttendance,
            totalMeetings: 12,
            activeStudents,
            needsAttention,
        };
    }

    const queryParams = new URLSearchParams();
    if (academicYear) queryParams.append("academic_year", academicYear);
    if (semester && semester !== "all") queryParams.append("semester", semester);

    const response = await fetch(`${ADVISOR_API_URL}/dashboard/stats?${queryParams.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const getUpcomingSchedule = async (): Promise<UpcomingScheduleItem[]> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        return [
            { id: 1, day: "Jumat", date: "26 Desember 2025", time: "14:00 - 16:00" },
            { id: 2, day: "Jumat", date: "09 Januari 2026", time: "14:00 - 16:00" },
        ];
    }

    const response = await fetch(`${ADVISOR_API_URL}/dashboard/schedule`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const getRecentActivities = async (): Promise<RecentActivityItem[]> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        return [
            { id: 1, day: "Jumat", date: "20 Des 2025", time: "14:00 - 16:00", attendance: 93 },
            { id: 2, day: "Jumat", date: "13 Des 2025", time: "14:00 - 16:30", attendance: 89 },
            { id: 3, day: "Jumat", date: "06 Des 2025", time: "14:00 - 16:00", attendance: 84 },
        ];
    }

    const response = await fetch(`${ADVISOR_API_URL}/dashboard/recent-activities`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};
