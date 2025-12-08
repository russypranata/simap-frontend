'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Download, FileText, Plus, Filter } from 'lucide-react';
import { TeacherClass } from '@/features/teacher/types/teacher';

import { ACADEMIC_YEARS, SEMESTERS } from '@/features/teacher/constants/attendance';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';

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
  // New props
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
  searchTerm,
  setSearchTerm,
  filterClass,
  setFilterClass,
  filterSubject,
  setFilterSubject,
  classes,
  subjects,
  onExportData,
  onCreateNew,
  totalJournals,
  filteredCount,
  academicYear,
  setAcademicYear,
  semester,
  setSemester,
  dateRange,
  setDateRange,
  activeDateFilter,
  setToday,
  setThisWeek,
  setThisMonth,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Filter Jurnal
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Cari dan filter jurnal mengajar berdasarkan kriteria lengkap
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Row 1: Academic Year and Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tahun Ajaran</Label>
              <div className="relative">
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                >
                  {ACADEMIC_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Semester</Label>
              <div className="relative">
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as 'Ganjil' | 'Genap')}
                >
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filter Cepat</Label>
              <div className="flex items-center gap-2 h-10">
                <Button
                  variant={activeDateFilter === 'today' ? 'default' : 'outline'}
                  size="sm"
                  className="h-9 text-xs flex-1"
                  onClick={setToday}
                >
                  Hari Ini
                </Button>
                <Button
                  variant={activeDateFilter === 'week' ? 'default' : 'outline'}
                  size="sm"
                  className="h-9 text-xs flex-1"
                  onClick={setThisWeek}
                >
                  Minggu Ini
                </Button>
                <Button
                  variant={activeDateFilter === 'month' ? 'default' : 'outline'}
                  size="sm"
                  className="h-9 text-xs flex-1"
                  onClick={setThisMonth}
                >
                  Bulan Ini
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Rentang Tanggal</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Existing Filters (Search, Class, Subject) */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan mata pelajaran, materi, atau topik..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter mata pelajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Menampilkan {filteredCount} dari {totalJournals} jurnal
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportData('excel')}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Ekspor Excel</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportData('pdf')}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Ekspor PDF</span>
              </Button>
              <Button
                className="flex items-center space-x-2"
                onClick={onCreateNew}
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Jurnal</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};