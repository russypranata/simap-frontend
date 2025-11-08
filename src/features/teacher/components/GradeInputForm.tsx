'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Student, Grade } from '../types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { 
  Award, 
  Calculator, 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Upload,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Star,
  RefreshCw,
  Settings
} from 'lucide-react';

interface GradeInputFormProps {
  students: Student[];
  selectedClass: string;
  selectedSubject: string;
  selectedSemester: string;
  onSave: (gradesData: {
    studentId: string;
    studentName: string;
    class: string;
    subject: string;
    semester: string;
    academicYear: string;
    assignments: Array<{ name: string; score: number; maxScore: number }>;
    midTerm: number;
    finalExam: number;
  }[]) => Promise<void>;
  existingGrades?: Grade[];
  isLoading?: boolean;
}

interface StudentGradeData {
  studentId: string;
  studentName: string;
  assignments: Array<{ name: string; score: number; maxScore: number }>;
  midTerm: number;
  finalExam: number;
  average: number;
  grade: string;
  description: string;
}

export const GradeInputForm: React.FC<GradeInputFormProps> = ({
  students,
  selectedClass,
  selectedSubject,
  selectedSemester,
  onSave,
  existingGrades = [],
  isLoading = false,
}) => {
  const [gradesData, setGradesData] = useState<Record<string, StudentGradeData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [assignmentCount, setAssignmentCount] = useState(3);
  const [showPreview, setShowPreview] = useState(false);

  // Assignment names
  const assignmentNames = [
    'Tugas 1',
    'Tugas 2', 
    'Tugas 3',
    'Tugas 4',
    'Tugas 5',
    'Proyek',
    'Presentasi',
    'Quiz',
    'Partisipasi',
    'Portofolio'
  ];

  // Initialize grades data with existing records or default values
  React.useEffect(() => {
    const initialData: Record<string, StudentGradeData> = {};
    
    students.forEach(student => {
      const existingGrade = existingGrades.find(
        grade => grade.studentId === student.id && 
        grade.subject === selectedSubject && 
        grade.semester === selectedSemester
      );
      
      if (existingGrade) {
        initialData[student.id] = {
          studentId: student.id,
          studentName: student.name,
          assignments: existingGrade.assignments,
          midTerm: existingGrade.midTerm,
          finalExam: existingGrade.finalExam,
          average: existingGrade.average,
          grade: existingGrade.grade,
          description: existingGrade.description,
        };
      } else {
        // Initialize with default assignments
        const defaultAssignments = Array.from({ length: assignmentCount }, (_, i) => ({
          name: assignmentNames[i] || `Tugas ${i + 1}`,
          score: 0,
          maxScore: 100,
        }));
        
        initialData[student.id] = {
          studentId: student.id,
          studentName: student.name,
          assignments: defaultAssignments,
          midTerm: 0,
          finalExam: 0,
          average: 0,
          grade: 'E',
          description: 'Sangat Kurang',
        };
      }
    });
    
    setGradesData(initialData);
  }, [students, existingGrades, selectedSubject, selectedSemester, assignmentCount]);

  const calculateGrade = (average: number): { grade: string; description: string } => {
    if (average >= 90) return { grade: 'A', description: 'Sangat Baik' };
    if (average >= 80) return { grade: 'B', description: 'Baik' };
    if (average >= 70) return { grade: 'C', description: 'Cukup' };
    if (average >= 60) return { grade: 'D', description: 'Kurang' };
    return { grade: 'E', description: 'Sangat Kurang' };
  };

  const calculateAverage = (studentId: string): number => {
    const data = gradesData[studentId];
    if (!data) return 0;
    
    const assignmentTotal = data.assignments.reduce((sum, assignment) => sum + assignment.score, 0);
    const assignmentMax = data.assignments.reduce((sum, assignment) => sum + assignment.maxScore, 0);
    const assignmentAverage = assignmentMax > 0 ? (assignmentTotal / assignmentMax) * 40 : 0; // 40% weight
    const midTermWeight = (data.midTerm / 100) * 30; // 30% weight
    const finalWeight = (data.finalExam / 100) * 30; // 30% weight
    
    return assignmentAverage + midTermWeight + finalWeight;
  };

  const updateStudentGrade = (studentId: string, field: string, value: any) => {
    setGradesData(prev => {
      const updated = { ...prev };
      const studentData = { ...updated[studentId] };
      
      if (field.startsWith('assignment_')) {
        const index = parseInt(field.split('_')[1]);
        const assignmentField = field.split('_')[2]; // score or maxScore
        
        studentData.assignments = [...studentData.assignments];
        if (assignmentField === 'score') {
          studentData.assignments[index] = {
            ...studentData.assignments[index],
            score: Math.max(0, Math.min(100, parseInt(value) || 0))
          };
        } else if (assignmentField === 'maxScore') {
          studentData.assignments[index] = {
            ...studentData.assignments[index],
            maxScore: Math.max(1, parseInt(value) || 100)
          };
        }
      } else if (field === 'midTerm') {
        studentData.midTerm = Math.max(0, Math.min(100, parseInt(value) || 0));
      } else if (field === 'finalExam') {
        studentData.finalExam = Math.max(0, Math.min(100, parseInt(value) || 0));
      }
      
      // Recalculate average and grade
      studentData.average = calculateAverage(studentId);
      const gradeInfo = calculateGrade(studentData.average);
      studentData.grade = gradeInfo.grade;
      studentData.description = gradeInfo.description;
      
      updated[studentId] = studentData;
      return updated;
    });
  };

  const handleAssignmentCountChange = (newCount: number) => {
    setAssignmentCount(newCount);
    
    // Update all students with new assignment count
    setGradesData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(studentId => {
        const studentData = { ...updated[studentId] };
        const currentAssignments = studentData.assignments;
        
        if (newCount > currentAssignments.length) {
          // Add new assignments
          const newAssignments = Array.from({ length: newCount - currentAssignments.length }, (_, i) => ({
            name: assignmentNames[currentAssignments.length + i] || `Tugas ${currentAssignments.length + i + 1}`,
            score: 0,
            maxScore: 100,
          }));
          studentData.assignments = [...currentAssignments, ...newAssignments];
        } else {
          // Remove assignments
          studentData.assignments = currentAssignments.slice(0, newCount);
        }
        
        // Recalculate average
        studentData.average = calculateAverage(studentId);
        const gradeInfo = calculateGrade(studentData.average);
        studentData.grade = gradeInfo.grade;
        studentData.description = gradeInfo.description;
        
        updated[studentId] = studentData;
      });
      return updated;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const gradesArray = Object.values(gradesData).map(data => ({
        studentId: data.studentId,
        studentName: data.studentName,
        class: selectedClass,
        subject: selectedSubject,
        semester: selectedSemester,
        academicYear: '2024/2025',
        assignments: data.assignments,
        midTerm: data.midTerm,
        finalExam: data.finalExam,
      }));

      await onSave(gradesArray);
    } catch (error) {
      console.error('Error saving grades:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-50';
      case 'B': return 'text-blue-600 bg-blue-50';
      case 'C': return 'text-yellow-600 bg-yellow-50';
      case 'D': return 'text-orange-600 bg-orange-50';
      case 'E': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatistics = () => {
    const grades = Object.values(gradesData);
    const gradeDistribution = {
      A: grades.filter(g => g.grade === 'A').length,
      B: grades.filter(g => g.grade === 'B').length,
      C: grades.filter(g => g.grade === 'C').length,
      D: grades.filter(g => g.grade === 'D').length,
      E: grades.filter(g => g.grade === 'E').length,
    };
    
    const averageScore = grades.length > 0 
      ? grades.reduce((sum, g) => sum + g.average, 0) / grades.length 
      : 0;
    
    const highestScore = grades.length > 0 
      ? Math.max(...grades.map(g => g.average)) 
      : 0;
    
    const lowestScore = grades.length > 0 
      ? Math.min(...grades.map(g => g.average)) 
      : 0;
    
    return {
      gradeDistribution,
      averageScore: averageScore.toFixed(1),
      highestScore: highestScore.toFixed(1),
      lowestScore: lowestScore.toFixed(1),
      totalStudents: grades.length,
    };
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Kelas</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}</div>
            <p className="text-xs text-muted-foreground">Skor rata-rata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tertinggi</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highestScore}</div>
            <p className="text-xs text-muted-foreground">Skor tertinggi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terendah</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lowestScore}</div>
            <p className="text-xs text-muted-foreground">Skor terendah</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grade A</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.gradeDistribution.A}</div>
            <p className="text-xs text-muted-foreground">Siswa grade A</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Total siswa</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Konfigurasi Penilaian</span>
          </CardTitle>
          <CardDescription>
            Atur jumlah tugas dan komponen penilaian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignment-count">Jumlah Tugas</Label>
              <Select value={assignmentCount.toString()} onValueChange={(value) => handleAssignmentCountChange(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Tugas</SelectItem>
                  <SelectItem value="2">2 Tugas</SelectItem>
                  <SelectItem value="3">3 Tugas</SelectItem>
                  <SelectItem value="4">4 Tugas</SelectItem>
                  <SelectItem value="5">5 Tugas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Bobot Penilaian</Label>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Tugas: 40%</div>
                <div>UTS: 30%</div>
                <div>UAS: 30%</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Range Nilai</Label>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>A: 90-100</div>
                <div>B: 80-89</div>
                <div>C: 70-79</div>
                <div>D: 60-69</div>
                <div>E: 0-59</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Input Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Input Nilai Siswa</span>
              </CardTitle>
              <CardDescription>
                {selectedClass} • {selectedSubject} • {selectedSemester}
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>{showPreview ? 'Edit' : 'Preview'}</span>
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Nilai'}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-sm w-12">No</th>
                  <th className="text-left p-3 font-medium text-sm min-w-48">Nama Siswa</th>
                  <th className="text-left p-3 font-medium text-sm">NIS</th>
                  {Array.from({ length: assignmentCount }, (_, i) => (
                    <th key={i} className="text-left p-3 font-medium text-sm min-w-32">
                      <div>
                        <div>Tugas {i + 1}</div>
                        <div className="text-xs text-muted-foreground">Max: 100</div>
                      </div>
                    </th>
                  ))}
                  <th className="text-left p-3 font-medium text-sm min-w-24">
                    <div>
                      <div>UTS</div>
                      <div className="text-xs text-muted-foreground">30%</div>
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium text-sm min-w-24">
                    <div>
                      <div>UAS</div>
                      <div className="text-xs text-muted-foreground">30%</div>
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium text-sm min-w-24">Rata-rata</th>
                  <th className="text-left p-3 font-medium text-sm min-w-24">Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const studentData = gradesData[student.id];
                  if (!studentData) return null;
                  
                  return (
                    <tr key={student.id} className="border-b hover:bg-muted/30">
                      <td className="p-3 text-sm">{index + 1}</td>
                      <td className="p-3">
                        <div className="font-medium text-sm">{student.name}</div>
                        <div className="text-xs text-muted-foreground">{student.class}</div>
                      </td>
                      <td className="p-3 text-sm font-mono">{student.nis}</td>
                      
                      {/* Assignment Scores */}
                      {Array.from({ length: assignmentCount }, (_, i) => (
                        <td key={i} className="p-3">
                          {showPreview ? (
                            <div className="text-sm">
                              {studentData.assignments[i]?.score || 0}/{studentData.assignments[i]?.maxScore || 100}
                            </div>
                          ) : (
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={studentData.assignments[i]?.score || 0}
                              onChange={(e) => updateStudentGrade(student.id, `assignment_${i}_score`, e.target.value)}
                              className="w-20 h-8"
                            />
                          )}
                        </td>
                      ))}
                      
                      {/* Mid Term */}
                      <td className="p-3">
                        {showPreview ? (
                          <div className="text-sm font-medium">{studentData.midTerm}</div>
                        ) : (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={studentData.midTerm}
                            onChange={(e) => updateStudentGrade(student.id, 'midTerm', e.target.value)}
                            className="w-20 h-8"
                          />
                        )}
                      </td>
                      
                      {/* Final Exam */}
                      <td className="p-3">
                        {showPreview ? (
                          <div className="text-sm font-medium">{studentData.finalExam}</div>
                        ) : (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={studentData.finalExam}
                            onChange={(e) => updateStudentGrade(student.id, 'finalExam', e.target.value)}
                            className="w-20 h-8"
                          />
                        )}
                      </td>
                      
                      {/* Average */}
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-bold">{studentData.average.toFixed(1)}</div>
                          <Progress value={studentData.average} className="w-12 h-2" />
                        </div>
                      </td>
                      
                      {/* Grade */}
                      <td className="p-3">
                        <Badge className={getGradeColor(studentData.grade)}>
                          {studentData.grade}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {studentData.description}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Grade Distribution Chart */}
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
    </div>
  );
};