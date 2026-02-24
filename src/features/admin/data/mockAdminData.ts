// ============================================
// ADMIN PROFILE TYPES & INTERFACES
// Sesuai dengan API Contract v1.2.0
// ============================================

/**
 * Admin Profile Data Interface
 * Represents the admin profile returned from API
 */
export interface AdminProfileData {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    joinDate: string;
    profilePicture?: string;
    avatar?: string;
    passwordLastChanged?: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Update Admin Profile Request Interface
 * Fields that can be updated by admin
 */
export interface UpdateAdminProfileRequest {
    name: string;
    username: string;
    email: string;
    phone: string;
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
 * Admin Dashboard Statistics Interface
 */
export interface AdminDashboardStats {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalExtracurriculars: number;
    activeAnnouncements: number;
    newReports: number;
}

/**
 * Recent Activity Interface
 */
export interface RecentActivity {
    id: number;
    type: 'user_created' | 'announcement' | 'report' | 'system';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
}

/**
 * Recent Announcement Interface
 */
export interface RecentAnnouncement {
    id: number;
    title: string;
    category: string;
    date: string;
    isNew: boolean;
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

// ============================================
// MOCK DATA (Development Only)
// Format sesuai dengan API Contract
// ============================================

export const mockAdminProfile: AdminProfileData = {
    id: 1,
    name: 'Dr. Ahmad Suryadi, M.Pd',
    username: 'admin.suryadi',
    email: 'admin@sman1.sch.id',
    phone: '08119876543',
    role: 'Administrator',
    department: 'Tata Usaha',
    joinDate: 'Januari 2020',
    profilePicture: '',
    avatar: '',
    passwordLastChanged: '2025-01-10T10:30:00Z',
    createdAt: '2020-01-15T00:00:00Z',
    updatedAt: '2026-01-17T12:00:00Z',
};

export const mockDashboardStats: AdminDashboardStats = {
    totalStudents: 1248,
    totalTeachers: 86,
    totalClasses: 42,
    totalExtracurriculars: 15,
    activeAnnouncements: 5,
    newReports: 3,
};

export const mockRecentActivities: RecentActivity[] = [
    {
        id: 1,
        type: 'user_created',
        title: 'Pengguna Baru Ditambahkan',
        description: 'Siswa baru: Ahmad Fadillah (XII-B)',
        timestamp: '2026-01-17T14:30:00Z',
        icon: 'user-plus',
    },
    {
        id: 2,
        type: 'announcement',
        title: 'Pengumuman Dipublikasi',
        description: 'Jadwal Ujian Akhir Semester Ganjil 2025/2026',
        timestamp: '2026-01-17T10:15:00Z',
        icon: 'megaphone',
    },
    {
        id: 3,
        type: 'system',
        title: 'Backup Database',
        description: 'Backup otomatis berhasil dilakukan',
        timestamp: '2026-01-17T02:00:00Z',
        icon: 'database',
    },
    {
        id: 4,
        type: 'report',
        title: 'Laporan Kehadiran',
        description: 'Rekap kehadiran bulan Januari tersedia',
        timestamp: '2026-01-16T16:45:00Z',
        icon: 'file-text',
    },
];

export const mockRecentAnnouncements: RecentAnnouncement[] = [
    {
        id: 1,
        title: 'Jadwal Ujian Akhir Semester Ganjil 2025/2026',
        category: 'Penting',
        date: '17 Jan',
        isNew: true,
    },
    {
        id: 2,
        title: 'Libur Semester Ganjil 2025/2026',
        category: 'Jadwal',
        date: '16 Jan',
        isNew: true,
    },
    {
        id: 3,
        title: 'Rapat Koordinasi Wali Kelas',
        category: 'Internal',
        date: '15 Jan',
        isNew: false,
    },
];
