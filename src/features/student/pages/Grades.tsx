'use client';

import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    GraduationCap,
    TrendingUp,
    BookOpen,
    BarChart3,
    Target,
    FileText,
    Check,
    BookText,
    Trophy,
    Info,
    RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatCard, ErrorState } from '@/features/shared/components';
import {
    GradesSkeleton,
    GradesFilterDialog,
    GradesFilterBadges,
    AttitudeSection,
    ExtracurricularSection,
    GradeDetailDialog,
    TrendChart,
} from '@/features/parent/components/grades';
import {
    getScoreColor,
    getGradeColor,
} from '@/features/parent/components/grades/helpers';
import { useStudentGrades } from '../hooks/useStudentGrades';
import { useBreadcrumbAction } from '@/context/BreadcrumbActionContext';
import { useQuery } from '@tanstack/react-query';
import { getStudentExtracurricularData } from '../services/studentExtracurricularService';
import type { Extracurricular } from '@/features/parent/components/grades/types';

export const StudentGrades: React.FC = () => {
    const { setAction, clearAction } = useBreadcrumbAction();

    const {
        grades,
        academicYears,
        activeYear,
        attitude,
        semesterHistory,
        reportCardNotes,
        stats,
        displaySemester,
        selectedYearId,
        selectedSemester,
        selectedTab,
        setSelectedTab,
        filterOpen,
        setFilterOpen,
        selectedGrade,
        setSelectedGrade,
        handleApplyFilter,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useStudentGrades();

    // Fetch extracurricular data for ExtracurricularSection
    const ekskulQuery = useQuery({
        queryKey: ['student-ekskul-grades', selectedYearId],
        queryFn: () => getStudentExtracurricularData(selectedYearId),
        enabled: !!selectedYearId,
        staleTime: 5 * 60 * 1000,
    });

    // Map student extracurricular shape → parent Extracurricular shape
    const extracurriculars: Extracurricular[] = (
        ekskulQuery.data?.extracurriculars ?? []
    ).map((e) => ({
        name: e.name,
        type: 'Pilihan' as const,
        score:
            e.attendanceRate >= 90 ? 'A' : e.attendanceRate >= 75 ? 'B' : 'C',
        predicate:
            e.attendanceRate >= 90
                ? 'Sangat Baik'
                : e.attendanceRate >= 75
                  ? 'Baik'
                  : 'Cukup',
        description: `Tingkat kehadiran: ${e.attendanceRate}%`,
        instructor: e.advisor,
    }));

    React.useEffect(() => {
        if (isFetching) {
            setAction(
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden sm:inline">Memperbarui...</span>
                </div>,
            );
        } else {
            clearAction();
        }
        return () => clearAction();
    }, [isFetching, setAction, clearAction]);

    if (isLoading) return <GradesSkeleton />;
    if (error) return <ErrorState error={error} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            <span className="bg-linear-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Nilai &{' '}
                            </span>
                            <span className="bg-linear-to-r from-blue-800 via-primary to-blue-400 bg-clip-text text-transparent">
                                Rapor
                            </span>
                        </h1>
                        <div className="flex items-center gap-2 p-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Laporan hasil belajar akademik kamu
                    </p>
                </div>
                <div className="flex items-center gap-3 no-print">
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
                onClearYear={() =>
                    handleApplyFilter(academicYears[0]?.id, selectedSemester)
                }
                onClearSemester={() => {
                    const firstCompleted = academicYears
                        .find((y) => y.id === selectedYearId)
                        ?.semesters.find((s) => s.status === 'completed');
                    handleApplyFilter(
                        selectedYearId,
                        firstCompleted?.id ??
                            academicYears[0]?.semesters.find(
                                (s) => s.status === 'completed',
                            )?.id ??
                            'ganjil',
                    );
                }}
            />

            <div className="space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-stretch print:hidden">
                    <StatCard
                        title="Rata-rata Nilai"
                        value={stats.totalAverage}
                        subtitle="Semua mapel"
                        icon={BarChart3}
                        color="blue"
                    />
                    <StatCard
                        title="Nilai Tertinggi"
                        value={stats.highestSubject.finalAverage}
                        subtitle={stats.highestSubject.subject}
                        icon={TrendingUp}
                        color="emerald"
                    />
                    <StatCard
                        title="Nilai Terendah"
                        value={stats.lowestSubject.finalAverage}
                        subtitle={stats.lowestSubject.subject}
                        icon={Target}
                        color="amber"
                    />
                    <StatCard
                        title="Tuntas KKM"
                        value={`${stats.aboveKKM}/${stats.totalSubjects}`}
                        subtitle="Mata pelajaran"
                        icon={Check}
                        color="green"
                    />
                    <StatCard
                        title="Peringkat Kelas"
                        value={
                            stats.currentRank > 0
                                ? `#${stats.currentRank}`
                                : '-'
                        }
                        subtitle={
                            stats.totalStudents > 0
                                ? `dari ${stats.totalStudents} siswa`
                                : 'belum tersedia'
                        }
                        icon={Trophy}
                        color="purple"
                    />
                </div>

                {/* Tabs */}
                <Tabs
                    value={selectedTab}
                    onValueChange={setSelectedTab}
                    className="print:hidden"
                >
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid lg:grid-cols-3">
                        <TabsTrigger value="nilai">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Nilai Akademik
                        </TabsTrigger>
                        <TabsTrigger value="catatan">
                            <FileText className="h-4 w-4 mr-2" />
                            Catatan Rapor
                        </TabsTrigger>
                        <TabsTrigger value="statistik">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Statistik
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab: Nilai Akademik */}
                    <TabsContent value="nilai" className="space-y-4 mt-4">
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-100 rounded-xl">
                                            <BookText className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-semibold text-slate-800">
                                                Nilai Mata Pelajaran
                                            </CardTitle>
                                            <CardDescription className="text-sm text-slate-600">
                                                Semester {displaySemester} TA.{' '}
                                                {activeYear?.year} — klik baris
                                                untuk detail & deskripsi
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                                        <Info className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">
                                            KKM = 75
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {grades.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                                        <div className="w-14 h-14 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4">
                                            <BookText className="h-7 w-7 text-slate-400" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-600">
                                            Belum ada nilai untuk semester ini
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Nilai akan muncul setelah guru
                                            menginput penilaian
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-200">
                                                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[40px]">
                                                            No
                                                        </th>
                                                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle min-w-[180px]">
                                                            Mata Pelajaran
                                                        </th>
                                                        <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[70px]">
                                                            KKM
                                                        </th>
                                                        <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">
                                                            KI-3
                                                        </th>
                                                        <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">
                                                            KI-4
                                                        </th>
                                                        <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">
                                                            Akhir
                                                        </th>
                                                        <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[70px]">
                                                            Predikat
                                                        </th>
                                                        <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider align-middle w-[80px]">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {grades.map(
                                                        (grade, index) => (
                                                            <tr
                                                                key={grade.id}
                                                                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                                                onClick={() =>
                                                                    setSelectedGrade(
                                                                        grade,
                                                                    )
                                                                }
                                                            >
                                                                <td className="p-4 align-middle text-center">
                                                                    <span className="text-sm text-slate-600 font-medium">
                                                                        {index +
                                                                            1}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 align-middle">
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className="text-[15px] text-slate-800 font-semibold group-hover:text-blue-700 transition-colors">
                                                                            {
                                                                                grade.subject
                                                                            }
                                                                        </span>
                                                                        <span className="text-[13px] text-slate-500 font-medium">
                                                                            {
                                                                                grade.teacher
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 align-middle text-center">
                                                                    <span className="text-sm font-semibold text-slate-500">
                                                                        {
                                                                            grade.kkm
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 align-middle text-center">
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <span
                                                                            className={cn(
                                                                                'text-sm font-bold',
                                                                                getScoreColor(
                                                                                    grade.ki3Average,
                                                                                    grade.kkm,
                                                                                ),
                                                                            )}
                                                                        >
                                                                            {
                                                                                grade.ki3Average
                                                                            }
                                                                        </span>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={cn(
                                                                                'text-xs',
                                                                                getGradeColor(
                                                                                    grade.ki3Predicate,
                                                                                ),
                                                                            )}
                                                                        >
                                                                            {
                                                                                grade.ki3Predicate
                                                                            }
                                                                        </Badge>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 align-middle text-center">
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <span
                                                                            className={cn(
                                                                                'text-sm font-bold',
                                                                                getScoreColor(
                                                                                    grade.ki4Average,
                                                                                    grade.kkm,
                                                                                ),
                                                                            )}
                                                                        >
                                                                            {
                                                                                grade.ki4Average
                                                                            }
                                                                        </span>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={cn(
                                                                                'text-xs',
                                                                                getGradeColor(
                                                                                    grade.ki4Predicate,
                                                                                ),
                                                                            )}
                                                                        >
                                                                            {
                                                                                grade.ki4Predicate
                                                                            }
                                                                        </Badge>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 align-middle text-center">
                                                                    <span
                                                                        className={cn(
                                                                            'text-base font-bold',
                                                                            getScoreColor(
                                                                                grade.finalAverage,
                                                                                grade.kkm,
                                                                            ),
                                                                        )}
                                                                    >
                                                                        {
                                                                            grade.finalAverage
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 align-middle text-center">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={cn(
                                                                            'inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium border rounded-full',
                                                                            getGradeColor(
                                                                                grade.finalGrade,
                                                                            ),
                                                                        )}
                                                                    >
                                                                        {
                                                                            grade.finalGrade
                                                                        }
                                                                    </Badge>
                                                                </td>
                                                                <td className="p-4 align-middle text-center">
                                                                    {grade.finalAverage >=
                                                                    grade.kkm ? (
                                                                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] font-semibold">
                                                                            Tuntas
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] font-semibold">
                                                                            Belum
                                                                        </Badge>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center gap-1.5 text-xs text-slate-400">
                                            <Info className="h-3.5 w-3.5" />
                                            Klik baris untuk melihat deskripsi
                                            capaian kompetensi dan skor detail
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <AttitudeSection attitude={attitude} />
                        <ExtracurricularSection
                            extracurriculars={extracurriculars}
                        />
                    </TabsContent>

                    {/* Tab: Catatan Rapor */}
                    <TabsContent value="catatan" className="space-y-4 mt-4">
                        <Card className="border-blue-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-100 rounded-xl">
                                        <FileText className="h-5 w-5 text-blue-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-800">
                                            Catatan Rapor
                                        </CardTitle>
                                        <CardDescription className="text-sm text-slate-600">
                                            Semester {displaySemester} TA.{' '}
                                            {activeYear?.year}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {reportCardNotes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-4">
                                            <FileText className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            Belum Ada Catatan Rapor
                                        </h3>
                                        <p className="text-sm text-slate-500 max-w-md mt-1">
                                            Catatan akan tersedia setelah rapor
                                            semester diterbitkan oleh wali kelas
                                        </p>
                                    </div>
                                ) : (
                                    reportCardNotes.map((item, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                'p-4 rounded-xl border bg-linear-to-r from-slate-50/50 to-white',
                                                index === 0
                                                    ? 'border-amber-200'
                                                    : index === 1
                                                      ? 'border-blue-200'
                                                      : index === 2
                                                        ? 'border-emerald-200'
                                                        : 'border-purple-200',
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl shrink-0">
                                                    {item.icon}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-800 mb-1.5 text-sm">
                                                        {item.category}
                                                    </h4>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        {item.note}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab: Statistik */}
                    <TabsContent value="statistik" className="space-y-4 mt-4">
                        <Card className="border-blue-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-100 rounded-xl">
                                        <TrendingUp className="h-5 w-5 text-blue-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-800">
                                            Tren Nilai
                                        </CardTitle>
                                        <CardDescription className="text-sm text-slate-600">
                                            Perkembangan rata-rata nilai dari
                                            semua semester yang tercatat
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200">
                                    <TrendChart history={semesterHistory} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <GradeDetailDialog
                    grade={selectedGrade}
                    onClose={() => setSelectedGrade(null)}
                />
            </div>
        </div>
    );
};
