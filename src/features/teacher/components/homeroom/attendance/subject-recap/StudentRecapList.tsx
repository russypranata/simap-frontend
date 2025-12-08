import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    ChevronRight,
    BookOpen,
    ChevronsLeft,
    ChevronLeft,
    ChevronsRight,
    ArrowDownUp,
    Eye,
    TrendingUp,
    TrendingDown,
    Minus,
    Search
} from "lucide-react";

interface SubjectSummary {
    mapel: string;
    persentase: number;
}

export interface StudentRecap {
    id: string;
    nama: string;
    nis: string;
    foto?: string;
    kelas: string;
    jumlahMapel: number;
    ringkasanPresensi: SubjectSummary[];
    rataRataKehadiran?: number; // Added optional average
}

interface StudentRecapListProps {
    students: StudentRecap[];
    onSelectStudent: (student: StudentRecap) => void;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

export const StudentRecapList = ({
    students,
    onSelectStudent,
    currentPage,
    totalPages,
    itemsPerPage,
    totalRecords,
    onPageChange,
    onItemsPerPageChange
}: StudentRecapListProps) => {

    const getBadgeColor = (percentage: number) => {
        if (percentage >= 90) return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
        if (percentage >= 75) return "bg-blue-50 text-blue-700 border-blue-200/60";
        if (percentage >= 50) return "bg-yellow-50 text-yellow-700 border-yellow-200/60";
        return "bg-red-50 text-red-700 border-red-200/60";
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 90) return "bg-emerald-500";
        if (percentage >= 75) return "bg-blue-500";
        if (percentage >= 50) return "bg-yellow-500";
        return "bg-red-500";
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalRecords);

    return (
        <div className="space-y-4">
            {/* Sorting Info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowDownUp className="h-4 w-4" />
                    <span>Urutkan berdasarkan: <span className="font-medium text-foreground">Performa Terendah</span></span>
                </div>
            </div>

            <div className="grid gap-4">
                {students.length > 0 ? (
                    students.map((student) => {
                        // Calculate average if not provided
                        const average = student.rataRataKehadiran ||
                            Math.round(student.ringkasanPresensi.reduce((acc, curr) => acc + curr.persentase, 0) / student.ringkasanPresensi.length);

                        return (
                            <div
                                key={student.id}
                                className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 border rounded-xl bg-card hover:shadow-md transition-all duration-200 gap-5 relative overflow-hidden"
                            >
                                <div className="flex items-center space-x-4 pl-2 w-full md:w-auto">
                                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                        <AvatarImage src={student.foto} alt={student.nama} />
                                        <AvatarFallback className="bg-primary/5 text-primary font-bold text-sm">
                                            {student.nama.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-base">{student.nama}</p>

                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="h-3 w-3" />
                                                {student.jumlahMapel} Mapel
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                            <span className="flex items-center gap-1 font-medium text-foreground">
                                                Rata-rata: <span className={`${average >= 90 ? "text-emerald-600" :
                                                    average >= 75 ? "text-blue-600" :
                                                        average >= 50 ? "text-yellow-600" : "text-red-600"
                                                    }`}>{average}%</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1 justify-end w-full pl-2 md:pl-0">
                                    {/* Subject Badges - Focus on lowest attendance */}
                                    <div className="flex flex-wrap gap-2 justify-end flex-1">
                                        {student.ringkasanPresensi.slice(0, 3).map((summary, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-medium bg-primary/5 text-primary border-primary/20"
                                            >
                                                <span>{summary.mapel}</span>
                                                <span className="w-px h-3 bg-current opacity-20" />
                                                <span>{summary.persentase}%</span>
                                            </div>
                                        ))}
                                        {student.ringkasanPresensi.length > 3 && (
                                            <div className="flex items-center justify-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
                                                +{student.ringkasanPresensi.length - 3}
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        size="sm"
                                        onClick={() => onSelectStudent(student)}
                                        className="bg-primary/10 text-primary hover:bg-primary/20 border-0 shrink-0 w-full md:w-auto"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Detail
                                    </Button>
                                </div>
                            </div >
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl border-dashed bg-muted/5">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                            <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg">Tidak ada siswa ditemukan</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1">
                            Coba ubah kata kunci pencarian atau filter periode Anda.
                        </p>
                    </div>
                )}
            </div >

            {/* Pagination */}
            {
                totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
                        <div className="text-sm text-muted-foreground order-2 sm:order-1">
                            Menampilkan <span className="font-medium text-foreground">{totalRecords > 0 ? startIndex : 0}-{endIndex}</span> dari <span className="font-medium text-foreground">{totalRecords}</span> siswa
                        </div>

                        <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="flex items-center gap-2 mr-2">
                                <span className="text-sm text-muted-foreground hidden sm:inline">Baris:</span>
                                <select
                                    className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                                    value={itemsPerPage}
                                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onPageChange(1)}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8"
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <div className="flex items-center px-1">
                                    <span className="text-sm font-medium">
                                        Halaman {currentPage}
                                    </span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onPageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
