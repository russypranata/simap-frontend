"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, CheckCircle, Clock, AlertCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type AttendanceStudent } from "../../services/advisorAttendanceService";

const STATUS_BADGE: Record<string, string> = {
    hadir: "bg-green-100 text-green-700 border-green-200",
    sakit: "bg-yellow-100 text-yellow-700 border-yellow-200",
    izin: "bg-sky-100 text-sky-700 border-sky-200",
    alpa: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
    hadir: <CheckCircle className="h-3 w-3" />,
    sakit: <AlertCircle className="h-3 w-3" />,
    izin: <Clock className="h-3 w-3" />,
    alpa: <XCircle className="h-3 w-3" />,
};

interface AttendanceStudentTableProps {
    paginatedStudents: AttendanceStudent[];
    filteredStudents: AttendanceStudent[];
    uniqueClasses: string[];
    searchTerm: string;
    statusFilter: string;
    classFilter: string;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onSearchChange: (s: string) => void;
    onStatusFilterChange: (s: string) => void;
    onClassFilterChange: (c: string) => void;
    onPageChange: (p: number) => void;
    onResetFilters: () => void;
}

export const AttendanceStudentTable: React.FC<AttendanceStudentTableProps> = ({
    paginatedStudents,
    filteredStudents,
    uniqueClasses,
    searchTerm,
    statusFilter,
    classFilter,
    currentPage,
    totalPages,
    itemsPerPage,
    onSearchChange,
    onStatusFilterChange,
    onClassFilterChange,
    onPageChange,
    onResetFilters,
}) => (
    <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-lg font-semibold">Daftar Kehadiran Siswa</CardTitle>
                    <CardDescription>Data kehadiran setiap siswa pada kegiatan ini</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <div className="p-4 border-b">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama atau NIS..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 pr-9"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <XCircle className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Label className="text-sm whitespace-nowrap">Kelas:</Label>
                        <Select value={classFilter} onValueChange={onClassFilterChange}>
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                {uniqueClasses.map((cls) => (
                                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Label className="text-sm whitespace-nowrap">Status:</Label>
                        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="hadir">Hadir</SelectItem>
                                <SelectItem value="sakit">Sakit</SelectItem>
                                <SelectItem value="izin">Izin</SelectItem>
                                <SelectItem value="alpa">Alpa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {(searchTerm || statusFilter !== "all" || classFilter !== "all") && (
                    <div className="flex justify-end mt-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onResetFilters}>
                            Reset Filter
                        </Button>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-12">No</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">NIS</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 min-w-48">Nama Siswa</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-24">Kelas</th>
                            <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 w-32">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStudents.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="rounded-full bg-muted p-6">
                                            <Search className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {searchTerm
                                                ? `Tidak ada siswa yang cocok dengan "${searchTerm}"`
                                                : "Tidak ada data sesuai filter."}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedStudents.map((student, index) => (
                                <tr key={student.id} className="border-b hover:bg-muted/30 transition-colors">
                                    <td className="p-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="p-4 text-sm font-mono">{student.nis}</td>
                                    <td className="p-4 text-sm font-medium">{student.name}</td>
                                    <td className="p-4">
                                        <Badge className="bg-blue-50 text-blue-800 border-blue-200">{student.class}</Badge>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Badge className={cn("gap-1", STATUS_BADGE[student.status] || "bg-gray-100 text-gray-700")}>
                                            {STATUS_ICON[student.status]}
                                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 border-t bg-muted/20">
                <p className="text-sm text-muted-foreground">
                    Menampilkan{" "}
                    <span className="font-medium text-foreground">
                        {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                    </span>
                    {" "}-{" "}
                    <span className="font-medium text-foreground">
                        {Math.min(currentPage * itemsPerPage, filteredStudents.length)}
                    </span>
                    {" "}dari{" "}
                    <span className="font-medium text-foreground">{filteredStudents.length}</span> data
                </p>
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline" size="sm"
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const p = totalPages <= 5 ? i + 1
                                : currentPage <= 3 ? i + 1
                                : currentPage >= totalPages - 2 ? totalPages - 4 + i
                                : currentPage - 2 + i;
                            return (
                                <Button
                                    key={p}
                                    variant={currentPage === p ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(p)}
                                    className={cn("w-8 h-8 p-0", currentPage === p && "bg-blue-800 hover:bg-blue-900 text-white")}
                                >
                                    {p}
                                </Button>
                            );
                        })}
                        <Button
                            variant="outline" size="sm"
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
);
