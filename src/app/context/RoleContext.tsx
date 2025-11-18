'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'guru' | 'siswa' | 'admin' | 'orang_tua' | null;

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  isHomeroomTeacher: boolean;
  setIsHomeroomTeacher: (isHomeroom: boolean) => void;
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
  const [role, setRoleState] = useState<UserRole>('guru'); // Default to 'guru' for development
  const [isHomeroomTeacher, setIsHomeroomTeacher] = useState(true);

  // Initialize role from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('userRole') as UserRole;
      const savedHomeroom = localStorage.getItem('isHomeroomTeacher') === 'true';
      if (savedRole) {
        setRoleState(savedRole);
        setIsHomeroomTeacher(savedHomeroom);
      }
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
    }
  };

  const login = (loginRole: UserRole) => {
    setRole(loginRole);
    // For demo purposes, randomly set homeroom teacher status for teachers
    if (loginRole === 'guru') {
      const isHomeroom = Math.random() > 0.5;
      setIsHomeroomTeacher(isHomeroom);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isHomeroomTeacher', String(isHomeroom));
      }
    }
  };

  const logout = () => {
    setRole(null);
    setIsHomeroomTeacher(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
      localStorage.removeItem('isHomeroomTeacher');
    }
  };

  const isAuthenticated = role !== null;

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        login,
        logout,
        isHomeroomTeacher,
        setIsHomeroomTeacher,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};