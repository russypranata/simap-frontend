import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { academicYearService } from "../services/academicYearService";
import { useAcademicYear } from "@/context/AcademicYearContext";

export const ACADEMIC_YEAR_KEYS = {
    all: ["admin-academic-years"] as const,
};

export const useAcademicYearList = () => {
    const queryClient = useQueryClient();
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Sumber tunggal untuk data semester aktif — sama dengan top bar
    const { academicYear: activeCtx, refreshAcademicYear } = useAcademicYear();

    const yearsQuery = useQuery({
        queryKey: ACADEMIC_YEAR_KEYS.all,
        queryFn: academicYearService.getAcademicYears,
        staleTime: 0,
        gcTime: 5 * 60 * 1000, // 5 menit
    });

    const years = yearsQuery.data ?? [];

    const stats = {
        totalAcademicYears: years.length,
        activeAcademicYear: activeCtx.academicYear || null,
        activeSemester: activeCtx.label ? `Semester ${activeCtx.label}` : null,
    };

    const activateYear = async (id: string) => {
        setIsActionLoading(true);
        try {
            await academicYearService.activateAcademicYear(id);
            // Invalidate list cache + refresh context (top bar) sekaligus
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ACADEMIC_YEAR_KEYS.all }),
                refreshAcademicYear(),
            ]);
        } finally {
            setIsActionLoading(false);
        }
    };

    return {
        academicYears: years,
        stats,
        isLoading: yearsQuery.isLoading,
        isFetching: yearsQuery.isFetching,
        isActionLoading,
        activateYear,
    };
};
