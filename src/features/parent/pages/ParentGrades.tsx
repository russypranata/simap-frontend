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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import {
    GraduationCap,
    TrendingUp,
    BookOpen,
    BarChart3,
    Target,
    FileText,
    Check,
    BookText,
    Users,
    Trophy,
    Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/features/shared/components";
import {
    GradesSkeleton,
    GradesFilterDialog,
    GradesFilterBadges,
    AttitudeSection,
    AttendanceSection,
    ExtracurricularSection,
    GradeDetailDialog,
    TrendChart,
} from "../components/grades";
import { getScoreColor, getGradeColor } from "../components/grades/helpers";
import { useParentGrades } from "../hooks/useParentGrades";
import { ErrorState } from "@/features/shared/components";
import { useBreadcrumbAction } from "@/context/BreadcrumbActionContext";
import { RefreshCw } from "lucide-react";

export const ParentGrades: React.FC = () => {
    const { setAction, clearAction } = useBreadcrumbAction();
    const {
        children, selectedChild, academicYears, activeYear,
        grades, attitude, extracurriculars, attendance,
        semesterHistory, reportCardNotes, stats,
        isReportAvailable, displaySemester, currentSemesterStatus,
        selectedChildId, setSelectedChildId,
        selectedYearId, selectedSemester,
        selectedTab, setSelectedTab,
        filterOpen, setFilterOpen,
        selectedGrade, setSelectedGrade,
        isLoading, isFetching, error, handleApplyFilter,
    } = useParentGrades();

    React.useEffect(() => {
        if (isFetching) {
            setAction(
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden sm:inline">Memperbarui...</span>
                </div>
            );
        } else {
            clearAction();
        }
        return () => clearAction();
    }, [isFetching, setAction, clearAction]);

    if (isLoading) return <GradesSkeleton />;
    if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

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
                        Laporan hasil belajar akademik
                        {selectedChild && (
                            <span className="font-medium text-slate-700"> · {selectedChild.name} <span className="text-slate-400">·</span> {selectedChild.class}</span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3 no-print">
                    {children.length > 1 && (
                        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                            <SelectTrigger className="w-auto h-9 bg-white shadow-sm border-slate-200 gap-2 px-3">
                                <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="text-sm text-slate-700 font-medium">Ganti Anak</span>
                            </SelectTrigger>
                            <SelectContent>
                                {children.map(child => (
                                    <SelectItem key={child.id} value={child.id}>
                                        {child.name} — {child.class}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <GradesFilterDialog
                        open={filterOpen}
                        onOpenChange={setFilterOpen}
                        selectedYearId={selectedYearId}
                        selectedSemester={selectedSemester}
                        academicYears={academicYears}
                        onApply={handleApplyFilter}
                    />
                </div>
            </div>

            <GradesFilterBadges
                selectedYearId={selectedYearId}
                selectedSemester={selectedSemester}
                academicYears={academicYears}
                onClearYear={() => handleApplyFilter(academicYears[0]?.id, selectedSemester)}
                onClearSemester={() => {
                    const firstCompleted = academicYears.find(y => y.id === selectedYearId)?.semesters.find(s => s.status === "completed");
                    handleApplyFilter(selectedYearId, firstCompleted?.id ?? academicYears[0]?.semesters.find(s => s.status === "completed")?.id ?? "ganjil");
                }}
            />

            {!isReportAvailable ? (
                <Card className={cn("border-dashed shadow-sm", currentSemesterStatus === "active" ? "border-blue-200 bg-blue-50/30" : "border-slate-200 bg-slate-50/30")}>
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center px-4">
                        <div className={cn("w-16 h-16 rounded-full border border-dashed flex items-center justify-center mb-4", currentSemesterStatus === "active" ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200")}>
                            <FileText className={cn("h-8 w-8", currentSemesterStatus === "active" ? "text-blue-400" : "text-slate-400")} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            {currentSemesterStatus === "active" ? "Rapor Belum Tersedia" : "Semester Belum Dimulai"}
                        </h3>
                        <p className="text-sm text-slate-500 max-w-md">
                            {currentSemesterStatus === "active"
                                ? `Semester ${displaySemester} sedang berlangsung. Rapor akan tersedia setelah semester berakhir dan nilai difinalisasi oleh guru.`
                                : `Semester ${displaySemester} belum dimulai. Rapor akan tersedia setelah semester selesai.`}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-stretch print:hidden">
                        <StatCard title="Rata-rata Nilai" value={stats.totalAverage} subtitle="Semua mapel" icon={BarChart3} color="blue" />
                        <StatCard title="Nilai Tertinggi" value={stats.highestSubject.finalAverage} subtitle={stats.highestSubject.subject} icon={TrendingUp} color="emerald" />
                        <StatCard title="Nilai Terendah" value={stats.lowestSubject.finalAverage} subtitle={stats.lowestSubject.subject} icon={Target} color="amber" />
                        <StatCard title="Tuntas KKM" value={`${stats.aboveKKM}/${stats.totalSubjects}`} subtitle="Mata pelajaran" icon={Check} color="green" />
                        <StatCard title="Peringkat Kelas" value={`#${stats.currentRank}`} subtitle={`dari ${stats.totalStudents} siswa`} icon={Trophy} color="purple" />
                    </div>

                    <AttendanceSection attendance={attendance} />

                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="print:hidden">
                        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid lg:grid-cols-2">
                            <TabsTrigger value="nilai">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Nilai Akademik
                            </TabsTrigger>
                            <TabsTrigger value="catatan">
                                <FileText className="h-4 w-4 mr-2" />
                                Catatan Rapor
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="nilai" className="space-y-4 mt-4">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-blue-100 rounded-xl">
                                                <BookText className="h-5 w-5 text-blue-700" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-slate-800">Nilai Mata Pelajaran</CardTitle>
                                                <CardDescription className="text-sm text-slate-600">
                                                    Semester {displaySemester} TA. {activeYear?.year} — klik baris untuk detail & deskripsi
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                                            <Info className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">KKM = 75</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200">
                                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[40px]">No</th>
                                                    <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle min-w-[180px]">Mata Pelajaran</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[70px]">KKM</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">KI-3</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">KI-4</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">Akhir</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[70px]">Predikat</th>
                                                    <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {grades.map((grade, index) => (
                                                    <tr key={grade.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => setSelectedGrade(grade)}>
                                                        <td className="p-4 align-middle text-center">
                                                            <span className="text-sm text-slate-600 font-medium">{index + 1}</span>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="flex flex-col gap-0.5">
                                                                <span className="text-[15px] text-slate-800 font-semibold group-hover:text-blue-700 transition-colors">{grade.subject}</span>
                                                                <span className="text-[13px] text-slate-500 font-medium">{grade.teacher}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <span className="text-sm font-semibold text-slate-500">{grade.kkm}</span>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className={cn("text-sm font-bold", getScoreColor(grade.ki3Average, grade.kkm))}>{grade.ki3Average}</span>
                                                                <Badge variant="outline" className={cn("text-xs", getGradeColor(grade.ki3Predicate))}>{grade.ki3Predicate}</Badge>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className={cn("text-sm font-bold", getScoreColor(grade.ki4Average, grade.kkm))}>{grade.ki4Average}</span>
                                                                <Badge variant="outline" className={cn("text-xs", getGradeColor(grade.ki4Predicate))}>{grade.ki4Predicate}</Badge>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <span className={cn("text-base font-bold", getScoreColor(grade.finalAverage, grade.kkm))}>{grade.finalAverage}</span>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            <Badge variant="outline" className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium border rounded-full", getGradeColor(grade.finalGrade))}>
                                                                {grade.finalGrade}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 align-middle text-center">
                                                            {grade.finalAverage >= grade.kkm ? (
                                                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] font-semibold">Tuntas</Badge>
                                                            ) : (
                                                                <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] font-semibold">Belum</Badge>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center gap-1.5 text-xs text-slate-400">
                                        <Info className="h-3.5 w-3.5" />
                                        Klik baris untuk melihat deskripsi capaian kompetensi dan skor detail
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="catatan" className="space-y-4 mt-4">
                            <Card className="border-blue-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-100 rounded-xl">
                                            <FileText className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-semibold text-slate-800">Catatan Rapor</CardTitle>
                                            <CardDescription className="text-sm text-slate-600">Semester {displaySemester} TA. {activeYear?.year}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {reportCardNotes.map((item, index) => (
                                        <div key={index} className={cn("p-4 rounded-xl border bg-gradient-to-r from-slate-50/50 to-white", index === 0 ? "border-amber-200" : index === 1 ? "border-blue-200" : index === 2 ? "border-emerald-200" : "border-purple-200")}>
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-800 mb-1.5 text-sm">{item.category}</h4>
                                                    <p className="text-sm text-slate-600 leading-relaxed">{item.note}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <GradeDetailDialog grade={selectedGrade} onClose={() => setSelectedGrade(null)} />
                    <AttitudeSection attitude={attitude} />
                    <ExtracurricularSection extracurriculars={extracurriculars} />
                </div>
            )}

            <Card className="border-blue-200 shadow-sm print:hidden">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-xl">
                            <TrendingUp className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-slate-800">Tren Nilai</CardTitle>
                            <CardDescription className="text-sm text-slate-600">Perkembangan rata-rata nilai antar semester</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200">
                        <TrendChart history={semesterHistory} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
