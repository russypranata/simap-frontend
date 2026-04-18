/**
 * Shared API client utilities for parent services.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
export const PARENT_API_URL = `${API_BASE_URL}/parent`;

export const getAuthHeaders = (): HeadersInit => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
    };
};

export const handleApiError = async (response: Response): Promise<never> => {
    let errorData: { message?: string; code?: number; errors?: Record<string, string[]> } = {};
    try {
        errorData = await response.json();
    } catch {
        // non-JSON response
    }
    const error = new Error(errorData.message || `HTTP ${response.status}`) as Error & {
        code: number;
        errors?: Record<string, string[]>;
    };
    error.code = errorData.code ?? response.status;
    error.errors = errorData.errors;
    throw error;
};

const BASE_URL = API_BASE_URL;

export interface AcademicYearSemester {
    id: string;
    name: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
}

export interface AcademicYearItem {
    id: string;
    name: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
    semesters: AcademicYearSemester[];
}

export const getAcademicYears = async (): Promise<AcademicYearItem[]> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const response = await fetch(`${BASE_URL}/academic-years?per_page=100`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });
    if (!response.ok) await handleApiError(response);
    const result = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result.data ?? []).map((item: Record<string, any>) => ({
        id: String(item.id),
        name: item.name ?? "",
        isActive: item.is_active ?? false,
        startDate: item.start_date ?? "",
        endDate: item.end_date ?? "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        semesters: (item.semesters ?? []).map((s: Record<string, any>) => ({
            id: String(s.id),
            name: s.name ?? "",
            isActive: s.is_active ?? false,
            startDate: s.start_date ?? "",
            endDate: s.end_date ?? "",
        })),
    }));
};
