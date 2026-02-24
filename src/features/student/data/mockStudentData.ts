// ============================================
// STUDENT PROFILE TYPES & INTERFACES
// Sesuai dengan API Contract v1.2.0
// ============================================

/**
 * Student Profile Data Interface
 * Represents the student profile returned from API
 */
export interface StudentProfileData {
    id: number;
    name: string;
    username: string;
    nis: string;
    nisn: string;
    class: string;
    email: string;
    phone: string;
    address: string;
    birthPlace: string;
    birthDate: string; // ISO format: "2007-05-15"
    religion: string;
    joinDate: string;
    role: string;
    validUntil: string;
    profilePicture?: string;
    avatar?: string;
    passwordLastChanged?: string; // ISO format: "2024-10-13T10:30:00Z"
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Update Profile Request Interface
 * Fields that can be updated by user
 */
export interface UpdateProfileRequest {
    name: string;
    username: string;
    email: string;
    phone: string;
    address?: string;
    birthPlace?: string;
    birthDate?: string;
}

/**
 * Update Password Request Interface
 */
export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Avatar Upload Response Interface
 */
export interface AvatarUploadResponse {
    avatar: string;
    profilePicture: string;
    thumbnails?: {
        small: string;
        medium: string;
    };
}

/**
 * Password Update Response Interface
 */
export interface PasswordUpdateResponse {
    passwordLastChanged: string;
}

/**
 * Student Statistics Interface
 * NOTE: Currently using static data, no API endpoint yet
 */
export interface StudentStats {
    attendance: number;
    assignmentsCompleted: number;
    averageGrade: number;
    points: number;
}

// ============================================
// API RESPONSE WRAPPER TYPES
// ============================================

/**
 * Base API Response Interface
 */
export interface ApiResponse<T> {
    code: number;
    status: 'success' | 'error';
    message: string;
    data: T;
    meta?: {
        timestamp: string;
        version: string;
    };
}

/**
 * API Error Response Interface
 */
export interface ApiErrorResponse {
    code: number;
    status: 'error';
    message: string;
    errors?: Record<string, string[]>;
}

/**
 * Validation Error Details
 */
export interface ValidationErrors {
    [field: string]: string[];
}

// ============================================
// MOCK DATA (Development Only)
// Format sesuai dengan API Contract
// ============================================

export const mockStudentProfile: StudentProfileData = {
    id: 1,
    name: 'Ahmad Fauzan Ramadhan',
    username: 'ahmad.fauzan',
    nis: '0012345678',
    nisn: '0107959840',
    class: 'XII-A',
    email: 'ahmad.fauzan@student.sman1.sch.id',
    phone: '08123456789',
    address: 'Jl. Merdeka No. 10, RT 05/RW 02, Kel. Sukamaju, Kec. Cikupa',
    birthPlace: 'Tangerang',
    birthDate: '2007-05-15', // ISO format
    religion: 'Islam',
    joinDate: 'Juli 2023',
    role: 'Siswa',
    validUntil: '31 Juni 2028',
    profilePicture: '',
    avatar: '',
    passwordLastChanged: '2024-10-13T10:30:00Z',
    createdAt: '2023-07-01T00:00:00Z',
    updatedAt: '2025-01-13T12:00:00Z',
};

export const mockStudentStats: StudentStats = {
    attendance: 95,
    assignmentsCompleted: 42,
    averageGrade: 85.5,
    points: 1250,
};
