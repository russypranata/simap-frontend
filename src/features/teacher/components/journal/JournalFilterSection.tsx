'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Download, FileText, Filter, FilePen } from 'lucide-react';
import { TeacherClass } from '@/features/teacher/types/teacher';
import { ACADEMIC_YEARS, SEMESTERS } from '@/features/teacher/constants/attendance';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface JournalFilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterClass: string;
  setFilterClass: (cls: string) => void;
  filterSubject: string;
  setFilterSubject: (subject: string) => void;
  classes: TeacherClass[];
  subjects: string[];
  onExportData: (format: 'excel' | 'pdf' | 'csv') => void;
  onCreateNew: () => void;
  totalJournals: number;
  filteredCount: number;
  academicYear: string;
  setAcademicYear: (value: string) => void;
  semester: string;
  setSemester: (value: 'Ganjil' | 'Genap') => void;
  dateRange: { from: string; to: string };
  setDateRange: (value: { from: string; to: string }) => void;
  activeDateFilter: 'today' | 'week' | 'month' | null;
  setToday: () => void;
  setThisWeek: () => void;
  setThisMonth: () => void;
}

export const JournalFilterSection: React.FC<JournalFilterSectionProps> = ({
  searchTerm, setSearchTerm,
  filterClass, setFilterClass,
  filterSubject, setFilterSubject,
  classes, subjects,
  onExportData, onCreateNew,
  totalJournals, filteredCount,
  academicYear, setAcademicYear,
  semester, setSemester,
  dateRange, setDateRange,
  activeDateFilter, setToday, setThisWeek, setThisMonth,
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <Filter className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold">Filter Jurnal</CardTitle>
          <CardDescription>Cari dan filter jurnal mengajar berdasarkan kriteria lengkap</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Row 1: Academic Year & Semester */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tahun Ajaran</Label>
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger className="bg-white border-slate-200 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Semester</Label>
          <Select value={semester} onValueChange={(v) => setSemester(v as 'Ganjil' | 'Genap')}>
            <SelectTrigger className="bg-white border-slate-200 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEMESTERS.map((sem) => (
                <SelectItem key={sem} value={sem}>{sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Date Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Filter Cepat</Label>
          <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
            {([
              { key: 'today' as const, label: 'Hari Ini', fn: setToday },
              { key: 'week' as const, label: 'Minggu Ini', fn: setThisWeek },
              { key: 'month' as const, label: 'Bulan Ini', fn: setThisMonth },
            ]).map(({ key, label, fn }, i) => (
              <React.Fragment key={key}>
                {i > 0 && <div className="w-px h-4 bg-border/50 mx-1" />}
                <button
                  onClick={fn}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex-1",
                    activeDateFilter === key
                      ? "bg-blue-800 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Rentang Tanggal</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} className="bg-white border-slate-200" />
            <Input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} className="bg-white border-slate-200" />
          </div>
        </div>
      </div>

      {/* Row 3: Search, Class, Subject */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari mata pelajaran, materi, atau topik..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-full lg:w-40 bg-white border-slate-200 shadow-sm">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-full lg:w-44 bg-white border-slate-200 shadow-sm">
            <SelectValue placeholder="Semua Mapel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Row 4: Info + Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1">
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-medium text-foreground">{filteredCount}</span> dari <span className="font-medium text-foreground">{totalJournals}</span> jurnal
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onExportData('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Ekspor Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExportData('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Ekspor PDF
          </Button>
          <Button className="bg-blue-800 hover:bg-blue-900 text-white" size="sm" onClick={onCreateNew}>
            <FilePen className="h-4 w-4 mr-2" />
            Tambah Jurnal
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
