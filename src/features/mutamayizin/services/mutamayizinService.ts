// Mutamayizin Coordinator Service
// Real API implementation — no mock data

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const MUTAMAYIZIN_API_URL = `${API_BASE_URL}/mutamayizin`;

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
    const error = new Error(errorData.message || `HTTP ${response.status}`) as Error & {
        code: number;
        errors?: Record<string, string[]>;
    };
    error.code = errorData.code ?? response.status;
    error.errors = errorData.errors;
    throw error;
};

// ==================== TYPES ====================

export interface MutamayizinDashboardStats {
    totalStudents: number;
    activeStudents: number;
    totalAchievements: number;
    totalEkskul: number;
    totalTutors: number;
    activeTutors: number;
}

export interface RecentAchievement {
    id: number;
    studentName: string;
    competitionName: string;
    rank: string;
    level: string;
    date: string;
}

export interface EkskulSummary {
    id: number;
    name: string;
    tutorName: string;
    memberCount: number;
    lastActivity: string | null;
}

export interface MutamayizinDashboardData {
    stats: MutamayizinDashboardStats;
    recentAchievements: RecentAchievement[];
    ekskulSummary: EkskulSummary[];
}

export interface Achievement {
    id: number;
    studentName: string;
    studentNis: string;
    className: string;
    competitionName: string;
    category: string;
    rank: string;
    level: string;
    date: string;
    academicYear: string;
    semester: number;
}

export interface AchievementDetail extends Achievement {
    studentProfileId: number;
    academicYearId: number;
    eventName?: string;
    organizer?: string;
    photo?: string;
}

export interface AchievementParams {
    academic_year_id?: number | string;
    semester?: number | string;
    level?: string;
    category?: string;
    search?: string;
    page?: number;
    per_page?: number;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface ExtracurricularItem {
    id: number;
    name: string;
    tutorName: string;
    tutorNip: string;
    joinDate: string;
    memberCount: number;
    attendanceRate: number;
    lastActivity: string | null;
}

export interface ExtracurricularParams {
    academic_year_id?: number | string;
    page?: number;
}

export interface ExtracurricularMember {
    id: number;
    nis: string;
    name: string;
    class: string;
    attendanceRate: number;
}

export interface ExtracurricularDetail {
    id: number;
    name: string;
    tutorName: string;
    memberCount: number;
    attendanceRate: number;
    members: ExtracurricularMember[];
}

export interface AttendanceSession {
    id: number;
    date: string;
    topic?: string;
    presentCount: number;
    totalCount: number;
}

export interface AttendanceSessionParams {
    academic_year_id?: number | string;
    page?: number;
}

export interface AttendanceRecord {
    studentId: number;
    nis: string;
    name: string;
    status: string;
}

export interface AttendanceSessionDetail {
    id: number;
    date: string;
    topic?: string;
    records: AttendanceRecord[];
}

export interface TutorAttendanceItem {
    tutorId: number;
    tutorName: string;
    ekskulName: string;
    sessionCount: number;
    lastSession: string | null;
}

export interface TutorAttendanceParams {
    academic_year_id?: number | string;
}

export interface StudentOption {
    id: number;
    nis: string;
    name: string;
    class: string;
}

export interface AcademicYear {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface MutamayizinProfileData {
    name: string;
    email: string;
    phone: string;
    address: string;
    avatar: string | null;
    department: string;
    jobTitle: string;
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    address?: string;
    department?: string;
    job_title?: string;
}

export interface UpdatePasswordData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export interface CreateAchievementData {
    student_profile_id: number;
    academic_year_id: number;
    competition_name: string;
    rank: string;
    level: string;
    date: string;
    semester?: number;
    category?: string;
    event_name?: string;
    organizer?: string;
}

export type UpdateAchievementData = Partial<CreateAchievementData>;

// ==================== SERVICE FUNCTIONS ====================

export const getDashboard = async (): Promise<MutamayizinDashboardData> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/dashboard`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const getAchievements = async (
    params?: AchievementParams
): Promise<PaginatedResponse<Achievement>> => {
    const queryParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, String(value));
            }
        });
    }
    const response = await fetch(
        `${MUTAMAYIZIN_API_URL}/achievements?${queryParams.toString()}`,
        { method: "GET", headers: getAuthHeaders() }
    );
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return { data: result.data, meta: result.meta };
};

export const getAchievement = async (id: number): Promise<AchievementDetail> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/achievements/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const createAchievement = async (
    data: CreateAchievementData
): Promise<AchievementDetail> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/achievements`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const updateAchievement = async (
    id: number,
    data: UpdateAchievementData
): Promise<AchievementDetail> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/achievements/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const deleteAchievement = async (id: number): Promise<void> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/achievements/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
};

export const getExtracurriculars = async (
    params?: ExtracurricularParams
): Promise<ExtracurricularItem[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, String(value));
            }
        });
    }
    const response = await fetch(
        `${MUTAMAYIZIN_API_URL}/extracurriculars?${queryParams.toString()}`,
        { method: "GET", headers: getAuthHeaders() }
    );
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const getExtracurricularDetail = async (
    tutorId: number
): Promise<ExtracurricularDetail> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/extracurriculars/${tutorId}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const getAttendanceSessions = async (
    tutorId: number,
    params?: AttendanceSessionParams
): Promise<PaginatedResponse<AttendanceSession>> => {
    const queryParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, String(value));
            }
        });
    }
    const response = await fetch(
        `${MUTAMAYIZIN_API_URL}/extracurriculars/${tutorId}/attendance?${queryParams.toString()}`,
        { method: "GET", headers: getAuthHeaders() }
    );
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return { data: result.data, meta: result.meta };
};

export const getAttendanceSession = async (
    tutorId: number,
    sessionId: number
): Promise<AttendanceSessionDetail> => {
    const response = await fetch(
        `${MUTAMAYIZIN_API_URL}/extracurriculars/${tutorId}/attendance/${sessionId}`,
        { method: "GET", headers: getAuthHeaders() }
    );
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const getTutorAttendance = async (
    params?: TutorAttendanceParams
): Promise<TutorAttendanceItem[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, String(value));
            }
        });
    }
    const response = await fetch(
        `${MUTAMAYIZIN_API_URL}/tutor-attendance?${queryParams.toString()}`,
        { method: "GET", headers: getAuthHeaders() }
    );
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const getStudents = async (): Promise<StudentOption[]> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/students`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const getAcademicYears = async (): Promise<AcademicYear[]> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/academic-years`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const getProfile = async (): Promise<MutamayizinProfileData> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/profile`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const updateProfile = async (
    data: UpdateProfileData
): Promise<MutamayizinProfileData> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const updateAvatar = async (file: File): Promise<{ avatar: string }> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/profile/avatar`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: formData,
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const updatePassword = async (data: UpdatePasswordData): Promise<void> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/profile/password`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
};

// Named export object for backward compatibility
export const mutamayizinService = {
    getDashboard,
    getAchievements,
    getAchievement,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    getExtracurriculars,
    getExtracurricularDetail,
    getAttendanceSessions,
    getAttendanceSession,
    getTutorAttendance,
    getStudents,
    getAcademicYears,
    getProfile,
    updateProfile,
    updateAvatar,
    updatePassword,
};
