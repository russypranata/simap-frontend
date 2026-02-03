import {
    AdminProfileData,
    UpdateAdminProfileRequest,
    UpdatePasswordRequest,
    AvatarUploadResponse,
    PasswordUpdateResponse,
    mockAdminProfile,
} from '../data/mockAdminData';
import { apiClient } from '@/lib/api-client';

// ============================================
// CONFIGURATION
// ============================================

// Development mode flag
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const SIMULATED_DELAY_MS = 800;

// ============================================
// HELPER FUNCTIONS
// ============================================

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
    return apiClient.get<AdminProfileData>('/admin/profile');
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
    return apiClient.put<AdminProfileData>('/admin/profile', data);
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
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient.post<AvatarUploadResponse>('/admin/profile/avatar', formData);
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
    return apiClient.put<PasswordUpdateResponse>('/admin/profile/password', data);
};
