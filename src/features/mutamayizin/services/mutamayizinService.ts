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

export interface AchievementPhoto {
    id: number;
    url: string;
}

export interface AchievementDetail extends Achievement {
    studentProfileId: number;
    academicYearId: number;
    eventName?: string;
    organizer?: string;
    photos: AchievementPhoto[];
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
    semester?: string;
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
    semester?: string;
    page?: number;
}

export interface AttendanceRecord {
    id: number;
    nis: string;
    name: string;
    class: string;
    status: string;
    note?: string;
}

export interface AttendanceSessionStats {
    present: number;
    total: number;
    percentage: number;
}

export interface AttendanceSessionDetail {
    id: number;
    date: string;
    start_time?: string;
    end_time?: string;
    topic?: string;
    stats: AttendanceSessionStats;
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
    photo?: File;
}

export type UpdateAchievementData = Partial<Omit<CreateAchievementData, 'photo'> & { photo?: File | null }>;

export interface Member {
    id: number;
    nis: string;
    name: string;
    class: string;
    email: string;
    phone: string;
    ekstrakurikuler: string[];
    status: "active" | "inactive";
    photo: string | null;
    joinDate: string;
}

export interface MemberDetail extends Omit<Member, 'ekstrakurikuler'> {
    ekstrakurikuler: { id: number; name: string }[];
    academicYears: { id: number; name: string; joinDate: string }[];
}

export interface MemberParams {
    academic_year_id?: number | string;
    ekstrakurikuler_id?: number | string;
    status?: string;
    search?: string;
    page?: number;
    per_page?: number;
}

export interface CreateMemberData {
    student_profile_id: number;
    ekstrakurikuler_id: number;
    academic_year_id: number;
    join_date: string;
}

export interface ApiResult<T> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: number;
        errors?: Record<string, string[]>;
    };
}

export interface ExtracurricularOption {
    id: number;
    name: string;
}

export interface RegularScheduleItem {
    id: number;
    day: string;
    time_start: string;
    time_end: string;
}

export interface CreateScheduleData {
    day: string;
    time_start: string;
    time_end: string;
}

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
    const hasFile = data.photo instanceof File;
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    console.log('createAchievement called', { 
        hasFile, 
        photoName: data.photo instanceof File ? data.photo.name : null,
        photoSize: data.photo instanceof File ? data.photo.size : null,
        photoType: data.photo instanceof File ? data.photo.type : null
    });

    if (hasFile) {
        const formData = new FormData();
        formData.append("student_profile_id", String(data.student_profile_id));
        formData.append("academic_year_id", String(data.academic_year_id));
        formData.append("competition_name", data.competition_name);
        formData.append("rank", data.rank);
        formData.append("level", data.level);
        formData.append("date", data.date);
        if (data.semester !== undefined) formData.append("semester", String(data.semester));
        if (data.category) formData.append("category", data.category);
        if (data.event_name) formData.append("event_name", data.event_name);
        if (data.organizer) formData.append("organizer", data.organizer);
        formData.append("photo", data.photo!);

        const response = await fetch(`${MUTAMAYIZIN_API_URL}/achievements`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error response:', errorData);
            const error = new Error(errorData.message || `HTTP ${response.status}`) as Error & { code: number; errors?: Record<string, string[]> };
            error.code = response.status;
            error.errors = errorData.errors;
            throw error;
        }
        const result = await response.json();
        console.log('Success response:', result);
        return result.data;
    }

    const { photo: _, ...jsonData } = data;
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/achievements`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(jsonData),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const updateAchievement = async (
    id: number,
    data: UpdateAchievementData
): Promise<AchievementDetail> => {
    const hasFile = data.photo instanceof File;
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (hasFile) {
        const formData = new FormData();
        if (data.student_profile_id !== undefined) formData.append("student_profile_id", String(data.student_profile_id));
        if (data.academic_year_id !== undefined) formData.append("academic_year_id", String(data.academic_year_id));
        if (data.competition_name !== undefined) formData.append("competition_name", data.competition_name);
        if (data.rank !== undefined) formData.append("rank", data.rank);
        if (data.level !== undefined) formData.append("level", data.level.toLowerCase());
        if (data.date !== undefined) formData.append("date", data.date);
        if (data.semester !== undefined) formData.append("semester", String(data.semester));
        if (data.category !== undefined) formData.append("category", data.category);
        if (data.event_name !== undefined) formData.append("event_name", data.event_name);
        if (data.organizer !== undefined) formData.append("organizer", data.organizer);
        formData.append("photo", data.photo!);

        const response = await fetch(`${MUTAMAYIZIN_API_URL}/achievements/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: formData,
        });
        if (!response.ok) await handleApiError(response);
        const result = await response.json();
        return result.data;
    }

    const { photo: _, ...jsonData } = data as UpdateAchievementData & { photo?: File | null };
    if (jsonData.level) jsonData.level = jsonData.level.toLowerCase();
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/achievements/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(jsonData),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const uploadAchievementPhoto = async (id: number, photo: File): Promise<string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const formData = new FormData();
    formData.append("photo", photo);
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/achievements/${id}/photo`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        body: formData,
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data.photo;
};

export const deleteAchievementPhoto = async (photoId: number): Promise<void> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/achievement-photos/${photoId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    if (!response.ok) await handleApiError(response);
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

export const getMembers = async (
    params?: MemberParams
): Promise<PaginatedResponse<Member>> => {
    const queryParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, String(value));
            }
        });
    }
    const response = await fetch(
        `${MUTAMAYIZIN_API_URL}/members?${queryParams.toString()}`,
        { method: "GET", headers: getAuthHeaders() }
    );
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return { data: result.data, meta: result.meta };
};

export const getMember = async (id: number): Promise<MemberDetail> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/members/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const createMember = async (
    data: CreateMemberData
): Promise<ApiResult<Member>> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/members`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    // Check if API returned success:false (even with HTTP 200)
    if (!response.ok || result.success === false) {
        return {
            success: false,
            error: {
                message: result.message || `HTTP ${response.status}`,
                code: response.status,
                errors: result.errors,
            },
        };
    }
    
    return {
        success: true,
        data: result.data,
    };
};

export const updateMember = async (
    id: number,
    data: Partial<Omit<CreateMemberData, 'student_profile_id'>>
): Promise<Member> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/members/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    
    let errorData: { message?: string; code?: number; errors?: Record<string, string[]> } = {};
    try {
        errorData = await response.json();
    } catch {
        // Non-JSON response
    }
    
    if (!response.ok) {
        const error = new Error(errorData.message || `HTTP ${response.status}`) as Error & {
            code: number;
            errors?: Record<string, string[]>;
        };
        error.code = errorData.code ?? response.status;
        error.errors = errorData.errors;
        throw error;
    }
    
    const result = await response.json();
    return result.data;
};

export const deleteMember = async (id: number): Promise<void> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/members/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
        let errorData: { message?: string; code?: number; errors?: Record<string, string[]> } = {};
        try {
            errorData = await response.json();
        } catch {
            // Non-JSON response
        }
        const error = new Error(errorData.message || `HTTP ${response.status}`) as Error & {
            code: number;
            errors?: Record<string, string[]>;
        };
        error.code = errorData.code ?? response.status;
        error.errors = errorData.errors;
        throw error;
    }
};

export const getExtracurricularsForMember = async (
    academicYearId?: number | string
): Promise<ExtracurricularOption[]> => {
    const queryParams = new URLSearchParams();
    if (academicYearId !== undefined && academicYearId !== null && academicYearId !== "") {
        queryParams.append("academic_year_id", String(academicYearId));
    }
    const response = await fetch(
        `${MUTAMAYIZIN_API_URL}/extracurriculars-list?${queryParams.toString()}`,
        { method: "GET", headers: getAuthHeaders() }
    );
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const getEkskulSchedules = async (tutorId: number): Promise<RegularScheduleItem[]> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/extracurriculars/${tutorId}/schedules`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const createEkskulSchedule = async (tutorId: number, data: CreateScheduleData): Promise<RegularScheduleItem> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/extracurriculars/${tutorId}/schedules`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const updateEkskulSchedule = async (tutorId: number, scheduleId: number, data: Partial<CreateScheduleData>): Promise<RegularScheduleItem> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/extracurriculars/${tutorId}/schedules/${scheduleId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return result.data;
};

export const deleteEkskulSchedule = async (tutorId: number, scheduleId: number): Promise<void> => {
    const response = await fetch(`${MUTAMAYIZIN_API_URL}/extracurriculars/${tutorId}/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
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
    uploadAchievementPhoto,
    deleteAchievementPhoto,
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
    getMembers,
    getMember,
    createMember,
    updateMember,
    deleteMember,
    getExtracurricularsForMember,
    getEkskulSchedules,
    createEkskulSchedule,
    updateEkskulSchedule,
    deleteEkskulSchedule,
};
