import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Eye, FileText, User, BookOpen } from "lucide-react";
import { mockStudents } from "@/features/teacher/services/mockData";
import { PageHeader } from "@/features/shared/components";

// Define strict types for our mock data
interface SubjectGrade {
    name: string;
    knowledge: number;
    skill: number;
    predicate: string;
}

interface StudentReportBase {
    studentId: string;
    academicYear: string;
    semester: string;
    subjects: SubjectGrade[];
    attendance: {
        present: number;
        sick: number;
        permit: number;
        alpha: number;
    };
    notes: string;
}

// Generate consistent mock report data based on existing students
const generateMockReports = (): StudentReportBase[] => {
    // Use existing valid student IDs (1-5 are manual, 6-25 are generated)
    // We'll target the main 'XII A' students from mockStudents
    const targetStudents = mockStudents.filter(s => s.class === "XII A");

    return targetStudents.map(student => ({
        studentId: student.id,
        academicYear: "2025/2026",
        semester: "Ganjil",
        subjects: [
            { name: "Matematika", knowledge: 85, skill: 86, predicate: "B" },
            { name: "Fisika", knowledge: 80, skill: 82, predicate: "B" },
            { name: "Bahasa Indonesia", knowledge: 90, skill: 88, predicate: "A" },
            { name: "Bahasa Inggris", knowledge: 88, skill: 85, predicate: "A" },
            { name: "Biologi", knowledge: 78, skill: 80, predicate: "C" },
            { name: "Kimia", knowledge: 82, skill: 84, predicate: "B" },
        ],
        attendance: {
            present: 95,
            sick: 2,
            permit: 1,
            alpha: 0,
        },
        notes: "Tingkatkan prestasi belajar dan pertahankan kehadiran yang baik.",
    }));
};

const mockReports = generateMockReports();

export const EReport = () => {
    // 1. Filter State
    const [academicYear, setAcademicYear] = useState("2025/2026");
    const [semester, setSemester] = useState("Ganjil");
    const [searchTerm, setSearchTerm] = useState("");

    // 2. Selection State
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // 3. Data Processing
    // Filter students: Must belong to class "XII A" (as this is the Homeroom Dashboard context)
    // AND match search term
    const filteredStudents = mockStudents.filter(student => {
        const isClassMatch = student.class === "XII A";
        const isSearchMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nis.includes(searchTerm);
        return isClassMatch && isSearchMatch;
    });

    // Determine the report data for the selected student
    const selectedReport = selectedStudentId
        ? mockReports.find(r => r.studentId === selectedStudentId && r.academicYear === academicYear && r.semester === semester)
        : null;

    const selectedStudentData = selectedStudentId
        ? mockStudents.find(s => s.id === selectedStudentId)
        : null;

    const handleViewReport = (studentId: string) => {
        setSelectedStudentId(studentId);
        setIsDetailOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <PageHeader title="E-" titleHighlight="Rapor" icon={FileText} description="Rekap nilai akhir siswa berdasarkan semester." />

            {/* Filter Bar */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <Filter className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Filter Data</CardTitle>
                                <CardDescription>
                                    Pilih tahun ajaran dan semester
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <span className="text-sm font-medium">Tahun Ajaran</span>
                            <Select value={academicYear} onValueChange={setAcademicYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2025/2026">2025/2026</SelectItem>
                                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1 space-y-2">
                            <span className="text-sm font-medium">Semester</span>
                            <Select value={semester} onValueChange={setSemester}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                                    <SelectItem value="Genap">Genap</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-[2] space-y-2">
                            <span className="text-sm font-medium">Cari Siswa</span>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama siswa atau NIS..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Student List Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">Daftar Siswa Kelas XII A</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center">No</TableHead>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>NIS</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <TableRow key={student.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => handleViewReport(student.id)}>
                                        <TableCell className="text-center font-medium text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{student.nis}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="secondary" size="sm" className="h-8 shadow-sm">
                                                <Eye className="mr-2 h-3.5 w-3.5" />
                                                Lihat Rapor
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        Data siswa tidak ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Report Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <FileText className="h-5 w-5 text-primary" />
                            Detail E-Rapor Siswa
                        </DialogTitle>
                        <DialogDescription>
                            Laporan Hasil Belajar Semester {semester} Tahun Ajaran {academicYear}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedReport && selectedStudentData ? (
                        <div className="space-y-8 mt-4">

                            {/* 1. Student Info Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Lengkap</p>
                                    <p className="font-semibold text-lg">{selectedStudentData.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nomor Induk Siswa</p>
                                    <p className="font-semibold text-lg">{selectedStudentData.nis}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kelas</p>
                                    <p className="font-semibold text-lg">{selectedStudentData.class}</p>
                                </div>
                            </div>

                            {/* 2. Academic Grades Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold text-lg">Nilai Akademik</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {selectedReport.subjects.map((subject, idx) => (
                                        <Card key={idx} className="overflow-hidden border-l-4 border-l-primary">
                                            <CardContent className="p-4">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex items-center space-x-3 w-full md:w-1/3">
                                                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                            {subject.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <span className="font-semibold text-sm md:text-base">{subject.name}</span>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4 w-full md:w-2/3">
                                                        <div className="text-center p-2 rounded bg-muted/30">
                                                            <p className="text-xs text-muted-foreground mb-1">Pengetahuan</p>
                                                            <p className="font-bold">{subject.knowledge}</p>
                                                        </div>
                                                        <div className="text-center p-2 rounded bg-muted/30">
                                                            <p className="text-xs text-muted-foreground mb-1">Keterampilan</p>
                                                            <p className="font-bold">{subject.skill}</p>
                                                        </div>
                                                        <div className="text-center p-2 rounded bg-muted/30">
                                                            <p className="text-xs text-muted-foreground mb-1">Predikat</p>
                                                            <Badge variant={subject.predicate === 'A' ? "default" : subject.predicate === 'B' ? "secondary" : "outline"} className="px-3">
                                                                {subject.predicate}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Notes Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Catatan Wali Kelas</h3>
                                <Card className="bg-amber-50/50 border-amber-200">
                                    <CardContent className="p-4">
                                        <p className="text-sm italic text-amber-900 leading-relaxed">
                                            &quot;{selectedReport.notes}&quot;
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* 4. Attendance Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Rekap Kehadiran</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Hadir</p>
                                            <p className="text-2xl font-bold text-green-600">{selectedReport.attendance.present}</p>
                                            <span className="text-[10px] text-muted-foreground">Hari</span>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Sakit</p>
                                            <p className="text-2xl font-bold text-yellow-600">{selectedReport.attendance.sick}</p>
                                            <span className="text-[10px] text-muted-foreground">Hari</span>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Izin</p>
                                            <p className="text-2xl font-bold text-blue-600">{selectedReport.attendance.permit}</p>
                                            <span className="text-[10px] text-muted-foreground">Hari</span>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Alfa</p>
                                            <p className="text-2xl font-bold text-red-600">{selectedReport.attendance.alpha}</p>
                                            <span className="text-[10px] text-muted-foreground">Hari</span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="py-12 text-center text-muted-foreground">
                            Data rapor belum tersedia untuk periode ini.
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
