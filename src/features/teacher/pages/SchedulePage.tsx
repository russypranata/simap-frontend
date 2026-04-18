 
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeacherData } from '@/features/teacher/hooks/useTeacherData';
import {
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
import { PageHeader, StatCard, SkeletonPageHeader, SkeletonStatCard } from '@/features/shared/components';

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
    schedule,
    classes,
    teachingJournals,
    attendanceRecords,
    fetchSchedule,
  } = useTeacherData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [activeTab, setActiveTab] = useState('weekly');

  useEffect(() => {
    fetchSchedule();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="space-y-6 animate-in fade-in duration-500">
        <SkeletonPageHeader withAction />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
        <Card><CardContent className="p-6"><div className="h-64 bg-slate-100 rounded animate-pulse" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal"
        titleHighlight="Mengajar"
        icon={Calendar}
        description="Kelola dan pantau jadwal mengajar Anda dengan mudah"
      >
        <Button variant="outline" onClick={handleRefresh} className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
        <Button variant="outline" onClick={handlePrint} className="flex items-center space-x-2">
          <Printer className="h-4 w-4" />
          <span>Cetak</span>
        </Button>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Jam Mengajar" value={stats.totalHours} subtitle="Jam per minggu" icon={Calendar} color="blue" />
        <StatCard title="Jadwal Hari Ini" value={stats.todaySchedule} subtitle="Sesi hari ini" icon={Calendar} color="green" />
        <StatCard title="Jadwal Minggu Ini" value={stats.weeklySchedule} subtitle="Total sesi seminggu" icon={BarChart3} color="purple" />
        <StatCard title="Mata Pelajaran" value={stats.totalSubjects} subtitle="Mapel yang diajar" icon={Grid3x3} color="amber" />
      </div>

      {/* Filters */}
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

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted/50 p-1.5 gap-1">
          <TabsTrigger value="weekly" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
            <Grid3x3 className="h-4 w-4 mr-2" />
            Tampilan Mingguan
          </TabsTrigger>
          <TabsTrigger value="daily" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Tampilan Harian
          </TabsTrigger>
          <TabsTrigger value="statistics" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 h-9 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-800 data-[state=active]:text-white data-[state=inactive]:text-muted-foreground">
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistik
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
      <Card className="border-slate-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Informasi Jadwal</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fitur Tampilan */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <h4 className="font-semibold text-sm">Fitur Tampilan</h4>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50/50 border border-slate-100 hover:bg-slate-100/50 transition-colors">
                  <Grid3x3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">Mingguan</p>
                    <p className="text-xs text-muted-foreground">Lihat semua jadwal dalam satu minggu</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50/50 border border-slate-100 hover:bg-slate-100/50 transition-colors">
                  <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">Harian</p>
                    <p className="text-xs text-muted-foreground">Fokus pada jadwal hari tertentu</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50/50 border border-slate-100 hover:bg-slate-100/50 transition-colors">
                  <BarChart3 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">Statistik</p>
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
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50/50 border border-slate-100 hover:bg-slate-100/50 transition-colors">
                  <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">Jurnal</p>
                    <p className="text-xs text-muted-foreground">Langsung isi jurnal mengajar dari jadwal</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50/50 border border-slate-100 hover:bg-slate-100/50 transition-colors">
                  <ClipboardCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">Presensi</p>
                    <p className="text-xs text-muted-foreground">Catat kehadiran siswa dengan cepat</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50/50 border border-slate-100 hover:bg-slate-100/50 transition-colors">
                  <Search className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">Filter</p>
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
