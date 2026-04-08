// Members Service for Extracurricular Advisor

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const ADVISOR_API_URL = `${API_BASE_URL}/extracurricular-advisor`;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const SIMULATED_DELAY_MS = 1000;

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
    const error = new Error(errorData.message || `HTTP ${response.status}`) as Error & { code: number; errors?: Record<string, string[]> };
    error.code = errorData.code ?? response.status;
    error.errors = errorData.errors;
    throw error;
};

// ==================== TYPES ====================

export interface AdvisorMember {
    id: number;
    nis: string;
    name: string;
    class: string;
    joinDate: string;
    attendance: number;
    status: "Aktif" | "Nonaktif";
    inactiveDate?: string;
    inactiveReason?: string;
}

export interface MembersListResponse {
    data: AdvisorMember[];
    meta: { currentPage: number; totalPages: number; totalItems: number };
}

export interface GetMembersParams {
    academicYear?: string;
    class?: string;
    search?: string;
    page?: number;
    limit?: number;
    semester?: string;
    status?: string;
}

// ==================== MOCK DATA ====================

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
    { id: 901, nis: "2022901", name: "Kenji Satria (Ex)", class: "XI A", joinDate: "2024-07-15", attendance: 60, status: "Nonaktif", inactiveDate: "2024-10-15", inactiveReason: "Pindah Ekstrakurikuler ke Basket" },
    { id: 902, nis: "2022902", name: "Lina Marwah (Ex)", class: "X B", joinDate: "2024-07-20", attendance: 40, status: "Nonaktif", inactiveDate: "2024-09-01", inactiveReason: "Mengundurkan diri (Fokus Akademik)" },
];

const MOCK_HISTORY_24_25: AdvisorMember[] = [
    { id: 101, nis: "2022001", name: "Andi Wijaya", class: "XI A", joinDate: "2024-07-15", attendance: 98, status: "Aktif" },
    { id: 102, nis: "2022002", name: "Rina Kusuma", class: "X A", joinDate: "2024-07-15", attendance: 95, status: "Aktif" },
    { id: 103, nis: "2022003", name: "Doni Pratama", class: "X B", joinDate: "2024-07-15", attendance: 92, status: "Aktif" },
    { id: 104, nis: "2022004", name: "Siti Aminah", class: "XI B", joinDate: "2024-07-15", attendance: 88, status: "Aktif" },
    { id: 105, nis: "2023005", name: "Alumni Erik (Lulus)", class: "XII A", joinDate: "2023-07-15", attendance: 85, status: "Aktif" },
    { id: 106, nis: "2023006", name: "Alumni Fani (Lulus)", class: "XII A", joinDate: "2023-07-15", attendance: 78, status: "Aktif" },
];

const MOCK_HISTORY_23_24: AdvisorMember[] = [
    { id: 201, nis: "2022001", name: "Andi Wijaya", class: "X A", joinDate: "2023-07-15", attendance: 100, status: "Aktif" },
    { id: 204, nis: "2022004", name: "Siti Aminah", class: "X B", joinDate: "2023-07-15", attendance: 91, status: "Aktif" },
    { id: 211, nis: "2021001", name: "Alumni Senior 1", class: "XII A", joinDate: "2022-07-15", attendance: 95, status: "Aktif" },
];

export const MOCK_MEMBERS_ALL = [...MOCK_MEMBERS_DATA, ...MOCK_HISTORY_24_25, ...MOCK_HISTORY_23_24];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeMember = (d: Record<string, any>): AdvisorMember => ({
    id: d.id,
    nis: d.nis,
    name: d.name,
    class: d.class ?? d.class_name ?? d.kelas ?? "",
    joinDate: d.join_date ?? d.joinDate ?? "",
    attendance: d.attendance ?? d.attendance_percentage ?? 0,
    status: d.status,
    inactiveDate: d.inactive_date ?? d.inactiveDate,
    inactiveReason: d.inactive_reason ?? d.inactiveReason,
});

// ==================== SERVICE FUNCTIONS ====================

export const getMembers = async (params: GetMembersParams = {}): Promise<MembersListResponse> => {
    const {
        academicYear = "2025/2026",
        class: classFilter,
        search,
        page = 1,
        limit = 10,
        semester,
        status = "Aktif",
    } = params;

    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

        let mockMembers = [...MOCK_MEMBERS_DATA];
        if (academicYear === "2024/2025") mockMembers = [...MOCK_HISTORY_24_25];
        else if (academicYear === "2023/2024") mockMembers = [...MOCK_HISTORY_23_24];

        if (semester === "2") {
            mockMembers = mockMembers.map((m) => ({ ...m, attendance: Math.max(0, m.attendance - 5) }));
        } else if (!semester || semester === "all") {
            mockMembers = mockMembers.map((m) => ({ ...m, attendance: Math.round(Math.max(0, m.attendance - 2.5)) }));
        }

        if (search) {
            const lower = search.toLowerCase();
            mockMembers = mockMembers.filter(
                (m) => m.name.toLowerCase().includes(lower) || m.nis.includes(lower)
            );
        }
        if (classFilter && classFilter !== "all") {
            mockMembers = mockMembers.filter((m) => m.class === classFilter);
        }
        if (status && status !== "all") {
            mockMembers = mockMembers.filter((m) => m.status === status);
        }

        const totalItems = mockMembers.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const paginatedData = mockMembers.slice(startIndex, startIndex + limit);

        return { data: paginatedData, meta: { currentPage: page, totalPages, totalItems } };
    }

    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        academic_year: academicYear,
        ...(semester && semester !== "all" && { semester }),
        ...(search && { search }),
        ...(classFilter && classFilter !== "all" && { class: classFilter }),
        ...(status && status !== "all" && { status }),
    });

    const response = await fetch(`${ADVISOR_API_URL}/members?${queryParams.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();

    // Normalize Laravel pagination envelope to our MembersListResponse shape
    const meta = result.meta ?? result;
    return {
        data: (result.data ?? []).map(normalizeMember),
        meta: {
            currentPage: meta.current_page ?? meta.currentPage ?? page,
            totalPages: meta.last_page ?? meta.totalPages ?? 1,
            totalItems: meta.total ?? meta.totalItems ?? 0,
        },
    };
};

export const getMemberDetail = async (id: number): Promise<AdvisorMember> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        const member = MOCK_MEMBERS_ALL.find((m) => m.id === id);
        if (!member) throw new Error("Member not found");
        return member;
    }

    const response = await fetch(`${ADVISOR_API_URL}/members/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    return normalizeMember(result.data);
};

export interface AddMemberRequest {
    nis: string;
    join_date: string;
}

export const addMember = async (memberData: AddMemberRequest) => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        return { success: true, data: { id: Math.floor(Math.random() * 1000), ...memberData } };
    }

    const response = await fetch(`${ADVISOR_API_URL}/members`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(memberData),
    });
    if (!response.ok) await handleApiError(response);
    return await response.json();
};

export const deleteMember = async (memberId: number) => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        return { success: true };
    }

    const response = await fetch(`${ADVISOR_API_URL}/members/${memberId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!response.ok) await handleApiError(response);
    return await response.json();
};
