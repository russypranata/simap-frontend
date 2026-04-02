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
import { Filter, Calendar, Check, RotateCcw, CalendarIcon } from "lucide-react";
import type { AcademicYear } from "./types";

interface GradesFilterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedYearId: string;
    selectedSemester: string;
    academicYears: AcademicYear[];
    onApply: (yearId: string, semester: string) => void;
}

export const GradesFilterDialog: React.FC<GradesFilterDialogProps> = ({
    open,
    onOpenChange,
    selectedYearId,
    selectedSemester,
    academicYears,
    onApply,
}) => {
    const [tempYearId, setTempYearId] = useState(selectedYearId);
    const [tempSemester, setTempSemester] = useState(selectedSemester);

    React.useEffect(() => {
        if (open) {
            setTempYearId(selectedYearId);
            setTempSemester(selectedSemester);
        }
    }, [open, selectedYearId, selectedSemester]);

    // handleYearChange: auto-select first available (non-upcoming) semester when year changes
    const handleYearChange = (yearId: string) => {
        setTempYearId(yearId);
        const year = academicYears.find(y => y.id === yearId);
        const firstAvailable = year?.semesters.find(s => s.status !== "upcoming");
        if (firstAvailable) setTempSemester(firstAvailable.id);
    };

    const handleApply = () => {
        onApply(tempYearId, tempSemester);
        onOpenChange(false);
    };

    const handleReset = () => {
        // Reset to first year with a completed semester
        for (const year of academicYears) {
            const completed = year.semesters.find(s => s.status === "completed");
            if (completed) {
                setTempYearId(year.id);
                setTempSemester(completed.id);
                return;
            }
        }
        setTempYearId(academicYears[0]?.id);
        setTempSemester(academicYears[0]?.semesters[0]?.id ?? "ganjil");
    };

    const activeFilterCount = 2; // TA dan Semester selalu aktif sebagai filter
    const tempYearSemesters = academicYears.find(y => y.id === tempYearId)?.semesters ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-9 gap-2 bg-white text-slate-700 border-slate-200 shadow-sm font-medium">
                    <Filter className="h-4 w-4 text-slate-500" />
                    <span className="hidden sm:inline">Filter</span>
                    {activeFilterCount > 0 && (
                        <Badge className="ml-0.5 h-5 w-5 min-w-[20px] px-0 bg-blue-800 text-white text-[10px] flex items-center justify-center border-0 rounded-full">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader className="flex-row items-center gap-4">
                    <div className="p-2.5 bg-blue-100 rounded-xl">
                        <Filter className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-semibold text-slate-900">Filter Nilai</DialogTitle>
                        <DialogDescription className="text-slate-500">Sesuaikan tahun ajaran dan semester</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                            Tahun Ajaran
                        </label>
                        <Select value={tempYearId} onValueChange={handleYearChange}>
                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                <SelectValue placeholder="Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map(year => (
                                    <SelectItem key={year.id} value={year.id}>TA {year.year}</SelectItem>
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
                                <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {tempYearSemesters.map(sem => (
                                    <SelectItem key={sem.id} value={sem.id} disabled={sem.status === "upcoming"}>
                                        <div className="flex items-center gap-2">
                                            <span>Semester {sem.label}</span>
                                            {sem.status === "active" && (
                                                <Badge className="text-[9px] px-1.5 py-0 bg-blue-100 text-blue-700 border-blue-200 font-semibold">Berlangsung</Badge>
                                            )}
                                            {sem.status === "upcoming" && (
                                                <Badge className="text-[9px] px-1.5 py-0 bg-slate-100 text-slate-400 border-slate-200 font-semibold">Belum Dimulai</Badge>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                    <Button variant="ghost" onClick={handleReset} className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Reset Pilihan
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
