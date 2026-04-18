/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Download, Calendar, BookOpen, Printer } from 'lucide-react';
import { TeacherClass } from '../../types/teacher';
import { JournalReportPreview } from './JournalReportPreview';

const ACADEMIC_YEARS = ['2023/2024', '2024/2025', '2025/2026'];
const SEMESTERS = ['Ganjil', 'Genap'];

interface JournalReportsProps {
  journals: any[];
  classes: TeacherClass[];
  subjects: string[];
}

export const JournalReports: React.FC<JournalReportsProps> = ({
  journals,
  classes,
  subjects
}) => {
  // Monthly Report State
  const [monthlyClass, setMonthlyClass] = useState<string>('all');
  const [monthlySubject, setMonthlySubject] = useState<string>('all');
  const [monthlyMonth, setMonthlyMonth] = useState<string>(new Date().getMonth().toString());
  const [monthlyYear, setMonthlyYear] = useState<string>(new Date().getFullYear().toString());

  // Semester Report State
  const [semesterClass, setSemesterClass] = useState<string>('all');
  const [semesterSubject, setSemesterSubject] = useState<string>('all');
  const [semesterAcademicYear, setSemesterAcademicYear] = useState<string>(ACADEMIC_YEARS[ACADEMIC_YEARS.length - 1]);
  const [semesterValue, setSemesterValue] = useState<string>(SEMESTERS[0]);

  // Preview State
  const [showPreview, setShowPreview] = useState(false);
  const [previewType, setPreviewType] = useState<'monthly' | 'semester'>('monthly');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewFilters, setPreviewFilters] = useState<any>({});

  const months = [
    { value: '0', label: 'Januari' },
    { value: '1', label: 'Februari' },
    { value: '2', label: 'Maret' },
    { value: '3', label: 'April' },
    { value: '4', label: 'Mei' },
    { value: '5', label: 'Juni' },
    { value: '6', label: 'Juli' },
    { value: '7', label: 'Agustus' },
    { value: '8', label: 'September' },
    { value: '9', label: 'Oktober' },
    { value: '10', label: 'November' },
    { value: '11', label: 'Desember' },
  ];

  const years = [
    new Date().getFullYear().toString(),
    (new Date().getFullYear() - 1).toString(),
    (new Date().getFullYear() - 2).toString(),
  ];

  const filterJournals = (type: 'monthly' | 'semester') => {
    let filtered = [...journals];

    if (type === 'monthly') {
      // Filter by Month & Year
      filtered = filtered.filter(j => {
        const d = new Date(j.date);
        return d.getMonth().toString() === monthlyMonth &&
          d.getFullYear().toString() === monthlyYear;
      });

      // Optional Filters
      if (monthlyClass !== 'all') {
        filtered = filtered.filter(j => j.class === monthlyClass);
      }
      if (monthlySubject !== 'all') {
        filtered = filtered.filter(j => j.subject === monthlySubject);
      }
    } else {
      // Filter by Semester & Academic Year
      filtered = filtered.filter(j =>
        j.semester === semesterValue &&
        j.academicYear === semesterAcademicYear
      );

      // Optional Filters
      if (semesterClass !== 'all') {
        filtered = filtered.filter(j => j.class === semesterClass);
      }
      if (semesterSubject !== 'all') {
        filtered = filtered.filter(j => j.subject === semesterSubject);
      }
    }

    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const handlePreview = (type: 'monthly' | 'semester') => {
    const data = filterJournals(type);

    setPreviewType(type);
    setPreviewData(data);
    setPreviewFilters(type === 'monthly' ? {
      month: monthlyMonth,
      year: monthlyYear,
      classId: monthlyClass,
      subject: monthlySubject
    } : {
      academicYear: semesterAcademicYear,
      semester: semesterValue,
      classId: semesterClass,
      subject: semesterSubject
    });

    setShowPreview(true);
  };

  const handleExport = (type: 'monthly' | 'semester', format: 'pdf' | 'excel', filters: any) => {
    // Simulation of export
    console.log('Exporting journal report:', { type, format, filters });
    alert(`Mengunduh Laporan Jurnal ${type === 'monthly' ? 'Bulanan' : 'Semester'} (${format.toUpperCase()})...`);
  };

  if (showPreview) {
    return (
      <JournalReportPreview
        type={previewType}
        data={previewData}
        classes={classes}
        filters={previewFilters}
        onClose={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Recap Card */}
      <Card className="flex flex-col h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Rekapitulasi Bulanan
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Laporan jurnal mengajar selama satu bulan penuh
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bulan</Label>
              <Select value={monthlyMonth} onValueChange={setMonthlyMonth}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tahun</Label>
              <Select value={monthlyYear} onValueChange={setMonthlyYear}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kelas (Opsional)</Label>
              <Select value={monthlyClass} onValueChange={setMonthlyClass}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Semua Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mata Pelajaran (Opsional)</Label>
              <Select value={monthlySubject} onValueChange={setMonthlySubject}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Semua Mapel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex gap-3 mt-auto">
            <Button className="flex-1 gap-2 bg-blue-800 hover:bg-blue-900 text-white" onClick={() => handlePreview('monthly')}>
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="flex-1 gap-2" variant="outline" onClick={() => handleExport('monthly', 'pdf', { classId: monthlyClass !== 'all' ? monthlyClass : '', className: monthlyClass !== 'all' ? classes.find(c => c.id === monthlyClass)?.name : '', subject: monthlySubject !== 'all' ? monthlySubject : '', month: monthlyMonth, year: monthlyYear })}>
              <Printer className="h-4 w-4" />
              PDF
            </Button>
            <Button className="flex-1 gap-2" variant="outline" onClick={() => handleExport('monthly', 'excel', { classId: monthlyClass !== 'all' ? monthlyClass : '', className: monthlyClass !== 'all' ? classes.find(c => c.id === monthlyClass)?.name : '', subject: monthlySubject !== 'all' ? monthlySubject : '', month: monthlyMonth, year: monthlyYear })}>
              <Download className="h-4 w-4" />
              Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Semester Recap Card */}
      <Card className="flex flex-col h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Rekapitulasi Semester
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Rekapitulasi jurnal mengajar selama satu semester akademik
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tahun Ajaran</Label>
              <Select value={semesterAcademicYear} onValueChange={setSemesterAcademicYear}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Pilih Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_YEARS.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={semesterValue} onValueChange={setSemesterValue}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Pilih Semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kelas (Opsional)</Label>
              <Select value={semesterClass} onValueChange={setSemesterClass}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Semua Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mata Pelajaran (Opsional)</Label>
              <Select value={semesterSubject} onValueChange={setSemesterSubject}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Semua Mapel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex gap-3 mt-auto">
            <Button className="flex-1 gap-2 bg-blue-800 hover:bg-blue-900 text-white" onClick={() => handlePreview('semester')}>
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="flex-1 gap-2" variant="outline" onClick={() => handleExport('semester', 'pdf', { classId: semesterClass !== 'all' ? semesterClass : '', className: semesterClass !== 'all' ? classes.find(c => c.id === semesterClass)?.name : '', subject: semesterSubject !== 'all' ? semesterSubject : '', academicYear: semesterAcademicYear, semester: semesterValue })}>
              <Printer className="h-4 w-4" />
              PDF
            </Button>
            <Button className="flex-1 gap-2" variant="outline" onClick={() => handleExport('semester', 'excel', { classId: semesterClass !== 'all' ? semesterClass : '', className: semesterClass !== 'all' ? classes.find(c => c.id === semesterClass)?.name : '', subject: semesterSubject !== 'all' ? semesterSubject : '', academicYear: semesterAcademicYear, semester: semesterValue })}>
              <Download className="h-4 w-4" />
              Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};