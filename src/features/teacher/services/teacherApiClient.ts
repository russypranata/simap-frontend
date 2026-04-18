const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
export const TEACHER_API_URL = `${API_BASE_URL}/teacher`;

export const getAuthHeaders = (): HeadersInit => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
};

export const getAuthHeadersFormData = (): HeadersInit => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
    };
};

export const handleApiError = async (response: Response): Promise<never> => {
    let errorData: { message?: string; code?: number; errors?: Record<string, string[]> } = {};
    try { errorData = await response.json(); } catch { /* non-JSON */ }
    const error = new Error(errorData.message || `HTTP ${response.status}`) as Error & {
        code: number; errors?: Record<string, string[]>;
    };
    error.code = errorData.code ?? response.status;
    error.errors = errorData.errors;
    throw error;
};
