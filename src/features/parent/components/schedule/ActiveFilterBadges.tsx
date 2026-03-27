"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RotateCcw, CalendarIcon, X } from "lucide-react";

interface ActiveFilterBadgesProps {
    selectedYearId: string;
    academicYears: { id: string; year: string; semesters: { id: string; name: string }[] }[];
    activeYear?: { id: string; year: string; semesters: { id: string; name: string }[] };
    onClearYear: () => void;
}

export const ActiveFilterBadges: React.FC<ActiveFilterBadgesProps> = ({
    selectedYearId,
    academicYears,
    activeYear,
    onClearYear,
}) => {
    const hasActiveFilters = selectedYearId !== academicYears[0]?.id;

    if (!hasActiveFilters) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 px-1 no-print">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                <SlidersHorizontal className="h-3 w-3" />
                <span>Filter Aktif:</span>
            </div>
            
            {selectedYearId !== academicYears[0]?.id && (
                <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    TA {activeYear?.year || selectedYearId}
                    <button
                        onClick={onClearYear}
                        className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1"
                        aria-label="Hapus filter tahun ajaran"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </Badge>
            )}
        </div>
    );
};
