"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CalendarIcon, SlidersHorizontal, X } from "lucide-react";
import type { AcademicYear } from "./types";

interface GradesFilterBadgesProps {
    selectedYearId: string;
    selectedSemester: string;
    academicYears: AcademicYear[];
    onClearYear: () => void;
    onClearSemester: () => void;
}

export const GradesFilterBadges: React.FC<GradesFilterBadgesProps> = ({
    selectedYearId,
    selectedSemester,
    academicYears,
    onClearYear,
    onClearSemester,
}) => {
    const selectedYear = academicYears.find(y => y.id === selectedYearId);
    if (!selectedYear) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 px-1 no-print">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                <SlidersHorizontal className="h-3 w-3" />
                <span>Filter Aktif:</span>
            </div>
            <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                <CalendarIcon className="h-3.5 w-3.5" />
                TA {selectedYear.year}
                {academicYears.length > 1 && (
                    <button onClick={onClearYear} className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1" aria-label="Hapus filter tahun ajaran">
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </Badge>
            <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                <BookOpen className="h-3.5 w-3.5" />
                Semester {selectedSemester === "ganjil" ? "Ganjil" : "Genap"}
                <button onClick={onClearSemester} className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1" aria-label="Hapus filter semester">
                    <X className="h-3.5 w-3.5" />
                </button>
            </Badge>
        </div>
    );
};
