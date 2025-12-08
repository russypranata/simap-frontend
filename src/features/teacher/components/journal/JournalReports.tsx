'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Book,
  Users,
  FileText,
  Download,
  BarChart3,
  PieChart,
  List,
  CalendarDays,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { TeachingJournal } from '@/features/teacher/types/teacher';
import { formatDate } from '@/features/shared/utils/dateFormatter';
import { LESSON_HOURS } from '@/features/teacher/constants/attendance';

interface JournalReportsProps {
  journals: TeachingJournal[];
  classes: any[];
  subjects: string[];
}

export const JournalReports: React.FC<JournalReportsProps> = ({
  journals,
  classes,
  subjects
}) => {
  const [reportType, setReportType] = useState('journal');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'));
  const [selectedLessonHour, setSelectedLessonHour] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    end: formatDate(new Date(), 'yyyy-MM-dd')
  });
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [academicYear, setAcademicYear] = useState('2024/2025'); // Tahun Ajaran
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil'); // Semester

  // Reset all filters to default values
  const resetFilters = () => {
    setReportType('journal');
    setSelectedClass('all');
    setSelectedSubject('all');
    setSelectedDate(formatDate(new Date(), 'yyyy-MM-dd'));
    setSelectedLessonHour('all');
    setDateRange({
      start: formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
      end: formatDate(new Date(), 'yyyy-MM-dd')
    });
    setSelectedWeek('');
    setSelectedMonth(new Date().getMonth() + 1);
    setSelectedYear(new Date().getFullYear());
    setAcademicYear('2024/2025');
    setSemester('Ganjil');
  };

  // Filter journals based on selections
  const filteredJournals = journals.filter(journal => {
    // Apply base filters (Tahun Ajaran and Semester)
    // Note: In a real implementation, you would filter based on the academic year and semester
    // For now, we'll just pass through all journals as we don't have academic year/semester data in the mock data
    // In a real app, you would have academic year and semester properties in your journal data

    // Apply filters based on report type
    switch (reportType) {
      case 'journal':
        // Per Jurnal: Tanggal → Kelas → Mapel → Jam
        return (
          (!selectedDate || journal.date === selectedDate) &&
          (selectedClass === 'all' || journal.class === selectedClass) &&
          (selectedSubject === 'all' || journal.subject === selectedSubject) &&
          (selectedLessonHour === 'all' || journal.lessonHour === selectedLessonHour)
        );

      case 'daily':
        // Rekap Harian: Tanggal → (Kelas optional)
        return (
          (!selectedDate || journal.date === selectedDate) &&
          (selectedClass === 'all' || journal.class === selectedClass)
        );

      case 'weekly':
        // Rekap Mingguan: Minggu/Rentang Tanggal → (Kelas optional)
        const journalDate = new Date(journal.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        const inDateRange = journalDate >= startDate && journalDate <= endDate;
        return (
          inDateRange &&
          (selectedClass === 'all' || journal.class === selectedClass)
        );

      case 'monthly':
        // Rekap Bulanan: Bulan → (Kelas optional)
        const journalDateMonthly = new Date(journal.date);
        return (
          journalDateMonthly.getMonth() + 1 === selectedMonth &&
          (selectedClass === 'all' || journal.class === selectedClass)
        );

      case 'subject':
        // Rekap per Mapel: Mapel → Kelas → Rentang Waktu
        const journalDateSubject = new Date(journal.date);
        const startDateSubject = new Date(dateRange.start);
        const endDateSubject = new Date(dateRange.end);
        const inDateRangeSubject = journalDateSubject >= startDateSubject && journalDateSubject <= endDateSubject;
        return (
          (selectedSubject === 'all' || journal.subject === selectedSubject) &&
          (selectedClass === 'all' || journal.class === selectedClass) &&
          inDateRangeSubject
        );

      case 'class':
        // Rekap per Kelas: Kelas → Rentang Waktu
        const journalDateClass = new Date(journal.date);
        const startDateClass = new Date(dateRange.start);
        const endDateClass = new Date(dateRange.end);
        const inDateRangeClass = journalDateClass >= startDateClass && journalDateClass <= endDateClass;
        return (
          (selectedClass === 'all' || journal.class === selectedClass) &&
          inDateRangeClass
        );

      default:
        return true;
    }
  });

  // Generate report data based on type
  const getReportData = () => {
    switch (reportType) {
      case 'journal':
        // For Laporan Per Jurnal, show individual journal entries
        return filteredJournals.map(journal => ({
          journal,
          date: journal.date,
          class: journal.class,
          subject: journal.subject,
          lessonHour: journal.lessonHour
        }));

      case 'daily':
        // Group by date
        const dailyGrouped: Record<string, TeachingJournal[]> = {};
        filteredJournals.forEach(journal => {
          const dateKey = formatDate(new Date(journal.date), 'yyyy-MM-dd');
          if (!dailyGrouped[dateKey]) {
            dailyGrouped[dateKey] = [];
          }
          dailyGrouped[dateKey].push(journal);
        });

        return Object.entries(dailyGrouped).map(([date, journals]) => ({
          date,
          count: journals.length,
          journals
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      case 'weekly':
        // Group by week
        const weeklyGrouped: Record<string, TeachingJournal[]> = {};
        filteredJournals.forEach(journal => {
          const journalDate = new Date(journal.date);
          const startOfWeek = new Date(journalDate);
          const day = startOfWeek.getDay();
          const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
          startOfWeek.setDate(diff);
          startOfWeek.setHours(0, 0, 0, 0);

          const weekKey = formatDate(startOfWeek, 'yyyy-MM-dd');
          if (!weeklyGrouped[weekKey]) {
            weeklyGrouped[weekKey] = [];
          }
          weeklyGrouped[weekKey].push(journal);
        });

        return Object.entries(weeklyGrouped).map(([weekStart, journals]) => {
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);

          return {
            weekStart,
            weekEnd: formatDate(weekEnd, 'yyyy-MM-dd'),
            count: journals.length,
            journals
          };
        }).sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());

      case 'monthly':
        // Group by month
        const monthlyGrouped: Record<string, TeachingJournal[]> = {};
        filteredJournals.forEach(journal => {
          const date = new Date(journal.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

          if (!monthlyGrouped[monthKey]) {
            monthlyGrouped[monthKey] = [];
          }
          monthlyGrouped[monthKey].push(journal);
        });

        return Object.entries(monthlyGrouped).map(([month, journals]) => {
          const [year, monthNum] = month.split('-');
          const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('id-ID', { month: 'long' });

          return {
            month: `${monthName} ${year}`,
            year: parseInt(year),
            monthNum: parseInt(monthNum),
            count: journals.length,
            journals
          };
        }).sort((a, b) => b.year - a.year || b.monthNum - a.monthNum);

      case 'subject':
        // Group by subject
        const subjectGrouped: Record<string, TeachingJournal[]> = {};
        filteredJournals.forEach(journal => {
          const subject = journal.subject;
          if (!subjectGrouped[subject]) {
            subjectGrouped[subject] = [];
          }
          subjectGrouped[subject].push(journal);
        });

        return Object.entries(subjectGrouped).map(([subject, journals]) => ({
          subject,
          count: journals.length,
          journals
        })).sort((a, b) => b.count - a.count);

      case 'class':
        // Group by class
        const classGrouped: Record<string, TeachingJournal[]> = {};
        filteredJournals.forEach(journal => {
          const className = journal.class;
          if (!classGrouped[className]) {
            classGrouped[className] = [];
          }
          classGrouped[className].push(journal);
        });

        return Object.entries(classGrouped).map(([className, journals]) => ({
          className,
          count: journals.length,
          journals
        })).sort((a, b) => b.count - a.count);

      default:
        return [];
    }
  };

  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    // In a real implementation, this would export the report data
    alert(`Exporting report as ${format.toUpperCase()}`);
  };

  const reportData = getReportData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Laporan Jurnal Mengajar</h2>
          <p className="text-muted-foreground mt-2">
            Analisis dan rekap kegiatan pembelajaran berdasarkan berbagai kriteria
          </p>
        </div>
        <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2 h-10">
          <RotateCcw className="h-4 w-4" />
          Reset Filter
        </Button>
      </div>

      {/* Statistics Cards - Enhanced Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Jurnal</p>
                <p className="text-2xl font-bold text-blue-900">
                  {filteredJournals.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Kelas Terlibat</p>
                <p className="text-2xl font-bold text-green-900">
                  {[...new Set(filteredJournals.map(j => j.class))].length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Mata Pelajaran</p>
                <p className="text-2xl font-bold text-purple-900">
                  {[...new Set(filteredJournals.map(j => j.subject))].length}
                </p>
              </div>
              <Book className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium">Hari Mengajar</p>
                <p className="text-2xl font-bold text-amber-900">
                  {[...new Set(filteredJournals.map(j => new Date(j.date).toDateString()))].length}
                </p>
              </div>
              <CalendarDays className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Filters */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-5 w-5" />
            Filter Laporan
          </CardTitle>
          <CardDescription>
            Sesuaikan filter untuk mendapatkan laporan yang diinginkan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Filters: Tahun Ajaran and Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tahun Ajaran</label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pilih tahun ajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2025/2026">2025/2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Semester</label>
              <Select value={semester} onValueChange={(value) => setSemester(value as 'Ganjil' | 'Genap')}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pilih semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ganjil">Ganjil</SelectItem>
                  <SelectItem value="Genap">Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Report Type Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Jenis Laporan</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Pilih jenis laporan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="journal">Per Jurnal</SelectItem>
                <SelectItem value="daily">Rekap Harian</SelectItem>
                <SelectItem value="weekly">Rekap Mingguan</SelectItem>
                <SelectItem value="monthly">Rekap Bulanan</SelectItem>
                <SelectItem value="subject">Rekap per Mata Pelajaran</SelectItem>
                <SelectItem value="class">Rekap per Kelas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Filters based on Report Type */}
          {reportType === 'journal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tanggal</label>
                <input
                  type="date"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Kelas</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Semua kelas" />
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mata Pelajaran</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Semua mata pelajaran" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Jam Pelajaran</label>
                <Select value={selectedLessonHour} onValueChange={setSelectedLessonHour}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Semua jam pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jam Pelajaran</SelectItem>
                    {LESSON_HOURS.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {reportType === 'daily' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tanggal</label>
                <input
                  type="date"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Kelas (Opsional)</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Semua kelas" />
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
              </div>
            </div>
          )}

          {reportType === 'weekly' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Rentang Tanggal</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    placeholder="Tanggal Mulai"
                  />
                  <input
                    type="date"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    placeholder="Tanggal Akhir"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Kelas (Opsional)</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Semua kelas" />
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
              </div>
            </div>
          )}

          {reportType === 'monthly' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bulan</label>
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Januari</SelectItem>
                    <SelectItem value="2">Februari</SelectItem>
                    <SelectItem value="3">Maret</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">Mei</SelectItem>
                    <SelectItem value="6">Juni</SelectItem>
                    <SelectItem value="7">Juli</SelectItem>
                    <SelectItem value="8">Agustus</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">Oktober</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">Desember</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Kelas (Opsional)</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Semua kelas" />
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
              </div>
            </div>
          )}

          {reportType === 'subject' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mata Pelajaran</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Pilih mata pelajaran" />
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Kelas</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Pilih kelas" />
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Rentang Waktu</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    placeholder="Tanggal Mulai"
                  />
                  <input
                    type="date"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    placeholder="Tanggal Akhir"
                  />
                </div>
              </div>
            </div>
          )}

          {reportType === 'class' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Kelas</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Pilih kelas" />
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Rentang Waktu</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    placeholder="Tanggal Mulai"
                  />
                  <input
                    type="date"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm h-10"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    placeholder="Tanggal Akhir"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Content */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                {reportType === 'journal' && <FileText className="h-5 w-5" />}
                {reportType === 'daily' && <CalendarDays className="h-5 w-5" />}
                {reportType === 'weekly' && <Calendar className="h-5 w-5" />}
                {reportType === 'monthly' && <Calendar className="h-5 w-5" />}
                {reportType === 'subject' && <Book className="h-5 w-5" />}
                {reportType === 'class' && <Users className="h-5 w-5" />}
                {reportType === 'journal' && 'Laporan Per Jurnal'}
                {reportType === 'daily' && 'Rekap Harian'}
                {reportType === 'weekly' && 'Rekap Mingguan'}
                {reportType === 'monthly' && 'Rekap Bulanan'}
                {reportType === 'subject' && 'Rekap per Mata Pelajaran'}
                {reportType === 'class' && 'Rekap per Kelas'}
              </CardTitle>
              <CardDescription className="mt-1">
                Menampilkan {filteredJournals.length} jurnal berdasarkan filter yang dipilih
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('excel')} className="h-8">
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} className="h-8">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')} className="h-8">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            {reportData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-lg">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Tidak Ada Data Tersedia</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Tidak ditemukan jurnal mengajar yang sesuai dengan filter yang Anda pilih.
                </p>
                <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset Filter
                </Button>
              </div>
            ) : (
              <div className="min-w-full">
                {reportType === 'journal' && (
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Tanggal</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Kelas</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Mata Pelajaran</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Jam Pelajaran</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Materi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.map((item: any, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="py-3 px-4">{formatDate(new Date(item.journal.date), 'dd MMM yyyy')}</td>
                          <td className="py-3 px-4">{item.journal.class}</td>
                          <td className="py-3 px-4">{item.journal.subject}</td>
                          <td className="py-3 px-4">{item.journal.lessonHour}</td>
                          <td className="py-3 px-4 max-w-xs truncate">{item.journal.material}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'daily' && (
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Tanggal</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Jumlah Jurnal</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.map((item: any, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{formatDate(new Date(item.date), 'dd MMMM yyyy')}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {item.count}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {item.journals.slice(0, 3).map((journal: TeachingJournal, idx: number) => (
                                <li key={idx} className="truncate max-w-xs">{journal.subject} - {journal.class}</li>
                              ))}
                              {item.journals.length > 3 && (
                                <li className="text-xs text-muted-foreground">+{item.journals.length - 3} jurnal lainnya</li>
                              )}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'weekly' && (
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Minggu</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Jumlah Jurnal</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.map((item: any, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">
                            {formatDate(new Date(item.weekStart), 'dd MMM')} - {formatDate(new Date(item.weekEnd), 'dd MMM yyyy')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              {item.count}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {item.journals.slice(0, 3).map((journal: TeachingJournal, idx: number) => (
                                <li key={idx} className="truncate max-w-xs">{journal.subject} - {journal.class}</li>
                              ))}
                              {item.journals.length > 3 && (
                                <li className="text-xs text-muted-foreground">+{item.journals.length - 3} jurnal lainnya</li>
                              )}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'monthly' && (
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Bulan</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Jumlah Jurnal</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.map((item: any, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{item.month}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                              {item.count}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {item.journals.slice(0, 3).map((journal: TeachingJournal, idx: number) => (
                                <li key={idx} className="truncate max-w-xs">{journal.subject} - {journal.class}</li>
                              ))}
                              {item.journals.length > 3 && (
                                <li className="text-xs text-muted-foreground">+{item.journals.length - 3} jurnal lainnya</li>
                              )}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'subject' && (
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Mata Pelajaran</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Jumlah Jurnal</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.map((item: any, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{item.subject}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                              {item.count}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-muted-foreground">
                              {item.journals.length > 0 && (
                                <span>Terakhir: {formatDate(new Date(item.journals[0].date), 'dd MMM yyyy')}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {reportType === 'class' && (
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Kelas</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Jumlah Jurnal</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.map((item: any, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{item.className}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                              {item.count}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-muted-foreground">
                              {item.journals.length > 0 && (
                                <span>Terakhir: {formatDate(new Date(item.journals[0].date), 'dd MMM yyyy')}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};