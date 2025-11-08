'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [role, setRoleState] = useState<UserRole>(null);
  const [isHomeroomTeacher, setIsHomeroomTeacher] = useState(false);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === null) {
      setIsHomeroomTeacher(false);
    }
  };

  const login = (loginRole: UserRole) => {
    setRole(loginRole);
    // For demo purposes, randomly set homeroom teacher status for teachers
    if (loginRole === 'guru') {
      setIsHomeroomTeacher(Math.random() > 0.5);
    }
  };

  const logout = () => {
    setRole(null);
    setIsHomeroomTeacher(false);
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