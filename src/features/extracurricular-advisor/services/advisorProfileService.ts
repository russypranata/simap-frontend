// Profile Service for Extracurricular Advisor

import { AdvisorProfileData, mockAdvisorData } from "../data/mockAdvisorData";

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
    let errorData: { message?: string; code?: number; errors?: Record<string, string[]> } = {};
    try {
        errorData = await response.json();
    } catch {
        // Non-JSON response (e.g. 500 HTML page)
    }
    const error = new Error(errorData.message || `HTTP ${response.status}`) as Error & { code: number; errors?: Record<string, string[]> };
    error.code = errorData.code ?? response.status;
    error.errors = errorData.errors;
    throw error;
};

// ==================== TYPES ====================

export type { AdvisorProfileData };

export interface UpdateAdvisorProfileRequest {
    name: string;
    username: string;
    email: string;
    phone: string;
    address: string;
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AvatarUploadResponse {
    avatar: string;
    profilePicture: string;
    thumbnails: {
        small: string;
        medium: string;
    };
}

export interface PasswordUpdateResponse {
    passwordLastChanged: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

export interface ApiErrorResponse {
    success: boolean;
    error: string;
    message: string;
    code: number;
    errors?: Record<string, string[]>;
}

// ==================== SERVICE FUNCTIONS ====================

export const getProfile = async (): Promise<AdvisorProfileData> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        return mockAdvisorData;
    }

    const response = await fetch(`${ADVISOR_API_URL}/profile`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result: ApiResponse<Record<string, unknown>> = await response.json();
    const d = result.data;
    // Normalize snake_case from Laravel to camelCase
    return {
        name: (d.name as string) ?? "",
        username: (d.username as string) ?? "",
        email: (d.email as string) ?? "",
        phone: (d.phone as string) ?? "",
        role: (d.role as string) ?? "",
        profilePicture: (d.profile_picture ?? d.profilePicture ?? d.avatar ?? "") as string,
        address: (d.address as string) ?? "",
        joinDate: (d.join_date ?? d.joinDate ?? "") as string,
        nip: (d.nip as string | undefined),
        extracurricular: (d.extracurricular as string) ?? "",
        totalMembers: (d.total_members ?? d.totalMembers ?? 0) as number,
        activeMembers: (d.active_members ?? d.activeMembers ?? 0) as number,
        totalMeetings: (d.total_meetings ?? d.totalMeetings ?? 0) as number,
        avgStudentAttendance: (d.avg_student_attendance ?? d.avgStudentAttendance ?? 0) as number,
    };
};

export const updateProfile = async (data: UpdateAdvisorProfileRequest): Promise<AdvisorProfileData> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        console.log("[Mock] Profile updated:", data);
        return { ...mockAdvisorData, ...data };
    }

    const response = await fetch(`${ADVISOR_API_URL}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    const result: ApiResponse<Record<string, unknown>> = await response.json();
    const d = result.data;
    return {
        name: (d.name as string) ?? "",
        username: (d.username as string) ?? "",
        email: (d.email as string) ?? "",
        phone: (d.phone as string) ?? "",
        role: (d.role as string) ?? "",
        profilePicture: (d.profile_picture ?? d.profilePicture ?? d.avatar ?? "") as string,
        address: (d.address as string) ?? "",
        joinDate: (d.join_date ?? d.joinDate ?? "") as string,
        nip: (d.nip as string | undefined),
        extracurricular: (d.extracurricular as string) ?? "",
        totalMembers: (d.total_members ?? d.totalMembers ?? 0) as number,
        activeMembers: (d.active_members ?? d.activeMembers ?? 0) as number,
        totalMeetings: (d.total_meetings ?? d.totalMeetings ?? 0) as number,
        avgStudentAttendance: (d.avg_student_attendance ?? d.avgStudentAttendance ?? 0) as number,
    };
};

export const uploadAvatar = async (file: File): Promise<AvatarUploadResponse> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        const mockUrl = URL.createObjectURL(file);
        console.log("[Mock] Avatar uploaded:", file.name);
        return {
            avatar: mockUrl,
            profilePicture: mockUrl,
            thumbnails: { small: mockUrl, medium: mockUrl },
        };
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${ADVISOR_API_URL}/profile/avatar`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: formData,
    });
    if (!response.ok) await handleApiError(response);
    const result: ApiResponse<AvatarUploadResponse> = await response.json();
    return result.data;
};

export const updatePassword = async (data: UpdatePasswordRequest): Promise<PasswordUpdateResponse> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        if (data.currentPassword === "wrong") {
            const error = new Error("Kata sandi saat ini salah") as Error & { code: number };
            error.code = 400;
            throw error;
        }
        console.log("[Mock] Password updated");
        return { passwordLastChanged: new Date().toISOString() };
    }

    const response = await fetch(`${ADVISOR_API_URL}/profile/password`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            current_password: data.currentPassword,
            new_password: data.newPassword,
            password_confirmation: data.confirmPassword,
        }),
    });
    if (!response.ok) await handleApiError(response);
    const result: ApiResponse<PasswordUpdateResponse> = await response.json();
    return result.data;
};
