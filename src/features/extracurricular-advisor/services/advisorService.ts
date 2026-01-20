// Advisor Service
// This service handles all API interactions for the Extracurricular Advisor role

import {
    AdvisorProfileData,
    mockAdvisorData,
} from '../data/mockAdvisorData';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
// Use specific advisor API URL prefix
const ADVISOR_API_URL = `${API_BASE_URL}/extracurricular-advisor`;

// Development mode flag - defaulting to 'true' if not set, for safety
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const SIMULATED_DELAY_MS = 1000;

// ===== SHARED MOCK DATA =====
const MOCK_MEMBERS_DATA: AdvisorMember[] = [
    { id: 1, nis: "2022001", name: "Andi Wijaya", class: "XII A", joinDate: "2024-07-15", attendance: 92, status: "Aktif" },
    { id: 2, nis: "2022002", name: "Rina Kusuma", class: "XI A", joinDate: "2024-07-15", attendance: 88, status: "Aktif" },
    { id: 3, nis: "2022003", name: "Doni Pratama", class: "XI B", joinDate: "2024-07-20", attendance: 95, status: "Aktif" },
    { id: 4, nis: "2022004", name: "Siti Aminah", class: "XII B", joinDate: "2024-07-15", attendance: 78, status: "Aktif" },
    { id: 5, nis: "2022005", name: "Budi Santoso", class: "X A", joinDate: "2024-08-01", attendance: 85, status: "Aktif" },
    { id: 6, nis: "2022006", name: "Dewi Lestari", class: "XII A", joinDate: "2024-07-15", attendance: 45, status: "Aktif" },
    { id: 7, nis: "2022007", name: "Eko Prasetyo", class: "XI A", joinDate: "2024-07-20", attendance: 90, status: "Aktif" },
    { id: 8, nis: "2022008", name: "Fitri Handayani", class: "XI B", joinDate: "2024-08-05", attendance: 82, status: "Aktif" },
    { id: 9, nis: "2022009", name: "Gilang Ramadhan", class: "XII B", joinDate: "2024-07-15", attendance: 88, status: "Aktif" },
    { id: 10, nis: "2022010", name: "Hana Safitri", class: "X A", joinDate: "2024-08-10", attendance: 91, status: "Aktif" },
    { id: 11, nis: "2022011", name: "Irfan Hakim", class: "X B", joinDate: "2024-08-12", attendance: 87, status: "Aktif" },
    { id: 12, nis: "2022012", name: "Julia Permata", class: "XI A", joinDate: "2024-07-18", attendance: 93, status: "Aktif" },
    { id: 13, nis: "2022013", name: "Kevin Anggara", class: "XI B", joinDate: "2024-07-22", attendance: 76, status: "Aktif" },
    { id: 14, nis: "2022014", name: "Luna Maya", class: "XII A", joinDate: "2024-07-15", attendance: 89, status: "Aktif" },
    { id: 15, nis: "2022015", name: "Mario Bros", class: "X B", joinDate: "2024-08-15", attendance: 95, status: "Aktif" },
    // Inactive Members Examples for Audit Trail
    { 
        id: 901, 
        nis: "2022901", 
        name: "Kenji Satria (Ex)", 
        class: "XI A", 
        joinDate: "2024-07-15", 
        attendance: 60, 
        status: "Nonaktif",
        inactiveDate: "2024-10-15",
        inactiveReason: "Pindah Ekstrakurikuler ke Basket"
    },
    { 
        id: 902, 
        nis: "2022902", 
        name: "Lina Marwah (Ex)", 
        class: "X B", 
        joinDate: "2024-07-20", 
        attendance: 40, 
        status: "Nonaktif",
        inactiveDate: "2024-09-01",
        inactiveReason: "Mengundurkan diri (Fokus Akademik)"
    }
];

const MOCK_HISTORY_24_25: AdvisorMember[] = [
    // Same students as 25/26 but in previous class (Snapshot Proof)
    { id: 101, nis: "2022001", name: "Andi Wijaya", class: "XI A", joinDate: "2024-07-15", attendance: 98, status: "Aktif" }, // Was XII A
    { id: 102, nis: "2022002", name: "Rina Kusuma", class: "X A", joinDate: "2024-07-15", attendance: 95, status: "Aktif" }, // Was XI A
    { id: 103, nis: "2022003", name: "Doni Pratama", class: "X B", joinDate: "2024-07-15", attendance: 92, status: "Aktif" }, // Was XI B
    { id: 104, nis: "2022004", name: "Siti Aminah", class: "XI B", joinDate: "2024-07-15", attendance: 88, status: "Aktif" }, // Was XII B
    
    // Some students might have left or graduated, key is consistent NIS for those who stay
    { id: 105, nis: "2023005", name: "Alumni Erik (Lulus)", class: "XII A", joinDate: "2023-07-15", attendance: 85, status: "Aktif" }, 
    { id: 106, nis: "2023006", name: "Alumni Fani (Lulus)", class: "XII A", joinDate: "2023-07-15", attendance: 78, status: "Aktif" }, 
];

const MOCK_HISTORY_23_24: AdvisorMember[] = [
    // Andi Wijaya (NIS 2022001) in X A two years ago
    { id: 201, nis: "2022001", name: "Andi Wijaya", class: "X A", joinDate: "2023-07-15", attendance: 100, status: "Aktif" }, 
    
    // Siti Aminah (NIS 2022004) in X B two years ago
    { id: 204, nis: "2022004", name: "Siti Aminah", class: "X B", joinDate: "2023-07-15", attendance: 91, status: "Aktif" }, 

    // Old alumni
    { id: 211, nis: "2021001", name: "Alumni Senior 1", class: "XII A", joinDate: "2022-07-15", attendance: 95, status: "Aktif" }, 
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
    status: 'Aktif' | 'Nonaktif';
    inactiveDate?: string;
    inactiveReason?: string;
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
        duration: string;
        status: string;
    };
}

export interface AttendanceStudent {
    id: number;
    nis: string;
    name: string;
    class: string;
    status: string; // 'hadir' | 'sakit' | 'izin' | 'alpa'
    note?: string;
}

export interface AttendanceDetail extends AttendanceHistoryEntry {
    topic?: string;
    students: AttendanceStudent[];
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

// System Config Interfaces
export interface ActiveAcademicYear {
    academicYear: string; // e.g. "2025/2026"
    semester: string;     // e.g. "1" or "2"
    label: string;        // e.g. "Ganjil" or "Genap"
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
    // SYSTEM & CONFIGURATION
    // ========================================

    getActiveAcademicYear: async (): Promise<ActiveAcademicYear> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
            return {
                academicYear: "2025/2026",
                semester: "1",
                label: "Ganjil"
            };
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/academic-year/active`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result.data;
    },

    // ========================================
    // DASHBOARD & OPERATIONAL
    // ========================================

    // ========================================
    // DASHBOARD & OPERATIONAL
    // ========================================

    getDashboardStats: async (params: { academicYear?: string; semester?: string } = {}): Promise<AdvisorDashboardStats> => {
        const { academicYear, semester } = params;

        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
            
            // Determine which dataset to use
            let targetMembers = MOCK_MEMBERS_DATA;
            
            if (academicYear === "2024/2025") {
                targetMembers = MOCK_HISTORY_24_25;
            } else if (academicYear === "2023/2024") {
                targetMembers = MOCK_HISTORY_23_24;
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
                activeStudents,
                needsAttention
            };
        }

        // ===== REAL API IMPLEMENTATION =====
        const queryParams = new URLSearchParams();
        if (academicYear) queryParams.append('academic_year', academicYear);
        if (semester && semester !== 'all') queryParams.append('semester', semester);

        const response = await fetch(`${ADVISOR_API_URL}/dashboard/stats?${queryParams.toString()}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result.data;
    },

    getUpcomingSchedule: async (): Promise<{ id: number; day: string; date: string; time: string }[]> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
            return [
                { id: 1, day: "Jumat", date: "26 Desember 2025", time: "14:00 - 16:00" },
                { id: 2, day: "Jumat", date: "09 Januari 2026", time: "14:00 - 16:00" },
            ];
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/dashboard/schedule`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result.data;
    },

    getRecentActivities: async (): Promise<{ id: number; day: string; date: string; time: string; attendance: number }[]> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
            return [
                { id: 1, day: "Jumat", date: "20 Des 2025", time: "14:00 - 16:00", attendance: 93 },
                { id: 2, day: "Jumat", date: "13 Des 2025", time: "14:00 - 16:30", attendance: 89 },
                { id: 3, day: "Jumat", date: "06 Des 2025", time: "14:00 - 16:00", attendance: 84 },
            ];
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/dashboard/recent-activities`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result.data;
    },

    // ========================================
    // MEMBER MANAGEMENT
    // ========================================

    getMembers: async (params: { 
        academicYear?: string; 
        class?: string; 
        search?: string; 
        page?: number; 
        limit?: number;
        semester?: string;
        status?: string; // New: 'Aktif' | 'Nonaktif' | 'all'
    } = {}): Promise<{ data: AdvisorMember[]; meta: { currentPage: number; totalPages: number; totalItems: number } }> => {
        const { 
            academicYear = "2025/2026", 
            class: classFilter, 
            search, 
            page = 1, 
            limit = 10,
            semester,
            status = 'Aktif' // Default to viewing only active members
        } = params;

        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
            
            // Base Mock Data - Use Shared Source
            let mockMembers = [...MOCK_MEMBERS_DATA];

            // 0. Filter by Academic Year (Mock Logic)
            if (academicYear === "2024/2025") {
                mockMembers = [...MOCK_HISTORY_24_25];
            } else if (academicYear === "2023/2024") {
                mockMembers = [...MOCK_HISTORY_23_24];
            }

            // 0.5 Filter by Semester (Mock Logic - Simulate realistic variations)
            if (semester === "2") {
                // Semester 2: Everyone gets slightly less diligent (Attendance drops 5%)
                mockMembers = mockMembers.map(m => ({
                    ...m,
                    attendance: Math.max(0, m.attendance - 5) 
                }));
            } else if (semester === "all" || !semester) {
                 // Full Year: Average of Sem 1 (Base) and Sem 2 (Base - 5)
                 // Result: Attendance drops 2.5% from Base
                 mockMembers = mockMembers.map(m => ({
                    ...m,
                    attendance: Math.round(Math.max(0, m.attendance - 2.5)) // Round to integer
                }));
            }
            // Semester 1 (Default): Uses Base Data (Highest)

            // 1. Filter by Search
            if (search) {
                const lowerSearch = search.toLowerCase();
                mockMembers = mockMembers.filter(m => 
                    m.name.toLowerCase().includes(lowerSearch) || 
                    m.nis.includes(lowerSearch)
                );
            }

            // 2. Filter by Class
            if (classFilter && classFilter !== "all") {
                mockMembers = mockMembers.filter(m => m.class === classFilter);
            }

            // 3. Filter by Status (New Audit Trail Logic)
            if (status && status !== "all") {
                 mockMembers = mockMembers.filter(m => m.status === status);
            }

            // 3.5 Pagination
            const totalItems = mockMembers.length;
            const totalPages = Math.ceil(totalItems / limit);
            const startIndex = (page - 1) * limit;
            const paginatedData = mockMembers.slice(startIndex, startIndex + limit);

            return {
                data: paginatedData,
                meta: {
                    currentPage: page,
                    totalPages,
                    totalItems
                }
            };
        }

        // ===== REAL API IMPLEMENTATION =====
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            academic_year: academicYear,
            ...(semester && semester !== "all" && { semester }), // Add semester param if not 'all'
            ...(search && { search }),
            ...(classFilter && classFilter !== "all" && { class: classFilter }),
        });

        const response = await fetch(`${ADVISOR_API_URL}/members?${queryParams.toString()}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result; // Assuming result structure is { success: true, data: [...], meta: { ... } }
    },

    getMemberDetail: async (id: number): Promise<AdvisorMember> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
             await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
             
             // Same mock data as getMembers (subset for consistency)
             const mockMembers = [...MOCK_MEMBERS_DATA, ...MOCK_HISTORY_24_25, ...MOCK_HISTORY_23_24];

             const member = mockMembers.find(m => m.id === id);
             if (!member) throw new Error("Member not found");
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

    addMember: async (memberData: Partial<AdvisorMember>) => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
            return { success: true, data: { id: Math.floor(Math.random() * 1000), ...memberData } };
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
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
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

    getAttendanceHistory: async (startDate?: string, endDate?: string): Promise<AttendanceHistoryEntry[]> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
            return [
                {
                    id: 1,
                    date: "2025-12-20",
                    studentStats: { present: 14, total: 15, percentage: 93 },
                    advisorStats: { tutorName: "Ahmad Fauzi, S.Pd", startTime: "14:00", endTime: "16:00", duration: "2j 0m", status: "hadir" }
                },
                {
                    id: 2,
                    date: "2025-12-13",
                    studentStats: { present: 13, total: 15, percentage: 87 },
                    advisorStats: { tutorName: "Ahmad Fauzi, S.Pd", startTime: "14:00", endTime: "16:30", duration: "2j 30m", status: "hadir" }
                },
                {
                    id: 3,
                    date: "2025-12-06",
                    studentStats: { present: 12, total: 15, percentage: 80 },
                    advisorStats: { tutorName: "Ahmad Fauzi, S.Pd", startTime: "14:00", endTime: "16:00", duration: "2j 0m", status: "hadir" }
                },
                 {
                    id: 4,
                    date: "2025-11-29",
                    studentStats: { present: 15, total: 15, percentage: 100 },
                    advisorStats: { tutorName: "Ahmad Fauzi, S.Pd", startTime: "14:00", endTime: "15:30", duration: "1j 30m", status: "hadir" }
                },
            ];
        }

        // ===== REAL API IMPLEMENTATION =====
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await fetch(`${ADVISOR_API_URL}/attendance?${params}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result.data;
    },

    getAttendanceDetail: async (id: number): Promise<AttendanceDetail> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

            // 1. Get the base history entry to ensure stats match
            const history = await advisorService.getAttendanceHistory();
            const entry = history.find(h => h.id === Number(id));

            if (!entry) {
                throw new Error("Data presensi tidak ditemukan");
            }

            // 2. Generate student list that matches the stats
            // We'll use the MOCK_MEMBERS_DATA as a base
            const { present, total } = entry.studentStats;
            
            // Calculate how many non-present needed
            const nonPresentCount = total - present;
            
            // Distribute non-present statuses (simplified logic)
            // If we have non-present, let's make some sick, some permit, some absent
            let sickCount = 0;
            let permitCount = 0;
            let absentCount = 0;

            if (nonPresentCount > 0) {
                if (nonPresentCount === 1) {
                    absentCount = 1;
                } else {
                     sickCount = Math.floor(nonPresentCount * 0.4); // 40% sick
                     permitCount = Math.floor(nonPresentCount * 0.4); // 40% permit
                     absentCount = nonPresentCount - sickCount - permitCount; // rest absent
                }
            }

            // Create status map for deterministic result based on ID
            // We use MOCK_MEMBERS_DATA keys to assign status
            const students: AttendanceStudent[] = MOCK_MEMBERS_DATA.slice(0, total).map((member, index) => {
                let status = "hadir";
                
                // Assign non-present statuses to the last few members
                if (index >= present) {
                    const relativeIndex = index - present;
                    if (relativeIndex < sickCount) status = "sakit";
                    else if (relativeIndex < sickCount + permitCount) status = "izin";
                    else status = "alpa";
                }

                return {
                    id: member.id,
                    nis: member.nis,
                    name: member.name,
                    class: member.class,
                    status,
                };
            });
            
            // Shuffle slightly based on ID so different dates look different? 
            // For now, simple deterministic assignment is safer for verifying counts.

            return {
                ...entry,
                topic: "Kegiatan Rutin Ekstrakurikuler",
                students: students
            };
        }

        // ===== REAL API IMPLEMENTATION =====
        const response = await fetch(`${ADVISOR_API_URL}/attendance/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result.data;
    },

    submitAttendance: async (data: CreateAttendanceRequest) => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
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
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
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
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
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
    uploadAvatar: async (
        file: File,
    ): Promise<AvatarUploadResponse> => {
        // ===== MOCK IMPLEMENTATION =====
        if (USE_MOCK_DATA) {
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
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
            await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

            // Simulate password validation
            if (data.currentPassword === 'wrong') {
                const error = new Error('Kata sandi saat ini salah') as Error & { code: number };
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

        const result: ApiResponse<PasswordUpdateResponse> = await response.json();
        return result.data;
    }
};
