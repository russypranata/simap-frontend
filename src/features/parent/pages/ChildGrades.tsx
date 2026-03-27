"use client";

import React, { useMemo, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    GraduationCap,
    TrendingUp,
    BookOpen,
    Award,
    BarChart3,
    Download,
    Star,
    Target,
    FileText,
    Calendar,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface SubjectGrade {
    id: number;
    subject: string;
    teacher: string;
    dailyScore: number;
    midTermScore: number;
    finalScore: number;
    averageScore: number;
    grade: string;
    kkm: number;
}

interface SemesterSummary {
    semester: string;
    academicYear: string;
    averageScore: number;
    rank: number;
    totalStudents: number;
}

interface ReportCardNote {
    category: string;
    note: string;
    icon: string;
}

// Mock data
const mockChildInfo = {
    name: "Ahmad Fauzan Ramadhan",
    nis: "0012345678",
    class: "XII IPA 1",
    avatar: "",
};

const mockGrades: SubjectGrade[] = [
    { id: 1, subject: "Matematika", teacher: "Ahmad Hidayat, S.Pd", dailyScore: 85, midTermScore: 82, finalScore: 88, averageScore: 85, grade: "A-", kkm: 75 },
    { id: 2, subject: "Fisika", teacher: "Sari Wahyuni, S.Pd", dailyScore: 78, midTermScore: 80, finalScore: 82, averageScore: 80, grade: "B+", kkm: 75 },
    { id: 3, subject: "Kimia", teacher: "Rudi Hartono, S.Pd", dailyScore: 82, midTermScore: 85, finalScore: 84, averageScore: 84, grade: "A-", kkm: 75 },
    { id: 4, subject: "Biologi", teacher: "Ani Suryani, S.Pd", dailyScore: 88, midTermScore: 90, finalScore: 92, averageScore: 90, grade: "A", kkm: 75 },
    { id: 5, subject: "Bahasa Indonesia", teacher: "Dewi Lestari, S.Pd", dailyScore: 80, midTermScore: 78, finalScore: 82, averageScore: 80, grade: "B+", kkm: 75 },
    { id: 6, subject: "Bahasa Inggris", teacher: "Budi Santoso, S.Pd", dailyScore: 85, midTermScore: 88, finalScore: 86, averageScore: 86, grade: "A-", kkm: 75 },
    { id: 7, subject: "Sejarah", teacher: "Hendra Gunawan, S.Pd", dailyScore: 78, midTermScore: 75, finalScore: 80, averageScore: 78, grade: "B", kkm: 75 },
    { id: 8, subject: "Pendidikan Agama Islam", teacher: "Usman Abdullah, S.Pd.I", dailyScore: 92, midTermScore: 95, finalScore: 93, averageScore: 93, grade: "A", kkm: 75 },
    { id: 9, subject: "PKn", teacher: "Rina Marlina, S.Pd", dailyScore: 82, midTermScore: 80, finalScore: 84, averageScore: 82, grade: "B+", kkm: 75 },
    { id: 10, subject: "Seni Budaya", teacher: "Ratna Sari, S.Sn", dailyScore: 88, midTermScore: 85, finalScore: 90, averageScore: 88, grade: "A-", kkm: 75 },
    { id: 11, subject: "PJOK", teacher: "Agus Prasetyo, S.Pd", dailyScore: 85, midTermScore: 87, finalScore: 86, averageScore: 86, grade: "A-", kkm: 75 },
    { id: 12, subject: "Prakarya", teacher: "Fitri Handayani, S.Pd", dailyScore: 83, midTermScore: 85, finalScore: 84, averageScore: 84, grade: "A-", kkm: 75 },
];

const mockSemesterHistory: SemesterSummary[] = [
    { semester: "Ganjil", academicYear: "2025/2026", averageScore: 85.2, rank: 5, totalStudents: 32 },
    { semester: "Genap", academicYear: "2024/2025", averageScore: 84.5, rank: 6, totalStudents: 32 },
    { semester: "Ganjil", academicYear: "2024/2025", averageScore: 83.8, rank: 8, totalStudents: 32 },
];

const mockReportCardNotes: ReportCardNote[] = [
    {
        category: "Prestasi Akademik",
        note: "Ananda menunjukkan peningkatan yang signifikan dalam mata pelajaran IPA, khususnya Biologi. Pertahankan semangat belajar dan tingkatkan pemahaman dalam Matematika.",
        icon: "🏆"
    },
    {
        category: "Sikap dan Perilaku",
        note: "Ananda aktif dalam kegiatan kelas dan menunjukkan sikap yang baik terhadap guru dan teman. Teruslah menjadi contoh yang baik dalam kedisiplinan.",
        icon: "⭐"
    },
    {
        category: "Ekstrakurikuler",
        note: "Ananda aktif mengikuti kegiatan Pramuka dan menunjukkan kepemimpinan yang baik. Pertahankan partisipasi dalam kegiatan ekstrakurikuler.",
        icon: "🎯"
    },
    {
        category: "Catatan Wali Kelas",
        note: "Secara keseluruhan, Ananda adalah siswa yang berprestasi dan menjadi kebanggaan kelas. Teruslah berusaha dan jangan mudah menyerah menghadapi tantangan.",
        icon: "📝"
    },
];

// Helper functions
const getGradeBadgeColor = (grade: string): string => {
    if (grade.startsWith("A")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (grade.startsWith("C")) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
};

const getScoreColor = (score: number, kkm: number): string => {
    if (score >= kkm + 15) return "text-emerald-600";
    if (score >= kkm) return "text-blue-600";
    return "text-red-600";
};

export const ChildGrades: React.FC = () => {
    const [selectedSemester, setSelectedSemester] = useState("ganjil-2025");

    // Calculate stats
    const stats = useMemo(() => {
        const totalAverage = mockGrades.reduce((sum, g) => sum + g.averageScore, 0) / mockGrades.length;
        const highestSubject = mockGrades.reduce((prev, current) =>
            prev.averageScore > current.averageScore ? prev : current
        );
        const lowestSubject = mockGrades.reduce((prev, current) =>
            prev.averageScore < current.averageScore ? prev : current
        );
        const aboveKKM = mockGrades.filter(g => g.averageScore >= g.kkm).length;

        return {
            totalAverage: Math.round(totalAverage * 10) / 10,
            highestSubject,
            lowestSubject,
            aboveKKM,
            totalSubjects: mockGrades.length,
        };
    }, []);

    const currentSemester = mockSemesterHistory[0];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Nilai </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Anak</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Pantau perkembangan nilai akademik anak Anda
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Pilih Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ganjil-2025">Ganjil 2025/2026</SelectItem>
                            <SelectItem value="genap-2025">Genap 2024/2025</SelectItem>
                            <SelectItem value="ganjil-2024">Ganjil 2024/2025</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                        <Download className="h-4 w-4" />
                        Unduh Rapor
                    </Button>
                </div>
            </div>

            {/* Child Info Card */}
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-lg">
                            {mockChildInfo.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{mockChildInfo.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>NIS: {mockChildInfo.nis}</span>
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                    {mockChildInfo.class}
                                </Badge>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Peringkat Kelas</p>
                            <p className="text-2xl font-bold text-amber-600">#{currentSemester.rank}</p>
                            <p className="text-xs text-muted-foreground">dari {currentSemester.totalStudents} siswa</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Rata-rata Nilai</p>
                                <p className={cn(
                                    "text-2xl font-bold mt-1",
                                    stats.totalAverage >= 85 ? "text-emerald-600" :
                                        stats.totalAverage >= 75 ? "text-blue-600" : "text-amber-600"
                                )}>
                                    {stats.totalAverage}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <BarChart3 className="h-5 w-5 text-blue-800" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Nilai Tertinggi</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">
                                    {stats.highestSubject.averageScore}
                                </p>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-full">
                                <Star className="h-5 w-5 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {stats.highestSubject.subject}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Perlu Perhatian</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">
                                    {stats.lowestSubject.averageScore}
                                </p>
                            </div>
                            <div className="p-3 bg-amber-100 rounded-full">
                                <Target className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {stats.lowestSubject.subject}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Tuntas KKM</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {stats.aboveKKM}/{stats.totalSubjects}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <Award className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                        <Progress
                            value={(stats.aboveKKM / stats.totalSubjects) * 100}
                            className="mt-2 h-2"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Tabs - Nilai & Catatan Rapor */}
            <Tabs defaultValue="nilai" className="space-y-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="nilai" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        Nilai Akademik
                    </TabsTrigger>
                    <TabsTrigger value="catatan" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Catatan Rapor
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="nilai" className="space-y-4">
                    {/* Grades Table */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Nilai Per Mata Pelajaran</CardTitle>
                                        <CardDescription>Semester Ganjil TA 2025/2026</CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full table-fixed">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                            <th className="text-left p-4 font-medium text-sm">Mata Pelajaran</th>
                                            <th className="text-center p-4 font-medium text-sm w-20">Harian</th>
                                            <th className="text-center p-4 font-medium text-sm w-20">UTS</th>
                                            <th className="text-center p-4 font-medium text-sm w-20">UAS</th>
                                            <th className="text-center p-4 font-medium text-sm w-20">Rata-rata</th>
                                            <th className="text-center p-4 font-medium text-sm w-20">Predikat</th>
                                            <th className="text-center p-4 font-medium text-sm w-20">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockGrades.map((grade, index) => (
                                            <tr key={grade.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="p-4 text-sm text-muted-foreground">{index + 1}</td>
                                                <td className="p-4">
                                                    <div className="truncate">
                                                        <p className="font-medium truncate">{grade.subject}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{grade.teacher}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={cn("font-medium", getScoreColor(grade.dailyScore, grade.kkm))}>
                                                        {grade.dailyScore}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={cn("font-medium", getScoreColor(grade.midTermScore, grade.kkm))}>
                                                        {grade.midTermScore}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={cn("font-medium", getScoreColor(grade.finalScore, grade.kkm))}>
                                                        {grade.finalScore}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={cn("font-bold text-lg", getScoreColor(grade.averageScore, grade.kkm))}>
                                                        {grade.averageScore}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <Badge variant="outline" className={cn("font-bold", getGradeBadgeColor(grade.grade))}>
                                                        {grade.grade}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-center">
                                                    {grade.averageScore >= grade.kkm ? (
                                                        <Badge className="bg-green-100 text-green-700 border-green-200">
                                                            Tuntas
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-red-100 text-red-700 border-red-200">
                                                            Belum
                                                        </Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="catatan" className="space-y-4">
                    {/* Catatan Rapor */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Catatan Rapor</CardTitle>
                                    <CardDescription>Semester Ganjil TA 2025/2026</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockReportCardNotes.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg border bg-gradient-to-r from-muted/50 to-transparent hover:from-muted transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm mb-1">{item.category}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{item.note}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Semester History */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Riwayat Nilai</CardTitle>
                            <CardDescription>Perbandingan nilai antar semester</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {mockSemesterHistory.map((semester, index) => (
                            <div
                                key={`${semester.academicYear}-${semester.semester}`}
                                className={cn(
                                    "p-4 rounded-lg border",
                                    index === 0 ? "bg-blue-50 border-blue-200" : "bg-muted/30"
                                )}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant={index === 0 ? "default" : "outline"} className={index === 0 ? "bg-blue-800" : ""}>
                                        {semester.semester}
                                    </Badge>
                                    {index === 0 && (
                                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                            Aktif
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">{semester.academicYear}</p>
                                <div className="mt-3 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Rata-rata</span>
                                        <span className={cn("font-bold", getScoreColor(semester.averageScore, 75))}>
                                            {semester.averageScore}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Peringkat</span>
                                        <span className="font-semibold">#{semester.rank}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
