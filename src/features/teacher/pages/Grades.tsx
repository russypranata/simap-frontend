 
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTeacherData } from '../hooks/useTeacherData';
import { GradeInputForm } from '../components/GradeInputForm';
import { RemediationEnrichment } from '../components/RemediationEnrichment';
import { MultiSelectDropdown } from '../components/MultiSelectDropdown';
import type { Grade as _Grade } from '../types/teacher';
import {
  Award,
  Calculator,
  Users,
  BookOpen,
  Search,
  Filter,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Printer,
  Pencil,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { toast } from 'sonner';
import { PageHeader, StatCard, SkeletonPageHeader, SkeletonStatCard } from '@/features/shared/components';
import { Skeleton } from '@/components/ui/skeleton';

export const Grades: React.FC = () => {
  const {
    loading,
    classes,
    students,
    grades,
    fetchStudents,
    fetchGrades,
    saveGrade,
  } = useTeacherData();

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Ganjil');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [activeTab, setActiveTab] = useState('input');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // List tab filters (independent)
  const [listAcademicYear, setListAcademicYear] = useState('2024/2025');
  const [listSemester, setListSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [listSelectedClass, setListSelectedClass] = useState('all');
  const [listSelectedSubject, setListSelectedSubject] = useState('all');

  // Statistics tab filters (independent)
  const [statsAcademicYear, setStatsAcademicYear] = useState('2025/2026');
  const [statsSemester, setStatsSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [statsSelectedClasses, setStatsSelectedClasses] = useState<string[]>([]);
  const [statsSelectedSubjects, setStatsSelectedSubjects] = useState<string[]>([]);

  // Filtered grades for Daftar Nilai tab
  const filteredGrades = useMemo(() => {
    return grades.filter(grade => {
      // Academic Year filter
      if (grade.academicYear !== listAcademicYear) return false;

      // Semester filter
      if (grade.semester !== listSemester) return false;

      // Class filter
      if (listSelectedClass && listSelectedClass !== 'all') {
        const selectedClassName = classes.find(c => c.id === listSelectedClass)?.name;
        if (selectedClassName && grade.class !== selectedClassName) {
          return false;
        }
      }

      // Subject filter
      if (listSelectedSubject && listSelectedSubject !== 'all' && grade.subject !== listSelectedSubject) {
        return false;
      }

      // Grade filter
      if (filterGrade !== 'all' && grade.grade !== filterGrade) {
        return false;
      }

      // Search term filter
      if (searchTerm && !grade.studentName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [grades, listAcademicYear, listSemester, listSelectedClass, listSelectedSubject, filterGrade, searchTerm, classes]);

  const selectedClassData = classes.find(c => c.id === selectedClass);
  const filteredStudents = selectedClass ? students.filter(s => s.class === selectedClassData?.name) : [];

  // Dynamic subjects based on selected class
  const subjects = selectedClassData && 'subjects' in selectedClassData
    ? (selectedClassData as { subjects: string[] }).subjects
    : [];

  // Get available subjects for stats (from selected classes or all)
  const availableStatsSubjects = useMemo(() => {
    if (statsSelectedClasses.length === 0) {
      return Array.from(new Set(
        classes.flatMap(c => 'subjects' in c ? (c as { subjects: string[] }).subjects : [])
      ));
    }
    const subjectList = statsSelectedClasses.flatMap(classId => {
      const classData = classes.find(c => c.id === classId);
      return classData && 'subjects' in classData ? (classData as { subjects: string[] }).subjects : [];
    });
    return Array.from(new Set(subjectList));
  }, [statsSelectedClasses, classes]);

  // Filtered grades for statistics tab
  const filteredGradesForStats = useMemo(() => {
    return grades.filter(grade => {
      const matchesSemester = grade.semester === statsSemester;
      const matchesClass = statsSelectedClasses.length === 0 ||
        statsSelectedClasses.some(classId => {
          const classData = classes.find(c => c.id === classId);
          return classData?.name === grade.class;
        });
      const matchesSubject = statsSelectedSubjects.length === 0 ||
        statsSelectedSubjects.includes(grade.subject);
      return matchesSemester && matchesClass && matchesSubject;
    });
  }, [grades, statsSemester, statsSelectedClasses, statsSelectedSubjects, classes]);

  // Statistics calculations
  const statsCalculations = useMemo(() => {
    if (filteredGradesForStats.length === 0) {
      return {
        avgScore: 0,
        maxScore: 0,
        minScore: 0,
        remedialCount: 0,
        standardCount: 0,
        enrichmentCount: 0,
        gradeDistribution: { A: 0, B: 0, C: 0, D: 0, E: 0 },
        totalStudents: 0,
      };
    }

    const scores = filteredGradesForStats.map(g => g.average);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    const remedialCount = filteredGradesForStats.filter(g => g.average < 70).length;
    const enrichmentCount = filteredGradesForStats.filter(g => g.average >= 85).length;
    const standardCount = filteredGradesForStats.filter(g => g.average >= 70 && g.average < 85).length;

    const gradeDistribution = {
      A: filteredGradesForStats.filter(g => g.grade === 'A').length,
      B: filteredGradesForStats.filter(g => g.grade === 'B').length,
      C: filteredGradesForStats.filter(g => g.grade === 'C').length,
      D: filteredGradesForStats.filter(g => g.grade === 'D').length,
      E: filteredGradesForStats.filter(g => g.grade === 'E').length,
    };

    return {
      avgScore,
      maxScore,
      minScore,
      remedialCount,
      standardCount,
      enrichmentCount,
      gradeDistribution,
      totalStudents: filteredGradesForStats.length,
    };
  }, [filteredGradesForStats]);

  // Class comparison data for bar chart
  const _classComparisonData = useMemo(() => {
    if (filteredGradesForStats.length === 0) return [];

    const classStats: Record<string, { total: number; count: number }> = {};

    filteredGradesForStats.forEach(grade => {
      if (!classStats[grade.class]) {
        classStats[grade.class] = { total: 0, count: 0 };
      }
      classStats[grade.class].total += grade.average;
      classStats[grade.class].count += 1;
    });

    return Object.entries(classStats)
      .map(([className, stats]) => ({
        class: className,
        average: stats.total / stats.count,
      }))
      .sort((a, b) => b.average - a.average);
  }, [filteredGradesForStats]);

  // Category pie chart data
  const _categoryPieData = useMemo(() => {
    return [
      { name: 'Remedial', value: statsCalculations.remedialCount, color: '#ef4444' },
      { name: 'Standar', value: statsCalculations.standardCount, color: '#3b82f6' },
      { name: 'Pengayaan', value: statsCalculations.enrichmentCount, color: '#22c55e' },
    ].filter(item => item.value > 0);
  }, [statsCalculations]);

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  useEffect(() => {
    // Auto-select the first subject if:
    // 1. No subject is selected
    // 2. The currently selected subject is not in the new list (e.g. after changing class)
    if (subjects.length > 0) {
      if (!selectedSubject || !subjects.includes(selectedSubject)) {
        setSelectedSubject(subjects[0]);
      }
    } else {
      setSelectedSubject('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(subjects), selectedSubject]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }// eslint-disable-next-line react-hooks/exhaustive-deps
, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedSemester) {
      fetchGrades(selectedClass, selectedSubject, selectedSemester);
    }
  }// eslint-disable-next-line react-hooks/exhaustive-deps
, [selectedClass, selectedSubject, selectedSemester]);

  const handleSaveGrades = async (gradesData: {
    studentId: string;
    studentName: string;
    class: string;
    subject: string;
    semester: string;
    academicYear: string;
    assignments: Array<{ name: string; score: number; maxScore: number }>;
    midTerm: number;
    finalExam: number;
  }[]) => {
    try {
      // Save each grade individually
      for (const gradeData of gradesData) {
        await saveGrade({
          ...gradeData,
          semester: gradeData.semester as 'Ganjil' | 'Genap'
        });
      }
      toast.success('Data nilai berhasil disimpan!');
      fetchGrades(selectedClass, selectedSubject, selectedSemester);
    } catch {
      toast.error('Gagal menyimpan data nilai');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (selectedClass) {
        await fetchStudents(selectedClass);
      }
      if (selectedClass && selectedSubject && selectedSemester) {
        await fetchGrades(selectedClass, selectedSubject, selectedSemester);
      }
      toast.success('Data berhasil diperbarui!');
    } catch {
      toast.error('Gagal memperbarui data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportData = (format: 'excel' | 'pdf' | 'csv') => {
    toast.success(`Data nilai berhasil diunduh dalam format ${format.toUpperCase()}!`);
  };

  const handlePrint = () => {
    window.print();
  };



  // Filter grades based on search and grade filter (for Input tab statistics)
  const inputTabFilteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || grade.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  // Calculate statistics
  const getGradeStatistics = () => {
    if (inputTabFilteredGrades.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        gradeDistribution: {
          A: 0, B: 0, C: 0, D: 0, E: 0
        },
        passRate: 0,
      };
    }

    const scores = inputTabFilteredGrades.map(g => g.average);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    const gradeDistribution = {
      A: inputTabFilteredGrades.filter(g => g.grade === 'A').length,
      B: inputTabFilteredGrades.filter(g => g.grade === 'B').length,
      C: inputTabFilteredGrades.filter(g => g.grade === 'C').length,
      D: inputTabFilteredGrades.filter(g => g.grade === 'D').length,
      E: inputTabFilteredGrades.filter(g => g.grade === 'E').length,
    };

    const passCount = inputTabFilteredGrades.filter(g => g.average >= 70).length;
    const passRate = (passCount / inputTabFilteredGrades.length) * 100;

    return {
      totalStudents: inputTabFilteredGrades.length,
      averageScore: averageScore.toFixed(1),
      highestScore: highestScore.toFixed(1),
      lowestScore: lowestScore.toFixed(1),
      gradeDistribution,
      passRate: passRate.toFixed(1),
    };
  };

  const stats = getGradeStatistics();

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-50 border-green-200';
      case 'B': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'D': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'E': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <SkeletonPageHeader withAction />
        {/* Tabs skeleton */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-full w-fit">
          {[4].map((_, i) => (
            <Skeleton key={i} className="h-8 rounded-full" style={{ width: [80, 88, 72, 120][i] }} />
          ))}
        </div>
        {/* Filter card skeleton */}
        <Card className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
        {/* 5 stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        {/* Grade list skeleton */}
        <Card className="animate-pulse">
          <CardContent className="p-4">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-muted">
                  <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-6 w-10 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Nilai"
        titleHighlight="Siswa"
        icon={Award}
        description="Kelola nilai siswa untuk setiap mata pelajaran"
      >
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>

        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Cetak</span>
        </Button>
      </PageHeader>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1 gap-0.5">
          <TabsTrigger
            value="input"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Input Nilai
          </TabsTrigger>
          <TabsTrigger
            value="list"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            Daftar Nilai
          </TabsTrigger>
          <TabsTrigger
            value="statistics"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
          >
            <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
            Statistik
          </TabsTrigger>
          <TabsTrigger
            value="remediation"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 h-8 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground"
          >
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Remedial &amp; Pengayaan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          {/* Filters */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Filter className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">Filter Nilai</CardTitle>
                    <CardDescription className="text-slate-600">
                      Pilih kelas, mata pelajaran, dan semester untuk input nilai
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Tahun Ajaran</Label>
                  <Select defaultValue="2025/2026">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025/2026">2025/2026</SelectItem>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ganjil">Ganjil</SelectItem>
                      <SelectItem value="Genap">Genap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Kelas</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} ({cls.studentCount} siswa)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                    disabled={!selectedClass || subjects.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !selectedClass
                          ? "Pilih kelas terlebih dahulu"
                          : subjects.length === 0
                            ? "Tidak ada mata pelajaran"
                            : subjects.length === 1
                              ? subjects[0]
                              : "Pilih mata pelajaran"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {
                selectedClass && selectedSubject && selectedSemester && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Menampilkan {filteredStudents.length} siswa untuk kelas {selectedClassData?.name} • {selectedSubject} • {selectedSemester}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportData('excel')}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Export Excel</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportData('pdf')}
                        className="flex items-center space-x-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Export PDF</span>
                      </Button>
                    </div>
                  </div>
                )
              }
            </CardContent >
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <StatCard title="Total Siswa" value={stats.totalStudents} subtitle={selectedClassData?.name || 'Pilih kelas'} icon={Users} color="blue" />
            <StatCard title="Rata-rata Kelas" value={stats.averageScore} subtitle="Skor rata-rata kelas" icon={Calculator} color="purple" />
            <StatCard title="Tertinggi" value={stats.highestScore} subtitle="Skor tertinggi" icon={TrendingUp} color="green" />
            <StatCard title="Terendah" value={stats.lowestScore} subtitle="Skor terendah" icon={TrendingDown} color="red" />
            <StatCard title="Tingkat Kelulusan" value={`${stats.passRate}%`} subtitle="Siswa lulus (≥70)" icon={CheckCircle} color="emerald" />
          </div>

          {/* Grade Input Form */}
          {
            selectedClass && selectedSubject && selectedSemester && filteredStudents.length > 0 && (
              <GradeInputForm
                students={filteredStudents}
                selectedClass={selectedClassData?.name || ''}
                selectedSubject={selectedSubject}
                selectedSemester={selectedSemester}
                onSave={handleSaveGrades}
                existingGrades={grades}
                isLoading={loading}
              />
            )
          }

          {/* Empty State */}
          {
            (!selectedClass || !selectedSubject || !selectedSemester) && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Award className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Pilih Filter untuk Memulai
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Silakan pilih kelas, mata pelajaran, dan semester untuk mulai menginput nilai siswa.
                  </p>
                </CardContent>
              </Card>
            )
          }

          {/* No Students State */}
          {
            selectedClass && selectedSubject && selectedSemester && filteredStudents.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Tidak Ada Siswa
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Tidak ada siswa yang ditemukan untuk kelas {selectedClassData?.name}.
                  </p>
                </CardContent>
              </Card>
            )
          }
        </TabsContent >

        <TabsContent value="list" className="space-y-6">
          {/* List Filters */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Filter className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">Filter Daftar Nilai</CardTitle>
                  <CardDescription className="text-slate-600">
                    Filter data nilai berdasarkan kriteria tertentu
                  </CardDescription>
                </div>
              </div>
              {/* Active Filter Badges */}
              {(listAcademicYear !== '2024/2025' || listSemester !== 'Ganjil' || listSelectedClass !== 'all' || listSelectedSubject !== 'all' || filterGrade !== 'all') && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="text-xs">
                    📅 {listAcademicYear}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    📚 Semester {listSemester}
                  </Badge>
                  {listSelectedClass && listSelectedClass !== 'all' && (
                    <Badge variant="outline" className="text-xs">
                      🏫 {classes.find(c => c.id === listSelectedClass)?.name || 'Semua Kelas'}
                    </Badge>
                  )}
                  {listSelectedSubject && listSelectedSubject !== 'all' && (
                    <Badge variant="outline" className="text-xs">
                      📖 {listSelectedSubject}
                    </Badge>
                  )}
                  {filterGrade !== 'all' && (
                    <Badge variant="outline" className="text-xs">
                      🎯 Grade {filterGrade}
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge variant="outline" className="text-xs">
                      🔍 &quot;{searchTerm}&quot;
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Tahun Ajaran</Label>
                  <Select value={listAcademicYear} onValueChange={setListAcademicYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                      <SelectItem value="2023/2024">2023/2024</SelectItem>
                      <SelectItem value="2022/2023">2022/2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={listSemester} onValueChange={(value: 'Ganjil' | 'Genap') => setListSemester(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ganjil">Ganjil</SelectItem>
                      <SelectItem value="Genap">Genap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Kelas</Label>
                  <Select value={listSelectedClass} onValueChange={setListSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} ({cls.studentCount} siswa)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mata Pelajaran</Label>
                  <Select value={listSelectedSubject} onValueChange={setListSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Mapel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Mapel</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search and Grade Filter Row */}
              <div className="flex flex-col lg:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari berdasarkan nama siswa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Select value={filterGrade} onValueChange={setFilterGrade}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Grade</SelectItem>
                      <SelectItem value="A">Grade A</SelectItem>
                      <SelectItem value="B">Grade B</SelectItem>
                      <SelectItem value="C">Grade C</SelectItem>
                      <SelectItem value="D">Grade D</SelectItem>
                      <SelectItem value="E">Grade E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filteredGrades.length} dari {grades.length} nilai
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportData('excel')}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Excel</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportData('pdf')}
                    className="flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Export PDF</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grades List */}
          {filteredGrades.length > 0 ? (
            <Card className="border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">Daftar Nilai Siswa</CardTitle>
                      <CardDescription className="text-slate-600">
                        Daftar nilai siswa yang telah diinput
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Nama Siswa</th>
                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Kelas</th>
                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Mata Pelajaran</th>
                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Semester</th>
                        <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Rata-rata</th>
                        <th className="text-center p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Grade</th>
                        <th className="text-left p-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGrades.map((grade) => (
                        <tr key={grade.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-sm text-slate-800">{grade.studentName}</div>
                          </td>
                          <td className="p-4 text-sm text-slate-600">{grade.class}</td>
                          <td className="p-4 text-sm text-slate-600">{grade.subject}</td>
                          <td className="p-4 text-sm text-slate-600">{grade.semester}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-sm font-bold text-slate-800">{grade.average.toFixed(1)}</span>
                              <div className="w-12 bg-slate-100 rounded-full h-1.5">
                                <div
                                  className="h-1.5 rounded-full bg-blue-500"
                                  style={{ width: `${grade.average}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge className={getGradeColor(grade.grade)}>
                              {grade.grade}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-slate-600">{grade.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Belum Ada Data Nilai
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  {searchTerm || filterGrade !== 'all'
                    ? 'Tidak ada data nilai yang cocok dengan filter yang dipilih.'
                    : 'Belum ada data nilai yang diinput. Mulai dengan menginput nilai pada tab Input Nilai.'}
                </p>
                <Button onClick={() => setActiveTab('input')}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Input Nilai
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          {/* Filters */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Filter className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">Filter Statistik</CardTitle>
                    <CardDescription className="text-slate-600">
                      Pilih periode, kelas, dan mata pelajaran untuk analisis
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Tahun Ajaran</Label>
                  <Select value={statsAcademicYear} onValueChange={setStatsAcademicYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025/2026">2025/2026</SelectItem>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                      <SelectItem value="2023/2024">2023/2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={statsSemester} onValueChange={(value: 'Ganjil' | 'Genap') => setStatsSemester(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ganjil">Ganjil</SelectItem>
                      <SelectItem value="Genap">Genap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Kelas</Label>
                  <MultiSelectDropdown
                    options={classes.map(cls => ({
                      value: cls.id,
                      label: `${cls.name} (${cls.studentCount} siswa)`
                    }))}
                    selected={statsSelectedClasses}
                    onChange={setStatsSelectedClasses}
                    placeholder="Semua Kelas"
                  />
                  {statsSelectedClasses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {statsSelectedClasses.map(classId => {
                        const classData = classes.find(c => c.id === classId);
                        return (
                          <Badge
                            key={classId}
                            className="flex items-center gap-1"
                          >
                            {classData?.name}
                            <button
                              onClick={() => setStatsSelectedClasses(prev => prev.filter(id => id !== classId))}
                              className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Mata Pelajaran</Label>
                  <MultiSelectDropdown
                    options={availableStatsSubjects.map(subject => ({
                      value: subject,
                      label: subject
                    }))}
                    selected={statsSelectedSubjects}
                    onChange={setStatsSelectedSubjects}
                    placeholder="Semua Mapel"
                  />
                  {statsSelectedSubjects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {statsSelectedSubjects.map(subject => (
                        <Badge
                          key={subject}
                          className="flex items-center gap-1"
                        >
                          {subject}
                          <button
                            onClick={() => setStatsSelectedSubjects(prev => prev.filter(s => s !== subject))}
                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {statsCalculations.avgScore.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {statsCalculations.totalStudents > 0
                    ? `Dari ${statsCalculations.totalStudents} siswa${statsSelectedClasses.length > 0 || statsSelectedSubjects.length > 0 ? ' (filtered)' : ''}`
                    : 'Belum ada data'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nilai Tertinggi</CardTitle>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statsCalculations.maxScore.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Prestasi terbaik
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nilai Terendah</CardTitle>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {statsCalculations.minScore.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Perlu perhatian
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Perlu Remedial</CardTitle>
                <div className="p-2 bg-red-100 rounded-lg">
                  <Users className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {statsCalculations.remedialCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Nilai &lt; 70
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Standar</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {statsCalculations.standardCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Nilai 70 - 84
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pengayaan</CardTitle>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statsCalculations.enrichmentCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Nilai ≥ 85
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Grade Distribution */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">Distribusi Nilai</CardTitle>
                    <CardDescription className="text-slate-600">
                      Sebaran nilai siswa per grade{statsCalculations.totalStudents > 0 ? ` (${statsCalculations.totalStudents} siswa)` : ''}
                    </CardDescription>
                  </div>
                </div>
                {/* Filter Context Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    📅 {statsAcademicYear}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    📚 Semester {statsSemester}
                  </Badge>
                  {statsSelectedClasses.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      🏫 {statsSelectedClasses.length === classes.length
                        ? 'Semua Kelas'
                        : statsSelectedClasses.length === 1
                          ? classes.find(c => c.id === statsSelectedClasses[0])?.name
                          : `${statsSelectedClasses.length} Kelas`}
                    </Badge>
                  )}
                  {statsSelectedSubjects.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      📖 {statsSelectedSubjects.length === 1
                        ? statsSelectedSubjects[0]
                        : `${statsSelectedSubjects.length} Mapel`}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                {statsCalculations.totalStudents > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {/* Prepare grade distribution data with percentages and colors */}
                    {(() => {
                      const total = statsCalculations.totalStudents;
                      const gradeDistributionData = [
                        { grade: 'A', count: statsCalculations.gradeDistribution.A, color: '#22c55e' },
                        { grade: 'B', count: statsCalculations.gradeDistribution.B, color: '#3b82f6' },
                        { grade: 'C', count: statsCalculations.gradeDistribution.C, color: '#eab308' },
                        { grade: 'D', count: statsCalculations.gradeDistribution.D, color: '#f97316' },
                        { grade: 'E', count: statsCalculations.gradeDistribution.E, color: '#ef4444' },
                      ].map(item => ({
                        ...item,
                        percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) : '0'
                      }));

                      return (
                        <BarChart
                          data={gradeDistributionData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="grade"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          />
                          <Tooltip
                            cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                                      <p className="font-semibold text-sm">Grade {data.grade}</p>
                                    </div>
                                    <p className="text-2xl font-bold font-mono">
                                      {data.count} <span className="text-xs font-normal text-muted-foreground">siswa</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {data.percentage}% dari total siswa
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar
                            dataKey="count"
                            radius={[8, 8, 0, 0]}
                            animationDuration={1500}
                          >
                            {gradeDistributionData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                strokeWidth={2}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      );
                    })()}
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed rounded-lg border-muted/50 bg-muted/5">
                    <div className="p-4 rounded-full bg-background shadow-sm mb-4 ring-1 ring-muted">
                      <BarChart3 className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Belum Ada Distribusi Nilai
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      {statsSelectedClasses.length === 0 || statsSelectedSubjects.length === 0
                        ? "Silakan pilih kelas dan mata pelajaran di atas untuk melihat analitik grafik"
                        : "Tidak ada data nilai yang ditemukan untuk filter yang dipilih"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remediation" className="space-y-6">
          <RemediationEnrichment
            grades={grades}
            classes={classes}
            onRefresh={handleRefresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};