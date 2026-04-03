"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Filter, Check, RotateCcw, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TeacherClass } from "@/features/teacher/types/teacher";

export type QuickDateFilter = 'today' | 'week' | 'month' | null;

interface JournalListFilterDialogProps {
    filterClass: string;
    filterSubject: string;
    activeDateFilter: QuickDateFilter;
    classes: TeacherClass[];
    subjects: string[];
    activeCount: number;
    onApply: (filterClass: string, filterSubject: string, dateFilter: QuickDateFilter) => void;
    onReset: () => void;
}

export const JournalListFilterDialog: React.FC<JournalListFilterDialogProps> = ({
    filterClass, filterSubject, activeDateFilter,
    classes, subjects, activeCount,
    onApply, onReset,
}) => {
    const [open, setOpen] = useState(false);
    const [tempClass, setTempClass] = useState(filterClass);
    const [tempSubject, setTempSubject] = useState(filterSubject);
    const [tempDate, setTempDate] = useState<QuickDateFilter>(activeDateFilter);

    React.useEffect(() => {
        if (open) {
            setTempClass(filterClass);
            setTempSubject(filterSubject);
            setTempDate(activeDateFilter);
        }
    }, [open, filterClass, filterSubject, activeDateFilter]);

    const handleApply = () => {
        onApply(tempClass, tempSubject, tempDate);
        setOpen(false);
    };

    const handleReset = () => {
        onReset();
        setOpen(false);
    };

    const DATE_OPTIONS: { key: QuickDateFilter; label: string }[] = [
        { key: 'today', label: 'Hari Ini' },
        { key: 'week', label: 'Minggu Ini' },
        { key: 'month', label: 'Bulan Ini' },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-9 gap-2 bg-white text-slate-700 border-slate-200 shadow-sm font-medium shrink-0">
                    <Filter className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="hidden sm:inline">Filter</span>
                    {activeCount > 0 && (
                        <span className="inline-flex items-center justify-center h-5 w-5 min-w-[20px] rounded-full bg-blue-800 text-white text-[10px] font-semibold leading-none">
                            {activeCount}
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] rounded-2xl">
                <DialogHeader className="flex-row items-center gap-4">
                    <div className="p-2.5 bg-blue-100 rounded-xl">
                        <Filter className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-semibold text-slate-900">Filter Daftar Jurnal</DialogTitle>
                        <DialogDescription className="text-slate-500">Filter berdasarkan kelas, mapel, atau waktu</DialogDescription>
                    </div>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Kelas</Label>
                        <Select value={tempClass} onValueChange={setTempClass}>
                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200">
                                <SelectValue placeholder="Semua Kelas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kelas</SelectItem>
                                {classes.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Mata Pelajaran</Label>
                        <Select value={tempSubject} onValueChange={setTempSubject}>
                            <SelectTrigger className="w-full bg-slate-50/50 border-slate-200 [&>span]:truncate [&>span]:block [&>span]:overflow-hidden">
                                <SelectValue placeholder="Semua Mata Pelajaran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            Periode Cepat
                        </Label>
                        <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
                            {DATE_OPTIONS.map(({ key, label }, i) => (
                                <React.Fragment key={key}>
                                    {i > 0 && <div className="w-px h-4 bg-border/50 mx-1" />}
                                    <button
                                        onClick={() => setTempDate(tempDate === key ? null : key)}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex-1",
                                            tempDate === key
                                                ? "bg-blue-800 text-white shadow-sm"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        )}
                                    >
                                        {label}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between gap-2 border-t pt-4">
                    <Button variant="ghost" onClick={handleReset} className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Reset
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
