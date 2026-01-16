'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import {
    authService,
    LoginResponse,
} from '@/features/auth/services/authService';

export type UserRole =
    | 'admin'
    | 'subject_teacher'
    | 'picket_teacher'
    | 'homeroom_teacher'
    | 'extracurricular_tutor'
    | 'mutamayizin_coordinator'
    | 'student'
    | 'headmaster'
    | 'parent'
    | 'guru'
    | 'siswa'
    | 'orang_tua'
    | 'tutor_ekskul'
    | null;

export type User = LoginResponse['user'];

interface RoleContextType {
    role: UserRole;
    user: User | null;
    setRole: (role: UserRole) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (role: UserRole) => void;
    logout: () => Promise<void>;
    isHomeroomTeacher: boolean;
    setIsHomeroomTeacher: (isHomeroom: boolean) => void;
    isPiketTeacher: boolean;
    setIsPiketTeacher: (isPiket: boolean) => void;
    updateUser: (data: Partial<User>) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
};

interface RoleProviderProps {
    children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
    const [role, setRoleState] = useState<UserRole>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isHomeroomTeacher, setIsHomeroomTeacher] = useState(false);
    const [isPiketTeacher, setIsPiketTeacher] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize role and user from localStorage on mount
    useEffect(() => {
        const initializeAuth = async () => {
            if (typeof window !== 'undefined') {
                const savedRole = localStorage.getItem('userRole') as UserRole;
                const savedUserData = localStorage.getItem('userData');
                const savedHomeroom = localStorage.getItem('isHomeroomTeacher');
                const savedPiket = localStorage.getItem('isPiketTeacher');

                if (savedRole) {
                    setRoleState(savedRole);
                    if (savedUserData) {
                        try {
                            setUser(JSON.parse(savedUserData));
                        } catch (e) {
                            console.error('Failed to parse userData', e);
                        }
                    }

                    if (
                        savedRole === 'subject_teacher' ||
                        savedRole === 'homeroom_teacher'
                    ) {
                        // Force true for guru/teachers to ensure Wali Kelas is visible
                        setIsHomeroomTeacher(true);
                        localStorage.setItem('isHomeroomTeacher', 'true');

                        // Initialize Piket role - Force true for demo/testing
                        const shouldBePiket = true; // savedPiket === 'true';
                        setIsPiketTeacher(shouldBePiket);
                        localStorage.setItem(
                            'isPiketTeacher',
                            String(shouldBePiket),
                        );
                    } else {
                        setIsHomeroomTeacher(savedHomeroom === 'true');
                        setIsPiketTeacher(savedPiket === 'true');
                    }
                }
                // Set loading to false after localStorage is read
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Dedicated effect to sync user data if role exists but user is missing
    useEffect(() => {
        const syncUserData = async () => {
            if (role === 'student' && !user) {
                try {
                    const { getStudentProfile } =
                        await import('@/features/student/services/studentProfileService');
                    // Add delay to prevent race conditions with initial load
                    await new Promise((r) => setTimeout(r, 100));

                    const profile = await getStudentProfile();

                    const newUser: User = {
                        id: String(profile.id),
                        username: profile.nis,
                        name: profile.name,
                        role: 'student',
                        avatar: profile.profilePicture,
                    };

                    setUser(newUser);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(
                            'userData',
                            JSON.stringify(newUser),
                        );
                    }
                } catch (err) {
                    console.error(
                        '[RoleContext] Failed to sync user data',
                        err,
                    );
                }
            }
        };

        if (!isLoading) {
            syncUserData();
        }
    }, [role, user, isLoading]);

    const setRole = (newRole: UserRole) => {
        setRoleState(newRole);
        if (typeof window !== 'undefined') {
            if (newRole) {
                localStorage.setItem('userRole', newRole);
            } else {
                localStorage.removeItem('userRole');
            }
        }
        if (newRole === null) {
            setUser(null);
            setIsHomeroomTeacher(false);
            setIsPiketTeacher(false);
        }
    };

    const updateUser = (data: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return null;
            const updated = { ...prev, ...data };
            if (typeof window !== 'undefined') {
                localStorage.setItem('userData', JSON.stringify(updated));
            }
            return updated;
        });
    };

    const login = (loginRole: UserRole) => {
        setRole(loginRole);

        // Refresh user data from localStorage since authService just set it
        if (typeof window !== 'undefined') {
            const savedUserData = localStorage.getItem('userData');
            if (savedUserData) {
                try {
                    setUser(JSON.parse(savedUserData));
                } catch (e) {
                    console.error('Failed to parse userData during login', e);
                }
            }
        }

        // For demo purposes, randomly set homeroom teacher status for teachers
        if (
            loginRole === 'subject_teacher' ||
            loginRole === 'homeroom_teacher'
        ) {
            const isHomeroom = true; // Always true for development/demo
            setIsHomeroomTeacher(isHomeroom);

            // Default to true for demo purposes for Piket
            const isPiket = true;
            setIsPiketTeacher(isPiket);

            if (typeof window !== 'undefined') {
                localStorage.setItem('isHomeroomTeacher', String(isHomeroom));
                localStorage.setItem('isPiketTeacher', String(isPiket));
            }
        }
    };

    const logout = async () => {
        await authService.logout();
        setRole(null);
        setUser(null);
        setIsHomeroomTeacher(false);
        setIsPiketTeacher(false);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('isHomeroomTeacher');
            localStorage.removeItem('isPiketTeacher');
            localStorage.removeItem('userData'); // Ensure cleared
        }
    };

    const isAuthenticated = role !== null;

    return (
        <RoleContext.Provider
            value={{
                role,
                user,
                setRole,
                isAuthenticated,
                isLoading,
                login,
                logout,
                isHomeroomTeacher,
                setIsHomeroomTeacher,
                isPiketTeacher,
                setIsPiketTeacher,
                updateUser,
            }}
        >
            {children}
        </RoleContext.Provider>
    );
};
