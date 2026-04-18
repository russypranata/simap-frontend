/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Student, Grade, Assignment } from '../types/teacher';
import {
  Award,
  Save,
  Eye,
  BarChart3,
  Settings,
  Cloud,
} from 'lucide-react';
import { teacherApi } from '../services/teacherApi';

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
    assignments: Assignment[];
    midTerm: number;
    finalExam: number;
  }[]) => Promise<void>;
  existingGrades?: Grade[];
  isLoading?: boolean;
}

interface StudentGradeData {
  studentId: string;
  studentName: string;
  assignments: Assignment[];
  midTerm: number;
  finalExam: number;
  average: number;
  grade: string;
  description: string;
  // Moodle fields
  syncStatus?: 'synced' | 'modified' | 'error' | 'manual';
}

interface MoodleSyncDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSync: (config: { courseId: string; mapping: Record<string, string>; overwriteManual: boolean }) => Promise<void>;
}

const MoodleSyncDialog: React.FC<MoodleSyncDialogProps> = ({ isOpen, onClose, onSync }) => {
  const [step, setStep] = useState(1);
  const [courses, setCourses] = useState<{ id: string; fullname: string }[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignments, setAssignments] = useState<{ id: string; name: string }[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [overwriteManual, setOverwriteManual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen && step === 1) {
      loadCourses();
    }
  }, [isOpen, step]);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const data = await teacherApi.fetchMoodleCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseSelect = async () => {
    if (!selectedCourse) return;
    setIsLoading(true);
    try {
      const data = await teacherApi.fetchMoodleAssignments(selectedCourse);
      setAssignments(data);
      setStep(2);
    } catch (error) {
      console.error('Failed to load assignments', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await onSync({ courseId: selectedCourse, mapping, overwriteManual });
      onClose();
      setStep(1);
      setSelectedCourse('');
      setMapping({});
    } catch (error) {
      console.error('Sync failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sinkronisasi Moodle</DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Pilih kursus Moodle untuk disinkronkan.' : 'Petakan tugas Moodle ke kolom nilai SIMAP.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Pilih Kursus Moodle</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kursus..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>{course.fullname}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCourseSelect} disabled={!selectedCourse || isLoading}>
                Lanjut
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              {assignments.map(assignment => (
                <div key={assignment.id} className="grid grid-cols-2 gap-4 items-center">
                  <div className="text-sm font-medium">{assignment.name}</div>
                  <Select
                    value={mapping[assignment.id] || ''}
                    onValueChange={(val) => setMapping(prev => ({ ...prev, [assignment.id]: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Petakan ke..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ignore">Jangan Sinkron</SelectItem>
                      <SelectItem value="assignment_0">Tugas 1</SelectItem>
                      <SelectItem value="assignment_1">Tugas 2</SelectItem>
                      <SelectItem value="assignment_2">Tugas 3</SelectItem>
                      <SelectItem value="midTerm">UTS</SelectItem>
                      <SelectItem value="finalExam">UAS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t">
              <input
                type="checkbox"
                id="overwrite"
                checked={overwriteManual}
                onChange={(e) => setOverwriteManual(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="overwrite" className="text-sm font-normal">
                Timpa data yang sudah diinput manual?
              </Label>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>Kembali</Button>
              <Button onClick={handleSync} disabled={isLoading}>
                {isLoading ? 'Menyinkronkan...' : 'Mulai Sinkronisasi'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

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
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);

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
          syncStatus: existingGrade.syncStatus,
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
          syncStatus: 'manual',
        };
      }
    });

    setGradesData(initialData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            score: Math.max(0, Math.min(100, parseInt(value) || 0)),
            source: 'manual' // Mark as manual edit
          };
          // Update sync status if it was synced
          if (studentData.syncStatus === 'synced') {
            studentData.syncStatus = 'modified';
          }
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

  const handleSyncMoodle = async (config: { courseId: string; mapping: Record<string, string>; overwriteManual: boolean }) => {
    // Simulate sync logic
    await teacherApi.syncMoodleGrades(config);

    // In a real app, we would fetch the updated grades from the backend here.
    // For this mock, we'll update the local state with some dummy synced data.
    setGradesData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(studentId => {
        const student = updated[studentId];

        // Apply mapping
        Object.entries(config.mapping).forEach(([moodleId, targetColumn]) => {
          if (targetColumn === 'ignore') return;

          // Random mock score for demo
          const mockScore = Math.floor(Math.random() * (100 - 70) + 70);

          if (targetColumn.startsWith('assignment_')) {
            const index = parseInt(targetColumn.split('_')[1]);
            if (student.assignments[index]) {
              // Check overwrite policy
              if (student.assignments[index].source === 'manual' && !config.overwriteManual) return;

              student.assignments[index] = {
                ...student.assignments[index],
                score: mockScore,
                source: 'moodle',
                moodleId: moodleId
              };
            }
          } else if (targetColumn === 'midTerm') {
            if (student.syncStatus === 'manual' && !config.overwriteManual) return; // Simplified check
            student.midTerm = mockScore;
          } else if (targetColumn === 'finalExam') {
            if (student.syncStatus === 'manual' && !config.overwriteManual) return;
            student.finalExam = mockScore;
          }
        });

        student.syncStatus = 'synced';
        student.average = calculateAverage(studentId);
        const gradeInfo = calculateGrade(student.average);
        student.grade = gradeInfo.grade;
        student.description = gradeInfo.description;
      });
      return updated;
    });
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


      {/* Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Settings className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Konfigurasi Penilaian</CardTitle>
                <CardDescription>
                  Atur jumlah tugas dan komponen penilaian
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            {/* Top Row: Assignment Count & Weighting Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left: Assignment Control */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assignment-count" className="text-base font-semibold">Jumlah Tugas</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tentukan banyaknya tugas harian yang akan dinilai.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Select value={assignmentCount.toString()} onValueChange={(value) => handleAssignmentCountChange(parseInt(value))}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num} Tugas</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                    Total: {assignmentCount} kolom input
                  </div>
                </div>
              </div>

              {/* Right: Weighting Visual Bar */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Komposisi Nilai</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bobot persentase untuk perhitungan nilai akhir.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex h-4 w-full overflow-hidden rounded-full">
                    <div className="bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: '40%' }}></div>
                    <div className="bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: '30%' }}></div>
                    <div className="bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold" style={{ width: '30%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Tugas (40%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span>UTS (30%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span>UAS (30%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <Label className="text-base font-semibold mb-4 block">Standar Kelulusan (KKM)</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="flex flex-col items-center p-3 rounded-lg border bg-green-50/50 border-green-100">
                  <span className="text-xl font-bold text-green-700">A</span>
                  <span className="text-xs font-medium text-green-600 mt-1">90 - 100</span>
                  <span className="text-[10px] text-green-600/70 mt-0.5">Sangat Baik</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg border bg-blue-50/50 border-blue-100">
                  <span className="text-xl font-bold text-blue-700">B</span>
                  <span className="text-xs font-medium text-blue-600 mt-1">80 - 89</span>
                  <span className="text-[10px] text-blue-600/70 mt-0.5">Baik</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg border bg-yellow-50/50 border-yellow-100">
                  <span className="text-xl font-bold text-yellow-700">C</span>
                  <span className="text-xs font-medium text-yellow-600 mt-1">70 - 79</span>
                  <span className="text-[10px] text-yellow-600/70 mt-0.5">Cukup</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg border bg-orange-50/50 border-orange-100">
                  <span className="text-xl font-bold text-orange-700">D</span>
                  <span className="text-xs font-medium text-orange-600 mt-1">60 - 69</span>
                  <span className="text-[10px] text-orange-600/70 mt-0.5">Kurang</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg border bg-red-50/50 border-red-100">
                  <span className="text-xl font-bold text-red-700">E</span>
                  <span className="text-xs font-medium text-red-600 mt-1">&lt; 60</span>
                  <span className="text-[10px] text-red-600/70 mt-0.5">Sangat Kurang</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Input Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Award className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Input Nilai Siswa</CardTitle>
                <CardDescription>
                  {selectedClass} • {selectedSubject} • {selectedSemester}
                </CardDescription>
              </div>
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
                variant="outline"
                onClick={() => setIsSyncDialogOpen(true)}
                className="flex items-center space-x-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                <Cloud className="h-4 w-4" />
                <span>Sync Moodle</span>
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
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-3 font-semibold text-xs text-slate-600 uppercase tracking-wider w-12">No</th>
                  <th className="text-left p-3 font-semibold text-xs text-slate-600 uppercase tracking-wider min-w-48">Nama Siswa</th>
                  <th className="text-left p-3 font-semibold text-xs text-slate-600 uppercase tracking-wider">NIS</th>
                  {Array.from({ length: assignmentCount }, (_, i) => (
                    <th key={i} className="text-left p-3 font-semibold text-xs text-slate-600 uppercase tracking-wider min-w-32">
                      <div>
                        <div>Tugas {i + 1}</div>
                        <div className="text-xs text-slate-400 normal-case font-normal">Max: 100</div>
                      </div>
                    </th>
                  ))}
                  <th className="text-left p-3 font-semibold text-xs text-slate-600 uppercase tracking-wider min-w-24">
                    <div>
                      <div>UTS</div>
                      <div className="text-xs text-slate-400 normal-case font-normal">30%</div>
                    </div>
                  </th>
                  <th className="text-left p-3 font-semibold text-xs text-slate-600 uppercase tracking-wider min-w-24">
                    <div>
                      <div>UAS</div>
                      <div className="text-xs text-slate-400 normal-case font-normal">30%</div>
                    </div>
                  </th>
                  <th className="text-left p-3 font-semibold text-xs text-slate-600 uppercase tracking-wider min-w-24">Rata-rata</th>
                  <th className="text-left p-3 font-semibold text-xs text-slate-600 uppercase tracking-wider min-w-24">Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const studentData = gradesData[student.id];
                  if (!studentData) return null;

                  return (
                    <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 text-sm text-slate-600">{index + 1}</td>
                      <td className="p-3">
                        <div className="font-semibold text-sm text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-500">{student.class}</div>
                      </td>
                      <td className="p-3 text-sm font-mono text-slate-600">{student.nis}</td>

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
                          {studentData.assignments[i]?.source === 'moodle' && (
                            <div className="absolute top-1 right-1">
                              <Cloud className="h-3 w-3 text-blue-500 opacity-50" />
                            </div>
                          )}
                          {studentData.assignments[i]?.source === 'manual' && studentData.syncStatus === 'modified' && (
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-400 rounded-full" title="Modified manually" />
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Distribusi Nilai</CardTitle>
                <CardDescription>
                  Sebaran nilai siswa per grade • {selectedClass} • {selectedSubject} • {selectedSemester}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.gradeDistribution).map(([grade, count]) => {
              const percentage = stats.totalStudents > 0 ? (count / stats.totalStudents) * 100 : 0;

              // Get darker, more visible colors for the bars
              let barColor = '';
              let badgeClass = '';
              switch (grade) {
                case 'A':
                  barColor = 'bg-green-600';
                  badgeClass = 'text-green-600 bg-green-50 border-green-200';
                  break;
                case 'B':
                  barColor = 'bg-blue-600';
                  badgeClass = 'text-blue-600 bg-blue-50 border-blue-200';
                  break;
                case 'C':
                  barColor = 'bg-yellow-500';
                  badgeClass = 'text-yellow-600 bg-yellow-50 border-yellow-200';
                  break;
                case 'D':
                  barColor = 'bg-orange-500';
                  badgeClass = 'text-orange-600 bg-orange-50 border-orange-200';
                  break;
                case 'E':
                  barColor = 'bg-red-600';
                  badgeClass = 'text-red-600 bg-red-50 border-red-200';
                  break;
                default:
                  barColor = 'bg-gray-600';
                  badgeClass = 'text-gray-600 bg-gray-50 border-gray-200';
              }

              return (
                <div key={grade} className="flex items-center space-x-4">
                  <div className="w-12 text-center">
                    <Badge className={badgeClass}>{grade}</Badge>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-lg h-10 overflow-hidden border border-gray-300">
                        <div
                          className={`h-10 rounded-lg ${barColor} shadow-md transition-all duration-500 flex items-center justify-end pr-3`}
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        >
                          {percentage > 10 && (
                            <span className="text-white font-bold text-sm">{percentage.toFixed(0)}%</span>
                          )}
                        </div>
                      </div>
                      <span className="text-base font-bold w-16 text-right text-foreground">
                        {count} siswa
                      </span>
                    </div>
                  </div>
                  <div className="w-16 text-sm font-medium text-muted-foreground text-right">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>


      <MoodleSyncDialog
        isOpen={isSyncDialogOpen}
        onClose={() => setIsSyncDialogOpen(false)}
        onSync={handleSyncMoodle}
      />
    </div >
  );
};