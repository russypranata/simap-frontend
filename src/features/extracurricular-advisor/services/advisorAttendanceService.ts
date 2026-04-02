// Attendance Service for Extracurricular Advisor

import { MOCK_MEMBERS_ALL } from "./advisorMembersService";

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

export interface AttendanceHistoryEntry {
    id: number;
    date: string;
    studentStats: {
        present: number;
        total: number;
        percentage: number;
    };
    advisorStats: {
        tutorName: string;
        startTime: string;
        endTime: string;
        duration: string;
        status: string;
    };
}

export interface AttendanceStudent {
    id: number;
    nis: string;
    name: string;
    class: string;
    status: string;
    note?: string;
}

export interface AttendanceDetail extends AttendanceHistoryEntry {
    topic?: string;
    students: AttendanceStudent[];
}

export interface CreateAttendanceRequest {
    date: string;
    startTime: string;
    endTime: string;
    topic?: string;
    students: {
        studentId: number;
        status: string;
        note?: string;
    }[];
}

// ==================== MOCK DATA ====================

const MOCK_HISTORY: AttendanceHistoryEntry[] = [
    {
        id: 1,
        date: "2025-12-20",
        studentStats: { present: 14, total: 15, percentage: 93 },
        advisorStats: { tutorName: "Ahmad Fauzi, S.Pd", startTime: "14:00", endTime: "16:00", duration: "2j 0m", status: "hadir" },
    },
    {
        id: 2,
        date: "2025-12-13",
        studentStats: { present: 13, total: 15, percentage: 87 },
        advisorStats: { tutorName: "Ahmad Fauzi, S.Pd", startTime: "14:00", endTime: "16:30", duration: "2j 30m", status: "hadir" },
    },
    {
        id: 3,
        date: "2025-12-06",
        studentStats: { present: 12, total: 15, percentage: 80 },
        advisorStats: { tutorName: "Ahmad Fauzi, S.Pd", startTime: "14:00", endTime: "16:00", duration: "2j 0m", status: "hadir" },
    },
    {
        id: 4,
        date: "2025-11-29",
        studentStats: { present: 15, total: 15, percentage: 100 },
        advisorStats: { tutorName: "Ahmad Fauzi, S.Pd", startTime: "14:00", endTime: "15:30", duration: "1j 30m", status: "hadir" },
    },
];

// ==================== SERVICE FUNCTIONS ====================

export const getAttendanceHistory = async (
    startDate?: string,
    endDate?: string
): Promise<AttendanceHistoryEntry[]> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        return MOCK_HISTORY;
    }

    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await fetch(`${ADVISOR_API_URL}/attendance?${params}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const getAttendanceDetail = async (id: number): Promise<AttendanceDetail> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

        const entry = MOCK_HISTORY.find((h) => h.id === Number(id));
        if (!entry) throw new Error("Data presensi tidak ditemukan");

        const { present, total } = entry.studentStats;
        const nonPresentCount = total - present;

        let sickCount = 0;
        let permitCount = 0;
        let absentCount = 0;

        if (nonPresentCount > 0) {
            if (nonPresentCount === 1) {
                absentCount = 1;
            } else {
                sickCount = Math.floor(nonPresentCount * 0.4);
                permitCount = Math.floor(nonPresentCount * 0.4);
                absentCount = nonPresentCount - sickCount - permitCount;
            }
        }

        // Use only active members from the base mock data (first 15)
        const baseMembers = MOCK_MEMBERS_ALL.filter((m) => m.status === "Aktif").slice(0, total);
        const students: AttendanceStudent[] = baseMembers.map((member, index) => {
            let status = "hadir";
            if (index >= present) {
                const relativeIndex = index - present;
                if (relativeIndex < sickCount) status = "sakit";
                else if (relativeIndex < sickCount + permitCount) status = "izin";
                else status = "alpa";
            }
            return { id: member.id, nis: member.nis, name: member.name, class: member.class, status };
        });

        return { ...entry, topic: "Kegiatan Rutin Ekstrakurikuler", students };
    }

    const response = await fetch(`${ADVISOR_API_URL}/attendance/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const submitAttendance = async (data: CreateAttendanceRequest) => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        console.log("[Mock] Attendance submitted:", data);
        return { success: true, data: { id: 123 } };
    }

    const response = await fetch(`${ADVISOR_API_URL}/attendance`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    return await response.json();
};
