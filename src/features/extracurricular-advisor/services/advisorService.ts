// Advisor Service
// This service handles all API interactions for the Extracurricular Advisor role

import { AdvisorProfileData, mockAdvisorData } from '../data/mockAdvisorData';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
// Use specific advisor API URL prefix
const ADVISOR_API_URL = `${API_BASE_URL}/extracurricular-advisor`;

// Development mode flag - defaulting to 'true' if not set, for safety
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const SIMULATED_DELAY_MS = 1000;

// ===== SHARED MOCK DATA =====
const MOCK_MEMBERS_DATA: AdvisorMember[] = [
    { id: 1, nis: "2022001", name: "Andi Wijaya", class: "XII A", joinDate: "2024-07-15", attendance: 92 },
    { id: 2, nis: "2022002", name: "Rina Kusuma", class: "XI A", joinDate: "2024-07-15", attendance: 88 },
    { id: 3, nis: "2022003", name: "Doni Pratama", class: "XI B", joinDate: "2024-07-20", attendance: 95 },
    { id: 4, nis: "2022004", name: "Siti Aminah", class: "XII B", joinDate: "2024-07-15", attendance: 78 },
    { id: 5, nis: "2022005", name: "Budi Santoso", class: "X A", joinDate: "2024-08-01", attendance: 85 },
    { id: 6, nis: "2022006", name: "Dewi Lestari", class: "XII A", joinDate: "2024-07-15", attendance: 45 },
    { id: 7, nis: "2022007", name: "Eko Prasetyo", class: "XI A", joinDate: "2024-07-20", attendance: 90 },
    { id: 8, nis: "2022008", name: "Fitri Handayani", class: "XI B", joinDate: "2024-08-05", attendance: 82 },
    { id: 9, nis: "2022009", name: "Gilang Ramadhan", class: "XII B", joinDate: "2024-07-15", attendance: 88 },
    { id: 10, nis: "2022010", name: "Hana Safitri", class: "X A", joinDate: "2024-08-10", attendance: 91 },
    { id: 11, nis: "2022011", name: "Irfan Hakim", class: "X B", joinDate: "2024-08-12", attendance: 87 },
    { id: 12, nis: "2022012", name: "Julia Permata", class: "XI A", joinDate: "2024-07-18", attendance: 93 },
    { id: 13, nis: "2022013", name: "Kevin Anggara", class: "XI B", joinDate: "2024-07-22", attendance: 76 },
    { id: 14, nis: "2022014", name: "Luna Maya", class: "XII A", joinDate: "2024-07-15", attendance: 89 },
    { id: 15, nis: "2022015", name: "Mario Bros", class: "X B", joinDate: "2024-08-15", attendance: 95 },
];

const MOCK_HISTORY_24_25: AdvisorMember[] = [
    { id: 101, nis: "2023001", name: "Alumni Aditya (24/25)", class: "XII A", joinDate: "2023-07-15", attendance: 98 }, // Rajin
    { id: 102, nis: "2023002", name: "Alumni Bayu (24/25)", class: "XII A", joinDate: "2023-07-15", attendance: 95 }, // Rajin
    { id: 103, nis: "2023003", name: "Alumni Citra (24/25)", class: "XII B", joinDate: "2023-07-15", attendance: 92 }, // Rajin (Batas)
    { id: 104, nis: "2023004", name: "Alumni Diana (24/25)", class: "XII B", joinDate: "2023-07-15", attendance: 88 }, // Average
    { id: 105, nis: "2023005", name: "Alumni Erik (24/25)", class: "XII A", joinDate: "2023-07-15", attendance: 85 }, // Average
    { id: 106, nis: "2023006", name: "Alumni Fani (24/25)", class: "XII A", joinDate: "2023-07-15", attendance: 78 }, // Low
    { id: 107, nis: "2023007", name: "Alumni Gilang (24/25)", class: "XII B", joinDate: "2023-07-15", attendance: 96 }, // Rajin
    { id: 108, nis: "2023008", name: "Alumni Hana (24/25)", class: "XII B", joinDate: "2023-07-15", attendance: 90 }, // Rajin (Pas)
    { id: 109, nis: "2023009", name: "Alumni Indra (24/25)", class: "XII A", joinDate: "2023-07-15", attendance: 65 }, // Jarang
    { id: 110, nis: "2023010", name: "Alumni Joko (24/25)", class: "XII A", joinDate: "2023-07-15", attendance: 89 }, // Hampir Rajin
];

const MOCK_HISTORY_23_24: AdvisorMember[] = [
    { id: 201, nis: "2022001", name: "Alumni Kiki (23/24)", class: "XII A", joinDate: "2022-07-15", attendance: 100 }, // Perfect
    { id: 202, nis: "2022002", name: "Alumni Lia (23/24)", class: "XII A", joinDate: "2022-07-15", attendance: 98 }, // Rajin
    { id: 203, nis: "2022003", name: "Alumni Mira (23/24)", class: "XII B", joinDate: "2022-07-15", attendance: 94 }, // Rajin
    { id: 204, nis: "2022004", name: "Alumni Nina (23/24)", class: "XII B", joinDate: "2022-07-15", attendance: 91 }, // Rajin
    { id: 205, nis: "2022005", name: "Alumni Omar (23/24)", class: "XII A", joinDate: "2022-07-15", attendance: 80 }, // Average
    { id: 206, nis: "2022006", name: "Alumni Putri (23/24)", class: "XII A", joinDate: "2022-07-15", attendance: 75 }, // Average
    { id: 207, nis: "2022007", name: "Alumni Qori (23/24)", class: "XII B", joinDate: "2022-07-15", attendance: 60 }, // Low
    { id: 208, nis: "2022008", name: "Alumni Rian (23/24)", class: "XII B", joinDate: "2022-07-15", attendance: 88 }, // Average
    { id: 209, nis: "2022009", name: "Alumni Sari (23/24)", class: "XII A", joinDate: "2022-07-15", attendance: 89 }, // Hampir Rajin
    { id: 210, nis: "2022010", name: "Alumni Tina (23/24)", class: "XII A", joinDate: "2022-07-15", attendance: 92 }, // Rajin
    { id: 211, nis: "2022011", name: "Alumni Usman (23/24)", class: "XII B", joinDate: "2022-07-15", attendance: 95 }, // Rajin
    { id: 212, nis: "2022012", name: "Alumni Vivi (23/24)", class: "XII B", joinDate: "2022-07-15", attendance: 40 }, // Sangat Jarang
];

// ============================================
// TYPES
// ============================================

export interface AdvisorDashboardStats {
    totalMembers: number;
    lastAttendancePresent: number;
    averageAttendance: number;
    totalMeetings: number;
    activeStudents: number;
    needsAttention: number;
}

export interface AdvisorMember {
    id: number;
    nis: string;
    name: string;
    class: string;
    joinDate: string;
    attendance: number;
}

// Profile Related Interfaces
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
    profilePicture: string; // compatibility alias
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

// Attendance Related Interfaces
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
        status: string;
    };
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

// ============================================
// SERVICE EXPORTS
// ============================================

export const advisorService = {
    // ========================================
    // DASHBOARD & OPERATIONAL
    // ========================================

    // ========================================
    // DASHBOARD & OPERATIONAL
    // ========================================

    getDashboardStats: async (
        params: { academicYear?: string; semester?: string } = {},
    ): Promise<AdvisorDashboardStats> => {
        const { academicYear, semester } = params;

        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );

            // Simulate different stats for past years
            if (academicYear && academicYear !== '2025/2026') {
                return {
                    totalMembers: 30, // Less members in past
                    lastAttendancePresent: 28,
                    averageAttendance: 88,
                    totalMeetings: 10,
                    activeStudents: 25,
                    needsAttention: 2,
                };
            }

            // Apply Semester Logic to targetMembers (Same as getMembers)
            if (semester === "2") {
                targetMembers = targetMembers.map(m => ({
                    ...m,
                    attendance: Math.max(0, m.attendance - 5) // Milder drop (5%)
                }));
            } else if (semester === "all") { // Note: '1 Tahun Penuh' value is 'all'
                targetMembers = targetMembers.map(m => ({
                    ...m,
                    attendance: Math.round(Math.max(0, m.attendance - 2.5)) // Round to integer
                }));
            }

            // Calculate stats dynamically from the filtered/modified data
            const totalMembers = targetMembers.length;
            const avgAttendance = Math.round(targetMembers.reduce((acc, m) => acc + m.attendance, 0) / (totalMembers || 1));
            const activeStudents = targetMembers.filter(m => m.attendance >= 90).length;
            const needsAttention = targetMembers.filter(m => m.attendance < 75).length;

            return {
                totalMembers,
                lastAttendancePresent: Math.round(totalMembers * 0.9), // rough estimate
                averageAttendance: avgAttendance,
                totalMeetings: 12,
                activeStudents: 38,
                needsAttention: 7,
            };
        }

        // ===== REAL API IMPLEMENTATION =====
        const queryParams = new URLSearchParams();
        if (academicYear) queryParams.append('academic_year', academicYear);
        if (semester && semester !== 'all')
            queryParams.append('semester', semester);

        const response = await fetch(
            `${ADVISOR_API_URL}/dashboard/stats?${queryParams.toString()}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            },
        );

        if (!response.ok) {
            if (response.status === 404) {
                console.warn(
                    'Dashboard stats endpoint not found (404). Using fallback data.',
                );
                return {
                    totalMembers: 0,
                    lastAttendancePresent: 0,
                    averageAttendance: 0,
                    totalMeetings: 0,
                    activeStudents: 0,
                    needsAttention: 0,
                };
            }
            await handleApiError(response);
        }
        const result = await response.json();
        return result.data;
    },

    getUpcomingSchedule: async (): Promise<any[]> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );
            return [
                {
                    id: 1,
                    day: 'Jumat',
                    date: '26 Desember 2025',
                    time: '14:00 - 16:00',
                },
                {
                    id: 2,
                    day: 'Jumat',
                    date: '09 Januari 2026',
                    time: '14:00 - 16:00',
                },
            ];
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/dashboard/schedule`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.warn(
                    'Upcoming schedule endpoint not found (404). Using fallback data.',
                );
                return [];
            }
            await handleApiError(response);
        }
        const result = await response.json();
        return result.data;
    },

    getRecentActivities: async (): Promise<any[]> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );
            return [
                {
                    id: 1,
                    day: 'Jumat',
                    date: '20 Des 2025',
                    time: '14:00 - 16:00',
                    attendance: 93,
                },
                {
                    id: 2,
                    day: 'Jumat',
                    date: '13 Des 2025',
                    time: '14:00 - 16:30',
                    attendance: 89,
                },
                {
                    id: 3,
                    day: 'Jumat',
                    date: '06 Des 2025',
                    time: '14:00 - 16:00',
                    attendance: 84,
                },
            ];
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(
            `${ADVISOR_API_URL}/dashboard/recent-activities`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            },
        );

        if (!response.ok) {
            if (response.status === 404) {
                console.warn(
                    'Recent activities endpoint not found (404). Using fallback data.',
                );
                return [];
            }
            await handleApiError(response);
        }
        const result = await response.json();
        return result.data;
    },

    // ========================================
    // MEMBER MANAGEMENT
    // ========================================

    getMembers: async (
        params: {
            academicYear?: string;
            class?: string;
            search?: string;
            page?: number;
            limit?: number;
            semester?: string;
        } = {},
    ): Promise<{
        data: AdvisorMember[];
        meta: { currentPage: number; totalPages: number; totalItems: number };
    }> => {
        const {
            academicYear = '2025/2026',
            class: classFilter,
            search,
            page = 1,
            limit = 10,
            semester,
        } = params;

        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );

            // Base Mock Data
            let mockMembers = [
                {
                    id: 1,
                    nis: '2022001',
                    name: 'Andi Wijaya',
                    class: 'XII A',
                    joinDate: '2024-07-15',
                    attendance: 92,
                },
                {
                    id: 2,
                    nis: '2022002',
                    name: 'Rina Kusuma',
                    class: 'XI A',
                    joinDate: '2024-07-15',
                    attendance: 88,
                },
                {
                    id: 3,
                    nis: '2022003',
                    name: 'Doni Pratama',
                    class: 'XI B',
                    joinDate: '2024-07-20',
                    attendance: 95,
                },
                {
                    id: 4,
                    nis: '2022004',
                    name: 'Siti Aminah',
                    class: 'XII B',
                    joinDate: '2024-07-15',
                    attendance: 78,
                },
                {
                    id: 5,
                    nis: '2022005',
                    name: 'Budi Santoso',
                    class: 'X A',
                    joinDate: '2024-08-01',
                    attendance: 85,
                },
                {
                    id: 6,
                    nis: '2022006',
                    name: 'Dewi Lestari',
                    class: 'XII A',
                    joinDate: '2024-07-15',
                    attendance: 45,
                },
                {
                    id: 7,
                    nis: '2022007',
                    name: 'Eko Prasetyo',
                    class: 'XI A',
                    joinDate: '2024-07-20',
                    attendance: 90,
                },
                {
                    id: 8,
                    nis: '2022008',
                    name: 'Fitri Handayani',
                    class: 'XI B',
                    joinDate: '2024-08-05',
                    attendance: 82,
                },
                {
                    id: 9,
                    nis: '2022009',
                    name: 'Gilang Ramadhan',
                    class: 'XII B',
                    joinDate: '2024-07-15',
                    attendance: 88,
                },
                {
                    id: 10,
                    nis: '2022010',
                    name: 'Hana Safitri',
                    class: 'X A',
                    joinDate: '2024-08-10',
                    attendance: 91,
                },
                {
                    id: 11,
                    nis: '2022011',
                    name: 'Irfan Hakim',
                    class: 'X B',
                    joinDate: '2024-08-12',
                    attendance: 87,
                },
                {
                    id: 12,
                    nis: '2022012',
                    name: 'Julia Permata',
                    class: 'XI A',
                    joinDate: '2024-07-18',
                    attendance: 93,
                },
                {
                    id: 13,
                    nis: '2022013',
                    name: 'Kevin Anggara',
                    class: 'XI B',
                    joinDate: '2024-07-22',
                    attendance: 76,
                },
                {
                    id: 14,
                    nis: '2022014',
                    name: 'Luna Maya',
                    class: 'XII A',
                    joinDate: '2024-07-15',
                    attendance: 89,
                },
                {
                    id: 15,
                    nis: '2022015',
                    name: 'Mario Bros',
                    class: 'X B',
                    joinDate: '2024-08-15',
                    attendance: 95,
                },
            ];

            // 0. Filter by Academic Year (Mock Logic)
            if (academicYear !== '2025/2026') {
                // Return empty or different data for past years to simulate history
                // For demo purposes, we just return empty to show "No Data" effect or a few dummy alumni
                mockMembers = [
                    {
                        id: 99,
                        nis: '2021001',
                        name: 'Alumni Budi (24/25)',
                        class: 'XII A',
                        joinDate: '2023-07-15',
                        attendance: 100,
                    },
                ];
            }

            // 0.5 Filter by Semester (Mock Logic - Simulate different attendance)
            if (semester && semester === '2') {
                // Adjust attendance slightly to show difference between semesters
                mockMembers = mockMembers.map((m) => ({
                    ...m,
                    attendance: Math.max(0, m.attendance - 10), // Simulate generic drop in semester 2 for demo
                }));
            }
            // Semester 1 (Default): Uses Base Data (Highest)

            // 1. Filter by Search
            if (search) {
                const lowerSearch = search.toLowerCase();
                mockMembers = mockMembers.filter(
                    (m) =>
                        m.name.toLowerCase().includes(lowerSearch) ||
                        m.nis.includes(lowerSearch),
                );
            }

            // 2. Filter by Class
            if (classFilter && classFilter !== 'all') {
                mockMembers = mockMembers.filter(
                    (m) => m.class === classFilter,
                );
            }

            // 3. Pagination
            const totalItems = mockMembers.length;
            const totalPages = Math.ceil(totalItems / limit);
            const startIndex = (page - 1) * limit;
            const paginatedData = mockMembers.slice(
                startIndex,
                startIndex + limit,
            );

            return {
                data: paginatedData,
                meta: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                },
            };
        }

        // ===== REAL API IMPLEMENTATION =====
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            academic_year: academicYear,
            ...(semester && semester !== 'all' && { semester }), // Add semester param if not 'all'
            ...(search && { search }),
            ...(classFilter && classFilter !== 'all' && { class: classFilter }),
        });

        const response = await fetch(
            `${ADVISOR_API_URL}/members?${queryParams.toString()}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            },
        );

        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result; // Assuming result structure is { success: true, data: [...], meta: { ... } }
    },

    getMemberDetail: async (id: number): Promise<AdvisorMember> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );

            // Same mock data as getMembers (subset for consistency)
            const mockMembers = [
                {
                    id: 1,
                    nis: '2022001',
                    name: 'Andi Wijaya',
                    class: 'XII A',
                    joinDate: '2024-07-15',
                    attendance: 92,
                },
                {
                    id: 2,
                    nis: '2022002',
                    name: 'Rina Kusuma',
                    class: 'XI A',
                    joinDate: '2024-07-15',
                    attendance: 88,
                },
                {
                    id: 3,
                    nis: '2022003',
                    name: 'Doni Pratama',
                    class: 'XI B',
                    joinDate: '2024-07-20',
                    attendance: 95,
                },
                {
                    id: 4,
                    nis: '2022004',
                    name: 'Siti Aminah',
                    class: 'XII B',
                    joinDate: '2024-07-15',
                    attendance: 78,
                },
                {
                    id: 5,
                    nis: '2022005',
                    name: 'Budi Santoso',
                    class: 'X A',
                    joinDate: '2024-08-01',
                    attendance: 85,
                },
                {
                    id: 6,
                    nis: '2022006',
                    name: 'Dewi Lestari',
                    class: 'XII A',
                    joinDate: '2024-07-15',
                    attendance: 45,
                },
                {
                    id: 7,
                    nis: '2022007',
                    name: 'Eko Prasetyo',
                    class: 'XI A',
                    joinDate: '2024-07-20',
                    attendance: 90,
                },
                {
                    id: 8,
                    nis: '2022008',
                    name: 'Fitri Handayani',
                    class: 'XI B',
                    joinDate: '2024-08-05',
                    attendance: 82,
                },
                {
                    id: 9,
                    nis: '2022009',
                    name: 'Gilang Ramadhan',
                    class: 'XII B',
                    joinDate: '2024-07-15',
                    attendance: 88,
                },
                {
                    id: 10,
                    nis: '2022010',
                    name: 'Hana Safitri',
                    class: 'X A',
                    joinDate: '2024-08-10',
                    attendance: 91,
                },
                {
                    id: 11,
                    nis: '2022011',
                    name: 'Irfan Hakim',
                    class: 'X B',
                    joinDate: '2024-08-12',
                    attendance: 87,
                },
                {
                    id: 12,
                    nis: '2022012',
                    name: 'Julia Permata',
                    class: 'XI A',
                    joinDate: '2024-07-18',
                    attendance: 93,
                },
                {
                    id: 13,
                    nis: '2022013',
                    name: 'Kevin Anggara',
                    class: 'XI B',
                    joinDate: '2024-07-22',
                    attendance: 76,
                },
                {
                    id: 14,
                    nis: '2022014',
                    name: 'Luna Maya',
                    class: 'XII A',
                    joinDate: '2024-07-15',
                    attendance: 89,
                },
                {
                    id: 15,
                    nis: '2022015',
                    name: 'Mario Bros',
                    class: 'X B',
                    joinDate: '2024-08-15',
                    attendance: 95,
                },
            ];

            const member = mockMembers.find((m) => m.id === id);
            if (!member) throw new Error('Member not found');
            return member;
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/members/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result.data;
    },

    addMember: async (memberData: any) => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );
            return {
                success: true,
                data: { id: Math.floor(Math.random() * 1000), ...memberData },
            };
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/members`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(memberData),
        });

        if (!response.ok) await handleApiError(response);
        return await response.json();
    },

    deleteMember: async (memberId: number) => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );
            return { success: true };
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/members/${memberId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) await handleApiError(response);
        return await response.json();
    },

    // ========================================
    // ATTENDANCE MANAGEMENT
    // ========================================

    getAttendanceHistory: async (
        startDate?: string,
        endDate?: string,
    ): Promise<any[]> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );
            return [
                {
                    id: 1,
                    date: '2025-12-20',
                    studentStats: { present: 42, total: 45, percentage: 93 },
                    advisorStats: {
                        tutorName: 'Ahmad Fauzi, S.Pd',
                        startTime: '14:00',
                        endTime: '16:00',
                        status: 'hadir',
                    },
                },
                {
                    id: 2,
                    date: '2025-12-13',
                    studentStats: { present: 40, total: 45, percentage: 89 },
                    advisorStats: {
                        tutorName: 'Ahmad Fauzi, S.Pd',
                        startTime: '14:00',
                        endTime: '16:30',
                        status: 'hadir',
                    },
                },
                {
                    id: 3,
                    date: '2025-12-06',
                    studentStats: { present: 38, total: 45, percentage: 84 },
                    advisorStats: {
                        tutorName: 'Ahmad Fauzi, S.Pd',
                        startTime: '14:00',
                        endTime: '16:00',
                        status: 'hadir',
                    },
                },
                {
                    id: 4,
                    date: '2025-11-29',
                    studentStats: { present: 43, total: 45, percentage: 96 },
                    advisorStats: {
                        tutorName: 'Ahmad Fauzi, S.Pd',
                        startTime: '14:00',
                        endTime: '15:30',
                        status: 'hadir',
                    },
                },
            ];
        }

        // ===== REAL API IMPLEMENTATION =====
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await fetch(
            `${ADVISOR_API_URL}/attendance?${params}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            },
        );

        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result.data;
    },

    submitAttendance: async (data: any) => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );
            console.log('[Mock] Attendance submitted:', data);
            return { success: true, data: { id: 123 } };
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/attendance`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) await handleApiError(response);
        return await response.json();
    },

    // ========================================
    // PROFILE MANAGEMENT
    // ========================================

    /**
     * GET /extracurricular-advisor/profile
     * Fetch advisor profile data
     */
    getProfile: async (): Promise<AdvisorProfileData> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );
            return mockAdvisorData;
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/profile`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        const result: ApiResponse<AdvisorProfileData> = await response.json();
        return result.data;
    },

    /**
     * PUT /extracurricular-advisor/profile
     * Update advisor profile data
     */
    updateProfile: async (
        data: UpdateAdvisorProfileRequest,
    ): Promise<AdvisorProfileData> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );
            console.log('[Mock] Profile updated:', data);
            return { ...mockAdvisorData, ...data };
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        const result: ApiResponse<AdvisorProfileData> = await response.json();
        return result.data;
    },

    /**
     * POST /extracurricular-advisor/profile/avatar
     * Upload profile picture
     */
    uploadAvatar: async (file: File): Promise<AvatarUploadResponse> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );
            const mockUrl = URL.createObjectURL(file);
            console.log('[Mock] Avatar uploaded:', file.name);
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

        const response = await fetch(`${ADVISOR_API_URL}/profile/avatar`, {
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
    },

    /**
     * PUT /extracurricular-advisor/profile/password
     * Change user password
     */
    updatePassword: async (
        data: UpdatePasswordRequest,
    ): Promise<PasswordUpdateResponse> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) =>
                setTimeout(resolve, SIMULATED_DELAY_MS),
            );

            // Simulate password validation
            if (data.currentPassword === 'wrong') {
                const error = new Error(
                    'Kata sandi saat ini salah',
                ) as Error & { code: number };
                error.code = 400;
                throw error;
            }

            console.log('[Mock] Password updated');
            return {
                passwordLastChanged: new Date().toISOString(),
            };
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/profile/password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        const result: ApiResponse<PasswordUpdateResponse> =
            await response.json();
        return result.data;
    },
};
