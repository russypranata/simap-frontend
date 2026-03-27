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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Filter,
    RotateCcw,
    Check,
    CalendarIcon,
} from "lucide-react";
import type { AcademicYearData } from "@/features/parent/services/parentScheduleService";

interface ScheduleFilterDialogProps {
    academicYears: AcademicYearData[];
    activeYear?: AcademicYearData;
    selectedYearId: string;
    onApply: (yearId: string) => void;
}

export const ScheduleFilterDialog: React.FC<ScheduleFilterDialogProps> = ({
    academicYears,
    activeYear,
    selectedYearId,
    onApply,
}) => {
    const [open, setOpen] = React.useState(false);
    const [tempYearId, setTempYearId] = React.useState(selectedYearId);

    React.useEffect(() => {
        if (open) {
            setTempYearId(selectedYearId);
        }
    }, [open, selectedYearId]);

    const activeFilterCount = selectedYearId !== academicYears[0]?.id ? 1 : 0;

    const handleApply = () => {
        onApply(tempYearId);
        setOpen(false);
    };

    const handleReset = () => {
        setTempYearId(academicYears[0]?.id);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                                        TA {year.year}
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
