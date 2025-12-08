import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    CalendarCheck,
    Calendar as CalendarIcon,
    HelpCircle,
    BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export type StatusFilterType = 'all' | 'Hadir' | 'Sakit' | 'Izin' | 'Alpha' | 'Terlambat';

interface SubjectDailyAttendanceViewProps {
    students: any[];
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: StatusFilterType;
    setStatusFilter: (status: StatusFilterType) => void;
    selectedSubject: string;
    setSelectedSubject: (subject: string) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    totalPages: number;
    stats: any;
    attendancePercentage: string;
}

export const SubjectDailyAttendanceView = ({
    students,
    date,
    setDate,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedSubject,
    setSelectedSubject,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    stats,
    attendancePercentage
}: SubjectDailyAttendanceViewProps) => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Hadir": return "bg-green-100 text-green-800 border-green-200";
            case "Sakit": return "bg-blue-100 text-blue-800 border-blue-200";
            case "Izin": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Alpha": return "bg-red-100 text-red-800 border-red-200";
            case "Terlambat": return "bg-orange-100 text-orange-800 border-orange-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Hadir": return <CheckCircle className="h-4 w-4 mr-1" />;
            case "Sakit": return <AlertCircle className="h-4 w-4 mr-1" />;
            case "Izin": return <Clock className="h-4 w-4 mr-1" />;
            case "Alpha": return <XCircle className="h-4 w-4 mr-1" />;
            case "Terlambat": return <Clock className="h-4 w-4 mr-1" />;
            default: return <HelpCircle className="h-4 w-4 mr-1" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Stats */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg font-semibold">Presensi Mapel Harian</CardTitle>
                                    <Badge variant="outline">
                                        {date ? (
                                            format(date, "dd MMMM yyyy", { locale: idLocale })
                                        ) : (
                                            "Pilih Tanggal"
                                        )}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Rekapitulasi kehadiran siswa per mata pelajaran
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Pilih Mata Pelajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Matematika">Matematika</SelectItem>
                                    <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                                    <SelectItem value="Bahasa Inggris">Bahasa Inggris</SelectItem>
                                    <SelectItem value="IPA">IPA</SelectItem>
                                    <SelectItem value="IPS">IPS</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? (
                                                format(date, "dd MMMM yyyy", { locale: idLocale })
                                            ) : (
                                                <span>Pilih Tanggal</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="single"
                                            defaultMonth={date}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={1}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-2xl font-bold text-green-600">{stats.Hadir}</div>
                            <div className="text-sm text-green-600">Hadir</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">{stats.Sakit}</div>
                            <div className="text-sm text-blue-600">Sakit</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="text-2xl font-bold text-yellow-600">{stats.Izin}</div>
                            <div className="text-sm text-yellow-600">Izin</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="text-2xl font-bold text-red-600">{stats.Alpha}</div>
                            <div className="text-sm text-red-600">Alpha</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-2xl font-bold text-orange-600">{stats.Terlambat}</div>
                            <div className="text-sm text-orange-600">Terlambat</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="text-2xl font-bold text-purple-600">{attendancePercentage}%</div>
                            <div className="text-sm text-purple-600">Kehadiran</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters & Table */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between bg-muted/30 p-4 rounded-lg border mb-4 gap-4">
                        <div className="relative w-full lg:w-72">
                            <Input
                                placeholder="Cari nama atau NIS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-3 bg-background border-muted-foreground/20 focus-visible:ring-primary"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px] bg-background">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="Hadir">Hadir</SelectItem>
                                    <SelectItem value="Sakit">Sakit</SelectItem>
                                    <SelectItem value="Izin">Izin</SelectItem>
                                    <SelectItem value="Alpha">Alpha</SelectItem>
                                    <SelectItem value="Terlambat">Terlambat</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent border-b">
                                    <TableHead className="w-[50px] p-3 font-medium text-sm text-foreground text-center">No</TableHead>
                                    <TableHead className="p-3 font-medium text-sm text-foreground min-w-[200px]">Siswa</TableHead>
                                    <TableHead className="p-3 font-medium text-sm text-foreground">Status Kehadiran</TableHead>
                                    <TableHead className="p-3 font-medium text-sm text-foreground">Catatan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <TableRow key={student.id} className="hover:bg-muted/30 transition-colors border-b">
                                            <TableCell className="p-3 text-sm font-medium text-center">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                            <TableCell className="p-3">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-9 w-9 border border-border/50">
                                                        <AvatarImage src="" />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                                                            {student.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-sm text-foreground">{student.name}</p>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span className="font-mono">{student.nis}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-3">
                                                <Badge variant="outline" className={cn("font-normal border flex w-fit items-center px-3 py-1", getStatusColor(student.status))}>
                                                    {getStatusIcon(student.status)}
                                                    {student.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-3">
                                                {student.notes ? (
                                                    <span className="text-sm text-muted-foreground">{student.notes}</span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground/50 italic">Tidak ada catatan</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            Tidak ada data siswa ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t pt-4 mt-4">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan <span className="font-medium text-foreground">{Math.min((currentPage - 1) * itemsPerPage + 1, students.length)}-{Math.min(currentPage * itemsPerPage, students.length)}</span> dari <span className="font-medium text-foreground">{totalPages * itemsPerPage}</span> siswa
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="h-8 px-2 lg:px-3"
                            >
                                <ChevronLeft className="h-4 w-4 lg:mr-1" />
                                <span className="hidden lg:inline">Sebelumnya</span>
                            </Button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNumber = i + 1;
                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={currentPage === pageNumber ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className="h-8 w-8 p-0"
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="h-8 px-2 lg:px-3"
                            >
                                <span className="hidden lg:inline">Selanjutnya</span>
                                <ChevronRight className="h-4 w-4 lg:ml-1" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
