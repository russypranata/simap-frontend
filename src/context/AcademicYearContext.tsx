"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ActiveAcademicYear {
    academicYear: string;
    semester: string;
    label: string;
}

const DEFAULT_ACADEMIC_YEAR: ActiveAcademicYear = {
    academicYear: "2025/2026",
    semester: "1",
    label: "Ganjil",
};

interface AcademicYearContextType {
    academicYear: ActiveAcademicYear;
    isLoading: boolean;
    refreshAcademicYear: () => Promise<void>;
}

const AcademicYearContext = createContext<AcademicYearContextType | undefined>(undefined);

const fetchActiveAcademicYear = async (): Promise<ActiveAcademicYear> => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await fetch(`${BASE_URL}/academic-years/active`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();
    const d = result.data;

    return {
        academicYear: d.academicYear ?? DEFAULT_ACADEMIC_YEAR.academicYear,
        semester: d.semester ?? DEFAULT_ACADEMIC_YEAR.semester,
        label: d.label ?? DEFAULT_ACADEMIC_YEAR.label,
    };
};

export const AcademicYearProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [academicYear, setAcademicYear] = useState<ActiveAcademicYear>(DEFAULT_ACADEMIC_YEAR);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAcademicYear = async () => {
        try {
            const data = await fetchActiveAcademicYear();
            setAcademicYear(data);
        } catch (error) {
            console.error("Failed to fetch academic year context:", error);
            // Keep default if fail
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAcademicYear();
    }, []);

    return (
        <AcademicYearContext.Provider value={{ academicYear, isLoading, refreshAcademicYear: fetchAcademicYear }}>
            {children}
        </AcademicYearContext.Provider>
    );
};

export const useAcademicYear = () => {
    const context = useContext(AcademicYearContext);
    if (context === undefined) {
        throw new Error("useAcademicYear must be used within an AcademicYearProvider");
    }
    return context;
};
