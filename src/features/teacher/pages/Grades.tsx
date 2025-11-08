'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTeacherData } from '../hooks/useTeacherData';
import { GradeInputForm } from '../components/GradeInputForm';
import { Grade } from '../types/grade';
import { formatDate, formatTime, getRelativeTime } from '@/features/shared/utils/dateFormatter';
import { 
  Award, 
  Calculator, 
  Users, 
  BookOpen, 
  Search, 
  Filter,
  Download,
  Upload,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  RefreshCw,
  Printer,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

export const Grades: React.FC = () => {
  const {
    loading,
    error,
    classes,
    students,
    grades,
    fetchStudents,
    fetchGrades,
    saveGrade,
    clearError,
  } = useTeacherData();

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Ganjil');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [activeTab, setActiveTab] = useState('input');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock subjects
  const subjects = [
    'Matematika',
    'Fisika',
    'Kimia',
    'Biologi',
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'Sejarah',
    'Geografi',
    'Ekonomi',
    'Sosiologi',
  ];

  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  useEffect(() => {
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedSemester) {
      fetchGrades(selectedClass, selectedSubject, selectedSemester);
    }
  }, [selectedClass, selectedSubject, selectedSemester]);

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
        await saveGrade(gradeData);
      }
      toast.success('Data nilai berhasil disimpan!');
      fetchGrades(selectedClass, selectedSubject, selectedSemester);
    } catch (error) {
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
    } catch (error) {
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

  const selectedClassData = classes.find(c => c.id === selectedClass);
  const filteredStudents = selectedClass ? students.filter(s => s.class === selectedClassData?.name) : [];

  // Filter grades based on search and grade filter
  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || grade.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  // Calculate statistics
  const getGradeStatistics = () => {
    if (filteredGrades.length === 0) {
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

    const scores = filteredGrades.map(g => g.average);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    
    const gradeDistribution = {
      A: filteredGrades.filter(g => g.grade === 'A').length,
      B: filteredGrades.filter(g => g.grade === 'B').length,
      C: filteredGrades.filter(g => g.grade === 'C').length,
      D: filteredGrades.filter(g => g.grade === 'D').length,
      E: filteredGrades.filter(g => g.grade === 'E').length,
    };
    
    const passCount = filteredGrades.filter(g => g.average >= 70).length;
    const passRate = (passCount / filteredGrades.length) * 100;

    return {
      totalStudents: filteredGrades.length,
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
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card className="animate-pulse">
          <CardContent className="p-4">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nilai Siswa</h1>
          <p className="text-muted-foreground">
            Kelola nilai siswa untuk setiap mata pelajaran
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
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
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {selectedClassData?.name || 'Pilih kelas'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Kelas</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}</div>
            <p className="text-xs text-muted-foreground">
              Skor rata-rata kelas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tertinggi</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highestScore}</div>
            <p className="text-xs text-muted-foreground">
              Skor tertinggi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terendah</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lowestScore}</div>
            <p className="text-xs text-muted-foreground">
              Skor terendah
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Kelulusan</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.passRate}%</div>
            <p className="text-xs text-muted-foreground">
              Siswa lulus (≥70)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Input Nilai</TabsTrigger>
          <TabsTrigger value="list">Daftar Nilai</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter Nilai</span>
              </CardTitle>
              <CardDescription>
                Pilih kelas, mata pelajaran, dan semester untuk input nilai
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mata pelajaran" />
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
                  <Label>Tahun Ajaran</Label>
                  <Select defaultValue="2024/2025">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                      <SelectItem value="2023/2024">2023/2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedClass && selectedSubject && selectedSemester && (
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
              )}
            </CardContent>
          </Card>

          {/* Grade Input Form */}
          {selectedClass && selectedSubject && selectedSemester && filteredStudents.length > 0 && (
            <GradeInputForm
              students={filteredStudents}
              selectedClass={selectedClassData?.name || ''}
              selectedSubject={selectedSubject}
              selectedSemester={selectedSemester}
              onSave={handleSaveGrades}
              existingGrades={grades}
              isLoading={loading}
            />
          )}

          {/* Empty State */}
          {(!selectedClass || !selectedSubject || !selectedSemester) && (
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
          )}

          {/* No Students State */}
          {selectedClass && selectedSubject && selectedSemester && filteredStudents.length === 0 && (
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
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* List Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari berdasarkan nama siswa atau mata pelajaran..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select value={filterGrade} onValueChange={setFilterGrade}>
                    <SelectTrigger className="w-32">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Daftar Nilai Siswa</span>
                </CardTitle>
                <CardDescription>
                  Daftar nilai siswa yang telah diinput
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium text-sm">Nama Siswa</th>
                        <th className="text-left p-3 font-medium text-sm">Kelas</th>
                        <th className="text-left p-3 font-medium text-sm">Mata Pelajaran</th>
                        <th className="text-left p-3 font-medium text-sm">Semester</th>
                        <th className="text-left p-3 font-medium text-sm">Rata-rata</th>
                        <th className="text-left p-3 font-medium text-sm">Grade</th>
                        <th className="text-left p-3 font-medium text-sm">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGrades.map((grade) => (
                        <tr key={grade.id} className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <div className="font-medium text-sm">{grade.studentName}</div>
                          </td>
                          <td className="p-3 text-sm">{grade.class}</td>
                          <td className="p-3 text-sm">{grade.subject}</td>
                          <td className="p-3 text-sm">{grade.semester}</td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold">{grade.average.toFixed(1)}</span>
                              <div className="w-12 bg-muted rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-primary"
                                  style={{ width: `${grade.average}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={getGradeColor(grade.grade)}>
                              {grade.grade}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">{grade.description}</td>
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
                  <Plus className="h-4 w-4 mr-2" />
                  Input Nilai
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Distribusi Nilai</span>
                </CardTitle>
                <CardDescription>
                  Sebaran nilai siswa per grade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.gradeDistribution).map(([grade, count]) => {
                    const percentage = stats.totalStudents > 0 ? (count / stats.totalStudents) * 100 : 0;
                    const colorClass = getGradeColor(grade);
                    
                    return (
                      <div key={grade} className="flex items-center space-x-4">
                        <div className="w-12 text-center">
                          <Badge className={colorClass}>{grade}</Badge>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-muted rounded-full h-6">
                              <div
                                className={`h-6 rounded-full ${colorClass.split(' ')[1]}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                        <div className="w-12 text-sm text-muted-foreground text-right">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Ringkasan Performa</span>
                </CardTitle>
                <CardDescription>
                  Statistik performa kelas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {stats.averageScore}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rata-rata Nilai Kelas
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">Tertinggi</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mt-1">
                        {stats.highestScore}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium">Terendah</span>
                      </div>
                      <div className="text-2xl font-bold text-red-600 mt-1">
                        {stats.lowestScore}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">Tingkat Kelulusan</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-blue-500"
                          style={{ width: `${stats.passRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {stats.passRate}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stats.totalStudents > 0 && Math.round((parseFloat(stats.passRate) / 100) * stats.totalStudents)} dari {stats.totalStudents} siswa lulus
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};