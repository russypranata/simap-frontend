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
    ChevronLeft,
    ChevronRight,
    BarChart3,
    Download,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SemesterAttendanceViewProps {
    students: any[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedSemester: string;
    setSelectedSemester: (semester: string) => void;
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    totalPages: number;
}

export const SemesterAttendanceView = ({
    students,
    searchTerm,
    setSearchTerm,
    selectedSemester,
    setSelectedSemester,
    selectedYear,
    setSelectedYear,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages
}: SemesterAttendanceViewProps) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">Rekap Presensi Pagi Semester</CardTitle>
                            <CardDescription>Ringkasan presensi pagi siswa semester ini</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" /> Export PDF
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row items-center justify-between bg-muted/30 p-4 rounded-lg border mb-4 gap-4">
                    <div className="relative w-full lg:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau NIS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-background border-muted-foreground/20 focus-visible:ring-primary"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                            <SelectTrigger className="w-[140px] bg-background">
                                <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ganjil">Ganjil</SelectItem>
                                <SelectItem value="genap">Genap</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-[100px] bg-background">
                                <SelectValue placeholder="Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
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
                                <TableHead className="text-center p-3 font-medium text-sm text-foreground">Hadir</TableHead>
                                <TableHead className="text-center p-3 font-medium text-sm text-foreground">Sakit</TableHead>
                                <TableHead className="text-center p-3 font-medium text-sm text-foreground">Izin</TableHead>
                                <TableHead className="text-center p-3 font-medium text-sm text-foreground">Alpha</TableHead>
                                <TableHead className="text-center p-3 font-medium text-sm text-foreground">Terlambat</TableHead>
                                <TableHead className="text-center p-3 font-medium text-sm text-foreground w-[200px]">Persentase Kehadiran</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.length > 0 ? (
                                students.map((student, index) => {
                                    const total = student.semesterStats.hadir + student.semesterStats.sakit + student.semesterStats.izin + student.semesterStats.alpha + (student.semesterStats.terlambat || 0);
                                    const percentage = total > 0 ? ((student.semesterStats.hadir / total) * 100).toFixed(0) : 0;
                                    return (
                                        <TableRow key={student.id} className="hover:bg-muted/30 transition-colors border-b">
                                            <TableCell className="p-3 font-medium text-sm text-center">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
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
                                            <TableCell className="text-center p-3">
                                                <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">{student.semesterStats.hadir}</span>
                                            </TableCell>
                                            <TableCell className="text-center p-3">
                                                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">{student.semesterStats.sakit}</span>
                                            </TableCell>
                                            <TableCell className="text-center p-3">
                                                <span className="font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">{student.semesterStats.izin}</span>
                                            </TableCell>
                                            <TableCell className="text-center p-3">
                                                <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">{student.semesterStats.alpha}</span>
                                            </TableCell>
                                            <TableCell className="text-center p-3">
                                                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">{student.semesterStats.terlambat || 0}</span>
                                            </TableCell>
                                            <TableCell className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <Progress value={Number(percentage)} className="h-2 flex-1" />
                                                    <span className="text-sm font-bold w-9 text-right">{percentage}%</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
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
    );
};
