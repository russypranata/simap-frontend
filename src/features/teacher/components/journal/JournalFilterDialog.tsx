"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter, Calendar, Check, RotateCcw, CalendarIcon, X, SlidersHorizontal, BookOpen } from "lucide-react";
import { ACADEMIC_YEARS, SEMESTERS } from "@/features/teacher/constants/attendance";

interface JournalFilterDialogProps {
    academicYear: string;
    semester: string;
    defaultAcademicYear: string;
    defaultSemester: string;
    onApply: (academicYear: string, semester: string) => void;
}

export const JournalFilterDialog: React.FC<JournalFilterDialogProps> = ({
    academicYear,
    semester,
    defaultAcademicYear,
    defaultSemester,
    onApply,
}) => {
    const [open, setOpen] = useState(false);
    const [tempYear, setTempYear] = useState(academicYear);
    const [tempSemester, setTempSemester] = useState(semester);

    React.useEffect(() => {
        if (open) {
            setTempYear(academicYear);
            setTempSemester(semester);
        }
    }, [open, academicYear, semester]);

    const handleApply = () => {
        onApply(tempYear, tempSemester);
        setOpen(false);
    };

    const handleReset = () => {
        setTempYear(defaultAcademicYear);
        setTempSemester(defaultSemester);
    };

    const isFiltered = academicYear !== defaultAcademicYear || semester !== defaultSemester;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-9 gap-2 bg-white text-slate-700 border-slate-200 shadow-sm font-medium">
                    <Filter className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="hidden sm:inline">Filter</span>
                    <span className="inline-flex items-center justify-center h-5 w-5 min-w-[20px] rounded-full bg-blue-800 text-white text-[10px] font-semibold leading-none">
                        2
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] rounded-2xl">
                <DialogHeader className="flex-row items-center gap-4">
                    <div className="p-2.5 bg-blue-100 rounded-xl">
                        <Filter className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-semibold text-slate-900">Filter Periode Jurnal</DialogTitle>
                        <DialogDescription className="text-slate-500">Pilih tahun ajaran dan semester</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                            Tahun Ajaran
                        </label>
                        <Select value={tempYear} onValueChange={setTempYear}>
                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ACADEMIC_YEARS.map((year) => (
                                    <SelectItem key={year} value={year}>TA {year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            Semester
                        </label>
                        <Select value={tempSemester} onValueChange={setTempSemester}>
                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SEMESTERS.map((sem) => (
                                    <SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                    <Button variant="ghost" onClick={handleReset} className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Reset ke Default
                    </Button>
                    <Button className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2" onClick={handleApply}>
                        <Check className="h-4 w-4" />
                        Terapkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Badge yang tampil di bawah header saat filter aktif
interface JournalFilterBadgesProps {
    academicYear: string;
    semester: string;
    defaultAcademicYear: string;
    defaultSemester: string;
    onClear: () => void;
}

export const JournalFilterBadges: React.FC<JournalFilterBadgesProps> = ({
    academicYear,
    semester,
    defaultAcademicYear,
    defaultSemester,
    onClear,
}) => {
    const isYearFiltered = academicYear !== defaultAcademicYear;
    const isSemesterFiltered = semester !== defaultSemester;

    return (
        <div className="flex flex-wrap items-center gap-2 px-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                <SlidersHorizontal className="h-3 w-3" />
                <span>Filter Aktif:</span>
            </div>
            <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                <CalendarIcon className="h-3.5 w-3.5" />
                TA {academicYear}
                {isYearFiltered && (
                    <button onClick={onClear} className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1" aria-label="Hapus filter tahun ajaran">
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </Badge>
            <Badge variant="secondary" className="gap-2 bg-blue-800 text-white border-none px-3 py-1 rounded-lg text-xs font-medium">
                <BookOpen className="h-3.5 w-3.5" />
                Semester {semester}
                {isSemesterFiltered && (
                    <button onClick={onClear} className="inline-flex items-center justify-center h-4 w-4 hover:text-white/70 transition-colors -mr-1" aria-label="Hapus filter semester">
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </Badge>
        </div>
    );
};
