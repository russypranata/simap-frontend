'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeachingJournal, TeacherClass } from '@/features/teacher/types/teacher';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ACADEMIC_YEARS, SEMESTERS } from '@/features/teacher/constants/attendance';

interface JournalStatisticsProps {
  journals: TeachingJournal[];
  subjects: string[];
  classes: TeacherClass[];
  initialAcademicYear: string;
  initialSemester: 'Ganjil' | 'Genap';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const JournalStatistics: React.FC<JournalStatisticsProps> = ({
  journals,
  subjects,
  classes,
  initialAcademicYear,
  initialSemester,
}) => {
  // Local state for independent filtering
  const [academicYear, setAcademicYear] = useState(initialAcademicYear);
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>(initialSemester);
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  // Filter journals based on local state
  const filteredJournals = useMemo(() => {
    return journals.filter(journal => {
      const matchesAcademicYear = journal.academicYear === academicYear;
      const matchesSemester = journal.semester === semester;
      const matchesClass = filterClass === 'all' || journal.class === filterClass;
      const matchesSubject = filterSubject === 'all' || journal.subject === filterSubject;

      return matchesAcademicYear && matchesSemester && matchesClass && matchesSubject;
    });
  }, [journals, academicYear, semester, filterClass, filterSubject]);

  // 1. Monthly Trend Data (Teaching Hours)
  const monthlyTrendData = useMemo(() => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const data = months.map(month => ({ name: month, hours: 0, journals: 0 }));

    filteredJournals.forEach(journal => {
      const date = new Date(journal.date);
      const monthIndex = date.getMonth();

      // Calculate hours
      let hours = 0;
      const hourStr = journal.lessonHour;
      if (hourStr) {
        if (hourStr.includes('-')) {
          const [start, end] = hourStr.split('-').map(Number);
          if (!isNaN(start) && !isNaN(end)) hours = end - start + 1;
        } else if (hourStr.includes(',')) {
          hours = hourStr.split(',').length;
        } else {
          hours = 1;
        }
      }

      data[monthIndex].hours += hours;
      data[monthIndex].journals += 1;
    });

    return data;
  }, [filteredJournals]);

  // 2. Method Distribution Data
  const methodDistributionData = useMemo(() => {
    const methodCounts: Record<string, number> = {};

    filteredJournals.forEach(journal => {
      const methods = Array.isArray(journal.teachingMethod)
        ? journal.teachingMethod
        : journal.teachingMethod.split(',').map(m => m.trim());

      methods.forEach(method => {
        if (method) {
          methodCounts[method] = (methodCounts[method] || 0) + 1;
        }
      });
    });

    return Object.entries(methodCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredJournals]);

  // 3. Class Attendance Data
  const classAttendanceData = useMemo(() => {
    const classStats: Record<string, { present: number; total: number }> = {};

    filteredJournals.forEach(journal => {
      if (!classStats[journal.class]) {
        classStats[journal.class] = { present: 0, total: 0 };
      }
      classStats[journal.class].present += journal.attendance.present;
      classStats[journal.class].total += journal.attendance.total;
    });

    return Object.entries(classStats)
      .map(([name, stats]) => ({
        name,
        percentage: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [filteredJournals]);

  const resetFilters = () => {
    setAcademicYear(initialAcademicYear);
    setSemester(initialSemester);
    setFilterClass('all');
    setFilterSubject('all');
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Filter className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Filter Statistik</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Sesuaikan data yang ditampilkan</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs">
              <RefreshCw className="mr-2 h-3 w-3" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tahun Ajaran</Label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Semester</Label>
              <Select value={semester} onValueChange={(v) => setSemester(v as 'Ganjil' | 'Genap')}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Pilih Semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((sem) => (
                    <SelectItem key={sem} value={sem}>
                      {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Kelas</Label>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Semua Kelas" />
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
              <Label className="text-sm font-medium">Mata Pelajaran</Label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Semua Mapel" />
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
        </CardContent>
      </Card>

      {filteredJournals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
          <BarChart3 className="h-12 w-12 mb-4 opacity-20" />
          <p>Belum ada data untuk filter yang dipilih.</p>
          <Button variant="link" onClick={resetFilters}>Reset Filter</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend Chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tren Jam Mengajar
              </CardTitle >
              <CardDescription>
                Total jam pelajaran (JP) per bulan
              </CardDescription>
            </CardHeader >
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value} JP`, 'Jam Mengajar']}
                      labelStyle={{ color: 'black' }}
                    />
                    <Legend />
                    <Bar dataKey="hours" name="Jam Mengajar" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card >

          {/* Method Distribution Chart */}
          < Card >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Distribusi Metode Mengajar
              </CardTitle>
              <CardDescription>
                Proporsi penggunaan metode pembelajaran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={methodDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {methodDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card >

          {/* Class Attendance Chart */}
          < Card >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Rata-rata Kehadiran per Kelas
              </CardTitle>
              <CardDescription>
                Persentase kehadiran siswa berdasarkan kelas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classAttendanceData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} unit="%" />
                    <YAxis dataKey="name" type="category" width={60} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Kehadiran']}
                      cursor={{ fill: 'transparent' }}
                      labelStyle={{ color: 'black' }}
                    />
                    <Bar dataKey="percentage" name="Kehadiran" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card >
        </div >
      )}
    </div>
  );
};