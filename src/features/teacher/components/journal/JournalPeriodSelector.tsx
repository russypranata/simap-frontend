"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BookOpen, SlidersHorizontal } from "lucide-react";
import { JournalFilterDialog } from "./JournalFilterDialog";
import { ACADEMIC_YEARS, SEMESTERS } from "@/features/teacher/constants/attendance";

interface JournalPeriodSelectorProps {
    academicYear: string;
    semester: string;
    defaultAcademicYear: string;
    defaultSemester: string;
    onApply: (year: string, semester: string) => void;
    onClear: () => void;
}

export const JournalPeriodSelector: React.FC<JournalPeriodSelectorProps> = ({
    academicYear, semester,
    defaultAcademicYear, defaultSemester,
    onApply, onClear,
}) => (
    <div className="flex flex-wrap items-center gap-2 px-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            <SlidersHorizontal className="h-3 w-3" />
            <span>Periode:</span>
        </div>
        <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
            <CalendarIcon className="h-3.5 w-3.5" />
            TA {academicYear}
        </Badge>
        <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
            <BookOpen className="h-3.5 w-3.5" />
            Semester {semester}
        </Badge>
        <JournalFilterDialog
            academicYear={academicYear}
            semester={semester}
            defaultAcademicYear={defaultAcademicYear}
            defaultSemester={defaultSemester}
            onApply={onApply}
        />
    </div>
);
