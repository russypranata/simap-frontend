/* eslint-disable @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, CalendarDays, FileText, BarChart3, Clock, CheckCircle, XCircle, Moon, Sun, Sunset } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentPrayerDetailProps {
    student: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    periodFilter: string;
    onPeriodFilterChange: (value: string) => void;
}

export const StudentPrayerDetail = ({
    student,
    open,
    onOpenChange,
    periodFilter,
    onPeriodFilterChange
}: StudentPrayerDetailProps) => {
    if (!student) return null;

    // Mock history data generator
    const generateHistory = (filter: string) => {
        const days = filter === 'harian' ? 1
            : filter === 'mingguan' ? 5
                : filter === 'bulanan' ? 20
                    : 30;

        return Array.from({ length: days }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return {
                date: date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
                prayers: {
                    dhuha: Math.random() > 0.2, // 80% chance
                    dhuhur: Math.random() > 0.1, // 90% chance
                    ashar: Math.random() > 0.3, // 70% chance
                }
            };
        });
    };

    const history = generateHistory(periodFilter);

    const PrayerIcon = ({ type }: { type: string }) => {
        switch (type) {
            case 'dhuha': return <Sun className="h-4 w-4" />;
            case 'dhuhur': return <Sun className="h-4 w-4" />;
            case 'ashar': return <Sunset className="h-4 w-4" />;
            default: return <Moon className="h-4 w-4" />;
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl p-0 h-screen max-h-screen z-[100] flex flex-col">
                <div className="flex flex-col flex-shrink-0 bg-background border-b shadow-sm z-10 p-6 pb-2">
                    <SheetHeader className="mb-6 text-left">
                        <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border-2 border-border/50 shadow-md">
                                <AvatarImage src={student.foto} />
                                <AvatarFallback className="text-xl bg-primary/5 text-primary">
                                    {student.name ? student.name.substring(0, 2).toUpperCase() : "SISWA"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1.5 pt-1">
                                <SheetTitle className="text-xl font-bold leading-none">{student.name}</SheetTitle>
                                <SheetDescription className="text-sm font-medium text-foreground/80">
                                    {student.class || "XII A"}
                                </SheetDescription>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs bg-muted/50 px-2 py-0.5 rounded text-muted-foreground border">
                                        {student.nis}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </SheetHeader>

                    <Tabs value={periodFilter} onValueChange={onPeriodFilterChange} className="w-full">
                        <TabsList className="bg-transparent p-0 h-auto gap-3 justify-start flex-wrap w-full overflow-x-auto pb-2">
                            <TabsTrigger value="harian" className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2">
                                <CalendarIcon className="h-3.5 w-3.5" /> Harian
                            </TabsTrigger>
                            <TabsTrigger value="mingguan" className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2">
                                <CalendarDays className="h-3.5 w-3.5" /> Mingguan
                            </TabsTrigger>
                            <TabsTrigger value="bulanan" className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5" /> Bulanan
                            </TabsTrigger>
                            <TabsTrigger value="semester" className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2">
                                <BarChart3 className="h-3.5 w-3.5" /> Semester
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <ScrollArea className="flex-1 w-full bg-muted/5 p-6 pb-24 h-[calc(100vh-200px)]">
                    <div className="space-y-6">
                        {/* Stats Summary */}
                        <div className="grid grid-cols-3 gap-3">
                            {['dhuha', 'dhuhur', 'ashar'].map(type => {
                                const total = history.length;
                                const present = history.filter(h => h.prayers[type as keyof typeof h.prayers]).length;
                                const percentage = Math.round((present / total) * 100);

                                return (
                                    <div key={type} className="bg-card border rounded-xl p-3 text-center shadow-sm">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 flex items-center justify-center gap-1.5">
                                            <PrayerIcon type={type} />
                                            {type}
                                        </div>
                                        <div className="text-xl font-bold text-foreground">
                                            {present}/{total}
                                        </div>
                                        <div className={cn("text-xs font-medium mt-1", percentage >= 80 ? "text-emerald-600" : "text-amber-600")}>
                                            {percentage}% Hadir
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2 text-sm text-foreground/80">
                                <Clock className="h-4 w-4" />
                                Riwayat Sholat
                            </h4>
                            <div className="space-y-3">
                                {history.map((record, index) => (
                                    <div key={index} className="bg-card rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="font-medium text-sm mb-3 border-b pb-2">{record.date}</div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['dhuha', 'dhuhur', 'ashar'].map(type => (
                                                <div key={type} className={cn(
                                                    "flex items-center justify-between p-2 rounded-lg border",
                                                    record.prayers[type as keyof typeof record.prayers] ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                                                )}>
                                                    <span className="text-xs font-medium uppercase">{type}</span>
                                                    {record.prayers[type as keyof typeof record.prayers] ? (
                                                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-red-400" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};
