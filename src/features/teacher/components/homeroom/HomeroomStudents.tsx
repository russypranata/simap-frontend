import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search,
    Download,
    Filter,
    Settings,
    ChevronLeft,
    ChevronRight,
    Users,
    Eye,
    FileText,
    AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const HomeroomStudents = () => {
    // Mock data - increased to 32 to demonstrate pagination
    const allStudents = Array.from({ length: 32 }).map((_, i) => ({
        id: i + 1,
        nis: `2024${100 + i}`,
        name: `Siswa ${i + 1}`,
        gender: i % 2 === 0 ? "L" : "P",
        status: i === 3 ? "Sakit" : i === 7 ? "Izin" : "Hadir",
        grade: 80 + (i % 20),
        attendance: 90 + (i % 10),
    }));

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Hadir":
                return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200";
            case "Sakit":
                return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
            case "Izin":
                return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
            case "Alpha":
                return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
        }
    };



    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Pagination logic
    const totalPages = Math.ceil(allStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStudents = allStudents.slice(startIndex, endIndex);

    const router = useRouter();

    const handleViewProfile = (student: any) => {
        router.push(`/homeroom/student/${student.id}`);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <Card className="border-none shadow-none">
                <CardHeader className="px-0 pt-0 pb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">Data Siswa</CardTitle>
                                <CardDescription className="text-sm mt-1">
                                    Daftar siswa kelas XII A Tahun Ajaran 2024/2025 • Semester Ganjil
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" size="sm" className="h-9">
                                <Download className="mr-2 h-4 w-4" />
                                Export Data
                            </Button>
                            <Button size="sm" className="h-9">
                                + Tambah Siswa
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau NIS..."
                                    className="pl-9 bg-background border-muted-foreground/20 focus-visible:ring-primary"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                            </div>
                        </div>

                        <div className="rounded-xl border shadow-sm overflow-hidden bg-card">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="hover:bg-transparent border-b">
                                        <TableHead className="w-[50px] p-4 font-medium text-sm text-foreground text-center">No</TableHead>
                                        <TableHead className="w-[280px] p-4 font-medium text-sm text-foreground">Nama Siswa</TableHead>
                                        <TableHead className="w-[120px] p-4 font-medium text-sm text-foreground">NIS</TableHead>
                                        <TableHead className="w-[100px] p-4 font-medium text-sm text-foreground text-center">Gender</TableHead>
                                        <TableHead className="w-[140px] p-4 font-medium text-sm text-foreground text-center">Status</TableHead>
                                        <TableHead className="w-[200px] p-4 font-medium text-sm text-foreground">Kehadiran Semester</TableHead>
                                        <TableHead className="w-[120px] p-4 font-medium text-sm text-foreground text-center">Rata-rata Nilai</TableHead>
                                        <TableHead className="p-4 font-medium text-sm text-foreground text-right pr-6">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentStudents.map((student, index) => (
                                        <TableRow key={student.id} className="hover:bg-muted/30 transition-colors border-b">
                                            <TableCell className="p-4 text-sm font-medium text-center">
                                                {startIndex + index + 1}
                                            </TableCell>
                                            <TableCell className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-9 w-9 border border-border/50">
                                                        <AvatarImage src="" />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                                                            {student.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-foreground">{student.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Kelas XII A
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-4 text-sm font-mono">{student.nis}</TableCell>
                                            <TableCell className="p-4 text-center">
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "text-[10px] px-2 py-0.5 font-medium border shadow-sm",
                                                        student.gender === 'L'
                                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                                            : "bg-pink-50 text-pink-700 border-pink-200"
                                                    )}
                                                >
                                                    {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-4 text-center">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("font-medium border shadow-sm px-2.5 py-0.5", getStatusColor(student.status))}
                                                >
                                                    {student.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-medium">{student.attendance}%</span>
                                                        <span className={cn(
                                                            "text-[10px] font-medium",
                                                            student.attendance >= 90 ? "text-emerald-600" :
                                                                student.attendance >= 80 ? "text-blue-600" : "text-amber-600"
                                                        )}>
                                                            {student.attendance >= 90 ? "Sangat Baik" : student.attendance >= 80 ? "Baik" : "Perlu Perhatian"}
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-500",
                                                                student.attendance >= 90 ? "bg-emerald-500" :
                                                                    student.attendance >= 80 ? "bg-blue-500" : "bg-amber-500"
                                                            )}
                                                            style={{ width: `${student.attendance}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-4 text-center">
                                                <div className={cn(
                                                    "inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-md text-sm font-bold border shadow-sm",
                                                    student.grade >= 85 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                        student.grade >= 75 ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"
                                                )}>
                                                    {student.grade}
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-4 text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground">
                                                            <Settings className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Aksi Siswa</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewProfile(student)}>
                                                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                                                            Lihat Profil
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                                            Riwayat Absensi
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                                            Transkrip Nilai
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                                                            <AlertCircle className="mr-2 h-4 w-4" />
                                                            Laporkan Masalah
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan <span className="font-medium text-foreground">{startIndex + 1}-{Math.min(endIndex, allStudents.length)}</span> dari <span className="font-medium text-foreground">{allStudents.length}</span> siswa
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="h-8 px-2 lg:px-3"
                                >
                                    <ChevronLeft className="h-4 w-4 lg:mr-1" />
                                    <span className="hidden lg:inline">Sebelumnya</span>
                                </Button>

                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNumber = i + 1;
                                        // Simple logic for small number of pages, can be expanded for many pages
                                        return (
                                            <Button
                                                key={pageNumber}
                                                variant={currentPage === pageNumber ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => goToPage(pageNumber)}
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
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="h-8 px-2 lg:px-3"
                                >
                                    <span className="hidden lg:inline">Selanjutnya</span>
                                    <ChevronRight className="h-4 w-4 lg:ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div >
                </CardContent >
            </Card >
        </>
    );
};
