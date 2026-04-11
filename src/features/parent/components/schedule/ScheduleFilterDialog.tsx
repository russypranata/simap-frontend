"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Check, CalendarIcon, Filter } from "lucide-react";
import type { AcademicYearItem } from "@/features/parent/services/parentApiClient";
import { FilterButton } from "@/features/shared/components";

interface ScheduleFilterDialogProps {
    academicYears: AcademicYearItem[];
    activeYear?: AcademicYearItem;
    selectedYearId: string;
    onApply: (yearId: string) => void;
}

export const ScheduleFilterDialog: React.FC<ScheduleFilterDialogProps> = ({
    academicYears,
    selectedYearId,
    onApply,
}) => {
    const [open, setOpen] = React.useState(false);
    const [tempYearId, setTempYearId] = React.useState(selectedYearId);

    React.useEffect(() => {
        if (open) setTempYearId(selectedYearId);
    }, [open, selectedYearId]);

    const handleApply = () => {
        onApply(tempYearId);
        setOpen(false);
    };

    const handleReset = () => {
        setTempYearId(academicYears.find(y => y.isActive)?.id ?? academicYears[0]?.id ?? "");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* Always count 1 — year filter is always active on this page */}
                <FilterButton activeCount={1} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader className="flex-row items-center gap-4">
                    <div className="p-2.5 bg-blue-100 rounded-xl">
                        <Filter className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-semibold text-slate-900">Filter Jadwal</DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Sesuaikan tahun ajaran
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                            Tahun Ajaran
                        </label>
                        <Select value={tempYearId} onValueChange={setTempYearId}>
                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                <SelectValue placeholder="Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map(year => (
                                    <SelectItem key={year.id} value={year.id}>
                                        {year.name}{year.isActive ? " (Aktif)" : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                    <Button
                        variant="ghost"
                        onClick={handleReset}
                        className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset Pilihan
                    </Button>
                    <Button
                        className="bg-blue-800 hover:bg-blue-900 text-white px-8 gap-2"
                        onClick={handleApply}
                    >
                        <Check className="h-4 w-4" />
                        Terapkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
