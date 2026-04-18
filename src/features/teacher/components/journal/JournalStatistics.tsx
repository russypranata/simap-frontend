/* eslint-disable @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars */
'use client';

import React, { useMemo, useState } from 'react';
import { StatCard } from '@/features/shared/components';
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
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Filter,
  RefreshCw,
  BookOpen,
  Clock,
  Users,
  Award,
  Calendar
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ACADEMIC_YEARS, SEMESTERS } from '@/features/teacher/constants/attendance';

interface JournalStatisticsProps {
  journals: TeachingJournal[];
  subjects: string[];
  classes: TeacherClass[];
  initialAcademicYear: string;
  initialSemester: 'Ganjil' | 'Genap';
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const JournalStatistics: React.FC<JournalStatisticsProps> = ({
  journals,
  subjects,
  classes,
  initialAcademicYear,
  initialSemester,
}) => {
  // Local state for independent filtering — synced from global on change
  const [academicYear, setAcademicYear] = useState<string>(initialAcademicYear);
  const [semester, setSemester] = useState<'all' | 'Ganjil' | 'Genap'>(initialSemester);

  // Sync from global filter when parent changes
  React.useEffect(() => {
    setAcademicYear(initialAcademicYear);
    setSemester(initialSemester);
  }, [initialAcademicYear, initialSemester]);
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  // Filter journals based on local state
  const filteredJournals = useMemo(() => {
    return journals.filter(journal => {
      const matchesAcademicYear = academicYear === 'all' || journal.academicYear === academicYear;
      const matchesSemester = semester === 'all' || journal.semester === semester;
      const matchesClass = filterClass === 'all' || journal.class === filterClass;
      const matchesSubject = filterSubject === 'all' || journal.subject === filterSubject;

      return matchesAcademicYear && matchesSemester && matchesClass && matchesSubject;
    });
  }, [journals, academicYear, semester, filterClass, filterSubject]);

  // Helper function to calculate lesson hours
  const calculateHours = (hourStr: string): number => {
    if (!hourStr) return 1;
    if (hourStr.includes('-')) {
      const [start, end] = hourStr.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end)) return end - start + 1;
    } else if (hourStr.includes(',')) {
      return hourStr.split(',').length;
    }
    return 1;
  };

  // 1. Summary Statistics
  const summaryStats = useMemo(() => {
    const totalMeetings = filteredJournals.length;
    const totalHours = filteredJournals.reduce((sum, j) => sum + calculateHours(j.lessonHour), 0);

    // Calculate average attendance
    const totalPresent = filteredJournals.reduce((sum, j) => sum + (j.attendance?.present || 0), 0);
    const totalStudents = filteredJournals.reduce((sum, j) => sum + (j.attendance?.total || 0), 0);
    const avgAttendance = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

    // Find most used teaching method
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

    const mostUsedEntry = Object.entries(methodCounts)
      .sort((a, b) => b[1] - a[1])[0];
    const mostUsedMethod = mostUsedEntry?.[0] || '-';
    const mostUsedMethodCount = mostUsedEntry?.[1] || 0;
    const totalClasses = new Set(filteredJournals.map(j => j.class)).size;

    return {
      totalMeetings,
      totalHours,
      avgAttendance,
      mostUsedMethod,
      mostUsedMethodCount,
      totalClasses,
    };
  }, [filteredJournals]);

  // 2. Monthly Trend Data (Dynamic based on semester selection)
  const monthlyTrendData = useMemo(() => {
    if (semester === 'all') {
      // Show both semesters for comparison (12 months)
      const months = [
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',  // Ganjil
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'   // Genap
      ];

      const data = months.map(month => ({
        name: month,
        jpGanjil: 0,
        jurnalGanjil: 0,
        jpGenap: 0,
        jurnalGenap: 0
      }));

      filteredJournals.forEach(journal => {
        const date = new Date(journal.date);
        const monthIndex = date.getMonth(); // 0-11
        const journalSemester = journal.semester;

        // Map month index to data array index
        let dataIndex = -1;
        if (monthIndex >= 6 && monthIndex <= 11) {
          // Jul-Des (Ganjil) -> index 0-5
          dataIndex = monthIndex - 6;
        } else {
          // Jan-Jun (Genap) -> index 6-11
          dataIndex = monthIndex + 6;
        }

        if (dataIndex !== -1) {
          const hours = calculateHours(journal.lessonHour);
          if (journalSemester === 'Ganjil') {
            data[dataIndex].jpGanjil += hours;
            data[dataIndex].jurnalGanjil += 1;
          } else {
            data[dataIndex].jpGenap += hours;
            data[dataIndex].jurnalGenap += 1;
          }
        }
      });

      return data;
    } else {
      // Show single semester (6 months)
      const monthsInSemester = semester === 'Ganjil'
        ? [
          { index: 6, name: 'Jul' },
          { index: 7, name: 'Agu' },
          { index: 8, name: 'Sep' },
          { index: 9, name: 'Okt' },
          { index: 10, name: 'Nov' },
          { index: 11, name: 'Des' },
        ]
        : [
          { index: 0, name: 'Jan' },
          { index: 1, name: 'Feb' },
          { index: 2, name: 'Mar' },
          { index: 3, name: 'Apr' },
          { index: 4, name: 'Mei' },
          { index: 5, name: 'Jun' },
        ];

      const data = monthsInSemester.map(m => ({
        name: m.name,
        jp: 0,
        jurnal: 0
      }));

      filteredJournals.forEach(journal => {
        const date = new Date(journal.date);
        const monthIndex = date.getMonth();

        const dataIndex = monthsInSemester.findIndex(m => m.index === monthIndex);

        if (dataIndex !== -1) {
          const hours = calculateHours(journal.lessonHour);
          data[dataIndex].jp += hours;
          data[dataIndex].jurnal += 1;
        }
      });

      return data;
    }
  }, [filteredJournals, semester]);

  // 3. Method Distribution Data
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

    const sorted = Object.entries(methodCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    if (sorted.length <= 5) return sorted;

    const top5 = sorted.slice(0, 5);
    const othersValue = sorted.slice(5).reduce((sum, item) => sum + item.value, 0);
    return [...top5, { name: 'Lainnya', value: othersValue }];
  }, [filteredJournals]);

  // 4. Class Attendance Data
  const classAttendanceData = useMemo(() => {
    const classStats: Record<string, { present: number; total: number }> = {};

    filteredJournals.forEach(journal => {
      if (!classStats[journal.class]) {
        classStats[journal.class] = { present: 0, total: 0 };
      }
      classStats[journal.class].present += journal.attendance?.present || 0;
      classStats[journal.class].total += journal.attendance?.total || 0;
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

  const academicYearLabel = academicYear === 'all' ? 'Semua TA' : academicYear;
  const semesterLabel = semester === 'all' ? 'Ganjil & Genap' : semester;

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
                <CardTitle className="text-lg font-semibold text-slate-900">Filter Statistik</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Sesuaikan data yang ditampilkan</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 gap-1.5">
              <RefreshCw className="h-3 w-3" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Tahun Ajaran</Label>
              <Select value={academicYearLabel} onValueChange={setAcademicYear}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun Ajaran</SelectItem>
                  {ACADEMIC_YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Semester</Label>
              <Select value={semester} onValueChange={(v) => setSemester(v as 'all' | 'Ganjil' | 'Genap')}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                  <SelectValue placeholder="Pilih Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ganjil">Ganjil</SelectItem>
                  <SelectItem value="Genap">Genap</SelectItem>
                  <SelectItem value="all">Ganjil dan Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Kelas</Label>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
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
              <Label className="text-sm font-semibold text-slate-700">Mata Pelajaran</Label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 [&>span]:truncate [&>span]:block [&>span]:text-ellipsis [&>span]:overflow-hidden">
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
          <p className="text-lg font-medium mb-2">Belum ada data statistik untuk periode ini</p>
          <p className="text-sm mb-4">Silakan ubah filter atau tambahkan jurnal baru</p>
          <Button variant="outline" onClick={resetFilters}>Reset Filter</Button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Pertemuan" value={summaryStats.totalMeetings} subtitle="Jurnal mengajar" icon={BookOpen} color="blue" />
            <StatCard title="Total JP Mengajar" value={summaryStats.totalHours} subtitle="Jam pelajaran" icon={Clock} color="green" />
            <StatCard title="Rata-rata Kehadiran" value={`${summaryStats.avgAttendance}%`} subtitle="Kehadiran siswa" icon={Users} color="purple" />
            <StatCard title="Metode Terfavorit" value={summaryStats.mostUsedMethodCount} subtitle={summaryStats.mostUsedMethod} icon={Award} color="amber" />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Activity Chart */}
            <Card className="lg:col-span-2 outline-none focus:outline-none" tabIndex={-1}>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold">
                      {semester === 'all' ? 'Tren Bulanan (Perbandingan Semester)' : 'Tren Bulanan per Semester'}
                    </CardTitle>
                    <CardDescription>
                      {semester === 'all'
                        ? 'Perbandingan aktivitas mengajar antara semester Ganjil dan Genap'
                        : 'Jumlah JP dan jurnal yang dibuat setiap bulan'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {academicYearLabel}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {semesterLabel}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {filterClass === 'all' ? 'Semua Kelas' : filterClass}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {filterSubject === 'all' ? 'Semua Mapel' : filterSubject}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="[&_*]:outline-none [&_*]:focus:outline-none">
                <div className="h-[300px] w-full outline-none">
                  <ResponsiveContainer width="100%" height="100%">
                    {semester === 'all' ? (
                      <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="jpGanjil"
                          name="JP Ganjil"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="jpGenap"
                          name="JP Genap"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ fill: '#10b981', r: 4 }}
                        />
                      </LineChart>
                    ) : (
                      <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="jp"
                          name="Jam Pelajaran"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', r: 4 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="jurnal"
                          name="Jumlah Jurnal"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ fill: '#10b981', r: 4 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Method Distribution Chart */}
            <Card className="outline-none focus:outline-none" tabIndex={-1}>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <PieChartIcon className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold">Distribusi Metode Mengajar</CardTitle>
                    <CardDescription>Proporsi penggunaan metode pembelajaran</CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {academicYearLabel}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {semesterLabel}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {filterClass === 'all' ? 'Semua Kelas' : filterClass}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {filterSubject === 'all' ? 'Semua Mapel' : filterSubject}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="[&_*]:outline-none [&_*]:focus:outline-none">
                {methodDistributionData.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Belum ada data metode mengajar</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] w-full outline-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={methodDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={90}
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
                )}
              </CardContent>
            </Card >

            {/* Class Attendance Chart */}
            <Card className="outline-none focus:outline-none" tabIndex={-1}>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold">Rata-rata Kehadiran per Kelas</CardTitle>
                    <CardDescription>Persentase kehadiran siswa berdasarkan kelas</CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {academicYearLabel}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {semesterLabel}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {filterClass === 'all' ? 'Semua Kelas' : filterClass}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs font-normal">
                    {filterSubject === 'all' ? 'Semua Mapel' : filterSubject}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="[&_*]:outline-none [&_*]:focus:outline-none">
                {classAttendanceData.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Belum ada data kehadiran</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] w-full -ml-2 outline-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classAttendanceData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} unit="%" />
                        <YAxis dataKey="name" type="category" width={70} />
                        <Tooltip
                          formatter={(value: number) => [`${value}%`, 'Kehadiran']}
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        />
                        <Bar dataKey="percentage" name="Kehadiran" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card >
          </div >

        </>
      )}
    </div >
  );
};
