"use client";

import React from "react";
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
import {
    Calendar,
    GraduationCap,
    TrendingUp,
    TrendingDown,
    Minus,
    BookOpen,
    Award,
    BarChart3,
    Download,
    Star,
    Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudentGrades } from "../hooks/useStudentGrades";

// Helper functions
const getGradeColor = (grade: string): string => {
    if (grade.startsWith("A")) return "text-emerald-600";
    if (grade.startsWith("B")) return "text-blue-600";
    if (grade.startsWith("C")) return "text-amber-600";
    return "text-red-600";
};

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

const TrendIcon = ({ current, previous }: { current: number; previous: number }) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
};

export const StudentGrades: React.FC = () => {
    const {
        grades,
        semesterHistory,
        selectedSemester,
        setSelectedSemester,
        activeTab,
        setActiveTab,
        stats,
        currentSemester,
        previousSemester,
    } = useStudentGrades();

    if (!stats || !currentSemester || !previousSemester) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">Nilai & </span>
                            <span className="bg-gradient-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">Rapor</span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Lihat nilai akademik dan laporan hasil belajar
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-semibold">Tahun Ajaran 2025/2026</span>
                        </div>
                        <div className="h-4 w-[1px] bg-border" />
                        <span className="text-sm font-medium text-blue-800">Semester Ganjil</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Unduh Rapor
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Rata-rata Nilai */}
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
                        <div className="flex items-center gap-1 mt-2 text-xs">
                            <TrendIcon current={currentSemester.averageScore} previous={previousSemester.averageScore} />
                            <span className="text-muted-foreground">
                                vs semester lalu ({previousSemester.averageScore})
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Peringkat */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Peringkat Kelas</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">
                                    #{currentSemester.rank}
                                </p>
                            </div>
                            <div className="p-3 bg-amber-100 rounded-full">
                                <Award className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            dari {currentSemester.totalStudents} siswa
                        </p>
                    </CardContent>
                </Card>

                {/* Nilai Tertinggi */}
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

                {/* Tuntas KKM */}
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
                                <Target className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                        <Progress
                            value={(stats.aboveKKM / stats.totalSubjects) * 100}
                            className="mt-2 h-2"
                        />
                    </CardContent>
                </Card>
            </div>

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
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {grades.length} Mata Pelajaran
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-medium text-sm w-12">No</th>
                                    <th className="text-left p-4 font-medium text-sm min-w-[180px]">Mata Pelajaran</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Harian</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">UTS</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">UAS</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Rata-rata</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Predikat</th>
                                    <th className="text-center p-4 font-medium text-sm w-20">KKM</th>
                                    <th className="text-center p-4 font-medium text-sm w-24">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((grade, index) => (
                                    <tr key={grade.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-4 text-sm text-muted-foreground">{index + 1}</td>
                                        <td className="p-4">
                                            <div>
                                                <p className="font-medium">{grade.subject}</p>
                                                <p className="text-xs text-muted-foreground">{grade.teacher}</p>
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
                                        <td className="p-4 text-center text-sm text-muted-foreground">
                                            {grade.kkm}
                                        </td>
                                        <td className="p-4 text-center">
                                            {grade.averageScore >= grade.kkm ? (
                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                    Tuntas
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-100 text-red-700 border-red-200">
                                                    Belum Tuntas
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Footer */}
                    <div className="p-4 bg-muted/30 border-t">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-6">
                                <div>
                                    <p className="text-xs text-muted-foreground">Rata-rata Keseluruhan</p>
                                    <p className={cn("text-xl font-bold", getScoreColor(stats.totalAverage, 75))}>
                                        {stats.totalAverage}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-border" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Mata Pelajaran</p>
                                    <p className="text-xl font-bold">{stats.totalSubjects}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="h-4 w-4" />
                                Export Nilai
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {semesterHistory.map((semester, index) => (
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
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Kehadiran</span>
                                        <span className="font-semibold">{semester.attendance}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-amber-800" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-900">Keterangan Predikat</h3>
                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">A</Badge>
                                    <span className="text-amber-800">90-100</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">B</Badge>
                                    <span className="text-amber-800">80-89</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">C</Badge>
                                    <span className="text-amber-800">70-79</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-red-100 text-red-700 border-red-200">D</Badge>
                                    <span className="text-amber-800">&lt; 70</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
