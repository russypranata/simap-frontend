// Re-export all domain services for backward compatibility

export * from "./advisorDashboardService";
export * from "./advisorMembersService";
export * from "./advisorAttendanceService";
export * from "./advisorProfileService";

// ==================== BACKWARD COMPAT ====================
// The advisorService object is kept so existing imports (e.g. attendance detail page)
// continue to work without changes.

import {
    getDashboardStats,
    getUpcomingSchedule,
    getRecentActivities,
} from "./advisorDashboardService";

import {
    getMembers,
    getMemberDetail,
    addMember,
    deleteMember,
} from "./advisorMembersService";

import {
    getAttendanceHistory,
    getAttendanceDetail,
    submitAttendance,
} from "./advisorAttendanceService";

import {
    getProfile,
    updateProfile,
    uploadAvatar,
    updatePassword,
} from "./advisorProfileService";

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

export const advisorService = {
    getDashboardStats,
    getUpcomingSchedule,
    getRecentActivities,
    getMembers,
    getMemberDetail,
    addMember,
    deleteMember,
    getAttendanceHistory,
    getAttendanceDetail,
    submitAttendance,
    getProfile,
    updateProfile,
    uploadAvatar,
    updatePassword,

    // Legacy: getActiveAcademicYear (kept for any consumers)
    getActiveAcademicYear: async () => {
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
            return { academicYear: "2025/2026", semester: "1", label: "Ganjil" };
        }
        const response = await fetch(`${ADVISOR_API_URL}/academic-year/active`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result.data;
    },
};
