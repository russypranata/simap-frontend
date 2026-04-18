import { TEACHER_API_URL, getAuthHeaders, getAuthHeadersFormData, handleApiError } from './teacherApiClient';

export interface TeacherProfile {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string | null;
    address: string | null;
    nip: string | null;
    nuptk: string | null;
    employmentStatus: string | null;
    positions: string[];
    lastEducation: string | null;
    educationMajor: string | null;
    educationUniversity: string | null;
    joinDate: string | null;
    profilePicture: string | null;
    role: 'guru';
    createdAt: string;
    updatedAt: string;
}

export const getTeacherProfile = async (): Promise<TeacherProfile> => {
    const response = await fetch(`${TEACHER_API_URL}/profile`, { headers: getAuthHeaders() });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const updateTeacherProfile = async (data: Partial<Pick<TeacherProfile, 'name' | 'email' | 'phone' | 'address'>>): Promise<TeacherProfile> => {
    const response = await fetch(`${TEACHER_API_URL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const updateTeacherAvatar = async (file: File): Promise<{ avatar: string; profilePicture: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await fetch(`${TEACHER_API_URL}/profile/avatar`, {
        method: 'POST',
        headers: getAuthHeadersFormData(),
        body: formData,
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const updateTeacherPassword = async (currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<void> => {
    const response = await fetch(`${TEACHER_API_URL}/profile/password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation,
        }),
    });
    if (!response.ok) await handleApiError(response);
};
