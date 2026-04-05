'use client';

import React from 'react';
import { useAcademicYear } from '@/context/AcademicYearContext';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const ActiveAcademicYearBadge: React.FC = () => {
    const { academicYear, isLoading } = useAcademicYear();

    if (isLoading) {
        return (
            <>
                <Skeleton className="h-7 w-28 rounded-full md:hidden" />
                <Skeleton className="hidden md:block h-8 w-48 rounded-full" />
            </>
        );
    }

    const semesterLabel = academicYear.semester === '1' ? 'Ganjil' : academicYear.semester === '2' ? 'Genap' : academicYear.semester;

    return (
        <>
            {/* Mobile: satu badge compact */}
            <div className="flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-xs font-semibold whitespace-nowrap">
                    {academicYear.academicYear} | Smt {semesterLabel}
                </span>
            </div>

            {/* Desktop: dua badge terpisah */}
            <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                        T.A. {academicYear.academicYear}
                    </span>
                </div>
                <div className="h-4 w-[1px] bg-border" />
                <div className="flex items-center gap-2 text-blue-800">
                    <BookOpen className="h-4 w-4 text-blue-800/70" />
                    <span className="text-sm font-medium">
                        Semester {semesterLabel}
                    </span>
                </div>
            </div>
        </>
    );
};
