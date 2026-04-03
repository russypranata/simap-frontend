import { UserRole } from '@/app/context/RoleContext';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'; // Default to true if not set

// Role mapping: backend role names -> frontend role names
const ROLE_MAP: Record<string, UserRole> = {
    subject_teacher: 'guru',
    picket_teacher: 'guru',
    homeroom_teacher: 'guru',
    extracurricular_tutor: 'tutor_ekskul',
    mutamayizin_coordinator: 'pj_mutamayizin',
    student: 'siswa',
    headmaster: 'admin',
    admin: 'admin',
    parent: 'orang_tua',
};

const normalizeRole = (rawRole: string | undefined): UserRole => {
    if (!rawRole) return null;
    const lower = rawRole.toLowerCase();
    return ROLE_MAP[lower] || (lower as UserRole);
};

export interface LoginRequest {
    username: string; // NIP, NIS, or specific username
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
        name: string;
        role: UserRole;
        avatar?: string;
    };
}

// Mock users for development
const MOCK_USERS: Record<string, LoginResponse['user']> = {
    guru: {
        id: '1',
        username: 'guru',
        name: 'Budi Santoso, S.Pd',
        role: 'guru',
    },
    siswa: { id: '2', username: 'siswa', name: 'Ahmad Fulan', role: 'siswa' },
    admin: { id: '3', username: 'admin', name: 'Administrator', role: 'admin' },
    ortu: { id: '4', username: 'ortu', name: 'Pak Fulan', role: 'orang_tua' },
    tutor: {
        id: '5',
        username: 'tutor',
        name: 'Kak Tutor',
        role: 'tutor_ekskul',
    },
    mutamayizin: {
        id: '6',
        username: 'mutamayizin',
        name: 'Ust. Mutamayizin',
        role: 'pj_mutamayizin',
    },
};

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        if (USE_MOCK) {
            console.log('🔐 [MOCK] Login attempt:', data.username);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

            // Check hardcoded credentials for mock
            const mockUser = MOCK_USERS[data.username.toLowerCase()];
            if (mockUser && data.password === '123') {
                const response: LoginResponse = {
                    token: 'mock-jwt-token-' + Date.now(),
                    user: mockUser,
                };
                // Simpan token di localStorage (idealnnya di HttpOnly cookie)
                if (typeof window !== 'undefined') {
                    localStorage.setItem('authToken', response.token);
                    localStorage.setItem('userRole', response.user.role || '');
                    localStorage.setItem(
                        'userData',
                        JSON.stringify(response.user),
                    );
                }
                return response;
            }

            // Fallback generic mock logic for unrecognized valid-looking inputs
            if (data.username === 'test' && data.password === '123') {
                // default to guru
                return {
                    token: 'mock-jwt-token-test',
                    user: MOCK_USERS['guru'],
                };
            }

            throw new Error('Username atau kata sandi salah');
        }

        // Real API Call
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal masuk ke sistem');
            }

            const result = await response.json();
            const payload = result.data;

            // Normalize role: lowercase + map backend names to frontend names
            // Backend returns "Siswa", "Guru", "extracurricular_tutor", etc.
            // Frontend expects "siswa", "guru", "tutor_ekskul", etc.
            const normalizedResult: LoginResponse = {
                token: payload.token,
                user: {
                    ...payload.user,
                    role: normalizeRole(payload.user.role),
                },
            };

            // Simpan token
            if (typeof window !== 'undefined') {
                localStorage.setItem('authToken', normalizedResult.token);
                localStorage.setItem(
                    'userRole',
                    normalizedResult.user.role || '',
                );
            }

            return normalizedResult;
        } catch (error) {
            throw error;
        }
    },

    async logout(): Promise<void> {
        if (USE_MOCK) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userData');
            }
            return;
        }

        try {
            const token =
                typeof window !== 'undefined'
                    ? localStorage.getItem('authToken')
                    : null;
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userData');
            }
        }
    },
};
