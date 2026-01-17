// ============================================
// ADMIN PROFILE SERVICE
// API Integration Layer - Sesuai API Contract v1.2.0
// ============================================

import {
    AdminProfileData,
    UpdateAdminProfileRequest,
    UpdatePasswordRequest,
    AvatarUploadResponse,
    PasswordUpdateResponse,
    ApiResponse,
    ApiErrorResponse,
    mockAdminProfile,
} from '../data/mockAdminData';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const ADMIN_API_URL = `${API_BASE_URL}/admin`;

// Development mode flag
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const SIMULATED_DELAY_MS = 800;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get authorization headers with Bearer token
 */
const getAuthHeaders = (): HeadersInit => {
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('authToken')
            : null;
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
};

/**
 * Handle API error responses
 */
const handleApiError = async (response: Response): Promise<never> => {
    const errorData: ApiErrorResponse = await response.json();

    const error = new Error(errorData.message) as Error & {
        code: number;
        errors?: Record<string, string[]>;
    };
    error.code = errorData.code;
    error.errors = errorData.errors;

    throw error;
};

/**
 * Format date from ISO to display format (for UI)
 */
export const formatDateForDisplay = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

// ============================================
// API SERVICES
// ============================================

/**
 * GET /admin/profile
 * Fetch admin profile data
 */
export const getAdminProfile = async (): Promise<AdminProfileData> => {
    // ===== MOCK IMPLEMENTATION =====
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        return mockAdminProfile;
    }

    // ===== REAL API IMPLEMENTATION =====
    const response = await fetch(`${ADMIN_API_URL}/profile`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    const result: ApiResponse<AdminProfileData> = await response.json();
    return result.data;
};

/**
 * PUT /admin/profile
 * Update admin profile data
 */
export const updateAdminProfile = async (
    data: UpdateAdminProfileRequest,
): Promise<AdminProfileData> => {
    // ===== MOCK IMPLEMENTATION =====
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        console.log('[Mock] Admin profile updated:', data);
        return { ...mockAdminProfile, ...data };
    }

    // ===== REAL API IMPLEMENTATION =====
    const response = await fetch(`${ADMIN_API_URL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    const result: ApiResponse<AdminProfileData> = await response.json();
    return result.data;
};

/**
 * POST /admin/profile/avatar
 * Upload profile picture
 */
export const uploadAdminAvatar = async (
    file: File,
): Promise<AvatarUploadResponse> => {
    // ===== MOCK IMPLEMENTATION =====
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        const mockUrl = URL.createObjectURL(file);
        console.log('[Mock] Admin avatar uploaded:', file.name);
        return {
            avatar: mockUrl,
            profilePicture: mockUrl,
            thumbnails: {
                small: mockUrl,
                medium: mockUrl,
            },
        };
    }

    // ===== REAL API IMPLEMENTATION =====
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('authToken')
            : null;

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${ADMIN_API_URL}/profile/avatar`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
        body: formData,
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    const result: ApiResponse<AvatarUploadResponse> = await response.json();
    return result.data;
};

/**
 * PUT /admin/profile/password
 * Change admin password
 */
export const updateAdminPassword = async (
    data: UpdatePasswordRequest,
): Promise<PasswordUpdateResponse> => {
    // ===== MOCK IMPLEMENTATION =====
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

        if (data.currentPassword === '') {
            const error = new Error(
                'Kata sandi saat ini wajib diisi',
            ) as Error & {
                code: number;
                errors?: Record<string, string[]>;
            };
            error.code = 400;
            error.errors = {
                currentPassword: ['Kata sandi saat ini wajib diisi'],
            };
            throw error;
        }

        if (data.newPassword !== data.confirmPassword) {
            const error = new Error(
                'Konfirmasi kata sandi tidak cocok',
            ) as Error & {
                code: number;
                errors?: Record<string, string[]>;
            };
            error.code = 400;
            error.errors = {
                confirmPassword: ['Konfirmasi kata sandi tidak cocok'],
            };
            throw error;
        }

        console.log('[Mock] Admin password updated');
        return {
            passwordLastChanged: new Date().toISOString(),
        };
    }

    // ===== REAL API IMPLEMENTATION =====
    const response = await fetch(`${ADMIN_API_URL}/profile/password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    const result: ApiResponse<PasswordUpdateResponse> = await response.json();
    return result.data;
};
