// ============================================
// STUDENT PROFILE SERVICE
// API Integration Layer - Sesuai API Contract v1.2.0
// ============================================

import {
    StudentProfileData,
    UpdateProfileRequest,
    UpdatePasswordRequest,
    AvatarUploadResponse,
    PasswordUpdateResponse,
    ApiResponse,
    ApiErrorResponse,
    mockStudentProfile,
} from '../data/mockStudentData';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const STUDENT_API_URL = `${API_BASE_URL}/student`;

// Development mode flag
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true'; // Defaults to false
const SIMULATED_DELAY_MS = 1500;

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

    // Create custom error with API details
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

/**
 * Format date from display to ISO format (for API)
 */
export const formatDateForApi = (displayDate: string): string => {
    if (!displayDate) return '';
    const date = new Date(displayDate);
    return date.toISOString().split('T')[0]; // Returns "YYYY-MM-DD"
};

// ============================================
// API SERVICES
// ============================================

/**
 * GET /student/profile
 * Fetch student profile data
 */
export const getStudentProfile = async (): Promise<StudentProfileData> => {
    // ===== MOCK IMPLEMENTATION =====
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        return mockStudentProfile;
    }

    // ===== REAL API IMPLEMENTATION =====
    const response = await fetch(`${STUDENT_API_URL}/profile`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    const result: ApiResponse<StudentProfileData> = await response.json();
    return result.data;
};

/**
 * PUT /student/profile
 * Update student profile data
 */
export const updateStudentProfile = async (
    data: UpdateProfileRequest,
): Promise<StudentProfileData> => {
    // ===== MOCK IMPLEMENTATION =====
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        return { ...mockStudentProfile, ...data };
    }

    // ===== REAL API IMPLEMENTATION =====
    const response = await fetch(`${STUDENT_API_URL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    const result: ApiResponse<StudentProfileData> = await response.json();
    return result.data;
};

/**
 * POST /student/profile/avatar
 * Upload profile picture
 */
export const uploadProfileAvatar = async (
    file: File,
): Promise<AvatarUploadResponse> => {
    // ===== MOCK IMPLEMENTATION =====
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        const mockUrl = URL.createObjectURL(file);
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

    const response = await fetch(`${STUDENT_API_URL}/profile/avatar`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            // Note: Don't set Content-Type for FormData, browser will set it with boundary
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
 * PUT /student/profile/password
 * Change user password
 */
export const updatePassword = async (
    data: UpdatePasswordRequest,
): Promise<PasswordUpdateResponse> => {
    // ===== MOCK IMPLEMENTATION =====
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

        // Simulate password validation
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

        return {
            passwordLastChanged: new Date().toISOString(),
        };
    }

    // ===== REAL API IMPLEMENTATION =====
    const response = await fetch(`${STUDENT_API_URL}/profile/password`, {
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
// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate password strength
 * Returns array of error messages
 */
export const validatePasswordStrength = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Minimal 8 karakter');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Harus mengandung huruf besar');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Harus mengandung huruf kecil');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Harus mengandung angka');
    }

    return errors;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (Indonesian format)
 */
export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^08[0-9]{9,12}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate image file for avatar upload
 */
export const validateAvatarFile = (
    file: File,
): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        errors.push('Format file harus JPG, JPEG, atau PNG');
    }

    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
        errors.push(
            `Ukuran file ${(file.size / (1024 * 1024)).toFixed(1)}MB melebihi batas maksimal 2MB`,
        );
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};
