/**
 * API Client Utility
 * Handles authentication, global error handling, and standardized response parsing.
 */

export interface ApiResponse<T> {
    code: number;
    status: string;
    message: string;
    data: T;
}

export interface ApiError {
    code: number;
    status: string;
    message: string;
    errors?: Record<string, string[]>;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('authToken');
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
            const error: ApiError = data || {
                code: response.status,
                status: 'error',
                message: response.statusText,
            };

            // Enhanced Error Object
            const customError = new Error(error.message) as Error & ApiError;
            customError.code = error.code;
            customError.status = error.status;
            customError.errors = error.errors;
            
            throw customError;
        }

        return (isJson ? data.data : data) as T;
    }

    private getHeaders(options: RequestInit = {}): HeadersInit {
        const headers: HeadersInit = {
            'Accept': 'application/json',
            ...(options.headers || {}),
        };

        const token = this.getToken();
        if (token) {
            (headers as any)['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async get<T>(path: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            method: 'GET',
            headers: this.getHeaders(options),
        });
        return this.handleResponse<T>(response);
    }

    async post<T>(path: string, body: any, options: RequestInit = {}): Promise<T> {
        const isFormData = body instanceof FormData;
        const headers = this.getHeaders(options);

        if (!isFormData) {
            (headers as any)['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            method: 'POST',
            headers,
            body: isFormData ? body : JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    async put<T>(path: string, body: any, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.getHeaders(options),
            },
            body: JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    async delete<T>(path: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            method: 'DELETE',
            headers: this.getHeaders(options),
        });
        return this.handleResponse<T>(response);
    }
}

export const apiClient = new ApiClient();
