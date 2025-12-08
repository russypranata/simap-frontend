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
import { CalendarIcon, CalendarDays, FileText, BarChart3, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentMorningDetailProps {
    student: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    periodFilter: string;
    onPeriodFilterChange: (value: string) => void;
}

export const StudentMorningDetail = ({
    student,
    open,
    onOpenChange,
    periodFilter,
    onPeriodFilterChange
}: StudentMorningDetailProps) => {
    if (!student) return null;

    // Mock history data generator
    const generateHistory = (filter: string) => {
        const days = filter === 'harian' ? 1
            : filter === 'mingguan' ? 5
                : filter === 'bulanan' ? 20
                    : 30; // Just sample

        return Array.from({ length: days }).map((_, i) => {
            const statusRandom = Math.random();
            const status = statusRandom > 0.8 ? "Sakit" : statusRandom > 0.6 ? "Izin" : statusRandom > 0.5 ? "Alpha" : "Hadir";
            const arrivalRandom = Math.random();
            const arrivalTime = status === "Hadir"
                ? (arrivalRandom > 0.7 ? "07:15" : "06:45")
                : "-";
            const date = new Date();
            date.setDate(date.getDate() - i);

            return {
                date: date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
                status,
                arrivalTime,
                notes: status !== "Hadir" ? "Keterangan sakit/izin..." : arrivalTime > "07:00" ? "Terlambat" : ""
            };
        });
    };

    const history = generateHistory(periodFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Hadir": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Sakit": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Izin": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Alpha": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Hadir": return <CheckCircle className="h-4 w-4" />;
            case "Sakit": return <AlertCircle className="h-4 w-4" />;
            case "Izin": return <Clock className="h-4 w-4" />;
            case "Alpha": return <XCircle className="h-4 w-4" />;
            default: return null;
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl p-0 h-screen max-h-screen z-[100] flex flex-col">
                {/* Sticky Header */}
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
                                    {student.class}
                                </SheetDescription>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs bg-muted/50 px-2 py-0.5 rounded text-muted-foreground border">
                                        {student.nis}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </SheetHeader>

                    {/* Period Filters */}
                    <Tabs value={periodFilter} onValueChange={onPeriodFilterChange} className="w-full">
                        <TabsList className="bg-transparent p-0 h-auto gap-3 justify-start flex-wrap w-full overflow-x-auto pb-2">
                            <TabsTrigger
                                value="harian"
                                className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2"
                            >
                                <CalendarIcon className="h-3.5 w-3.5" />
                                Harian
                            </TabsTrigger>
                            <TabsTrigger
                                value="mingguan"
                                className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2"
                            >
                                <CalendarDays className="h-3.5 w-3.5" />
                                Mingguan
                            </TabsTrigger>
                            <TabsTrigger
                                value="bulanan"
                                className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2"
                            >
                                <FileText className="h-3.5 w-3.5" />
                                Bulanan
                            </TabsTrigger>
                            <TabsTrigger
                                value="semester"
                                className="rounded-full border border-muted-foreground/30 px-3 py-1.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-sm hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2"
                            >
                                <BarChart3 className="h-3.5 w-3.5" />
                                Semester
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 w-full bg-muted/5 p-6 pb-24 h-[calc(100vh-200px)]">
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-4 gap-3">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-emerald-700">
                                    {history.filter(h => h.status === 'Hadir').length}
                                </div>
                                <div className="text-xs text-emerald-600 font-medium mt-1">Hadir</div>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-blue-700">
                                    {history.filter(h => h.status === 'Sakit').length}
                                </div>
                                <div className="text-xs text-blue-600 font-medium mt-1">Sakit</div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-yellow-700">
                                    {history.filter(h => h.status === 'Izin').length}
                                </div>
                                <div className="text-xs text-yellow-600 font-medium mt-1">Izin</div>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-red-700">
                                    {history.filter(h => h.status === 'Alpha').length}
                                </div>
                                <div className="text-xs text-red-600 font-medium mt-1">Alpha</div>
                            </div>
                        </div>

                        {/* History List */}
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2 text-sm text-foreground/80">
                                <Clock className="h-4 w-4" />
                                Riwayat Kehadiran
                            </h4>
                            <div className="space-y-3">
                                {history.map((record, index) => (
                                    <div key={index} className="bg-card rounded-xl border p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                        <div className="space-y-1">
                                            <div className="font-medium text-sm">{record.date}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                {record.arrivalTime !== "-" && (
                                                    <span className={cn("px-1.5 py-0.5 rounded bg-muted font-mono", record.notes === "Terlambat" && "bg-red-100 text-red-700")}>
                                                        {record.arrivalTime}
                                                    </span>
                                                )}
                                                {record.notes && <span>• {record.notes}</span>}
                                            </div>
                                        </div>
                                        <Badge className={cn(getStatusColor(record.status), "flex items-center gap-1.5 pl-1.5 pr-2.5 py-1")}>
                                            {getStatusIcon(record.status)}
                                            {record.status}
                                        </Badge>
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
