import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { format, addDays, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface WeeklyAttendanceViewProps {
    students: any[];
    currentWeekStart: Date;
    setCurrentWeekStart: (date: Date) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const getStatusForDate = (student: any, date: Date) => {
    // Mock implementation for visualization
    // In a real app, this would check student.attendanceHistory
    const day = date.getDate();
    const id = student.id;
    // Deterministic random status
    const hash = (id + day) % 20;
    if (hash === 0) return 'S';
    if (hash === 1) return 'I';
    if (hash === 2) return 'A';
    return 'H';
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'H': return "bg-green-100 text-green-700 border-green-200";
        case 'S': return "bg-blue-100 text-blue-700 border-blue-200";
        case 'I': return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case 'A': return "bg-red-100 text-red-700 border-red-200";
        default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
};

export const WeeklyAttendanceView = ({
    students,
    currentWeekStart,
    setCurrentWeekStart,
    searchTerm,
    setSearchTerm
}: WeeklyAttendanceViewProps) => {
    // Generate the 7 days of the week
    const weekDays = React.useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
    }, [currentWeekStart]);

    const weekEnd = React.useMemo(() => {
        return endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    }, [currentWeekStart]);

    const handlePrevWeek = () => {
        setCurrentWeekStart(addDays(currentWeekStart, -7));
    };

    const handleNextWeek = () => {
        setCurrentWeekStart(addDays(currentWeekStart, 7));
    };

    // Calculate aggregate stats for the week
    const weeklyStats = React.useMemo(() => {
        const stats = { H: 0, S: 0, I: 0, A: 0 };
        students.forEach(student => {
            weekDays.forEach(day => {
                const status = getStatusForDate(student, day);
                if (status === 'H') stats.H++;
                if (status === 'S') stats.S++;
                if (status === 'I') stats.I++;
                if (status === 'A') stats.A++;
            });
        });
        return stats;
    }, [students, currentWeekStart]); // Re-calculate when students or week changes

    const totalAttendance = weeklyStats.H + weeklyStats.S + weeklyStats.I + weeklyStats.A;
    const attendancePercentage = totalAttendance > 0 ? ((weeklyStats.H / totalAttendance) * 100).toFixed(1) : "0";

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <CalendarIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Rekap Presensi Pagi Mingguan</CardTitle>
                                <CardDescription>
                                    {format(currentWeekStart, "dd MMM", { locale: idLocale })} - {format(weekEnd, "dd MMM yyyy", { locale: idLocale })}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-muted/50 rounded-md border p-1 mr-2">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrevWeek}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium px-3 min-w-[140px] text-center">
                                    {format(currentWeekStart, "dd MMM", { locale: idLocale })} - {format(weekEnd, "dd MMM", { locale: idLocale })}
                                </span>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNextWeek}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" /> Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-2xl font-bold text-green-600">{weeklyStats.H}</div>
                            <div className="text-sm text-green-600">Hadir</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">{weeklyStats.S}</div>
                            <div className="text-sm text-blue-600">Sakit</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="text-2xl font-bold text-yellow-600">{weeklyStats.I}</div>
                            <div className="text-sm text-yellow-600">Izin</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="text-2xl font-bold text-red-600">{weeklyStats.A}</div>
                            <div className="text-sm text-red-600">Alpha</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="text-2xl font-bold text-purple-600">{attendancePercentage}%</div>
                            <div className="text-sm text-purple-600">Kehadiran</div>
                        </div>
                    </div>

                    <div className="rounded-xl border shadow-sm overflow-hidden bg-card relative">
                        <div className="overflow-auto max-h-[600px]">
                            <Table>
                                <TableHeader className="bg-muted/50 sticky top-0 z-20 shadow-sm">
                                    <TableRow className="hover:bg-transparent border-b">
                                        <TableHead className="w-[50px] p-3 font-medium text-sm text-foreground text-center sticky left-0 z-20 bg-muted/50 backdrop-blur-sm">No</TableHead>
                                        <TableHead className="w-[250px] p-3 font-medium text-sm text-foreground sticky left-[50px] z-20 bg-muted/50 backdrop-blur-sm border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Siswa</TableHead>
                                        {weekDays.map((day, i) => (
                                            <TableHead key={i} className="p-2 font-medium text-sm text-foreground text-center min-w-[60px]">
                                                <div className="flex flex-col items-center justify-center gap-1 py-1">
                                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                                                        {format(day, "EEE", { locale: idLocale })}
                                                    </span>
                                                    <div className={cn(
                                                        "h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold",
                                                        isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : "bg-muted/50"
                                                    )}>
                                                        {format(day, "dd")}
                                                    </div>
                                                </div>
                                            </TableHead>
                                        ))}
                                        <TableHead className="p-3 text-center min-w-[50px]">
                                            <div className="h-8 w-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold mx-auto border border-green-200">H</div>
                                        </TableHead>
                                        <TableHead className="p-3 text-center min-w-[50px]">
                                            <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mx-auto border border-blue-200">S</div>
                                        </TableHead>
                                        <TableHead className="p-3 text-center min-w-[50px]">
                                            <div className="h-8 w-8 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold mx-auto border border-yellow-200">I</div>
                                        </TableHead>
                                        <TableHead className="p-3 text-center min-w-[50px]">
                                            <div className="h-8 w-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold mx-auto border border-red-200">A</div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student, index) => {
                                        // Calculate weekly stats on the fly for this mock
                                        let h = 0, s = 0, i = 0, a = 0;
                                        const weeklyStatuses = weekDays.map(day => {
                                            const status = getStatusForDate(student, day);
                                            if (status === 'H') h++;
                                            if (status === 'S') s++;
                                            if (status === 'I') i++;
                                            if (status === 'A') a++;
                                            return status;
                                        });

                                        return (
                                            <TableRow key={student.id} className="hover:bg-muted/30 transition-colors border-b group">
                                                <TableCell className="p-3 text-sm font-medium text-center sticky left-0 z-10 bg-background group-hover:bg-muted/30 transition-colors">{index + 1}</TableCell>
                                                <TableCell className="p-3 sticky left-[50px] z-10 bg-background group-hover:bg-muted/30 transition-colors border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar className="h-8 w-8 border border-border/50">
                                                            <AvatarImage src="" />
                                                            <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                                                                {student.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-sm text-foreground truncate max-w-[150px]" title={student.name}>{student.name}</p>
                                                            <span className="text-xs text-muted-foreground font-mono">{student.nis}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                {weeklyStatuses.map((status, idx) => (
                                                    <TableCell key={idx} className="p-2 text-center">
                                                        <div className="flex justify-center">
                                                            <Badge variant="outline" className={cn("h-8 w-8 p-0 flex items-center justify-center rounded-lg border-0 font-bold shadow-sm transition-transform hover:scale-110", getStatusColor(status))}>
                                                                {status}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                ))}
                                                <TableCell className="p-3 text-center font-bold text-green-600 border-l border-border/50">{h}</TableCell>
                                                <TableCell className="p-3 text-center font-bold text-blue-600">{s}</TableCell>
                                                <TableCell className="p-3 text-center font-bold text-yellow-600">{i}</TableCell>
                                                <TableCell className="p-3 text-center font-bold text-red-600">{a}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
