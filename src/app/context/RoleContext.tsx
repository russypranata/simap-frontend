'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/features/auth/services/authService';

export type UserRole = 'guru' | 'siswa' | 'admin' | 'orang_tua' | 'tutor_ekskul' | 'pj_mutamayizin' | null;

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: UserRole) => void;
  logout: () => Promise<void>;
  isHomeroomTeacher: boolean;
  setIsHomeroomTeacher: (isHomeroom: boolean) => void;
  isPiketTeacher: boolean;
  setIsPiketTeacher: (isPiket: boolean) => void;
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
  const [isHomeroomTeacher, setIsHomeroomTeacher] = useState(false);
  const [isPiketTeacher, setIsPiketTeacher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize role from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('userRole') as UserRole;
      const savedHomeroom = localStorage.getItem('isHomeroomTeacher');
      const savedPiket = localStorage.getItem('isPiketTeacher');
      if (savedRole) {
        setRoleState(savedRole);
        if (savedRole === 'guru') {
          // Force true for guru to ensure Wali Kelas is visible
          setIsHomeroomTeacher(true);
          localStorage.setItem('isHomeroomTeacher', 'true');

          // Initialize Piket role - Force true for demo/testing
          const shouldBePiket = true; // savedPiket === 'true'; 
          setIsPiketTeacher(shouldBePiket);
          localStorage.setItem('isPiketTeacher', String(shouldBePiket));
        } else {
          setIsHomeroomTeacher(savedHomeroom === 'true');
          setIsPiketTeacher(savedPiket === 'true');
        }
      }
      // Set loading to false after localStorage is read
      setIsLoading(false);
    }
  }, []);

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
      setIsHomeroomTeacher(false);
      setIsPiketTeacher(false);
    }
  };

  const login = (loginRole: UserRole) => {
    setRole(loginRole);
    // For demo purposes, randomly set homeroom teacher status for teachers
    if (loginRole === 'guru') {
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
    setIsHomeroomTeacher(false);
    setIsPiketTeacher(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isHomeroomTeacher');
      localStorage.removeItem('isPiketTeacher');
    }
  };

  const isAuthenticated = role !== null;

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        isLoading,
        login,
        logout,
        isHomeroomTeacher,
        setIsHomeroomTeacher,
        isPiketTeacher,
        setIsPiketTeacher,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};