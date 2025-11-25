'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeacherData } from '@/features/teacher/hooks/useTeacherData';
import {
  ScheduleStatsCards,
  ScheduleFilterSection,
  WeeklyScheduleGrid,
  DailyScheduleCalendar,
  ScheduleStatistics,
} from '@/features/teacher/components/schedule';
import { Schedule } from '@/features/teacher/types/teacher';
import {
  Calendar,
  Grid3x3,
  BarChart3,
  Printer,
  RefreshCw,
  Search,
  FileText,
  ClipboardCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Mock subjects for filtering
const SUBJECTS = [
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

export const SchedulePage: React.FC = () => {
  const router = useRouter();
  const {
    loading,
    error,
    schedule,
    classes,
    teachingJournals,
    attendanceRecords,
    fetchSchedule,
    clearError,
  } = useTeacherData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [activeTab, setActiveTab] = useState('weekly');

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleRefresh = () => {
    fetchSchedule();
    toast.success('Jadwal berhasil diperbarui!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    toast.success('Jadwal berhasil diexport!');
  };

  const handleJournalClick = (scheduleItem: Schedule) => {
    // Navigate to journal page with pre-filled data
    const params = new URLSearchParams({
      class: scheduleItem.class,
      subject: scheduleItem.subject
    });
    router.push(`/journal/new?${params.toString()}`);
  };

  const handleAttendanceClick = (scheduleItem: Schedule) => {
    // Navigate to attendance page with pre-filled data
    const params = new URLSearchParams({
      class: scheduleItem.class,
      subject: scheduleItem.subject
    });
    router.push(`/attendance?${params.toString()}`);
  };

  // Filter schedules
  const filteredSchedules = schedule.filter((item) => {
    const matchesSearch =
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || item.class === filterClass;
    const matchesSubject = filterSubject === 'all' || item.subject === filterSubject;
    return matchesSearch && matchesClass && matchesSubject;
  });

  // Calculate statistics
  const getScheduleStats = () => {
    const today = new Date();
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const todayName = dayNames[today.getDay()];

    const todaySchedule = schedule.filter((s) => s.day === todayName).length;
    const weeklySchedule = schedule.length;
    const totalHours = schedule.length * 0.75; // Assuming 45 minutes per session
    const uniqueSubjects = new Set(schedule.map((s) => s.subject)).size;

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      todaySchedule,
      weeklySchedule,
      totalSubjects: uniqueSubjects,
    };
  };

  const stats = getScheduleStats();

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
              <CardContent className="p-4">
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Schedule Grid Skeleton */}
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="h-64 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold text-foreground">Jadwal Mengajar</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau jadwal mengajar Anda dengan mudah
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
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
      <ScheduleStatsCards stats={stats} />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <ScheduleFilterSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterClass={filterClass}
            setFilterClass={setFilterClass}
            filterSubject={filterSubject}
            setFilterSubject={setFilterSubject}
            classes={classes}
            subjects={SUBJECTS}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly" className="flex items-center space-x-2">
            <Grid3x3 className="h-4 w-4" />
            <span>Tampilan Mingguan</span>
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Tampilan Harian</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Statistik</span>
          </TabsTrigger>
        </TabsList>

        {/* Weekly View */}
        <TabsContent value="weekly" className="space-y-6">
          <WeeklyScheduleGrid
            schedules={filteredSchedules}
          />
        </TabsContent>

        {/* Daily View */}
        <TabsContent value="daily" className="space-y-6">
          <DailyScheduleCalendar
            schedules={filteredSchedules}
            journals={teachingJournals}
            attendanceRecords={attendanceRecords}
            onJournalClick={handleJournalClick}
            onAttendanceClick={handleAttendanceClick}
          />
        </TabsContent>

        {/* Statistics View */}
        <TabsContent value="statistics" className="space-y-6">
          <ScheduleStatistics schedules={filteredSchedules} />
        </TabsContent>
      </Tabs>

      {/* Additional Information Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Informasi Jadwal</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fitur Tampilan */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <h4 className="font-semibold text-sm">Fitur Tampilan</h4>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Grid3x3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Mingguan</p>
                    <p className="text-xs text-muted-foreground">Lihat semua jadwal dalam satu minggu</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Harian</p>
                    <p className="text-xs text-muted-foreground">Fokus pada jadwal hari tertentu</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <BarChart3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Statistik</p>
                    <p className="text-xs text-muted-foreground">Analisis distribusi jadwal mengajar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Aksi Cepat */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <h4 className="font-semibold text-sm">Aksi Cepat</h4>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Jurnal</p>
                    <p className="text-xs text-muted-foreground">Langsung isi jurnal mengajar dari jadwal</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <ClipboardCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Presensi</p>
                    <p className="text-xs text-muted-foreground">Catat kehadiran siswa dengan cepat</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Search className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Filter</p>
                    <p className="text-xs text-muted-foreground">Cari jadwal berdasarkan kelas atau mapel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
