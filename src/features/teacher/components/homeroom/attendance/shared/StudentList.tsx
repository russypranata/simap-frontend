import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface StudentBase {
    id: string | number;
    nama: string;
    nis: string;
    kelas?: string;
    foto?: string;
    [key: string]: any;
}

interface StudentListProps<T extends StudentBase> {
    students: T[];
    onSelect: (student: T) => void;
    renderSummary: (student: T) => React.ReactNode;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
    emptyMessage?: string;
}

export const StudentList = <T extends StudentBase>({
    students,
    onSelect,
    renderSummary,
    currentPage,
    totalPages,
    itemsPerPage,
    totalRecords,
    onPageChange,
    onItemsPerPageChange,
    emptyMessage = "Tidak ada data siswa ditemukan."
}: StudentListProps<T>) => {
    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {students.length > 0 ? (
                    students.map((student) => (
                        <div
                            key={student.id}
                            className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 border rounded-xl bg-card hover:shadow-md transition-all duration-200 gap-5 relative overflow-hidden cursor-pointer"
                            onClick={() => onSelect(student)}
                        >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm group-hover:border-primary/20 transition-colors">
                                    <AvatarImage src={student.foto} alt={student.nama} />
                                    <AvatarFallback className="bg-primary/5 text-primary font-bold text-sm">
                                        {student.nama.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                                        {student.nama}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded text-xs border border-border/50">
                                            {student.nis}
                                        </span>
                                        {student.kelas && (
                                            <>
                                                <span className="text-muted-foreground/40">•</span>
                                                <span>{student.kelas}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1 justify-end w-full md:pl-0 pl-[4rem]">
                                <div className="w-full md:w-auto">
                                    {renderSummary(student)}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hidden md:flex h-8 bg-muted/30 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                                >
                                    Detail <ChevronRight className="ml-1 h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-accent/5">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                            <MoreHorizontal className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-foreground">{emptyMessage}</p>
                        <p className="text-sm text-muted-foreground mt-1">Coba ubah filter atau kata kunci pencarian.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalRecords > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Show</span>
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(val) => onItemsPerPageChange(Number(val))}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={itemsPerPage} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>of {totalRecords} entries</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1 mx-2">
                            <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
