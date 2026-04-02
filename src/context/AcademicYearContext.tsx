"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getActiveAcademicYear, type ActiveAcademicYear } from "@/features/extracurricular-advisor/services/advisorDashboardService";

// Default fallback
const DEFAULT_ACADEMIC_YEAR: ActiveAcademicYear = {
    academicYear: "2025/2026",
    semester: "1",
    label: "Ganjil"
};

interface AcademicYearContextType {
    academicYear: ActiveAcademicYear;
    isLoading: boolean;
    refreshAcademicYear: () => Promise<void>;
}

const AcademicYearContext = createContext<AcademicYearContextType | undefined>(undefined);

export const AcademicYearProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [academicYear, setAcademicYear] = useState<ActiveAcademicYear>(DEFAULT_ACADEMIC_YEAR);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAcademicYear = async () => {
        try {
            const data = await getActiveAcademicYear();
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
