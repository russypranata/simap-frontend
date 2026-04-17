import { apiClient } from '@/lib/api-client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminProfileData {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    department?: string;
    joinDate?: string;
    profilePicture?: string;
    avatar?: string;
    passwordLastChanged?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateAdminProfileRequest {
    name: string;
    username: string;
    email: string;
    phone: string;
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AvatarUploadResponse {
    avatar: string;
    profilePicture: string;
    thumbnails?: {
        small: string;
        medium: string;
    };
}

export interface PasswordUpdateResponse {
    passwordLastChanged: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const formatDateForDisplay = (isoDate: string): string => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
};

// ─── Service ──────────────────────────────────────────────────────────────────

export const getAdminProfile = (): Promise<AdminProfileData> =>
    apiClient.get<AdminProfileData>('/auth/user');

export const updateAdminProfile = (data: UpdateAdminProfileRequest): Promise<AdminProfileData> =>
    apiClient.put<AdminProfileData>('/admin/profile', data);

export const uploadAdminAvatar = (file: File): Promise<AvatarUploadResponse> => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post<AvatarUploadResponse>('/admin/profile/avatar', formData);
};

export const updateAdminPassword = (data: UpdatePasswordRequest): Promise<PasswordUpdateResponse> =>
    apiClient.put<PasswordUpdateResponse>('/admin/profile/password', data);
