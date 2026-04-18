/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentRecap } from "./StudentRecapList";
import { User, GraduationCap, CalendarClock } from "lucide-react";

interface SubjectDetail {
    id: string;
    namaMapel: string;
    guruPengampu: string;
    kehadiran: {
        hadir: number;
        sakit: number;
        izin: number;
        alpha: number;
        persentase: number;
    };
}

interface StudentSubjectDetailProps {
    student: StudentRecap | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    periodFilter: string;
    onPeriodFilterChange: (value: string) => void;
}

export const StudentSubjectDetail = ({
    student,
    open,
    onOpenChange,
    periodFilter,
    onPeriodFilterChange,
}: StudentSubjectDetailProps) => {
    // Mock data generator for details based on student
    const getSubjectDetails = (studentId: string): SubjectDetail[] => {
        const subjects = [
            "Matematika Wajib", "Bahasa Indonesia", "Bahasa Inggris",
            "Fisika", "Kimia", "Biologi", "Sejarah Indonesia",
            "PPKn", "Pendidikan Agama", "PJOK", "Seni Budaya",
            "Prakarya", "Matematika Peminatan", "Ekonomi"
        ];

        return subjects.map((subject, idx) => {
            const hadir = Math.floor(Math.random() * 15) + 10;
            const sakit = Math.floor(Math.random() * 3);
            const izin = Math.floor(Math.random() * 3);
            const alpha = Math.floor(Math.random() * 2);
            const total = hadir + sakit + izin + alpha;
            const persentase = Math.round((hadir / total) * 100);

            return {
                id: `subj-${idx}`,
                namaMapel: subject,
                guruPengampu: `Guru ${subject.split(' ')[0]}`,
                kehadiran: {
                    hadir,
                    sakit,
                    izin,
                    alpha,
                    persentase
                }
            };
        });
    };

    const details = student ? getSubjectDetails(student.id) : [];

    const getPercentageColor = (percentage: number) => {
        if (percentage >= 90) return "text-emerald-600";
        if (percentage >= 75) return "text-blue-600";
        if (percentage >= 50) return "text-yellow-600";
        return "text-red-600";
    };

    const getBarColor = (percentage: number) => {
        if (percentage >= 90) return "bg-emerald-500";
        if (percentage >= 75) return "bg-blue-500";
        if (percentage >= 50) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col gap-0 z-[100] border-l shadow-2xl h-screen max-h-screen">
                {/* Header Section */}
                <div className="p-6 border-b bg-muted/10 sticky top-0 z-10 backdrop-blur-sm bg-background/80 supports-[backdrop-filter]:bg-background/60 shrink-0">
                    <SheetHeader className="space-y-4">
                        <div className="flex items-start gap-5">
                            <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                                <AvatarImage src={student?.foto} />
                                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                    {student?.nama.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1.5 pt-1">
                                <SheetTitle className="text-2xl font-bold tracking-tight">{student?.nama}</SheetTitle>
                                <SheetDescription className="flex items-center gap-3 text-sm">
                                    <Badge variant="outline" className="flex items-center gap-1.5 py-0.5 px-2 bg-background">
                                        <GraduationCap className="h-3.5 w-3.5" />
                                        {student?.kelas}
                                    </Badge>
                                    <span className="text-muted-foreground font-mono bg-muted px-1.5 rounded text-xs">
                                        {student?.nis}
                                    </span>
                                </SheetDescription>
                            </div>
                        </div>

                        <Tabs value={periodFilter} onValueChange={onPeriodFilterChange} className="w-full pt-2">
                            <TabsList className="grid w-full grid-cols-4 h-10 p-1 bg-muted/50 rounded-lg">
                                <TabsTrigger value="harian" className="text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Harian</TabsTrigger>
                                <TabsTrigger value="mingguan" className="text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Mingguan</TabsTrigger>
                                <TabsTrigger value="bulanan" className="text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Bulanan</TabsTrigger>
                                <TabsTrigger value="semester" className="text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Semester</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </SheetHeader>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 h-[calc(100vh-200px)] w-full">
                    <div className="p-6 pb-24">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <CalendarClock className="h-4 w-4 text-primary" />
                                Detail Kehadiran per Mata Pelajaran
                            </h3>
                            <Badge variant="secondary" className="text-xs font-normal">
                                {details.length} Mata Pelajaran
                            </Badge>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-3">
                            {details.map((subject) => (
                                <AccordionItem
                                    key={subject.id}
                                    value={subject.id}
                                    className="border rounded-xl px-4 bg-card shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                >
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <div className="flex items-center justify-between w-full pr-4 gap-4">
                                            <div className="text-left space-y-1">
                                                <div className="font-semibold text-sm leading-none">{subject.namaMapel}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                    <User className="h-3 w-3" />
                                                    {subject.guruPengampu}
                                                </div>
                                            </div>
                                            <div className={`flex flex-col items-end gap-1`}>
                                                <span className={`text-lg font-bold tabular-nums ${getPercentageColor(subject.kehadiran.persentase)}`}>
                                                    {subject.kehadiran.persentase}%
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                                                    Kehadiran
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5 pt-2 border-t mt-1">
                                        <div className="space-y-6">
                                            {/* Progress Sections */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-muted-foreground">Progress Kehadiran</span>
                                                    <span className="text-foreground">{subject.kehadiran.hadir} <span className="text-muted-foreground">/</span> {subject.kehadiran.hadir + subject.kehadiran.sakit + subject.kehadiran.izin + subject.kehadiran.alpha} <span className="text-muted-foreground">pertemuan</span></span>
                                                </div>
                                                <div className="h-2.5 w-full bg-secondary/50 rounded-full overflow-hidden ring-1 ring-border/50">
                                                    <div
                                                        className={`h-full ${getBarColor(subject.kehadiran.persentase)} transition-all duration-500 ease-out`}
                                                        style={{ width: `${subject.kehadiran.persentase}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Enhanced Stats Grid */}
                                            <div className="grid grid-cols-4 gap-3">
                                                <div className="bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-200/50 rounded-xl p-3 text-center transition-colors">
                                                    <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold mb-1">Hadir</div>
                                                    <div className="text-2xl font-bold text-emerald-700 leading-none">{subject.kehadiran.hadir}</div>
                                                </div>
                                                <div className="bg-blue-500/5 hover:bg-blue-500/10 border border-blue-200/50 rounded-xl p-3 text-center transition-colors">
                                                    <div className="text-[10px] uppercase tracking-wider text-blue-600 font-bold mb-1">Sakit</div>
                                                    <div className="text-2xl font-bold text-blue-700 leading-none">{subject.kehadiran.sakit}</div>
                                                </div>
                                                <div className="bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-200/50 rounded-xl p-3 text-center transition-colors">
                                                    <div className="text-[10px] uppercase tracking-wider text-yellow-600 font-bold mb-1">Izin</div>
                                                    <div className="text-2xl font-bold text-yellow-700 leading-none">{subject.kehadiran.izin}</div>
                                                </div>
                                                <div className="bg-red-500/5 hover:bg-red-500/10 border border-red-200/50 rounded-xl p-3 text-center transition-colors">
                                                    <div className="text-[10px] uppercase tracking-wider text-red-600 font-bold mb-1">Alpha</div>
                                                    <div className="text-2xl font-bold text-red-700 leading-none">{subject.kehadiran.alpha}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </ScrollArea>

                {/* Footer/Actions - Optional */}
                {/* <div className="p-4 border-t bg-background mt-auto">
                    <Button className="w-full">Cetak Laporan Kehadiran</Button>
                </div> */}
            </SheetContent>
        </Sheet>
    );
};
